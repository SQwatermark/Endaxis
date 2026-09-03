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

export const rossiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0028_wulfa_attack1',
    timelineBlockFrames: 9,
    naturalDurationFrames: 139,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 3,
          endFrame: 34,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 9, endFrame: 34, sourceSkillIds: ['chr_0028_wulfa_attack2'] },
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
            'chr_0028_wulfa_attack1:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
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
      0.270000010728836, 0.300000011920929, 0.319999992847443, 0.349999994039536, 0.379999995231628,
      0.409999996423721, 0.430000007152557, 0.46000000834465, 0.490000009536743, 0.519999980926514,
      0.560000002384186, 0.610000014305115,
    ],
  },
);

export const rossiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0028_wulfa_attack2',
    timelineBlockFrames: 12,
    naturalDurationFrames: 151,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 4,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 12, endFrame: 34, sourceSkillIds: ['chr_0028_wulfa_attack3'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack2:/scheduledSequences/0/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
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
        9,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack2:/scheduledSequences/1/sequence/steps/0',
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
      0.319999992847443, 0.349999994039536, 0.379999995231628, 0.409999996423721, 0.439999997615814,
      0.469999998807907, 0.5, 0.540000021457672, 0.569999992847443, 0.610000014305115,
      0.649999976158142, 0.709999978542328,
    ],
    poise: 0,
  },
);

export const rossiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0028_wulfa_attack3',
    timelineBlockFrames: 15,
    naturalDurationFrames: 209,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 5,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 15, endFrame: 36, sourceSkillIds: ['chr_0028_wulfa_attack4'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0028_wulfa_attack3:/scheduledSequences/0/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0299999993294477 },
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
        5,
      ),
      scheduled(
        12,
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
            'chr_0028_wulfa_attack3:/scheduledSequences/1/sequence/steps/0',
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
        13,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.340000003576279, 0.370000004768372, 0.409999996423721, 0.439999997615814, 0.479999989271164,
      0.509999990463257, 0.540000021457672, 0.579999983310699, 0.610000014305115, 0.649999976158142,
      0.709999978542328, 0.769999980926514,
    ],
    poise: 0,
  },
);

export const rossiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0028_wulfa_attack4',
    timelineBlockFrames: 225,
    naturalDurationFrames: 329,
    exclusiveFrame: 239,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 18,
          endFrame: 65,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack5',
        },
        {
          startFrame: 207,
          endFrame: 246,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 36, endFrame: 67, sourceSkillIds: ['chr_0028_wulfa_attack5'] },
        { startFrame: 225, endFrame: 250, sourceSkillIds: ['chr_0028_wulfa_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(step('jumpTimeline', { destinationFrame: 189 })),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        6,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.200000002980232 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/1/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
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
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
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
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/3/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
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
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/4/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
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
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/5/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        195,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/6/sequence/steps/1',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        197,
      ),
      scheduled(
        198,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/7/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        199,
      ),
      scheduled(
        203,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/8/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        205,
      ),
      scheduled(
        205,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/9/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        207,
      ),
      scheduled(
        213,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0028_wulfa_attack4:/scheduledSequences/10/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: { kind: 'constant', value: 0.25 },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        215,
      ),
      scheduled(188, sequence(step('finishTimeline', {})), 189),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.409999996423721, 0.449999988079071, 0.490000009536743, 0.529999971389771, 0.569999992847443,
      0.610000014305115, 0.649999976158142, 0.689999997615814, 0.730000019073486, 0.779999971389771,
      0.839999973773956, 0.910000026226044,
    ],
    poise: 0,
  },
);

export const rossiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0028_wulfa_attack5',
    timelineBlockFrames: 31,
    naturalDurationFrames: 146,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 27,
          endFrame: 60,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0028_wulfa_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 60, sourceSkillIds: ['chr_0028_wulfa_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        15,
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
        15,
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
            'chr_0028_wulfa_attack5:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'isHitbyMain',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        17,
      ),
      scheduled(
        16,
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
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0.00292397406883538,
                      value: 0.200000002980232,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.124178200960159,
                      value: 0.100000001490116,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.5,
                      value: 0.100000001490116,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.200000002980232,
                      inTangent: 0,
                      outTangent: 0,
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
        18,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 21,
    atk_scale: [
      0.5, 0.550000011920929, 0.600000023841858, 0.649999976158142, 0.699999988079071, 0.75,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.959999978542328, 1.03999996185303,
      1.12999999523163,
    ],
    isHitbyMain: 0,
    poise: 18,
  },
);

export const rossiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0028_wulfa_power_attack',
    timelineBlockFrames: 66,
    naturalDurationFrames: 216,
    exclusiveFrame: 65,
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
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
                    'chr_0028_wulfa_power_attack:/scheduledSequences/0/sequence/steps/0/body/steps/0/whenTrue/steps/0',
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
                        targets: ['caster'],
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
        8,
      ),
      scheduled(
        15,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
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
                    'chr_0028_wulfa_power_attack:/scheduledSequences/1/sequence/steps/0/body/steps/0/whenTrue/steps/0',
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
                        targets: ['caster'],
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
        17,
      ),
      scheduled(
        36,
        sequence(
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.800000011920929,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0028_wulfa_power_attack:/scheduledSequences/2/sequence/steps/1',
          ),
        ),
        39,
      ),
      scheduled(
        38,
        sequence(
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
                  value: 0.0500000007450581,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.100000001490116,
                  value: 0.0500000007450581,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.593569815158844,
                  value: 0.0500000007450581,
                  inTangent: -0.0204695295542479,
                  outTangent: -0.0204695295542479,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 3.48396492004395,
                  outTangent: 3.48396492004395,
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
        41,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
              operator: 'greater',
              value: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_powerattack_resumecombo',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
          ),
        ),
        65,
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
        65,
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
        65,
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

