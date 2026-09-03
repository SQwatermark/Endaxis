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
  withSkillBlackboard,
} from '../../definitionHelpers';

export const lifengBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0015_lifeng_attack1',
    timelineBlockFrames: 24,
    naturalDurationFrames: 187,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0015_lifeng_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 24, endFrame: 32, sourceSkillIds: ['chr_0015_lifeng_attack2'] },
      ],
    },
    costFrame: 9,
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
            },
            'chr_0015_lifeng_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0670000016689301 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1,
                      inTangent: -1.77888894081116,
                      outTangent: -1.77888894081116,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.505933821201324,
                      value: 0.100000001490116,
                      inTangent: 0.0213645696640015,
                      outTangent: 0.0213645696640015,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 1.82161796092987,
                      outTangent: 1.82161796092987,
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
        10,
      ),
      scheduled(
        17,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0015_lifeng_attack1:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0670000016689301 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1,
                      inTangent: -1.77888894081116,
                      outTangent: -1.77888894081116,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.505933821201324,
                      value: 0.100000001490116,
                      inTangent: 0.0213645696640015,
                      outTangent: 0.0213645696640015,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 1.82161796092987,
                      outTangent: 1.82161796092987,
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
        18,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.119999997317791, 0.129999995231628, 0.150000005960464, 0.159999996423721, 0.170000001788139,
      0.180000007152557, 0.189999997615814, 0.209999993443489, 0.219999998807907, 0.230000004172325,
      0.25, 0.270000010728836,
    ],
    display_atk_scale: [
      0.239999994635582, 0.270000010728836, 0.28999999165535, 0.319999992847443, 0.340000003576279,
      0.360000014305115, 0.389999985694885, 0.409999996423721, 0.439999997615814, 0.469999998807907,
      0.5, 0.550000011920929,
    ],
  },
);

export const lifengBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0015_lifeng_attack2',
    timelineBlockFrames: 18,
    naturalDurationFrames: 131,
    exclusiveFrame: 18,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 24,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0015_lifeng_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 18, endFrame: 24, sourceSkillIds: ['chr_0015_lifeng_attack3'] },
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
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0015_lifeng_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1,
                      inTangent: -1.77888894081116,
                      outTangent: -1.77888894081116,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.505933821201324,
                      value: 0.100000001490116,
                      inTangent: 0.0213645696640015,
                      outTangent: 0.0213645696640015,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 1.82161796092987,
                      outTangent: 1.82161796092987,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
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
        5,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.28999999165535, 0.319999992847443, 0.349999994039536, 0.379999995231628, 0.409999996423721,
      0.439999997615814, 0.469999998807907, 0.490000009536743, 0.519999980926514, 0.560000002384186,
      0.600000023841858, 0.649999976158142,
    ],
  },
);

export const lifengBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0015_lifeng_attack3',
    timelineBlockFrames: 14,
    naturalDurationFrames: 115,
    exclusiveFrame: 14,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0015_lifeng_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 30, sourceSkillIds: ['chr_0015_lifeng_attack5'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0015_lifeng_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.166999995708466 },
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
      0.349999994039536, 0.389999985694885, 0.419999986886978, 0.46000000834465, 0.490000009536743,
      0.529999971389771, 0.560000002384186, 0.600000023841858, 0.629999995231628, 0.670000016689301,
      0.730000019073486, 0.790000021457672,
    ],
    display_atk_scale: [
      0.340000003576279, 0.370000004768372, 0.400000005960464, 0.439999997615814, 0.469999998807907,
      0.5, 0.540000021457672, 0.569999992847443, 0.600000023841858, 0.639999985694885,
      0.699999988079071, 0.75,
    ],
  },
);

