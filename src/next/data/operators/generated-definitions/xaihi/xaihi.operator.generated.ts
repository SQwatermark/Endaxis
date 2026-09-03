/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const xaihiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0011_seraph_attack1',
    timelineBlockFrames: 13,
    naturalDurationFrames: 117,
    exclusiveFrame: 14,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 13, endFrame: 25, sourceSkillIds: ['chr_0011_seraph_attack2'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack1.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack1_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0011_seraph_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
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
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
    display_atk_scale: [
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
  },
);

export const xaihiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0011_seraph_attack2',
    timelineBlockFrames: 17,
    naturalDurationFrames: 121,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 28,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 17, endFrame: 28, sourceSkillIds: ['chr_0011_seraph_attack3'] },
      ],
    },
    costFrame: 7,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[0]:chr_0011_seraph_attack2_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0011_seraph_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
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
    display_atk_scale: [
      0.159999996423721, 0.180000007152557, 0.189999997615814, 0.209999993443489, 0.219999998807907,
      0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535, 0.310000002384186,
      0.330000013113022, 0.360000014305115,
    ],
  },
);

export const xaihiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0011_seraph_attack3',
    timelineBlockFrames: 14,
    naturalDurationFrames: 125,
    exclusiveFrame: 14,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 25, sourceSkillIds: ['chr_0011_seraph_attack4'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3_true',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack3.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack3_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0011_seraph_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      0.209999993443489, 0.230000004172325, 0.25, 0.270000010728836, 0.28999999165535,
      0.319999992847443, 0.340000003576279, 0.360000014305115, 0.379999995231628, 0.400000005960464,
      0.439999997615814, 0.469999998807907,
    ],
    display_atk_scale: [
      0.209999993443489, 0.230000004172325, 0.25, 0.270000010728836, 0.28999999165535,
      0.319999992847443, 0.340000003576279, 0.360000014305115, 0.379999995231628, 0.400000005960464,
      0.439999997615814, 0.469999998807907,
    ],
  },
);

export const xaihiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0011_seraph_attack4',
    timelineBlockFrames: 21,
    naturalDurationFrames: 128,
    exclusiveFrame: 24,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 33,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 33, sourceSkillIds: ['chr_0011_seraph_attack5'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[3]._sequenceActionData.actionData[0]:chr_0011_seraph_attack4_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0011_seraph_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:projectile_chr_0011_seraph_normal_attack3_02',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[0]:chr_0011_seraph_attack4_projhit',
                { atb: 0, atk_scale: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0011_seraph_attack4:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
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
      0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489, 0.230000004172325,
      0.25, 0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.340000003576279, 0.370000004768372,
    ],
    display_atk_scale: [
      0.330000013113022, 0.360000014305115, 0.400000005960464, 0.430000007152557, 0.46000000834465,
      0.5, 0.529999971389771, 0.560000002384186, 0.589999973773956, 0.639999985694885,
      0.680000007152557, 0.740000009536743,
    ],
  },
);

export const xaihiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0011_seraph_attack5',
    timelineBlockFrames: 33,
    naturalDurationFrames: 137,
    exclusiveFrame: 33,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0011_seraph_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 33, endFrame: 40, sourceSkillIds: ['chr_0011_seraph_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0011_seraph_attack5:/scheduledSequences/0/sequence/steps/0',
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
        19,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 15,
    atk_scale: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
    poise: 15,
    display_atk_scale: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
  },
);

export const xaihiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0011_seraph_power_attack',
    timelineBlockFrames: 34,
    naturalDurationFrames: 160,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 34,
          endFrame: 53,
          sourceSkillIds: ['chr_0011_seraph_normal_skill', 'chr_0011_seraph_combo_skill'],
        },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        34,
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
        35,
      ),
      scheduled(
        32,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0011_seraph_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        32,
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
        34,
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
    input_angle: 0,
  },
);

