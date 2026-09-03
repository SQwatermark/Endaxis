/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import { branch, scheduled, sequence, step, withSkillBlackboard } from '../../definitionHelpers';

export const akekuriBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0019_karin_attack1',
    timelineBlockFrames: 14,
    naturalDurationFrames: 90,
    exclusiveFrame: 17,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 1,
          endFrame: 32,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0019_karin_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 32, sourceSkillIds: ['chr_0019_karin_attack2'] },
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
            'chr_0019_karin_attack1:/scheduledSequences/0/sequence/steps/0',
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
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.389999985694885,
      0.419999986886978, 0.449999988079071,
    ],
  },
);

export const akekuriBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0019_karin_attack2',
    timelineBlockFrames: 22,
    naturalDurationFrames: 112,
    exclusiveFrame: 28,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 13,
          endFrame: 38,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0019_karin_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 38, sourceSkillIds: ['chr_0019_karin_attack3'] },
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
            'chr_0019_karin_attack2:/scheduledSequences/0/sequence/steps/0',
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
        9,
      ),
      scheduled(
        16,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0019_karin_attack2:/scheduledSequences/1/sequence/steps/0',
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
        17,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.129999995231628, 0.140000000596046, 0.150000005960464, 0.159999996423721, 0.180000007152557,
      0.189999997615814, 0.200000002980232, 0.209999993443489, 0.230000004172325, 0.239999994635582,
      0.259999990463257, 0.280000001192093,
    ],
    atk_scale_2: [
      0.150000005960464, 0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489,
      0.230000004172325, 0.239999994635582, 0.259999990463257, 0.270000010728836, 0.28999999165535,
      0.310000002384186, 0.340000003576279,
    ],
    display_atk_scale: [
      0.280000001192093, 0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885,
      0.409999996423721, 0.439999997615814, 0.469999998807907, 0.5, 0.529999971389771,
      0.569999992847443, 0.620000004768372,
    ],
  },
);

export const akekuriBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0019_karin_attack3',
    timelineBlockFrames: 21,
    naturalDurationFrames: 95,
    exclusiveFrame: 27,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 11,
          endFrame: 36,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0019_karin_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 21, endFrame: 36, sourceSkillIds: ['chr_0019_karin_attack4'] },
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
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0019_karin_attack3:/scheduledSequences/0/sequence/steps/0',
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
                durationSeconds: { kind: 'constant', value: 0.150000005960464 },
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
        11,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978, 0.46000000834465,
      0.490000009536743, 0.519999980926514, 0.550000011920929, 0.589999973773956, 0.629999995231628,
      0.670000016689301, 0.730000019073486,
    ],
  },
);

export const akekuriBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0019_karin_attack4',
    timelineBlockFrames: 35,
    naturalDurationFrames: 110,
    exclusiveFrame: 34,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 24,
          endFrame: 52,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0019_karin_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 35, endFrame: 52, sourceSkillIds: ['chr_0019_karin_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0019_karin_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        20,
      ),
      scheduled(
        20,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0019_karin_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
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
        21,
      ),
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
            'chr_0019_karin_attack4:/scheduledSequences/2/sequence/steps/0',
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
      0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489, 0.230000004172325,
      0.25, 0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.340000003576279, 0.370000004768372,
    ],
    poise: 17,
    display_atk_scale: [
      0.5, 0.540000021457672, 0.589999973773956, 0.639999985694885, 0.689999997615814,
      0.740000009536743, 0.790000021457672, 0.839999973773956, 0.889999985694885, 0.949999988079071,
      1.02999997138977, 1.11000001430511,
    ],
  },
);

export const akekuriFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0019_karin_power_attack',
    timelineBlockFrames: 37,
    naturalDurationFrames: 137,
    exclusiveFrame: 60,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 37,
          endFrame: 60,
          sourceSkillIds: ['chr_0019_karin_normal_skill', 'chr_0019_karin_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.200000002980232,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0019_karin_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.159999996423721 },
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
        14,
      ),
      scheduled(
        36,
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
            'chr_0019_karin_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        37,
      ),
      scheduled(
        40,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.349999994039536 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'common' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
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
        36,
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

export const akekuriPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0019_karin_plunging_attack_end',
    timelineBlockFrames: 14,
    naturalDurationFrames: 95,
    exclusiveFrame: 13,
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
            'chr_0019_karin_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const akekuriBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0019_karin_normal_skill',
    timelineBlockFrames: 41,
    naturalDurationFrames: 125,
    exclusiveFrame: 40,
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step(
            'dealDamage',
            {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0019_karin_normal_skill:/scheduledSequences/0/sequence/steps/1',
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
        ),
        21,
      ),
      scheduled(20, sequence(step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 })), 21),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      1.41999995708466, 1.55999994277954, 1.71000003814697, 1.85000002384186, 1.99000000953674,
      2.13000011444092, 2.27999997138977, 2.42000007629395, 2.55999994277954, 2.74000000953674,
      2.95000004768372, 3.20000004768372,
    ],
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    poise: 10,
  },
);

