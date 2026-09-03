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

export const camilleBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0033_camille_attack1',
    timelineBlockFrames: 12,
    naturalDurationFrames: 118,
    exclusiveFrame: 13,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 29,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0033_camille_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 29, sourceSkillIds: ['chr_0033_camille_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['normalAttack'],
            },
            'chr_0033_camille_attack1:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0399999991059303 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        10,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0033_camille_attack1:/scheduledSequences/1/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0399999991059303 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
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
    atk_scale_1: [
      0.125, 0.137999996542931, 0.150000005960464, 0.163000002503395, 0.174999997019768,
      0.187999993562698, 0.200000002980232, 0.212999999523163, 0.224999994039536, 0.24099999666214,
      0.25900000333786, 0.28099998831749,
    ],
    atk_scale_2: [
      0.125, 0.137999996542931, 0.150000005960464, 0.163000002503395, 0.174999997019768,
      0.187999993562698, 0.200000002980232, 0.212999999523163, 0.224999994039536, 0.24099999666214,
      0.25900000333786, 0.28099998831749,
    ],
    display_atk_scale: [
      0.25, 0.280000001192093, 0.300000011920929, 0.330000013113022, 0.349999994039536,
      0.379999995231628, 0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164,
      0.519999980926514, 0.560000002384186,
    ],
  },
);

export const camilleBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0033_camille_attack2',
    timelineBlockFrames: 15,
    naturalDurationFrames: 124,
    exclusiveFrame: 19,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 34,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0033_camille_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 15, endFrame: 34, sourceSkillIds: ['chr_0033_camille_attack3'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['normalAttack'],
            },
            'chr_0033_camille_attack2:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0329999998211861 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        11,
      ),
      scheduled(
        14,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0033_camille_attack2:/scheduledSequences/1/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0329999998211861 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
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
    atk_scale_1: [
      0.100000001490116, 0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
      0.150000005960464, 0.159999996423721, 0.170000001788139, 0.180000007152557, 0.193000003695488,
      0.208000004291534, 0.224999994039536,
    ],
    atk_scale_2: [
      0.100000001490116, 0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
      0.150000005960464, 0.159999996423721, 0.170000001788139, 0.180000007152557, 0.193000003695488,
      0.208000004291534, 0.224999994039536,
    ],
    display_atk_scale: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.384999990463257,
      0.41499999165535, 0.449999988079071,
    ],
  },
);

export const camilleBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0033_camille_attack3',
    timelineBlockFrames: 13,
    naturalDurationFrames: 130,
    exclusiveFrame: 19,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0033_camille_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 13, endFrame: 30, sourceSkillIds: ['chr_0033_camille_attack4'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        7,
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
                'chr_0033_camille_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0',
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
                    durationSeconds: { kind: 'constant', value: 0.0399999991059303 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_normal_attack' },
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
                maxCountPerTarget: 4,
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
      0.0750000029802322, 0.0829999968409538, 0.0900000035762787, 0.0979999974370003,
      0.104999996721745, 0.112999998033047, 0.119999997317791, 0.128000006079674, 0.135000005364418,
      0.143999993801117, 0.156000003218651, 0.168999999761581,
    ],
    display_atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
  },
);

export const camilleBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0033_camille_attack4',
    timelineBlockFrames: 22,
    naturalDurationFrames: 187,
    exclusiveFrame: 29,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 34,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0033_camille_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 34, sourceSkillIds: ['chr_0033_camille_attack5'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_attack4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit',
                { atk_scale_2: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                      tags: ['normalAttack'],
                    },
                    'chr_0033_camille_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0/body/steps/0',
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
        22,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:2',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        23,
      ),
      scheduled(
        24,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:4',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        26,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:6',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/3/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        27,
      ),
      scheduled(
        28,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:8',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/4/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        29,
      ),
      scheduled(
        30,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:10',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/5/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        31,
      ),
      scheduled(
        32,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_attack4.actionGroupData.timelineActions[6]._sequenceActionData.actionData[0]:chr_0033_camille_attack4_projhit:delayed:12',
            { atk_scale_2: 0.1 },
            true,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['normalAttack'],
                },
                'chr_0033_camille_attack4:/scheduledSequences/6/sequence/steps/0/body/steps/0',
              ),
            ),
            undefined,
            { lifetime: 'execution', alwaysNext: true },
          ),
        ),
        33,
      ),
      scheduled(
        11,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['normalAttack'],
            },
            'chr_0033_camille_attack4:/scheduledSequences/7/sequence/steps/0',
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
        15,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale_1: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.384999990463257,
      0.41499999165535, 0.449999988079071,
    ],
    atk_scale_2: [
      0.0199999995529652, 0.0219999998807907, 0.0240000002086163, 0.0260000005364418,
      0.0280000008642673, 0.0299999993294477, 0.0320000015199184, 0.034000001847744,
      0.0359999984502792, 0.0390000008046627, 0.0419999994337559, 0.0450000017881393,
    ],
    display_atk_scale: [
      0.340000003576279, 0.374000012874603, 0.407999992370605, 0.44200000166893, 0.476000010967255,
      0.509999990463257, 0.544000029563904, 0.578000009059906, 0.611999988555908, 0.654999971389771,
      0.705999970436096, 0.764999985694885,
    ],
  },
);