export const rossiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0028_wulfa_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 161,
    exclusiveFrame: 20,
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
            'chr_0028_wulfa_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const rossiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0028_wulfa_normal_skill',
    timelineBlockFrames: 38,
    naturalDurationFrames: 475,
    exclusiveFrame: 272,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 38,
          endFrame: 56,
          sourceSkillIds: [
            'chr_0028_wulfa_normal_skill',
            'chr_0028_wulfa_combo_2_skill',
            'chr_0028_wulfa_combo_3_skill',
          ],
        },
        {
          startFrame: 258,
          endFrame: 277,
          sourceSkillIds: [
            'chr_0028_wulfa_normal_skill',
            'chr_0028_wulfa_combo_2_skill',
            'chr_0028_wulfa_combo_3_skill',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.300000011920929 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0028_wulfa_normal_skill:/scheduledSequences/0/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
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
        20,
      ),
      scheduled(
        22,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.300000011920929 },
          }),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0028_wulfa_normal_skill:/scheduledSequences/1/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
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
        26,
      ),
      scheduled(
        35,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.400000005960464 },
          }),
          step('modifyActionValue', {
            key: 'trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              branch(
                { kind: 'targetStaggered', target: 'enemy' },
                sequence(
                  step('modifyActionValue', {
                    key: 'FollowAttackTrigger',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
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
                    duration: { kind: 'constant', value: 1.20000004768372 },
                    height: { kind: 'constant', value: 1.5 },
                    speedFactorMultiplier: 1,
                    force: false,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_1' },
                    },
                    'chr_0028_wulfa_normal_skill:/scheduledSequences/2/sequence/steps/2/body/steps/0/whenTrue/steps/2',
                  ),
                  step('modifyActionValue', {
                    key: 'trigger',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
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
                              value: 0.0500000007450581,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.100000001490116,
                              value: 0.0500000007450581,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.738919615745544,
                              value: 0.0547380782663822,
                              inTangent: 0.021058140322566,
                              outTangent: 0.021058140322566,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 1,
                              value: 0.5,
                              inTangent: 0,
                              outTangent: 0,
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
                    duration: { kind: 'constant', value: 1.20000004768372 },
                    height: { kind: 'constant', value: 1.5 },
                    speedFactorMultiplier: 1,
                    force: false,
                    targetFilter: 'aliveOnly',
                    returnWhen: 'always',
                  }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise_1' },
                    },
                    'chr_0028_wulfa_normal_skill:/scheduledSequences/2/sequence/steps/2/body/steps/0/whenFalse/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'trigger',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
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
                              value: 0.0500000007450581,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.100000001490116,
                              value: 0.0500000007450581,
                              inTangent: 0,
                              outTangent: 0,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 0.738919615745544,
                              value: 0.0547380782663822,
                              inTangent: 0.021058140322566,
                              outTangent: 0.021058140322566,
                              weightedMode: 0,
                              inWeight: 0,
                              outWeight: 0,
                            },
                            {
                              time: 1,
                              value: 0.5,
                              inTangent: 0,
                              outTangent: 0,
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
        37,
      ),
      scheduled(
        230,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_smarttarget',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_wolf_timer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[2]:projectile_chr_0028_wulfa_normalskill_2',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[2]:chr_0028_wulfa_normal_skill_projhit2',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/2/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
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
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                      ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[3]:projectile_chr_0028_wulfa_normalskill_3',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[3]:chr_0028_wulfa_normal_skill_projhit3',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_tut_normalskill_success',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/3/body/steps/0/body/steps/0/body/steps/3/whenFalse/steps/0',
                          ),
                        ),
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
                          kind: 'buffIdStackCompare',
                          target: 'enemy',
                          buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('calculateActionValue', {
                            key: 'hit_bleed_num',
                            operation: 'add',
                            left: { kind: 'blackboard', key: 'hit_bleed_num' },
                            right: { kind: 'constant', value: 1 },
                          }),
                        ),
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
                      branch(
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                      ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[4]:projectile_chr_0028_wulfa_normalskill_4',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[4]:chr_0028_wulfa_normal_skill_projhit4',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/4/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
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
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                      ),
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
          withActionBlackboardScope(
            'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[5]:projectile_chr_0028_wulfa_normalskill_5',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0028_wulfa_normal_skill.actionGroupData.timelineActions[26]._sequenceActionData.actionData[5]:chr_0028_wulfa_normal_skill_projhit5',
                {
                  atb_return: 10,
                  atk_scale_3: 3,
                  atk_scale_bleed: 0,
                  atk_scale_once: 0,
                  bleed_critical_damage_interval: 2,
                  bleed_critical_damage_scale: 1,
                  damage_up: 0,
                  duration: 0,
                  duration_bleed: 0,
                  fire_duration: 0,
                  heal_scale: 0.005,
                  hit_bleed_num: 0,
                  poise_2: 0,
                  potential_upgrade: 0,
                  skillimbue: 0,
                  talent_1_1: 0,
                  talent_1_2: 0,
                  talent_2_1: 0,
                  talent_2_2: 0,
                  talent2_burning_damage_scale: 1.5,
                  usp: 0,
                  usp_2: 0,
                },
                true,
                sequence(
                  repeatEachTick(
                    sequence(
                      step('calculateActionValue', {
                        key: 'atk_scale_once',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'atk_scale_3' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      step('calculateActionValue', {
                        key: 'poise_2',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'poise_2' },
                        right: { kind: 'constant', value: 0.25 },
                      }),
                      branch(
                        {
                          kind: 'all',
                          conditions: [
                            {
                              kind: 'buffIdStackCompare',
                              target: 'enemy',
                              buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                              operator: 'greater',
                              value: { kind: 'constant', value: 0.5 },
                            },
                            {
                              kind: 'buffIdStackCompare',
                              target: 'caster',
                              buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                              operator: 'equal',
                              value: { kind: 'constant', value: 1 },
                            },
                          ],
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    blackboardAssignments: {
                                      duration: { kind: 'blackboard', key: 'duration_bleed' },
                                      atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      extra_atk_scale: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_scale',
                                      },
                                      damage_cd: {
                                        kind: 'blackboard',
                                        key: 'bleed_critical_damage_interval',
                                      },
                                      talent_2: { kind: 'constant', value: 1 },
                                      damage_up: { kind: 'blackboard', key: 'damage_up' },
                                      heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                      talent2_burning_damage_scale: {
                                        kind: 'blackboard',
                                        key: 'talent2_burning_damage_scale',
                                      },
                                    },
                                  }),
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                  ),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 0 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_1_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_1' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        blackboardAssignments: {
                                          duration: { kind: 'blackboard', key: 'duration_bleed' },
                                          atk_scale: { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          extra_atk_scale: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_scale',
                                          },
                                          damage_cd: {
                                            kind: 'blackboard',
                                            key: 'bleed_critical_damage_interval',
                                          },
                                          talent_2: { kind: 'constant', value: 1 },
                                          damage_up: { kind: 'blackboard', key: 'damage_up' },
                                          heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                          talent2_burning_damage_scale: {
                                            kind: 'blackboard',
                                            key: 'talent2_burning_damage_scale',
                                          },
                                        },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'heat',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_once',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_2' },
                                        },
                                        'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'talent_2_2' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0.5 },
                                        },
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 1 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/1',
                                          ),
                                        ),
                                        sequence(
                                          step('applyBuff', {
                                            buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                            target: 'enemy',
                                            blackboardAssignments: {
                                              duration: {
                                                kind: 'blackboard',
                                                key: 'duration_bleed',
                                              },
                                              atk_scale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_bleed',
                                              },
                                              extra_atk_scale: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_scale',
                                              },
                                              damage_cd: {
                                                kind: 'blackboard',
                                                key: 'bleed_critical_damage_interval',
                                              },
                                              talent_2: { kind: 'constant', value: 0 },
                                              damage_up: { kind: 'blackboard', key: 'damage_up' },
                                              heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                                              talent2_burning_damage_scale: {
                                                kind: 'blackboard',
                                                key: 'talent2_burning_damage_scale',
                                              },
                                            },
                                          }),
                                          step(
                                            'dealDamage',
                                            {
                                              damageType: 'heat',
                                              attackScale: {
                                                kind: 'blackboard',
                                                key: 'atk_scale_once',
                                              },
                                              tags: ['normalSkill'],
                                              features: ['canBreakWeakness'],
                                              stagger: { kind: 'blackboard', key: 'poise_2' },
                                            },
                                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/1',
                                          ),
                                        ),
                                        { alwaysNext: true },
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                sequence(
                                  step(
                                    'dealDamage',
                                    {
                                      damageType: 'heat',
                                      attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                      tags: ['normalSkill'],
                                      features: ['canBreakWeakness'],
                                      stagger: { kind: 'blackboard', key: 'poise_2' },
                                    },
                                    'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenTrue/steps/0/whenFalse/steps/0/whenFalse/steps/0',
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          step(
                            'dealDamage',
                            {
                              damageType: 'heat',
                              attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise_2' },
                            },
                            'chr_0028_wulfa_normal_skill:/scheduledSequences/3/sequence/steps/5/body/steps/0/body/steps/0/body/steps/2/whenFalse/steps/0',
                          ),
                        ),
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
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                          operator: 'equal',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_2' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                          }),
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'potential_upgrade' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_return' },
                                coefficient: { kind: 'constant', value: 1 },
                                recipient: 'team',
                                spGainKind: 'refund',
                                spGainSource: 'skill',
                              }),
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            sequence(
                              step('finishBuffsById', {
                                target: 'caster',
                                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                                reason: 'early',
                              }),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                      ),
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
        233,
      ),
      scheduled(
        35,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'trigger' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
          ),
        ),
        37,
      ),
      scheduled(
        215,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
            reason: 'early',
          }),
        ),
        218,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'caster',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/Affixes/skillimbue'],
            },
            sequence(
              step('modifyActionValue', {
                key: 'skillimbue',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'skillimbue',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        3,
      ),
      scheduled(
        37,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 215,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.899999976158142 },
            },
          }),
        ),
        40,
      ),
      scheduled(214, sequence(step('finishTimeline', {})), 215),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_normalskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        72,
      ),
      scheduled(
        215,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        272,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb_return: 10,
    atk_scale_1: [
      0.850000023841858, 0.939999997615814, 1.01999998092651, 1.11000001430511, 1.19000005722046,
      1.27999997138977, 1.37000000476837, 1.45000004768372, 1.53999996185303, 1.63999998569489,
      1.76999998092651, 1.91999995708466,
    ],
    atk_scale_2: 0.6,
    atk_scale_3: [
      1.27999997138977, 1.4099999666214, 1.52999997138977, 1.6599999666214, 1.78999996185303,
      1.91999995708466, 2.03999996185303, 2.17000007629395, 2.29999995231628, 2.46000003814697,
      2.65000009536743, 2.88000011444092,
    ],
    atk_scale_bleed: [
      0.360000014305115, 0.400000005960464, 0.430000007152557, 0.469999998807907, 0.5,
      0.540000021457672, 0.579999983310699, 0.610000014305115, 0.649999976158142, 0.689999997615814,
      0.75, 0.810000002384186,
    ],
    atk_scale_once: 0,
    bleed_critical_damage_interval: 2,
    bleed_critical_damage_scale: 1,
    blow_off_distance: 2,
    cam_angle: 0,
    cam_duration: 0,
    cam_lookatoffset_X: 0,
    cam_shoulderoffset_X: 0,
    damage_up: 0,
    distance_random_range: 0.2,
    duration_bleed: 15,
    fire_duration: 8,
    FollowAttackTrigger: 0,
    heal_scale: 0.2,
    input_angle: 0,
    poise_1: 5,
    poise_2: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
    potential_upgrade: 0,
    select_radius: 7,
    skillimbue: 0,
    talent_1_1: 0,
    talent_1_2: 0,
    talent_2_1: 0,
    talent_2_2: 0,
    talent2_burning_damage_scale: 1.5,
    trigger: 0,
    ups_1: 15,
    usp_2: 10,
    display_atk_scale_1: [
      0.850000023841858, 0.939999997615814, 1.01999998092651, 1.11000001430511, 1.19000005722046,
      1.27999997138977, 1.37000000476837, 1.45000004768372, 1.53999996185303, 1.63999998569489,
      1.76999998092651, 1.91999995708466,
    ],
    usp_1: 15,
  },
);

