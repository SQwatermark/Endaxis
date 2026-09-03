/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const pogranichnikBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0029_pograni_attack1',
    timelineBlockFrames: 12,
    naturalDurationFrames: 118,
    exclusiveFrame: 17,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 7,
          endFrame: 29,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0029_pograni_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 29, sourceSkillIds: ['chr_0029_pograni_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0029_pograni_attack1:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
        9,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.230000004172325, 0.25, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.349999994039536, 0.370000004768372, 0.389999985694885, 0.409999996423721, 0.439999997615814,
      0.479999989271164, 0.519999980926514,
    ],
  },
);

export const pogranichnikBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0029_pograni_attack2',
    timelineBlockFrames: 19,
    naturalDurationFrames: 124,
    exclusiveFrame: 22,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 7,
          endFrame: 39,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0029_pograni_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 19, endFrame: 39, sourceSkillIds: ['chr_0029_pograni_attack3'] },
      ],
    },
    costFrame: 8,
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
            'chr_0029_pograni_attack2:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0199999995529652 },
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
        13,
      ),
      scheduled(
        14,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0029_pograni_attack2:/scheduledSequences/1/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0599999986588955 },
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
      0.140000000596046, 0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232,
      0.209999993443489, 0.219999998807907, 0.239999994635582, 0.25, 0.270000010728836,
      0.28999999165535, 0.319999992847443,
    ],
    display_atk_scale: [
      0.280000001192093, 0.310000002384186, 0.340000003576279, 0.360000014305115, 0.389999985694885,
      0.419999986886978, 0.449999988079071, 0.479999989271164, 0.5, 0.540000021457672,
      0.579999983310699, 0.629999995231628,
    ],
  },
);

export const pogranichnikBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0029_pograni_attack3',
    timelineBlockFrames: 19,
    naturalDurationFrames: 175,
    exclusiveFrame: 29,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 11,
          endFrame: 37,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0029_pograni_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 19, endFrame: 37, sourceSkillIds: ['chr_0029_pograni_attack4'] },
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
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack3:/scheduledSequences/0/sequence/steps/0',
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
        10,
      ),
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack3:/scheduledSequences/1/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
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
    atk_scale: [
      0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489, 0.230000004172325,
      0.25, 0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.340000003576279, 0.370000004768372,
    ],
    poise: 0,
    display_atk_scale: [
      0.330000013113022, 0.360000014305115, 0.400000005960464, 0.430000007152557, 0.46000000834465,
      0.5, 0.529999971389771, 0.560000002384186, 0.589999973773956, 0.639999985694885,
      0.680000007152557, 0.740000009536743,
    ],
  },
);

export const pogranichnikBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0029_pograni_attack4',
    timelineBlockFrames: 18,
    naturalDurationFrames: 125,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 10,
          endFrame: 33,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0029_pograni_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 33, sourceSkillIds: ['chr_0029_pograni_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        4,
      ),
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
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
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
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
      scheduled(
        11,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/3/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        12,
      ),
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/4/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        14,
      ),
      scheduled(
        17,
        sequence(
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
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.300000011920929,
                      inTangent: -11.1263599395752,
                      outTangent: -11.1263599395752,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.0508268289268017,
                      value: 0.0599999986588955,
                      inTangent: -0.846366584300995,
                      outTangent: 0.159801602363586,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.519971370697021,
                      value: 0.276642888784409,
                      inTangent: 0.906617224216461,
                      outTangent: 0.906617224216461,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 2.36347699165344,
                      outTangent: 2.36347699165344,
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
        20,
      ),
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0029_pograni_attack4:/scheduledSequences/6/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.166999995708466 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
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
      0.0599999986588955, 0.0700000002980232, 0.0799999982118607, 0.0799999982118607,
      0.0900000035762787, 0.100000001490116, 0.100000001490116, 0.109999999403954,
      0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
    ],
    poise: 0,
    display_atk_scale: [
      0.379999995231628, 0.419999986886978, 0.46000000834465, 0.5, 0.529999971389771,
      0.569999992847443, 0.610000014305115, 0.649999976158142, 0.689999997615814, 0.730000019073486,
      0.790000021457672, 0.860000014305115,
    ],
  },
);

export const pogranichnikBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0029_pograni_attack5',
    timelineBlockFrames: 24,
    naturalDurationFrames: 124,
    exclusiveFrame: 32,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 15,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0029_pograni_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 24, endFrame: 32, sourceSkillIds: ['chr_0029_pograni_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        16,
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
            'chr_0029_pograni_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'isHitbyMain',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
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
        17,
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'isHitbyMain' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
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
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        21,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 20,
    atk_scale: [
      0.430000007152557, 0.469999998807907, 0.519999980926514, 0.560000002384186, 0.600000023841858,
      0.649999976158142, 0.689999997615814, 0.730000019073486, 0.769999980926514, 0.829999983310699,
      0.889999985694885, 0.970000028610229,
    ],
    isHitbyMain: 0,
    poise: 18,
  },
);

export const pogranichnikFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0029_pograni_power_attack',
    timelineBlockFrames: 27,
    naturalDurationFrames: 145,
    exclusiveFrame: 47,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 27,
          endFrame: 49,
          sourceSkillIds: ['chr_0029_pograni_normal_skill', 'chr_0029_pograni_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        7,
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
            'chr_0029_pograni_power_attack:/scheduledSequences/0/sequence/steps/0',
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
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        10,
      ),
      scheduled(
        14,
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
            'chr_0029_pograni_power_attack:/scheduledSequences/1/sequence/steps/0',
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
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        25,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.800000011920929,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0029_pograni_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        27,
      ),
      scheduled(
        25,
        sequence(
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
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.550000011920929 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: { kind: 'named', key: 'char_hard_stop' },
                    finishByAction: false,
                    targets: ['enemy', 'caster'],
                  }),
                ),
              ),
            ),
          ),
        ),
        28,
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
        47,
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
        27,
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

