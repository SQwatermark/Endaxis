/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const arcaneComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0032_lizhiyan_combo_skill',
    timelineBlockFrames: 16,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
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
                right: { kind: 'constant', value: -0.633 },
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
                right: { kind: 'constant', value: -0.633 },
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
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.25 },
            slot: 1464849466,
            priority: 10,
            curve: { kind: 'inline', keys: [{ time: 0, value: 0.2, inTangent: -2.49458528, outTangent: -2.49458528, weightedMode: 0, inWeight: 0, outWeight: 0.5529954 }, { time: 0.1, value: 0.04, inTangent: -0.0350076854, outTangent: -0.0350076854, weightedMode: 0, inWeight: 0.333333343, outWeight: 1 }, { time: 0.198607326, value: 0.03944487, inTangent: 0.0413481556, outTangent: 0.0413481556, weightedMode: 0, inWeight: 0.845778465, outWeight: 0.333333343 }, { time: 1, value: 1, inTangent: 2, outTangent: 2, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
            finishByAction: false,
            targets: ['caster'],
            abilityEntityTargets: [{ kind: 'ownerSpawned', abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'] }],
          }),
        ),
        6,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.6 },
            slot: 0,
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
        9,
        sequence(
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true, overrideDurationSeconds: { kind: 'constant', value: 40 }, saveToContextKey: 'bunshin1', blackboardAssignments: { 'EntityBB_wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' } } }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true, overrideDurationSeconds: { kind: 'constant', value: 40 }, saveToContextKey: 'bunshin2', blackboardAssignments: { 'EntityBB_wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' } } }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true, overrideDurationSeconds: { kind: 'constant', value: 40 }, saveToContextKey: 'bunshin3', blackboardAssignments: { 'EntityBB_wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' } } }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true, overrideDurationSeconds: { kind: 'constant', value: 40 }, saveToContextKey: 'bunshin4', blackboardAssignments: { 'EntityBB_wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' } } }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.033 },
            slot: 0,
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
          forEachContextTarget(
            'bunshin1',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 0.5 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin2',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 0.5 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin3',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 0.5 } }),
            ),
          ),
          forEachContextTarget(
            'bunshin4',
            sequence(
              step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 0.5 } }),
            ),
          ),
        ),
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
      ),
      scheduled(
        9,
        sequence(
          step('calculateActionValue', {
            key: 'duration_total',
            operation: 'add',
            left: { kind: 'blackboard', key: 'duration_final' },
            right: { kind: 'constant', value: 0.067 },
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_total',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration_total': { kind: 'blackboard', key: 'duration_total' },
              'duration_final': { kind: 'blackboard', key: 'duration_final' },
              'rate_final': { kind: 'blackboard', key: 'rate_final' },
              'trigger_time': { kind: 'blackboard', key: 'trigger_time' },
              'isWisd': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              'atk_scale_boom': { kind: 'blackboard', key: 'atk_scale_boom' },
              'poise_boom': { kind: 'blackboard', key: 'poise_boom' },
              'radius': { kind: 'blackboard', key: 'radius' },
              'duration_seal2': { kind: 'blackboard', key: 'duration' },
              'rate_pre': { kind: 'blackboard', key: 'rate_pre' },
              'atk_scale_touch': { kind: 'blackboard', key: 'atk_scale_touch' },
              'poise_touch': { kind: 'blackboard', key: 'poise_touch' },
              'usp': { kind: 'blackboard', key: 'usp' },
              'atb_return_wisd': { kind: 'blackboard', key: 'atb_return_wisd' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'max_spell_vul_will': [0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.07, 0.075, 0.075, 0.075, 0.08],
    'rate_final': 0,
    'rate_pre': 0.04,
    'duration_total': 0,
    'duration_final': 0,
    'trigger_time': 0,
    'EntityBB_wisd_greater_will': 0,
    'atk_scale_boom': [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2],
    'poise_boom': 5,
    'radius': 5.67,
    'duration': 4,
    'atk_scale_touch': [0.35, 0.39, 0.42, 0.46, 0.5, 0.53, 0.57, 0.6, 0.64, 0.68, 0.73, 0.8],
    'poise_touch': 5,
    'usp': 10,
    'atb_return_wisd': [28, 28, 28, 28, 28, 28, 28, 28, 28, 30, 30, 30],
    'atk_scale_laser1': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_laser2': [1.15, 1.27, 1.38, 1.5, 1.62, 1.73, 1.85, 1.96, 2.08, 2.22, 2.39, 2.6],
    'display_atk_scale_laser_wisd': [2.22, 2.44, 2.66, 2.89, 3.11, 3.33, 3.55, 3.77, 4, 4.27, 4.61, 5],
    'display_max_spell_vul_will': [560, 560, 560, 560, 560, 560, 560, 560, 600, 600, 600, 640],
    'duration_will': 6,
    'duration_wisd': 2,
    'poise_laser': 0,
    'spell_vul_per_will': 0.000125,
    'duration_pre': 0.633,
    'will': 0,
  },
);

export const arcaneBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0032_lizhiyan_attack1',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([6.2, 6.9, 7.5, 8.1, 8.7, 9.4, 10, 10.6, 11.2, 12, 12.9, 14]),
                tags: ['normalAttack'],
              }, '12:basicAttack111:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([6.2, 6.9, 7.5, 8.1, 8.7, 9.4, 10, 10.6, 11.2, 12, 12.9, 14]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct25:chr_0032_lizhiyan_attack111:actionOrder2:26'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([6.2, 6.9, 7.5, 8.1, 8.7, 9.4, 10, 10.6, 11.2, 12, 12.9, 14]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct25:chr_0032_lizhiyan_attack111:actionOrder2:32'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.062, 0.069, 0.075, 0.081, 0.087, 0.094, 0.1, 0.106, 0.112, 0.12, 0.129, 0.14],
    'display_atk_scale': [0.19, 0.21, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42],
  },
);

export const arcaneBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0032_lizhiyan_attack2',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([7.1, 7.8, 8.5, 9.2, 9.9, 10.7, 11.4, 12.1, 12.8, 13.7, 14.7, 16]),
                tags: ['normalAttack'],
              }, '12:basicAttack211:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        12,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([7.1, 7.8, 8.5, 9.2, 9.9, 10.7, 11.4, 12.1, 12.8, 13.7, 14.7, 16]),
                tags: ['normalAttack'],
              }, '12:basicAttack211:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:29'),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.167,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        13,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([7.1, 7.8, 8.5, 9.2, 9.9, 10.7, 11.4, 12.1, 12.8, 13.7, 14.7, 16]),
                tags: ['normalAttack'],
              }, '12:basicAttack211:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:43'),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.167,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.071, 0.078, 0.085, 0.092, 0.099, 0.107, 0.114, 0.121, 0.128, 0.137, 0.147, 0.16],
    'display_atk_scale': [0.21, 0.23, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.41, 0.44, 0.48],
  },
);

