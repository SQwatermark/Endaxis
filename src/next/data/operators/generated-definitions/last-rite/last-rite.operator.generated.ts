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
  withActionBlackboardScope,
  withSkillBlackboard,
} from '../../definitionHelpers';

export const lastRiteBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0026_lastrite_attack1',
    timelineBlockFrames: 20,
    naturalDurationFrames: 171,
    exclusiveFrame: 25,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 35,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0026_lastrite_attack2',
        },
      ],
      allowedNextSkills: [
        { startFrame: 20, endFrame: 35, sourceSkillIds: ['chr_0026_lastrite_attack2'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0026_lastrite_attack1:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
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
      0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885, 0.419999986886978,
      0.449999988079071, 0.479999989271164, 0.509999990463257, 0.540000021457672, 0.579999983310699,
      0.620000004768372, 0.680000007152557,
    ],
    env_dmg: 20,
  },
);

export const lastRiteBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0026_lastrite_attack2',
    timelineBlockFrames: 29,
    naturalDurationFrames: 175,
    exclusiveFrame: 34,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 44,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0026_lastrite_attack3',
        },
      ],
      allowedNextSkills: [
        { startFrame: 29, endFrame: 44, sourceSkillIds: ['chr_0026_lastrite_attack3'] },
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
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0026_lastrite_attack2:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0670000016689301 },
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
        11,
      ),
      scheduled(
        24,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0026_lastrite_attack2:/scheduledSequences/1/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.0670000016689301 },
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
    atb: 0,
    atk_scale: [
      0.280000001192093, 0.300000011920929, 0.330000013113022, 0.360000014305115, 0.389999985694885,
      0.409999996423721, 0.439999997615814, 0.469999998807907, 0.5, 0.529999971389771,
      0.569999992847443, 0.620000004768372,
    ],
    env_dmg: 12.5,
    display_atk_scale: [
      0.550000011920929, 0.610000014305115, 0.660000026226044, 0.720000028610229, 0.769999980926514,
      0.829999983310699, 0.879999995231628, 0.939999997615814, 0.990000009536743, 1.05999994277954,
      1.13999998569489, 1.24000000953674,
    ],
  },
);

export const lastRiteBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0026_lastrite_attack3',
    timelineBlockFrames: 36,
    naturalDurationFrames: 230,
    exclusiveFrame: 47,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 48,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0026_lastrite_attack4',
        },
      ],
      allowedNextSkills: [
        { startFrame: 36, endFrame: 48, sourceSkillIds: ['chr_0026_lastrite_attack4'] },
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
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0026_lastrite_attack3:/scheduledSequences/0/sequence/steps/0',
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.100000001490116 },
                slot: 'TimeDilation/Layer/Entity/HitStop',
                priority: 10,
                curve: { kind: 'named', key: 'char_hard_stop' },
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
        10,
      ),
      scheduled(
        27,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack'],
            },
            'chr_0026_lastrite_attack3:/scheduledSequences/1/sequence/steps/0',
          ),
        ),
        28,
      ),
      scheduled(
        26,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
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
                      value: 0.300000011920929,
                      inTangent: 0.190734192728996,
                      outTangent: 0.190734192728996,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.5,
                      value: 0.0299999993294477,
                      inTangent: 0.00859098788350821,
                      outTangent: 0.280000001192093,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.75,
                      value: 0.100000001490116,
                      inTangent: 0.417890787124634,
                      outTangent: 0.44814470410347,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0.5,
                      inTangent: 3.01925206184387,
                      outTangent: 3.01925206184387,
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
        28,
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
    env_dmg: 10,
    display_atk_scale: [
      0.680000007152557, 0.75, 0.819999992847443, 0.879999995231628, 0.949999988079071,
      1.01999998092651, 1.0900000333786, 1.1599999666214, 1.22000002861023, 1.30999994277954,
      1.4099999666214, 1.52999997138977,
    ],
  },
);