export const pogranichnikPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0029_pograni_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 93,
    exclusiveFrame: 20,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0029_pograni_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const pogranichnikBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0029_pograni_normal_skill',
    timelineBlockFrames: 45,
    naturalDurationFrames: 218,
    exclusiveFrame: 55,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 48,
          endFrame: 55,
          sourceSkillIds: [
            'chr_0029_pograni_attack1',
            'chr_0029_pograni_attack2',
            'chr_0029_pograni_attack3',
            'chr_0029_pograni_attack4',
            'chr_0029_pograni_attack5',
          ],
        },
        { startFrame: 45, endFrame: 55, sourceSkillIds: ['chr_0029_pograni_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        38,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'num_1',
                query: {
                  kind: 'tag',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/NoGuard'],
                },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'num_1' },
                  operator: 'greater',
                  right: { kind: 'blackboard', key: 'num' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'num',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'num_1' },
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
        39,
      ),
      scheduled(
        38,
        sequence({
          kind: 'switch',
          parameters: { choice: { kind: 'blackboard', key: 'num' }, alwaysNext: true },
          options: [
            {
              value: { kind: 'constant', value: 1 },
              sequence: sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb1' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 2 },
              sequence: sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb2' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 3 },
              sequence: sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb3' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
              ),
            },
            {
              value: { kind: 'constant', value: 4 },
              sequence: sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb4' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
              ),
            },
          ],
        }),
        39,
      ),
      scheduled(
        28,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0029_pograni_normal_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.150000005960464 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        29,
      ),
      scheduled(
        38,
        sequence(
          step('applyPhysicalInfliction', {
            type: 'fracture',
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
            fractureBuffId: 'buff_physical_fracture',
            fractureDefinition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 3,
              triggerIntervalSeconds: 0,
              waitFirstTriggerInterval: false,
              maxTriggerCount: 0,
              applyTags: [],
              extendTags: [],
              blackboard: { count: 0, duration: 15 },
              attributeModifiers: [],
              lifecycleSequences: {
                start: sequence(
                  step('readBuffStackCount', {
                    target: 'buffOwner',
                    outputKey: 'count',
                    query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                  }),
                  step('readSkillSettingData', {
                    items: [
                      {
                        values: [12, 18, 24, 30],
                        column: { kind: 'blackboard', key: 'count' },
                        storeKey: 'duration',
                      },
                    ],
                  }),
                  step('applyBuff', {
                    buffId: 'buff_physical_do_fracture',
                    target: 'buffOwner',
                    source: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
                  }),
                ),
              },
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0029_pograni_normal_skill:/scheduledSequences/3/sequence/steps/1',
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
                  time: 0,
                  value: 1,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.150000005960464,
                  value: 1,
                  inTangent: Number.POSITIVE_INFINITY,
                  outTangent: -4.93032598495483,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.207737505435944,
                  value: 0.0199999995529652,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.697511315345764,
                  value: 0.0199999995529652,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 4.75383806228638,
                  outTangent: 4.75383806228638,
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
        39,
      ),
      scheduled(
        38,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_obtain_ultimate_sp',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        39,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_return: 15,
    atb1: 5,
    atb2: [10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15],
    atb3: [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    atb4: [30, 30, 30, 30, 30, 30, 30, 30, 30, 35, 35, 35],
    atk_scale: [
      0.860000014305115, 0.939999997615814, 1.02999997138977, 1.11000001430511, 1.20000004768372,
      1.27999997138977, 1.37000000476837, 1.45000004768372, 1.53999996185303, 1.64999997615814,
      1.76999998092651, 1.91999995708466,
    ],
    atk_scale2: [
      1.05999994277954, 1.1599999666214, 1.26999998092651, 1.37000000476837, 1.48000001907349,
      1.58000004291534, 1.69000005722046, 1.79999995231628, 1.89999997615814, 2.02999997138977,
      2.19000005722046, 2.38000011444092,
    ],
    cam_angle: 0,
    cam_duration: 0,
    has_potential1: 0,
    input_angle: 0,
    num: 0,
    num_1: 0,
    poise: 5,
  },
);

export const pogranichnikComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0029_pograni_combo_skill',
    timelineBlockFrames: 66,
    naturalDurationFrames: 728,
    exclusiveFrame: 649,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 66, endFrame: 96, sourceSkillIds: ['chr_0029_pograni_normal_skill'] },
        { startFrame: 266, endFrame: 296, sourceSkillIds: ['chr_0029_pograni_normal_skill'] },
        { startFrame: 442, endFrame: 460, sourceSkillIds: ['chr_0029_pograni_normal_skill'] },
        { startFrame: 628, endFrame: 660, sourceSkillIds: ['chr_0029_pograni_normal_skill'] },
        {
          startFrame: 72,
          endFrame: 96,
          sourceSkillIds: [
            'chr_0029_pograni_attack1',
            'chr_0029_pograni_attack2',
            'chr_0029_pograni_attack3',
            'chr_0029_pograni_attack4',
            'chr_0029_pograni_attack5',
          ],
        },
        {
          startFrame: 272,
          endFrame: 296,
          sourceSkillIds: [
            'chr_0029_pograni_attack1',
            'chr_0029_pograni_attack2',
            'chr_0029_pograni_attack3',
            'chr_0029_pograni_attack4',
            'chr_0029_pograni_attack5',
          ],
        },
        {
          startFrame: 446,
          endFrame: 460,
          sourceSkillIds: [
            'chr_0029_pograni_attack1',
            'chr_0029_pograni_attack2',
            'chr_0029_pograni_attack3',
            'chr_0029_pograni_attack4',
            'chr_0029_pograni_attack5',
          ],
        },
        {
          startFrame: 632,
          endFrame: 660,
          sourceSkillIds: [
            'chr_0029_pograni_attack1',
            'chr_0029_pograni_attack2',
            'chr_0029_pograni_attack3',
            'chr_0029_pograni_attack4',
            'chr_0029_pograni_attack5',
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
              buffIds: ['buff_chr_0029_pograni_combo_skill_count4'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'EntityBB_noguard_count',
                operation: 'assign',
                value: { kind: 'constant', value: 4 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: [
                  'buff_chr_0029_pograni_combo_skill_count1',
                  'buff_chr_0029_pograni_combo_skill_count2',
                  'buff_chr_0029_pograni_combo_skill_count3',
                  'buff_chr_0029_pograni_combo_skill_count4',
                ],
                reason: 'other',
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0029_pograni_combo_skill_count3'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'EntityBB_noguard_count',
                    operation: 'assign',
                    value: { kind: 'constant', value: 3 },
                  }),
                  step('finishBuffsById', {
                    target: 'enemy',
                    buffIds: [
                      'buff_chr_0029_pograni_combo_skill_count1',
                      'buff_chr_0029_pograni_combo_skill_count2',
                      'buff_chr_0029_pograni_combo_skill_count3',
                      'buff_chr_0029_pograni_combo_skill_count4',
                    ],
                    reason: 'other',
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0029_pograni_combo_skill_count2'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'EntityBB_noguard_count',
                        operation: 'assign',
                        value: { kind: 'constant', value: 2 },
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: [
                          'buff_chr_0029_pograni_combo_skill_count1',
                          'buff_chr_0029_pograni_combo_skill_count2',
                          'buff_chr_0029_pograni_combo_skill_count3',
                          'buff_chr_0029_pograni_combo_skill_count4',
                        ],
                        reason: 'other',
                      }),
                    ),
                    sequence(
                      step('modifyActionValue', {
                        key: 'EntityBB_noguard_count',
                        operation: 'assign',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: [
                          'buff_chr_0029_pograni_combo_skill_count1',
                          'buff_chr_0029_pograni_combo_skill_count2',
                          'buff_chr_0029_pograni_combo_skill_count3',
                          'buff_chr_0029_pograni_combo_skill_count4',
                        ],
                        reason: 'other',
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(step('jumpTimeline', { destinationFrame: 600 })),
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 2 },
                },
                sequence(step('jumpTimeline', { destinationFrame: 400 })),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 3 },
                    },
                    sequence(step('jumpTimeline', { destinationFrame: 200 })),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        1,
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
        200,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        201,
      ),
      scheduled(
        400,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        401,
      ),
      scheduled(
        600,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        601,
      ),
      scheduled(191, sequence(step('finishTimeline', {})), 194),
      scheduled(391, sequence(step('finishTimeline', {})), 394),
      scheduled(545, sequence(step('finishTimeline', {})), 548),
      scheduled(
        23,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/9/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
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
        26,
      ),
      scheduled(
        37,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/10/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        40,
      ),
      scheduled(
        61,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb4',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb4' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb4' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale4' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise4' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/11/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.600000023841858 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.449999988079071,
                  inTangent: -7.14686822891235,
                  outTangent: -7.14686822891235,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.0799999982118607,
                  value: 0.0500000007450581,
                  inTangent: 0.0647267028689384,
                  outTangent: 0.0647267028689384,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.454267412424088,
                  value: 0.0799999982118607,
                  inTangent: 0.096822053194046,
                  outTangent: 0.85744297504425,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 2.77354001998901,
                  outTangent: 2.77354001998901,
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
        64,
      ),
      scheduled(
        223,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/12/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
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
        226,
      ),
      scheduled(
        237,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/13/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        240,
      ),
      scheduled(
        261,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb3',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb3' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb3' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale3' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise3' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/14/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.600000023841858 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.449999988079071,
                  inTangent: -7.14686822891235,
                  outTangent: -7.14686822891235,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.0799999982118607,
                  value: 0.0500000007450581,
                  inTangent: 0.0647267028689384,
                  outTangent: 0.0647267028689384,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.454267412424088,
                  value: 0.0799999982118607,
                  inTangent: 0.096822053194046,
                  outTangent: 0.85744297504425,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 2.77354001998901,
                  outTangent: 2.77354001998901,
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
        264,
      ),
      scheduled(
        423,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/15/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
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
        426,
      ),
      scheduled(
        437,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/16/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        440,
      ),
      scheduled(
        623,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0029_pograni_combo_skill:/scheduledSequences/17/sequence/steps/2',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.133000001311302 },
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
        626,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.800000011920929 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        21,
      ),
      scheduled(
        200,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.800000011920929 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        221,
      ),
      scheduled(
        400,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.700000047683716 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        418,
      ),
      scheduled(
        600,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.733000040054321 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        619,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb_ratio: 1,
    atb1: 5,
    atb2: 7,
    atb3: 13,
    atb4: 23,
    atk_scale: [
      0.419999986886978, 0.46000000834465, 0.5, 0.550000011920929, 0.589999973773956,
      0.629999995231628, 0.670000016689301, 0.709999978542328, 0.759999990463257, 0.810000002384186,
      0.870000004768372, 0.949999988079071,
    ],
    atk_scale2: [
      0.540000021457672, 0.589999973773956, 0.649999976158142, 0.699999988079071, 0.759999990463257,
      0.810000002384186, 0.860000014305115, 0.920000016689301, 0.970000028610229, 1.03999996185303,
      1.12000000476837, 1.22000002861023,
    ],
    atk_scale3: [
      0.660000026226044, 0.730000019073486, 0.790000021457672, 0.860000014305115, 0.920000016689301,
      0.990000009536743, 1.05999994277954, 1.12000000476837, 1.19000005722046, 1.26999998092651,
      1.37000000476837, 1.49000000953674,
    ],
    atk_scale4: [
      1.32000005245209, 1.45000004768372, 1.58000004291534, 1.72000002861023, 1.85000002384186,
      1.98000001907349, 2.10999989509583, 2.24000000953674, 2.38000011444092, 2.53999996185303,
      2.74000000953674, 2.97000002861023,
    ],
    calc_atb1: 0,
    calc_atb2: 0,
    calc_atb3: 0,
    calc_atb4: 0,
    duration: 4,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise1: 3,
    poise2: 5,
    poise3: 4,
    poise4: 9,
    select_radius: 7,
    usp: 10,
  },
);