export const akekuriUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0019_karin_ultimate_skill',
    timelineBlockFrames: 129,
    naturalDurationFrames: 233,
    exclusiveFrame: 150,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 120,
          endFrame: 201,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0019_karin_attack1',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 129,
          endFrame: 201,
          sourceSkillIds: [
            'chr_0019_karin_normal_skill',
            'chr_0019_karin_attack1',
            'chr_0019_karin_combo_skill',
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
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_3' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0019_karin_potential_3',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: { atk: { kind: 'blackboard', key: 'atk' } },
              }),
            ),
          ),
        ),
        150,
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
          step('storeSourceAttributeValue', {
            attribute: { kind: 'secondary' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'sub_ratio' },
            base: { kind: 'constant', value: 1 },
            targetKey: 'atb_up',
          }),
          step('modifyActionValue', {
            key: 'max_ratio',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'less',
              right: { kind: 'blackboard', key: 'max_ratio' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'atb_1',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
              step('modifyActionValue', {
                key: 'atb_2',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
              step('modifyActionValue', {
                key: 'atb_3',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'atb_1',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
              step('modifyActionValue', {
                key: 'atb_2',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
              step('modifyActionValue', {
                key: 'atb_3',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        12,
      ),
      scheduled(
        59,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_1' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
        83,
      ),
      scheduled(
        86,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_2' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
        115,
      ),
      scheduled(
        119,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_3' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
        ),
        159,
      ),
      scheduled(
        0,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'main_char',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        1,
      ),
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0019_karin_talent_2',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  potential_5_duration: { kind: 'blackboard', key: 'potential_5_duration' },
                },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0019_karin_talent_2_combo',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  imbue_scale: { kind: 'blackboard', key: 'imbue_scale' },
                  duration: { kind: 'blackboard', key: 'duration' },
                },
              }),
            ),
          ),
        ),
        150,
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
        83,
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
        55,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 120 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atb_1: [19, 19, 20, 21, 21, 22, 23, 23, 24, 25, 25, 26],
    atb_2: [19, 20, 21, 21, 22, 23, 23, 24, 25, 25, 26, 27],
    atb_3: [20, 21, 21, 22, 23, 23, 24, 25, 25, 26, 27, 27],
    atb_up: 1,
    atk: 0,
    combo: 0,
    duration: 10,
    imbue_scale: 0,
    max_ratio: 0,
    potential_3: 0,
    potential_5_duration: 0,
    sub_ratio: 0,
    atb_display: [58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80],
  },
);

export const akekuriComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0019_karin_combo_skill',
    timelineBlockFrames: 38,
    naturalDurationFrames: 136,
    exclusiveFrame: 55,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 38, endFrame: 71, sourceSkillIds: ['chr_0019_karin_normal_skill'] },
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
        1,
      ),
      scheduled(
        22,
        sequence(
          step('modifyActionValue', {
            key: 'sub_ratio',
            operation: 'divide',
            value: { kind: 'blackboard', key: 'rate' },
          }),
          step('storeSourceAttributeValue', {
            attribute: { kind: 'secondary' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'sub_ratio' },
            base: { kind: 'constant', value: 1 },
            targetKey: 'atb_up',
          }),
          step('modifyActionValue', {
            key: 'max_ratio',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'less',
              right: { kind: 'blackboard', key: 'max_ratio' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'atb',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'atb_up' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'atb',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'max_ratio' },
              }),
            ),
            { alwaysNext: true },
          ),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
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
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0019_karin_combo_skill:/scheduledSequences/1/sequence/steps/5',
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
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
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
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
        26,
      ),
      scheduled(
        31,
        sequence(
          step('modifyActionValue', {
            key: 'count',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
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
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0019_karin_combo_skill:/scheduledSequences/2/sequence/steps/2',
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_normal_attack' },
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
            { alwaysNext: true },
          ),
        ),
        36,
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
    cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 270],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: 7.5,
    atb_up: 1,
    atk_scale: [
      0.800000011920929, 0.879999995231628, 0.959999978542328, 1.03999996185303, 1.12000000476837,
      1.20000004768372, 1.27999997138977, 1.36000001430511, 1.44000005722046, 1.53999996185303,
      1.6599999666214, 1.79999995231628,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    input_angle: 0,
    max_ratio: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 5,
    rate: 10,
    sub_ratio: 0,
    usp: 5,
  },
);