export const lastRiteBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0026_lastrite_attack4',
    timelineBlockFrames: 46,
    naturalDurationFrames: 182,
    exclusiveFrame: 54,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 0,
          endFrame: 54,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0026_lastrite_attack1',
        },
      ],
      allowedNextSkills: [
        { startFrame: 46, endFrame: 54, sourceSkillIds: ['chr_0026_lastrite_attack1'] },
      ],
    },
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                { kind: 'casterControlled' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'isBuffed',
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
        17,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                { kind: 'casterControlled' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'isBuffed',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        18,
      ),
      scheduled(
        21,
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
            'chr_0026_lastrite_attack4:/scheduledSequences/2/sequence/steps/0',
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
        22,
      ),
      scheduled(
        22,
        sequence(
          branch(
            { kind: 'casterControlled' },
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
                      value: 0.300000011920929,
                      inTangent: -0.956214010715485,
                      outTangent: -0.956214010715485,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 0.193415403366089,
                      value: 0.115053497254848,
                      inTangent: -0.549428403377533,
                      outTangent: -0.549428403377533,
                      weightedMode: 0,
                      inWeight: 0,
                      outWeight: 0,
                    },
                    {
                      time: 1,
                      value: 0,
                      inTangent: -0.142642796039581,
                      outTangent: -0.142642796039581,
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
        23,
      ),
    ],
    skillType: 'basicAttack',
    levelSource: 'basicAttack',
    nativeSkillType: 'attack',
  },
  {
    atb: 30,
    atk_scale: [
      0.899999976158142, 0.990000009536743, 1.08000004291534, 1.16999995708466, 1.25999999046326,
      1.35000002384186, 1.44000005722046, 1.52999997138977, 1.62000000476837, 1.73000001907349,
      1.87000000476837, 2.02999997138977,
    ],
    atk_scale2: 0.2,
    env_dmg: 35,
    isBuffed: 0,
    poise: 25,
  },
);

export const lastRiteFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0026_lastrite_power_attack',
    timelineBlockFrames: 40,
    naturalDurationFrames: 176,
    exclusiveFrame: 58,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 40,
          endFrame: 58,
          sourceSkillIds: ['chr_0026_lastrite_normal_skill', 'chr_0026_lastrite_combo_skill'],
        },
      ],
    },
    costFrame: 4,
    scheduledSequences: [
      scheduled(
        41,
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
        42,
      ),
      scheduled(
        40,
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
            'chr_0026_lastrite_power_attack:/scheduledSequences/1/sequence/steps/0',
          ),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
        40,
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
        58,
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

export const lastRitePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0026_lastrite_plunging_attack_end',
    timelineBlockFrames: 21,
    naturalDurationFrames: 133,
    exclusiveFrame: 20,
    costFrame: 9,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['normalAttack', 'plungingAttack'],
            },
            'chr_0026_lastrite_plunging_attack_end:/scheduledSequences/0/sequence/steps/0',
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
    env_dmg: 20,
  },
);