export const rossiComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    sourceSkillId: 'chr_0028_wulfa_combo_2_skill',
    timelineBlockFrames: 37,
    naturalDurationFrames: 198,
    exclusiveFrame: 65,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 37,
          endFrame: 65,
          sourceSkillIds: ['chr_0028_wulfa_normal_skill', 'chr_0028_wulfa_combo_3_skill'],
        },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.349999994039536 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'poise' },
                right: { kind: 'constant', value: 0.5 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0028_wulfa_combo_2_skill:/scheduledSequences/0/sequence/steps/0/body/steps/2',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'can_trigger_combo',
                operation: 'add',
                left: { kind: 'blackboard', key: 'can_trigger_combo' },
                right: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'count' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    { kind: 'casterControlled' },
                  ],
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.239999994635582 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 10,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.0500000007450581,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.699999988079071,
                          value: 0.0500000007450581,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 0.0750000029802322,
                          inTangent: 0,
                          outTangent: 0,
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
        24,
        sequence(
          repeatEachTick(
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.349999994039536 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'poise' },
                right: { kind: 'constant', value: 0.5 },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0028_wulfa_combo_2_skill:/scheduledSequences/1/sequence/steps/0/body/steps/2',
              ),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'constant', value: 0.100000001490116 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_2_damagewait',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'blackboard', key: 'atk_scale_once' },
                  trigger_times: { kind: 'constant', value: 3 },
                  damage_interval: { kind: 'constant', value: 0.125 },
                  duration: { kind: 'constant', value: 0.300000011920929 },
                },
              }),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
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
        25,
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        25,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
                reason: 'other',
              }),
            ),
          ),
        ),
        15,
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'can_trigger_combo' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  time_succeed: { kind: 'blackboard', key: 'time_succeed' },
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
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'can_trigger_combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeSkillSlot', {
                skillGroupKey: 'comboSkill',
                targetSkillKey: 'comboSkill3',
                inheritOriginSkillCooldownProgress: false,
                lifetime: 'infinite',
                revertedSkillKey: 'comboSkill2',
              }),
            ),
          ),
        ),
        58,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usetimer'],
                reason: 'other',
              }),
            ),
          ),
        ),
        37,
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'can_trigger_combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'healthCompare',
                  target: 'enemy',
                  valueType: 'ratio',
                  operator: 'greater',
                  value: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('openComboWindow', { nextSkillKeyFromSlot: 'comboSkill' }),
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                    operation: 'set',
                    basis: 'absoluteSeconds',
                    value: { kind: 'constant', value: 0 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_usetimer',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                sequence(
                  step('openComboWindow', { nextSkillKeyFromSlot: 'comboSkill' }),
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                    operation: 'set',
                    basis: 'absoluteSeconds',
                    value: { kind: 'constant', value: 0 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_usetimer',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        41,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633000016212463 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        65,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 420],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    alpha: 0,
    atk_scale: [
      0.670000016689301, 0.730000019073486, 0.800000011920929, 0.870000004768372, 0.930000007152557,
      1, 1.07000005245209, 1.12999999523163, 1.20000004768372, 1.27999997138977, 1.37999999523163,
      1.5,
    ],
    atk_scale_once: 0.01,
    cam_angle: 0,
    cam_duration: 0,
    cam_shoulderoffset_X: 0,
    can_trigger_combo: 0,
    count: 0,
    distance: 0,
    input_angle: 0,
    obsorb_no_guard: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 0,
    poise_once: 0.01,
    time_succeed: 0.4,
    timing_success: 0,
    usp: 10,
    display_atk_scale_2_f: [
      0.670000016689301, 0.730000019073486, 0.800000011920929, 0.870000004768372, 0.930000007152557,
      1, 1.07000005245209, 1.12999999523163, 1.20000004768372, 1.27999997138977, 1.37999999523163,
      1.5,
    ],
    display_atk_scale_2_s: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.87000000476837, 2,
      2.13000011444092, 2.26999998092651, 2.40000009536743, 2.5699999332428, 2.76999998092651, 3,
    ],
    display_crit_increase_duration: 15,
    display_crit_increase_rate: 0.25,
    display_poise_2_f: 5,
    display_poise_2_s: 10,
    display_usp_2_f: 0,
    display_usp_2_s: 10,
  },
);

