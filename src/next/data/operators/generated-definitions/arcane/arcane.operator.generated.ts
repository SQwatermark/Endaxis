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
  withSkillBlackboard,
} from '../../definitionHelpers';

export const arcaneBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0032_lizhiyan_attack1',
    timelineBlockFrames: 10,
    naturalDurationFrames: 224,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 3,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0032_lizhiyan_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 10, endFrame: 30, sourceSkillIds: ['chr_0032_lizhiyan_attack2'] },
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
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack1:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.100000001490116,
              },
            },
          ),
        ),
        12,
      ),
      scheduled(
        10,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack1:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.100000001490116,
              },
            },
          ),
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack1:/scheduledSequences/1/sequence/steps/1/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 1,
                targetTriggerIntervalSeconds: 0.100000001490116,
              },
            },
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
      0.061999998986721, 0.0689999982714653, 0.0750000029802322, 0.0810000002384186,
      0.0869999974966049, 0.0939999967813492, 0.100000001490116, 0.105999998748302,
      0.112000003457069, 0.119999997317791, 0.12899999320507, 0.140000000596046,
    ],
    display_atk_scale: [
      0.189999997615814, 0.209999993443489, 0.219999998807907, 0.239999994635582, 0.259999990463257,
      0.280000001192093, 0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115,
      0.389999985694885, 0.419999986886978,
    ],
  },
);

export const arcaneBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0032_lizhiyan_attack2',
    timelineBlockFrames: 14,
    naturalDurationFrames: 215,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0032_lizhiyan_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 32, sourceSkillIds: ['chr_0032_lizhiyan_attack3'] },
      ],
    },
    costFrame: 11,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack2:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
            ),
          ),
        ),
        12,
      ),
      scheduled(
        12,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack2:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
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
        13,
      ),
      scheduled(
        13,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack2:/scheduledSequences/2/sequence/steps/0/body/steps/0',
              ),
            ),
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
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.0710000023245811, 0.0780000016093254, 0.0850000008940697, 0.0920000001788139,
      0.0989999994635582, 0.10700000077486, 0.114000000059605, 0.120999999344349, 0.128000006079674,
      0.136999994516373, 0.146999999880791, 0.159999996423721,
    ],
    poise: 0,
    rand_offset_x: 0,
    rand_offset_y: 0,
    rand_scale: 0,
    display_atk_scale: [
      0.209999993443489, 0.230000004172325, 0.259999990463257, 0.280000001192093, 0.300000011920929,
      0.319999992847443, 0.340000003576279, 0.360000014305115, 0.379999995231628, 0.409999996423721,
      0.439999997615814, 0.479999989271164,
    ],
  },
);

export const arcaneBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0032_lizhiyan_attack3',
    timelineBlockFrames: 22,
    naturalDurationFrames: 235,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 39,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0032_lizhiyan_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 39, sourceSkillIds: ['chr_0032_lizhiyan_attack4'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack3:/scheduledSequences/0/sequence/steps/0/body/steps/0',
              ),
            ),
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
        13,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0032_lizhiyan_attack3:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
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
    poise: 0,
    display_atk_scale: [
      0.330000013113022, 0.370000004768372, 0.400000005960464, 0.430000007152557, 0.469999998807907,
      0.5, 0.529999971389771, 0.569999992847443, 0.600000023841858, 0.639999985694885,
      0.689999997615814, 0.75,
    ],
  },
);

export const arcaneBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0032_lizhiyan_attack4',
    timelineBlockFrames: 18,
    naturalDurationFrames: 230,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 39,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0032_lizhiyan_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 39, sourceSkillIds: ['chr_0032_lizhiyan_attack5'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        3,
      ),
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        6,
      ),
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/2/sequence/steps/0',
          ),
        ),
        9,
      ),
      scheduled(
        11,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/3/sequence/steps/0',
          ),
        ),
        12,
      ),
      scheduled(
        2,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/4/sequence/steps/0',
          ),
        ),
        3,
      ),
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/5/sequence/steps/0',
          ),
        ),
        6,
      ),
      scheduled(
        8,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/6/sequence/steps/0',
          ),
        ),
        9,
      ),
      scheduled(
        11,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0032_lizhiyan_attack4:/scheduledSequences/7/sequence/steps/0',
          ),
        ),
        12,
      ),
      scheduled(
        4,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_attack4',
                  },
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'lizhiyan_attack4',
                        durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                        autoFinishByAction: false,
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        36,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.0450000017881393, 0.0489999987185001, 0.0529999993741512, 0.0579999983310699,
      0.061999998986721, 0.0670000016689301, 0.0710000023245811, 0.0759999975562096,
      0.0799999982118607, 0.0860000029206276, 0.0920000001788139, 0.100000001490116,
    ],
    display_atk_scale: [
      0.360000014305115, 0.389999985694885, 0.430000007152557, 0.46000000834465, 0.5,
      0.529999971389771, 0.569999992847443, 0.610000014305115, 0.639999985694885, 0.689999997615814,
      0.740000009536743, 0.800000011920929,
    ],
    poise: 0,
  },
);

export const arcaneBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0032_lizhiyan_attack5',
    timelineBlockFrames: 40,
    naturalDurationFrames: 300,
    exclusiveFrame: 41,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 50,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0032_lizhiyan_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 40, endFrame: 50, sourceSkillIds: ['chr_0032_lizhiyan_attack1'] },
      ],
    },
    costFrame: 13,
    scheduledSequences: [
      scheduled(
        22,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'normalAttackLastCombo'],
              stagger: { kind: 'blackboard', key: 'poise' },
              staggerOnlyWhenCasterControlled: true,
            },
            'chr_0032_lizhiyan_attack5:/scheduledSequences/0/sequence/steps/0',
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
        25,
      ),
      scheduled(
        23,
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
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.600000023841858,
                      inTangent: -7.0758900642395,
                      outTangent: -7.0758900642395,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.150000005960464,
                      value: 0.0299999993294477,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.5,
                      value: 0.100000001490116,
                      inTangent: 0.475295901298523,
                      outTangent: 0.475295901298523,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.800000011920929,
                      inTangent: 2.06751990318298,
                      outTangent: 2.06751990318298,
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
        25,
      ),
      scheduled(
        22,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_attack5',
                  },
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'lizhiyan_attack5',
                        durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                        autoFinishByAction: false,
                      }),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        25,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 17,
    atk_scale: [
      0.469999998807907, 0.519999980926514, 0.560000002384186, 0.610000014305115, 0.660000026226044,
      0.709999978542328, 0.75, 0.800000011920929, 0.850000023841858, 0.899999976158142,
      0.980000019073486, 1.05999994277954,
    ],
    finish_angle1: 20,
    finish_angle2: 160,
    isHitbyMain: 0,
    poise: 17,
    start_angle1: 60,
    start_angle2: 120,
    display_atk_scale: [
      0.469999998807907, 0.519999980926514, 0.560000002384186, 0.610000014305115, 0.660000026226044,
      0.709999978542328, 0.75, 0.800000011920929, 0.850000023841858, 0.899999976158142,
      0.980000019073486, 1.05999994277954,
    ],
  },
);

export const arcaneFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0032_lizhiyan_power_attack',
    timelineBlockFrames: 34,
    naturalDurationFrames: 163,
    exclusiveFrame: 51,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 34,
          endFrame: 51,
          sourceSkillIds: ['chr_0032_lizhiyan_normal_skill', 'chr_0032_lizhiyan_combo_skill'],
        },
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
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0032_lizhiyan_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        8,
      ),
      scheduled(
        10,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0032_lizhiyan_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        11,
      ),
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.100000001490116,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0032_lizhiyan_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
        ),
        14,
      ),
      scheduled(
        36,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.5,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0032_lizhiyan_power_attack:/scheduledSequences/3/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.550000011920929 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 0.5,
                  inTangent: -7,
                  outTangent: -7,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.0700000002980232,
                  value: 0.00999999977648258,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.898290991783142,
                  value: 0.103112801909447,
                  inTangent: 0.0304840803146362,
                  outTangent: 0.0304840803146362,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0.300000011920929,
                  inTangent: 2.23294305801392,
                  outTangent: 2.23294305801392,
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
        32,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  calculation: 'breakingAttack',
                  calculationMultiplier: 0.100000001490116,
                  tags: ['normalAttack', 'powerAttack'],
                },
                'chr_0032_lizhiyan_power_attack:/scheduledSequences/4/sequence/steps/0/body/steps/0',
              ),
            ),
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 2,
                targetTriggerIntervalSeconds: 0.0670000016689301,
              },
            },
          ),
        ),
        35,
      ),
      scheduled(
        7,
        sequence(
          step('createTimedMarker', {
            target: 'caster',
            markerId: 'lizhiyan_power_attack_effect',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
          }),
        ),
        37,
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
        51,
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
        37,
      ),
    ],
    skillType: 'finisher',
    levelSource: 'basicAttack',
    nativeSkillType: 'breakingAttack',
  },
  {
    atb: 8,
    atk_scale: [
      4, 4.40000009536743, 4.80000019073486, 5.19999980926514, 5.59999990463257, 6,
      6.40000009536743, 6.80000019073486, 7.19999980926514, 7.69999980926514, 8.30000019073486, 9,
    ],
    cnt: 0,
    dmg_up: 0,
    poise: 20,
  },
);

export const arcanePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0032_lizhiyan_plunging_attack_end',
    timelineBlockFrames: 13,
    naturalDurationFrames: 120,
    exclusiveFrame: 12,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0032_lizhiyan_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const arcaneBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0032_lizhiyan_normal_skill',
    timelineBlockFrames: 24,
    naturalDurationFrames: 225,
    exclusiveFrame: 32,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 24, endFrame: 56, sourceSkillIds: ['chr_0032_lizhiyan_combo_skill'] },
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
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_normal_skill',
            childSkillId: 'chr_0032_lizhiyan_normal_skill_abilityrange2',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'constant', value: 7 },
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
            },
          }),
        ),
        2,
      ),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: 2.85,
    atk_scale_will: [
      1.33000004291534, 1.47000002861023, 1.60000002384186, 1.73000001907349, 1.87000000476837, 2,
      2.13000011444092, 2.26999998092651, 2.40000009536743, 2.5699999332428, 2.76999998092651, 3,
    ],
    atk_scale_wisd: [
      2.22000002861023, 2.45000004768372, 2.67000007629395, 2.89000010490417, 3.10999989509583,
      3.32999992370605, 3.55999994277954, 3.77999997138977, 4, 4.28000020980835, 4.6100001335144, 5,
    ],
    atk_scale_wisd_ratio: 1.5,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 6,
    input_angle: 0,
    poise: 10,
    radius: 5,
  },
);