export const arcaneBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0032_lizhiyan_attack3',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 38]),
                tags: ['normalAttack'],
              }, '12:basicAttack311:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.167,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        13,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 38]),
                tags: ['normalAttack'],
              }, '12:basicAttack311:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:28'),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.167,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.17, 0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.35, 0.38],
    'display_atk_scale': [0.33, 0.37, 0.4, 0.43, 0.47, 0.5, 0.53, 0.57, 0.6, 0.64, 0.69, 0.75],
  },
);

export const arcaneBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0032_lizhiyan_attack4',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:13'),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:25'),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('createTimedMarker', {
            target: 'caster',
            markerId: 'lizhiyan_attack4',
            durationSeconds: { kind: 'constant', value: 0.1 },
            autoFinishByAction: false,
          }),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:16'),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:28'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:19'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:31'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:22'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([4.5, 4.9, 5.3, 5.8, 6.2, 6.7, 7.1, 7.6, 8, 8.6, 9.2, 10]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0032_lizhiyan_attack411:actionOrder2:34'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_attack4_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.045, 0.049, 0.053, 0.058, 0.062, 0.067, 0.071, 0.076, 0.08, 0.086, 0.092, 0.1],
    'display_atk_scale': [0.36, 0.39, 0.43, 0.46, 0.5, 0.53, 0.57, 0.61, 0.64, 0.69, 0.74, 0.8],
    'poise': 0,
  },
);

export const arcaneBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0032_lizhiyan_attack5',
    timelineBlockFrames: 40,
    scheduledSequences: [
      scheduled(
        22,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([47, 52, 56, 61, 66, 71, 75, 80, 85, 90, 98, 106]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 17,
          }, '12:basicAttack56:direct25:chr_0032_lizhiyan_attack511:actionOrder1:3'),
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
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        22,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'lizhiyan_attack5' } },
                sequence(
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'lizhiyan_attack5',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    autoFinishByAction: false,
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'isHitbyMain': 0,
    'atb': 17,
    'atk_scale': [0.47, 0.52, 0.56, 0.61, 0.66, 0.71, 0.75, 0.8, 0.85, 0.9, 0.98, 1.06],
    'display_atk_scale': [0.47, 0.52, 0.56, 0.61, 0.66, 0.71, 0.75, 0.8, 0.85, 0.9, 0.98, 1.06],
    'poise': 17,
  },
);