export const lastRiteBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0026_lastrite_normal_skill',
    timelineBlockFrames: 34,
    naturalDurationFrames: 429,
    exclusiveFrame: 373,
    inputWindows: {
      allowedNextSkills: [
        {
          startFrame: 34,
          endFrame: 51,
          sourceSkillIds: [
            'chr_0026_lastrite_attack1',
            'chr_0026_lastrite_attack2',
            'chr_0026_lastrite_attack3',
            'chr_0026_lastrite_attack4',
          ],
        },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atkscale1',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atkscale2',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'EntityBB_ns_atb',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atb' },
          }),
        ),
        1,
      ),
      scheduled(
        0,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 300,
            condition: { kind: 'not', condition: { kind: 'casterControlled' } },
          }),
        ),
        2,
      ),
      scheduled(187, sequence(step('jumpTimeline', { destinationFrame: 429 })), 188),
      scheduled(
        300,
        sequence(
          step('findCharacterTeamTargets', {
            saveToContextKey: 'mainchar',
            selection: { kind: 'controlledOperator' },
          }),
        ),
        301,
      ),
      scheduled(
        6,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_normal_skill_main_start',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              duration: { kind: 'blackboard', key: 'duration' },
              atb: { kind: 'blackboard', key: 'atb' },
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              potential_1: { kind: 'blackboard', key: 'potential_1' },
              usp: { kind: 'blackboard', key: 'usp' },
            },
          }),
        ),
        7,
      ),
      scheduled(
        300,
        sequence(
          withActionBlackboardScope(
            'SkillData.chr_0026_lastrite_normal_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:projectile_chr_0026_lastrite_normal_skill',
            {},
            true,
            sequence(
              withActionBlackboardScope(
                'SkillData.chr_0026_lastrite_normal_skill.actionGroupData.timelineActions[14]._sequenceActionData.actionData[0]:chr_0026_lastrite_normal_skill_projhit',
                { atk_scale: 0, duration: 0 },
                true,
                sequence(),
                undefined,
                { lifetime: 'execution', alwaysNext: true },
              ),
            ),
            undefined,
            { lifetime: 'execution' },
          ),
        ),
        301,
      ),
      scheduled(
        300,
        sequence(
          step('finishBuffsById', {
            target: 'party',
            buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_normal_skill_self',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              duration: { kind: 'blackboard', key: 'duration' },
              atb: { kind: 'blackboard', key: 'atb' },
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              potential_1: { kind: 'blackboard', key: 'potential_1' },
              poise: { kind: 'blackboard', key: 'poise' },
            },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'constant', value: 1 },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'constant', value: 1 },
                recipient: 'caster',
                ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
              }),
            ),
          ),
        ),
        301,
      ),
    ],
    switchToBuffCast: {
      currentSkillTypes: ['basicAttack'],
      requiresCurrentSkillNotInterruptible: true,
      condition: { kind: 'casterControlled' },
      asSkillCast: true,
      sequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0026_lastrite_normal_skill_inattack',
          target: 'caster',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            atk_scale: { kind: 'blackboard', key: 'atk_scale' },
            duration: { kind: 'blackboard', key: 'duration' },
            atb: { kind: 'blackboard', key: 'atb' },
            atk_up: { kind: 'blackboard', key: 'atk_up' },
            poise: { kind: 'blackboard', key: 'poise' },
            potential_1: { kind: 'blackboard', key: 'potential_1' },
            usp: { kind: 'blackboard', key: 'usp' },
          },
        }),
      ),
    },
    costs: [{ resource: 'sp', value: 100 }],
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    nativeSkillType: 'normalSkill',
  },
  {
    atb: 30,
    atk_scale: [
      1.41999995708466, 1.55999994277954, 1.71000003814697, 1.85000002384186, 1.99000000953674,
      2.13000011444092, 2.27999997138977, 2.42000007629395, 2.55999994277954, 2.74000000953674,
      2.95000004768372, 3.20000004768372,
    ],
    atk_scale_2: 0,
    atk_up: 0.2,
    cam_angle: 0,
    cam_duration: 0,
    consume_cnt: 0,
    duration: 15,
    gained_atb: 0,
    input_angle: 0,
    poise: 5,
    potential_1: 0,
    select_radius: 10,
    usp: 16,
  },
);