export const pogranichnikUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0029_pograni_ultimate_skill',
    timelineBlockFrames: 91,
    naturalDurationFrames: 210,
    exclusiveFrame: 90,
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
        74,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'ae1',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'ae2',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'ae3',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            target: 'enemy',
            saveToContextKey: 'ae4',
          }),
          step('setIgnoreGlobalTimeScale', {
            abilityEntityTargets: [{ kind: 'context', contextKey: 'ae1' }],
            ignore: true,
            revertOnEnd: true,
          }),
          step('setIgnoreGlobalTimeScale', {
            abilityEntityTargets: [{ kind: 'context', contextKey: 'ae2' }],
            ignore: true,
            revertOnEnd: true,
          }),
          step('setIgnoreGlobalTimeScale', {
            abilityEntityTargets: [{ kind: 'context', contextKey: 'ae3' }],
            ignore: true,
            revertOnEnd: true,
          }),
          step('setIgnoreGlobalTimeScale', {
            abilityEntityTargets: [{ kind: 'context', contextKey: 'ae4' }],
            ignore: true,
            revertOnEnd: true,
          }),
        ),
        77,
      ),
      scheduled(
        76,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_rush' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise_rush' },
            },
            'chr_0029_pograni_ultimate_skill:/scheduledSequences/3/sequence/steps/0',
          ),
        ),
        82,
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
        75,
      ),
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'soldiers',
            abilityEntityIds: ['abilityentity_chr_0029_pograni_ultimate_skill'],
          }),
          forEachContextTarget('soldiers', sequence(step('finishCurrentAbilityEntity', {}))),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0029_pograni_ultimate_skill'],
            reason: 'other',
          }),
        ),
        3,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 120,
    atb_final: [30, 30, 30, 30, 30, 30, 30, 30, 30, 40, 40, 40],
    atb_trigger: [7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 10, 10, 10],
    atk_scale_final: [
      2, 2.20000004768372, 2.40000009536743, 2.59999990463257, 2.79999995231628, 3,
      3.20000004768372, 3.40000009536743, 3.59999990463257, 3.84999990463257, 4.15000009536743, 4.5,
    ],
    atk_scale_rush: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.86000001430511, 2,
      2.13000011444092, 2.25999999046326, 2.40000009536743, 2.55999994277954, 2.75999999046326, 3,
    ],
    atk_scale_trigger: [
      0.449999988079071, 0.490000009536743, 0.529999971389771, 0.579999983310699, 0.620000004768372,
      0.670000016689301, 0.709999978542328, 0.759999990463257, 0.800000011920929, 0.860000014305115,
      0.920000016689301, 1,
    ],
    center_radius: 6,
    duration: 30,
    height: 4,
    poise_final: 15,
    poise_rush: 10,
    radius: 5,
  },
);