export const rossiComboSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill3',
    sourceSkillId: 'chr_0028_wulfa_combo_3_skill',
    timelineBlockFrames: 52,
    naturalDurationFrames: 409,
    exclusiveFrame: 259,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 52, endFrame: 72, sourceSkillIds: ['chr_0028_wulfa_normal_skill'] },
        { startFrame: 249, endFrame: 269, sourceSkillIds: ['chr_0028_wulfa_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        225,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 50,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.5,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.200000002980232,
                          value: 0.0299999993294477,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.75,
                          value: 0.0299999993294477,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 1,
                          inTangent: 0.149662002921104,
                          outTangent: 0.149662002921104,
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
        226,
      ),
      scheduled(
        227,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: {
                          kind: 'tag',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'buffStackCompare',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('readBuffStackCount', {
                                target: 'enemy',
                                outputKey: 'buff_stack',
                                query: {
                                  kind: 'tag',
                                  tagQueryType: 'hasAny',
                                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                },
                              }),
                              step('finishBuffsByTag', {
                                target: 'enemy',
                                tagQueryType: 'hasAny',
                                buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                reason: 'early',
                              }),
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 1 },
                              }),
                            ),
                            sequence(
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'spellinflict_stack_max',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
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
        227,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
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
                        duration: { kind: 'constant', value: 1 },
                        height: { kind: 'constant', value: 20 },
                        speedFactorMultiplier: 10,
                        force: false,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                        reason: 'other',
                      }),
                    ),
                  ),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        228,
      ),
      scheduled(
        227,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'spellinflict_stack_max',
                query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
                right: { kind: 'blackboard', key: 'damage_add' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'atk_scale_s' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'potential_atk_multiply' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'poise_f' },
                right: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
                reason: 'other',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                },
                'chr_0028_wulfa_combo_3_skill:/scheduledSequences/3/sequence/steps/0/body/steps/7',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
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
        228,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          }),
          step('changeSkillSlot', {
            skillGroupKey: 'comboSkill',
            targetSkillKey: 'comboSkill2',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
              operator: 'equal',
              value: { kind: 'constant', value: 2 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_usetimer',
                  'buff_chr_0028_wulfa_combo_usecount',
                ],
                reason: 'other',
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_s' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
          ),
        ),
        228,
      ),
      scheduled(
        29,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: {
                      kind: 'tag',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: {
                          kind: 'tag',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ['Skill/Character/Common/SpellInflict/NaturalInflict'],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: {
                              kind: 'tag',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'buffStackCompare',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('readBuffStackCount', {
                                target: 'enemy',
                                outputKey: 'buff_stack',
                                query: {
                                  kind: 'tag',
                                  tagQueryType: 'hasAny',
                                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                },
                              }),
                              step('finishBuffsByTag', {
                                target: 'enemy',
                                tagQueryType: 'hasAny',
                                buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                                reason: 'early',
                              }),
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                              }),
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 1 },
                              }),
                            ),
                            sequence(
                              step('modifyActionValue', {
                                key: 'can_trigger_combo',
                                operation: 'add',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'buff_stack',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
                              }),
                              step('modifyActionValue', {
                                key: 'spellinflict_stack_max',
                                operation: 'assign',
                                value: { kind: 'constant', value: 0 },
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
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
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
                        duration: { kind: 'constant', value: 1 },
                        height: { kind: 'constant', value: 20 },
                        speedFactorMultiplier: 10,
                        force: false,
                        targetFilter: 'aliveOnly',
                        returnWhen: 'always',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_physical_no_guard',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                        reason: 'other',
                      }),
                    ),
                  ),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        30,
      ),
      scheduled(
        27,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('startTimeDilation', {
                    scope: 'entity',
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    slot: 'TimeDilation/Layer/Entity/HitStop',
                    priority: 50,
                    curve: {
                      kind: 'inline',
                      keys: [
                        {
                          time: 0,
                          value: 0.5,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.200000002980232,
                          value: 0.0299999993294477,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 0.75,
                          value: 0.0299999993294477,
                          inTangent: 0,
                          outTangent: 0,
                          weightedMode: 0,
                          inWeight: 0,
                          outWeight: 0,
                        },
                        {
                          time: 1,
                          value: 1,
                          inTangent: 0.149662002921104,
                          outTangent: 0.149662002921104,
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
        28,
      ),
      scheduled(
        29,
        sequence(
          repeatEachTick(
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'spellinflict_stack_max',
                query: { kind: 'id', buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'] },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
                right: { kind: 'blackboard', key: 'damage_add' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'atk_scale_s' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'blackboard', key: 'potential_atk_multiply' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'atk_scale_once' },
                right: { kind: 'constant', value: 1 },
              }),
              step('calculateActionValue', {
                key: 'poise_once',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'poise_s' },
                right: { kind: 'constant', value: 1 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
                reason: 'other',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_once' },
                },
                'chr_0028_wulfa_combo_3_skill:/scheduledSequences/9/sequence/steps/0/body/steps/7',
              ),
              step('calculateActionValue', {
                key: 'count',
                operation: 'add',
                left: { kind: 'blackboard', key: 'count' },
                right: { kind: 'constant', value: 1 },
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
        30,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_Combo_QTE_Trigger' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_2_qte_timer',
                  'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                ],
                reason: 'early',
              }),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[2]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[2]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              step('startTimeDilation', {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'unassigned',
                priority: 50,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.00999999977648258,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0.00999999977648258,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.800000011920929,
                      value: 0.00999999977648258,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.00999999977648258,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
                finishByAction: false,
                ignoredTargets: ['caster'],
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[13]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].succeedActions.actionData[13]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('calculateActionValue', {
                    key: 'atk_scale_s',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'atk_scale_s' },
                    right: { kind: 'blackboard', key: 'potential_atk_multiply' },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_2_qte_timer',
                  'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                ],
                reason: 'early',
              }),
              step('findOwnerSpawnedAbilityEntities', {
                saveToContextKey:
                  '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].failActions.actionData[1]',
              }),
              forEachContextTarget(
                '__finishOwnerAll:SkillData.chr_0028_wulfa_combo_3_skill.actionGroupData.timelineActions[22]._sequenceActionData.actionData[1].failActions.actionData[1]',
                sequence(step('finishCurrentAbilityEntity', {})),
              ),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
              step('jumpTimeline', { destinationFrame: 212 }),
            ),
            { alwaysNext: true },
          ),
        ),
        28,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_s' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        30,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'crit_increase_duration' },
              critical_rate: { kind: 'blackboard', key: 'crit_increase_rate' },
              critical_damage_inc: { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
        3,
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'crit_increase_duration' },
              critical_rate: { kind: 'blackboard', key: 'crit_increase_rate' },
              critical_damage_inc: { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
        215,
      ),
      scheduled(211, sequence(step('finishTimeline', {})), 212),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633000016212463 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        212,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633000016212463 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        222,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_success',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        58,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        59,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        257,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        60,
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        259,
      ),
    ],
    smartTarget: 'enemy',
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    alpha: 0,
    atk_scale_f: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.87000000476837, 2,
      2.13000011444092, 2.26999998092651, 2.40000009536743, 2.5699999332428, 2.76999998092651, 3,
    ],
    atk_scale_once: 0,
    atk_scale_s: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.87000000476837, 2,
      2.13000011444092, 2.26999998092651, 2.40000009536743, 2.5699999332428, 2.76999998092651, 3,
    ],
    buff_stack: 0,
    cam_angle: 0,
    cam_duration: 0,
    cam_shoulderoffset_X: 0,
    can_trigger_combo: 0,
    count: 0,
    crit_damage_increase_rate: [
      0.300000011920929, 0.300000011920929, 0.300000011920929, 0.340000003576279, 0.340000003576279,
      0.340000003576279, 0.379999995231628, 0.379999995231628, 0.419999986886978, 0.419999986886978,
      0.46000000834465, 0.5,
    ],
    crit_increase_duration: 15,
    crit_increase_rate: [
      0.150000005960464, 0.150000005960464, 0.150000005960464, 0.170000001788139, 0.170000001788139,
      0.170000001788139, 0.189999997615814, 0.189999997615814, 0.209999993443489, 0.209999993443489,
      0.230000004172325, 0.25,
    ],
    damage_add: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    distance: 0,
    input_angle: 0,
    obsorb_no_guard: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise_f: 5,
    poise_once: 0,
    poise_s: 5,
    potential_1: 0,
    potential_atk_multiply: 1,
    spellinflict_stack_max: 0,
    timing_success: 0,
    usp_f: 10,
    usp_s: 10,
    zoom_scale: 0,
  },
);