export const camilleBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0033_camille_attack5',
    timelineBlockFrames: 42,
    naturalDurationFrames: 171,
    exclusiveFrame: 41,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        21,
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
            'chr_0033_camille_attack5:/scheduledSequences/0/sequence/steps/0',
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
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        23,
      ),
      scheduled(
        12,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0799999982118607 },
            slot: 'TimeDilation/Layer/Entity/Frozen',
            priority: 50,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.200000002980232,
                  inTangent: 0.600000023841858,
                  outTangent: 0.600000023841858,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0.333333343267441,
                },
                {
                  time: 1,
                  value: 0.800000011920929,
                  inTangent: 0.600000023841858,
                  outTangent: 0.600000023841858,
                  weightedMode: 0,
                  inWeight: 0.333333343267441,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        15,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 20,
    atk_scale: [
      0.5, 0.550000011920929, 0.600000023841858, 0.649999976158142, 0.699999988079071, 0.75,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.959999978542328, 1.03999996185303,
      1.12999999523163,
    ],
    poise: 18,
  },
);

export const camilleFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0033_camille_power_attack',
    timelineBlockFrames: 39,
    naturalDurationFrames: 230,
    exclusiveFrame: 50,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 39,
          endFrame: 46,
          sourceSkillIds: [
            'chr_0033_camille_normal_skill',
            'chr_0033_camille_normal_skill_2',
            'chr_0033_camille_combo_skill',
          ],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        43,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.649999976158142,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0033_camille_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/VisualAdjust',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1.5,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1.5,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy'],
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
        3,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[10]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[10]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit_witheff',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/1/sequence/steps/0/body/steps/0/body/steps/0',
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
        4,
      ),
      scheduled(
        4,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[11]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_R_blue',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[11]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/2/sequence/steps/0/body/steps/0/body/steps/0',
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
        5,
      ),
      scheduled(
        6,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_R_red',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[12]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/3/sequence/steps/0/body/steps/0/body/steps/0',
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
        8,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_R_blue',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[13]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/4/sequence/steps/0/body/steps/0/body/steps/0',
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
        3,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_L_red',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/5/sequence/steps/0/body/steps/0/body/steps/0',
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
        4,
      ),
      scheduled(
        5,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_L_blue',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[15]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/6/sequence/steps/0/body/steps/0/body/steps/0',
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
        6,
      ),
      scheduled(
        7,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[16]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_power_attack_L_red',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_power_attack.actionGroupData.timelineActions[16]._sequenceActionData.actionData[0]:chr_0033_camille_power_attack_projhit',
                { atb: 0, atk_scale: 0.1 },
                true,
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      calculation: 'breakingAttack',
                      calculationMultiplier: 0.0500000007450581,
                      tags: ['normalAttack', 'powerAttack'],
                    },
                    'chr_0033_camille_power_attack:/scheduledSequences/7/sequence/steps/0/body/steps/0/body/steps/0',
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
      scheduled(
        40,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/VisualAdjust',
                priority: 50,
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
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2,
                      outTangent: 2,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
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
        46,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/VisualAdjust',
                priority: 50,
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
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2,
                      outTangent: 2,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                ignoredTargets: [],
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        50,
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
        46,
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
    display_atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
  },
);

