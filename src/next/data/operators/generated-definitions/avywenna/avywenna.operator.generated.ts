/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachContextTarget,
  forEachTarget,
  scheduled,
  sequence,
  step,
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const avywennaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0012_avywen_attack1',
    timelineBlockFrames: 8,
    naturalDurationFrames: 188,
    exclusiveFrame: 20,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 27,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0012_avywen_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 8, endFrame: 27, sourceSkillIds: ['chr_0012_avywen_attack2'] },
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
            'chr_0012_avywen_attack1:/scheduledSequences/0/sequence/steps/0',
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
      0.170000001788139, 0.180000007152557, 0.200000002980232, 0.209999993443489, 0.230000004172325,
      0.25, 0.259999990463257, 0.280000001192093, 0.300000011920929, 0.319999992847443,
      0.340000003576279, 0.370000004768372,
    ],
  },
);

export const avywennaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0012_avywen_attack2',
    timelineBlockFrames: 14,
    naturalDurationFrames: 224,
    exclusiveFrame: 17,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0012_avywen_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 14, endFrame: 25, sourceSkillIds: ['chr_0012_avywen_attack3'] },
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
            'chr_0012_avywen_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0700000002980232 },
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
      0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093, 0.300000011920929,
      0.319999992847443, 0.340000003576279, 0.370000004768372, 0.389999985694885, 0.409999996423721,
      0.449999988079071, 0.479999989271164,
    ],
  },
);

export const avywennaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0012_avywen_attack3',
    timelineBlockFrames: 10,
    naturalDurationFrames: 183,
    exclusiveFrame: 17,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 25,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0012_avywen_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 10, endFrame: 25, sourceSkillIds: ['chr_0012_avywen_attack4'] },
      ],
    },
    costFrame: 12,
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
            'chr_0012_avywen_attack3:/scheduledSequences/0/sequence/steps/0',
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
      0.310000002384186, 0.330000013113022, 0.349999994039536, 0.370000004768372, 0.389999985694885,
      0.430000007152557, 0.46000000834465,
    ],
  },
);

export const avywennaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0012_avywen_attack4',
    timelineBlockFrames: 22,
    naturalDurationFrames: 208,
    exclusiveFrame: 30,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0012_avywen_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 22, endFrame: 40, sourceSkillIds: ['chr_0012_avywen_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack4:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
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
            undefined,
            { alwaysNext: true },
          ),
        ),
        6,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
              tags: ['normalAttack'],
            },
            'chr_0012_avywen_attack4:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.219999998807907 },
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
        19,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 0,
    atk_scale: [
      0.100000001490116, 0.109999999403954, 0.119999997317791, 0.129999995231628, 0.140000000596046,
      0.150000005960464, 0.159999996423721, 0.170000001788139, 0.180000007152557, 0.189999997615814,
      0.209999993443489, 0.230000004172325,
    ],
    atk_scale_2: [
      0.200000002980232, 0.219999998807907, 0.239999994635582, 0.259999990463257, 0.280000001192093,
      0.300000011920929, 0.319999992847443, 0.340000003576279, 0.360000014305115, 0.389999985694885,
      0.419999986886978, 0.449999988079071,
    ],
    display_atk_scale: [
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
  },
);

export const avywennaBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0012_avywen_attack5',
    timelineBlockFrames: 45,
    naturalDurationFrames: 192,
    exclusiveFrame: 45,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 55,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0012_avywen_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 45, endFrame: 55, sourceSkillIds: ['chr_0012_avywen_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        24,
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
            'chr_0012_avywen_attack5:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.300000011920929 },
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
        25,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 19,
    atk_scale: [
      0.5, 0.550000011920929, 0.600000023841858, 0.649999976158142, 0.699999988079071, 0.75,
      0.800000011920929, 0.850000023841858, 0.899999976158142, 0.959999978542328, 1.03999996185303,
      1.12999999523163,
    ],
    poise: 17,
  },
);

