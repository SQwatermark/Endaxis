/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const wulfgardBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0006_wolfgd_attack1',
    timelineBlockFrames: 24,
    naturalDurationFrames: 121,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 49,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0006_wolfgd_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 24, endFrame: 49, sourceSkillIds: ['chr_0006_wolfgd_attack2'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack1.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack1.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack1_projhit01',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        14,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack1.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack1_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack1:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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

export const wulfgardBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0006_wolfgd_attack2',
    timelineBlockFrames: 23,
    naturalDurationFrames: 129,
    exclusiveFrame: 35,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 38,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0006_wolfgd_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 23, endFrame: 38, sourceSkillIds: ['chr_0006_wolfgd_attack3'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack2.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack2.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack2_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        16,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack2.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack2_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.180000007152557, 0.189999997615814, 0.209999993443489, 0.230000004172325, 0.25,
      0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443, 0.340000003576279,
      0.360000014305115, 0.389999985694885,
    ],
    display_atk_scale: [
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.560000002384186, 0.600000023841858, 0.629999995231628, 0.670000016689301,
      0.730000019073486, 0.790000021457672,
    ],
  },
);

export const wulfgardBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0006_wolfgd_attack3',
    timelineBlockFrames: 32,
    naturalDurationFrames: 146,
    exclusiveFrame: 52,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 52,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0006_wolfgd_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 32, endFrame: 52, sourceSkillIds: ['chr_0006_wolfgd_attack4'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack3_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        18,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[2]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack3_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        18,
      ),
      scheduled(
        24,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack3.actionGroupData.timelineActions[3]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack3_projhit',
                { atb: 0, atk_scale: 0, duration: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalAttack'],
                    },
                    'chr_0006_wolfgd_attack3:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/0',
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
      0.189999997615814, 0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257,
      0.280000001192093, 0.300000011920929, 0.310000002384186, 0.330000013113022, 0.360000014305115,
      0.379999995231628, 0.419999986886978,
    ],
    display_atk_scale: [
      0.560000002384186, 0.610000014305115, 0.670000016689301, 0.720000028610229, 0.779999971389771,
      0.829999983310699, 0.889999985694885, 0.939999997615814, 1, 1.07000005245209,
      1.14999997615814, 1.25,
    ],
  },
);

export const wulfgardBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0006_wolfgd_attack4',
    timelineBlockFrames: 53,
    naturalDurationFrames: 141,
    exclusiveFrame: 52,
    costFrame: 23,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_attack_4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_attack4.actionGroupData.timelineActions[4]._sequenceActionData.actionData[1]:chr_0006_wolfgd_attack4_projhit',
                { atb: 0, atk_scale: 0, duration: 0, poise: 0 },
                true,
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
                    'chr_0006_wolfgd_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        33,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 18,
    atk_scale: [
      0.680000007152557, 0.740000009536743, 0.810000002384186, 0.879999995231628, 0.949999988079071,
      1.00999999046326, 1.08000004291534, 1.14999997615814, 1.22000002861023, 1.29999995231628,
      1.39999997615814, 1.51999998092651,
    ],
    poise: 18,
  },
);

export const wulfgardFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0006_wolfgd_power_attack',
    timelineBlockFrames: 34,
    naturalDurationFrames: 150,
    exclusiveFrame: 60,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 34,
          endFrame: 58,
          sourceSkillIds: ['chr_0006_wolfgd_normal_skill', 'chr_0006_wolfgd_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        34,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 1,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0006_wolfgd_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        44,
      ),
      scheduled(
        34,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0700000002980232 },
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
        60,
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
  },
);

