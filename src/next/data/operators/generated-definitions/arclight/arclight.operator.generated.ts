/** 由 tools/game-data-compiler 整名生成；不要手工编辑。 */
import type {
  OperatorDefinition,
  SkillDefinition,
} from '../../../../core/game-data/operatorDefinition';
import {
  branch,
  forEachTarget,
  repeatEachTick,
  scheduled,
  sequence,
  step,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const arclightBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0007_ikut_attack1',
    timelineBlockFrames: 9,
    naturalDurationFrames: 64,
    exclusiveFrame: 21,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 26,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0007_ikut_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 9, endFrame: 26, sourceSkillIds: ['chr_0007_ikut_attack2'] },
      ],
    },
    costFrame: 9,
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
            'chr_0007_ikut_attack1:/scheduledSequences/0/sequence/steps/0',
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
  },
);

export const arclightBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0007_ikut_attack2',
    timelineBlockFrames: 10,
    naturalDurationFrames: 74,
    exclusiveFrame: 15,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 26,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0007_ikut_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 10, endFrame: 26, sourceSkillIds: ['chr_0007_ikut_attack3'] },
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
            'chr_0007_ikut_attack2:/scheduledSequences/0/sequence/steps/0',
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
  },
);

export const arclightBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0007_ikut_attack3',
    timelineBlockFrames: 20,
    naturalDurationFrames: 71,
    exclusiveFrame: 33,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 30,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0007_ikut_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 20, endFrame: 30, sourceSkillIds: ['chr_0007_ikut_attack4'] },
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
            'chr_0007_ikut_attack3:/scheduledSequences/0/sequence/steps/0',
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
        8,
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
            'chr_0007_ikut_attack3:/scheduledSequences/1/sequence/steps/0',
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
      0.129999995231628, 0.140000000596046, 0.159999996423721, 0.170000001788139, 0.180000007152557,
      0.200000002980232, 0.209999993443489, 0.219999998807907, 0.230000004172325, 0.25,
      0.270000010728836, 0.28999999165535,
    ],
    display_atk_scale: [
      0.259999990463257, 0.28999999165535, 0.310000002384186, 0.340000003576279, 0.360000014305115,
      0.389999985694885, 0.419999986886978, 0.439999997615814, 0.469999998807907, 0.5,
      0.540000021457672, 0.589999973773956,
    ],
  },
);

export const arclightBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0007_ikut_attack4',
    timelineBlockFrames: 27,
    naturalDurationFrames: 77,
    exclusiveFrame: 36,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0007_ikut_attack5',
        },
      ],
      allowedNextSkills: [
        { startFrame: 27, endFrame: 40, sourceSkillIds: ['chr_0007_ikut_attack5'] },
      ],
    },
    costFrame: 8,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          repeatEachTick(
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalAttack'],
                },
                'chr_0007_ikut_attack4:/scheduledSequences/0/sequence/steps/0/body/steps/0',
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
            {
              nativeChanneling: {
                executeEachFrame: true,
                triggerIntervalSeconds: 0.0329999998211861,
                maxCountPerTarget: 3,
                targetTriggerIntervalSeconds: 0.0329999998211861,
              },
            },
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
      0.119999997317791, 0.129999995231628, 0.140000000596046, 0.159999996423721, 0.170000001788139,
      0.180000007152557, 0.189999997615814, 0.200000002980232, 0.219999998807907, 0.230000004172325,
      0.25, 0.270000010728836,
    ],
    display_atk_scale: [
      0.360000014305115, 0.400000005960464, 0.430000007152557, 0.469999998807907, 0.5,
      0.540000021457672, 0.579999983310699, 0.610000014305115, 0.649999976158142, 0.689999997615814,
      0.75, 0.810000002384186,
    ],
  },
);