export const rossiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0028_wulfa_ultimate_skill',
    timelineBlockFrames: 156,
    naturalDurationFrames: 311,
    exclusiveFrame: 155,
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
        57,
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
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Immune/Damage', 'SelectCategory/Unmarkable'],
                },
                sequence(),
                sequence(
                  branch(
                    { kind: 'enemyRankIn', ranks: ['elite'] },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_ult_stopenemy_elite',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        blackboardAssignments: {
                          duration: { kind: 'constant', value: 3.09996891021729 },
                        },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        150,
      ),
      scheduled(
        64,
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
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tags: ['Immune/Damage', 'SelectCategory/Unmarkable'],
                },
                sequence(),
                sequence(
                  branch(
                    { kind: 'enemyRankIn', ranks: ['mob'] },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_ult_stopenemy',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        blackboardAssignments: {
                          duration: { kind: 'constant', value: 2.86666393280029 },
                        },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        150,
      ),
      scheduled(
        64,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_ult_addtional_battleshape',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        111,
      ),
      scheduled(
        122,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
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
                'chr_0028_wulfa_ultimate_skill:/scheduledSequences/4/sequence/steps/1/body/steps/0',
              ),
              step('modifyActionValue', {
                key: 'hit_num',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
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
        125,
      ),
      scheduled(
        131,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0028_wulfa_normal_bleed'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0028_wulfa_ultimate_skill:/scheduledSequences/5/sequence/steps/1/body/steps/0/whenTrue/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'hit_num',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                sequence(
                  step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                  step(
                    'dealDamage',
                    {
                      damageType: 'heat',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'chr_0028_wulfa_ultimate_skill:/scheduledSequences/5/sequence/steps/1/body/steps/0/whenFalse/steps/1',
                  ),
                  step('modifyActionValue', {
                    key: 'hit_num',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
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
        134,
      ),
      scheduled(
        134,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_num' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.319999992847443 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 50,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.0500000007450581,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.600000023841858,
                      value: 0.0500000007450581,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.600000023841858,
                      inTangent: 1.8651419878006,
                      outTangent: 1.8651419878006,
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
        135,
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
        155,
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
        57,
      ),
      scheduled(
        58,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_1',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_1' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_2',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_2' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'atk_scale_3',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_3' },
                right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
              }),
              step('calculateActionValue', {
                key: 'crit_damage_up_to_bleed',
                operation: 'add',
                left: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
                right: { kind: 'blackboard', key: 'potential_5_critical_damage' },
              }),
            ),
          ),
        ),
        208,
      ),
      scheduled(
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              critical_damage_up_to_bleed: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
            },
          }),
        ),
        208,
      ),
      scheduled(
        63,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/11/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        64,
      ),
      scheduled(
        65,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/12/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        66,
      ),
      scheduled(
        66,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/13/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        67,
      ),
      scheduled(
        69,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/14/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        70,
      ),
      scheduled(
        71,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/15/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        72,
      ),
      scheduled(
        74,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/16/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        75,
      ),
      scheduled(
        75,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/17/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        76,
      ),
      scheduled(
        77,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/18/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        78,
      ),
      scheduled(
        78,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/19/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        79,
      ),
      scheduled(
        80,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/20/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        81,
      ),
      scheduled(
        83,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/21/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        84,
      ),
      scheduled(
        84,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/22/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        85,
      ),
      scheduled(
        87,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/23/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        88,
      ),
      scheduled(
        88,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/24/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        89,
      ),
      scheduled(
        90,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/25/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        91,
      ),
      scheduled(
        92,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/26/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        93,
      ),
      scheduled(
        94,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/27/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        95,
      ),
      scheduled(
        96,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/28/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        97,
      ),
      scheduled(
        97,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/29/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        98,
      ),
      scheduled(
        99,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/30/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        100,
      ),
      scheduled(
        102,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/31/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        103,
      ),
      scheduled(
        103,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/32/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        104,
      ),
      scheduled(
        106,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/33/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        107,
      ),
      scheduled(
        108,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/34/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        109,
      ),
      scheduled(
        111,
        sequence(
          step('createSpatialPointTargets', {
            saveToContextKey: 'pos2',
            count: { kind: 'constant', value: 1 },
          }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0028_wulfa_ultimate_skill:/scheduledSequences/35/sequence/steps/1',
          ),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        112,
      ),
      scheduled(
        63,
        sequence(
          repeatEachTick(sequence(), {
            nativeChanneling: {
              executeEachFrame: true,
              triggerIntervalSeconds: 0.0329999998211861,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0.033330000936985,
            },
          }),
        ),
        131,
      ),
    ],
    smartTarget: 'enemy',
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 110 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    angle: 130,
    AngleToTarget: 0,
    AnimEventReciver: 0,
    AnimScale: 1,
    AnimScale_Gear_1: 0.7,
    AnimScale_Gear_2: 0.75,
    AnimScale_Gear_3: 0.8,
    AnimScale_Gear_4: 1,
    atk_scale_1: [
      0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046, 0.150000005960464,
      0.159999996423721, 0.170000001788139, 0.180000007152557, 0.189999997615814, 0.209999993443489,
      0.219999998807907, 0.239999994635582,
    ],
    atk_scale_2: [
      1.11000001430511, 1.22000002861023, 1.33000004291534, 1.44000005722046, 1.55999994277954,
      1.66999995708466, 1.77999997138977, 1.88999998569489, 2, 2.14000010490417, 2.30999994277954,
      2.5,
    ],
    atk_scale_3: [
      3.32999992370605, 3.67000007629395, 4, 4.32999992370605, 4.67000007629395, 5,
      5.34000015258789, 5.67000007629395, 6, 6.42000007629395, 6.92000007629395, 7.5,
    ],
    atk_scale_crit_fire: [
      0.140000000596046, 0.150000005960464, 0.159999996423721, 0.180000007152557, 0.189999997615814,
      0.200000002980232, 0.219999998807907, 0.230000004172325, 0.239999994635582, 0.259999990463257,
      0.280000001192093, 0.300000011920929,
    ],
    camera_blocked: 0,
    CapeBuffStack: 0,
    crit_damage_up_to_bleed: 0.600000023841858,
    float_temp: 1,
    gear: 4,
    height: 4,
    hit_num: 0,
    hit_times: 0,
    IsNotClick: 0,
    originum_ult_break_scale: 0,
    poise: 25,
    potential_5: 0,
    potential_5_critical_damage: 0,
    potential_5_damage_scale: 1.2,
    radius: 5,
    random_hurtanimation: 0,
    random_num: 0,
    display_atk_scale_1_max: [2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5.25, 5.5, 6],
    display_atk_scale_1_min: [
      1.27999997138977, 1.4099999666214, 1.53999996185303, 1.6599999666214, 1.78999996185303,
      1.91999995708466, 2.04999995231628, 2.1800000667572, 2.29999995231628, 2.46000003814697,
      2.66000008583069, 2.88000011444092,
    ],
  },
);