export const avywennaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0012_avywen_power_attack',
    timelineBlockFrames: 29,
    naturalDurationFrames: 207,
    exclusiveFrame: 44,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 29,
          endFrame: 49,
          sourceSkillIds: ['chr_0012_avywen_normal_skill', 'chr_0012_avywen_combo_skill'],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.300000011920929,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0012_avywen_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(step('gainFinisherSp', { factor: 1, recipient: 'team' })),
            undefined,
            { alwaysNext: true },
          ),
        ),
        28,
      ),
      scheduled(
        28,
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
            'chr_0012_avywen_power_attack:/scheduledSequences/1/sequence/steps/0',
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
        29,
      ),
      scheduled(
        29,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.5,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0012_avywen_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.5 },
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
        30,
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
        44,
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
        29,
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

export const avywennaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0012_avywen_plunging_attack_end',
    timelineBlockFrames: 11,
    naturalDurationFrames: 228,
    exclusiveFrame: 15,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 11, endFrame: 15, sourceSkillIds: ['chr_0012_avywen_attack1'] },
      ],
    },
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
            'chr_0012_avywen_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const avywennaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0012_avywen_normal_skill',
    timelineBlockFrames: 34,
    naturalDurationFrames: 306,
    exclusiveFrame: 38,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 34, endFrame: 60, sourceSkillIds: ['chr_0012_avywen_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'lances',
            abilityEntityIds: [
              'abilityentity_chr_0012_avywen_combo_skill_lance',
              'abilityentity_chr_0012_avywen_ultimate_skill_lance',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'lances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
        3,
      ),
      scheduled(
        18,
        sequence(
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
        21,
      ),
      scheduled(
        18,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_normal_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
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
        21,
      ),
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'lances',
            abilityEntityIds: [
              'abilityentity_chr_0012_avywen_combo_skill_lance',
              'abilityentity_chr_0012_avywen_ultimate_skill_lance',
            ],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'lances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget('lances', sequence()),
            ),
          ),
        ),
        6,
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'ComboLances',
            abilityEntityIds: ['abilityentity_chr_0012_avywen_combo_skill_lance'],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'ComboLances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget(
                'ComboLances',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 0 },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 50 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0012_avywen_lance_becalled',
                        target: 'currentAbilityEntity',
                        inheritSourceSkillCastInfo: true,
                      }),
                      withActionBlackboardScope(
                        'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_combo_skill_lance_back',
                        {},
                        true,
                        sequence(
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back',
                            {
                              atk_scale_lance: 3,
                              poise_lance: 0,
                              potential_5_rate: 0,
                              radius: 4,
                              talent0_usp: 0,
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
                                  step('modifyActionValue', {
                                    key: 'EntityBB_talent0',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'talent0_usp' },
                                  }),
                                  branch(
                                    {
                                      kind: 'all',
                                      conditions: [
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'potential_5_rate' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'constant', value: 1 },
                                        },
                                      ],
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'atk_scale_lance',
                                        operation: 'multiply',
                                        value: { kind: 'blackboard', key: 'potential_5_rate' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenTrue/steps/1',
                                      ),
                                    ),
                                    sequence(
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/1/whenFalse/steps/0',
                                      ),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[9]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach',
                            { atk_scale: 3, radius: 4 },
                            true,
                            sequence(
                              step('startTimeDilation', {
                                scope: 'global',
                                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                                slot: 'TimeDilation/Layer/Entity/HitStop',
                                priority: 10,
                                curve: {
                                  kind: 'inline',
                                  keys: [
                                    {
                                      time: 0,
                                      value: 0.200000002980232,
                                      inTangent: 0.0437949597835541,
                                      outTangent: 0.0437949597835541,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                    {
                                      time: 0.884744584560394,
                                      value: 0.238747403025627,
                                      inTangent: 0.0437949597835541,
                                      outTangent: 6.60491800308228,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                    {
                                      time: 1,
                                      value: 1,
                                      inTangent: 6.60491800308228,
                                      outTangent: 6.60491800308228,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                  ],
                                },
                                finishByAction: false,
                                ignoredTargets: ['controlled'],
                              }),
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffIdStackCompare',
                                      target: 'caster',
                                      buffIds: ['buff_chr_0012_avywen_talent_0'],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('changeResourceByActionValue', {
                                        resource: 'ultimateEnergy',
                                        amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'caster',
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                        { EntityBB_talent0: 0 },
                        { lifetime: 'execution' },
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        10,
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', {
            saveToContextKey: 'UltiLances',
            abilityEntityIds: ['abilityentity_chr_0012_avywen_ultimate_skill_lance'],
          }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'UltiLances',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              step('modifyActionValue', {
                key: 'lance_count',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              forEachContextTarget(
                'UltiLances',
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'constant', value: 0 },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 50 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0012_avywen_lance_becalled',
                        target: 'currentAbilityEntity',
                        inheritSourceSkillCastInfo: true,
                      }),
                      withActionBlackboardScope(
                        'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:projectile_chr_0012_avywen_ultimate_skill_lance_back',
                        {},
                        true,
                        sequence(
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_ultimate_skill_lance_back',
                            {
                              atk_scale_lance_ult: 3,
                              poise_lance: 0,
                              poise_lance_ult: 0,
                              potential_5_rate: 0,
                              radius: 4,
                              talent0_usp: 0,
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
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0012_avywen_lance_pulse_check',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: true,
                                  }),
                                  step('modifyActionValue', {
                                    key: 'EntityBB_talent0',
                                    operation: 'assign',
                                    value: { kind: 'blackboard', key: 'talent0_usp' },
                                  }),
                                  branch(
                                    {
                                      kind: 'all',
                                      conditions: [
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'potential_5_rate' },
                                          operator: 'greater',
                                          right: { kind: 'constant', value: 0 },
                                        },
                                        {
                                          kind: 'buffStackCompare',
                                          target: 'enemy',
                                          tagQueryType: 'hasAny',
                                          buffTags: [
                                            'Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse',
                                          ],
                                          operator: 'greaterOrEqual',
                                          value: { kind: 'constant', value: 1 },
                                        },
                                      ],
                                    },
                                    sequence(
                                      step('modifyActionValue', {
                                        key: 'atk_scale_lance_ult',
                                        operation: 'multiply',
                                        value: { kind: 'blackboard', key: 'potential_5_rate' },
                                      }),
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance_ult',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance_ult' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenTrue/steps/1',
                                      ),
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: {
                                          kind: 'constant',
                                          value: 0.400000005960464,
                                        },
                                        slot: 'TimeDilation/Layer/Entity/HitStop',
                                        priority: 10,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['enemy', 'caster'],
                                      }),
                                    ),
                                    sequence(
                                      step(
                                        'dealDamage',
                                        {
                                          damageType: 'electric',
                                          attackScale: {
                                            kind: 'blackboard',
                                            key: 'atk_scale_lance_ult',
                                          },
                                          tags: ['normalSkill'],
                                          features: ['canBreakWeakness'],
                                          stagger: { kind: 'blackboard', key: 'poise_lance_ult' },
                                        },
                                        'chr_0012_avywen_normal_skill:/scheduledSequences/5/sequence/steps/1/whenTrue/steps/1/body/steps/0/whenTrue/steps/1/body/steps/0/body/steps/0/whenTrue/steps/2/whenFalse/steps/0',
                                      ),
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: {
                                          kind: 'constant',
                                          value: 0.400000005960464,
                                        },
                                        slot: 'TimeDilation/Layer/Entity/HitStop',
                                        priority: 10,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['enemy', 'caster'],
                                      }),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                          withActionBlackboardScope(
                            'SkillData.chr_0012_avywen_normal_skill.actionGroupData.timelineActions[10]._sequenceActionData.actionData[3].action.actionData[3]:chr_0012_avywen_combo_skill_lance_back_reach',
                            { atk_scale: 3, radius: 4 },
                            true,
                            sequence(
                              step('startTimeDilation', {
                                scope: 'global',
                                durationSeconds: { kind: 'constant', value: 0.200000002980232 },
                                slot: 'TimeDilation/Layer/Entity/HitStop',
                                priority: 10,
                                curve: {
                                  kind: 'inline',
                                  keys: [
                                    {
                                      time: 0,
                                      value: 0.200000002980232,
                                      inTangent: 0.0437949597835541,
                                      outTangent: 0.0437949597835541,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                    {
                                      time: 0.884744584560394,
                                      value: 0.238747403025627,
                                      inTangent: 0.0437949597835541,
                                      outTangent: 6.60491800308228,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                    {
                                      time: 1,
                                      value: 1,
                                      inTangent: 6.60491800308228,
                                      outTangent: 6.60491800308228,
                                      weightedMode: 0,
                                      inWeight: 0,
                                      outWeight: 0,
                                    },
                                  ],
                                },
                                finishByAction: false,
                                ignoredTargets: ['controlled'],
                              }),
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0 },
                                },
                                sequence(
                                  branch(
                                    {
                                      kind: 'buffIdStackCompare',
                                      target: 'caster',
                                      buffIds: ['buff_chr_0012_avywen_talent_0'],
                                      operator: 'greaterOrEqual',
                                      value: { kind: 'constant', value: 1 },
                                    },
                                    sequence(
                                      step('changeResourceByActionValue', {
                                        resource: 'ultimateEnergy',
                                        amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                                        coefficient: { kind: 'constant', value: 1 },
                                        recipient: 'caster',
                                      }),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            undefined,
                            { lifetime: 'execution', alwaysNext: true },
                          ),
                        ),
                        { EntityBB_talent0: 0 },
                        { lifetime: 'execution' },
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        10,
      ),
    ],
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atk_scale: [
      0.670000016689301, 0.730000019073486, 0.800000011920929, 0.870000004768372, 0.930000007152557,
      1, 1.07000005245209, 1.12999999523163, 1.20000004768372, 1.27999997138977, 1.37999999523163,
      1.5,
    ],
    atk_scale_lance: [
      0.75, 0.819999992847443, 0.899999976158142, 0.970000028610229, 1.03999996185303,
      1.12000000476837, 1.19000005722046, 1.26999998092651, 1.3400000333786, 1.44000005722046,
      1.54999995231628, 1.67999994754791,
    ],
    atk_scale_lance_ult: [
      1.91999995708466, 2.10999989509583, 2.29999995231628, 2.5, 2.69000005722046, 2.88000011444092,
      3.0699999332428, 3.25999999046326, 3.46000003814697, 3.70000004768372, 3.98000001907349,
      4.32000017166138,
    ],
    cam_angle: 0,
    cam_duration: 0.3,
    input_angle: 0,
    lance_count: 0,
    poise: 5,
    poise_lance: 5,
    poise_lance_ult: 10,
    potential_5_rate: 0,
    talent0_usp: 0,
  },
);

export const avywennaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0012_avywen_combo_skill',
    timelineBlockFrames: 21,
    naturalDurationFrames: 254,
    exclusiveFrame: 40,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 21, endFrame: 68, sourceSkillIds: ['chr_0012_avywen_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:projectile_chr_0012_avywen_combo_skill_lance_out',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0012_avywen_combo_skill.actionGroupData.timelineActions[6]._sequenceActionData.actionData[4]:chr_0012_avywen_combo_skill_lance_gene',
                { atk_scale_lance_back: 1, potential_2: 0, radius: 4, talent_atb_gain: 0 },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0012_avywen_combo_skill_lance',
                    childSkillId: 'chr_0012_avywen_combo_skill_lance',
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
        15,
      ),
      scheduled(
        14,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_combo_skill:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0012_avywen_talent_0'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'talent0_usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              ),
            ),
          ),
        ),
        15,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        12,
      ),
    ],
    cooldownFrames: [390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 360],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atk_scale: [
      1.69000005722046, 1.86000001430511, 2.02999997138977, 2.19000005722046, 2.35999989509583,
      2.52999997138977, 2.70000004768372, 2.86999988555908, 3.03999996185303, 3.25, 3.5,
      3.79999995231628,
    ],
    atk_scale_lance_back: 1,
    cam_angle: 0,
    cam_duration: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 10,
    poise_lance: 0,
    potential_2: 0,
    radius: 4,
    talent0_usp: 0,
    usp: 10,
    lance_duration: 30,
  },
);