export default {
  slug: 'akekuri',
  gameId: 'AKEKURI',
  rarity: 4,
  weaponType: 'sword',
  element: 'heat',
  role: 'vanguard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [13, 34, 55, 77, 99, 110],
    agility: [15, 42, 70, 98, 126, 140],
    intellect: [12, 32, 53, 75, 96, 106],
    will: [9, 30, 52, 74, 96, 108],
    baseAttack: [30, 92, 157, 222, 287, 319],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [akekuriBasicAttack1, akekuriBasicAttack2, akekuriBasicAttack3, akekuriBasicAttack4],
    },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: akekuriFinisher },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: akekuriPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: akekuriBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: akekuriUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: akekuriComboSkill,
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
      event: 'poiseZero',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'contextTargetObjectTypeMatch', contextKey: 'trigger', objectTypeMask: 16 },
          sequence(),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill',
      event: 'poiseKnotBreak',
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'sub_ratio',
          operation: 'assign',
          value: [0.00999999977648258, 0.0149999996647239],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'max_ratio',
          operation: 'assign',
          value: [0.5, 0.75],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate',
          operation: 'assign',
          value: [10, 10],
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
          blackboardKey: 'combo',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'imbue_scale',
          operation: 'assign',
          value: 0.200000002980232,
        },
      ],
    },
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0019_karin_potential_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            atk_up: { kind: 'constant', value: 0.100000001490116 },
            duration: { kind: 'constant', value: 10 },
            max_stack: { kind: 'constant', value: 5 },
          },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 10 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 10 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk',
          operation: 'assign',
          value: 0.100000001490116,
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
          multiplier: 0.899999976158142,
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
          blackboardKey: 'potential_5_duration',
          operation: 'assign',
          value: 5,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0019_karin_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0019_karin_potential_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_up: 0, duration: 0, max_stack: 1 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'skillSpGained',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSpGainMatch', sources: ['skill'], gainKinds: ['gain'] },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0019_karin_potential_1_1',
                  target: 'buffOwner',
                  source: 'buffOwner',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    duration: { kind: 'blackboard', key: 'duration' },
                    atk_up: { kind: 'blackboard', key: 'atk_up' },
                  },
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0019_karin_potential_1_1: {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 5,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      blackboard: { atk_up: 0, duration: 5, max_stack: 1 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
    },
    buff_chr_0019_karin_potential_3: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      blackboard: { atk: 0.1 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk' } },
      ],
    },
    buff_chr_0019_karin_potential_5: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0019_karin_potential_5_combo: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'potential_5_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { potential_5_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0019_karin_talent_2_combo'],
            reason: 'other',
          }),
        ),
      },
    },
    buff_chr_0019_karin_talent_2: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { potential_5_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        finish: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0019_karin_potential_5'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0019_karin_potential_5_combo',
                target: 'buffOwner',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  potential_5_duration: { kind: 'blackboard', key: 'potential_5_duration' },
                },
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0019_karin_talent_2_combo'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      },
    },
    buff_chr_0019_karin_talent_2_combo: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { duration: 0, imbue_scale: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('createGlobalBuff', {
            globalBuffId: 'global_buff_combo_trigger',
            definition: {
              stackingType: 'stack',
              maxStackCount: 4,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: { duration: 0, imbue_scale: 0 },
              children: [
                {
                  buffId: 'buff_common_affixes_combo_trigger',
                  blackboardAssignments: {
                    imbue_scale: { kind: 'blackboard', key: 'imbue_scale' },
                  },
                },
              ],
            },
            source: 'buffOwner',
            finishByAction: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              imbue_scale: { kind: 'blackboard', key: 'imbue_scale' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