export const arclightBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0007_ikut_attack5',
    timelineBlockFrames: 27,
    naturalDurationFrames: 83,
    exclusiveFrame: 26,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 40,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0007_ikut_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 29, endFrame: 40, sourceSkillIds: ['chr_0007_ikut_attack1'] },
      ],
    },
    costFrame: 12,
    scheduledSequences: [
      scheduled(
        12,
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
            'chr_0007_ikut_attack5:/scheduledSequences/0/sequence/steps/0',
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
        13,
      ),
      scheduled(
        13,
        sequence(
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
    atb: 17,
    atk_scale: [
      0.479999989271164, 0.519999980926514, 0.569999992847443, 0.620000004768372, 0.670000016689301,
      0.709999978542328, 0.759999990463257, 0.810000002384186, 0.860000014305115, 0.910000026226044,
      0.990000009536743, 1.07000005245209,
    ],
    poise: 16,
  },
);

export const arclightFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0007_ikut_power_attack',
    timelineBlockFrames: 40,
    naturalDurationFrames: 131,
    exclusiveFrame: 68,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 40,
          endFrame: 68,
          sourceSkillIds: ['chr_0007_ikut_normal_skill', 'chr_0007_ikut_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.0500000007450581,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0007_ikut_power_attack:/scheduledSequences/0/sequence/steps/0',
          ),
        ),
        15,
      ),
      scheduled(
        23,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              calculation: 'breakingAttack',
              calculationMultiplier: 0.0500000007450581,
              tags: ['normalAttack', 'powerAttack'],
            },
            'chr_0007_ikut_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        23,
      ),
      scheduled(
        38,
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
            'chr_0007_ikut_power_attack:/scheduledSequences/2/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        38,
      ),
      scheduled(
        39,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.266699999570847 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_normal_attack' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        39,
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
        40,
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

export const arclightPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0007_ikut_plunging_attack_end',
    timelineBlockFrames: 26,
    naturalDurationFrames: 88,
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
            'chr_0007_ikut_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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

export const arclightBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0007_ikut_normal_skill',
    timelineBlockFrames: 36,
    naturalDurationFrames: 214,
    exclusiveFrame: 164,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 36, endFrame: 60, sourceSkillIds: ['chr_0007_ikut_normal_skill'] },
        { startFrame: 162, endFrame: 188, sourceSkillIds: ['chr_0007_ikut_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0007_ikut_normal_skill:/scheduledSequences/0/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0659999996423721 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        19,
      ),
      scheduled(
        24,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0007_ikut_normal_skill:/scheduledSequences/1/sequence/steps/0',
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
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
        24,
      ),
      scheduled(
        112,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0007_ikut_normal_skill:/scheduledSequences/2/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0659999996423721 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        112,
      ),
      scheduled(
        118,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise1' },
            },
            'chr_0007_ikut_normal_skill:/scheduledSequences/3/sequence/steps/0',
          ),
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.0659999996423721 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        118,
      ),
      scheduled(
        136,
        sequence(
          step('mergeContextTargets', { saveToContextKey: 'tar', sources: [] }),
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/SpellStatus/Conduct'],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0007_ikut_normal_skill_extra_count',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      pulse_up: { kind: 'blackboard', key: 'pulse_up' },
                      duration: { kind: 'blackboard', key: 'duration' },
                      count: { kind: 'blackboard', key: 'count' },
                    },
                  }),
                ),
                undefined,
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
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise2' },
                },
                'chr_0007_ikut_normal_skill:/scheduledSequences/4/sequence/steps/1/whenTrue/steps/2',
              ),
              step('modifyActionValue', {
                key: 'thirdhit',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
                reason: 'early',
              }),
            ),
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'physical',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise2' },
                },
                'chr_0007_ikut_normal_skill:/scheduledSequences/4/sequence/steps/1/whenFalse/steps/0',
              ),
              step('applyBuff', {
                buffId: 'buff_common_obtain_ultimate_sp',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
        136,
      ),
      scheduled(
        137,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'thirdhit' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
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
                      value: 0.200000002980232,
                      inTangent: -3.06344294548035,
                      outTangent: -3.06344294548035,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.0522437207400799,
                      value: 0.0399543382227421,
                      inTangent: -0.11065299808979,
                      outTangent: -0.11065299808979,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.425574988126755,
                      value: 0.0309634692966938,
                      inTangent: 0.0409982316195965,
                      outTangent: 0.0409982316195965,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.761559307575226,
                      value: 0.270949214696884,
                      inTangent: 0.944742619991302,
                      outTangent: 0.944742619991302,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.5,
                      inTangent: 0.772816181182861,
                      outTangent: 0.772816181182861,
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
        137,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tags: ['Skill/Character/Common/SpellStatus/Conduct'],
            },
            sequence(
              step('modifyActionValue', {
                key: 'SpawnThird',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        0,
      ),
      scheduled(
        4,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 96,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'SpawnThird' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
          }),
        ),
        5,
      ),
      scheduled(95, sequence(step('jumpTimeline', { destinationFrame: 204 })), 95),
    ],
    smartTarget: 'enemy',
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: [30, 30, 30, 30, 30, 35, 35, 35, 35, 35, 35, 40],
    atk_scale: [
      0.449999988079071, 0.5, 0.540000021457672, 0.589999973773956, 0.629999995231628,
      0.680000007152557, 0.720000028610229, 0.769999980926514, 0.810000002384186, 0.870000004768372,
      0.930000007152557, 1.00999999046326,
    ],
    atk_scale2: [
      1.79999995231628, 1.98000001907349, 2.16000008583069, 2.33999991416931, 2.51999998092651,
      2.70000004768372, 2.88000011444092, 3.05999994277954, 3.24000000953674, 3.47000002861023,
      3.74000000953674, 4.05000019073486,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration: 0,
    exist_p5: 0,
    input_angle: 0,
    poise1: 5,
    poise2: 5,
    pulse_up: 0,
    select_radius: 4,
    SpawnThird: 0,
    talent_1: 0,
    thirdhit: 0,
  },
);