export const arcaneComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0032_lizhiyan_combo_skill',
    timelineBlockFrames: 16,
    naturalDurationFrames: 122,
    exclusiveFrame: 23,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 16, endFrame: 39, sourceSkillIds: ['chr_0032_lizhiyan_normal_skill'] },
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
              left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'duration_final',
                operation: 'add',
                left: { kind: 'blackboard', key: 'duration_pre' },
                right: { kind: 'blackboard', key: 'duration' },
              }),
              step('calculateActionValue', {
                key: 'trigger_time',
                operation: 'add',
                left: { kind: 'blackboard', key: 'duration_final' },
                right: { kind: 'constant', value: -0.5 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'rate_final',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'rate_pre' },
                  }),
                ),
                sequence(
                  step('storeSourceAttributeValue', {
                    attribute: { kind: 'specific', key: 'will' },
                    stage: 'armedNonConverted',
                    useFloor: false,
                    divisor: { kind: 'constant', value: 1 },
                    multiplier: { kind: 'constant', value: 1 },
                    base: { kind: 'constant', value: 0 },
                    targetKey: 'will',
                  }),
                  step('calculateActionValue', {
                    key: 'rate_final',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'spell_vul_per_will' },
                    right: { kind: 'blackboard', key: 'will' },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'rate_final' },
                      operator: 'lessOrEqual',
                      right: { kind: 'blackboard', key: 'max_spell_vul_will' },
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'rate_final' },
                        right: { kind: 'blackboard', key: 'rate_pre' },
                      }),
                    ),
                    sequence(
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'max_spell_vul_will' },
                        right: { kind: 'constant', value: 1 },
                      }),
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'rate_final' },
                        right: { kind: 'blackboard', key: 'rate_pre' },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('calculateActionValue', {
                key: 'duration',
                operation: 'add',
                left: { kind: 'constant', value: 0 },
                right: { kind: 'blackboard', key: 'duration_will' },
              }),
              step('calculateActionValue', {
                key: 'duration_final',
                operation: 'add',
                left: { kind: 'blackboard', key: 'duration_pre' },
                right: { kind: 'blackboard', key: 'duration' },
              }),
              step('calculateActionValue', {
                key: 'trigger_time',
                operation: 'add',
                left: { kind: 'blackboard', key: 'duration_final' },
                right: { kind: 'constant', value: -0.5 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'rate_final',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'rate_pre' },
                  }),
                ),
                sequence(
                  step('storeSourceAttributeValue', {
                    attribute: { kind: 'specific', key: 'will' },
                    stage: 'armedNonConverted',
                    useFloor: false,
                    divisor: { kind: 'constant', value: 1 },
                    multiplier: { kind: 'constant', value: 1 },
                    base: { kind: 'constant', value: 0 },
                    targetKey: 'will',
                  }),
                  step('calculateActionValue', {
                    key: 'rate_final',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'spell_vul_per_will' },
                    right: { kind: 'blackboard', key: 'will' },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'rate_final' },
                      operator: 'lessOrEqual',
                      right: { kind: 'blackboard', key: 'max_spell_vul_will' },
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'rate_final' },
                        right: { kind: 'blackboard', key: 'rate_pre' },
                      }),
                    ),
                    sequence(
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'max_spell_vul_will' },
                        right: { kind: 'constant', value: 1 },
                      }),
                      step('calculateActionValue', {
                        key: 'rate_final',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'rate_final' },
                        right: { kind: 'blackboard', key: 'rate_pre' },
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
        9,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.0329999998211861 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            ignoredTargets: [],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        10,
      ),
      scheduled(
        9,
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
                abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
                childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
                overrideDurationSeconds: { kind: 'constant', value: 40 },
                saveToContextKey: 'bunshin1',
                blackboardAssignments: {
                  EntityBB_wisd_greater_will: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                  },
                },
              }),
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
                childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
                overrideDurationSeconds: { kind: 'constant', value: 40 },
                saveToContextKey: 'bunshin2',
                blackboardAssignments: {
                  EntityBB_wisd_greater_will: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                  },
                },
              }),
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
                childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
                overrideDurationSeconds: { kind: 'constant', value: 40 },
                saveToContextKey: 'bunshin3',
                blackboardAssignments: {
                  EntityBB_wisd_greater_will: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                  },
                },
              }),
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',
                childSkillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
                inheritActionBlackboard: true,
                inheritSourceSkillCastInfo: true,
                dieWhenSourceDies: false,
                overrideDurationSeconds: { kind: 'constant', value: 40 },
                saveToContextKey: 'bunshin4',
                blackboardAssignments: {
                  EntityBB_wisd_greater_will: {
                    kind: 'blackboard',
                    key: 'EntityBB_wisd_greater_will',
                  },
                },
              }),
              forEachContextTarget(
                'bunshin1',
                sequence(
                  step('setAbilityEntityRemainingDuration', {
                    value: { kind: 'constant', value: 0.5 },
                  }),
                ),
              ),
              forEachContextTarget(
                'bunshin2',
                sequence(
                  step('setAbilityEntityRemainingDuration', {
                    value: { kind: 'constant', value: 0.5 },
                  }),
                ),
              ),
              forEachContextTarget(
                'bunshin3',
                sequence(
                  step('setAbilityEntityRemainingDuration', {
                    value: { kind: 'constant', value: 0.5 },
                  }),
                ),
              ),
              forEachContextTarget(
                'bunshin4',
                sequence(
                  step('setAbilityEntityRemainingDuration', {
                    value: { kind: 'constant', value: 0.5 },
                  }),
                ),
              ),
            ),
          ),
        ),
        10,
      ),
      scheduled(
        9,
        sequence(
          forEachContextTarget(
            'bunshin1',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 30 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin2',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 30 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin3',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 30 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin4',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 30 } }),
            ),
          ),
        ),
        12,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_combo_skill_precheck',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        11,
      ),
      scheduled(
        9,
        sequence(
          step('calculateActionValue', {
            key: 'duration_total',
            operation: 'add',
            left: { kind: 'blackboard', key: 'duration_final' },
            right: { kind: 'constant', value: 0.0670000016689301 },
          }),
        ),
        12,
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_total',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration_total: { kind: 'blackboard', key: 'duration_total' },
              duration_final: { kind: 'blackboard', key: 'duration_final' },
              rate_final: { kind: 'blackboard', key: 'rate_final' },
              trigger_time: { kind: 'blackboard', key: 'trigger_time' },
              isWisd: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              atk_scale_boom: { kind: 'blackboard', key: 'atk_scale_boom' },
              poise_boom: { kind: 'blackboard', key: 'poise_boom' },
              radius: { kind: 'blackboard', key: 'radius' },
              duration_seal2: { kind: 'blackboard', key: 'duration' },
              rate_pre: { kind: 'blackboard', key: 'rate_pre' },
              atk_scale_touch: { kind: 'blackboard', key: 'atk_scale_touch' },
              poise_touch: { kind: 'blackboard', key: 'poise_touch' },
              usp: { kind: 'blackboard', key: 'usp' },
              atb_return_wisd: { kind: 'blackboard', key: 'atb_return_wisd' },
            },
          }),
        ),
        30,
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
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb_return_wisd: [28, 28, 28, 28, 28, 28, 28, 28, 28, 30, 30, 30],
    atk_scale_boom: [
      0.529999971389771, 0.589999973773956, 0.639999985694885, 0.689999997615814, 0.75,
      0.800000011920929, 0.850000023841858, 0.910000026226044, 0.959999978542328, 1.02999997138977,
      1.11000001430511, 1.20000004768372,
    ],
    atk_scale_laser1: [
      0.270000010728836, 0.28999999165535, 0.319999992847443, 0.349999994039536, 0.370000004768372,
      0.400000005960464, 0.430000007152557, 0.449999988079071, 0.479999989271164, 0.509999990463257,
      0.550000011920929, 0.600000023841858,
    ],
    atk_scale_laser2: [
      1.14999997615814, 1.26999998092651, 1.37999999523163, 1.5, 1.62000000476837, 1.73000001907349,
      1.85000002384186, 1.96000003814697, 2.07999992370605, 2.22000002861023, 2.39000010490417,
      2.59999990463257,
    ],
    atk_scale_touch: [
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.5,
      0.529999971389771, 0.569999992847443, 0.600000023841858, 0.639999985694885, 0.680000007152557,
      0.730000019073486, 0.800000011920929,
    ],
    atk_scale_wisd_ratio: 5,
    cd_reduce: 0,
    consumed_layer: 0,
    consumed_type: 0,
    duration: 4,
    duration_effect: 0,
    duration_extra: 6,
    duration_final: 0,
    duration_pre: 0.633,
    duration_seal2: 0,
    duration_total: 0,
    duration_will: 6,
    max_spell_vul_will: [
      0.0700000002980232, 0.0700000002980232, 0.0700000002980232, 0.0700000002980232,
      0.0700000002980232, 0.0700000002980232, 0.0700000002980232, 0.0700000002980232,
      0.0750000029802322, 0.0750000029802322, 0.0750000029802322, 0.0799999982118607,
    ],
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise_boom: 5,
    poise_laser: 0,
    poise_touch: 5,
    radius: 5.67,
    rate: 0.4,
    rate_final: 0,
    rate_pre: 0.0399999991059303,
    spell_vul_per_will: 0.000125000005937181,
    trigger_time: 0,
    usp: 10,
    will: 0,
    display_atk_scale_laser_wisd: [
      2.22000002861023, 2.44000005722046, 2.66000008583069, 2.89000010490417, 3.10999989509583,
      3.32999992370605, 3.54999995231628, 3.76999998092651, 4, 4.26999998092651, 4.6100001335144, 5,
    ],
    display_max_spell_vul_will: [560, 560, 560, 560, 560, 560, 560, 560, 600, 600, 600, 640],
    duration_wisd: 2,
  },
);

