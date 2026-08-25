/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentage, percentages, scheduled, sequence, step, withActionBlackboardScope, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const yvonneComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0017_yvonne_combo_skill',
    timelineBlockFrames: 19,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.667 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        17,
      ),
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0017_yvonne_combo_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.15 },
            slot: 1464849466,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            targets: [],
            abilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        5,
      ),
    ],
  },
  {
    'atk_scale_boom': [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    'atk_scale_tick': [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    'duration': 3,
    'interval': 0.75,
    'maxcnt': 4,
    'poise': 10,
    'usp': 10,
    'usp_extra': 10,
  },
);

export const yvonneBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0017_yvonne_attack1',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([24, 26, 28, 31, 33, 35, 38, 40, 42, 45, 49, 53]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0017_yvonne_attack131:chr_0017_yvonne_attack1_projhit11:actionOrder1:61:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack1_projhit:6',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
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
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.24, 0.26, 0.28, 0.31, 0.33, 0.35, 0.38, 0.4, 0.42, 0.45, 0.49, 0.53],
  },
);

export const yvonneBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0017_yvonne_attack2',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 26, 28]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0017_yvonne_attack231:chr_0017_yvonne_attack2_projhit11:actionOrder1:61:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack2_projhit:6',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.5,
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
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 26, 28]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0017_yvonne_attack237:chr_0017_yvonne_attack2_robot_projhit11:actionOrder1:71:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack2_robot_projhit:7',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.5,
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
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28],
    'display_atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const yvonneBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0017_yvonne_attack3',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0017_yvonne_attack331:chr_0017_yvonne_attack3_projhit11:actionOrder1:31:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack3_projhit:3',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.3333333,
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
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0017_yvonne_attack331:chr_0017_yvonne_attack3_projhit11:actionOrder1:41:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack3_projhit:4',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.3333333,
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
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0017_yvonne_attack331:chr_0017_yvonne_attack3_projhit11:actionOrder1:51:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack3_projhit:5',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    coefficient: 0.3333333,
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
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.24],
    'display_atk_scale': [0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.54, 0.57, 0.61, 0.65, 0.71],
  },
);

export const yvonneBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0017_yvonne_attack4',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([41, 45, 49, 53, 58, 62, 66, 70, 74, 79, 85, 92]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile23:chr_0017_yvonne_attack431:chr_0017_yvonne_attack4_projhit11:actionOrder1:61:0'),
          withActionBlackboardScope(
            'projectile:chr_0017_yvonne_attack4_projhit:6',
            { atb: 0, atk_scale: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'casterControlled' },
                    { kind: 'singleEnemyPresent' },
                  ],
                },
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
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.41, 0.45, 0.49, 0.53, 0.58, 0.62, 0.66, 0.7, 0.74, 0.79, 0.85, 0.92],
  },
);

export const yvonneBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0017_yvonne_attack5',
    timelineBlockFrames: 34,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([56, 62, 67, 73, 79, 84, 90, 96, 101, 108, 117, 126]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
          }, '12:basicAttack56:direct23:chr_0017_yvonne_attack511:actionOrder1:9'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('dealStagger', {
                value: 17,
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'cnt' },
                  operator: 'less',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'normalAttack',
                  }),
                  step('modifyActionValue', {
                    key: 'cnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_talent_1_valid'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'cnt': 0,
    'atb': 17,
    'atk_scale': [0.56, 0.62, 0.67, 0.73, 0.79, 0.84, 0.9, 0.96, 1.01, 1.08, 1.17, 1.26],
    'display_atk_scale': [0.56, 0.62, 0.67, 0.73, 0.79, 0.84, 0.9, 0.96, 1.01, 1.08, 1.17, 1.26],
    'poise': 17,
  },
);

export const yvonneFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0017_yvonne_power_attack',
    timelineBlockFrames: 29,
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
        45,
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
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher10:projectile28:chr_0017_yvonne_power_attack36:chr_0017_yvonne_power_attack_projhit11:actionOrder1:51:0'),
        ),
      ),
      scheduled(
        28,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct28:chr_0017_yvonne_power_attack11:actionOrder1:7'),
          step('finishBuffsById', {
            target: 'enemy',
            buffIds: ['buff_chr_0017_yvonne_power_attack'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const yvonnePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0017_yvonne_plunging_attack_end',
    timelineBlockFrames: 2,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_potential_5'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'probability',
                  probability: { kind: 'blackboard', key: 'prob' },
                },
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_potential_5_cd'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'atk_scale',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'dmg_scale' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_potential_5_cd',
                        target: 'caster',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'cd': { kind: 'blackboard', key: 'cd' },
                        },
                      }),
                      step('dealDamage', {
                        damageType: 'cryo',
                        attackScale: { kind: 'blackboard', key: 'atk_scale' },
                        tags: ['normalAttack', 'plungingAttack'],
                        stagger: 5,
                      }, '14:plungingAttack11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder2:14'),
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'default',
                      }),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'cryo',
                        attackScale: { kind: 'blackboard', key: 'atk_scale' },
                        tags: ['normalAttack', 'plungingAttack'],
                      }, '14:plungingAttack11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:34'),
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb' },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'default',
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                sequence(
                  step('dealDamage', {
                    damageType: 'cryo',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: ['normalAttack', 'plungingAttack'],
                  }, '14:plungingAttack11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:43'),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'default',
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack', 'plungingAttack'],
              }, '14:plungingAttack11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:52'),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'default',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'dmg_scale': 2.5,
    'atb': 0,
    'cd': 15,
    'prob': 0.5,
  },
);