export const camillePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0033_camille_plunging_attack_end',
    timelineBlockFrames: 16,
    naturalDurationFrames: 149,
    exclusiveFrame: 15,
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
            'chr_0033_camille_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
        3,
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
    display_atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
  },
);

export const camilleBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0033_camille_normal_skill',
    timelineBlockFrames: 18,
    naturalDurationFrames: 192,
    exclusiveFrame: 26,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 18, endFrame: 34, sourceSkillIds: ['chr_0033_camille_combo_skill'] },
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
        0,
      ),
      scheduled(
        12,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0033_camille_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:projectile_chr_0033_camille_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0033_camille_normal_skill.actionGroupData.timelineActions[5]._sequenceActionData.actionData[0]:chr_0033_camille_normal_skill_projhit',
                {
                  atk_scale: 0.1,
                  bat_atk_scale: 0.1,
                  bat_duration: 30,
                  poise: 10,
                  vulnerable_scale: 0,
                  weak_scale: 0.1,
                },
                true,
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 1 },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0033_camille_normal_skill',
                        childSkillId: 'chr_0033_camille_normal_skill_abilityrange_first',
                        inheritActionBlackboard: true,
                        inheritSourceSkillCastInfo: true,
                        dieWhenSourceDies: false,
                        target: 'enemy',
                        saveToContextKey: 'Camille_Bat',
                        blackboardAssignments: {
                          EntityBB_bat_duration: { kind: 'blackboard', key: 'bat_duration' },
                          EntityBB_bat_atk_scale: { kind: 'blackboard', key: 'bat_atk_scale' },
                          EntityBB_atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                          EntityBB_poise: { kind: 'blackboard', key: 'poise' },
                          EntityBB_weak_scale: { kind: 'blackboard', key: 'weak_scale' },
                          EntityBB_vulnerable_scale: {
                            kind: 'blackboard',
                            key: 'vulnerable_scale',
                          },
                        },
                      }),
                      step('modifyActionValue', {
                        key: 'EntityBB_bat_spawned',
                        operation: 'assign',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('startTimeDilation', {
                        scope: 'entity',
                        durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                        slot: 'TimeDilation/Layer/Entity/HitStop',
                        priority: 10,
                        curve: { kind: 'named', key: 'common' },
                        finishByAction: false,
                        targets: ['enemy', 'caster'],
                      }),
                      step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                    ),
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
        13,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_obtain: 0,
    atk_scale: [
      0.889999985694885, 0.980000019073486, 1.07000005245209, 1.1599999666214, 1.25,
      1.3400000333786, 1.42999994754791, 1.50999999046326, 1.60000002384186, 1.72000002861023,
      1.85000002384186, 2,
    ],
    bat_atk_scale: [
      0.449999988079071, 0.490000009536743, 0.540000021457672, 0.579999983310699, 0.620000004768372,
      0.670000016689301, 0.709999978542328, 0.759999990463257, 0.800000011920929, 0.860000014305115,
      0.930000007152557, 1,
    ],
    bat_duration: 45,
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    poise: 10,
    vulnerable_scale: [
      0.0500000007450581, 0.0500000007450581, 0.0500000007450581, 0.0549999997019768,
      0.0549999997019768, 0.0549999997019768, 0.0599999986588955, 0.0599999986588955,
      0.0599999986588955, 0.0649999976158142, 0.0649999976158142, 0.0700000002980232,
    ],
    weak_scale: [
      0.0500000007450581, 0.0500000007450581, 0.0500000007450581, 0.0549999997019768,
      0.0549999997019768, 0.0549999997019768, 0.0599999986588955, 0.0599999986588955,
      0.0599999986588955, 0.0649999976158142, 0.0649999976158142, 0.0700000002980232,
    ],
  },
);

export const camilleBattleSkillDuringUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkillDuringUltimate',
    sourceSkillId: 'chr_0033_camille_combo_skill_2',
    timelineBlockFrames: 79,
    naturalDurationFrames: 213,
    exclusiveFrame: 86,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 79,
          endFrame: 127,
          sourceSkillIds: ['chr_0033_camille_normal_skill', 'chr_0033_camille_normal_skill_2'],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0033_camille_ult_henshin_state'],
            reason: 'early',
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
          }),
        ),
        24,
      ),
      scheduled(
        52,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'unassigned',
            priority: 100,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
          }),
        ),
        67,
      ),
      scheduled(
        20,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_1' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/3/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
      scheduled(
        33,
        sequence(
          repeatEachTick(
            sequence(
              once(
                'SkillData.chr_0033_camille_combo_skill_2.actionGroupData.timelineActions[40]._sequenceActionData.actionData[0].actionOnTick.actionData[1]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_2' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/4/sequence/steps/0/body/steps/1',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
        36,
      ),
      scheduled(
        49,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_3' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/5/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
        51,
      ),
      scheduled(
        70,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/chr_0033_camille/NormalSkillBatTarget'],
                },
                sequence(
                  step('findOwnerSpawnedAbilityEntities', {
                    saveToContextKey: 'Camille_Bat',
                    abilityEntityIds: ['abilityentity_chr_0033_camille_normal_skill'],
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              once(
                'SkillData.chr_0033_camille_combo_skill_2.actionGroupData.timelineActions[42]._sequenceActionData.actionData[0].actionOnTick.actionData[3]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_ex' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_4' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_2' },
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/6/sequence/steps/0/body/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_0' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('heal', {
                    target: 'caster',
                    alwaysNext: true,
                    tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                    attribute: 'intellect',
                    multiplier: { kind: 'blackboard', key: 'heal_sub_multi' },
                    addition: { kind: 'blackboard', key: 'heal_base' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: -0.0008697509765625,
                      value: 0.299206614494324,
                      inTangent: 0.0283283200114965,
                      outTangent: 0.0283283200114965,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2.33252596855164,
                      outTangent: 2.33252596855164,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'usp_gained' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                  step('modifyActionValue', {
                    key: 'usp_gained',
                    operation: 'assign',
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
        73,
      ),
    ],
    costs: [{ resource: 'sp', value: 40 }],
    cooldownFrames: 90,
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    atb_ex: [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    atk_scale_1_1: 0.1,
    atk_scale_1_2: 0.1,
    atk_scale_1_3: 0.1,
    atk_scale_2_1: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_2: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_3: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_4: [
      1.41999995708466, 1.57000005245209, 1.71000003814697, 1.85000002384186, 1.99000000953674,
      2.14000010490417, 2.27999997138977, 2.42000007629395, 2.55999994277954, 2.74000000953674,
      2.95000004768372, 3.20000004768372,
    ],
    cam_angle: 0,
    cam_duration: 0,
    combo_duration: 15,
    heal_base: 0,
    heal_sub_multi: 0,
    input_angle: 0,
    last_hit: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    poise_2: 10,
    talent_0: 0,
    usp: 10,
    usp_gained: 0,
    display_atk_scale_2: [
      2.22000002861023, 2.44000005722046, 2.67000007629395, 2.89000010490417, 3.10999989509583,
      3.32999992370605, 3.55999994277954, 3.77999997138977, 4, 4.28000020980835, 4.6100001335144, 5,
    ],
    display_poise_ex: 20,
  },
);

export const camilleComboSkill1: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill1',
    sourceSkillId: 'chr_0033_camille_combo_skill',
    timelineBlockFrames: 51,
    naturalDurationFrames: 191,
    exclusiveFrame: 63,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 51,
          endFrame: 63,
          sourceSkillIds: ['chr_0033_camille_normal_skill', 'chr_0033_camille_normal_skill_2'],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
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
      scheduled(
        19,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_1_1' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
        21,
      ),
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_1_2' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
      scheduled(
        47,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/chr_0033_camille/NormalSkillBatTarget'],
                },
                sequence(
                  step('findOwnerSpawnedAbilityEntities', {
                    saveToContextKey: 'Camille_Bat',
                    abilityEntityIds: ['abilityentity_chr_0033_camille_normal_skill'],
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              once(
                'SkillData.chr_0033_camille_combo_skill.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].actionOnTick.actionData[2]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_1_3' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0033_camille_combo_skill:/scheduledSequences/3/sequence/steps/0/body/steps/2',
              ),
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/chr_0033_camille/NormalSkillBatTarget'],
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'talent_0' },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('heal', {
                        target: 'caster',
                        alwaysNext: true,
                        tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                        attribute: 'intellect',
                        multiplier: { kind: 'blackboard', key: 'heal_sub_multi' },
                        addition: { kind: 'blackboard', key: 'heal_base' },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                undefined,
                { alwaysNext: true },
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'usp_gained' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                  step('modifyActionValue', {
                    key: 'usp_gained',
                    operation: 'assign',
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
        50,
      ),
    ],
    smartTarget: 'enemy',
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    atb_ex: 15,
    atk_scale_1_1: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_1_2: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_1_3: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    atk_scale_2_1: 0.1,
    atk_scale_2_2: 0.1,
    atk_scale_2_3: 0.1,
    atk_scale_2_4: 0.1,
    cam_angle: 0,
    cam_duration: 0,
    combo_duration: 15,
    heal_base: 0,
    heal_sub_multi: 0,
    input_angle: 0,
    last_hit: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    poise_2: 15,
    talent_0: 0,
    usp: 10,
    usp_gained: 0,
    display_atk_scale: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.86000001430511, 2,
      2.13000011444092, 2.25999999046326, 2.40000009536743, 2.55999994277954, 2.75999999046326, 3,
    ],
  },
);

export const camilleComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    sourceSkillId: 'chr_0033_camille_combo_skill_2',
    timelineBlockFrames: 79,
    naturalDurationFrames: 213,
    exclusiveFrame: 86,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 79,
          endFrame: 127,
          sourceSkillIds: ['chr_0033_camille_normal_skill', 'chr_0033_camille_normal_skill_2'],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0033_camille_ult_henshin_state'],
            reason: 'early',
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
          }),
        ),
        24,
      ),
      scheduled(
        52,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'unassigned',
            priority: 100,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
          }),
        ),
        67,
      ),
      scheduled(
        20,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_1' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/3/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
      scheduled(
        33,
        sequence(
          repeatEachTick(
            sequence(
              once(
                'SkillData.chr_0033_camille_combo_skill_2.actionGroupData.timelineActions[40]._sequenceActionData.actionData[0].actionOnTick.actionData[1]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_2' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/4/sequence/steps/0/body/steps/1',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
        36,
      ),
      scheduled(
        49,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_3' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/5/sequence/steps/0/body/steps/0',
              ),
              branch(
                { kind: 'casterControlled' },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.100000001490116 },
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
        51,
      ),
      scheduled(
        70,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Skill/Character/chr_0033_camille/NormalSkillBatTarget'],
                },
                sequence(
                  step('findOwnerSpawnedAbilityEntities', {
                    saveToContextKey: 'Camille_Bat',
                    abilityEntityIds: ['abilityentity_chr_0033_camille_normal_skill'],
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              once(
                'SkillData.chr_0033_camille_combo_skill_2.actionGroupData.timelineActions[42]._sequenceActionData.actionData[0].actionOnTick.actionData[3]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_ex' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2_4' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_2' },
                },
                'chr_0033_camille_combo_skill_2:/scheduledSequences/6/sequence/steps/0/body/steps/2',
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_0' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('heal', {
                    target: 'caster',
                    alwaysNext: true,
                    tags: ['Skill/Character/Common/Heal/ComboSkillHeal'],
                    attribute: 'intellect',
                    multiplier: { kind: 'blackboard', key: 'heal_sub_multi' },
                    addition: { kind: 'blackboard', key: 'heal_base' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: -0.0008697509765625,
                      value: 0.299206614494324,
                      inTangent: 0.0283283200114965,
                      outTangent: 0.0283283200114965,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2.33252596855164,
                      outTangent: 2.33252596855164,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'usp_gained' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                  step('modifyActionValue', {
                    key: 'usp_gained',
                    operation: 'assign',
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
        73,
      ),
    ],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    atb_ex: [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    atk_scale_1_1: 0.1,
    atk_scale_1_2: 0.1,
    atk_scale_1_3: 0.1,
    atk_scale_2_1: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_2: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_3: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_2_4: [
      1.41999995708466, 1.57000005245209, 1.71000003814697, 1.85000002384186, 1.99000000953674,
      2.14000010490417, 2.27999997138977, 2.42000007629395, 2.55999994277954, 2.74000000953674,
      2.95000004768372, 3.20000004768372,
    ],
    cam_angle: 0,
    cam_duration: 0,
    combo_duration: 15,
    heal_base: 0,
    heal_sub_multi: 0,
    input_angle: 0,
    last_hit: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    poise_2: 10,
    talent_0: 0,
    usp: 10,
    usp_gained: 0,
    display_atk_scale_2: [
      2.22000002861023, 2.44000005722046, 2.67000007629395, 2.89000010490417, 3.10999989509583,
      3.32999992370605, 3.55999994277954, 3.77999997138977, 4, 4.28000020980835, 4.6100001335144, 5,
    ],
    display_poise_ex: 20,
  },
);

export const camilleUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0033_camille_ultimate_skill',
    timelineBlockFrames: 125,
    naturalDurationFrames: 236,
    exclusiveFrame: 133,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 125,
          endFrame: 150,
          sourceSkillIds: [
            'chr_0033_camille_normal_skill',
            'chr_0033_camille_normal_skill_2',
            'chr_0033_camille_combo_skill',
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
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 2.76999998092651 },
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
        69,
      ),
      scheduled(
        75,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_ultimate_skill:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 7,
                targetTriggerIntervalSeconds: 0.0500000007450581,
              },
            },
          ),
        ),
        91,
      ),
      scheduled(
        104,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0033_camille_ultimate_skill:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: -1,
              },
            },
          ),
        ),
        108,
      ),
      scheduled(
        120,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0033_camille_ult_hit'],
                  operator: 'lessOrEqual',
                  value: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0033_camille_ult_hit',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    asChildBuff: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              once(
                'SkillData.chr_0033_camille_ultimate_skill.actionGroupData.timelineActions[27]._sequenceActionData.actionData[0].actionOnTick.actionData[1]',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
              ),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0033_camille_ultimate_skill:/scheduledSequences/3/sequence/steps/0/body/steps/2',
              ),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.5 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: -0.0008697509765625,
                      value: 0.299206614494324,
                      inTangent: 0.0283283200114965,
                      outTangent: 0.0283283200114965,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2.33252596855164,
                      outTangent: 2.33252596855164,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: -1,
              },
            },
          ),
        ),
        124,
      ),
      scheduled(
        118,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0033_camille_ult_henshin_state',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
          }),
        ),
        119,
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
        133,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 130 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atb: [32, 32, 32, 32, 32, 32, 32, 32, 36, 36, 36, 40],
    atk_scale_1: [
      0.178000003099442, 0.195999994874001, 0.212999999523163, 0.231000006198883, 0.248999997973442,
      0.266999989748001, 0.284000009298325, 0.301999986171722, 0.319999992847443, 0.342000007629395,
      0.368999987840652, 0.400000005960464,
    ],
    atk_scale_2: [
      0.532999992370605, 0.587000012397766, 0.639999985694885, 0.693000018596649, 0.746999979019165,
      0.800000011920929, 0.852999985218048, 0.907000005245209, 0.959999978542328, 1.02699995040894,
      1.10599994659424, 1.20000004768372,
    ],
    atk_scale_3: [
      0.888999998569489, 0.977999985218048, 1.06700003147125, 1.15600001811981, 1.24500000476837,
      1.33399999141693, 1.42299997806549, 1.51199996471405, 1.60099995136261, 1.71200001239777,
      1.84500002861023, 2.00099992752075,
    ],
    duration: 15,
    poise: 15,
    display_atk_scale: [
      2.66700005531311, 2.93300008773804, 3.20000004768372, 3.46700000762939, 3.73300004005432, 4,
      4.26700019836426, 4.53299999237061, 4.80000019073486, 5.13299989700317, 5.53299999237061, 6,
    ],
  },
);