export const arcaneUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0032_lizhiyan_ultimate_skill',
    timelineBlockFrames: 48,
    naturalDurationFrames: 308,
    exclusiveFrame: 72,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 48,
          endFrame: 79,
          sourceSkillIds: ['chr_0032_lizhiyan_combo_skill', 'chr_0032_lizhiyan_normal_skill'],
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
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        44,
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
        47,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0032_lizhiyan_ultimate_skill_listener',
              'buff_chr_0032_lizhiyan_ultimate_skill_layer',
            ],
            reason: 'other',
          }),
        ),
        3,
      ),
      scheduled(
        41,
        sequence(
          step('modifyActionValue', {
            key: 'isWisd',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill',
            childSkillId: 'chr_0032_lizhiyan_ultimate_skill_abilityrange',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 0 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 1 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 2 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 3 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 4 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 5 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 6 } },
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
            blackboardAssignments: { EntityBB_index: { kind: 'constant', value: 7 } },
          }),
          step('setIgnoreGlobalTimeScale', {
            abilityEntityTargets: [
              {
                kind: 'ownerSpawned',
                abilityEntityIds: [
                  'abilityentity_chr_0032_lizhiyan_ultimate_skill',
                  'abilityentity_chr_0032_lizhiyan_ultimate_skill_place',
                ],
              },
            ],
            ignore: true,
            revertOnEnd: true,
          }),
        ),
        55,
      ),
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey:
              '__finishOwner:SkillData.chr_0032_lizhiyan_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          }),
          forEachContextTarget(
            '__finishOwner:SkillData.chr_0032_lizhiyan_ultimate_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]',
            sequence(step('finishCurrentAbilityEntity', {})),
          ),
        ),
        3,
      ),
      scheduled(
        47,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              isWisd: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
            },
          }),
        ),
        50,
      ),
      scheduled(
        0,
        sequence(
          step('restrictUltimateEnergyRecovery', {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: false,
          }),
        ),
        47,
      ),
      scheduled(
        47,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_natural_natural_corrupt_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  count: { kind: 'blackboard', key: 'count' },
                  duration: { kind: 'blackboard', key: 'duration2' },
                },
              }),
            ),
            sequence(
              forEachTarget(
                'enemy',
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
                      step('applyElementalInfliction', { element: 'nature', isExtra: false }),
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
                          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
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
                              step('applyElementalInfliction', {
                                element: 'electric',
                                isExtra: false,
                              }),
                            ),
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
                                  step('applyElementalInfliction', {
                                    element: 'heat',
                                    isExtra: false,
                                  }),
                                ),
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
              ),
            ),
            { alwaysNext: true },
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0032_lizhiyan_talent1'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffBlackboard', {
                    target: 'caster',
                    query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                    desiredKey: 'spell_vul_rate',
                    outputKey: 'spell_vul_rate',
                  }),
                  step('readBuffBlackboard', {
                    target: 'caster',
                    query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                    desiredKey: 'spell_vul_rate_potential',
                    outputKey: 'spell_vul_rate_potential',
                  }),
                  step('calculateActionValue', {
                    key: 'spell_vul_rate_calc',
                    operation: 'add',
                    left: { kind: 'blackboard', key: 'spell_vul_rate' },
                    right: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'duration',
                        outputKey: 'duration_vul',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'spell_vul_rate_per_will',
                        outputKey: 'spell_vul_rate_per_will',
                      }),
                      step('storeSourceAttributeValue', {
                        attribute: { kind: 'specific', key: 'will' },
                        stage: 'armedNonConverted',
                        useFloor: false,
                        divisor: { kind: 'constant', value: 1 },
                        multiplier: { kind: 'constant', value: 1 },
                        base: { kind: 'constant', value: 0 },
                        targetKey: 'will',
                      }),
                      step('calculateActionValue', {
                        key: 'spell_vul_rate_calc',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'will' },
                        right: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                          operator: 'lessOrEqual',
                          right: { kind: 'blackboard', key: 'spell_vul_rate' },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'spell_vul_rate_calc',
                            operation: 'add',
                            value: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              rate: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                              duration: { kind: 'blackboard', key: 'duration_vul' },
                            },
                          }),
                        ),
                        sequence(
                          step('modifyActionValue', {
                            key: 'spell_vul_rate',
                            operation: 'add',
                            value: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              rate: { kind: 'blackboard', key: 'spell_vul_rate' },
                              duration: { kind: 'blackboard', key: 'duration_vul' },
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
            { alwaysNext: true },
          ),
          step(
            'dealDamage',
            {
              damageType: 'nature',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0032_lizhiyan_ultimate_skill:/scheduledSequences/8/sequence/steps/2',
          ),
        ),
        47,
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
        72,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    enhancementStateBuffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner',
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    atk_scale_laser: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.379999995231628,
      0.409999996423721, 0.449999988079071,
    ],
    atk_scale_laser_will: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.379999995231628,
      0.409999996423721, 0.449999988079071,
    ],
    count: 1,
    duration: 20,
    duration_aura: 60,
    duration_vul: 0,
    duration2: 15,
    isWisd: 1,
    lv: 0,
    poise: 10,
    radius: 30,
    select_radius: 10,
    spell_vul_rate: 0,
    spell_vul_rate_calc: 0,
    spell_vul_rate_per_will: 0,
    spell_vul_rate_potential: 0,
    will: 0,
    display_atk_scale_laser: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    display_atk_scale_laser_will: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    laser_count: 8,
  },
);

export const arcaneArcana: SkillDefinition = withSkillBlackboard(
  {
    key: 'arcana',
    sourceSkillId: 'chr_0032_lizhiyan_ultimate_skill2',
    timelineBlockFrames: 60,
    naturalDurationFrames: 287,
    exclusiveFrame: 75,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 60,
          endFrame: 91,
          sourceSkillIds: ['chr_0032_lizhiyan_normal_skill', 'chr_0032_lizhiyan_combo_skill'],
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
              buffIds: ['buff_chr_0032_lizhiyan_talent1'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                desiredKey: 'enhance_rate',
                outputKey: 'enhance_rate',
              }),
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                desiredKey: 'spell_vul_rate',
                outputKey: 'spell_vul_rate',
              }),
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                desiredKey: 'lv',
                outputKey: 'lv',
              }),
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                desiredKey: 'spell_vul_rate_potential',
                outputKey: 'spell_vul_rate_potential',
              }),
              step('calculateActionValue', {
                key: 'spell_vul_rate_calc',
                operation: 'add',
                left: { kind: 'blackboard', key: 'spell_vul_rate' },
                right: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'enhance_rate' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        asChildBuff: true,
                        blackboardAssignments: {
                          enhance_rate: { kind: 'blackboard', key: 'enhance_rate' },
                        },
                      }),
                    ),
                  ),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'duration',
                        outputKey: 'duration_vul',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'spell_vul_rate_per_will',
                        outputKey: 'spell_vul_rate_per_will',
                      }),
                      step('storeSourceAttributeValue', {
                        attribute: { kind: 'specific', key: 'will' },
                        stage: 'armedNonConverted',
                        useFloor: false,
                        divisor: { kind: 'constant', value: 1 },
                        multiplier: { kind: 'constant', value: 1 },
                        base: { kind: 'constant', value: 0 },
                        targetKey: 'will',
                      }),
                      step('calculateActionValue', {
                        key: 'spell_vul_rate_calc',
                        operation: 'multiply',
                        left: { kind: 'blackboard', key: 'will' },
                        right: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                          operator: 'lessOrEqual',
                          right: { kind: 'blackboard', key: 'spell_vul_rate' },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'spell_vul_rate',
                            operation: 'assign',
                            value: { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                          }),
                          step('modifyActionValue', {
                            key: 'spell_vul_rate',
                            operation: 'add',
                            value: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
                          }),
                        ),
                        sequence(
                          step('modifyActionValue', {
                            key: 'spell_vul_rate',
                            operation: 'add',
                            value: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
                          }),
                        ),
                        { alwaysNext: true },
                      ),
                    ),
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        287,
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
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener',
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
          step('finishBuffsById', {
            target: 'caster',
            buffIds: [
              'buff_chr_0032_lizhiyan_ultimate_skill_listener',
              'buff_chr_0032_lizhiyan_ultimate_skill_layer',
            ],
            reason: 'other',
          }),
        ),
        3,
      ),
      scheduled(
        57,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ult_abilityentity',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          }),
          forEachContextTarget(
            'ult_abilityentity',
            sequence(step('finishCurrentAbilityEntity', {})),
          ),
        ),
        58,
      ),
      scheduled(
        0,
        sequence(
          step('changeSkillSlot', {
            skillGroupKey: 'ultimate',
            targetSkillKey: 'ultimate',
            inheritOriginSkillCooldownProgress: false,
            lifetime: 'infinite',
          }),
        ),
        3,
      ),
      scheduled(
        58,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'spell_vul_rate' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_talent1_vulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      rate: { kind: 'blackboard', key: 'spell_vul_rate' },
                      duration: { kind: 'blackboard', key: 'duration_vul' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_will' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0032_lizhiyan_ultimate_skill2:/scheduledSequences/6/sequence/steps/0/whenTrue/steps/1',
              ),
            ),
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0032_lizhiyan_ultimate_skill2:/scheduledSequences/6/sequence/steps/0/whenFalse/steps/0',
              ),
            ),
            { alwaysNext: true },
          ),
        ),
        58,
      ),
      scheduled(58, sequence(forEachTarget('enemy', sequence())), 59),
      scheduled(
        60,
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
                durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 15,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 0.699999988079071,
                      inTangent: -6.59171915054321,
                      outTangent: -6.59171915054321,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.100000001490116,
                      value: 0.0149999996647239,
                      inTangent: 0.0315926484763622,
                      outTangent: 0.0315926484763622,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.748440325260162,
                      value: 0.181559100747108,
                      inTangent: 0.931204199790955,
                      outTangent: 0.931204199790955,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.699999988079071,
                      inTangent: 2.42842197418213,
                      outTangent: 2.42842197418213,
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
          ),
        ),
        63,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'cd_minus' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'id', skillId: 'chr_0032_lizhiyan_combo_skill' },
                operation: 'reduce',
                basis: 'baseDurationRatio',
                value: { kind: 'blackboard', key: 'cd_minus' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        3,
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
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        59,
      ),
      scheduled(
        59,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        75,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      6.40000009536743, 7.03999996185303, 7.67999982833862, 8.31999969482422, 8.96000003814697,
      9.60000038146973, 10.2399997711182, 10.8800001144409, 11.5200004577637, 12.3199996948242,
      13.2799997329712, 14.3999996185303,
    ],
    atk_scale_will: [
      1.60000002384186, 1.75999999046326, 1.91999995708466, 2.07999992370605, 2.24000000953674,
      2.40000009536743, 2.55999994277954, 2.72000002861023, 2.88000011444092, 3.07999992370605,
      3.3199999332428, 3.59999990463257,
    ],
    cd_minus: 0,
    duration_vul: 0,
    enhance_rate: 0,
    lv: 0,
    poise: 10,
    radius: 5,
    rand_x: 0,
    rand_y: 0,
    rand_z: 0,
    select_radius: 13,
    spell_vul_rate: 0,
    spell_vul_rate_calc: 0,
    spell_vul_rate_per_will: 0,
    spell_vul_rate_potential: 0,
    will: 0,
  },
);