export const lifengBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0015_lifeng_attack5',
    timelineBlockFrames: 35,
    naturalDurationFrames: 192,
    exclusiveFrame: 35,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 46,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0015_lifeng_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 35, endFrame: 46, sourceSkillIds: ['chr_0015_lifeng_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
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
            'chr_0015_lifeng_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        14,
      ),
      scheduled(
        24,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                  staggerOnlyWhenCasterControlled: true,
                },
                'chr_0015_lifeng_attack5:/scheduledSequences/1/sequence/steps/0/body/steps/0',
              ),
            ),
          ),
          step(
            'dealDamage',
            { damageType: 'physical', attackScale: { kind: 'constant', value: 0 }, tags: [] },
            'chr_0015_lifeng_attack5:/scheduledSequences/1/sequence/steps/1',
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
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: {
                  kind: 'inline',
                  keys: [
                    {
                      time: 0,
                      value: 1,
                      inTangent: -10.3494100570679,
                      outTangent: -10.3494100570679,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.0607942491769791,
                      value: 0.370815485715866,
                      inTangent: -1.72720694541931,
                      outTangent: -1.72720694541931,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.505933821201324,
                      value: 0.100000001490116,
                      inTangent: -0.165814101696014,
                      outTangent: -0.165814101696014,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 1,
                      inTangent: 1.82161796092987,
                      outTangent: 1.82161796092987,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                  ],
                },
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
        24,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 21,
    atk_scale: [
      0.180000007152557, 0.189999997615814, 0.209999993443489, 0.230000004172325, 0.25,
      0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443, 0.340000003576279,
      0.360000014305115, 0.389999985694885,
    ],
    atk_scale2: [
      0.5, 0.550000011920929, 0.600000023841858, 0.649999976158142, 0.699999988079071, 0.75,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.959999978542328, 1.03999996185303,
      1.12999999523163,
    ],
    poise: 19,
    display_atk_scale: [
      0.680000007152557, 0.740000009536743, 0.810000002384186, 0.879999995231628, 0.949999988079071,
      1.00999999046326, 1.08000004291534, 1.14999997615814, 1.22000002861023, 1.29999995231628,
      1.39999997615814, 1.51999998092651,
    ],
  },
);

export const lifengFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0015_lifeng_power_attack',
    timelineBlockFrames: 33,
    naturalDurationFrames: 194,
    exclusiveFrame: 68,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 33,
          endFrame: 68,
          sourceSkillIds: ['chr_0015_lifeng_normal_skill', 'chr_0015_lifeng_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        6,
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
            'chr_0015_lifeng_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        6,
      ),
      scheduled(
        33,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.899999976158142,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0015_lifeng_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        33,
      ),
      scheduled(
        34,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.266699999570847 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: {
              kind: 'inline',
              keys: [
                {
                  time: 0,
                  value: 1,
                  inTangent: -4.72513723373413,
                  outTangent: -4.72513723373413,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.193845793604851,
                  value: 0.0840520933270454,
                  inTangent: -0.112137898802757,
                  outTangent: -0.112137898802757,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 0.775428473949432,
                  value: 0.0639253333210945,
                  inTangent: 0.0627976730465889,
                  outTangent: 0.0627976730465889,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 1,
                  inTangent: 4.1682710647583,
                  outTangent: 4.1682710647583,
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
        34,
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
        33,
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
        68,
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

export const lifengPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0015_lifeng_plunging_attack_end',
    timelineBlockFrames: 26,
    naturalDurationFrames: 181,
    exclusiveFrame: 25,
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
            'chr_0015_lifeng_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const lifengBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0015_lifeng_normal_skill',
    timelineBlockFrames: 67,
    naturalDurationFrames: 216,
    exclusiveFrame: 70,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 67, endFrame: 89, sourceSkillIds: ['chr_0015_lifeng_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        54,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/NoGuard'],
                  operator: 'lessOrEqual',
                  value: { kind: 'blackboard', key: 'num' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0015_lifeng_purify',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      rate: { kind: 'blackboard', key: 'phy_resist_down' },
                      duration: { kind: 'blackboard', key: 'duration' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        56,
      ),
      scheduled(
        7,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0015_lifeng_normal_skill:/scheduledSequences/1/sequence/steps/0',
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
        9,
      ),
      scheduled(
        20,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0015_lifeng_normal_skill:/scheduledSequences/2/sequence/steps/0',
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
        22,
      ),
      scheduled(
        54,
        sequence(
          step('applyKnockDown', {
            target: 'enemy',
            duration: { kind: 'constant', value: 1.5 },
            force: false,
            isExtra: false,
            targetFilter: 'aliveOnly',
            returnWhen: 'always',
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
            'chr_0015_lifeng_normal_skill:/scheduledSequences/3/sequence/steps/1',
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        56,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      0.379999995231628, 0.419999986886978, 0.46000000834465, 0.5, 0.529999971389771,
      0.569999992847443, 0.610000014305115, 0.649999976158142, 0.689999997615814, 0.730000019073486,
      0.790000021457672, 0.860000014305115,
    ],
    atk_scale2: [
      1.19000005722046, 1.30999994277954, 1.42999994754791, 1.54999995231628, 1.66999995708466,
      1.77999997138977, 1.89999997615814, 2.01999998092651, 2.14000010490417, 2.28999996185303,
      2.47000002861023, 2.6800000667572,
    ],
    cam_angle: 0,
    cam_duration: 0,
    duration: 12,
    input_angle: 0,
    num: 0,
    phy_resist_down: [
      0.0500000007450581, 0.0500000007450581, 0.0500000007450581, 0.0500000007450581,
      0.0500000007450581, 0.0700000002980232, 0.0700000002980232, 0.0700000002980232,
      0.0900000035762787, 0.100000001490116, 0.100000001490116, 0.119999997317791,
    ],
    poise: 10,
  },
);

export const lifengUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0015_lifeng_ultimate_skill',
    timelineBlockFrames: 66,
    naturalDurationFrames: 190,
    exclusiveFrame: 75,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 66,
          endFrame: 80,
          sourceSkillIds: ['chr_0015_lifeng_normal_skill', 'chr_0015_lifeng_combo_skill'],
        },
      ],
    },
    costFrame: 9,
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        56,
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
        75,
      ),
      scheduled(
        58,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0015_lifeng_ultimate_skill',
            childSkillId: 'chr_0015_lifeng_ultimate_skill_abentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        59,
      ),
    ],
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale1: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    atk_scale2: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    isCombo: 0,
    poise1: 0,
    poise2: 5,
    atk_scale3: [
      2.67000007629395, 2.94000005722046, 3.20000004768372, 3.47000002861023, 3.74000000953674, 4,
      4.26999998092651, 4.53999996185303, 4.80000019073486, 5.1399998664856, 5.53999996185303, 6,
    ],
    poise: 5,
    poise3: 5,
  },
);