export default {
  slug: 'camille',
  gameId: 'CAMILLE',
  rarity: 6,
  weaponType: 'polearm',
  element: 'heat',
  role: 'vanguard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [13, 32, 52, 72, 92, 102],
    agility: [17, 48, 80, 112, 144, 160],
    intellect: [14, 38, 64, 90, 116, 129],
    will: [11, 28, 46, 64, 82, 92],
    baseAttack: [30, 91, 155, 219, 283, 315],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        camilleBasicAttack1,
        camilleBasicAttack2,
        camilleBasicAttack3,
        camilleBasicAttack4,
        camilleBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: camilleFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: camillePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: camilleBattleSkill,
      replacementSkillPlacements: { battleSkillDuringUltimate: 'standard' },
      routedReplacementSkills: [
        {
          skill: camilleBattleSkillDuringUltimate,
          skillType: 'comboSkill',
          levelSource: 'comboSkill',
          executionSkillGroupKey: 'comboSkill',
          executionSkillKey: 'comboSkill2',
        },
      ],
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: [camilleComboSkill1, camilleComboSkill2],
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: camilleUltimate },
  ],
  skillSlots: [
    {
      key: 'battleSkill',
      baseSkillKey: 'battleSkill',
      replacementSkillKeys: ['battleSkillDuringUltimate'],
    },
    { key: 'comboSkill', baseSkillKey: 'comboSkill1', replacementSkillKeys: [] },
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
  comboSkillConditions: [
    {
      key: 'native-combo:0',
      skillKey: 'comboSkill1',
      event: 'buffAbsorbed',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
          },
          sequence(),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill1',
      event: 'buffConsumed',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
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
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'talent_0',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'combo_duration',
          operation: 'assign',
          value: [15, 15],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'heal_base',
          operation: 'assign',
          value: [30, 60],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'heal_sub_multi',
          operation: 'assign',
          value: [0.150000005960464, 0.300000011920929],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'talent_0',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'combo_duration',
          operation: 'assign',
          value: [15, 15],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'heal_base',
          operation: 'assign',
          value: [30, 60],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'heal_sub_multi',
          operation: 'assign',
          value: [0.150000005960464, 0.300000011920929],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0033_camille_passive_talent1',
          blackboard: {
            atk_up: [0.0199999995529652, 0.0399999991059303],
            duration: [40, 40],
            teammate_rate: [0.25, 0.25],
          },
          enableSequence: sequence(
            step('listenForCombatEvents', {
              responses: [
                {
                  key: 'native-event-0-0',
                  event: { kind: 'operatorHealed', role: 'target' },
                  phase: 'dataAction',
                  priority: 0,
                  sequence: sequence(
                    step('calculateActionValue', {
                      key: 'atk_up_teammate',
                      operation: 'multiply',
                      left: { kind: 'blackboard', key: 'atk_up' },
                      right: { kind: 'blackboard', key: 'teammate_rate' },
                    }),
                    branch(
                      {
                        kind: 'eventHealTagsMatch',
                        match: 'hasAny',
                        tags: [
                          'Skill/Character/Common/Heal/NormalSkillHeal',
                          'Skill/Character/Common/Heal/ComboSkillHeal',
                          'Skill/Character/Common/Heal/UltimateSkillHeal',
                        ],
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0033_camille_talent1_atkup',
                          target: 'caster',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0033_camille_talent1_atkup',
                          target: 'partyExceptCaster',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_up: { kind: 'blackboard', key: 'atk_up_teammate' },
                            duration: { kind: 'blackboard', key: 'duration' },
                          },
                        }),
                        branch(
                          { kind: 'eventOverheal' },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0033_camille_talent1_atkup',
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_up: { kind: 'blackboard', key: 'atk_up' },
                                duration: { kind: 'blackboard', key: 'duration' },
                              },
                            }),
                            step('applyBuff', {
                              buffId: 'buff_chr_0033_camille_talent1_atkup',
                              target: 'partyExceptCaster',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_up: { kind: 'blackboard', key: 'atk_up_teammate' },
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
          skillKey: 'battleSkill',
          blackboardKey: 'weak_scale',
          operation: 'add',
          value: 0.0500000007450581,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'vulnerable_scale',
          operation: 'add',
          value: 0.0500000007450581,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'bat_duration',
          operation: 'add',
          value: 15,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 20 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 20 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'atk_scale_1_1',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'atk_scale_1_2',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'atk_scale_1_3',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale_2_1',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale_2_2',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale_2_3',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale_2_4',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill1',
          blackboardKey: 'atb',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atb',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atb_ex',
          operation: 'multiply',
          value: 1.14999997615814,
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
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0033_camille_passive_talent1',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.0599999986588955,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_bat_spawned: 0,
    EntityBB_henshin: 0,
    EntityBB_trigger_count: 0,
    EntityBB_ult_combo_count: 0,
  },
  buffDefinitions: {
    buff_chr_0033_camille_cast_combo2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.100000001490116,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('castSkillDuringAction', {
            skillId: 'chr_0033_camille_combo_skill_2',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: false,
          }),
        ),
      },
    },
    buff_chr_0033_camille_normal_skill_bat_duration_icon: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 999,
      presentation: {
        visible: true,
        iconId: 'icon_battle_camille_normal_skill_bat',
        iconPath: '/icons/icon_battle_camille_normal_skill_bat.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { bat_duration: 30 },
      attributeModifiers: [],
    },
    buff_chr_0033_camille_normal_skill_listen_target_dead: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0033_camille_normal_skill_reset_target: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.100000001490116,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.1, poise: 10, remain_time: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('modifyActionValue', {
            key: 'EntityBB_retargeting',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        finish: sequence(
          step('mergeContextTargets', {
            saveToContextKey: 'src',
            sources: [{ kind: 'target', target: 'buffSource' }],
          }),
          step('finishCurrentAbilityEntity', {}),
        ),
      },
    },
    buff_chr_0033_camille_normal_skill_weak: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_camille_normal_skill_bat',
        iconPath: '/icons/icon_battle_camille_normal_skill_bat.webp',
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
      applyTags: ['Skill/Character/chr_0033_camille/NormalSkillBatTarget'],
      extendTags: [],
      blackboard: { duration: 60, vulnerable_scale: 0.1, weak_scale: 0.1 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_weak',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'weak_scale' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0033_camille_normal_skill_weak_child',
            },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_fire',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'vulnerable_scale' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_chr_0033_camille_normal_skill_weak_child',
            },
          }),
        ),
      },
    },
    buff_chr_0033_camille_normal_skill_weak_child: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 60 },
      attributeModifiers: [],
    },
    buff_chr_0033_camille_talent1_atkup: {
      stackingType: 'stack',
      priority: 1,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_fire_dmg_up',
        iconPath: '/icons/icon_battle_fire_dmg_up.webp',
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
      blackboard: { atk_up: 0, duration: 0, max_stack: 5 },
      attributeModifiers: [
        {
          attribute: 'heatDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    buff_chr_0033_camille_ult_henshin_state: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_camille_ult_state',
        iconPath: '/icons/icon_battle_camille_ult_state.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: true,
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
      blackboard: { duration: 30 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('modifyActionValue', {
            key: 'EntityBB_henshin',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ult_combo_count',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
        finish: sequence(
          step('modifyActionValue', {
            key: 'EntityBB_henshin',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ult_combo_count',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
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
    buff_chr_0033_camille_ult_hit: {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 3,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0033_camille_normal_skill: {
      bornTags: [
        'Immune',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0033_camille/NormalSkillBat',
      ],
      lifetime: {
        kind: 'limited',
        durationSeconds: { blackboardKey: 'EntityBB_bat_duration', fallback: 30 },
      },
      maxStackingCount: 1,
      childSkill: {
        skillId: 'chr_0033_camille_normal_skill_abilityrange_first',
        blackboard: { atk_scale: 0.1, obtain_count: 0, poise: 10, weak_scale: 0.2 },
        scheduledSequences: [
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
            36,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0033_camille_normal_skill_weak',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                asChildBuff: true,
                blackboardAssignments: {
                  weak_scale: { kind: 'blackboard', key: 'EntityBB_weak_scale' },
                  vulnerable_scale: { kind: 'blackboard', key: 'EntityBB_vulnerable_scale' },
                  duration: { kind: 'blackboard', key: 'EntityBB_bat_duration' },
                },
              }),
            ),
            2000,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0033_camille_normal_skill_listen_target_dead',
                target: 'enemy',
                source: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                asChildBuff: true,
              }),
            ),
            2000,
          ),
          scheduled(
            3,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0033_camille_normal_skill_bat_duration_icon',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  bat_duration: { kind: 'blackboard', key: 'EntityBB_bat_duration' },
                },
              }),
            ),
            6,
          ),
          scheduled(
            0,
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'EntityBB_atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'EntityBB_poise' },
                },
                'abilityentity_chr_0033_camille_normal_skill:chr_0033_camille_normal_skill_abilityrange_first:/childSkill/scheduledSequences/4/sequence/steps/1',
              ),
            ),
            1,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