export const lastRiteUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0026_lastrite_ultimate_skill',
    timelineBlockFrames: 140,
    naturalDurationFrames: 360,
    exclusiveFrame: 170,
    inputWindows: {
      commandMappings: [
        {
          startFrame: 86,
          endFrame: 170,
          input: 'basicAttack',
          targetSourceSkillId: 'chr_0026_lastrite_combo_skill',
        },
      ],
      allowedNextSkills: [
        {
          startFrame: 140,
          endFrame: 170,
          sourceSkillIds: ['chr_0026_lastrite_normal_skill', 'chr_0026_lastrite_combo_skill'],
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
            saveToContextKey: 'mainchr',
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
        85,
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
        172,
      ),
      scheduled(
        86,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_2' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      instantAttributeModifiers: [
                        {
                          targetSide: 'defender',
                          attribute: 'cryoVulnerabilityIncrease',
                          slot: 'baseFinalMultiplier',
                          value: { kind: 'blackboard', key: 'rate' },
                          attributeTiming: 'runtime',
                        },
                      ],
                      stagger: { kind: 'blackboard', key: 'poise1' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/4/sequence/steps/0/body/steps/0/whenTrue/steps/0',
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise1' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/4/sequence/steps/0/body/steps/0/whenFalse/steps/0',
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
        89,
      ),
      scheduled(
        105,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_2' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      instantAttributeModifiers: [
                        {
                          targetSide: 'defender',
                          attribute: 'cryoVulnerabilityIncrease',
                          slot: 'baseFinalMultiplier',
                          value: { kind: 'blackboard', key: 'rate' },
                          attributeTiming: 'runtime',
                        },
                      ],
                      stagger: { kind: 'blackboard', key: 'poise1' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/5/sequence/steps/0/body/steps/0/whenTrue/steps/0',
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise1' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/5/sequence/steps/0/body/steps/0/whenFalse/steps/0',
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
        108,
      ),
      scheduled(
        134,
        sequence(
          repeatEachTick(
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_2' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      instantAttributeModifiers: [
                        {
                          targetSide: 'defender',
                          attribute: 'cryoVulnerabilityIncrease',
                          slot: 'baseFinalMultiplier',
                          value: { kind: 'blackboard', key: 'rate' },
                          attributeTiming: 'runtime',
                        },
                      ],
                      stagger: { kind: 'blackboard', key: 'poise2' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/6/sequence/steps/0/body/steps/0/whenTrue/steps/0',
                  ),
                ),
                sequence(
                  step(
                    'dealDamage',
                    {
                      damageType: 'cryo',
                      attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                      tags: ['ultimateSkill'],
                      features: ['canBreakWeakness'],
                      stagger: { kind: 'blackboard', key: 'poise2' },
                    },
                    'chr_0026_lastrite_ultimate_skill:/scheduledSequences/6/sequence/steps/0/body/steps/0/whenFalse/steps/0',
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
        137,
      ),
      scheduled(
        86,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.100000001490116 },
            slot: 'unassigned',
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        86,
      ),
      scheduled(
        85,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 2 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 50,
            curve: { kind: 'named', key: 'RESETto1' },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        145,
      ),
    ],
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 240 }],
    skillType: 'ultimate',
    levelSource: 'ultimate',
    nativeSkillType: 'ultimateSkill',
  },
  {
    atk_scale: [
      1.77999997138977, 1.96000003814697, 2.13000011444092, 2.30999994277954, 2.49000000953674,
      2.67000007629395, 2.83999991416931, 3.01999998092651, 3.20000004768372, 3.42000007629395,
      3.69000005722046, 4,
    ],
    atk_scale2: [
      3.55999994277954, 3.91000008583069, 4.26999998092651, 4.61999988555908, 4.98000001907349,
      5.32999992370605, 5.69000005722046, 6.03999996185303, 6.40000009536743, 6.84000015258789,
      7.38000011444092, 8,
    ],
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise1: 5,
    poise2: 10,
    rate: 0,
    talent_2: 0,
    usp: 10,
  },
);