export const arclightUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0007_ikut_ultimate_skill',
    timelineBlockFrames: 77,
    naturalDurationFrames: 141,
    exclusiveFrame: 85,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 77,
          endFrame: 89,
          sourceSkillIds: ['chr_0007_ikut_normal_skill', 'chr_0007_ikut_combo_skill'],
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
        85,
      ),
      scheduled(
        54,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0007_ikut_ultimate_skill',
            childSkillId: 'chr_0007_ikut_ultimate_skill_abentity',
            inheritActionBlackboard: true,
            inheritSourceSkillCastInfo: true,
            dieWhenSourceDies: false,
          }),
        ),
        55,
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
      1.55999994277954, 1.71000003814697, 1.87000000476837, 2.01999998092651, 2.1800000667572,
      2.33999991416931, 2.49000000953674, 2.65000009536743, 2.79999995231628, 3, 3.23000001907349,
      3.5,
    ],
    atk_scale2: [
      2.44000005722046, 2.69000005722046, 2.9300000667572, 3.1800000667572, 3.42000007629395,
      3.67000007629395, 3.91000008583069, 4.15000009536743, 4.40000009536743, 4.69999980926514,
      5.07000017166138, 5.5,
    ],
    isWall: 0,
    poise1: [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
    poise2: [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
    radius: 1,
  },
);

export const arclightComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0007_ikut_combo_skill',
    timelineBlockFrames: 27,
    naturalDurationFrames: 86,
    exclusiveFrame: 37,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 27, endFrame: 60, sourceSkillIds: ['chr_0007_ikut_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
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
            influenceSkillCooldownSeconds: { kind: 'constant', value: 0.400000005960464 },
          }),
        ),
        12,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0007_ikut_combo_skill_counts'],
            reason: 'other',
          }),
        ),
        3,
      ),
      scheduled(
        17,
        sequence(
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
            'chr_0007_ikut_combo_skill:/scheduledSequences/2/sequence/steps/1',
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
        17,
      ),
      scheduled(
        21,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0007_ikut_combo_skill:/scheduledSequences/3/sequence/steps/0',
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
        21,
      ),
      scheduled(
        25,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
            },
            'chr_0007_ikut_combo_skill:/scheduledSequences/4/sequence/steps/0',
          ),
        ),
        25,
      ),
    ],
    smartTarget: 'input',
    cooldownFrames: 90,
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: [8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10],
    atk_scale: [
      0.519999980926514, 0.569999992847443, 0.620000004768372, 0.670000016689301, 0.730000019073486,
      0.779999971389771, 0.829999983310699, 0.879999995231628, 0.930000007152557, 1,
      1.07000005245209, 1.16999995708466,
    ],
    atk_up: 0,
    cam_angle: 0,
    cam_duration: 0,
    count: 0,
    duration: 0,
    exist_p5: 0,
    exist_talent: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 5,
    usp: 5,
    display_atk_scale: [
      1.54999995231628, 1.71000003814697, 1.86000001430511, 2.01999998092651, 2.1800000667572,
      2.32999992370605, 2.49000000953674, 2.64000010490417, 2.79999995231628, 2.99000000953674,
      3.22000002861023, 3.5,
    ],
  },
);