export const avywennaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0012_avywen_ultimate_skill',
    timelineBlockFrames: 57,
    naturalDurationFrames: 273,
    exclusiveFrame: 65,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 57,
          endFrame: 73,
          sourceSkillIds: ['chr_0012_avywen_combo_skill', 'chr_0012_avywen_normal_skill'],
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
        30,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('findCharacterTeamTargets', {
                saveToContextKey: 'MainChar',
                selection: { kind: 'controlledOperator' },
              }),
            ),
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
        45,
      ),
      scheduled(
        45,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:projectile_chr_0012_avywen_ultimate_skill_lance_out',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0012_avywen_ultimate_skill.actionGroupData.timelineActions[7]._sequenceActionData.actionData[1]:chr_0012_avywen_ultimate_skill_lance_gene',
                {
                  atk_scale_ulti_lance_back: 0,
                  potential_2: 0,
                  radius: 4,
                  talent_atb_gain_ulti: 0,
                },
                true,
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0012_avywen_ultimate_skill_lance',
                    childSkillId: 'chr_0012_avywen_ultimate_skill_lance',
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
        48,
      ),
      scheduled(
        51,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'pulse_vul_duration' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0012_avywen_ultimate_skill_debuff',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  pulse_vul_rate: { kind: 'blackboard', key: 'pulse_vul_rate' },
                  pulse_vul_duration: { kind: 'blackboard', key: 'pulse_vul_duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step(
            'dealDamage',
            {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['ultimateSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            },
            'chr_0012_avywen_ultimate_skill:/scheduledSequences/4/sequence/steps/1',
          ),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0012_avywen_talent_0'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'talent0_usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                  }),
                ),
              ),
            ),
          ),
        ),
        54,
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
        65,
      ),
    ],
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      4.21999979019165, 4.6399998664856, 5.07000017166138, 5.48999977111816, 5.90999984741211,
      6.32999992370605, 6.75, 7.17999982833862, 7.59999990463257, 8.13000011444092,
      8.76000022888184, 9.5,
    ],
    atk_scale_ulti_lance_back: 1,
    poise: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    poise_lance: 0,
    potential_2: 0,
    pulse_vul_duration: 0,
    pulse_vul_rate: 0,
    radius: 5,
    talent0_usp: 0,
    lance_duration_ult: 30,
    pulse_resist_down_duration: [5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8],
    pulse_resist_down_rate: [
      0.300000011920929, 0.319999992847443, 0.319999992847443, 0.319999992847443, 0.319999992847443,
      0.340000003576279, 0.340000003576279, 0.340000003576279, 0.340000003576279, 0.360000014305115,
      0.379999995231628, 0.400000005960464,
    ],
  },
);