export const yvonneBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0017_yvonne_normal_skill',
    timelineBlockFrames: 34,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_normal_skill_listener',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'crit_up': { kind: 'blackboard', key: 'crit_up' },
              'atk_scale2': { kind: 'blackboard', key: 'atk_scale2' },
            },
          }),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_normal_skill_projectile',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                source: 'enemy',
                blackboardAssignments: {
                  'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                  'poise': { kind: 'blackboard', key: 'poise' },
                  'consume_cnt': { kind: 'blackboard', key: 'consume_cnt' },
                  'gained_atb': { kind: 'blackboard', key: 'gained_atb' },
                  'has_potential2': { kind: 'blackboard', key: 'has_potential2' },
                  'atb_return': { kind: 'blackboard', key: 'atb_return' },
                  'count': { kind: 'blackboard', key: 'count' },
                  'atk_scale_layer': { kind: 'blackboard', key: 'atk_scale_layer' },
                  'usp_base': { kind: 'blackboard', key: 'usp_base' },
                  'usp_layer': { kind: 'blackboard', key: 'usp_layer' },
                  'atk_scale2': { kind: 'blackboard', key: 'atk_scale2' },
                },
              }),
            ),
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_normal_skill_projectile',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    source: 'enemy',
                    blackboardAssignments: {
                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                      'poise': { kind: 'blackboard', key: 'poise' },
                      'consume_cnt': { kind: 'blackboard', key: 'consume_cnt' },
                      'gained_atb': { kind: 'blackboard', key: 'gained_atb' },
                      'has_potential2': { kind: 'blackboard', key: 'has_potential2' },
                      'atb_return': { kind: 'blackboard', key: 'atb_return' },
                      'count': { kind: 'blackboard', key: 'count' },
                      'atk_scale_layer': { kind: 'blackboard', key: 'atk_scale_layer' },
                      'usp_base': { kind: 'blackboard', key: 'usp_base' },
                      'usp_layer': { kind: 'blackboard', key: 'usp_layer' },
                      'atk_scale2': { kind: 'blackboard', key: 'atk_scale2' },
                    },
                  }),
                ),
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_normal_skill_projectile',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                      'poise': { kind: 'blackboard', key: 'poise' },
                      'consume_cnt': { kind: 'blackboard', key: 'consume_cnt' },
                      'gained_atb': { kind: 'blackboard', key: 'gained_atb' },
                      'has_potential2': { kind: 'blackboard', key: 'has_potential2' },
                      'atb_return': { kind: 'blackboard', key: 'atb_return' },
                      'count': { kind: 'blackboard', key: 'count' },
                      'atk_scale_layer': { kind: 'blackboard', key: 'atk_scale_layer' },
                      'usp_base': { kind: 'blackboard', key: 'usp_base' },
                      'usp_layer': { kind: 'blackboard', key: 'usp_layer' },
                      'atk_scale2': { kind: 'blackboard', key: 'atk_scale2' },
                    },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'crit_up': 0,
    'atk_scale2': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    'atk_scale': [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    'atk_scale_layer': [0.89, 0.98, 1.07, 1.16, 1.24, 1.33, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
    'poise': 10,
    'usp_base': 10,
    'usp_layer': 30,
    'atb_return': 10,
    'consume_cnt': 0,
    'count': 0,
    'gained_atb': 0,
    'has_potential2': 0,
  },
);

export const yvonneUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0017_yvonne_ultimate_skill',
    timelineBlockFrames: 65,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 220 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill2',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill3',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill', 'buff_chr_0017_yvonne_ultimate_skill_end'],
            reason: 'other',
          }),
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
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_dash_attack'],
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
        64,
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
        61,
      ),
      scheduled(
        61,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'duration' },
                  'has_potential4': { kind: 'blackboard', key: 'has_potential4' },
                  'ex_usp_up': { kind: 'blackboard', key: 'ex_usp_up' },
                  'has_potential5': { kind: 'blackboard', key: 'has_potential5' },
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'crit_dmg_up': { kind: 'blackboard', key: 'crit_dmg_up' },
                },
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
    'atk_scale1': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    'atk_scale2': [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    'atk_scale_extra': [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    'duration': 7,
    'poise': 20,
    'atk_up': 0.3,
    'crit_dmg_up': 0.15,
    'ex_usp_up': 0.3,
    'has_potential4': 0,
    'has_potential5': 0,
  },
);

export const yvonneUltimateAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack1',
    sourceSkillId: 'chr_0017_yvonne_ult_attack1_1',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'crit_rate_up': { kind: 'blackboard', key: 'crit_rate_up' },
              'normal_dmg_up': { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '15:ultimateAttack110:projectile29:chr_0017_yvonne_ult_attack1_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:161:1'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_start',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        23,
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'crit_rate_up': { kind: 'blackboard', key: 'crit_rate_up' },
              'normal_dmg_up': { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '15:ultimateAttack110:projectile29:chr_0017_yvonne_ult_attack1_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:181:1'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'crit_rate_up': { kind: 'blackboard', key: 'crit_rate_up' },
              'normal_dmg_up': { kind: 'blackboard', key: 'normal_dmg_up' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '15:ultimateAttack110:projectile29:chr_0017_yvonne_ult_attack1_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:201:1'),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'crit_rate_up': 0.06,
    'normal_dmg_up': 0.03,
    'atk_scale': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
    'layer': 10,
  },
);

export const yvonneUltimateAttack2A: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2A',
    sourceSkillId: 'chr_0017_yvonne_ult_attack2_1',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        8,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2A11:conditional19:timelineActions[27]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:591:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
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
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2A11:conditional19:timelineActions[28]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:791:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2A11:conditional19:timelineActions[29]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:991:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.6 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2A11:conditional19:timelineActions[30]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder3:1191:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        32,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
);