export const lastRiteComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0026_lastrite_combo_skill',
    timelineBlockFrames: 65,
    naturalDurationFrames: 216,
    exclusiveFrame: 90,
    inputWindows: {
      allowedNextSkills: [
        { startFrame: 65, endFrame: 91, sourceSkillIds: ['chr_0026_lastrite_normal_skill'] },
      ],
    },
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('readBuffStackCount', {
            target: 'enemy',
            outputKey: 'infliction_num',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
            },
          }),
          step(
            'dealDamage',
            {
              damageType: 'cryo',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
            },
            'chr_0026_lastrite_combo_skill:/scheduledSequences/0/sequence/steps/1',
          ),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_base' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'caster',
            ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
          }),
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'current',
              operator: 'lessOrEqual',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                coefficient: { kind: 'blackboard', key: 'infliction_num' },
                recipient: 'caster',
                ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
              }),
              step('modifyActionValue', {
                key: 'recover_usp',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        13,
      ),
      scheduled(
        63,
        sequence(
          forEachTarget(
            'enemy',
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'infliction_num',
                query: {
                  kind: 'tag',
                  tagQueryType: 'hasAny',
                  buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                },
              }),
              step('calculateActionValue', {
                key: 'final_combo_atkscale',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale3' },
                right: { kind: 'blackboard', key: 'infliction_num' },
              }),
              step('modifyActionValue', {
                key: 'infliction_num_total',
                operation: 'add',
                value: { kind: 'blackboard', key: 'infliction_num' },
              }),
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'final_combo_atkscale' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                },
                'chr_0026_lastrite_combo_skill:/scheduledSequences/1/sequence/steps/0/body/steps/3',
              ),
              step(
                'dealDamage',
                {
                  damageType: 'cryo',
                  attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise' },
                },
                'chr_0026_lastrite_combo_skill:/scheduledSequences/1/sequence/steps/0/body/steps/4',
              ),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellInflict/CrystInflict'],
                reason: 'early',
              }),
            ),
          ),
        ),
        63,
      ),
      scheduled(
        2,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_combo_skill_hitstop',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        3,
      ),
      scheduled(
        63,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'recover_usp' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'infliction_num_total' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 4 },
                    recipient: 'caster',
                    ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
                  }),
                ),
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'blackboard', key: 'infliction_num_total' },
                    recipient: 'caster',
                    ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        63,
      ),
      scheduled(
        64,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.333000004291534 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
            priority: 10,
            curve: { kind: 'named', key: 'char_hard_stop' },
            finishByAction: false,
            targets: ['enemy', 'caster'],
          }),
        ),
        64,
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
    cooldownFrames: [270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 240],
    skillType: 'comboSkill',
    levelSource: 'comboSkill',
    nativeSkillType: 'comboSkill',
  },
  {
    atb: 0,
    atk_scale: [
      0.709999978542328, 0.779999971389771, 0.850000023841858, 0.920000016689301, 0.990000009536743,
      1.07000005245209, 1.13999998569489, 1.21000003814697, 1.27999997138977, 1.37000000476837,
      1.47000002861023, 1.60000002384186,
    ],
    atk_scale2: [
      0.709999978542328, 0.779999971389771, 0.850000023841858, 0.920000016689301, 0.990000009536743,
      1.07000005245209, 1.13999998569489, 1.21000003814697, 1.27999997138977, 1.37000000476837,
      1.47000002861023, 1.60000002384186,
    ],
    atk_scale3: [
      1.07000005245209, 1.16999995708466, 1.27999997138977, 1.38999998569489, 1.49000000953674,
      1.60000002384186, 1.71000003814697, 1.80999994277954, 1.91999995708466, 2.04999995231628,
      2.21000003814697, 2.40000009536743,
    ],
    cam_angle: 0,
    cam_duration: 0,
    count: 3,
    duration: 5,
    final_combo_atkscale: 0,
    infliction_num: 0,
    infliction_num_total: 0,
    input_angle: 0,
    owner_mainchar_alpha: 0,
    owner_mainchar_distance: 0,
    poise: 15,
    recover_usp: 0,
    select_radius: 4,
    usp: 15,
    usp_base: 40,
  },
);