export default {
  slug: 'arcane',
  gameId: 'ARCANE',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'nature',
  role: 'caster',
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
  attributes: {
    strength: [9, 26, 45, 64, 82, 91],
    agility: [9, 27, 46, 65, 84, 93],
    intellect: [21, 54, 89, 124, 159, 176],
    will: [14, 37, 61, 85, 109, 121],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  trustAttributeBonus: { values: [8, 10, 10, 15], attributes: ['intellect', 'will'] },
  passiveUi: { kind: 'numeric', appearance: 'arcaneSigils', maximum: 3 },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        arcaneBasicAttack1,
        arcaneBasicAttack2,
        arcaneBasicAttack3,
        arcaneBasicAttack4,
        arcaneBasicAttack5,
      ],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: arcaneFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: arcanePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: arcaneBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: arcaneComboSkill,
    },
    {
      key: 'ultimate',
      skillType: 'ultimate',
      levelSource: 'ultimate',
      skills: arcaneUltimate,
      replacementSkills: [arcaneArcana],
      replacementSkillPlacements: { arcana: 'standard' },
    },
  ],
  skillSlots: [
    { key: 'battleSkill', baseSkillKey: 'battleSkill', replacementSkillKeys: [] },
    { key: 'comboSkill', baseSkillKey: 'comboSkill', replacementSkillKeys: [] },
    { key: 'ultimate', baseSkillKey: 'ultimate', replacementSkillKeys: ['arcana'] },
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
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: { consumed_layer: 0, consumed_type: 0 },
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(branch({ kind: 'eventInflictionElementIn', elements: ['nature'] }, sequence())),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: { consumed_layer: 0, consumed_type: 0 },
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(
            branch(
              { kind: 'eventInflictionElementIn', elements: ['heat'] },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffStackCompare',
                    contextKey: 'trigger',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/FireInflict'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(),
                ),
              ),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:2',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: { consumed_layer: 0, consumed_type: 0 },
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(
            branch(
              { kind: 'eventInflictionElementIn', elements: ['electric'] },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffStackCompare',
                    contextKey: 'trigger',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(),
                ),
              ),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:3',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: { consumed_layer: 0, consumed_type: 0 },
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(
            branch(
              { kind: 'eventInflictionElementIn', elements: ['cryo'] },
              sequence(
                branch(
                  {
                    kind: 'contextTargetBuffStackCompare',
                    contextKey: 'trigger',
                    tagQueryType: 'hasAny',
                    buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                  },
                  sequence(),
                ),
              ),
            ),
          ),
        ),
      ),
    },
    {
      key: 'native-combo:4',
      skillKey: 'comboSkill',
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: { consumed_layer: 0, consumed_type: 0 },
      sequence: sequence(
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
            operator: 'less',
            right: { kind: 'constant', value: 1 },
          },
          sequence(
            branch(
              {
                kind: 'eventInflictionElementIn',
                elements: ['heat', 'electric', 'cryo', 'nature'],
                outputKey: 'EntityBB_consumed_type',
              },
              sequence(),
            ),
          ),
        ),
      ),
    },
  ],
  comboSkillPriority: 'enemyRank',
  talents: [
    {
      key: 'formationEnhancement',
      levels: 2,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -180,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
      ],
      passiveSkills: [
        {
          key: 'chr_0032_lizhiyan_talent1',
          blackboard: {
            duration: [10, 10],
            enhance_rate: [0, 0.239999994635582],
            lv: [1, 2],
            spell_vul_rate: [0, 0.128000006079674],
            spell_vul_rate_per_will: [0, 0.000199999994947575],
            spell_vul_rate_potential: [0, 0],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_talent1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                duration: { kind: 'blackboard', key: 'duration' },
                enhance_rate: { kind: 'blackboard', key: 'enhance_rate' },
                lv: { kind: 'blackboard', key: 'lv' },
                spell_vul_rate: { kind: 'blackboard', key: 'spell_vul_rate' },
                spell_vul_rate_per_will: { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
                spell_vul_rate_potential: { kind: 'blackboard', key: 'spell_vul_rate_potential' },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'corrosionMastery',
      levels: 2,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: [5, 10] },
        {
          kind: 'addReactionEffectiveness',
          reaction: 'corrosion',
          value: [0.0500000007450581, 0.100000001490116],
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'strengthenedComboSkill',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_touch',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_boom',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_laser1',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_laser2',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_return_wisd',
          operation: 'add',
          value: 10,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate_pre',
          operation: 'add',
          value: 0.0599999986588955,
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'less',
            right: 'will',
          },
        },
      ],
    },
    {
      key: 'attributeAndArtsIntensity',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 15 },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      key: 'strongerCorrosionMastery',
      levels: 1,
      modifiers: [
        { kind: 'addReactionDuration', reaction: 'corrosion', seconds: 5 },
        { kind: 'addReactionEffectiveness', reaction: 'corrosion', value: 0.200000002980232 },
      ],
    },
    {
      key: 'reducedUltimateCost',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          skillKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.850000023841858,
        },
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          skillKey: 'arcana',
          resource: 'ultimateEnergy',
          multiplier: 0.850000023841858,
        },
      ],
    },
    {
      key: 'strengthenedFormTalentAndArcana',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'enhance_rate',
          operation: 'add',
          value: 0.159999996423721,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'spell_vul_rate_potential',
          operation: 'add',
          value: 0.0700000002980232,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'arcana',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.29999995231628,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'arcana',
          blackboardKey: 'cd_minus',
          operation: 'add',
          value: 0.300000011920929,
        },
      ],
    },
  ],
  entityBlackboard: {
    EntityBB_consumed_layer: 0,
    EntityBB_consumed_type: 0,
    EntityBB_ult_hit: 0,
    EntityBB_wisd_greater_will: 1,
  },
  passiveSkills: [
    {
      key: 'chr_0032_lizhiyan_passive',
      enableSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0032_lizhiyan_passive',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
  ],
  entityBlackboardInitializers: [
    {
      key: 'EntityBB_wisd_greater_will',
      condition: {
        kind: 'deckAttributeCompare',
        left: 'intellect',
        operator: 'greaterOrEqual',
        right: 'will',
      },
      trueValue: 1,
      falseValue: 0,
    },
  ],
  buffDefinitions: {
    buff_chr_0032_lizhiyan_combo_skill_precheck: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'trigger_time' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 5, isWisd: 0, rate_pre: 0.1, trigger_time: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre',
            target: 'enemy',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration_vul: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate_pre' },
            },
          }),
        ),
        trigger: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'bunshin',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
            sameSourceSkillCast: true,
          }),
          forEachContextTarget(
            'bunshin',
            sequence(
              step('startCurrentAbilityEntityChildSkillById', {
                childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_end',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_atb: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.100000001490116,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_return_wisd: 10,
        atk_scale_early_finish: 1,
        poise_early_finish: 1,
        radius_early_finish: 5.67,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'buffIdStackCompare',
                target: 'buffOwner',
                buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal2'],
                operator: 'less',
                value: { kind: 'constant', value: 1 },
                sameSourceSkillCast: true,
              },
              sequence(
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'buffOwner',
                    buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_atb'],
                    operator: 'less',
                    value: { kind: 'constant', value: 1 },
                    sameSourceSkillCast: true,
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
                          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalSkill'] },
                          sequence(
                            step('changeResourceByActionValue', {
                              resource: 'sp',
                              amount: { kind: 'blackboard', key: 'atb_return_wisd' },
                              coefficient: { kind: 'constant', value: 1 },
                              recipient: 'team',
                              spGainKind: 'refund',
                              spGainSource: 'default',
                            }),
                            step(
                              'dealDamage',
                              {
                                damageType: 'nature',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_early_finish' },
                                tags: ['comboSkill'],
                                features: ['canBreakWeakness'],
                                stagger: { kind: 'blackboard', key: 'poise_early_finish' },
                              },
                              'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener:/abilityEventResponses/0/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                            ),
                            step('createTimedMarker', {
                              target: 'buffSource',
                              markerId: 'lizhiyan_combo_hit',
                              durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                              autoFinishByAction: false,
                            }),
                            step('finishCurrentBuff', { reason: 'early' }),
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
    buff_chr_0032_lizhiyan_combo_skill_seal_finish_count: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_finisher: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 5,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_laser2: 0, cd_reduce: 7, isWisd: 0, poise_final: 10, radius: 5 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser2' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise_final' },
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher:/scheduledSequences/0/sequence/steps/0',
            ),
            step('createTimedMarker', {
              target: 'caster',
              markerId: 'lizhiyan_combo_hit',
              durationSeconds: { kind: 'constant', value: 0.100000001490116 },
              autoFinishByAction: false,
            }),
          ),
          6,
        ),
        scheduled(
          1,
          sequence(
            step('findOwnerSpawnedAbilityEntities', {
              saveToContextKey: 'bunshin',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
              sameSourceSkillCast: true,
            }),
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.550000011920929 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 15,
              curve: {
                kind: 'inline',
                keys: [
                  {
                    time: 0,
                    value: 0.5,
                    inTangent: -6.04272794723511,
                    outTangent: -6.04272794723511,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.100000001490116,
                    value: 0.0149999996647239,
                    inTangent: 0.0315926484763622,
                    outTangent: 0.0315926484763622,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.850000023841858,
                    value: 0.180000007152557,
                    inTangent: 0.539309918880463,
                    outTangent: 0.539309918880463,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 1,
                    value: 0.699999988079071,
                    inTangent: 4.79308223724365,
                    outTangent: 4.79308223724365,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                ],
              },
              finishByAction: false,
              targets: [],
              abilityEntityTargets: [{ kind: 'context', contextKey: 'bunshin' }],
            }),
          ),
          4,
        ),
        scheduled(
          0,
          sequence(
            forEachTarget(
              'enemy',
              sequence(
                step('finishBuffsById', {
                  target: 'enemy',
                  buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                  reason: 'other',
                }),
              ),
            ),
          ),
          3,
        ),
      ],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_return_wisd: 0,
        atk_scale_laser1: 0.5,
        atk_scale_laser2: 3,
        cd_reduce: 7,
        isWisd: 0,
        poise_final: 10,
        radius: 5.67,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('findCharacterTeamTargets', {
              saveToContextKey: 'mainchar',
              selection: { kind: 'controlledOperator' },
            }),
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill_place',
              inheritActionBlackboard: true,
              inheritSourceSkillCastInfo: true,
              dieWhenSourceDies: false,
              overrideDurationSeconds: { kind: 'constant', value: 2 },
              saveToContextKey: 'laser_root',
            }),
          ),
          3,
        ),
        scheduled(
          2,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser1' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd:/scheduledSequences/1/sequence/steps/0',
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
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser1' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd:/scheduledSequences/2/sequence/steps/0',
            ),
          ),
          7,
        ),
        scheduled(
          8,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser1' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd:/scheduledSequences/3/sequence/steps/0',
            ),
          ),
          10,
        ),
        scheduled(
          11,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser1' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd:/scheduledSequences/4/sequence/steps/0',
            ),
          ),
          13,
        ),
        scheduled(
          17,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'nature',
                attackScale: { kind: 'blackboard', key: 'atk_scale_laser2' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise_final' },
              },
              'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd:/scheduledSequences/5/sequence/steps/0',
            ),
            step('createTimedMarker', {
              target: 'caster',
              markerId: 'lizhiyan_combo_hit',
              durationSeconds: { kind: 'constant', value: 0.100000001490116 },
              autoFinishByAction: false,
            }),
          ),
          23,
        ),
        scheduled(
          11,
          sequence(
            step('findOwnerSpawnedAbilityEntities', {
              saveToContextKey: 'bunshin',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
              sameSourceSkillCast: true,
            }),
          ),
          14,
        ),
        scheduled(
          18,
          sequence(
            step('findOwnerSpawnedAbilityEntities', {
              saveToContextKey: 'bunshin',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
              sameSourceSkillCast: true,
            }),
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.550000011920929 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 15,
              curve: {
                kind: 'inline',
                keys: [
                  {
                    time: 0,
                    value: 0.600000023841858,
                    inTangent: -5.65639305114746,
                    outTangent: -5.65639305114746,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.100000001490116,
                    value: 0.0149999996647239,
                    inTangent: 0.0315926484763622,
                    outTangent: 0.0315926484763622,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.850000023841858,
                    value: 0.180000007152557,
                    inTangent: 0.539309918880463,
                    outTangent: 0.539309918880463,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 1,
                    value: 0.699999988079071,
                    inTangent: 4.79308223724365,
                    outTangent: 4.79308223724365,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                ],
              },
              finishByAction: false,
              targets: ['enemy'],
              abilityEntityTargets: [{ kind: 'current' }],
            }),
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.550000011920929 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 15,
              curve: {
                kind: 'inline',
                keys: [
                  {
                    time: 0,
                    value: 0.600000023841858,
                    inTangent: -5.65639305114746,
                    outTangent: -5.65639305114746,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.100000001490116,
                    value: 0.0149999996647239,
                    inTangent: 0.0315926484763622,
                    outTangent: 0.0315926484763622,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 0.850000023841858,
                    value: 0.180000007152557,
                    inTangent: 0.539309918880463,
                    outTangent: 0.539309918880463,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                  {
                    time: 1,
                    value: 0.699999988079071,
                    inTangent: 4.79308223724365,
                    outTangent: 4.79308223724365,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                ],
              },
              finishByAction: false,
              targets: [],
              abilityEntityTargets: [{ kind: 'context', contextKey: 'bunshin' }],
            }),
          ),
          21,
        ),
        scheduled(
          17,
          sequence(
            forEachTarget(
              'enemy',
              sequence(
                step('finishBuffsById', {
                  target: 'enemy',
                  buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                  reason: 'other',
                }),
              ),
            ),
          ),
          20,
        ),
      ],
      lifecycleSequences: {
        start: sequence(
          step('createTimedMarker', {
            target: 'caster',
            markerId: 'lizhiyan_combo_wisd_has_finish',
            durationSeconds: { kind: 'constant', value: 1 },
            autoFinishByAction: false,
          }),
        ),
        finish: sequence(
          step('triggerCustomAbilityEvent', {
            eventName: 'lizhiyan_combo_wisd_end',
            eventParam: 0,
            target: 'caster',
            source: 'currentAbilityEntity',
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_listener: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale_early_finish: 5,
        atk_scale_wisd_ratio: 0,
        duration: 5,
        duration_extra: 0,
        poise_early_finish: 5,
        radius: 5.67,
        radius_early_finish: 5.67,
        wisd_greater_will: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'buffEndsEarly',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffIdMatch',
                buffIds: [
                  'buff_chr_0032_lizhiyan_combo_skill_seal',
                  'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener',
                ],
              },
              sequence(
                step('findOwnerSpawnedAbilityEntities', {
                  saveToContextKey: 'bunshin',
                  abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'],
                  sameSourceSkillCast: true,
                }),
                forEachContextTarget(
                  'bunshin',
                  sequence(
                    step('startCurrentAbilityEntityChildSkillById', {
                      childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_again',
                    }),
                  ),
                ),
                step('finishCurrentBuff', { reason: 'other' }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal_total: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_total' },
      timeClock: 'global',
      applyTags: [],
      extendTags: [],
      blackboard: {
        atb_return_wisd: 0,
        atk_scale_boom: 0,
        atk_scale_touch: 0,
        duration_effect: 0,
        duration_final: 0,
        duration_seal2: 0,
        duration_total: 5,
        isWisd: 0,
        poise_boom: 0,
        poise_touch: 0,
        radius: 5.67,
        rate_final: 0,
        rate_pre: 0,
        trigger_time: 0.1,
        usp: 0,
      },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          2,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal',
              target: 'enemy',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                duration: { kind: 'blackboard', key: 'duration_final' },
                rate_pre: { kind: 'blackboard', key: 'rate_final' },
                trigger_time: { kind: 'blackboard', key: 'trigger_time' },
                isWisd: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              },
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_listener',
              target: 'enemy',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                duration: { kind: 'blackboard', key: 'duration_final' },
                wisd_greater_will: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                atk_scale_early_finish: { kind: 'blackboard', key: 'atk_scale_boom' },
                poise_early_finish: { kind: 'blackboard', key: 'poise_boom' },
              },
            }),
          ),
          21,
        ),
        scheduled(
          0,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_precheck',
              target: 'enemy',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              finishByAction: true,
            }),
          ),
          2,
        ),
        scheduled(
          6,
          sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                operator: 'less',
                right: { kind: 'constant', value: 1 },
              },
              sequence({
                kind: 'switch',
                parameters: {
                  choice: { kind: 'blackboard', key: 'EntityBB_consumed_type' },
                  alwaysNext: true,
                },
                options: [
                  {
                    value: { kind: 'constant', value: 3 },
                    sequence: sequence(
                      step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 2 },
                    sequence: sequence(
                      step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 1 },
                    sequence: sequence(
                      step('applyElementalInfliction', { element: 'electric', isExtra: false }),
                    ),
                  },
                  {
                    value: { kind: 'constant', value: 0 },
                    sequence: sequence(
                      step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                    ),
                  },
                ],
              }),
              undefined,
              { alwaysNext: true },
            ),
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal2',
              target: 'enemy',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                duration: { kind: 'blackboard', key: 'duration_seal2' },
                isWisd: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                rate_pre: { kind: 'blackboard', key: 'rate_pre' },
                atk_scale_early_finish: { kind: 'blackboard', key: 'atk_scale_boom' },
                poise_early_finish: { kind: 'blackboard', key: 'poise_boom' },
                atb_return_wisd: { kind: 'blackboard', key: 'atb_return_wisd' },
              },
            }),
            forEachTarget(
              'enemy',
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'nature',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_touch' },
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'poise_touch' },
                  },
                  'buff_chr_0032_lizhiyan_combo_skill_seal_total:/scheduledSequences/2/sequence/steps/2/body/steps/0',
                ),
              ),
            ),
            step('changeResourceByActionValue', {
              resource: 'ultimateEnergy',
              amount: { kind: 'blackboard', key: 'usp' },
              coefficient: { kind: 'constant', value: 1 },
              recipient: 'caster',
            }),
            branch(
              {
                kind: 'buffIdStackCompare',
                target: 'caster',
                buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener'],
                operator: 'greaterOrEqual',
                value: { kind: 'constant', value: 1 },
              },
              sequence(),
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
              { alwaysNext: true },
            ),
          ),
          9,
        ),
        scheduled(
          0,
          sequence(
            step('calculateActionValue', {
              key: 'duration_effect',
              operation: 'add',
              left: { kind: 'blackboard', key: 'duration_final' },
              right: { kind: 'constant', value: -0.200000002980232 },
            }),
          ),
          3,
        ),
      ],
    },
    buff_chr_0032_lizhiyan_combo_skill_seal2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_lizhiyan_combo_seal',
        iconPath: '/icons/icon_battle_buff_lizhiyan_combo_seal.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: ['Skill/Character/chr_0032_lizhiyan/combo_seal'],
      extendTags: [],
      blackboard: {
        atb_return_wisd: 0,
        atk_scale_early_finish: 1,
        duration: 5,
        isWisd: 1,
        poise_early_finish: 1,
        radius_early_finish: 5.67,
        rate_pre: 0.1,
        trigger_time: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'isWisd' },
                operator: 'greaterOrEqual',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                branch(
                  { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalSkill'] },
                  sequence(
                    branch(
                      {
                        kind: 'actionInputTargetIdentityMatch',
                        other: 'actionSource',
                        operator: 'equal',
                      },
                      sequence(
                        step('changeResourceByActionValue', {
                          resource: 'sp',
                          amount: { kind: 'blackboard', key: 'atb_return_wisd' },
                          coefficient: { kind: 'constant', value: 1 },
                          recipient: 'team',
                          spGainKind: 'refund',
                          spGainSource: 'default',
                        }),
                        step(
                          'dealDamage',
                          {
                            damageType: 'nature',
                            attackScale: { kind: 'blackboard', key: 'atk_scale_early_finish' },
                            tags: ['comboSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'blackboard', key: 'poise_early_finish' },
                          },
                          'buff_chr_0032_lizhiyan_combo_skill_seal2:/abilityEventResponses/0/sequence/steps/0/whenTrue/steps/0/whenTrue/steps/0/whenTrue/steps/1',
                        ),
                        step('applyBuff', {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_atb',
                          target: 'buffOwner',
                          source: 'buffSource',
                          inheritSourceSkillCastInfo: true,
                        }),
                        step('finishBuffsById', {
                          target: 'buffOwner',
                          buffIds: [
                            'buff_chr_0032_lizhiyan_combo_skill_seal',
                            'buff_chr_0032_lizhiyan_combo_skill_seal_effect',
                          ],
                          reason: 'early',
                        }),
                        step('finishCurrentBuff', { reason: 'early' }),
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
    buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_vul' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_lizhiyan_combo_vulnerable',
        iconPath: '/icons/icon_battle_buff_lizhiyan_combo_vulnerable.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale_calc: 0,
        atk_scale_laser1: 0,
        atk_scale_laser2: 0,
        cd_reduce: 7,
        duration_vul: 6,
        isWisd: 0,
        poise_final: 0,
        rate: 0.2,
      },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_natural',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration_vul' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
            },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_crystal',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration_vul' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
            },
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_vul' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_lizhiyan_combo_vulnerable',
        iconPath: '/icons/icon_battle_buff_lizhiyan_combo_vulnerable.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration_vul: 6, isWisd: 0, rate: 0.2 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_natural',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration_vul' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
            },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_crystal',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration_vul' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
            },
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_passive: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'deckAttributeCompare',
              left: 'intellect',
              operator: 'greaterOrEqual',
              right: 'will',
            },
            sequence(
              step('modifyActionValue', {
                key: 'EntityBB_wisd_greater_will',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'EntityBB_wisd_greater_will',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      },
    },
    buff_chr_0032_lizhiyan_talent1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      applyTags: [],
      extendTags: [],
      blackboard: {
        duration: 10,
        enhance_rate: 0.1,
        lv: 2,
        spell_vul_rate: 0.1,
        spell_vul_rate_per_will: 0,
        spell_vul_rate_potential: 0,
      },
      attributeModifiers: [],
    },
    buff_chr_0032_lizhiyan_talent1_enhance: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { enhance_rate: 0.1 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_enhance_spell',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'constant', value: -1 },
              rate: { kind: 'blackboard', key: 'enhance_rate' },
            },
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_talent1_vulnerable: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_lizhiyan_combo_vulnerable',
        iconPath: '/icons/icon_battle_buff_lizhiyan_combo_vulnerable.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'KeywordDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, rate: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_natural',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_natural_lizhiyan_child',
            },
          }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_crystal',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: {
              child_buff_id: 'buff_common_affixes_vulnerable_crystal_lizhiyan_child',
            },
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1.5,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: { finish: sequence(step('finishCurrentAbilityEntity', {})) },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_inaura: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_laser: 0.5, is_power_attacked: 0, usp_step: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'maxUltimateEnergy' },
            stage: 'armedNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 1 },
            base: { kind: 'constant', value: 0 },
            targetKey: 'usp_step',
          }),
          step('calculateActionValue', {
            key: 'usp_step',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'usp_step' },
            right: { kind: 'constant', value: 2 },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'actionInputTargetIdentityMatch',
                other: 'controlledOperator',
                operator: 'equal',
              },
              sequence(
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'ownerSpawnedAbilityEntityPresent',
                        abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
                      },
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'constant', value: 0 },
                        operator: 'lessOrEqual',
                        right: { kind: 'constant', value: 60 },
                      },
                    ],
                  },
                  sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAny',
                        tags: ['normalAttackLastCombo'],
                      },
                      sequence(
                        step('spawnAbilityEntity', {
                          abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_death',
                          inheritActionBlackboard: true,
                          inheritSourceSkillCastInfo: true,
                          dieWhenSourceDies: false,
                          overrideDurationSeconds: { kind: 'constant', value: 0.200000002980232 },
                          saveToContextKey: 'ult_death',
                        }),
                        forEachContextTarget(
                          'ult_death',
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_target_mark',
                              target: 'currentAbilityEntity',
                              source: 'buffSource',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_scale_laser: { kind: 'blackboard', key: 'atk_scale_laser' },
                                usp_step: { kind: 'blackboard', key: 'usp_step' },
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
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'actionInputTargetIdentityMatch',
                other: 'controlledOperator',
                operator: 'equal',
              },
              sequence(
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'ownerSpawnedAbilityEntityPresent',
                        abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
                      },
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'constant', value: 0 },
                        operator: 'lessOrEqual',
                        right: { kind: 'constant', value: 60 },
                      },
                    ],
                  },
                  sequence(
                    branch(
                      { kind: 'eventDamageTagsMatch', match: 'hasAny', tags: ['powerAttack'] },
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'is_power_attacked' },
                            operator: 'equal',
                            right: { kind: 'constant', value: 0 },
                          },
                          sequence(
                            branch(
                              {
                                kind: 'not',
                                condition: {
                                  kind: 'timedMarkerPresent',
                                  target: 'buffSource',
                                  markerId: 'chr_0032_lizhiyan_ultimate_count',
                                },
                              },
                              sequence(
                                step('createTimedMarker', {
                                  target: 'buffSource',
                                  markerId: 'chr_0032_lizhiyan_ultimate_count',
                                  durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                                  autoFinishByAction: false,
                                }),
                                step('modifyActionValue', {
                                  key: 'is_power_attacked',
                                  operation: 'assign',
                                  value: { kind: 'constant', value: 1 },
                                }),
                                step('findOwnerSpawnedAbilityEntities', {
                                  saveToContextKey: 'ult_aura',
                                  abilityEntityIds: [
                                    'abilityentity_chr_0032_lizhiyan_ultimate_skill',
                                  ],
                                }),
                                branch(
                                  {
                                    kind: 'buffIdStackCompare',
                                    target: 'buffSource',
                                    buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                                    operator: 'lessOrEqual',
                                    value: { kind: 'constant', value: 0 },
                                  },
                                  sequence(
                                    step('spawnAbilityEntity', {
                                      abilityEntityId:
                                        'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
                                      inheritActionBlackboard: true,
                                      inheritSourceSkillCastInfo: true,
                                      dieWhenSourceDies: false,
                                      saveToContextKey: 'laser_target1',
                                    }),
                                    forEachContextTarget(
                                      'laser_target1',
                                      sequence(
                                        step('applyBuff', {
                                          buffId:
                                            'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1',
                                          target: 'currentAbilityEntity',
                                          source: 'buffSource',
                                          inheritSourceSkillCastInfo: true,
                                          blackboardAssignments: {
                                            atk_scale_laser: {
                                              kind: 'blackboard',
                                              key: 'atk_scale_laser',
                                            },
                                          },
                                        }),
                                      ),
                                    ),
                                    step('changeResourceByActionValue', {
                                      resource: 'ultimateEnergy',
                                      amount: { kind: 'blackboard', key: 'usp_step' },
                                      coefficient: { kind: 'constant', value: 1 },
                                      recipient: 'caster',
                                      ultimateRecoveryTag:
                                        'Skill/Character/chr_0032_lizhiyan/special_usp',
                                      ignoreUltimateEnergyGainMultiplier: true,
                                    }),
                                  ),
                                  sequence(
                                    branch(
                                      {
                                        kind: 'buffIdStackCompare',
                                        target: 'buffSource',
                                        buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                                        operator: 'lessOrEqual',
                                        value: { kind: 'constant', value: 1 },
                                      },
                                      sequence(
                                        step('spawnAbilityEntity', {
                                          abilityEntityId:
                                            'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
                                          inheritActionBlackboard: true,
                                          inheritSourceSkillCastInfo: true,
                                          dieWhenSourceDies: false,
                                          saveToContextKey: 'laser_target2',
                                        }),
                                        forEachContextTarget(
                                          'laser_target2',
                                          sequence(
                                            step('applyBuff', {
                                              buffId:
                                                'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2',
                                              target: 'currentAbilityEntity',
                                              source: 'buffSource',
                                              inheritSourceSkillCastInfo: true,
                                              blackboardAssignments: {
                                                atk_scale_laser: {
                                                  kind: 'blackboard',
                                                  key: 'atk_scale_laser',
                                                },
                                              },
                                            }),
                                          ),
                                        ),
                                        step('changeResourceByActionValue', {
                                          resource: 'ultimateEnergy',
                                          amount: { kind: 'blackboard', key: 'usp_step' },
                                          coefficient: { kind: 'constant', value: 1 },
                                          recipient: 'caster',
                                          ultimateRecoveryTag:
                                            'Skill/Character/chr_0032_lizhiyan/special_usp',
                                          ignoreUltimateEnergyGainMultiplier: true,
                                        }),
                                      ),
                                      undefined,
                                      { alwaysNext: true },
                                    ),
                                  ),
                                  { alwaysNext: true },
                                ),
                                step('applyBuff', {
                                  buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_layer',
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
            ),
          ),
        },
        {
          event: 'poiseZero',
          priority: 0,
          sequence: sequence(
            step('modifyActionValue', {
              key: 'is_power_attacked',
              operation: 'assign',
              value: { kind: 'constant', value: 0 },
            }),
          ),
        },
      ],
    },
    buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_laser: 10, trigger_time: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('findOwnerSpawnedAbilityEntities', {
              saveToContextKey: 'placesorted',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
              circularOrder: {
                indexBlackboardKey: 'EntityBB_index',
                desiredCount: 8,
                reverseFlag: 1,
              },
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('mergeContextTargets', { saveToContextKey: 'first', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'second', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'third', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'forth', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'fifth', sources: [] }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'first',
              index: { kind: 'constant', value: 0 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'second',
              index: { kind: 'constant', value: 1 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'third',
              index: { kind: 'constant', value: 2 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'forth',
              index: { kind: 'constant', value: 3 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'fifth',
              index: { kind: 'constant', value: 4 },
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'first',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          3,
        ),
        scheduled(
          4,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'second',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          7,
        ),
        scheduled(
          8,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'third',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          11,
        ),
        scheduled(
          12,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'forth',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          15,
        ),
      ],
      lifecycleSequences: {
        start: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_laser: 10, trigger_time: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('findOwnerSpawnedAbilityEntities', {
              saveToContextKey: 'placesorted',
              abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
              circularOrder: {
                indexBlackboardKey: 'EntityBB_index',
                desiredCount: 8,
                reverseFlag: -1,
              },
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            step('mergeContextTargets', { saveToContextKey: 'first', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'second', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'third', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'forth', sources: [] }),
            step('mergeContextTargets', { saveToContextKey: 'fifth', sources: [] }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'first',
              index: { kind: 'constant', value: 0 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'second',
              index: { kind: 'constant', value: 1 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'third',
              index: { kind: 'constant', value: 2 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'forth',
              index: { kind: 'constant', value: 3 },
            }),
            step('pickContextTarget', {
              sourceContextKey: 'placesorted',
              saveToContextKey: 'fifth',
              index: { kind: 'constant', value: 4 },
            }),
          ),
          3,
        ),
        scheduled(
          0,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'first',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          3,
        ),
        scheduled(
          4,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'second',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          7,
        ),
        scheduled(
          8,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'third',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          11,
        ),
        scheduled(
          12,
          sequence(
            branch(
              {
                kind: 'contextTargetCountCompare',
                contextKey: 'forth',
                operator: 'greater',
                value: 0,
              },
              sequence(
                step('spawnAbilityEntity', {
                  abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser',
                  childSkillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
                  inheritActionBlackboard: true,
                  inheritSourceSkillCastInfo: true,
                  dieWhenSourceDies: false,
                  target: 'currentAbilityEntity',
                }),
              ),
            ),
          ),
          15,
        ),
      ],
      lifecycleSequences: {
        start: sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_layer: {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: 3,
      applyTags: [],
      extendTags: [],
      blackboard: { count: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('setCharacterPassiveUiValue', {
            target: 'caster',
            value: { kind: 'constant', value: 1 },
          }),
        ),
        enhanceChanged: sequence(
          step('readBuffStackCount', {
            target: 'caster',
            outputKey: 'count',
            query: { kind: 'environment' },
          }),
          step('setCharacterPassiveUiValue', {
            target: 'caster',
            value: { kind: 'blackboard', key: 'count' },
          }),
        ),
      },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_listener: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_ult_laser',
        iconPath: '/icons/icon_battle_buff_ult_laser.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        blinkInMainCharHpBar: false,
        showProgressInHpBar: false,
        showProgressInNormalSkillButton: false,
        useWeakProgressInNormalSkillButton: false,
        showProgressInUltimateSkillButton: true,
        forceRaiseIconEvent: false,
        showWarningBackground: false,
        playStrongInAnimation: false,
        hasCharHpBarVfxType: false,
        charHpBarVfxType: 'Fire',
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 10, enhance_rate: 0, lv: 0 },
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
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
                reason: 'other',
              }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'constant', value: 1 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
                isPercentValue: true,
                ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
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
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0032_lizhiyan_talent1'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'enhance_rate',
                        outputKey: 'enhance_rate',
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'enhance_rate' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                            target: 'buffSource',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            asChildBuff: true,
                            blackboardAssignments: {
                              enhance_rate: { kind: 'blackboard', key: 'enhance_rate' },
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
              step('setCharacterPassiveUiValue', {
                target: 'caster',
                value: { kind: 'constant', value: 2 },
              }),
            ),
          },
        ),
        enable: sequence(
          step('restrictUltimateEnergyRecovery', {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: true,
          }),
        ),
        finish: sequence(
          step('setCharacterPassiveUiValue', {
            target: 'caster',
            value: { kind: 'constant', value: 0 },
          }),
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'constant', value: -999 },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'ultimate',
          targetSkillKey: 'arcana',
          revertedSkillKey: 'ultimate',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
    },
    buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          }),
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey:
              '__finishOwner:BuffData.buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity.buffEventAction[0].actions[0].actionData[1]',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill_place'],
          }),
          forEachContextTarget(
            '__finishOwner:BuffData.buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity.buffEventAction[0].actions[0].actionData[1]',
            sequence(step('finishCurrentAbilityEntity', {})),
          ),
        ),
      },
    },
    buff_chr_0032_lizhiyan_ultimate_skill_listener_owner: {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_ult_skill',
        iconPath: '/icons/icon_battle_buff_ult_skill.webp',
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
        orderPriority: { useDirectoryValue: false, value: 0, category: 'AttentionDebuff' },
      },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 30, enhance_rate: 0, isWisd: 0, lv: 0 },
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
                value: { kind: 'constant', value: 3 },
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
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'isWisd' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0032_lizhiyan_talent1'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0032_lizhiyan_talent1'] },
                        desiredKey: 'enhance_rate',
                        outputKey: 'enhance_rate',
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'enhance_rate' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0032_lizhiyan_talent1_enhance',
                            target: 'buffSource',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            asChildBuff: true,
                            blackboardAssignments: {
                              enhance_rate: { kind: 'blackboard', key: 'enhance_rate' },
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
        ),
        enable: sequence(
          step('restrictUltimateEnergyRecovery', {
            target: 'caster',
            allowedRecoveryTags: ['Skill/Character/chr_0032_lizhiyan/special_usp'],
            clearUltimateEnergyOnEnd: true,
          }),
        ),
        finish: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
            },
            sequence(),
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'constant', value: -999 },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
              }),
              step('setCharacterPassiveUiValue', {
                target: 'caster',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            { alwaysNext: true },
          ),
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ult_aura',
            abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
            sameSourceSkillCast: true,
          }),
          forEachContextTarget(
            'ult_aura',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self',
                target: 'currentAbilityEntity',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'buffIdStackCompare',
                target: 'buffOwner',
                buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                operator: 'greaterOrEqual',
                value: { kind: 'constant', value: 2 },
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener',
                  target: 'buffSource',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                }),
              ),
              undefined,
              { alwaysNext: true },
            ),
          ),
        },
      ],
      skillSlotReplacements: [
        {
          skillGroupKey: 'ultimate',
          targetSkillKey: 'arcana',
          revertedSkillKey: 'ultimate',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
    },
    buff_chr_0032_lizhiyan_ultimate_skill_target_mark: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.100000001490116,
      triggerIntervalSeconds: 0.0329999998211861,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_laser: 0, usp_step: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'chr_0032_lizhiyan_ultimate_count',
                  },
                },
                sequence(
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'chr_0032_lizhiyan_ultimate_count',
                    durationSeconds: { kind: 'constant', value: 0.400000005960464 },
                    autoFinishByAction: false,
                  }),
                  step('findOwnerSpawnedAbilityEntities', {
                    saveToContextKey: 'ult_aura',
                    abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_ultimate_skill'],
                  }),
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                      operator: 'lessOrEqual',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId:
                          'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
                        inheritActionBlackboard: true,
                        inheritSourceSkillCastInfo: true,
                        dieWhenSourceDies: false,
                        saveToContextKey: 'laser_target1',
                      }),
                      forEachContextTarget(
                        'laser_target1',
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser1',
                            target: 'currentAbilityEntity',
                            source: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              atk_scale_laser: { kind: 'blackboard', key: 'atk_scale_laser' },
                            },
                          }),
                        ),
                      ),
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp_step' },
                        coefficient: { kind: 'constant', value: 1 },
                        recipient: 'caster',
                        ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
                        ignoreUltimateEnergyGainMultiplier: true,
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                          operator: 'lessOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('spawnAbilityEntity', {
                            abilityEntityId:
                              'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target',
                            inheritActionBlackboard: true,
                            inheritSourceSkillCastInfo: true,
                            dieWhenSourceDies: false,
                            saveToContextKey: 'laser_target2',
                          }),
                          forEachContextTarget(
                            'laser_target2',
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura_laser2',
                                target: 'currentAbilityEntity',
                                source: 'buffSource',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  atk_scale_laser: { kind: 'blackboard', key: 'atk_scale_laser' },
                                },
                              }),
                            ),
                          ),
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_step' },
                            coefficient: { kind: 'constant', value: 1 },
                            recipient: 'caster',
                            ultimateRecoveryTag: 'Skill/Character/chr_0032_lizhiyan/special_usp',
                            ignoreUltimateEnergyGainMultiplier: true,
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                    { alwaysNext: true },
                  ),
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_layer',
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
    },
    buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0032_lizhiyan_combo_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/combo_bunshin',
      ],
      lifetime: { kind: 'limited', durationSeconds: 50 },
      childSkills: {
        chr_032_lizhiyan_combo_skill_abilityentity_seal: {
          skillId: 'chr_032_lizhiyan_combo_skill_abilityentity_seal',
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
          scheduledSequences: [],
        },
        chr_0032_lizhiyan_combo_skill_abilityentity_end: {
          skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_end',
          blackboard: {
            atb_final: 50,
            atb_return_wisd: 0,
            atk_scale_boom: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_boom: 5,
            radius: 5,
          },
          scheduledSequences: [
            scheduled(
              9,
              sequence(
                step('finishBuffsById', {
                  target: 'currentAbilityEntity',
                  buffIds: [
                    'buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect',
                    'buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line',
                  ],
                  reason: 'other',
                }),
              ),
              12,
            ),
            scheduled(
              21,
              sequence(
                step('triggerCustomAbilityEvent', {
                  eventName: 'lizhiyan_combo_normal_end',
                  eventParam: 0,
                  target: 'caster',
                  source: 'currentAbilityEntity',
                }),
              ),
              22,
            ),
            scheduled(44, sequence(step('finishActionOwnerAbilityEntity', {})), 45),
            scheduled(
              0,
              sequence(
                repeatEachTick(sequence(), {
                  nativeChanneling: {
                    executeEachFrame: true,
                    triggerIntervalSeconds: 0.0329999998211861,
                    maxCountPerTarget: -1,
                    targetTriggerIntervalSeconds: 0.0329999998211861,
                  },
                }),
              ),
              15,
            ),
            scheduled(
              0,
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'lizhiyan_combo_end_not_finish',
                    },
                  },
                  sequence(
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                        operator: 'greaterOrEqual',
                        right: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener',
                          target: 'enemy',
                          inheritSourceSkillCastInfo: true,
                          finishByAction: true,
                          blackboardAssignments: {
                            atk_scale_early_finish: { kind: 'blackboard', key: 'atk_scale_boom' },
                            poise_early_finish: { kind: 'blackboard', key: 'poise_boom' },
                            atb_return_wisd: { kind: 'blackboard', key: 'atb_return_wisd' },
                          },
                        }),
                        step('createTimedMarker', {
                          target: 'caster',
                          markerId: 'lizhiyan_combo_end_not_finish',
                          durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                          autoFinishByAction: false,
                        }),
                      ),
                    ),
                  ),
                ),
              ),
              14,
            ),
            scheduled(
              14,
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'lizhiyan_combo_hit',
                    },
                  },
                  sequence(
                    step(
                      'dealDamage',
                      {
                        damageType: 'nature',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
                        tags: ['comboSkill'],
                        features: ['canBreakWeakness'],
                        stagger: { kind: 'blackboard', key: 'poise_boom' },
                      },
                      'abilityentity_chr_0032_lizhiyan_combo_skill:chr_032_lizhiyan_combo_skill_abilityentity_seal|chr_0032_lizhiyan_combo_skill_abilityentity_end|chr_0032_lizhiyan_combo_skill_abilityentity_seal_again:/childSkills/chr_0032_lizhiyan_combo_skill_abilityentity_end/scheduledSequences/5/sequence/steps/0/whenTrue/steps/0',
                    ),
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'lizhiyan_combo_hit',
                      durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                      autoFinishByAction: false,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
                step('startTimeDilation', {
                  scope: 'entity',
                  durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                  slot: 'TimeDilation/Layer/Entity/HitStop',
                  priority: 15,
                  curve: {
                    kind: 'inline',
                    keys: [
                      {
                        time: 0,
                        value: 1,
                        inTangent: -14.1428604125977,
                        outTangent: -14.1428604125977,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.0700000002980232,
                        value: 0.00999999977648258,
                        inTangent: 0.0315926484763622,
                        outTangent: 0.0315926484763622,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 0.938540279865265,
                        value: 0.165502101182938,
                        inTangent: 0.525525808334351,
                        outTangent: 0.525525808334351,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                      {
                        time: 1,
                        value: 0.300000011920929,
                        inTangent: 3.24978399276733,
                        outTangent: 3.24978399276733,
                        weightedMode: 0,
                        inWeight: 0,
                        outWeight: 0,
                      },
                    ],
                  },
                  finishByAction: false,
                  targets: ['enemy'],
                  abilityEntityTargets: [{ kind: 'current' }],
                }),
              ),
              20,
            ),
            scheduled(
              0,
              sequence(
                step('createAbilityEntityTimedMarker', {
                  markerId: 'lizhiyan_bunshin_end',
                  durationSeconds: { kind: 'constant', value: 1 },
                  autoFinishByAction: false,
                  timeDomain: 'self',
                }),
              ),
              3,
            ),
            scheduled(
              14,
              sequence(
                forEachTarget(
                  'enemy',
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'enemy',
                        buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                        operator: 'greaterOrEqual',
                        value: { kind: 'constant', value: 1 },
                      },
                      sequence(
                        step('finishBuffsById', {
                          target: 'enemy',
                          buffIds: ['buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable'],
                          reason: 'other',
                        }),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                ),
              ),
              17,
            ),
          ],
        },
        chr_0032_lizhiyan_combo_skill_abilityentity_seal_again: {
          skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_again',
          blackboard: {
            atb_final: 50,
            atb_return_wisd: 10,
            atk_scale_calc: 0,
            atk_scale_laser1: 6,
            atk_scale_laser2: 2,
            atk_scale_wisd_ratio: 0,
            cd_reduce: 3,
            duration_calc: 0,
            duration_extra: 0,
            duration_vul: 2,
            isWisd: 1,
            minAngle: 0,
            number: 0,
            owner_mainchar_alpha: 0,
            owner_mainchar_distance: 0,
            poise_laser: 5,
            radius: 5,
            radius_early_finish: 5.67,
            rate_final: 0.3,
          },
          scheduledSequences: [
            scheduled(
              0,
              sequence(
                step('finishBuffsById', {
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line'],
                  reason: 'other',
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
                    left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                  sequence(
                    step('modifyActionValue', {
                      key: 'isWisd',
                      operation: 'assign',
                      value: { kind: 'constant', value: 1 },
                    }),
                    step('calculateActionValue', {
                      key: 'duration_calc',
                      operation: 'add',
                      left: { kind: 'blackboard', key: 'duration_vul' },
                      right: { kind: 'constant', value: 0 },
                    }),
                  ),
                  sequence(
                    step('modifyActionValue', {
                      key: 'isWisd',
                      operation: 'assign',
                      value: { kind: 'constant', value: 0 },
                    }),
                    step('calculateActionValue', {
                      key: 'duration_calc',
                      operation: 'add',
                      left: { kind: 'blackboard', key: 'duration_vul' },
                      right: { kind: 'blackboard', key: 'duration_extra' },
                    }),
                  ),
                  { alwaysNext: true },
                ),
              ),
              3,
            ),
            scheduled(
              41,
              sequence(
                branch(
                  {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'isWisd' },
                    operator: 'greaterOrEqual',
                    right: { kind: 'constant', value: 1 },
                  },
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_finish_count'],
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                        sameSourceSkillCast: true,
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finish_count',
                          target: 'caster',
                          source: 'currentAbilityEntity',
                          inheritSourceSkillCastInfo: true,
                        }),
                        step('spawnAbilityEntity', {
                          abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill_death',
                          childSkillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_death_move',
                          inheritActionBlackboard: true,
                          inheritSourceSkillCastInfo: true,
                          dieWhenSourceDies: false,
                          target: 'enemy',
                          saveToContextKey: 'death',
                        }),
                        forEachContextTarget(
                          'death',
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd',
                              target: 'currentAbilityEntity',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                atk_scale_laser1: { kind: 'blackboard', key: 'atk_scale_laser1' },
                                atk_scale_laser2: { kind: 'blackboard', key: 'atk_scale_laser2' },
                                poise_final: { kind: 'blackboard', key: 'poise_laser' },
                                isWisd: { kind: 'blackboard', key: 'isWisd' },
                                cd_reduce: { kind: 'blackboard', key: 'cd_reduce' },
                                atb_return_wisd: { kind: 'blackboard', key: 'atb_return_wisd' },
                              },
                            }),
                          ),
                        ),
                        step('jumpTimeline', { destinationFrame: 239 }),
                      ),
                      sequence(step('jumpTimeline', { destinationFrame: 240 })),
                      { alwaysNext: true },
                    ),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              44,
            ),
            scheduled(
              23,
              sequence(
                step('finishBuffsById', {
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect'],
                  reason: 'other',
                }),
              ),
              26,
            ),
            scheduled(
              239,
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'lizhiyan_combo_finisher',
                    },
                  },
                  sequence(
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'isWisd' },
                        operator: 'greaterOrEqual',
                        right: { kind: 'constant', value: 1 },
                      },
                      sequence(),
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finisher',
                          target: 'enemy',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            atk_scale_laser2: { kind: 'blackboard', key: 'atk_scale_laser2' },
                            poise_final: { kind: 'blackboard', key: 'poise_laser' },
                            isWisd: { kind: 'blackboard', key: 'isWisd' },
                          },
                        }),
                        step('createTimedMarker', {
                          target: 'caster',
                          markerId: 'lizhiyan_combo_finisher',
                          durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                          autoFinishByAction: false,
                        }),
                      ),
                      { alwaysNext: true },
                    ),
                  ),
                ),
              ),
              239,
            ),
            scheduled(240, sequence(step('finishActionOwnerAbilityEntity', {})), 243),
            scheduled(
              0,
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'caster',
                      markerId: 'lizhiyan_combo_vul',
                    },
                  },
                  sequence(
                    step('createTimedMarker', {
                      target: 'caster',
                      markerId: 'lizhiyan_combo_vul',
                      durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                      autoFinishByAction: false,
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable',
                      target: 'enemy',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        rate: { kind: 'blackboard', key: 'rate_final' },
                        duration_vul: { kind: 'blackboard', key: 'duration_calc' },
                        atk_scale_calc: { kind: 'blackboard', key: 'atk_scale_calc' },
                        poise_final: { kind: 'blackboard', key: 'poise_laser' },
                        isWisd: { kind: 'blackboard', key: 'isWisd' },
                        atk_scale_laser1: { kind: 'blackboard', key: 'atk_scale_laser1' },
                        atk_scale_laser2: { kind: 'blackboard', key: 'atk_scale_laser2' },
                      },
                    }),
                  ),
                ),
              ),
              240,
            ),
          ],
        },
      },
    },
    abilityentity_chr_0032_lizhiyan_normal_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_normal_skill_abilityrange2',
        blackboard: {
          atb_return_dynamic: 20,
          atk_scale: 0,
          atk_scale_final: 0,
          atk_scale_will: 1,
          atk_scale_wisd: 1,
          atk_scale_wisd_ratio: 1.5,
          duration: 6,
          effect_count: 0,
          has_returned: 0,
          isJumped: 0,
          max_effect_count: 3,
          poise: 0,
          radius: 5,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('modifyActionValue', {
                key: 'radius',
                operation: 'add',
                value: { kind: 'constant', value: 0.670000016689301 },
              }),
            ),
            3,
          ),
          scheduled(
            20,
            sequence(
              forEachTarget('enemy', sequence()),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_wisd' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2:/childSkill/scheduledSequences/1/sequence/steps/2/whenTrue/steps/0',
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'nature',
                      attackScale: { kind: 'blackboard', key: 'atk_scale_will' },
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                    'abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange2:/childSkill/scheduledSequences/1/sequence/steps/2/whenFalse/steps/0',
                  ),
                ),
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
                      time: 0,
                      value: 1,
                      inTangent: -14.1428604125977,
                      outTangent: -14.1428604125977,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.0700000002980232,
                      value: 0.00999999977648258,
                      inTangent: 0,
                      outTangent: 0,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.100000001490116,
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
                abilityEntityTargets: [{ kind: 'current' }],
              }),
            ),
            22,
          ),
          scheduled(
            20,
            sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })),
            23,
          ),
          scheduled(22, sequence(step('finishActionOwnerAbilityEntity', {})), 25),
        ],
      },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_aura',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_ultimate_skill_abilityrange',
        blackboard: {
          atk_scale_laser: 0.5,
          atk_scale_laser_will: 0.2,
          duration: 0,
          isWisd: 0,
          radius: 5,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
                asChildBuff: true,
              }),
            ),
            1800,
          ),
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'isWisd' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura',
                    target: 'enemy',
                    finishByAction: true,
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      atk_scale_laser: { kind: 'blackboard', key: 'atk_scale_laser' },
                    },
                  }),
                ),
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura',
                    target: 'enemy',
                    finishByAction: true,
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      atk_scale_laser: { kind: 'blackboard', key: 'atk_scale_laser_will' },
                    },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            1800,
          ),
        ],
      },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_place: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_place',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_death: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_laser_target: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
    abilityentity_chr_0032_lizhiyan_ultimate_skill_laser: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Skill/Character/chr_0032_lizhiyan/ultimate_tower',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_ultimate_skill_laser',
        blackboard: { atk_scale_laser: 1, duration: 0, radius: 5.67 },
        scheduledSequences: [
          scheduled(
            12,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_laser' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                },
                'abilityentity_chr_0032_lizhiyan_ultimate_skill_laser:chr_0032_lizhiyan_ultimate_skill_laser:/childSkill/scheduledSequences/0/sequence/steps/0',
              ),
            ),
            28,
          ),
          scheduled(
            13,
            sequence(
              branch(
                {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'lizhiyan_ult_laser_hit1',
                  },
                },
                sequence(
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'lizhiyan_ult_laser_hit1',
                    durationSeconds: { kind: 'constant', value: 0.800000011920929 },
                    autoFinishByAction: false,
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'not',
                      condition: {
                        kind: 'timedMarkerPresent',
                        target: 'caster',
                        markerId: 'lizhiyan_ult_laser_hit2',
                      },
                    },
                    sequence(
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'lizhiyan_ult_laser_hit2',
                        durationSeconds: { kind: 'constant', value: 0.800000011920929 },
                        autoFinishByAction: false,
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'not',
                          condition: {
                            kind: 'timedMarkerPresent',
                            target: 'caster',
                            markerId: 'lizhiyan_ult_laser_hit3',
                          },
                        },
                        sequence(
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'lizhiyan_ult_laser_hit3',
                            durationSeconds: { kind: 'constant', value: 0.800000011920929 },
                            autoFinishByAction: false,
                          }),
                        ),
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
            45,
          ),
        ],
      },
    },
    abilityentity_chr_0032_lizhiyan_combo_skill_death: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
      childSkill: {
        skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_death_move',
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
        scheduledSequences: [],
      },
    },
    abilityentity_chr_0032_lizhiyan_combo_skill_place: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
      ],
      lifetime: { kind: 'limited', durationSeconds: 6 },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