export default {
  slug: 'rossi',
  gameId: 'ROSSI',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 28, 48, 68, 88, 97],
    agility: [23, 55, 90, 124, 159, 176],
    intellect: [14, 36, 59, 83, 106, 118],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        rossiBasicAttack1,
        rossiBasicAttack2,
        rossiBasicAttack3,
        rossiBasicAttack4,
        rossiBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: rossiFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: rossiPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: rossiBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: rossiComboSkill2,
      replacementSkills: [rossiComboSkill3],
      replacementSkillPlacements: { comboSkill3: 'standard' },
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: rossiUltimate },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill2', replacementSkillKeys: ['comboSkill3'] },
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
      skillKey: 'comboSkill2',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetBuffStackCompare',
            contextKey: 'trigger',
            tagQueryType: 'hasAny',
            buffTags: ['Skill/Character/Common/NoGuard'],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          sequence(
            branch(
              {
                kind: 'buffIdStackCompare',
                target: 'caster',
                buffIds: [
                  'buff_chr_0028_wulfa_combo_usetimer',
                  'buff_chr_0028_wulfa_combo_cannottrigger',
                ],
                operator: 'less',
                value: { kind: 'constant', value: 1 },
              },
              sequence(),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill2',
      event: 'addedBuff',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'eventBuffIdMatch', buffIds: ['buff_physical_no_guard'] },
          sequence(
            branch(
              { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffStackCompare',
                    contextKey: 'trigger',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: [
                          'buff_chr_0028_wulfa_combo_usetimer',
                          'buff_chr_0028_wulfa_combo_cannottrigger',
                        ],
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(),
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_bleed',
          operation: 'assign',
          value: [0.25, 0.300000011920929],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_bleed',
          operation: 'assign',
          value: [15, 25],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'damage_up',
          operation: 'assign',
          value: [0.0599999986588955, 0.119999997317791],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_1',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 1,
          maximumUpgradeLevel: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_2',
          operation: 'assign',
          value: 1,
          minimumUpgradeLevel: 2,
          maximumUpgradeLevel: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'assign',
          value: [0.119999997317791, 0.239999994635582],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.0399999991059303, 0.0799999982118607],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent2_burning_damage_scale',
          operation: 'assign',
          value: [1.5, 1.5],
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
          blackboardKey: 'potential_upgrade',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_1',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_s',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_f',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'damage_add',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 20 },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'add',
          value: 0.0799999982118607,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'add',
          value: -0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'add',
          value: 0.0399999991059303,
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
          blackboardKey: 'potential_5_damage_scale',
          operation: 'assign',
          value: 1.10000002384186,
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
          blackboardKey: 'potential_5_critical_damage',
          operation: 'assign',
          value: 0.300000011920929,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_Combo_qte_proto_use: 1,
    EntityBB_Combo_QTE_Trigger: 0,
    EntityBB_ComboUseCount: 0,
    EntityBB_NormalSkill_wolf_gain_usp: 0,
  },
  buffDefinitions: {
    buff_chr_0028_wulfa_combo_2_damage: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: { blackboardKey: 'trigger_times' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_interval: 0.1,
        duration: 1,
        poise: 0,
        posie: 0,
        trigger_times: 3,
      },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_combo_2_damage:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
      lifecycleSequences: {
        trigger: sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'buff_chr_0028_wulfa_combo_2_damage:/lifecycleSequences/trigger/steps/0',
          ),
        ),
      },
    },
    buff_chr_0028_wulfa_combo_2_damagewait: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_interval: 0.1,
        duration: 3,
        poise: 0,
        posie: 0,
        trigger_times: 3,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_2_damage',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              poise: { kind: 'blackboard', key: 'poise' },
              trigger_times: { kind: 'blackboard', key: 'trigger_times' },
              damage_interval: { kind: 'blackboard', key: 'damage_interval' },
            },
          }),
        ),
      },
    },
    buff_chr_0028_wulfa_combo_2_qte_timer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_2_qte_timerlistening: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 6, time_succeed: 0.5, time_warning: 0.5 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('modifyActionValue', {
              key: 'EntityBB_Combo_QTE_Trigger',
              operation: 'assign',
              value: { kind: 'constant', value: 0 },
            }),
          ),
          3,
        ),
        scheduled(
          3,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
                  childSkillId: 'chr_0028_wulfa_absorb_entity_effect_1',
                  inheritActionBlackboard: false,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                }),
              ),
            ),
          ),
          19,
        ),
        scheduled(
          15,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'EntityBB_Combo_qte_proto_use' },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0028_wulfa_combo_2_qte_timer',
                  target: 'buffOwner',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: { duration: { kind: 'blackboard', key: 'time_succeed' } },
                }),
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0028_wulfa_combo_qte_timing',
                  childSkillId: 'chr_0028_wulfa_absorb_entity_effect_2',
                  inheritActionBlackboard: false,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                }),
              ),
            ),
          ),
          16,
        ),
        scheduled(
          35,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { duration: { kind: 'constant', value: 0.200000002980232 } },
            }),
            step('finishBuffsById', {
              target: 'buffOwner',
              buffIds: ['buff_train_output_succbuff_or_failbuff_by_id'],
              reason: 'early',
            }),
          ),
          38,
        ),
        scheduled(
          15,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_combo_2_qte_timer',
              target: 'buffOwner',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: { duration: { kind: 'blackboard', key: 'time_succeed' } },
            }),
          ),
          16,
        ),
      ],
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffIdMatch',
                buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
              },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'all',
                conditions: [
                  { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timer'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                ],
              },
              sequence(
                step('modifyActionValue', {
                  key: 'EntityBB_Combo_QTE_Trigger',
                  operation: 'assign',
                  value: { kind: 'constant', value: 1 },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0028_wulfa_combo_criticalrate: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_crit_up',
        iconPath: '/icons/icon_battle_crit_up.webp',
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
        playStrongInAnimation: true,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'CommonCharBuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        critical_damage_inc: 0.15,
        critical_rate: 0.1,
        duration: 10,
        usp_stage_1: 0.35,
        usp_stage_2: 0.7,
        usp_stage_3: 1,
      },
      attributeModifiers: [
        {
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_rate' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_damage_inc' },
        },
      ],
    },
    buff_chr_0028_wulfa_combo_hasinflict: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 10 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_usecount: {
      stackingType: 'enhanceAndOverwriteDuration',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: 10,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_combo_usetimer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 6, End_Early: 0, need_set_cd: 1 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'need_set_cd' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                operation: 'set',
                basis: 'baseDurationRatio',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffIdMatch',
                buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'],
              },
              sequence(step('setCurrentBuffTimePaused', { paused: false })),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(step('setCurrentBuffTimePaused', { paused: true })),
            ),
          ),
        },
      ],
    },
    buff_chr_0028_wulfa_normal_bleed: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_wulfa_blood',
        iconPath: '/icons/icon_battle_buff_wulfa_blood.webp',
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
        playStrongInAnimation: true,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        damage_up: 0.12,
        duration: 1,
        extra_atk_scale: 1.5,
        heal_scale: 0.2,
        poise: 0,
        posie: 0,
        talent_2: 0,
        talent2_burning_damage_scale: 1.5,
      },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['physical'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: { kind: 'eventDamageTypesMatch', damageTypes: ['heat'] },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
      ],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_bleed:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
      lifecycleSequences: {
        trigger: sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              takeAttackSnapshot: true,
              tags: [],
              features: ['dot', 'talentDamage'],
            },
            'buff_chr_0028_wulfa_normal_bleed:/lifecycleSequences/trigger/steps/0',
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_bleed_effect',
            target: 'buffOwner',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'takeCriticalDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'talent_2' },
                operator: 'greater',
                right: { kind: 'constant', value: 0.5 },
              },
              sequence(
                branch(
                  {
                    kind: 'actionInputTargetIdentityMatch',
                    other: 'actionSource',
                    operator: 'equal',
                  },
                  sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAny',
                        tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage',
                          target: 'buffOwner',
                          source: 'buffSource',
                          blackboardAssignments: {
                            atk_scale: { kind: 'blackboard', key: 'extra_atk_scale' },
                            damage_cd: { kind: 'blackboard', key: 'damage_cd' },
                            heal_scale: { kind: 'blackboard', key: 'heal_scale' },
                            burning_damage_scale: {
                              kind: 'blackboard',
                              key: 'talent2_burning_damage_scale',
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
        },
      ],
    },
    buff_chr_0028_wulfa_normal_bleed_crit_extra_damage: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        burning_damage_scale: 1.5,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 1.2,
        heal_scale: 0.05,
        poise: 0,
        posie: 0,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            branch(
              {
                kind: 'buffStackCompare',
                target: 'buffOwner',
                tagQueryType: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Burning'],
                operator: 'greater',
                value: { kind: 'constant', value: 0.5 },
              },
              sequence(
                step('calculateActionValue', {
                  key: 'atk_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'atk_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step('calculateActionValue', {
                  key: 'heal_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'heal_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: [],
                    features: ['talentDamage'],
                  },
                  'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage:/scheduledSequences/0/sequence/steps/0/whenTrue/steps/2',
                ),
                step('heal', {
                  target: 'caster',
                  tags: [],
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'caster',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: [],
                    features: ['talentDamage'],
                  },
                  'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage:/scheduledSequences/0/sequence/steps/0/whenFalse/steps/0',
                ),
                step('heal', {
                  target: 'caster',
                  tags: [],
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'caster',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              { alwaysNext: true },
            ),
          ),
          19,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_bleed_effect: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 0.9,
        extra_atk_scale: 1.5,
        poise: 0,
        posie: 0,
        talent_2: 0,
      },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_bleed_effect:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_defup: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        damage_up: 0.12,
        defup: -0.5,
        duration: 5,
        extra_atk_scale: 1.5,
        heal_scale: 0.2,
        poise: 0,
        posie: 0,
        talent_2: 0,
        talent2_burning_damage_scale: 1.5,
      },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'defender',
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'defup' },
            },
          ],
        },
      ],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_defup:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_smarttarget: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale: 0.3,
        damage_cd: 1.5,
        damage_interval: 1,
        duration: 2,
        extra_atk_scale: 1.5,
        poise: 0,
        posie: 0,
        talent_2: 0,
      },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_normal_smarttarget:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_normal_wolf_timer: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 3 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_powerattack_resumecombo: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 10, End_Early: 0 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_talent2_heal_effect: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0.5, interval: 0.3 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_tut_comboskill_failure: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_failure:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_comboskill_finish: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_finish:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_comboskill_success: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_comboskill_success:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_normalskill_failure: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_normalskill_failure:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_tut_normalskill_success: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0.3, damage_interval: 1, duration: 1, poise: 0, posie: 0 },
      attributeModifiers: [],
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
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'posie' },
                  },
                  'buff_chr_0028_wulfa_tut_normalskill_success:/scheduledSequences/0/sequence/steps/0/body/steps/0',
                ),
              ),
              {
                nativeTickInterval: { executeEachFrame: false, intervalSeconds: 0.100000001490116 },
              },
            ),
          ),
          20,
        ),
      ],
    },
    buff_chr_0028_wulfa_ult_addtional_battleshape: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 2 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { critical_damage_up_to_bleed: 0.2, duration: 5 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['ultimateSkill'] },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'critical_damage_up_to_bleed' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    buff_chr_0028_wulfa_ult_stopenemy: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Status/Immobilized'],
      extendTags: [],
      blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
      attributeModifiers: [],
    },
    buff_chr_0028_wulfa_ult_stopenemy_elite: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 1.5, usp_stage_1: 0.35, usp_stage_2: 0.7, usp_stage_3: 1 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0028_wulfa_combo_qte_timing: {
      bornTags: ['Status/UnLockable', 'Status/NonAITarget'],
      lifetime: { kind: 'limited', durationSeconds: 10 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkills: {
        chr_0028_wulfa_absorb_entity_effect_1: {
          skillId: 'chr_0028_wulfa_absorb_entity_effect_1',
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [],
        },
        chr_0028_wulfa_absorb_entity_effect_2: {
          skillId: 'chr_0028_wulfa_absorb_entity_effect_2',
          blackboard: { atk_scale: 0, duration: 0 },
          scheduledSequences: [
            scheduled(
              1,
              sequence(
                step('startTimeDilation', {
                  scope: 'global',
                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                  slot: 'unassigned',
                  priority: 50,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: -0.0116959102451801,
                        value: 1.01995003223419,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.251462012529373,
                        value: 0.400000005960464,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.485380113124847,
                        value: 0.400000005960464,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 1,
                        value: 1,
                        inTangent: 0,
                        outTangent: 0,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: true,
                  ignoredTargets: [],
                }),
              ),
              16,
            ),
          ],
        },
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