export const lifengComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0015_lifeng_combo_skill',
    timelineBlockFrames: 50,
    naturalDurationFrames: 168,
    exclusiveFrame: 64,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 50, endFrame: 89, sourceSkillIds: ['chr_0015_lifeng_normal_skill'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'main_near',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        1,
      ),
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0015_lifeng_combo_skill:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        20,
      ),
      scheduled(
        48,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale2' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0015_lifeng_combo_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
          }),
        ),
        49,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.933000028133392 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        25,
      ),
    ],
    smartTarget: 'trigger',
    cooldownFrames: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 450],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      0.469999998807907, 0.509999990463257, 0.560000002384186, 0.610000014305115, 0.649999976158142,
      0.699999988079071, 0.75, 0.790000021457672, 0.839999973773956, 0.899999976158142,
      0.970000028610229, 1.04999995231628,
    ],
    atk_scale2: [
      1.66999995708466, 1.83000004291534, 2, 2.17000007629395, 2.32999992370605, 2.5,
      2.67000007629395, 2.82999992370605, 3, 3.21000003814697, 3.46000003814697, 3.75,
    ],
    cam_angle: 0,
    cam_duration: 0,
    duration: 20,
    ex_usp: 0,
    exist_talent: 0,
    input_angle: 0,
    main_near: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    scale: 0.5,
    usp: 10,
  },
);