export default {
  slug: 'avywenna',
  gameId: 'AVYWENNA',
  rarity: 5,
  weaponType: 'polearm',
  element: 'electric',
  role: 'striker',
  mainAttribute: 'will',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [12, 33, 54, 75, 96, 107],
    agility: [10, 31, 52, 74, 95, 106],
    intellect: [14, 34, 56, 78, 99, 110],
    will: [15, 43, 73, 103, 133, 148],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        avywennaBasicAttack1,
        avywennaBasicAttack2,
        avywennaBasicAttack3,
        avywennaBasicAttack4,
        avywennaBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: avywennaFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: avywennaPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: avywennaBattleSkill,
    },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: avywennaComboSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: avywennaUltimate },
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
  comboSkillConditions: [
    {
      key: 'native-combo:0',
      skillKey: 'comboSkill',
      event: 'beforeOutputDamage',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          { kind: 'eventDamageTagsMatch', match: 'hasAll', tags: ['normalAttackLastCombo'] },
          sequence(
            branch(
              {
                kind: 'contextTargetIdentityMatch',
                contextKey: 'trigger',
                other: 'controlledOperator',
                operator: 'equal',
              },
              sequence(
                branch(
                  {
                    kind: 'entityTagMatch',
                    target: 'actionInputTarget',
                    tagQueryType: 'hasAny',
                    tags: [
                      'Skill/Character/Common/SpellStatus/Conduct',
                      'Skill/Character/Common/SpellInflict/PulseInflict',
                    ],
                  },
                  sequence(
                    branch(
                      { kind: 'actionInputTargetObjectTypeMatch', objectTypeMask: 16 },
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
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent0_usp',
          operation: 'assign',
          value: [3, 4],
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0012_avywen_talent_0',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
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
          blackboardKey: 'pulse_vul_rate',
          operation: 'assign',
          value: [0.0599999986588955, 0.100000001490116],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'pulse_vul_duration',
          operation: 'assign',
          value: [10, 10],
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
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent0_usp',
          operation: 'add',
          value: 2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 20,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['will'], value: 15 },
        { kind: 'addStaticDamageIncrease', target: 'electric', value: 0.08 },
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
          blackboardKey: 'potential_5_rate',
          operation: 'assign',
          value: 1.14999997615814,
        },
      ],
    },
  ],
  buffDefinitions: {
    buff_chr_0012_avywen_lance_becalled: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0012_avywen_lance_pulse_check: {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.300000011920929,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0012_avywen_lance_pulse_check'],
              operator: 'lessOrEqual',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyElementalInfliction', {
                element: 'electric',
                isExtra: false,
                target: 'buffOwner',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0012_avywen_talent_0: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
    },
    buff_chr_0012_avywen_ultimate_skill_debuff: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'pulse_vul_duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { pulse_vul_duration: 10, pulse_vul_rate: 0.3 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_pulse',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'pulse_vul_duration' },
              rate: { kind: 'blackboard', key: 'pulse_vul_rate' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0012_avywen_combo_skill_lance: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'SelectCategory/ProjectilePassThru',
        'Skill/Character/chr_0012_avywen/Lance/ComboLance',
      ],
      lifetime: { kind: 'limited', durationSeconds: 62 },
      childSkill: {
        skillId: 'chr_0012_avywen_combo_skill_lance',
        blackboard: { atk_scale_lance: 1, poise_lance: 0, potential_2: 0, talent_atb_gain: 0 },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 1500,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0012_avywen_lance_becalled'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(1500, sequence(step('finishActionOwnerAbilityEntity', {})), 1501),
          scheduled(
            900,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_2' },
                  operator: 'less',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(step('finishActionOwnerAbilityEntity', {})),
              ),
            ),
            901,
          ),
          scheduled(1500, sequence(step('finishActionOwnerAbilityEntity', {})), 1501),
        ],
      },
    },
    abilityentity_chr_0012_avywen_ultimate_skill_lance: {
      bornTags: [
        'Immune/Damage',
        'SelectCategory/Unmarkable',
        'SelectCategory/UnSkillManualSelectable',
        'SelectCategory/UnSkillAutoSelectable',
        'Category/EnergyShard/Pulse',
        'Immune/Stunned',
        'Immune/Frozen',
        'Immune/Airborne',
        'Immune/KnockDown',
        'Immune/KnockBack',
        'Immune/Pull',
        'Immune/PowerSmash',
        'Immune/Poise',
        'Skill/Character/chr_0012_avywen/Lance/UltiLance',
      ],
      lifetime: { kind: 'limited', durationSeconds: 62 },
      childSkill: {
        skillId: 'chr_0012_avywen_ultimate_skill_lance',
        blackboard: {
          atk_scale_lance_ult: 1,
          poise_lance_ult: 0,
          potential_2: 0,
          talent_atb_gain_ulti: 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 1500,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0012_avywen_lance_becalled'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(1500, sequence(step('finishActionOwnerAbilityEntity', {})), 1501),
          scheduled(
            900,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_2' },
                  operator: 'less',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(step('finishActionOwnerAbilityEntity', {})),
              ),
            ),
            901,
          ),
          scheduled(1500, sequence(step('finishActionOwnerAbilityEntity', {})), 1501),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