export const wulfgardPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0006_wolfgd_plunging_attack_end',
    timelineBlockFrames: 8,
    naturalDurationFrames: 120,
    exclusiveFrame: 20,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 8, endFrame: 20, sourceSkillIds: ['chr_0006_wolfgd_attack1'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0006_wolfgd_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const wulfgardBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0006_wolfgd_normal_skill',
    timelineBlockFrames: 32,
    naturalDurationFrames: 272,
    exclusiveFrame: 159,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 32, endFrame: 54, sourceSkillIds: ['chr_0006_wolfgd_normal_skill'] },
        { startFrame: 152, endFrame: 184, sourceSkillIds: ['chr_0006_wolfgd_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[3]._sequenceActionData.actionData[2]:projectile_chr_0006_wolfgd_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[3]._sequenceActionData.actionData[2]:chr_0006_wolfgd_normal_skill_projhit',
                { atk_scale: 0, duration: 0, poise_first_bullet: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_first_bullet' },
                    },
                    'chr_0006_wolfgd_normal_skill:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        16,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2]:projectile_chr_0006_wolfgd_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[4]._sequenceActionData.actionData[2]:chr_0006_wolfgd_normal_skill_projhit',
                { atk_scale: 0, duration: 0, poise_first_bullet: 0 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_first_bullet' },
                    },
                    'chr_0006_wolfgd_normal_skill:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        20,
      ),
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'SpellInflict' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2].succeedActions.actionData[0]:projectile_chr_0006_wolfgd_normal_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2].succeedActions.actionData[0]:chr_0006_wolfgd_normal_skill_projhit_1',
                    { atk_scale: 0, duration: 0, poise_first_bullet: 0 },
                    true,
                    sequence(
                      step(
                        'dealDamage',
                        {
                          damageType: 'heat',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise_first_bullet' },
                        },
                        'chr_0006_wolfgd_normal_skill:/scheduledSequences/2/sequence/steps/0/whenTrue/steps/0/body/steps/0/body/steps/0',
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
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2].failActions.actionData[0]:projectile_chr_0006_wolfgd_normal_skill',
                {},
                true,
                sequence(
                  withActionBlackboardScope(
                    'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[2].failActions.actionData[0]:chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction',
                    { atk_scale: 0, duration: 0, poise_first_bullet: 0 },
                    true,
                    sequence(
                      step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'heat',
                          attackScale: { kind: 'blackboard', key: 'atk_scale' },
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise_first_bullet' },
                        },
                        'chr_0006_wolfgd_normal_skill:/scheduledSequences/2/sequence/steps/0/whenFalse/steps/0/body/steps/0/body/steps/1',
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
            { alwaysNext: true },
          ),
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
        26,
      ),
      scheduled(
        141,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_normal_skill_plus',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_normal_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:chr_0006_wolfgd_normal_skill_plus_projhit',
                {
                  atk_scale_plus: 0,
                  atk_scale_plus_fail: 0,
                  duration: 0,
                  poise_extra_bullet: 0,
                  poise_extra_bullet_fail: 0,
                  potential_2: 0,
                  potential_skillpower: 0,
                  returnskillpower: 0,
                  talent2: 0,
                },
                true,
                sequence(
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: [
                        'Skill/Character/Common/SpellStatus/Burning',
                        'Skill/Character/Common/SpellStatus/Conduct',
                      ],
                    },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'talent2' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_2' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0 },
                            },
                            sequence(
                              step('modifyActionValue', {
                                key: 'returnskillpower',
                                operation: 'add',
                                value: { kind: 'blackboard', key: 'potential_skillpower' },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'returnskillpower' },
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
                          attackScale: { kind: 'blackboard', key: 'atk_scale_plus' },
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise_extra_bullet' },
                        },
                        'chr_0006_wolfgd_normal_skill:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0/whenTrue/steps/1',
                      ),
                    ),
                    sequence(
                      step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                      step(
                        'dealDamage',
                        {
                          damageType: 'heat',
                          attackScale: { kind: 'blackboard', key: 'atk_scale_plus_fail' },
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise_extra_bullet_fail' },
                        },
                        'chr_0006_wolfgd_normal_skill:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0/whenFalse/steps/1',
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: ['Skill/Character/Common/SpellStatus/Burning'],
                    },
                    sequence(
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellStatus/Burning'],
                        reason: 'early',
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'entityTagMatch',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          tags: ['Skill/Character/Common/SpellStatus/Conduct'],
                        },
                        sequence(
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
                            reason: 'early',
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
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
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_3' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0006_wolfgd_talent_0_effectbuff'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0006_wolfgd_talent_0'] },
                desiredKey: 'add',
                outputKey: 'add',
              }),
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0006_wolfgd_talent_0'] },
                desiredKey: 'duration',
                outputKey: 'duration',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  add: { kind: 'blackboard', key: 'add' },
                  duration: { kind: 'blackboard', key: 'duration' },
                },
              }),
              step('modifyActionValue', {
                key: 'teammate_percent',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'add' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  add: { kind: 'blackboard', key: 'teammate_percent' },
                  duration: { kind: 'blackboard', key: 'duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        146,
      ),
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
        0,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: [
                'Skill/Character/Common/SpellStatus/Burning',
                'Skill/Character/Common/SpellStatus/Conduct',
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'SpellInflict',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        2,
      ),
      scheduled(
        31,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'SpellInflict' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(step('jumpTimeline', { destinationFrame: 118 })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        32,
      ),
      scheduled(117, sequence(step('jumpTimeline', { destinationFrame: 247 })), 117),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    add: 0,
    atk_scale: [
      0.340000003576279, 0.370000004768372, 0.409999996423721, 0.439999997615814, 0.479999989271164,
      0.509999990463257, 0.540000021457672, 0.579999983310699, 0.610000014305115, 0.649999976158142,
      0.709999978542328, 0.769999980926514,
    ],
    atk_scale_plus: [
      3.77999997138977, 4.15000009536743, 4.53000020980835, 4.90999984741211, 5.28999996185303,
      5.65999984741211, 6.03999996185303, 6.42000007629395, 6.80000019073486, 7.26999998092651,
      7.84000015258789, 8.5,
    ],
    atk_scale_plus_fail: [
      0.360000014305115, 0.400000005960464, 0.430000007152557, 0.469999998807907, 0.5,
      0.540000021457672, 0.579999983310699, 0.610000014305115, 0.649999976158142, 0.689999997615814,
      0.75, 0.810000002384186,
    ],
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 0,
    input_angle: 0,
    poise_extra_bullet: 5,
    poise_extra_bullet_fail: 0,
    poise_first_bullet: 1.66999995708466,
    potential_2: 0,
    potential_3: 0,
    potential_skillpower: 0,
    returnskillpower: 0,
    select_radius: 10,
    SpellInflict: 0,
    talent2: 0,
    teammate_percent: 0,
    display_atk_scale: [
      1.01999998092651, 1.12000000476837, 1.22000002861023, 1.33000004291534, 1.42999994754791,
      1.52999997138977, 1.62999999523163, 1.74000000953674, 1.8400000333786, 1.96000003814697,
      2.11999988555908, 2.29999995231628,
    ],
    poise_first_bullet_display: 5,
  },
);

export const wulfgardComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0006_wolfgd_combo_skill',
    timelineBlockFrames: 30,
    naturalDurationFrames: 138,
    exclusiveFrame: 30,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 30, endFrame: 65, sourceSkillIds: ['chr_0006_wolfgd_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0006_wolfgd_combo_skill.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:projectile_chr_0006_wolfgd_combo_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0006_wolfgd_combo_skill.actionGroupData.timelineActions[1]._sequenceActionData.actionData[1]:chr_0006_wolfgd_combo_skill_projhit',
                { atk_scale: 0, duration: 0, poise: 0, usp: 0 },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0006_wolfgd_combo_skill',
                    childSkillId: 'chr_0006_wolfgd_combo_skill_abilityrange',
                    inheritActionBlackboard: true,
                    inheritSourceSkillCastInfo: true,
                    dieWhenSourceDies: false,
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
        16,
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
      0.600000023841858, 0.660000026226044, 0.720000028610229, 0.779999971389771, 0.839999973773956,
      0.899999976158142, 0.959999978542328, 1.01999998092651, 1.08000004291534, 1.1599999666214,
      1.25, 1.35000002384186,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    select_radius: 4,
    usp: 10,
  },
);