export default {
  slug: 'arclight',
  gameId: 'ARCLIGHT',
  rarity: 5,
  weaponType: 'sword',
  element: 'electric',
  role: 'vanguard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [14, 33, 54, 75, 96, 107],
    agility: [14, 42, 71, 101, 130, 145],
    intellect: [12, 36, 61, 86, 111, 123],
    will: [10, 29, 49, 69, 89, 100],
    baseAttack: [30, 89, 151, 213, 275, 306],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        arclightBasicAttack1,
        arclightBasicAttack2,
        arclightBasicAttack3,
        arclightBasicAttack4,
        arclightBasicAttack5,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: arclightFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: arclightPlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: arclightBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: arclightUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: arclightComboSkill,
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
      event: 'outputBuff',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          },
          sequence(),
        ),
      ),
    },
    {
      key: 'native-combo:1',
      skillKey: 'comboSkill',
      event: 'buffEndsEarly',
      immediately: false,
      initialValues: null,
      sequence: sequence(
        branch(
          {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTags: ['Skill/Character/Common/SpellStatus/Conduct'],
          },
          sequence(),
        ),
      ),
    },
  ],
  comboSkillPriority: 'default',
  talents: [
    {
      key: 'electricDamageBonus',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration',
          operation: 'assign',
          value: [15, 15],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'pulse_up',
          operation: 'add',
          value: [0.000500000023748726, 0.0007999999797903],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'count',
          operation: 'assign',
          value: [3, 3],
        },
      ],
    },
    {
      key: 'electricAdditionalHit',
      levels: 2,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0007_ikut_talent_2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: { prob: [0.300000011920929, 0.5] },
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
          blackboardKey: 'atb',
          operation: 'add',
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['agility'], value: 15 },
        { kind: 'addBuildAttribute', attributes: ['intellect'], value: 15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'pulse_up',
          operation: 'multiply',
          value: 1.29999995231628,
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'count',
          operation: 'assign',
          value: 2,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0007_ikut_finish_count_p5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
  ],
  buffDefinitions: {
    buff_chr_0007_ikut_atk_buff_talent: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_pulse_dmg_up',
        iconPath: '/icons/icon_battle_pulse_dmg_up.webp',
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
      blackboard: { duration: 0, pulse_up: 0 },
      attributeModifiers: [
        {
          attribute: 'electricDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'pulse_up' },
        },
      ],
    },
    buff_chr_0007_ikut_finish_count_p5: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0007_ikut_normal_skill_extra_count'],
            reason: 'other',
          }),
        ),
      },
    },
    buff_chr_0007_ikut_normal_skill_extra_count: {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: 3,
      presentation: {
        visible: true,
        iconId: 'icon_battle_ikut_talent_1',
        iconPath: '/icons/icon_battle_ikut_talent_1.webp',
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
      blackboard: { count: 0, duration: 0, final_pulse_up: 0, pulse_up: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enhanceChanged: sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'buffOwner',
              buffIds: ['buff_chr_0007_ikut_normal_skill_extra_count'],
              operator: 'greaterOrEqual',
              value: { kind: 'blackboard', key: 'count' },
            },
            sequence(
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'intellect' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'blackboard', key: 'pulse_up' },
                base: { kind: 'constant', value: 0 },
                targetKey: 'final_pulse_up',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0007_ikut_atk_buff_talent',
                target: 'party',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  pulse_up: { kind: 'blackboard', key: 'final_pulse_up' },
                  duration: { kind: 'blackboard', key: 'duration' },
                },
              }),
              step('finishBuffsById', {
                target: 'buffOwner',
                buffIds: ['buff_chr_0007_ikut_normal_skill_extra_count'],
                reason: 'other',
              }),
            ),
          ),
        ),
      },
    },
    buff_chr_0007_ikut_talent_2: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { prob: 0.3 },
      attributeModifiers: [],
    },
    buff_chr_0007_ikut_talent_2_immune: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ['Immune/SpellInflictOnChar'],
      extendTags: [],
      blackboard: { duration: 9999 },
      attributeModifiers: [],
    },
  },
  abilityEntityDefinitions: {
    abilityentity_chr_0007_ikut_ultimate_skill: {
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
        skillId: 'chr_0007_ikut_ultimate_skill_abentity',
        blackboard: {
          atk_scale1: 0.2,
          atk_scale2: 0,
          count: 0,
          duration: 12,
          poise1: 0,
          poise2: 0,
        },
        scheduledSequences: [
          scheduled(
            7,
            sequence(
              step('applyElementalInfliction', { element: 'electric', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise1' },
                },
                'abilityentity_chr_0007_ikut_ultimate_skill:chr_0007_ikut_ultimate_skill_abentity:/childSkill/scheduledSequences/0/sequence/steps/1',
              ),
            ),
            8,
          ),
          scheduled(7, sequence(forEachTarget('enemy', sequence())), 8),
          scheduled(
            63,
            sequence(
              step(
                'dealDamage',
                {
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['ultimateSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise2' },
                },
                'abilityentity_chr_0007_ikut_ultimate_skill:chr_0007_ikut_ultimate_skill_abentity:/childSkill/scheduledSequences/2/sequence/steps/0',
              ),
            ),
            64,
          ),
          scheduled(
            63,
            sequence(
              forEachTarget(
                'enemy',
                sequence(
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'count',
                        query: {
                          kind: 'tag',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                        },
                      }),
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'blackboard', key: 'count' },
                        },
                        sequence(
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ['Skill/Character/Common/SpellInflict/PulseInflict'],
                            reason: 'early',
                            count: { kind: 'blackboard', key: 'count' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_common_pulse_pulse_conduct_triggered',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              consumed_type: { kind: 'constant', value: 1 },
                              consumed_layer: { kind: 'blackboard', key: 'count' },
                              count: { kind: 'blackboard', key: 'count' },
                            },
                          }),
                        ),
                      ),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
            64,
          ),
        ],
      },
    },
  },
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