export const arcaneFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0032_lizhiyan_power_attack',
    timelineBlockFrames: 34,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
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
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder1:4'),
        ),
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
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder1:7'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder2:10'),
        ),
      ),
      scheduled(
        32,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder2:32'),
        ),
      ),
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder2:32'),
        ),
      ),
      scheduled(
        36,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.5,
          }, '8:finisher6:direct30:chr_0032_lizhiyan_power_attack11:actionOrder2:21'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const arcanePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0032_lizhiyan_plunging_attack_end',
    timelineBlockFrames: 13,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct37:chr_0032_lizhiyan_plunging_attack_end11:actionOrder1:2'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const arcaneBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0032_lizhiyan_normal_skill',
    timelineBlockFrames: 24,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_normal_skill',
                        dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            overrideDurationSeconds: { kind: 'constant', value: 7 },
            blackboardAssignments: { 'EntityBB_wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' } },
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale_will': [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    'atk_scale_wisd': [2.22, 2.45, 2.67, 2.89, 3.11, 3.33, 3.56, 3.78, 4, 4.28, 4.61, 5],
    'poise': 10,
  },
);

export const arcaneUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0032_lizhiyan_ultimate_skill',
    timelineBlockFrames: 48,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 1464849466,
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
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener', 'buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          }),
        ),
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
      scheduled(
        41,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0032_lizhiyan_ultimate_skill',
                        dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration_aura' },
          }),
        ),
      ),
      scheduled(
        41,
        sequence(
          step('modifyActionValue', {
            key: 'isWisd',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
          }),
        ),
      ),
      scheduled(
        47,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'isWisd': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
            },
          }),
        ),
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
                  'count': { kind: 'blackboard', key: 'count' },
                  'duration': { kind: 'blackboard', key: 'duration2' },
                },
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [-1411846745],
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
                      buffTagIds: [1570888476],
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
                          buffTagIds: [2123008650],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'buffStackCompare',
                              target: 'enemy',
                              tagQueryType: 'hasAny',
                              buffTagIds: [-1558844517],
                              operator: 'greaterOrEqual',
                              value: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
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
                          'rate': { kind: 'blackboard', key: 'spell_vul_rate_calc' },
                          'duration': { kind: 'blackboard', key: 'duration_vul' },
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
                          'rate': { kind: 'blackboard', key: 'spell_vul_rate' },
                          'duration': { kind: 'blackboard', key: 'duration_vul' },
                        },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '8:ultimate6:direct32:chr_0032_lizhiyan_ultimate_skill11:actionOrder2:81'),
        ),
      ),
    ],
  },
  {
    'duration_vul': 0,
    'spell_vul_rate': 0,
    'spell_vul_rate_calc': 0,
    'spell_vul_rate_per_will': 0,
    'spell_vul_rate_potential': 0,
    'duration': 20,
    'EntityBB_wisd_greater_will': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'atk_scale_laser': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.41, 0.45],
    'atk_scale_laser_will': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.38, 0.41, 0.45],
    'display_atk_scale_laser': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'display_atk_scale_laser_will': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'duration2': 15,
    'laser_count': 8,
    'poise': 10,
    'count': 1,
    'duration_aura': 60,
    'will': 0,
  },
);

export const arcaneArcana: SkillDefinition = withSkillBlackboard(
  {
    key: 'arcana',
    sourceSkillId: 'chr_0032_lizhiyan_ultimate_skill2',
    timelineBlockFrames: 60,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
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
                        blackboardAssignments: {
                          'enhance_rate': { kind: 'blackboard', key: 'enhance_rate' },
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
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: 1464849466,
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
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener', 'buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          }),
        ),
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
        0,
        sequence(
          step('changeSkillSlot', {
            skillGroupKey: 'ultimate',
            targetSkillKey: 'ultimate',
          }),
        ),
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
                      'rate': { kind: 'blackboard', key: 'spell_vul_rate' },
                      'duration': { kind: 'blackboard', key: 'duration_vul' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]),
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '6:arcana11:conditional19:timelineActions[16]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[1]11:actionOrder2:74'),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'nature',
                attackScale: percentages([640, 704, 768, 832, 896, 960, 1024, 1088, 1152, 1232, 1328, 1440]),
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '6:arcana11:conditional19:timelineActions[16]19:_sequenceActionData10:actionData3:[1]11:failActions10:actionData3:[0]11:actionOrder2:76'),
            ),
            { alwaysNext: true },
          ),
        ),
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
  },
  {
    'cd_minus': 0,
    'duration_vul': 0,
    'enhance_rate': 0,
    'lv': 0,
    'spell_vul_rate': 0,
    'spell_vul_rate_calc': 0,
    'spell_vul_rate_per_will': 0,
    'spell_vul_rate_potential': 0,
    'atk_scale': [6.4, 7.04, 7.68, 8.32, 8.96, 9.6, 10.24, 10.88, 11.52, 12.32, 13.28, 14.4],
    'atk_scale_will': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'poise': 10,
    'will': 0,
  },
);