export const xaihiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0011_seraph_plunging_attack_end',
    timelineBlockFrames: 13,
    naturalDurationFrames: 116,
    exclusiveFrame: 12,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0011_seraph_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const xaihiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0011_seraph_normal_skill',
    timelineBlockFrames: 31,
    naturalDurationFrames: 145,
    exclusiveFrame: 30,
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
        6,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
                reason: 'other',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_spawnball',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              heal_value: { kind: 'blackboard', key: 'heal_value' },
              buff_duration: { kind: 'blackboard', key: 'buff_duration' },
              will_up: { kind: 'blackboard', key: 'will_up' },
            },
          }),
        ),
        8,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: 0,
    atk_scale: 0.1,
    atk_up: [
      0.0900000035762787, 0.0900000035762787, 0.0900000035762787, 0.0900000035762787,
      0.0900000035762787, 0.109999999403954, 0.109999999403954, 0.109999999403954,
      0.129999995231628, 0.129999995231628, 0.129999995231628, 0.150000005960464,
    ],
    buff_duration: 25,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 20,
    heal_value: [
      144, 172.800003051758, 201.600006103516, 230.399993896484, 244.800003051758, 259.200012207031,
      273.600006103516, 288, 302.399993896484, 309.600006103516, 316.799987792969, 324,
    ],
    input_angle: 0,
    potential_1: 0,
    select_radius: 10,
    usp: 0,
    will_up: [
      0.335999995470047, 0.400000005960464, 0.469999998807907, 0.540000021457672, 0.569999992847443,
      0.600000023841858, 0.639999985694885, 0.670000016689301, 0.709999978542328, 0.720000028610229,
      0.740000009536743, 0.759999990463257,
    ],
  },
);

export const xaihiComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0011_seraph_combo_skill',
    timelineBlockFrames: 25,
    naturalDurationFrames: 122,
    exclusiveFrame: 42,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 25, endFrame: 60, sourceSkillIds: ['chr_0011_seraph_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchr',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        24,
      ),
      scheduled(
        24,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ball',
            abilityEntityIds: [
              'abilityentity_chr_0011_seraph_normal_skill',
              'abilityentity_chr_0011_seraph_normal_skill_02',
              'abilityentity_chr_0011_seraph_normal_skill_03',
              'abilityentity_chr_0011_seraph_normal_skill_buff',
              'abilityentity_chr_0027_tangtang_normal_skill_02_02',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'ball',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              forEachContextTarget(
                'ball',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0011_seraph_atk_buff_normal_skill'],
                reason: 'other',
              }),
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].succeedActions.actionData[0]:projectile_chr_0011_seraph_combo_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].succeedActions.actionData[0]:chr_0011_seraph_combo_skill_projhit',
                    {
                      atk_scale: 0,
                      cryst_up: 0,
                      duration: 0,
                      exist_talent_1: 0,
                      poise: 0,
                      potential_3: 0,
                      usp: 0,
                    },
                    true,
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'exist_talent_1' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'entityTagMatch',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              tags: [
                                'Skill/Character/Common/SpellInflict/CrystInflict',
                                'Skill/Character/Common/SpellStatus/Frozen',
                              ],
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0011_seraph_talent_1_crystup',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  cryst_up: { kind: 'blackboard', key: 'cryst_up' },
                                  duration: { kind: 'blackboard', key: 'duration' },
                                },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0011_seraph_combo_skill:/scheduledSequences/1/sequence/steps/1/whenTrue/steps/2/body/steps/0/body/steps/2',
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
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
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
              forEachContextTarget(
                'ball',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0011_seraph_atk_buff_normal_skill'],
                reason: 'other',
              }),
              withActionBlackboardScope(
                'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].failActions.actionData[0]:projectile_chr_0011_seraph_combo_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0011_seraph_combo_skill.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1].failActions.actionData[0]:chr_0011_seraph_combo_skill_projhit',
                    {
                      atk_scale: 0,
                      cryst_up: 0,
                      duration: 0,
                      exist_talent_1: 0,
                      poise: 0,
                      potential_3: 0,
                      usp: 0,
                    },
                    true,
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'exist_talent_1' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'entityTagMatch',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              tags: [
                                'Skill/Character/Common/SpellInflict/CrystInflict',
                                'Skill/Character/Common/SpellStatus/Frozen',
                              ],
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0011_seraph_talent_1_crystup',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  cryst_up: { kind: 'blackboard', key: 'cryst_up' },
                                  duration: { kind: 'blackboard', key: 'duration' },
                                },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['comboSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        },
                        'chr_0011_seraph_combo_skill:/scheduledSequences/1/sequence/steps/1/whenFalse/steps/2/body/steps/0/body/steps/2',
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
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
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
        25,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0011_seraph_combo_skill_listener',
              'buff_chr_0011_seraph_normal_skill_heal',
            ],
            reason: 'other',
          }),
        ),
        1,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.900000035762787 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
            influenceSkillCooldownSeconds: { kind: 'constant', value: 0.400000005960464 },
          }),
        ),
        24,
      ),
    ],
    cooldownFrames: [240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 210],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      2, 2.20000004768372, 2.40000009536743, 2.59999990463257, 2.79999995231628, 3,
      3.20000004768372, 3.40000009536743, 3.59999990463257, 3.84999990463257, 4.15000009536743, 4.5,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    cryst_up: 0,
    duration: 0,
    exist_talent_1: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    potential_3: 0,
    select_radius: 4,
    usp: 10,
  },
);