export const yvonneUltimateAttack2B: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2B',
    sourceSkillId: 'chr_0017_yvonne_ult_attack2_2',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        1,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        1,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        1,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2B11:conditional19:timelineActions[23]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:411:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        4,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        4,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2B11:conditional19:timelineActions[24]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:611:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        7,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2B11:conditional19:timelineActions[25]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:811:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.6 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'cryo',
                  attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
                  tags: ['normalAttack'],
                }, '16:ultimateAttack2B11:conditional19:timelineActions[26]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder3:1011:1'),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
);

export const yvonneUltimateAttack3A: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3A',
    sourceSkillId: 'chr_0017_yvonne_ult_attack3_1',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        12,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0017_yvonne_voice_cd' } },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'chr_0017_yvonne_voice_cd',
                durationSeconds: { kind: 'constant', value: 5 },
                autoFinishByAction: false,
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        target: 'caster',
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        13,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
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
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:701:1'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:751:1'),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:801:1'),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        19,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:851:1'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:901:1'),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        23,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
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
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:951:1'),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        25,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder3:1001:1'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        27,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.5 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3A10:projectile29:chr_0017_yvonne_ult_attack3_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder3:1051:1'),
        ),
      ),
      scheduled(
        50,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
);

export const yvonneUltimateAttack3B: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3B',
    sourceSkillId: 'chr_0017_yvonne_ult_attack3_2',
    timelineBlockFrames: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
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
            {
              kind: 'all',
              conditions: [
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0017_yvonne_voice_cd' } },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                  operator: 'equal',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'chr_0017_yvonne_voice_cd',
                durationSeconds: { kind: 'constant', value: 5 },
                autoFinishByAction: false,
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0017_yvonne_ultimate_skill_voice_short'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_ultimate_skill_voice_short',
                        target: 'caster',
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        1,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:291:1'),
        ),
      ),
      scheduled(
        1,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        3,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:341:1'),
        ),
      ),
      scheduled(
        3,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:391:1'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        7,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:441:1'),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:491:1'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:541:1'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        13,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.2 },
                },
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
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:591:1'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'effect_duration': { kind: 'constant', value: 0.5 },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack3B10:projectile29:chr_0017_yvonne_ult_attack3_235:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:641:1'),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.089, 0.098, 0.107, 0.116, 0.125, 0.134, 0.143, 0.151, 0.16, 0.172, 0.185, 0.2],
  },
);

export const yvonneUltimateAttackEnd: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttackEnd',
    sourceSkillId: 'chr_0017_yvonne_ult_attack_end',
    timelineBlockFrames: 61,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_layer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'normal_dmg_up',
            outputKey: 'normal_dmg_up',
          }),
          step('modifyActionValue', {
            key: 'normal_dmg_up',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'stack' },
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'] },
            desiredKey: 'crit_rate_up_dynamic',
            outputKey: 'crit_rate_up',
          }),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'crit_dmg_up_true',
                operation: 'add',
                left: { kind: 'blackboard', key: 'crit_dmg_up' },
                right: { kind: 'constant', value: 0 },
              }),
              step('calculateActionValue', {
                key: 'atk_up_true',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_up' },
                right: { kind: 'constant', value: 0 },
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
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera',
                    target: 'caster',
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
      ),
      scheduled(
        7,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        28,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: percentages([133, 147, 160, 173, 186, 200, 213, 226, 240, 256, 276, 300]),
                tags: ['normalAttack', 'normalAttackLastCombo'],
                features: ['canBreakWeakness'],
                stagger: 20,
              }, '17:ultimateAttackEnd11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder2:14'),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1535684437],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('dealDamage', {
                    damageType: 'cryo',
                    attackScale: percentages([267, 294, 320, 347, 374, 400, 427, 454, 480, 514, 554, 600]),
                    tags: ['normalAttack'],
                  }, '17:ultimateAttackEnd11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[2]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:19'),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTagIds: [1535684437],
                    reason: 'early',
                  }),
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
        28,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_end', 'buff_chr_0017_yvonne_ultimate_skill_layer'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        67,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    'atk_scale_extra': [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    'poise': 20,
    'atk_up': 0.3,
    'atk_up_true': 0,
    'crit_dmg_up': 0.15,
    'crit_dmg_up_true': 0,
    'stack': 0,
  },
);