export const wulfgardUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0006_wolfgd_ultimate_skill',
    timelineBlockFrames: 75,
    naturalDurationFrames: 168,
    exclusiveFrame: 80,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 75,
          endFrame: 89,
          sourceSkillIds: ['chr_0006_wolfgd_normal_skill', 'chr_0006_wolfgd_combo_skill'],
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
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'type', skillType: 'comboSkill' },
                operation: 'set',
                basis: 'absoluteSeconds',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        14,
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
        46,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0006_wolfgd_ultimate_skill:/scheduledSequences/2/sequence/steps/0',
          ),
        ),
        49,
      ),
      scheduled(
        52,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0006_wolfgd_ultimate_skill:/scheduledSequences/3/sequence/steps/0',
          ),
        ),
        55,
      ),
      scheduled(
        59,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0006_wolfgd_ultimate_skill:/scheduledSequences/4/sequence/steps/0',
          ),
        ),
        62,
      ),
      scheduled(
        64,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0006_wolfgd_ultimate_skill:/scheduledSequences/5/sequence/steps/0',
          ),
        ),
        67,
      ),
      scheduled(
        69,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0006_wolfgd_ultimate_skill:/scheduledSequences/6/sequence/steps/0',
          ),
        ),
        72,
      ),
      scheduled(
        45,
        sequence(
          repeatEachTick(
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_fire_fire_burning_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: false,
                triggerIntervalSeconds: 0.200000002980232,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.200000002980232,
              },
            },
          ),
        ),
        72,
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
        46,
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
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 360,
    atk_duration: 10,
    atk_scale: [
      0.319999992847443, 0.349999994039536, 0.379999995231628, 0.419999986886978, 0.449999988079071,
      0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699, 0.620000004768372,
      0.660000026226044, 0.720000028610229,
    ],
    atk_scale_plus: 0,
    atk_up: 0,
    CamAngle: 0,
    dmg_increase: 0.3,
    duration: 1,
    poise: 3,
    potential_5: 0,
    potential_lv: 0,
    radius: 5,
    display_atk_scale: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    poise_display: 15,
  },
);