export default {
  slug: 'last-rite',
  gameId: 'LASTRITE',
  rarity: 6,
  weaponType: 'greatsword',
  element: 'cryo',
  role: 'striker',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [21, 50, 80, 110, 140, 155],
    agility: [8, 29, 50, 72, 93, 104],
    intellect: [9, 27, 46, 65, 84, 93],
    will: [15, 35, 56, 77, 98, 109],
    baseAttack: [30, 95, 162, 230, 298, 332],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    {
      key: 'basicAttack',
      skillType: 'basicAttack',
      levelSource: 'basicAttack',
      skills: [
        lastRiteBasicAttack1,
        lastRiteBasicAttack2,
        lastRiteBasicAttack3,
        lastRiteBasicAttack4,
      ],
    },
    {
      key: 'finisher',
      skillType: 'finisher',
      levelSource: 'basicAttack',
      skills: lastRiteFinisher,
    },
    {
      key: 'plungingAttack',
      skillType: 'plungingAttack',
      levelSource: 'basicAttack',
      skills: lastRitePlungingAttack,
    },
    {
      key: 'battleSkill',
      skillType: 'battleSkill',
      levelSource: 'battleSkill',
      skills: lastRiteBattleSkill,
    },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: lastRiteUltimate },
    {
      key: 'comboSkill',
      skillType: 'comboSkill',
      levelSource: 'comboSkill',
      skills: lastRiteComboSkill,
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
      event: 'beforeTakeInfliction',
      immediately: false,
      initialValues: null,
      sequence: sequence(
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
                value: { kind: 'constant', value: 2 },
              },
              sequence(),
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0026_lastrite_talent_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            crystal_up: [0.0199999995529652, 0.0399999991059303],
            duration: { kind: 'constant', value: 15 },
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_2',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'rate',
          operation: 'assign',
          value: [1.20000004768372, 1.5],
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
          operation: 'assign',
          value: 0.200000002980232,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'poise',
          operation: 'assign',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        { kind: 'addBuildAttribute', attributes: ['strength'], value: 20 },
        { kind: 'addStaticDamageIncrease', target: 'cryo', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale3',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.14999997615814,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale2',
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
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.20000004768372,
        },
      ],
    },
  ],
  entityBlackboard: { EntityBB_ns_atb: 0, EntityBB_ns_atkscale1: 0, EntityBB_ns_atkscale2: 0 },
  buffDefinitions: {
    buff_chr_0026_lastrite_combo_skill_hitstop: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      applyTags: [],
      extendTags: [],
      blackboard: {},
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: -1 },
            slot: 'TimeDilation/Layer/Entity/HitStop',
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
                  outWeight: 0,
                },
                {
                  time: 1,
                  value: 0,
                  inTangent: 0,
                  outTangent: 0,
                  weightedMode: 0,
                  inWeight: 0,
                  outWeight: 0,
                },
              ],
            },
            finishByAction: true,
            targets: ['enemy'],
          }),
        ),
      },
    },
    buff_chr_0026_lastrite_normal_skill: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      presentation: {
        visible: true,
        iconId: 'icon_battle_lastrite_buff',
        iconPath: '/icons/icon_battle_lastrite_buff.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showDirectlyInHeadBuff: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: true,
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
      blackboard: { atb: 30, atk_scale: 3, atk_up: 0, duration: 15, poise: 0, potential_1: 0 },
      attributeModifiers: [],
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              { kind: 'casterControlled' },
              { kind: 'eventDamageTagsMatch', match: 'hasAny', tags: ['normalAttackLastCombo'] },
              {
                kind: 'buffBlackboardCompare',
                left: { blackboardKey: 'potential_1' },
                operator: 'equal',
                right: 1,
              },
            ],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'attacker',
              zone: 'normal',
              addition: { blackboardKey: 'atk_up' },
            },
          ],
        },
      ],
      abilityEventResponses: [
        {
          event: 'beforeOutputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'healthCompare',
                target: 'enemy',
                valueType: 'current',
                operator: 'greater',
                value: { kind: 'constant', value: 0 },
              },
              sequence(
                branch(
                  {
                    kind: 'eventDamageTagsMatch',
                    match: 'hasAny',
                    tags: ['normalAttackLastCombo'],
                  },
                  sequence(
                    branch(
                      { kind: 'casterControlled' },
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'potential_1' },
                            operator: 'equal',
                            right: { kind: 'constant', value: 1 },
                          },
                          sequence(
                            step('dealStagger', { value: { kind: 'blackboard', key: 'poise' } }),
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
          event: 'beforeOutputDamage',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'healthCompare',
                target: 'enemy',
                valueType: 'current',
                operator: 'greater',
                value: { kind: 'constant', value: 0 },
              },
              sequence(
                branch(
                  {
                    kind: 'not',
                    condition: {
                      kind: 'timedMarkerPresent',
                      target: 'buffOwner',
                      markerId: 'buff_chr_0026_lastrite_normal_skill_marker',
                    },
                  },
                  sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAny',
                        tags: ['normalAttackLastCombo'],
                      },
                      sequence(
                        branch(
                          { kind: 'casterControlled' },
                          sequence(
                            branch(
                              {
                                kind: 'entityTagMatch',
                                target: 'buffOwner',
                                tagQueryType: 'hasAny',
                                tags: ['Skill/Character/chr_0026_lastrite'],
                              },
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0026_lastrite_normal_skill_phantom_main',
                                  target: 'enemy',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    atk_scale1: { kind: 'blackboard', key: 'atk_scale' },
                                  },
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                  target: 'buffSource',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              sequence(
                                step('applyBuff', {
                                  buffId: 'buff_chr_0026_lastrite_normal_skill_phantom',
                                  target: 'enemy',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                                  },
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_chr_0026_lastrite_normal_skill_tag',
                                  target: 'buffSource',
                                  source: 'buffSource',
                                  inheritSourceSkillCastInfo: true,
                                }),
                              ),
                              { alwaysNext: true },
                            ),
                            step('createTimedMarker', {
                              target: 'buffOwner',
                              markerId: 'buff_chr_0026_lastrite_normal_skill_marker',
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
            ),
          ),
        },
      ],
    },
    buff_chr_0026_lastrite_normal_skill_inattack: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      applyTags: ['Status/DisableNormalSkill'],
      extendTags: [],
      blackboard: {
        atb: 0,
        atk_scale: 0,
        atk_up: 0,
        duration: 0,
        poise: 0,
        potential_1: 0,
        usp: 0,
      },
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
              step('modifyActionValue', {
                key: 'atk_scale',
                operation: 'multiply',
                value: { kind: 'constant', value: 0.5 },
              }),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                reason: 'other',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0026_lastrite_normal_skill_self',
                target: 'buffSource',
                source: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                  duration: { kind: 'blackboard', key: 'duration' },
                  atb: { kind: 'blackboard', key: 'atb' },
                  atk_up: { kind: 'blackboard', key: 'atk_up' },
                  poise: { kind: 'blackboard', key: 'poise' },
                  potential_1: { kind: 'blackboard', key: 'potential_1' },
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'constant', value: 1 },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp' },
                    coefficient: { kind: 'constant', value: 1 },
                    recipient: 'caster',
                    ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
                  }),
                ),
              ),
            ),
          },
        ),
      },
    },
    buff_chr_0026_lastrite_normal_skill_main_start: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1.5,
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 0, atk_scale: 0, atk_up: 0, duration: 0, potential_1: 0, usp: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          26,
          sequence(
            step('finishBuffsById', {
              target: 'party',
              buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
              reason: 'other',
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0026_lastrite_normal_skill_self',
              target: 'buffSource',
              source: 'buffSource',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                atk_scale: { kind: 'blackboard', key: 'atk_scale' },
                duration: { kind: 'blackboard', key: 'duration' },
                atb: { kind: 'blackboard', key: 'atb' },
                atk_up: { kind: 'blackboard', key: 'atk_up' },
                potential_1: { kind: 'blackboard', key: 'potential_1' },
              },
            }),
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'constant', value: 1 },
                operator: 'equal',
                right: { kind: 'constant', value: 1 },
              },
              sequence(
                step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                step('changeResourceByActionValue', {
                  resource: 'ultimateEnergy',
                  amount: { kind: 'blackboard', key: 'usp' },
                  coefficient: { kind: 'constant', value: 1 },
                  recipient: 'caster',
                  ultimateRecoveryTag: 'Skill/Character/chr_0026_lastrite',
                }),
              ),
            ),
          ),
          27,
        ),
      ],
    },
    buff_chr_0026_lastrite_normal_skill_phantom: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: 3,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('findCharacterTeamTargets', {
              saveToContextKey: 'main',
              selection: { kind: 'controlledOperator' },
            }),
          ),
          1,
        ),
        scheduled(
          9,
          sequence(
            step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.200000002980232 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 10,
              curve: { kind: 'named', key: 'char_hard_stop' },
              finishByAction: false,
              targets: ['controlled'],
            }),
            step(
              'dealDamage',
              {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0026_lastrite_normal_skill_phantom:/scheduledSequences/1/sequence/steps/2',
            ),
          ),
          10,
        ),
        scheduled(
          9,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0026_lastrite_normal_skill_phantom:/scheduledSequences/2/sequence/steps/0',
            ),
          ),
          10,
        ),
      ],
    },
    buff_chr_0026_lastrite_normal_skill_phantom_main: {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: 3,
      applyTags: [],
      extendTags: [],
      blackboard: { atk_scale1: 0, atk_scale2: 0 },
      attributeModifiers: [],
      scheduledSequences: [
        scheduled(
          21,
          sequence(
            step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
            step('startTimeDilation', {
              scope: 'entity',
              durationSeconds: { kind: 'constant', value: 0.330000013113022 },
              slot: 'TimeDilation/Layer/Entity/HitStop',
              priority: 10,
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
                    value: 0,
                    inTangent: 0,
                    outTangent: 0,
                    weightedMode: 0,
                    inWeight: 0,
                    outWeight: 0,
                  },
                ],
              },
              finishByAction: false,
              targets: ['caster'],
            }),
            step(
              'dealDamage',
              {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0026_lastrite_normal_skill_phantom_main:/scheduledSequences/0/sequence/steps/2',
            ),
          ),
          22,
        ),
        scheduled(
          21,
          sequence(
            step(
              'dealDamage',
              {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
              },
              'buff_chr_0026_lastrite_normal_skill_phantom_main:/scheduledSequences/1/sequence/steps/0',
            ),
          ),
          22,
        ),
      ],
    },
    buff_chr_0026_lastrite_normal_skill_self: {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { atb: 0, atk_scale: 0, atk_up: 0, duration: 0, poise: 0, potential_1: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0026_lastrite_normal_skill',
            target: 'party',
            source: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'duration' },
              atk_scale: { kind: 'blackboard', key: 'atk_scale' },
              atb: { kind: 'blackboard', key: 'atb' },
              poise: { kind: 'blackboard', key: 'poise' },
              atk_up: { kind: 'blackboard', key: 'atk_up' },
              potential_1: { kind: 'blackboard', key: 'potential_1' },
            },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            coefficient: { kind: 'constant', value: 1 },
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'skill',
          }),
        ),
      },
    },
    buff_chr_0026_lastrite_normal_skill_tag: {
      stackingType: 'stack',
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
              {
                kind: 'buffIdStackCompare',
                target: 'buffOwner',
                buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                operator: 'greaterOrEqual',
                value: { kind: 'constant', value: 1 },
              },
              sequence(
                step('finishBuffsById', {
                  target: 'party',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill'],
                  reason: 'other',
                }),
                step('finishBuffsById', {
                  target: 'buffOwner',
                  buffIds: ['buff_chr_0026_lastrite_normal_skill_tag'],
                  reason: 'other',
                }),
              ),
            ),
          ),
        },
      ],
    },
    buff_chr_0026_lastrite_talent_1: {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      applyTags: [],
      extendTags: [],
      blackboard: { crystal_up: 0, crystal_vul: 0, duration: 0, infliction_num: 0 },
      attributeModifiers: [],
      abilityEventResponses: [
        {
          event: 'buffConsumed',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'eventBuffTagsMatch',
                match: 'hasAny',
                buffTags: ['Skill/Character/Common/SpellInflict'],
              },
              sequence(
                branch(
                  {
                    kind: 'eventConsumedBuffLayerCompare',
                    operator: 'greaterOrEqual',
                    value: { kind: 'constant', value: 1 },
                    outputKey: 'infliction_num',
                  },
                  sequence(
                    step('calculateActionValue', {
                      key: 'crystal_vul',
                      operation: 'multiply',
                      left: { kind: 'blackboard', key: 'infliction_num' },
                      right: { kind: 'blackboard', key: 'crystal_up' },
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0026_lastrite_talent_1_vul',
                      target: 'eventTarget',
                      source: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        crystal_vul: { kind: 'blackboard', key: 'crystal_vul' },
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
    },
    buff_chr_0026_lastrite_talent_1_vul: {
      stackingType: 'highPriority',
      priority: 10,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: [],
      extendTags: [],
      blackboard: { crystal_vul: 0, duration: 0, real_duration: 0 },
      attributeModifiers: [],
      lifecycleSequences: {
        enable: sequence(
          step('readCurrentBuffRemainingDuration', { outputKey: 'real_duration' }),
          step('applyBuff', {
            buffId: 'buff_common_affixes_vulnerable_crystal',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            asChildBuff: true,
            finishByAction: true,
            blackboardAssignments: {
              duration: { kind: 'blackboard', key: 'real_duration' },
              rate: { kind: 'blackboard', key: 'crystal_vul' },
            },
          }),
        ),
      },
    },
  },
  abilityEntityDefinitions: {},
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
} as const satisfies OperatorDefinition;