export const arcaneGeneratedOperator: OperatorDefinition = {
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
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [arcaneBasicAttack1, arcaneBasicAttack2, arcaneBasicAttack3, arcaneBasicAttack4, arcaneBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: arcaneFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: arcanePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: arcaneBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: arcaneComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: arcaneUltimate, replacementSkills: [arcaneArcana] },
  ],
  buffDefinitions: {
    'buff_chr_0032_lizhiyan_combo_skill_precheck': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
    },
    'buff_chr_0032_lizhiyan_combo_skill_seal_effect': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 5,
        'isWisd': 0,
      },
    },
    'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_vul' },
      blackboard: {
        'duration_vul': 6,
        'isWisd': 0,
        'rate': 0.2,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['nature'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['cryo'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
      ],
    },
    'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      blackboard: {
        'atb_return_wisd': 10,
        'atk_scale_early_finish': 1,
        'poise_early_finish': 1,
        'radius_early_finish': 5.67,
      },
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'eventSourceMatchesBuffSource' },
                sequence(
                  branch(
                    {
                      kind: 'eventDamageTagsMatch',
                      match: 'hasAll',
                      tags: ['normalSkill'],
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_return_wisd' },
                        recipient: 'team',
                        spGainKind: 'refund',
                        spGainSource: 'default',
                      }),
                      step('dealDamage', {
                        damageType: 'nature',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_early_finish' },
                        tags: ['comboSkill'],
                        features: ['canBreakWeakness'],
                        stagger: { kind: 'blackboard', key: 'poise_early_finish' },
                      }, '79:buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener:beforeTakeDamage:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[5]11:actionOrder1:5'),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'lizhiyan_combo_hit',
                        durationSeconds: { kind: 'constant', value: 0.1 },
                        autoFinishByAction: false,
                      }),
                      step('finishCurrentBuff', { reason: 'early' }),
                    ),
                  ),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0032_lizhiyan_combo_skill_seal': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'trigger_time' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'duration': 5,
        'isWisd': 0,
        'rate_pre': 0.1,
        'trigger_time': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable_pre',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration_vul': { kind: 'blackboard', key: 'duration' },
                  'rate': { kind: 'blackboard', key: 'rate_pre' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        trigger: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'bunshin', abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'], sameSourceSkillCast: true }),
          forEachContextTarget(
            'bunshin',
            sequence(
              step('startCurrentAbilityEntityChildSkill', { childSkill: {
                skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_end',
                blackboard: {
                  'atb_final': 50,
                  'atb_return_wisd': 0,
                  'atk_scale_boom': 1,
                  'minAngle': 0,
                  'number': 0,
                  'owner_mainchar_alpha': 0,
                  'owner_mainchar_distance': 0,
                  'poise_boom': 5,
                  'radius': 5,
                },
                scheduledSequences: [
                  scheduled(
                    0,
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'atk_scale_early_finish': { kind: 'blackboard', key: 'atk_scale_boom' },
                          'poise_early_finish': { kind: 'blackboard', key: 'poise_boom' },
                          'atb_return_wisd': { kind: 'blackboard', key: 'atb_return_wisd' },
                        },
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'lizhiyan_combo_end_not_finish',
                        durationSeconds: { kind: 'constant', value: 0.1 },
                        autoFinishByAction: false,
                      }),
                    ),
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
                  ),
                  scheduled(
                    9,
                    sequence(
                      step('finishBuffsById', {
                        target: 'currentAbilityEntity',
                        buffIds: ['buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect', 'buff_chr_0032_lizhiyan_combo_skill_abilityentity_effect_line'],
                        reason: 'other',
                      }),
                    ),
                  ),
                  scheduled(
                    14,
                    sequence(
                      branch(
                        { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'lizhiyan_combo_hit' } },
                        sequence(
                          step('dealDamage', {
                            damageType: 'nature',
                            attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
                            tags: ['comboSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'blackboard', key: 'poise_boom' },
                          }, '71:<existingAbilityEntity>:chr_0032_lizhiyan_combo_skill_abilityentity_end11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[3]11:actionOrder2:17'),
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'lizhiyan_combo_hit',
                            durationSeconds: { kind: 'constant', value: 0.1 },
                            autoFinishByAction: false,
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  ),
                  scheduled(
                    14,
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
                  scheduled(
                    44,
                    sequence(
                      step('finishCurrentAbilityEntity', {}),
                    ),
                  ),
                ],
              } }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0032_lizhiyan_combo_skill_seal_listener': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_scale_early_finish': 5,
        'atk_scale_wisd_ratio': 0,
        'duration': 5,
        'duration_extra': 0,
        'poise_early_finish': 5,
        'radius': 5.67,
        'radius_early_finish': 5.67,
        'wisd_greater_will': 0,
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              {
                kind: 'all',
                conditions: [
                  { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal', 'buff_chr_0032_lizhiyan_combo_skill_seal_bunshin_end_listener'] },
                  { kind: 'eventBuffEndedEarly' },
                ],
              },
              sequence(
                step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'bunshin', abilityEntityIds: ['abilityentity_chr_0032_lizhiyan_combo_skill'], sameSourceSkillCast: true }),
                forEachContextTarget(
                  'bunshin',
                  sequence(
                    step('startCurrentAbilityEntityChildSkill', { childSkill: {
                      skillId: 'chr_0032_lizhiyan_combo_skill_abilityentity_seal_again',
                      blackboard: {
                        'atb_final': 50,
                        'atb_return_wisd': 10,
                        'atk_scale_calc': 0,
                        'atk_scale_laser1': 6,
                        'atk_scale_laser2': 2,
                        'atk_scale_wisd_ratio': 0,
                        'cd_reduce': 3,
                        'duration_calc': 0,
                        'duration_extra': 0,
                        'duration_vul': 2,
                        'isWisd': 1,
                        'minAngle': 0,
                        'number': 0,
                        'owner_mainchar_alpha': 0,
                        'owner_mainchar_distance': 0,
                        'poise_laser': 5,
                        'radius': 5,
                        'radius_early_finish': 5.67,
                        'rate_final': 0.3,
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
                        ),
                        scheduled(
                          0,
                          sequence(
                            branch(
                              { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                              sequence(
                                step('createTimedMarker', {
                                  target: 'caster',
                                  markerId: 'lizhiyan_combo_vul',
                                  durationSeconds: { kind: 'constant', value: 0.1 },
                                  autoFinishByAction: false,
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_chr_0032_lizhiyan_combo_skill_spell_vulnerable',
                                  target: 'enemy',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    'rate': { kind: 'blackboard', key: 'rate_final' },
                                    'duration_vul': { kind: 'blackboard', key: 'duration_calc' },
                                    'atk_scale_calc': { kind: 'blackboard', key: 'atk_scale_calc' },
                                    'poise_final': { kind: 'blackboard', key: 'poise_laser' },
                                    'isWisd': { kind: 'blackboard', key: 'isWisd' },
                                    'atk_scale_laser1': { kind: 'blackboard', key: 'atk_scale_laser1' },
                                    'atk_scale_laser2': { kind: 'blackboard', key: 'atk_scale_laser2' },
                                  },
                                }),
                              ),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
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
                        ),
                        scheduled(
                          41,
                          sequence(
                            branch(
                              {
                                kind: 'all',
                                conditions: [
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'isWisd' },
                                    operator: 'greaterOrEqual',
                                    right: { kind: 'constant', value: 1 },
                                  },
                                  {
                                    kind: 'buffIdStackCompare',
                                    target: 'caster',
                                    buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_finish_count'],
                                    sameSourceSkillCast: true,
                                    operator: 'less',
                                    value: { kind: 'constant', value: 1 },
                                  },
                                ],
                              },
                              sequence(
                                step('jumpTimeline', {
                                  destinationFrame: 239,
                                }),
                              ),
                            ),
                          ),
                        ),
                        scheduled(
                          41,
                          sequence(
                            branch(
                              {
                                kind: 'all',
                                conditions: [
                                  {
                                    kind: 'actionValueCompare',
                                    left: { kind: 'blackboard', key: 'isWisd' },
                                    operator: 'greaterOrEqual',
                                    right: { kind: 'constant', value: 1 },
                                  },
                                  {
                                    kind: 'not',
                                    condition:
                                      {
                                        kind: 'buffIdStackCompare',
                                        target: 'caster',
                                        buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal_finish_count'],
                                        sameSourceSkillCast: true,
                                        operator: 'less',
                                        value: { kind: 'constant', value: 1 },
                                      }
                                  },
                                ],
                              },
                              sequence(
                                step('jumpTimeline', {
                                  destinationFrame: 240,
                                }),
                              ),
                            ),
                          ),
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
                                    sameSourceSkillCast: true,
                                    operator: 'less',
                                    value: { kind: 'constant', value: 1 },
                                  },
                                  sequence(
                                    step('applyBuff', {
                                      buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finish_count',
                                      target: 'caster',
                                      inheritSourceSkillCastInfo: true,
                                      source: 'currentAbilityEntity',
                                    }),
                                    step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0032_lizhiyan_combo_skill_death',  dieWhenSourceDies: false, inheritActionBlackboard: true, target: 'enemy', saveToContextKey: 'death' }),
                                    forEachContextTarget(
                                      'death',
                                      sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_finisher_wisd',
                                          target: 'currentAbilityEntity',
                                          inheritSourceSkillCastInfo: true,
                                          blackboardAssignments: {
                                            'atk_scale_laser1': { kind: 'blackboard', key: 'atk_scale_laser1' },
                                            'atk_scale_laser2': { kind: 'blackboard', key: 'atk_scale_laser2' },
                                            'poise_final': { kind: 'blackboard', key: 'poise_laser' },
                                            'isWisd': { kind: 'blackboard', key: 'isWisd' },
                                            'cd_reduce': { kind: 'blackboard', key: 'cd_reduce' },
                                            'atb_return_wisd': { kind: 'blackboard', key: 'atb_return_wisd' },
                                          },
                                        }),
                                      ),
                                    ),
                                  ),
                                  undefined,
                                  { alwaysNext: true },
                                ),
                              ),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
                        ),
                        scheduled(
                          239,
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
                                  target: 'currentAbilityEntity',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    'atk_scale_laser2': { kind: 'blackboard', key: 'atk_scale_laser2' },
                                    'poise_final': { kind: 'blackboard', key: 'poise_laser' },
                                    'isWisd': { kind: 'blackboard', key: 'isWisd' },
                                  },
                                }),
                                step('createTimedMarker', {
                                  target: 'caster',
                                  markerId: 'lizhiyan_combo_finisher',
                                  durationSeconds: { kind: 'constant', value: 0.1 },
                                  autoFinishByAction: false,
                                }),
                              ),
                              { alwaysNext: true },
                            ),
                          ),
                        ),
                        scheduled(
                          240,
                          sequence(
                            step('finishCurrentAbilityEntity', {}),
                          ),
                        ),
                      ],
                    } }),
                  ),
                ),
                step('finishCurrentBuff', { reason: 'other' }),
              ),
            ),
          ),
        },
      ],
    },
    'buff_chr_0032_lizhiyan_combo_skill_seal2': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [162143970],
      blackboard: {
        'atb_return_wisd': 0,
        'atk_scale_early_finish': 1,
        'duration': 5,
        'isWisd': 1,
        'poise_early_finish': 1,
        'radius_early_finish': 5.67,
        'rate_pre': 0.1,
        'trigger_time': 0,
      },
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence:
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
                      kind: 'eventDamageTagsMatch',
                      match: 'hasAll',
                      tags: ['normalSkill'],
                    },
                    sequence(
                      branch(
                        { kind: 'eventSourceMatchesBuffSource' },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb_return_wisd' },
                            recipient: 'team',
                            spGainKind: 'refund',
                            spGainSource: 'default',
                          }),
                          step('dealDamage', {
                            damageType: 'nature',
                            attackScale: { kind: 'blackboard', key: 'atk_scale_early_finish' },
                            tags: ['comboSkill'],
                            features: ['canBreakWeakness'],
                            stagger: { kind: 'blackboard', key: 'poise_early_finish' },
                          }, '59:buff_chr_0032_lizhiyan_combo_skill_seal2:beforeTakeDamage:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[6]11:actionOrder1:6'),
                          step('finishBuffsById', {
                            target: 'enemy',
                            buffIds: ['buff_chr_0032_lizhiyan_combo_skill_seal', 'buff_chr_0032_lizhiyan_combo_skill_seal_effect'],
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
    'buff_chr_0032_lizhiyan_combo_skill_seal_total': {
      stackingType: 'unlimited',
      timeClock: 'global',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_total' },
      blackboard: {
        'atb_return_wisd': 0,
        'atk_scale_boom': 0,
        'atk_scale_touch': 0,
        'duration_effect': 0,
        'duration_final': 0,
        'duration_seal2': 0,
        'duration_total': 5,
        'isWisd': 0,
        'poise_boom': 0,
        'poise_touch': 0,
        'radius': 5.67,
        'rate_final': 0,
        'rate_pre': 0,
        'trigger_time': 0.1,
        'usp': 0,
      },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_precheck',
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
        scheduled(
          0,
          sequence(
            step('calculateActionValue', {
              key: 'duration_effect',
              operation: 'add',
              left: { kind: 'blackboard', key: 'duration_final' },
              right: { kind: 'constant', value: -0.2 },
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_effect',
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration_effect' },
                'isWisd': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              },
            }),
          ),
        ),
        scheduled(
          2,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal',
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration_final' },
                'rate_pre': { kind: 'blackboard', key: 'rate_final' },
                'trigger_time': { kind: 'blackboard', key: 'trigger_time' },
                'isWisd': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              },
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal_listener',
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration_final' },
                'wisd_greater_will': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                'atk_scale_early_finish': { kind: 'blackboard', key: 'atk_scale_boom' },
                'poise_early_finish': { kind: 'blackboard', key: 'poise_boom' },
              },
            }),
          ),
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
              sequence(
                branch(
                  {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'EntityBB_consumed_type' },
                    operator: 'equal',
                    right: { kind: 'constant', value: 3 },
                  },
                  sequence(
                    step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                  ),
                  sequence(
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'EntityBB_consumed_type' },
                        operator: 'equal',
                        right: { kind: 'constant', value: 2 },
                      },
                      sequence(
                        step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                      ),
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'EntityBB_consumed_type' },
                            operator: 'equal',
                            right: { kind: 'constant', value: 1 },
                          },
                          sequence(
                            step('applyElementalInfliction', { element: 'electric', isExtra: false }),
                          ),
                          sequence(
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'EntityBB_consumed_type' },
                                operator: 'equal',
                                right: { kind: 'constant', value: 0 },
                              },
                              sequence(
                                step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                              ),
                            ),
                          ),
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
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_combo_skill_seal2',
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration_seal2' },
                'isWisd': { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                'rate_pre': { kind: 'blackboard', key: 'rate_pre' },
                'atk_scale_early_finish': { kind: 'blackboard', key: 'atk_scale_boom' },
                'poise_early_finish': { kind: 'blackboard', key: 'poise_boom' },
                'atb_return_wisd': { kind: 'blackboard', key: 'atb_return_wisd' },
              },
            }),
            branch(
              { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
              sequence(
                step('dealDamage', {
                  damageType: 'nature',
                  attackScale: { kind: 'blackboard', key: 'atk_scale_touch' },
                  tags: ['comboSkill'],
                  features: ['canBreakWeakness'],
                  stagger: { kind: 'blackboard', key: 'poise_touch' },
                }, '45:buff_chr_0032_lizhiyan_combo_skill_seal_total11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[4]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:19'),
              ),
              undefined,
              { alwaysNext: true },
            ),
            step('changeResourceByActionValue', {
              resource: 'ultimateEnergy',
              amount: { kind: 'blackboard', key: 'usp' },
              recipient: 'caster',
            }),
          ),
        ),
      ],
    },
    'buff_chr_0032_lizhiyan_attack4_effect': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.21,
      triggerIntervalSeconds: 0.2,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
    },
    'buff_chr_0032_lizhiyan_ultimate_skill_time_dilation_listener': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0032_lizhiyan_talent1_enhance': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'enhance_rate': 0.1,
      },
    },
    'buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1.5,
    },
    'buff_chr_0032_lizhiyan_ultimate_skill_listener': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 10,
        'enhance_rate': 0,
        'lv': 0,
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'ultimate',
          targetSkillKey: 'arcana',
          revertedSkillKey: 'ultimate',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_listener_owner'],
            reason: 'other',
          }),
          step('changeResource', { resource: 'ultimateEnergy', amount: 1, recipient: 'caster', isPercentValue: true, ultimateRecoveryTagId: 903366032 }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
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
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'enhance_rate': { kind: 'blackboard', key: 'enhance_rate' },
                    },
                  }),
                ),
              ),
            ),
          ),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
            reason: 'other',
          }),
          step('changeResource', { resource: 'ultimateEnergy', amount: -999, recipient: 'caster' }),
        ),
      },
    },
    'buff_chr_0032_lizhiyan_ultimate_skill_listener_owner': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 30,
        'enhance_rate': 0,
        'isWisd': 0,
        'lv': 0,
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'ultimate',
          targetSkillKey: 'arcana',
          revertedSkillKey: 'ultimate',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'isWisd' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
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
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'enhance_rate': { kind: 'blackboard', key: 'enhance_rate' },
                    },
                  }),
                ),
              ),
            ),
          ),
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
              step('changeResource', { resource: 'ultimateEnergy', amount: -999, recipient: 'caster' }),
            ),
            { alwaysNext: true },
          ),
          forEachContextTarget(
            'ult_aura',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_abilityentity_finish_self',
                target: 'currentAbilityEntity',
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
          sequence:
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 2 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
        },
      ],
    },
    'buff_chr_0032_lizhiyan_talent1_vulnerable': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0,
        'rate': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['nature'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['cryo'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
      ],
    },
    'buff_chr_0032_lizhiyan_talent1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      blackboard: {
        'duration': 10,
        'enhance_rate': 0.1,
        'lv': 2,
        'spell_vul_rate': 0.1,
        'spell_vul_rate_per_will': 0,
        'spell_vul_rate_potential': 0,
      },
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0032_lizhiyan_combo_skill': { lifetime: { kind: 'limited', durationSeconds: 50 } },
    'abilityentity_chr_0032_lizhiyan_combo_skill_death': { lifetime: { kind: 'limited', durationSeconds: 6 } },
    'abilityentity_chr_0032_lizhiyan_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 6 }, childSkill: {
        skillId: 'chr_0032_lizhiyan_normal_skill_abilityrange2',
        blackboard: {
          'atb_return_dynamic': 20,
          'atk_scale': 0,
          'atk_scale_final': 0,
          'atk_scale_will': 1,
          'atk_scale_wisd': 1,
          'atk_scale_wisd_ratio': 1.5,
          'duration': 6,
          'effect_count': 0,
          'has_returned': 0,
          'isJumped': 0,
          'max_effect_count': 3,
          'poise': 0,
          'radius': 5,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('modifyActionValue', {
                key: 'radius',
                operation: 'add',
                value: { kind: 'constant', value: 0.67 },
              }),
            ),
          ),
          scheduled(
            20,
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'singleEnemyPresent' } },
                sequence(),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'effect_count' },
                      operator: 'less',
                      right: { kind: 'blackboard', key: 'max_effect_count' },
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'effect_count',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'effect_count' },
                        right: { kind: 'constant', value: 1 },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
              step('applyElementalInfliction', { element: 'nature', isExtra: false }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_wisd_greater_will' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('dealDamage', {
                    damageType: 'nature',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_wisd' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'poise' },
                  }, '89:abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange211:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder2:14'),
                ),
                sequence(
                  step('dealDamage', {
                    damageType: 'nature',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_will' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'poise' },
                  }, '89:abilityentity_chr_0032_lizhiyan_normal_skill:chr_0032_lizhiyan_normal_skill_abilityrange211:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[3]11:failActions10:actionData3:[2]11:actionOrder2:17'),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            20,
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            22,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0032_lizhiyan_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 6 }, childSkill: {
        skillId: 'chr_0032_lizhiyan_ultimate_skill_abilityrange',
        blackboard: {
          'atk_scale_laser': 0.5,
          'atk_scale_laser_will': 0.2,
          'duration': 0,
          'isWisd': 0,
          'radius': 5,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_listener_abilityentity',
                definition: {
                  stackingType: 'unique',
                  priority: 0,
                  maxStackCount: 1,
                  lifecycleSequences: {
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0032_lizhiyan_ultimate_skill_layer'],
                        reason: 'other',
                      }),
                    ),
                  },
                },
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
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
                    inheritSourceSkillCastInfo: true,
                    finishByAction: true,
                    blackboardAssignments: {
                      'atk_scale_laser': { kind: 'blackboard', key: 'atk_scale_laser' },
                    },
                  }),
                ),
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0032_lizhiyan_ultimate_skill_inaura',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    finishByAction: true,
                    blackboardAssignments: {
                      'atk_scale_laser': { kind: 'blackboard', key: 'atk_scale_laser_will' },
                    },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            1800,
          ),
        ],
    } },
  },
  entityBlackboardInitializers: [{ key: 'EntityBB_wisd_greater_will', condition: { kind: 'deckAttributeCompare', left: 'intellect', operator: 'greaterOrEqual', right: 'will' }, trueValue: 1, falseValue: 0 }],
  talents: [
    {
      key: 'formationEnhancement',
      levels: 2,
      modifiers: [
        {
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -180,
          condition: { kind: 'deckAttributeCompare', left: 'intellect', operator: 'greaterOrEqual', right: 'will' },
        },
      ],
      passiveSkills: [
        {
          key: 'chr_0032_lizhiyan_talent1',
          blackboard: {
            'duration': 10,
            'enhance_rate': [0, 0.24],
            'lv': [1, 2],
            'spell_vul_rate': [0, 0.128],
            'spell_vul_rate_per_will': [0, 0.0002],
            'spell_vul_rate_potential': 0,
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0032_lizhiyan_talent1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'lv': { kind: 'blackboard', key: 'lv' },
                'enhance_rate': { kind: 'blackboard', key: 'enhance_rate' },
                'spell_vul_rate': { kind: 'blackboard', key: 'spell_vul_rate' },
                'duration': { kind: 'blackboard', key: 'duration' },
                'spell_vul_rate_per_will': { kind: 'blackboard', key: 'spell_vul_rate_per_will' },
                'spell_vul_rate_potential': { kind: 'blackboard', key: 'spell_vul_rate_potential' },
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
        {
          kind: 'addReactionDuration',
          reaction: 'corrosion',
          seconds: [5, 10],
        },
        {
          kind: 'addReactionEffectiveness',
          reaction: 'corrosion',
          value: [0.05, 0.1],
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
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_boom',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_laser1',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale_laser2',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_return_wisd',
          operation: 'add',
          value: 10,
          condition: { kind: 'deckAttributeCompare', left: 'intellect', operator: 'greaterOrEqual', right: 'will' },
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate_pre',
          operation: 'add',
          value: 0.06,
          condition: { kind: 'deckAttributeCompare', left: 'intellect', operator: 'less', right: 'will' },
        },
      ],
    },
    {
      key: 'attributeAndArtsIntensity',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['intellect', 'will'],
          value: 15,
        },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      key: 'strongerCorrosionMastery',
      levels: 1,
      modifiers: [
        {
          kind: 'addReactionDuration',
          reaction: 'corrosion',
          seconds: 5,
        },
        {
          kind: 'addReactionEffectiveness',
          reaction: 'corrosion',
          value: 0.2,
        },
      ],
    },
    {
      key: 'reducedUltimateCost',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'strengthenedFormTalentAndArcana',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'arcana',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'arcana',
          blackboardKey: 'cd_minus',
          operation: 'add',
          value: 0.3,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'enhance_rate',
          operation: 'add',
          value: 0.16,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0032_lizhiyan_talent1',
          blackboardKey: 'spell_vul_rate_potential',
          operation: 'add',
          value: 0.07,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