export const xaihiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0011_seraph_ultimate_skill',
    timelineBlockFrames: 67,
    naturalDurationFrames: 183,
    exclusiveFrame: 80,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 67,
          endFrame: 100,
          sourceSkillIds: ['chr_0011_seraph_normal_skill', 'chr_0011_seraph_combo_skill'],
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
        45,
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
        80,
      ),
      scheduled(
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_atk_buff',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              duration: { kind: 'blackboard', key: 'duration' },
              wisd_up: { kind: 'blackboard', key: 'wisd_up' },
              wisd_max: { kind: 'blackboard', key: 'wisd_max' },
            },
          }),
        ),
        61,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: 1.5,
    atk_up: [
      0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046, 0.150000005960464,
      0.159999996423721, 0.170000001788139, 0.180000007152557, 0.189999997615814, 0.209999993443489,
      0.219999998807907, 0.239999994635582,
    ],
    duration: 12,
    exist_talent_2: 0,
    heal_value: 0,
    radius: 1,
    wisd_max: [
      0.300000011920929, 0.300000011920929, 0.300000011920929, 0.300000011920929, 0.300000011920929,
      0.300000011920929, 0.300000011920929, 0.300000011920929, 0.300000011920929, 0.300000011920929,
      0.300000011920929, 0.360000014305115,
    ],
    wisd_up: [
      0.00014000000373926, 0.000150000007124618, 0.00015999999595806, 0.000180000002728775,
      0.000190000006114133, 0.000199999994947575, 0.00022000000171829, 0.000230000005103648,
      0.00023999999393709, 0.000260000000707805, 0.00028000000747852, 0.000300000014249235,
    ],
  },
);