export default {
  slug: 'pogranichnik',
  gameId: 'POGRANICHNK',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'vanguard',
  mainAttribute: 'will',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [12, 31, 51, 71, 91, 101],
    agility: [13, 34, 55, 77, 99, 110],
    intellect: [10, 28, 48, 67, 87, 97],
    will: [20, 52, 87, 121, 156, 173],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        pogranichnikBasicAttack1,
        pogranichnikBasicAttack2,
        pogranichnikBasicAttack3,
        pogranichnikBasicAttack4,
        pogranichnikBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: pogranichnikFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: pogranichnikPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: pogranichnikBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: pogranichnikComboSkill,
    },
    {
      key: 'ultimate',
      skillType: 'ultimate',
      levelSource: 'ultimate',
      skills: pogranichnikUltimate,
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
        'basicAttack5',
        'finisher',
        'plungingAttack',
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
      event: 'beforeAddedBuff',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: [
              'Skill/Character/Common/PhysicalStatus/FractureStatus',
              'Skill/Character/Common/PhysicalStatus/CrushStatus',
            ],
          },
          sequence(
            branch(
              {
                kind: 'contextTargetBuffIdStackCompare',
                contextKey: 'trigger',
                buffIds: ['buff_physical_no_guard'],
                operator: 'greaterOrEqual',
                value: { kind: 'constant', value: 1 },
              },
              sequence(
                branch(
                  {
                    kind: 'contextTargetObjectTypeMatch',
                    contextKey: 'trigger',
                    objectTypeMask: 16400,
                  },
                  sequence(
                    step('readBuffStackCount', {
                      target: 'eventTarget',
                      outputKey: 'EntityBB_noguard_count',
                      query: { kind: 'id', buffIds: ['buff_physical_no_guard'] },
                    }),
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                        operator: 'equal',
                        right: { kind: 'constant', value: 4 },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0029_pograni_combo_skill_count4',
                          target: 'caster',
                          inheritSourceSkillCastInfo: true,
                        }),
                      ),
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                            operator: 'equal',
                            right: { kind: 'constant', value: 3 },
                          },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0029_pograni_combo_skill_count3',
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                            }),
                          ),
                          sequence(
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                                operator: 'equal',
                                right: { kind: 'constant', value: 2 },
                              },
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_combo_skill_count2',
                                  target: 'caster',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_combo_skill_count1',
                                  target: 'caster',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              { alwaysNext: true },
                            ),
                          ),
                          { alwaysNext: true },
                        ),
                      ),
                      { alwaysNext: true },
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
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'talent1',
      levels: 2,
      passiveSkills: [
        {
          key: 'chr_0029_pograni_talent1',
          blackboard: {
            atb_gain: [80, 80],
            atk_up: [0.0399999991059303, 0.0799999982118607],
            duration: [20, 20],
            max_stack_owner: [3, 3],
            max_stack_team: [3, 3],
            physpell_up: [4, 8],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0029_pograni_talent1_exist',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                atk_up: { kind: 'blackboard', key: 'atk_up' },
                max_stack_owner: { kind: 'blackboard', key: 'max_stack_owner' },
                physpell_up: { kind: 'blackboard', key: 'physpell_up' },
              },
            }),
            step('listenForCombatEvents', {
              responses: [
                {
                  key: 'native-event-1-0',
                  event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
                  phase: 'dataAction',
                  priority: 0,
                  sequence: sequence(
                    branch(
                      { kind: 'eventSpGainMatch', sources: ['skill'], gainKinds: ['gain'] },
                      sequence(
                        step('storeEventSpGainAmount', { outputKey: 'atb_contain_temp' }),
                        step('modifyActionValue', {
                          key: 'EntityBB_atb_contain',
                          operation: 'add',
                          value: { kind: 'blackboard', key: 'atb_contain_temp' },
                        }),
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'EntityBB_atb_contain' },
                            operator: 'greaterOrEqual',
                            right: { kind: 'blackboard', key: 'atb_gain' },
                          },
                          sequence(
                            step('calculateActionValue', {
                              key: 'atb_gain_minus',
                              operation: 'multiply',
                              left: { kind: 'blackboard', key: 'atb_gain' },
                              right: { kind: 'constant', value: -1 },
                            }),
                            step('modifyActionValue', {
                              key: 'EntityBB_atb_contain',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atb_gain_minus' },
                            }),
                            step('applyBuff', {
                              buffId: 'buff_chr_0029_pograni_talent1',
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                              asChildBuff: true,
                              blackboardAssignments: {
                                duration: { kind: 'blackboard', key: 'duration' },
                                atk_up: { kind: 'blackboard', key: 'atk_up' },
                                physpell_up: { kind: 'blackboard', key: 'physpell_up' },
                                max_stack: { kind: 'blackboard', key: 'max_stack_owner' },
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
    {
      key: 'talent2',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0029_pograni_talent2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { duration: [5, 10] },
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
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 15,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 20 },
        { kind: 'addStaticDamageIncrease', target: 'physical', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0029_pograni_talent1',
          blackboardKey: 'atb_gain',
          operation: 'assign',
          value: 60,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0029_pograni_talent1',
          blackboardKey: 'max_stack_owner',
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
          multiplier: 0.850000023841858,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        { kind: 'addSkillCooldownFrames', skillGroupKey: 'comboSkill', frames: -60 },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_ratio',
          operation: 'assign',
          value: 1.20000004768372,
        },
      ],
    },
  ],
  entityBlackboard: { EntityBB_atb_contain: 0, EntityBB_noguard_count: 0 },
  buffDefinitions: {
    buff_chr_0029_pograni_combo_skill_count1: {
      stackingType: 'overwriteDuration',
      priority: 0,
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/chr_0029_pgrani/combo/combo1'],
      extendTags: [],
      blackboard: { duration: 6 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_combo_skill_count2: {
      stackingType: 'overwriteDuration',
      priority: 0,
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/chr_0029_pgrani/combo/combo2'],
      extendTags: [],
      blackboard: { duration: 6 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_combo_skill_count3: {
      stackingType: 'overwriteDuration',
      priority: 0,
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/chr_0029_pgrani/combo/combo3'],
      extendTags: [],
      blackboard: { duration: 6 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_combo_skill_count4: {
      stackingType: 'overwriteDuration',
      priority: 0,
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Skill/Character/chr_0029_pgrani/combo/combo4'],
      extendTags: [],
      blackboard: { duration: 6 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_talent1: {
      stackingType: 'highPriorityWithMaxStack',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_pograni_talent_1',
        iconPath: '/icons/icon_battle_pograni_talent_1.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0.1, duration: 20, max_stack: 3, physpell_up: 10 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
        {
          attribute: 'PhysicalAndSpellInflictionEnhance',
          slot: 'baseAddition',
          value: { blackboardKey: 'physpell_up' },
        },
      ],
    },
    buff_chr_0029_pograni_talent1_exist: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0, max_stack_owner: 5, max_stack_team: 3, physpell_up: 0 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_talent2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 20 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_ultimate_skill: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_final: 0,
        atb_trigger: 0,
        atk_scale_final: 0,
        atk_scale_rush: 0,
        atk_scale_trigger: 0,
        count: 5,
        duration: 20,
        poise_final: 0,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0029_pograni_ultimate_skill_count',
            target: 'buffSource',
            source: 'buffSource',
            count: { kind: 'blackboard', key: 'count' },
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: { duration: { kind: 'blackboard', key: 'duration' } },
          }),
        ),
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura',
            target: 'enemy',
            source: 'buffOwner',
            finishByAction: true,
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              atk_scale_trigger: { kind: 'blackboard', key: 'atk_scale_trigger' },
              atk_scale_final: { kind: 'blackboard', key: 'atk_scale_final' },
              atb_trigger: { kind: 'blackboard', key: 'atb_trigger' },
              atb_final: { kind: 'blackboard', key: 'atb_final' },
              poise_final: { kind: 'blackboard', key: 'poise_final' },
            },
          }),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0029_pograni_ultimate_skill_effect_layer'],
            reason: 'other',
          }),
        ),
      },
    },
    buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_final: 0,
        atb_trigger: 0,
        atk_scale_final: 0,
        atk_scale_trigger: 0,
        atk_up_temp: 0,
        duration: 20,
        duration_temp: 0,
        interval: 0.1,
        max_stack_owner_temp: 0,
        max_stack_team_temp: 0,
        physpell_up_temp: 0,
        poise_final: 0,
        radius: 5,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakePhysicalInfliction',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'chr_0029_pograni_soldier_attacked',
                },
              },
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                    operator: 'equal',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                      reason: 'other',
                      count: { kind: 'constant', value: 1 },
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill_finall_rush',
                      target: 'buffOwner',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        atk_scale_final: { kind: 'blackboard', key: 'atk_scale_final' },
                        atb_final: { kind: 'blackboard', key: 'atb_final' },
                        poise_final: { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'chr_0029_pograni_soldier_attacked',
                      durationSeconds: { kind: 'blackboard', key: 'interval' },
                      autoFinishByAction: false,
                    }),
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0029_pograni_talent2'],
                        operator: 'greaterOrEqual',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        branch(
                          {
                            kind: 'buffIdStackCompare',
                            target: 'caster',
                            buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                            operator: 'greaterOrEqual',
                            value: { kind: 'constant', value: 1 },
                          },
                          sequence(
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                              desiredKey: 'duration',
                              outputKey: 'duration_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'atk_up',
                              outputKey: 'atk_up_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'physpell_up',
                              outputKey: 'physpell_up_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'max_stack_owner',
                              outputKey: 'max_stack_owner_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'max_stack_team',
                              outputKey: 'max_stack_team_temp',
                            }),
                            branch(
                              {
                                kind: 'actionInputTargetIdentityMatch',
                                other: 'actionSource',
                                operator: 'equal',
                              },
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_talent1',
                                  target: 'eventTarget',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    duration: { kind: 'blackboard', key: 'duration_temp' },
                                    atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                    physpell_up: { kind: 'blackboard', key: 'physpell_up_temp' },
                                    max_stack: { kind: 'blackboard', key: 'max_stack_owner_temp' },
                                  },
                                }),
                              ),
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_talent1',
                                  target: 'eventTarget',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    duration: { kind: 'blackboard', key: 'duration_temp' },
                                    atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                    physpell_up: { kind: 'blackboard', key: 'physpell_up_temp' },
                                    max_stack: { kind: 'blackboard', key: 'max_stack_team_temp' },
                                  },
                                }),
                              ),
                              { alwaysNext: true },
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
        {
          event: 'beforeTakePhysicalInfliction',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'caster',
                  markerId: 'chr_0029_pograni_soldier_attacked',
                },
              },
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                    operator: 'greater',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(
                    step('spawnAbilityEntity', {
                      abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
                      childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_attack2',
                      inheritActionBlackboard: true,
                      inheritSourceSkillCastInfo: true,
                      dieWhenSourceDies: false,
                      target: 'enemy',
                    }),
                    step('finishBuffsById', {
                      target: 'caster',
                      buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                      reason: 'other',
                      count: { kind: 'constant', value: 1 },
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'chr_0029_pograni_soldier_attacked',
                      durationSeconds: { kind: 'blackboard', key: 'interval' },
                      autoFinishByAction: false,
                    }),
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0029_pograni_talent2'],
                        operator: 'greaterOrEqual',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        branch(
                          {
                            kind: 'buffIdStackCompare',
                            target: 'caster',
                            buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                            operator: 'greaterOrEqual',
                            value: { kind: 'constant', value: 1 },
                          },
                          sequence(
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                              desiredKey: 'duration',
                              outputKey: 'duration_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'atk_up',
                              outputKey: 'atk_up_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'physpell_up',
                              outputKey: 'physpell_up_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'max_stack_owner',
                              outputKey: 'max_stack_owner_temp',
                            }),
                            step('readBuffBlackboard', {
                              target: 'caster',
                              query: {
                                kind: 'id',
                                buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                              },
                              desiredKey: 'max_stack_team',
                              outputKey: 'max_stack_team_temp',
                            }),
                            branch(
                              {
                                kind: 'actionInputTargetIdentityMatch',
                                other: 'actionSource',
                                operator: 'equal',
                              },
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_talent1',
                                  target: 'eventTarget',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    duration: { kind: 'blackboard', key: 'duration_temp' },
                                    atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                    physpell_up: { kind: 'blackboard', key: 'physpell_up_temp' },
                                    max_stack: { kind: 'blackboard', key: 'max_stack_owner_temp' },
                                  },
                                }),
                              ),
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0029_pograni_talent1',
                                  target: 'eventTarget',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    duration: { kind: 'blackboard', key: 'duration_temp' },
                                    atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                    physpell_up: { kind: 'blackboard', key: 'physpell_up_temp' },
                                    max_stack: { kind: 'blackboard', key: 'max_stack_team_temp' },
                                  },
                                }),
                              ),
                              { alwaysNext: true },
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
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'buffSource',
                  markerId: 'chr_0029_pograni_soldier_attacked',
                },
              },
              sequence(
                branch(
                  { kind: 'eventSourceMatchesBuffSource' },
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'buffSource',
                        buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        branch(
                          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['comboSkill'] },
                          sequence(
                            step('finishBuffsById', {
                              target: 'caster',
                              buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                              reason: 'other',
                              count: { kind: 'constant', value: 1 },
                            }),
                            step('applyBuff', {
                              buffId: 'buff_chr_0029_pograni_ultimate_skill_finall_rush',
                              target: 'buffOwner',
                              source: 'buffSource',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_scale_final: { kind: 'blackboard', key: 'atk_scale_final' },
                                atb_final: { kind: 'blackboard', key: 'atb_final' },
                                poise_final: { kind: 'blackboard', key: 'poise_final' },
                              },
                            }),
                            step('createTimedMarker', {
                              target: 'buffSource',
                              markerId: 'chr_0029_pograni_soldier_attacked',
                              durationSeconds: { kind: 'blackboard', key: 'interval' },
                              autoFinishByAction: false,
                            }),
                            branch(
                              {
                                kind: 'buffIdStackCompare',
                                target: 'buffSource',
                                buffIds: ['buff_chr_0029_pograni_talent2'],
                                operator: 'greaterOrEqual',
                                value: { kind: 'constant', value: 1 },
                              },
                              sequence(
                                branch(
                                  {
                                    kind: 'buffIdStackCompare',
                                    target: 'buffSource',
                                    buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                    operator: 'greaterOrEqual',
                                    value: { kind: 'constant', value: 1 },
                                  },
                                  sequence(
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent2'],
                                      },
                                      desiredKey: 'duration',
                                      outputKey: 'duration_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'atk_up',
                                      outputKey: 'atk_up_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'physpell_up',
                                      outputKey: 'physpell_up_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'max_stack_owner',
                                      outputKey: 'max_stack_owner_temp',
                                    }),
                                    step('applyBuff', {
                                      buffId: 'buff_chr_0029_pograni_talent1',
                                      target: 'buffSource',
                                      source: 'buffSource',
                                      inheritSourceSkillCastInfo: true,
                                      blackboardAssignments: {
                                        duration: { kind: 'blackboard', key: 'duration_temp' },
                                        atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                        physpell_up: {
                                          kind: 'blackboard',
                                          key: 'physpell_up_temp',
                                        },
                                        max_stack: {
                                          kind: 'blackboard',
                                          key: 'max_stack_owner_temp',
                                        },
                                      },
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
                ),
              ),
            ),
          ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'not',
                condition: {
                  kind: 'timedMarkerPresent',
                  target: 'buffSource',
                  markerId: 'chr_0029_pograni_soldier_attacked',
                },
              },
              sequence(
                branch(
                  { kind: 'eventSourceMatchesBuffSource' },
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'buffSource',
                        buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                        operator: 'greater',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        branch(
                          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['comboSkill'] },
                          sequence(
                            step('spawnAbilityEntity', {
                              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
                              childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_attack2',
                              inheritActionBlackboard: true,
                              inheritSourceSkillCastInfo: true,
                              dieWhenSourceDies: false,
                              target: 'enemy',
                            }),
                            step('finishBuffsById', {
                              target: 'caster',
                              buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                              reason: 'other',
                              count: { kind: 'constant', value: 1 },
                            }),
                            step('createTimedMarker', {
                              target: 'buffSource',
                              markerId: 'chr_0029_pograni_soldier_attacked',
                              durationSeconds: { kind: 'blackboard', key: 'interval' },
                              autoFinishByAction: false,
                            }),
                            branch(
                              {
                                kind: 'buffIdStackCompare',
                                target: 'buffSource',
                                buffIds: ['buff_chr_0029_pograni_talent2'],
                                operator: 'greaterOrEqual',
                                value: { kind: 'constant', value: 1 },
                              },
                              sequence(
                                branch(
                                  {
                                    kind: 'buffIdStackCompare',
                                    target: 'buffSource',
                                    buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                    operator: 'greaterOrEqual',
                                    value: { kind: 'constant', value: 1 },
                                  },
                                  sequence(
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent2'],
                                      },
                                      desiredKey: 'duration',
                                      outputKey: 'duration_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'atk_up',
                                      outputKey: 'atk_up_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'physpell_up',
                                      outputKey: 'physpell_up_temp',
                                    }),
                                    step('readBuffBlackboard', {
                                      target: 'buffSource',
                                      query: {
                                        kind: 'id',
                                        buffIds: ['buff_chr_0029_pograni_talent1_exist'],
                                      },
                                      desiredKey: 'max_stack_owner',
                                      outputKey: 'max_stack_owner_temp',
                                    }),
                                    step('applyBuff', {
                                      buffId: 'buff_chr_0029_pograni_talent1',
                                      target: 'buffSource',
                                      source: 'buffSource',
                                      inheritSourceSkillCastInfo: true,
                                      blackboardAssignments: {
                                        duration: { kind: 'blackboard', key: 'duration_temp' },
                                        atk_up: { kind: 'blackboard', key: 'atk_up_temp' },
                                        physpell_up: {
                                          kind: 'blackboard',
                                          key: 'physpell_up_temp',
                                        },
                                        max_stack: {
                                          kind: 'blackboard',
                                          key: 'max_stack_owner_temp',
                                        },
                                      },
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
                ),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0029_pograni_ultimate_skill_count: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_pograni_buff',
        iconPath: '/icons/icon_battle_pograni_buff.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { count: 4, duration: 30 },
      attributeModifiers: [],
    },
    buff_chr_0029_pograni_ultimate_skill_finall_rush: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1.20000004768372,
      applyTags: [],
      extendTags: [],
      blackboard: { atb_final: 0, atk_scale_final: 0, count: 4, duration: 20, poise_final: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
              inheritActionBlackboard: true,
              inheritSourceSkillCastInfo: true,
              dieWhenSourceDies: false,
              target: 'enemy',
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
              inheritActionBlackboard: true,
              inheritSourceSkillCastInfo: true,
              dieWhenSourceDies: false,
              target: 'enemy',
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
              inheritActionBlackboard: true,
              inheritSourceSkillCastInfo: true,
              dieWhenSourceDies: false,
              target: 'enemy',
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              childSkillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
              inheritActionBlackboard: true,
              inheritSourceSkillCastInfo: true,
              dieWhenSourceDies: false,
              target: 'enemy',
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('startTimeDilation', {
              scope: 'global',
              durationSeconds: { kind: 'constant', value: 1 },
              slot: 'unassigned',
              priority: 100,
              curve: { kind: 'named', key: 'ComboSkill' },
              finishByAction: false,
              ignoredTargets: [],
              ignoredAbilityEntityTargets: [
                {
                  kind: 'ownerSpawned',
                  abilityEntityIds: ['abilityentity_chr_0029_pograni_ultimate_skill'],
                },
              ],
            }),
          ),
          30,
        ),
      ],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0029_pograni_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0029_pgrani/Soldier',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkills: {
        chr_0029_pograni_ultimate_skill_abilityentity: {
          skillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
          blackboard: {
            atb_final: 0,
            atb_trigger: 4,
            atk_scale_final: 0,
            atk_scale_rush: 1,
            atk_scale_trigger: 0,
            duration: 20,
            poise_final: 0,
            radius: 5,
          },
          scheduledSequences: [
            scheduled(50, sequence(step('finishActionOwnerAbilityEntity', {})), 53),
            scheduled(
              3,
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill'],
                    operator: 'equal',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        duration: { kind: 'blackboard', key: 'duration' },
                        atk_scale_trigger: { kind: 'blackboard', key: 'atk_scale_trigger' },
                        atk_scale_final: { kind: 'blackboard', key: 'atk_scale_final' },
                        atb_trigger: { kind: 'blackboard', key: 'atb_trigger' },
                        atb_final: { kind: 'blackboard', key: 'atb_final' },
                        poise_final: { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                  ),
                ),
              ),
              17,
            ),
          ],
        },
        chr_0029_pograni_ultimate_skill_abilityentity_attack2: {
          skillId: 'chr_0029_pograni_ultimate_skill_abilityentity_attack2',
          blackboard: {
            atb_trigger: 10,
            atk_scale_trigger: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            radius: 5,
          },
          scheduledSequences: [
            scheduled(
              0,
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                    operator: 'equal',
                    value: { kind: 'constant', value: 5 },
                  },
                  sequence(),
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 4 },
                      },
                      sequence(step('jumpTimeline', { destinationFrame: 100 })),
                      sequence(
                        branch(
                          {
                            kind: 'buffIdStackCompare',
                            target: 'caster',
                            buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                            operator: 'equal',
                            value: { kind: 'constant', value: 3 },
                          },
                          sequence(step('jumpTimeline', { destinationFrame: 200 })),
                          sequence(
                            branch(
                              {
                                kind: 'buffIdStackCompare',
                                target: 'caster',
                                buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                                operator: 'equal',
                                value: { kind: 'constant', value: 2 },
                              },
                              sequence(step('jumpTimeline', { destinationFrame: 300 })),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
                          { alwaysNext: true },
                        ),
                      ),
                      { alwaysNext: true },
                    ),
                  ),
                  { alwaysNext: true },
                ),
              ),
              3,
            ),
            scheduled(59, sequence(step('finishActionOwnerAbilityEntity', {})), 62),
            scheduled(157, sequence(step('finishActionOwnerAbilityEntity', {})), 160),
            scheduled(257, sequence(step('finishActionOwnerAbilityEntity', {})), 260),
            scheduled(357, sequence(step('finishActionOwnerAbilityEntity', {})), 360),
            scheduled(
              9,
              sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb_trigger' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
                    tags: ['ultimateSkill'],
                  },
                  'abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity|chr_0029_pograni_ultimate_skill_abilityentity_attack2|chr_0029_pograni_ultimate_skill_abilityentity_finish4:/childSkills/chr_0029_pograni_ultimate_skill_abilityentity_attack2/scheduledSequences/5/sequence/steps/1',
                ),
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'char_normal_attack' },
                  finishByAction: false,
                  targets: ['enemy'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              13,
            ),
            scheduled(
              108,
              sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb_trigger' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
                    tags: ['ultimateSkill'],
                  },
                  'abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity|chr_0029_pograni_ultimate_skill_abilityentity_attack2|chr_0029_pograni_ultimate_skill_abilityentity_finish4:/childSkills/chr_0029_pograni_ultimate_skill_abilityentity_attack2/scheduledSequences/6/sequence/steps/1',
                ),
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'char_normal_attack' },
                  finishByAction: false,
                  targets: ['enemy'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              112,
            ),
            scheduled(
              209,
              sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb_trigger' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
                    tags: ['ultimateSkill'],
                  },
                  'abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity|chr_0029_pograni_ultimate_skill_abilityentity_attack2|chr_0029_pograni_ultimate_skill_abilityentity_finish4:/childSkills/chr_0029_pograni_ultimate_skill_abilityentity_attack2/scheduledSequences/7/sequence/steps/1',
                ),
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'char_normal_attack' },
                  finishByAction: false,
                  targets: ['enemy'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              213,
            ),
            scheduled(
              307,
              sequence(
                step('changeResourceByActionValue', {
                  resource: 'sp',
                  amount: { kind: 'blackboard', key: 'atb_trigger' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'team',
                  spGainKind: 'gain',
                  spGainSource: 'skill',
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
                    tags: ['ultimateSkill'],
                  },
                  'abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity|chr_0029_pograni_ultimate_skill_abilityentity_attack2|chr_0029_pograni_ultimate_skill_abilityentity_finish4:/childSkills/chr_0029_pograni_ultimate_skill_abilityentity_attack2/scheduledSequences/8/sequence/steps/1',
                ),
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 10,
                  curve: { kind: 'named', key: 'char_normal_attack' },
                  finishByAction: false,
                  targets: ['enemy'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              311,
            ),
            scheduled(
              0,
              sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 30,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 0.300000011920929,
                        inTangent: -11.5167388916016,
                        outTangent: -11.5167388916016,
                        weightedMode: 2,
                        inWeight: 0,
                        outWeight: 0.318046420812607,
                      },
                      {
                        time: 0.0549403615295887,
                        value: 0.0430396609008312,
                        inTangent: 0.115633718669415,
                        outTangent: 0.115633718669415,
                        weightedMode: 1,
                        inWeight: 0.333333343267441,
                        outWeight: 0.658006191253662,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 4.71006631851196,
                        outTangent: 4.71006631851196,
                        weightedMode: 1,
                        inWeight: 0.240747705101967,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['caster'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              3,
            ),
            scheduled(
              100,
              sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 30,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 0.300000011920929,
                        inTangent: -11.5167388916016,
                        outTangent: -11.5167388916016,
                        weightedMode: 2,
                        inWeight: 0,
                        outWeight: 0.318046420812607,
                      },
                      {
                        time: 0.0549403615295887,
                        value: 0.0430396609008312,
                        inTangent: 0.115633718669415,
                        outTangent: 0.115633718669415,
                        weightedMode: 1,
                        inWeight: 0.333333343267441,
                        outWeight: 0.658006191253662,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 4.71006631851196,
                        outTangent: 4.71006631851196,
                        weightedMode: 1,
                        inWeight: 0.240747705101967,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['caster'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              103,
            ),
            scheduled(
              200,
              sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 30,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 0.300000011920929,
                        inTangent: -11.5167388916016,
                        outTangent: -11.5167388916016,
                        weightedMode: 2,
                        inWeight: 0,
                        outWeight: 0.318046420812607,
                      },
                      {
                        time: 0.0549403615295887,
                        value: 0.0430396609008312,
                        inTangent: 0.115633718669415,
                        outTangent: 0.115633718669415,
                        weightedMode: 1,
                        inWeight: 0.333333343267441,
                        outWeight: 0.658006191253662,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 4.71006631851196,
                        outTangent: 4.71006631851196,
                        weightedMode: 1,
                        inWeight: 0.240747705101967,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['caster'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              203,
            ),
            scheduled(
              300,
              sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 30,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 0.300000011920929,
                        inTangent: -11.5167388916016,
                        outTangent: -11.5167388916016,
                        weightedMode: 2,
                        inWeight: 0,
                        outWeight: 0.318046420812607,
                      },
                      {
                        time: 0.0549403615295887,
                        value: 0.0430396609008312,
                        inTangent: 0.115633718669415,
                        outTangent: 0.115633718669415,
                        weightedMode: 1,
                        inWeight: 0.333333343267441,
                        outWeight: 0.658006191253662,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 4.71006631851196,
                        outTangent: 4.71006631851196,
                        weightedMode: 1,
                        inWeight: 0.240747705101967,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['caster'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              303,
            ),
          ],
        },
        chr_0029_pograni_ultimate_skill_abilityentity_finish4: {
          skillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
          blackboard: {
            atb_final: 50,
            atk_scale_final: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_final: 0,
            radius: 5,
          },
          scheduledSequences: [
            scheduled(75, sequence(step('finishActionOwnerAbilityEntity', {})), 78),
            scheduled(
              31,
              sequence(
                step('finishBuffsById', {
                  target: 'caster',
                  buffIds: ['buff_chr_0029_pograni_ultimate_skill'],
                  reason: 'other',
                }),
              ),
              38,
            ),
            scheduled(
              25,
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'chr_0029_pograni_ultimate_finalhit',
                    },
                  },
                  sequence(
                    step('changeResourceByActionValue', {
                      resource: 'sp',
                      amount: { kind: 'blackboard', key: 'atb_final' },
                      coefficient: { kind: 'constant', value: 1 },
                      recipient: 'team',
                      spGainKind: 'gain',
                      spGainSource: 'skill',
                    }),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'chr_0029_pograni_ultimate_finalhit',
                      durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                      autoFinishByAction: false,
                    }),
                    step(
                      'dealDamage',
                      {
                        damageType: 'physical',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['ultimateSkill'],
                        features: ['canBreakWeakness'],
                        stagger: { kind: 'blackboard', key: 'poise_final' },
                      },
                      'abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity|chr_0029_pograni_ultimate_skill_abilityentity_attack2|chr_0029_pograni_ultimate_skill_abilityentity_finish4:/childSkills/chr_0029_pograni_ultimate_skill_abilityentity_finish4/scheduledSequences/2/sequence/steps/0/whenTrue/steps/2',
                    ),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              52,
            ),
            scheduled(
              0,
              sequence(
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 30,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 0.300000011920929,
                        inTangent: -11.5167388916016,
                        outTangent: -11.5167388916016,
                        weightedMode: 2,
                        inWeight: 0,
                        outWeight: 0.318046420812607,
                      },
                      {
                        time: 0.0500000007450581,
                        value: 0.00999999977648258,
                        inTangent: 0.158760190010071,
                        outTangent: 0.0561449825763702,
                        weightedMode: 3,
                        inWeight: 0.333333343267441,
                        outWeight: 0.735918760299683,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 3.72562432289124,
                        outTangent: 3.72562432289124,
                        weightedMode: 1,
                        inWeight: 0.306914865970612,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['caster'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              3,
            ),
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
