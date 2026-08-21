/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

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
            definition: { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
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
                    step('applyBuff', {
                      buffId: 'buff_chr_0017_yvonne_combo_skill_tutorial_marker',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                    }),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp' },
                      recipient: 'caster',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0017_yvonne_combo_skill',
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
    'has_potential1': 0,
    'radius': 4,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_power_attack',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
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
              ),
            ),
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
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill', definition: { lifetime: { kind: 'limited', durationSeconds: 50 } }, dieWhenSourceDies: false, inheritActionBlackboard: true }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill2', definition: { lifetime: { kind: 'limited', durationSeconds: 50 } }, dieWhenSourceDies: false, inheritActionBlackboard: true }),
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0017_yvonne_ultimate_skill3', definition: { lifetime: { kind: 'limited', durationSeconds: 50 } }, dieWhenSourceDies: false, inheritActionBlackboard: true }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_full_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          ),
        ),
      ),
      scheduled(
        5,
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
      ),
      scheduled(
        8,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack2A10:projectile29:chr_0017_yvonne_ult_attack2_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:551:02:571:01:1'),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack2A10:projectile29:chr_0017_yvonne_ult_attack2_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:751:02:771:01:1'),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack2A10:projectile29:chr_0017_yvonne_ult_attack2_135:chr_0017_yvonne_ult_attack2_projhit11:actionOrder2:951:02:971:01:1'),
        ),
      ),
      scheduled(
        21,
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
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          }, '16:ultimateAttack2A10:projectile29:chr_0017_yvonne_ult_attack2_135:chr_0017_yvonne_ult_attack1_projhit11:actionOrder3:1151:03:1171:01:1'),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        1,
        sequence(
          sequence(
            step('dealDamage', {
              damageType: 'cryo',
              attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
              tags: ['normalAttack'],
            }, '16:ultimateAttack2B11:conditional19:timelineActions[23]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:411:1'),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack2B10:projectile29:chr_0017_yvonne_ult_attack2_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:571:02:591:01:1'),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        7,
        sequence(
          sequence(
            step('dealDamage', {
              damageType: 'cryo',
              attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
              tags: ['normalAttack'],
            }, '16:ultimateAttack2B11:conditional19:timelineActions[25]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]35:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:811:1'),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
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
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8.9, 9.8, 10.7, 11.6, 12.5, 13.4, 14.3, 15.1, 16, 17.2, 18.5, 20]),
            tags: ['normalAttack'],
          }, '16:ultimateAttack2B10:projectile29:chr_0017_yvonne_ult_attack2_235:chr_0017_yvonne_ult_attack1_projhit11:actionOrder2:971:02:991:01:1'),
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
                  ),
                ),
              ),
            ),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.5 },
            },
          }),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
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
                  ),
                ),
              ),
            ),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_shield',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'effect_duration': { kind: 'constant', value: 0.2 },
            },
          }),
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        5,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        7,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        9,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        11,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepr',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        13,
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
          step('applyBuff', {
            buffId: 'buff_chr_0017_yvonne_ultimate_skill_wepl',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        15,
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
              ),
            ),
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
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