export default {
  slug: 'xaihi',
  gameId: 'XAIHI',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'cryo',
  role: 'supporter',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 26, 44, 62, 80, 89],
    agility: [9, 26, 45, 64, 82, 91],
    intellect: [15, 39, 64, 89, 114, 127],
    will: [15, 43, 74, 104, 134, 150],
    baseAttack: [30, 86, 144, 203, 262, 291],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        xaihiBasicAttack1,
        xaihiBasicAttack2,
        xaihiBasicAttack3,
        xaihiBasicAttack4,
        xaihiBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: xaihiFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: xaihiPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: xaihiBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: xaihiComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: xaihiUltimate },
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
        'basicAttack5',
        'plungingAttack',
        'finisher',
      ],
      defaultSkillKey: 'basicAttack1',
    },
    battleSkill: { kind: 'skillSlot', skillSlotKey: 'battleSkill' },
    comboSkill: { kind: 'skillSlot', skillSlotKey: 'comboSkill' },
    ultimate: { kind: 'skillSlot', skillSlotKey: 'ultimate' },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'exist_talent_1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'cryst_up',
          operation: 'assign',
          value: [0.0700000002980232, 0.100000001490116],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'duration',
          operation: 'assign',
          value: [5, 5],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'exist_talent_2',
          operation: 'assign',
          value: 1,
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
          operation: 'add',
          value: 0.0500000007450581,
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
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
        { kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'multiply',
          value: 1.10000002384186,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_up',
          operation: 'multiply',
          value: 1.10000002384186,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_max',
          operation: 'multiply',
          value: 1.10000002384186,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0011_seraph_atk_buff: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_up: 0,
        duration: 0,
        final_atkup: 0,
        final_final_atkup: 0,
        wisd_max: 0,
        wisd_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'intellect' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'wisd_up' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'final_atkup',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'final_atkup' },
              operator: 'greaterOrEqual',
              right: { kind: 'blackboard', key: 'wisd_max' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'wisd_max' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'final_atkup' },
              }),
            ),
            { alwaysNext: true },
          ),
          step('calculateActionValue', {
            key: 'final_final_atkup',
            operation: 'add',
            left: { kind: 'blackboard', key: 'final_final_atkup' },
            right: { kind: 'blackboard', key: 'atk_up' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_crystal',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'final_final_atkup' },
            },
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0011_seraph_ultimate_effect' },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_natural',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'final_final_atkup' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0011_seraph_ultimate_effect_2',
            },
          }),
        ),
      },
    },
    buff_chr_0011_seraph_combo_count: {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        enhanceChanged: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0011_seraph_combo_count'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0011_seraph_finishball_04',
                target: 'buffOwner',
                source: 'buffOwner',
                inheritSourceSkillCastInfo: true,
              }),
              step('mergeContextTargets', {
                saveToContextKey: 'seraph',
                sources: [{ kind: 'target', target: 'buffSource' }],
              }),
              step('openComboWindow', { nextSkillKeyFromSlot: 'comboSkill' }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0011_seraph_combo_count'],
                reason: 'other',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0011_seraph_finishball_02: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: { start: sequence(step('finishCurrentAbilityEntity', {})) },
    },
    buff_chr_0011_seraph_finishball_04: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 6,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('mergeContextTargets', {
            saveToContextKey: 'seraph',
            sources: [{ kind: 'target', target: 'buffSource' }],
          }),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0011_seraph_combo_skill_listener'],
            reason: 'other',
          }),
          step('finishCurrentAbilityEntity', {}),
        ),
      },
    },
    buff_chr_0011_seraph_mainchr_heal: {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 0.25,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0,
        atk_up: 0,
        buff_duration: 0,
        final_heal_value: 0,
        heal_value: 0,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
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
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'will' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'will_up' },
                base: { kind: 'blackboard', key: 'heal_value' },
                targetKey: 'final_heal_value',
              }),
              step('heal', {
                target: 'buffOwner',
                alwaysNext: true,
                tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
                amount: { kind: 'blackboard', key: 'final_heal_value' },
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
                  kind: 'healthCompare',
                  target: 'caster',
                  valueType: 'ratio',
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_potential_1_atkup',
                    target: 'buffOwner',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                      atk_up: { kind: 'blackboard', key: 'atk_up' },
                    },
                  }),
                ),
              ),
            ),
          },
        ),
      },
    },
    buff_chr_0011_seraph_normal_skill_heal: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.1,
        atk_up: 0,
        buff_duration: 0,
        duration: 20,
        heal_value: 20,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeOutputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'buffOwner',
                  markerId: 'buff_chr_0011_seraph_normal_skill_heal',
                },
              },
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0011_seraph_finishball_04'],
                    operator: 'lessOrEqual',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(
                    branch(
                      { kind: 'casterControlled' },
                      sequence(
                        branch(
                          {
                            kind: 'eventDamageTagsMatch',
                            match: 'hasAny',
                            tags: ['normalAttackLastCombo'],
                          },
                          sequence(
                            step('mergeContextTargets', {
                              saveToContextKey: 'seraph',
                              sources: [{ kind: 'target', target: 'buffSource' }],
                            }),
                            step('findOwnerSpawnedAbilityEntities', {
                              saveToContextKey: 'ball',
                              abilityEntityIds: ['abilityentity_chr_0011_seraph_normal_skill'],
                              ownerContextKey: 'seraph',
                            }),
                            forEachContextTarget(
                              'ball',
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0011_seraph_combo_count',
                                  target: 'currentAbilityEntity',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                            ),
                            step('applyBuff', {
                              buffId: 'buff_chr_0011_seraph_mainchr_heal',
                              target: 'buffOwner',
                              source: 'buffSource',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                                heal_value: { kind: 'blackboard', key: 'heal_value' },
                                potential_1: { kind: 'blackboard', key: 'potential_1' },
                                buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                                atk_up: { kind: 'blackboard', key: 'atk_up' },
                                will_up: { kind: 'blackboard', key: 'will_up' },
                              },
                            }),
                            step('createTimedMarker', {
                              target: 'buffOwner',
                              markerId: 'buff_chr_0011_seraph_normal_skill_heal',
                              durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                              autoFinishByAction: false,
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
    buff_chr_0011_seraph_potential_1_atkup: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'buff_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0, buff_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_spell',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'buff_duration' },
              rate: { kind: 'blackboard', key: 'atk_up' },
            },
          }),
        ),
      },
    },
    buff_chr_0011_seraph_spawnball: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.1,
        atk_up: 0,
        buff_duration: 0,
        heal_value: 30,
        potential_1: 0,
        will_up: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0011_seraph_normal_skill',
            childSkillId: 'chr_0011_seraph_normal_skill_abentity_onfield',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
          ),
        ),
      },
    },
    buff_chr_0011_seraph_talent_1_crystup: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_cryst_taken_up',
        iconPath: '/icons/icon_battle_cryst_taken_up.webp',
        showInHeadBarCommon: true,
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
      blackboard: { cryst_up: 0, duration: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['cryo'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'cryst_up' },
            },
          ],
        },
      ],
    },
    buff_chr_0011_seraph_ultimate_effect: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_cryst_enhance',
        iconPath: '/icons/icon_battle_affix_cryst_enhance.webp',
        showInHeadBarCommon: true,
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
    buff_chr_0011_seraph_ultimate_effect_2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_natural_enhance',
        iconPath: '/icons/icon_battle_affix_natural_enhance.webp',
        showInHeadBarCommon: true,
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0011_seraph_normal_skill: {
      bornTags: [
        'Immune',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0011_seraph/UltimateAbilityEntity',
      ],
      lifetime: { kind: 'limited', durationSeconds: 30 },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0011_seraph_normal_skill_abentity_onfield',
        blackboard: {
          atk_scale: 0.1,
          atk_up: 0,
          buff_duration: 0,
          heal_value: 20,
          poise: 0,
          potential_1: 0,
          usp: 0,
          will_up: 0,
        },
        scheduledSequences: [
          scheduled(
            1,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0011_seraph_normal_skill_heal',
                target: 'party',
                source: 'currentAbilityEntity',
                finishByAction: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                  heal_value: { kind: 'blackboard', key: 'heal_value' },
                  potential_1: { kind: 'blackboard', key: 'potential_1' },
                  buff_duration: { kind: 'blackboard', key: 'buff_duration' },
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  will_up: { kind: 'blackboard', key: 'will_up' },
                },
              }),
            ),
            901,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_full_immune',
                target: 'currentAbilityEntity',
                source: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            1,
          ),
          scheduled(
            600,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0011_seraph_finishball_04'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(),
                sequence(
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0011_seraph_combo_skill_listener'],
                    reason: 'other',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            603,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