export const yvonneGeneratedOperator: OperatorDefinition = {
  slug: 'yvonne',
  gameId: 'YVONNE',
  rarity: 6,
  weaponType: 'handcannon',
  element: 'cryo',
  role: 'striker',
  mainAttribute: 'intellect',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [8, 24, 40, 57, 74, 82],
    agility: [14, 38, 64, 89, 115, 128],
    intellect: [24, 57, 91, 125, 159, 176],
    will: [10, 30, 52, 73, 94, 105],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [yvonneBasicAttack1, yvonneBasicAttack2, yvonneBasicAttack3, yvonneBasicAttack4, yvonneBasicAttack5], variants: [{ key: 'enhancedBasicAttack', levelSource: 'ultimate', skills: [yvonneUltimateAttack1, yvonneUltimateAttack2A, yvonneUltimateAttack2B, yvonneUltimateAttack3A, yvonneUltimateAttack3B, yvonneUltimateAttackEnd] }] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: yvonneFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: yvonnePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: yvonneBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: yvonneUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: yvonneComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0017_yvonne_potential_5_effect': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0017_yvonne_potential_5_cd': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'cd' },
      blackboard: {
        'cd': 0,
      },
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_potential_5_effect'],
            reason: 'other',
          }),
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_potential_5_effect',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0017_yvonne_normal_skill_frozen': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'atk_scale2': 1,
        'crit_up': 0.7,
      },
    },
    'buff_chr_0017_yvonne_normal_skill_listener': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale2': 0,
        'crit_up': 0,
      },
      abilityEventResponses: [
        {
          event: 'beforeOutputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffTagsMatch',
                  match: 'hasAny',
                  buffTagIds: [1535684437],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_normal_skill_frozen',
                    target: 'eventTarget',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'crit_up': { kind: 'blackboard', key: 'crit_up' },
                      'atk_scale2': { kind: 'blackboard', key: 'atk_scale2' },
                    },
                  }),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0017_yvonne_normal_skill_projectile': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atb_return': 0,
        'atk_scale': 0,
        'atk_scale2': 0,
        'atk_scale_layer': 0,
        'consume_cnt': 0,
        'count': 0,
        'gained_atb': 0,
        'has_potential2': 0,
        'poise': 0,
        'usp_base': 0,
        'usp_layer': 0,
      },
      lifecycleSequences: {
        finish: sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'caster',
              tagQueryType: 'exceptAny',
              tagIds: [430405417, 839947434, -1666491964, -1855674685, 1253324189, 1015258574, -1472906513, -1486085048],
            },
            sequence(
              sequence(
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'has_potential2' },
                        operator: 'greaterOrEqual',
                        right: { kind: 'constant', value: 1 },
                      },
                      { kind: 'singleEnemyPresent' },
                    ],
                  },
                  sequence(
                    branch(
                      {
                        kind: 'buffStackCompare',
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTagIds: [1570888476, -1411846745],
                        operator: 'greaterOrEqual',
                        value: { kind: 'constant', value: 1 },
                      },
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
                            step('readBuffStackCount', {
                              target: 'buffOwner',
                              outputKey: 'count',
                              query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1570888476] },
                            }),
                            step('calculateActionValue', {
                              key: 'atk_scale_final',
                              operation: 'multiply',
                              left: { kind: 'blackboard', key: 'atk_scale_layer' },
                              right: { kind: 'blackboard', key: 'count' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale2' },
                            }),
                            step('changeResourceByActionValue', {
                              resource: 'sp',
                              amount: { kind: 'blackboard', key: 'atb_return' },
                              recipient: 'team',
                              spGainKind: 'refund',
                              spGainSource: 'skill',
                            }),
                            step('dealDamage', {
                              damageType: 'cryo',
                              attackScale: percentage(0),
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[6]11:actionOrder2:18'),
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'count' },
                                operator: 'greater',
                                right: { kind: 'blackboard', key: 'max_count' },
                              },
                              sequence(
                                step('modifyActionValue', {
                                  key: 'max_count',
                                  operation: 'assign',
                                  value: { kind: 'blackboard', key: 'count' },
                                }),
                              ),
                            ),
                          ),
                          sequence(
                            step('readBuffStackCount', {
                              target: 'buffOwner',
                              outputKey: 'count',
                              query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1411846745] },
                            }),
                            step('calculateActionValue', {
                              key: 'atk_scale_final',
                              operation: 'multiply',
                              left: { kind: 'blackboard', key: 'atk_scale_layer' },
                              right: { kind: 'blackboard', key: 'count' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale2' },
                            }),
                            step('changeResourceByActionValue', {
                              resource: 'sp',
                              amount: { kind: 'blackboard', key: 'atb_return' },
                              recipient: 'team',
                              spGainKind: 'refund',
                              spGainSource: 'skill',
                            }),
                            step('dealDamage', {
                              damageType: 'cryo',
                              attackScale: percentage(0),
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[6]11:actionOrder2:27'),
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'count' },
                                operator: 'greater',
                                right: { kind: 'blackboard', key: 'max_count' },
                              },
                              sequence(
                                step('modifyActionValue', {
                                  key: 'max_count',
                                  operation: 'assign',
                                  value: { kind: 'blackboard', key: 'count' },
                                }),
                              ),
                            ),
                          ),
                          { alwaysNext: true },
                        ),
                      ),
                      sequence(
                        step('modifyActionValue', {
                          key: 'atk_scale_final',
                          operation: 'assign',
                          value: { kind: 'blackboard', key: 'atk_scale' },
                        }),
                        step('changeResourceByActionValue', {
                          resource: 'sp',
                          amount: { kind: 'blackboard', key: 'atb_return' },
                          recipient: 'team',
                          spGainKind: 'refund',
                          spGainSource: 'skill',
                        }),
                        step('dealDamage', {
                          damageType: 'cryo',
                          attackScale: percentage(0),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]6:action10:actionData3:[0]11:failActions10:actionData3:[2]11:actionOrder2:32'),
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'count' },
                            operator: 'greater',
                            right: { kind: 'blackboard', key: 'max_count' },
                          },
                          sequence(
                            step('modifyActionValue', {
                              key: 'max_count',
                              operation: 'assign',
                              value: { kind: 'blackboard', key: 'count' },
                            }),
                          ),
                        ),
                      ),
                      { alwaysNext: true },
                    ),
                    step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'max_count' },
                        operator: 'greater',
                        right: { kind: 'constant', value: 0 },
                      },
                      sequence(
                        step('calculateActionValue', {
                          key: 'usp_final',
                          operation: 'multiply',
                          left: { kind: 'blackboard', key: 'usp_layer' },
                          right: { kind: 'blackboard', key: 'max_count' },
                        }),
                        step('modifyActionValue', {
                          key: 'usp_final',
                          operation: 'add',
                          value: { kind: 'blackboard', key: 'usp_base' },
                        }),
                        step('changeResourceByActionValue', {
                          resource: 'ultimateEnergy',
                          amount: { kind: 'blackboard', key: 'usp_final' },
                          recipient: 'caster',
                        }),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  sequence(
                    branch(
                      {
                        kind: 'buffStackCompare',
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTagIds: [1570888476, -1411846745],
                        operator: 'greaterOrEqual',
                        value: { kind: 'constant', value: 1 },
                      },
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
                            step('readBuffStackCount', {
                              target: 'buffOwner',
                              outputKey: 'count',
                              query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1570888476] },
                            }),
                            step('calculateActionValue', {
                              key: 'atk_scale_final',
                              operation: 'multiply',
                              left: { kind: 'blackboard', key: 'atk_scale_layer' },
                              right: { kind: 'blackboard', key: 'count' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale2' },
                            }),
                            step('dealDamage', {
                              damageType: 'cryo',
                              attackScale: percentage(0),
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[5]11:actionOrder2:52'),
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'count' },
                                operator: 'greater',
                                right: { kind: 'blackboard', key: 'max_count' },
                              },
                              sequence(
                                step('modifyActionValue', {
                                  key: 'max_count',
                                  operation: 'assign',
                                  value: { kind: 'blackboard', key: 'count' },
                                }),
                              ),
                            ),
                          ),
                          sequence(
                            step('readBuffStackCount', {
                              target: 'buffOwner',
                              outputKey: 'count',
                              query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1411846745] },
                            }),
                            step('calculateActionValue', {
                              key: 'atk_scale_final',
                              operation: 'multiply',
                              left: { kind: 'blackboard', key: 'atk_scale_layer' },
                              right: { kind: 'blackboard', key: 'count' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale' },
                            }),
                            step('modifyActionValue', {
                              key: 'atk_scale_final',
                              operation: 'add',
                              value: { kind: 'blackboard', key: 'atk_scale2' },
                            }),
                            step('dealDamage', {
                              damageType: 'cryo',
                              attackScale: percentage(0),
                              tags: ['normalSkill'],
                              features: ['canBreakWeakness'],
                              stagger: { kind: 'blackboard', key: 'poise' },
                            }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[5]11:actionOrder2:60'),
                            branch(
                              {
                                kind: 'actionValueCompare',
                                left: { kind: 'blackboard', key: 'count' },
                                operator: 'greater',
                                right: { kind: 'blackboard', key: 'max_count' },
                              },
                              sequence(
                                step('modifyActionValue', {
                                  key: 'max_count',
                                  operation: 'assign',
                                  value: { kind: 'blackboard', key: 'count' },
                                }),
                              ),
                            ),
                          ),
                          { alwaysNext: true },
                        ),
                      ),
                      sequence(
                        step('modifyActionValue', {
                          key: 'atk_scale_final',
                          operation: 'assign',
                          value: { kind: 'blackboard', key: 'atk_scale' },
                        }),
                        step('dealDamage', {
                          damageType: 'cryo',
                          attackScale: percentage(0),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: { kind: 'blackboard', key: 'poise' },
                        }, '53:buff_chr_0017_yvonne_normal_skill_projectile:finish:011:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[0]6:action10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:64'),
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'count' },
                            operator: 'greater',
                            right: { kind: 'blackboard', key: 'max_count' },
                          },
                          sequence(
                            step('modifyActionValue', {
                              key: 'max_count',
                              operation: 'assign',
                              value: { kind: 'blackboard', key: 'count' },
                            }),
                          ),
                        ),
                      ),
                      { alwaysNext: true },
                    ),
                    step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                    branch(
                      {
                        kind: 'actionValueCompare',
                        left: { kind: 'blackboard', key: 'max_count' },
                        operator: 'greater',
                        right: { kind: 'constant', value: 0 },
                      },
                      sequence(
                        step('calculateActionValue', {
                          key: 'usp_final',
                          operation: 'multiply',
                          left: { kind: 'blackboard', key: 'usp_layer' },
                          right: { kind: 'blackboard', key: 'max_count' },
                        }),
                        step('modifyActionValue', {
                          key: 'usp_final',
                          operation: 'add',
                          value: { kind: 'blackboard', key: 'usp_base' },
                        }),
                        step('changeResourceByActionValue', {
                          resource: 'ultimateEnergy',
                          amount: { kind: 'blackboard', key: 'usp_final' },
                          recipient: 'caster',
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
        ),
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_potential4_valid': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'ex_usp_up': 0,
        'is_recover': 0,
      },
      lifecycleSequences: {
        finish: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'is_recover' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'ex_usp_up' },
                recipient: 'caster',
                isPercentValue: true,
                ultimateRecoveryTagId: 669811152,
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0017_yvonne_potential_5_new': {
      stackingType: 'highPriority',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk_up': 0,
        'crit_dmg_up': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'crit_dmg_up' },
        },
      ],
    },
    'buff_chr_0017_yvonne_ultimate_skill_robot_end': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0017_yvonne_ultimate_skill_end': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'AttentionDebuff',
        },
      },
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration_end' },
      applyTagIds: [-388303696],
      blackboard: {
        'atk_up': 0,
        'crit_dmg_up': 0,
        'duration_end': 3,
        'has_potential5': 0,
      },
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'has_potential5' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_potential_5_new',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'crit_dmg_up': { kind: 'blackboard', key: 'crit_dmg_up' },
                },
              }),
            ),
          ),
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          }),
        ),
        finish: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
          forEachContextTarget(
            'robots',
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_shield'],
            reason: 'other',
          }),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_environment'],
            reason: 'other',
          }),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_potential4_valid'],
            reason: 'other',
          }),
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_full_effect'],
            reason: 'other',
          }),
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer'],
            reason: 'other',
          }),
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0017_yvonne_ultimate_skill_layer_effect'],
            reason: 'other',
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 10 },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'ownerHpZero',
          priority: 0,
          sequence:
            sequence(
              step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
              forEachContextTarget(
                'robots',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0017_yvonne_ultimate_skill': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'AttentionDebuff',
        },
      },
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [-388303696],
      blackboard: {
        'atk_up': 0,
        'crit_dmg_up': 0,
        'duration': 0,
        'ex_usp_up': 0,
        'has_potential4': 0,
        'has_potential5': 0,
      },
      lifecycleSequences: {
        start: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'has_potential4' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_potential4_valid',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'ex_usp_up': { kind: 'blackboard', key: 'ex_usp_up' },
                },
              }),
            ),
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'has_potential5' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_potential_5_new',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'crit_dmg_up': { kind: 'blackboard', key: 'crit_dmg_up' },
                },
              }),
            ),
          ),
        ),
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_end',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'crit_dmg_up': { kind: 'blackboard', key: 'crit_dmg_up' },
              'has_potential5': { kind: 'blackboard', key: 'has_potential5' },
            },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'ownerHpZero',
          priority: 0,
          sequence:
            sequence(
              step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'robots', abilityEntityIds: ['abilityentity_chr_0017_yvonne_ultimate_skill', 'abilityentity_chr_0017_yvonne_ultimate_skill2', 'abilityentity_chr_0017_yvonne_ultimate_skill3'] }),
              forEachContextTarget(
                'robots',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0017_yvonne_ultimate_skill_robot_end',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0017_yvonne_ultimate_skill_camera_child': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0017_yvonne_ultimate_skill_camera': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0.033,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera_child',
            target: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        trigger: sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('finishBuffsById', {
                target: 'buffSource',
                buffIds: ['buff_chr_0017_yvonne_ultimate_skill_camera_child'],
                reason: 'other',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_ultimate_skill_camera_child',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_layer': {
      stackingType: 'enhanceAndRefresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_yvonne_buff',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'CommonCharBuff',
        },
      },
      priority: 0,
      maxStackCount: 10,
      durationSeconds: { blackboardKey: 'recycle_time' },
      blackboard: {
        'crit_rate_up': 0.06,
        'crit_rate_up_dynamic': 0,
        'normal_dmg_up': 0.03,
        'recycle_time': 4,
      },
      attributeModifiers: [
        {
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'normal_dmg_up' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'crit_rate_up_dynamic' },
        },
      ],
      lifecycleSequences: {
        enhanceChanged: sequence(
          step('modifyActionValue', {
            key: 'crit_rate_up_dynamic',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'crit_rate_up' },
          }),
        ),
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_layer_effect': {
      stackingType: 'enhanceAndRefresh',
      priority: 0,
      maxStackCount: 10,
      durationSeconds: { blackboardKey: 'recycle_time' },
      blackboard: {
        'recycle_time': 4,
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_voice_start': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 9,
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_shield': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'effect_duration' },
      blackboard: {
        'effect_duration': 0,
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_voice': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 9,
      },
    },
    'buff_chr_0017_yvonne_ultimate_skill_voice_short': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 3.5,
      },
    },
    'buff_chr_0017_yvonne_talent_1_valid': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: 15,
      blackboard: {
        'dmg_up': 0.5,
      },
    },
    'buff_chr_0017_yvonne_talent_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'dmg_up': 0.5,
      },
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffIdMatch',
                  buffIds: ['buff_chr_0017_yvonne_normal_skill_frozen'],
                },
                sequence(
                  branch(
                    { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0017_yvonne_talent_1' } },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_talent_1_valid',
                        target: 'buffSource',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'dmg_up': { kind: 'blackboard', key: 'dmg_up' },
                        },
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'chr_0017_yvonne_talent_1',
                        durationSeconds: { kind: 'constant', value: 0.1 },
                        autoFinishByAction: false,
                      }),
                    ),
                  ),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0017_yvonne_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'inflict_up': 0,
        'status_up': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'hasAny',
                tagIds: [1570888476],
              },
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'exceptAny',
                tagIds: [1535684437],
              },
            ],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'inflict_up' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'hasAny',
                tagIds: [1535684437],
              },
              {
                kind: 'entityTagMatch',
                target: 'enemy',
                tagQueryType: 'exceptAny',
                tagIds: [1570888476],
              },
            ],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'status_up' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'entityTagMatch',
            target: 'enemy',
            tagQueryType: 'hasAll',
            tagIds: [1570888476, 1535684437],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'status_up' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0017_yvonne_combo_skill': { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
        skillId: 'chr_0017_yvonne_combo_skill_abilityrange',
        blackboard: {
          'atk_scale_boom': 0,
          'atk_scale_tick': 0,
          'duration': 0,
          'has_potential1': 0,
          'interval': 0.75,
          'maxcnt': 6,
          'poise': 10,
          'radius': 0,
          'usp': 0,
          'usp_extra': 0,
        },
        scheduledSequences: [
          scheduled(
            19,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0017_yvonne_combo_skill',
                definition: {
                  stackingType: 'unique',
                  priority: 0,
                  maxStackCount: 0,
                  durationSeconds: { blackboardKey: 'duration' },
                  triggerIntervalSeconds: { blackboardKey: 'interval' },
                  waitFirstTriggerInterval: false,
                  maxTriggerCount: { blackboardKey: 'maxcnt' },
                  blackboard: {
                    'atk_multiplier': 1.5,
                    'atk_scale_boom': 0,
                    'atk_scale_tick': 0,
                    'count': 2,
                    'duration': 0,
                    'has_added_usp': 0,
                    'has_potential1': 0,
                    'interval': 0.75,
                    'maxcnt': 4,
                    'poise': 0,
                    'radius': 0,
                    'usp': 10,
                  },
                  lifecycleSequences: {
                    finish: sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0017_yvonne_combo_skill_finish',
                        definition: {
                          stackingType: 'unique',
                          priority: 0,
                          maxStackCount: 0,
                          durationSeconds: 0.72,
                          triggerIntervalSeconds: 0.5,
                          waitFirstTriggerInterval: true,
                          maxTriggerCount: 999,
                          blackboard: {
                            'atk_scale_boom': 0,
                            'atk_scale_tick': 0,
                            'count': 0,
                            'duration': 0,
                            'had_added_usp': 0,
                            'has_potential1': 0,
                            'poise': 0,
                            'radius': 0,
                            'usp': 0,
                          },
                          lifecycleSequences: {
                            trigger: sequence(
                              step('applyBuff', {
                                buffId: 'buff_common_cryst_cryst_frozen_triggered',
                                definition: {
                                  stackingType: 'unlimited',
                                  priority: 0,
                                  maxStackCount: 1,
                                  durationSeconds: 3,
                                  blackboard: {
                                    'consumed_layer': 0,
                                    'consumed_type': 2,
                                    'count': 1,
                                    'duration': 0,
                                    'extra_duration': 0,
                                  },
                                  lifecycleSequences: {
                                    start: sequence(
                                      step('modifyActionValue', {
                                        key: 'duration',
                                        operation: 'add',
                                        value: { kind: 'blackboard', key: 'extra_duration' },
                                      }),
                                      step('applyBuff', {
                                        buffId: 'buff_common_cryst_cryst_frozen_triggered_do',
                                        definition: {
                                          stackingType: 'stack',
                                          presentation: {
                                            visible: true,
                                            iconId: 'icon_battle_frozen',
                                            showInHeadBarCommon: true,
                                            showInHeadBarAttached: false,
                                            showInSquadIcon: false,
                                            onlyShowForMainCharacter: false,
                                            iconStyleInSquad: 'SpellAbnormal',
                                            abnormalColorType: 'Cryst',
                                            orderPriority: {
                                              useDirectoryValue: false,
                                              value: 0,
                                              category: 'AttachedAndAbnormal',
                                            },
                                          },
                                          stackingKey: 'cryst_triggered',
                                          priority: 0,
                                          maxStackCount: 1,
                                          durationSeconds: { blackboardKey: 'duration' },
                                          triggerIntervalSeconds: 1,
                                          waitFirstTriggerInterval: true,
                                          maxTriggerCount: 1,
                                          applyTagIds: [1535684437],
                                          blackboard: {
                                            'count': 1,
                                            'duration': 5,
                                            'final_phy_dmg_up': 0,
                                            'phy_dmg_up': 0.2,
                                          },
                                          lifecycleSequences: {
                                            enable: sequence(
                                              step('applyBuff', {
                                                buffId: 'buff_common_frozen',
                                                definition: {
                                                  stackingType: 'stack',
                                                  priority: 0,
                                                  maxStackCount: 1,
                                                  durationSeconds: { blackboardKey: 'duration' },
                                                  blackboard: {
                                                    'duration': 9999,
                                                  },
                                                  lifecycleSequences: {
                                                    enable: sequence(
                                                      step('applyBuff', {
                                                        buffId: 'buff_common_do_frozen',
                                                        definition: {
                                                          stackingType: 'stack',
                                                          priority: 0,
                                                          maxStackCount: 1,
                                                          durationSeconds: { blackboardKey: 'duration' },
                                                          applyTagIds: [-717418722, 889346577],
                                                          blackboard: {
                                                            'duration': 9999,
                                                          },
                                                          lifecycleSequences: {
                                                            enable: sequence(
                                                              step('startTimeDilation', {
                                                                scope: 'entity',
                                                                durationSeconds: { kind: 'blackboard', key: 'duration' },
                                                                slot: -1855252810,
                                                                priority: 50,
                                                                curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
                                                                finishByAction: true,
                                                                targets: ['caster'],
                                                              }),
                                                            ),
                                                          },
                                                        },
                                                        target: 'buffOwner',
                                                        inheritSourceSkillCastInfo: true,
                                                        blackboardAssignments: {
                                                          'duration': { kind: 'blackboard', key: 'duration' },
                                                        },
                                                      }),
                                                    ),
                                                  },
                                                },
                                                target: 'buffOwner',
                                                inheritSourceSkillCastInfo: true,
                                                blackboardAssignments: {
                                                  'duration': { kind: 'blackboard', key: 'duration' },
                                                },
                                              }),
                                            ),
                                            start: sequence(
                                              step('applyBuff', {
                                                buffId: 'buff_common_cryst_triggered_start',
                                                definition: {
                                                  stackingType: 'unlimited',
                                                  priority: 0,
                                                  maxStackCount: 1,
                                                  durationSeconds: 3,
                                                  triggerIntervalSeconds: 0,
                                                  waitFirstTriggerInterval: false,
                                                  maxTriggerCount: 1,
                                                },
                                                target: 'buffOwner',
                                                inheritSourceSkillCastInfo: true,
                                              }),
                                              step('storeSourceAttributeValue', {
                                                attribute: { kind: 'specific', key: 'cryoAbnormalDamageIncrease' },
                                                stage: 'finalNonConverted',
                                                useFloor: false,
                                                divisor: { kind: 'constant', value: 1 },
                                                multiplier: { kind: 'blackboard', key: 'phy_dmg_up' },
                                                base: { kind: 'blackboard', key: 'phy_dmg_up' },
                                                targetKey: 'final_phy_dmg_up',
                                              }),
                                              step('applyBuff', {
                                                buffId: 'buff_common_cryst_triggered_fx',
                                                definition: {
                                                  stackingType: 'unlimited',
                                                  priority: 0,
                                                  maxStackCount: 0,
                                                  durationSeconds: 5,
                                                  triggerIntervalSeconds: 0,
                                                  waitFirstTriggerInterval: true,
                                                  maxTriggerCount: 1,
                                                },
                                                target: 'buffOwner',
                                                inheritSourceSkillCastInfo: true,
                                              }),
                                            ),
                                          },
                                        },
                                        target: 'buffOwner',
                                        inheritSourceSkillCastInfo: true,
                                        blackboardAssignments: {
                                          'count': { kind: 'blackboard', key: 'count' },
                                          'duration': { kind: 'blackboard', key: 'duration' },
                                          'consumed_type': { kind: 'blackboard', key: 'consumed_type' },
                                          'consumed_layer': { kind: 'blackboard', key: 'consumed_layer' },
                                        },
                                      }),
                                    ),
                                  },
                                },
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  'count': { kind: 'constant', value: 1 },
                                  'extra_duration': { kind: 'constant', value: 2 },
                                },
                              }),
                              step('dealDamage', {
                                damageType: 'cryo',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_boom' },
                                tags: ['comboSkill'],
                                features: ['canBreakWeakness'],
                                stagger: { kind: 'blackboard', key: 'poise' },
                              }, '49:buff_chr_0017_yvonne_combo_skill_finish:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[5]11:actionOrder1:9'),
                              branch(
                                {
                                  kind: 'all',
                                  conditions: [
                                    { kind: 'singleEnemyPresent' },
                                    {
                                      kind: 'not',
                                      condition: {
                                        kind: 'actionValueCompare',
                                        left: { kind: 'blackboard', key: 'had_added_usp' },
                                        operator: 'equal',
                                        right: { kind: 'constant', value: 1 },
                                      }
                                    },
                                  ],
                                },
                                sequence(
                                  step('changeResourceByActionValue', {
                                    resource: 'ultimateEnergy',
                                    amount: { kind: 'blackboard', key: 'usp' },
                                    recipient: 'caster',
                                  }),
                                ),
                                undefined,
                                { alwaysNext: true },
                              ),
                            ),
                          },
                        },
                        target: 'buffOwner',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'atk_scale_boom': { kind: 'blackboard', key: 'atk_scale_boom' },
                          'radius': { kind: 'blackboard', key: 'radius' },
                          'has_potential1': { kind: 'blackboard', key: 'has_potential1' },
                          'poise': { kind: 'blackboard', key: 'poise' },
                          'had_added_usp': { kind: 'blackboard', key: 'has_added_usp' },
                          'usp': { kind: 'blackboard', key: 'usp' },
                        },
                      }),
                    ),
                    trigger: sequence(
                      step('modifyActionValue', {
                        key: 'count',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                  },
                },
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'radius': { kind: 'blackboard', key: 'radius' },
                  'atk_scale_tick': { kind: 'blackboard', key: 'atk_scale_tick' },
                  'duration': { kind: 'blackboard', key: 'duration' },
                  'atk_scale_boom': { kind: 'blackboard', key: 'atk_scale_boom' },
                  'poise': { kind: 'blackboard', key: 'poise' },
                  'has_potential1': { kind: 'blackboard', key: 'has_potential1' },
                  'interval': { kind: 'blackboard', key: 'interval' },
                  'maxcnt': { kind: 'blackboard', key: 'maxcnt' },
                  'usp': { kind: 'blackboard', key: 'usp_extra' },
                },
              }),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0017_yvonne_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 50 } },
    'abilityentity_chr_0017_yvonne_ultimate_skill2': { lifetime: { kind: 'limited', durationSeconds: 50 } },
    'abilityentity_chr_0017_yvonne_ultimate_skill3': { lifetime: { kind: 'limited', durationSeconds: 50 } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'chr_0017_yvonne_talent_1',
          blackboard: {
            'dmg_up': [0, 0.5],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0017_yvonne_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'dmg_up': { kind: 'blackboard', key: 'dmg_up' },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'chr_0017_yvonne_talent_0',
          blackboard: {
            'inflict_up': [0.1, 0.2],
            'status_up': [0.2, 0.4],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0017_yvonne_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'inflict_up': { kind: 'blackboard', key: 'inflict_up' },
                'status_up': { kind: 'blackboard', key: 'status_up' },
              },
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
          skillGroupKey: 'comboSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'radius',
          operation: 'assign',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'interval',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'maxcnt',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'usp_extra',
          operation: 'assign',
          value: 25,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['intellect'],
          value: 20,
        },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'inflict_up',
          operation: 'add',
          value: 0.1,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0017_yvonne_talent_0',
          blackboardKey: 'status_up',
          operation: 'add',
          value: 0.2,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'has_potential2',
          operation: 'assign',
          value: 1,
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
          blackboardKey: 'has_potential5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttackEnd',
          blackboardKey: 'crit_dmg_up',
          operation: 'assign',
          value: 0.3,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'basicAttack',
          skillKey: 'ultimateAttackEnd',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.1,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