export default {
  slug: 'lifeng',
  gameId: 'LIFENG',
  rarity: 6,
  weaponType: 'polearm',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [14, 38, 62, 86, 111, 123],
    agility: [20, 44, 69, 94, 119, 132],
    intellect: [13, 35, 58, 81, 104, 115],
    will: [12, 35, 58, 82, 105, 117],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [lifengBasicAttack1, lifengBasicAttack2, lifengBasicAttack3, lifengBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: lifengFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: lifengPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: lifengBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: lifengUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: lifengComboSkill,
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
      event: 'beforeTakeDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'contextTargetBuffStackCompare',
            contextKey: 'trigger',
            tagQueryType: 'hasAny',
            buffTags: [
              'Skill/Character/Common/Affixes/Vulnerable/VulnerablePhysic',
              'Skill/Character/Common/PhysicalStatus/FractureStatus',
            ],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          sequence(
            branch(
              {
                kind: 'actionInputTargetIdentityMatch',
                other: 'controlledOperator',
                operator: 'equal',
              },
              sequence(
                branch(
                  {
                    kind: 'eventDamageTagsMatch',
                    match: 'hasAny',
                    tags: ['normalAttackLastCombo'],
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
      passiveSkills: [
        {
          key: 'chr_0015_lifeng_talent_1',
          blackboard: { atk_up: [0.00100000004749745, 0.00150000001303852] },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0015_lifeng_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: { atk_up: { kind: 'blackboard', key: 'atk_up' } },
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
          buffId: 'buff_chr_0015_lifeng_talent_2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { atk_scale_talent2: [0.5, 1] },
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
          blackboardKey: 'phy_resist_down',
          operation: 'add',
          value: 0.0500000007450581,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'num',
          operation: 'assign',
          value: 2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['will'], value: 15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0015_lifeng_talent_1',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.000500000023748726,
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0015_lifeng_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            interval: { kind: 'constant', value: 15 },
            atk_scale_potential5: { kind: 'constant', value: 2.5 },
            poise_potential5: { kind: 'constant', value: 5 },
          },
        }),
      ),
    },
  ],
  entityBlackboard: { EntityBB_isCombo: 0 },
  passiveSkills: [
    {
      key: 'chr_0015_lifeng_passive',
      enableSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0015_lifeng_passive',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0015_lifeng_passive: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_common_affixes_skillimbue_atk'] },
              sequence(
                step('modifyActionValue', {
                  key: 'EntityBB_isCombo',
                  operation: 'assign',
                  value: { kind: 'constant', value: 1 },
                }),
              ),
            ),
          ),
        },
        {
          event: 'skillEnd',
          priority: 0,
          sequence: sequence(
            step('modifyActionValue', {
              key: 'EntityBB_isCombo',
              operation: 'assign',
              value: { kind: 'constant', value: 0 },
            }),
          ),
        },
      ],
    },
    buff_chr_0015_lifeng_potential_5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: { blackboardKey: 'interval' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale_potential5: 0, interval: 0, poise_potential5: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        trigger: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0015_lifeng_talent_2'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0015_lifeng_potential_5_1',
                target: 'buffOwner',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_scale_potential5: { kind: 'blackboard', key: 'atk_scale_potential5' },
                  poise_potential5: { kind: 'blackboard', key: 'poise_potential5' },
                  interval: { kind: 'blackboard', key: 'interval' },
                },
              }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0015_lifeng_potential_5'],
                reason: 'other',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0015_lifeng_potential_5_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_lifeng_potential_5',
        iconPath: '/icons/icon_battle_lifeng_potential_5.webp',
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
      blackboard: { atk_scale_potential5: 0, interval: 0, poise_potential5: 0 },
      attributeModifiers: [],
    },
    buff_chr_0015_lifeng_purify: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 12, rate: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_physical',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              rate: { kind: 'blackboard', key: 'rate' },
            },
            stringBlackboardAssignments: { child_buff_id: 'buff_chr_0015_lifeng_purify_icon' },
          }),
        ),
      },
    },
    buff_chr_0015_lifeng_purify_icon: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_affix_physical_vulnerable',
        iconPath: '/icons/icon_battle_affix_physical_vulnerable.webp',
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
    buff_chr_0015_lifeng_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0 },
      attributeModifiers: [
        {
          attribute: 'AtkIncreaseFactorFromWisd',
          slot: 'baseAddition',
          value: { blackboardKey: 'atk_up' },
        },
        {
          attribute: 'AtkIncreaseFactorFromWill',
          slot: 'addition',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    buff_chr_0015_lifeng_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      applyTags: [],
      extendTags: [],
      blackboard: {
        atk_scale_potential5: 0,
        atk_scale_talent2: 0,
        final_atk_scale_talent2: 0,
        interval: 0,
        poise_potential5: 0,
      },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'beforeOutputKnockDown',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'buffIdStackCompare',
                target: 'buffOwner',
                buffIds: ['buff_chr_0015_lifeng_potential_5_1'],
                operator: 'greaterOrEqual',
                value: { kind: 'constant', value: 1 },
              },
              sequence(
                step('readBuffBlackboard', {
                  target: 'buffOwner',
                  query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                  desiredKey: 'atk_scale_potential5',
                  outputKey: 'atk_scale_potential5',
                }),
                step('readBuffBlackboard', {
                  target: 'buffOwner',
                  query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                  desiredKey: 'interval',
                  outputKey: 'interval',
                }),
                step('readBuffBlackboard', {
                  target: 'buffOwner',
                  query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                  desiredKey: 'poise_potential5',
                  outputKey: 'poise_potential5',
                }),
                step('calculateActionValue', {
                  key: 'final_atk_scale_talent2',
                  operation: 'add',
                  left: { kind: 'blackboard', key: 'atk_scale_talent2' },
                  right: { kind: 'blackboard', key: 'atk_scale_potential5' },
                }),
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'final_atk_scale_talent2' },
                    tags: [],
                    stagger: { kind: 'blackboard', key: 'poise_potential5' },
                  },
                  'buff_chr_0015_lifeng_talent_2:/abilityEventResponses/0/sequence/steps/0/whenTrue/steps/4',
                ),
                step('finishBuffsById', {
                  target: 'buffOwner',
                  buffIds: ['buff_chr_0015_lifeng_potential_5_1'],
                  reason: 'other',
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0015_lifeng_potential_5',
                  target: 'buffOwner',
                  source: 'buffSource',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    interval: { kind: 'blackboard', key: 'interval' },
                    atk_scale_potential5: { kind: 'blackboard', key: 'atk_scale_potential5' },
                    poise_potential5: { kind: 'blackboard', key: 'poise_potential5' },
                  },
                }),
              ),
              sequence(
                step(
                  'dealDamage',
                  {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_talent2' },
                    tags: [],
                  },
                  'buff_chr_0015_lifeng_talent_2:/abilityEventResponses/0/sequence/steps/0/whenFalse/steps/0',
                ),
              ),
              { alwaysNext: true },
            ),
          ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0015_lifeng_ultimate_skill: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'SelectCategory/ProjectilePassThru',
      ],
      lifetime: { kind: 'limited', durationSeconds: 5 },
      deathReleaseDelaySeconds: 0.100000001490116,
      childSkill: {
        skillId: 'chr_0015_lifeng_ultimate_skill_abentity',
        blackboard: {
          atk_scale1: 1,
          atk_scale2: 1.5,
          atk_scale3: 0,
          isCombo: 0,
          poise: 0,
          poise2: 0,
          poise3: 0,
        },
        scheduledSequences: [
          scheduled(
            6,
            sequence(
              step('applyKnockDown', {
                target: 'enemy',
                duration: { kind: 'constant', value: 2.09999990463257 },
                force: false,
                isExtra: false,
                targetFilter: 'aliveOnly',
                returnWhen: 'always',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity:/childSkill/scheduledSequences/0/sequence/steps/1',
              ),
            ),
            7,
          ),
          scheduled(
            66,
            sequence(
              step('applyKnockDown', {
                target: 'enemy',
                duration: { kind: 'constant', value: 2.09999990463257 },
                force: false,
                isExtra: false,
                targetFilter: 'aliveOnly',
                returnWhen: 'always',
              }),
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise2' },
                },
                'abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity:/childSkill/scheduledSequences/1/sequence/steps/1',
              ),
            ),
            67,
          ),
          scheduled(
            121,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale3' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise3' },
                },
                'abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity:/childSkill/scheduledSequences/2/sequence/steps/0',
              ),
            ),
            122,
          ),
          scheduled(
            67,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'isCombo' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(step('jumpTimeline', { destinationFrame: 150 })),
                sequence(
                  step('modifyActionValue', {
                    key: 'EntityBB_isCombo',
                    operation: 'assign',
                    value: { kind: 'constant', value: 0 },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            68,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