export default {
  slug: 'wulfgard',
  gameId: 'WULFGARD',
  rarity: 5,
  weaponType: 'handcannon',
  element: 'heat',
  role: 'caster',
  mainAttribute: 'strength',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [18, 49, 81, 113, 145, 161],
    agility: [9, 27, 47, 66, 85, 95],
    intellect: [9, 27, 45, 64, 83, 92],
    will: [13, 34, 56, 78, 100, 111],
    baseAttack: [30, 86, 146, 205, 264, 294],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        wulfgardBasicAttack1,
        wulfgardBasicAttack2,
        wulfgardBasicAttack3,
        wulfgardBasicAttack4,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: wulfgardFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: wulfgardPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: wulfgardBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: wulfgardComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: wulfgardUltimate },
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
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(),
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
          buffId: 'buff_chr_0006_wolfgd_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            add: [0.200000002980232, 0.300000011920929],
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'returnskillpower',
          operation: 'assign',
          value: [5, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent2',
          operation: 'assign',
          value: [1, 1],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 15 },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_skillpower',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 1,
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
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'teammate_percent',
          operation: 'assign',
          value: 0.5,
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
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0006_wolfgd_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { add: 0, duration: 0 },
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
                buffTags: ['Skill/Character/Common/SpellStatus/Burning'],
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                  target: 'buffSource',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    duration: { kind: 'blackboard', key: 'duration' },
                    add: { kind: 'blackboard', key: 'add' },
                  },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0006_wolfgd_talent_0_effectbuff: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_wolfgd_talent_1',
        iconPath: '/icons/icon_battle_wolfgd_talent_1.webp',
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
      blackboard: { add: 0, duration: 0 },
      attributeModifiers: [
        { attribute: 'heatDamageIncrease', slot: 'baseAddition', value: { blackboardKey: 'add' } },
      ],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0006_wolfgd_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Category/EnergyShard/Pulse',
      ],
      lifetime: { kind: 'limited', durationSeconds: 1.5 },
      childSkill: {
        skillId: 'chr_0006_wolfgd_combo_skill_abilityrange',
        blackboard: {
          atk_scale: 5,
          duration: 0,
          move_speed_scalar: 1,
          poise: 0,
          radius: 5,
          usp: 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0006_wolfgd_combo_skill:chr_0006_wolfgd_combo_skill_abilityrange:/childSkill/scheduledSequences/0/sequence/steps/1',
              ),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
            0,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
