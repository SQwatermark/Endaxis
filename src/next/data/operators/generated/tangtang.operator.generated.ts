/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, once, percentage, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const tangtangBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0027_tangtang_attack1',
    timelineBlockFrames: 7,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([23, 25, 27, 29, 32, 34, 36, 39, 41, 44, 47, 51]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile25:chr_0027_tangtang_attack133:chr_0027_tangtang_attack1_projhit11:actionOrder1:61:0'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.39, 0.41, 0.44, 0.47, 0.51],
  },
);

export const tangtangBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0027_tangtang_attack2',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0027_tangtang_attack233:chr_0027_tangtang_attack2_projhit11:actionOrder1:51:0'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0027_tangtang_attack236:chr_0027_tangtang_attack2_02_projhit11:actionOrder1:61:0'),
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
    'atk_scale_1': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.23],
    'atk_scale_2': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const tangtangBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0027_tangtang_attack3',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct25:chr_0027_tangtang_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0027_tangtang_attack333:chr_0027_tangtang_attack3_projhit11:actionOrder2:141:0'),
        ),
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0027_tangtang_attack333:chr_0027_tangtang_attack3_projhit11:actionOrder2:151:0'),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0027_tangtang_attack333:chr_0027_tangtang_attack3_projhit11:actionOrder2:161:0'),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0027_tangtang_attack333:chr_0027_tangtang_attack3_projhit11:actionOrder2:171:0'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale_1': [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
    'atk_scale_2': [0.03, 0.03, 0.03, 0.03, 0.04, 0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06],
    'display_atk_scale': [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.67, 0.73, 0.79],
  },
);

export const tangtangBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0027_tangtang_attack4',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0027_tangtang_attack411:actionOrder2:10'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0027_tangtang_attack411:actionOrder2:16'),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 43, 46]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct25:chr_0027_tangtang_attack411:actionOrder2:22'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale_1': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'atk_scale_2': [0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33, 0.35, 0.37, 0.39, 0.43, 0.46],
    'display_atk_scale': [0.37, 0.4, 0.44, 0.47, 0.51, 0.55, 0.58, 0.62, 0.66, 0.7, 0.76, 0.82],
  },
);

export const tangtangBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0027_tangtang_attack5',
    timelineBlockFrames: 36,
    scheduledSequences: [
      scheduled(
        22,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([50, 55, 60, 65, 70, 75, 80, 85, 90, 96, 104, 113]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
          }, '12:basicAttack510:projectile25:chr_0027_tangtang_attack533:chr_0027_tangtang_attack5_projhit11:actionOrder1:51:0'),
          branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'casterControlled' },
                { kind: 'singleEnemyPresent' },
              ],
            },
            sequence(
              step('dealStagger', {
                value: 18,
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_atk05_cnt' },
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
                    key: 'EntityBB_atk05_cnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
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
    'atb': 18,
    'atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    'poise': 18,
  },
);

export const tangtangFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0027_tangtang_power_attack',
    timelineBlockFrames: 48,
    scheduledSequences: [
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
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.3,
          }, '8:finisher6:direct30:chr_0027_tangtang_power_attack11:actionOrder2:11'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.7,
          }, '8:finisher6:direct30:chr_0027_tangtang_power_attack11:actionOrder2:28'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const tangtangPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0027_tangtang_plunging_attack_end',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack12:rootInterval37:chr_0027_tangtang_plunging_attack_end11:actionOrder1:31:01:4'),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack12:rootInterval37:chr_0027_tangtang_plunging_attack_end11:actionOrder1:31:11:4'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack12:rootInterval37:chr_0027_tangtang_plunging_attack_end11:actionOrder1:31:21:4'),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack12:rootInterval37:chr_0027_tangtang_plunging_attack_end11:actionOrder1:31:31:4'),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack12:rootInterval37:chr_0027_tangtang_plunging_attack_end11:actionOrder1:31:41:4'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    'display_atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const tangtangBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0027_tangtang_normal_skill',
    timelineBlockFrames: 50,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0027_tangtang_skillappear',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        24,
      ),
      scheduled(
        11,
        sequence(
          step('modifyActionValue', {
            key: 'tornado_atk_scale01',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water01' },
          }),
          step('modifyActionValue', {
            key: 'tornado_atk_scale02',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water02' },
          }),
          step('modifyActionValue', {
            key: 'tornado_atk_scale03',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water03' },
          }),
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'water', abilityEntityIds: ['abilityentity_chr_0027_tangtang_comboskill_water'] }),
          branch(
            {
              kind: 'contextTargetCountCompare',
              contextKey: 'water',
              operator: 'greaterOrEqual',
              value: 1,
            },
            sequence(
              forEachContextTarget(
                'water',
                sequence(
                  branch(
                    { kind: 'singleEnemyPresent' },
                    sequence(
                      step('modifyActionValue', {
                        key: 'water_cnt',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      forEachContextTarget(
                        'water',
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0027_tangtang_water_wake',
                            target: 'currentAbilityEntity',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'water_cnt' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_return' },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'water_cnt' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_return' },
                        coefficient: 2,
                        recipient: 'team',
                        spGainKind: 'refund',
                        spGainSource: 'skill',
                      }),
                    ),
                  ),
                ),
              ),
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_move',
                                dieWhenSourceDies: false,
                inheritActionBlackboard: true,
                target: 'caster',
                saveToContextKey: 'normalskill_watermove',
              }),
            ),
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_move',
                                dieWhenSourceDies: false,
                inheritActionBlackboard: true,
                target: 'caster',
                saveToContextKey: 'normalskill_watermove_1',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.8, 33.2, 36]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 2,
          }, '11:battleSkill6:direct30:chr_0027_tangtang_normal_skill11:actionOrder2:19'),
          once(
            'do-once:timelineActions[8]._sequenceActionData.actionData.[3]',
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.8, 33.2, 36]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 2,
          }, '11:battleSkill6:direct30:chr_0027_tangtang_normal_skill11:actionOrder2:19'),
          once(
            'do-once:timelineActions[8]._sequenceActionData.actionData.[3]',
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.8, 33.2, 36]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 2,
          }, '11:battleSkill6:direct30:chr_0027_tangtang_normal_skill11:actionOrder2:19'),
          once(
            'do-once:timelineActions[8]._sequenceActionData.actionData.[3]',
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ),
      ),
      scheduled(
        36,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.8, 33.2, 36]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 2,
          }, '11:battleSkill6:direct30:chr_0027_tangtang_normal_skill11:actionOrder2:19'),
          once(
            'do-once:timelineActions[8]._sequenceActionData.actionData.[3]',
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ),
      ),
      scheduled(
        39,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 17.6, 19.2, 20.8, 22.4, 24, 25.6, 27.2, 28.8, 30.8, 33.2, 36]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 2,
          }, '11:battleSkill6:direct30:chr_0027_tangtang_normal_skill11:actionOrder2:19'),
          once(
            'do-once:timelineActions[8]._sequenceActionData.actionData.[3]',
            sequence(
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'water_cnt': 0,
    'atb_return': 20,
    'atb_return_02': 40,
    'atk_scale_1': [0.16, 0.176, 0.192, 0.208, 0.224, 0.24, 0.256, 0.272, 0.288, 0.308, 0.332, 0.36],
    'display_atk_scale1': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'display_atk_scale2': [1.33, 1.47, 1.6, 1.74, 1.87, 2, 2.14, 2.27, 2.4, 2.57, 2.77, 3],
    'display_poise': 10,
    'duration_spellvulnerable': 15,
    'duration_tornado': 3,
    'poise1': 2,
    'poise_tornado': 0,
    'rate_spellvulnerable': [0.03, 0.03, 0.03, 0.035, 0.035, 0.035, 0.04, 0.04, 0.04, 0.045, 0.045, 0.05],
    'rate_spellvulnerable_02': [0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1],
  },
);

export const tangtangComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0027_tangtang_combo_skill',
    timelineBlockFrames: 31,
    cooldownFrames: [420, 420, 420, 420, 420, 420, 420, 420, 390, 390, 390, 360],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.867000043 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        23,
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
      scheduled(
        26,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'combowater_cnt' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'combowater_cnt',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              sequence(
                step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'water_group', abilityEntityIds: ['abilityentity_chr_0027_tangtang_comboskill_water'] }),
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0027_tangtang_water'],
                    operator: 'greater',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(
                    step('spawnAbilityEntity', {
                      abilityEntityId: 'abilityentity_chr_0027_tangtang_comboskill_water',
                                            dieWhenSourceDies: false,
                      inheritActionBlackboard: true,
                      saveToContextKey: 'water_abilityentity02',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0027_tangtang_water',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration_water': { kind: 'blackboard', key: 'duration_water' },
                      },
                    }),
                    branch(
                      { kind: 'abilityEntityTimedMarkerPresent', markerId: 'tangtang_waterabilityentity01', contextKey: 'water_group' },
                      sequence(
                        branch(
                          { kind: 'abilityEntityTimedMarkerPresent', markerId: 'tangtang_waterabilityentity02', contextKey: 'water_group' },
                          sequence(
                            forEachContextTarget(
                              'water_abilityentity02',
                              sequence(
                                step('createAbilityEntityTimedMarker', {
                                  markerId: 'tangtang_waterabilityentity03',
                                  durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                                  autoFinishByAction: false,
                                  timeDomain: 'global',
                                }),
                              ),
                            ),
                          ),
                          sequence(
                            forEachContextTarget(
                              'water_abilityentity02',
                              sequence(
                                step('createAbilityEntityTimedMarker', {
                                  markerId: 'tangtang_waterabilityentity02',
                                  durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                                  autoFinishByAction: false,
                                  timeDomain: 'global',
                                }),
                              ),
                            ),
                          ),
                        ),
                      ),
                      sequence(
                        forEachContextTarget(
                          'water_abilityentity02',
                          sequence(
                            step('createAbilityEntityTimedMarker', {
                              markerId: 'tangtang_waterabilityentity01',
                              durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                              autoFinishByAction: false,
                              timeDomain: 'global',
                            }),
                          ),
                        ),
                      ),
                    ),
                  ),
                  sequence(
                    step('spawnAbilityEntity', {
                      abilityEntityId: 'abilityentity_chr_0027_tangtang_comboskill_water',
                                            dieWhenSourceDies: false,
                      inheritActionBlackboard: true,
                      saveToContextKey: 'water_abilityentity01',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0027_tangtang_water',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration_water': { kind: 'blackboard', key: 'duration_water' },
                      },
                    }),
                    forEachContextTarget(
                      'water_abilityentity01',
                      sequence(
                        step('createAbilityEntityTimedMarker', {
                          markerId: 'tangtang_waterabilityentity01',
                          durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                          autoFinishByAction: false,
                          timeDomain: 'global',
                        }),
                      ),
                    ),
                  ),
                ),
                step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'water_group', abilityEntityIds: ['abilityentity_chr_0027_tangtang_comboskill_water'] }),
                branch(
                  {
                    kind: 'buffIdStackCompare',
                    target: 'caster',
                    buffIds: ['buff_chr_0027_tangtang_water'],
                    operator: 'greater',
                    value: { kind: 'constant', value: 0 },
                  },
                  sequence(
                    step('spawnAbilityEntity', {
                      abilityEntityId: 'abilityentity_chr_0027_tangtang_comboskill_water',
                                            dieWhenSourceDies: false,
                      inheritActionBlackboard: true,
                      saveToContextKey: 'water_abilityentity02',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0027_tangtang_water',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration_water': { kind: 'blackboard', key: 'duration_water' },
                      },
                    }),
                    branch(
                      { kind: 'abilityEntityTimedMarkerPresent', markerId: 'tangtang_waterabilityentity01', contextKey: 'water_group' },
                      sequence(
                        branch(
                          { kind: 'abilityEntityTimedMarkerPresent', markerId: 'tangtang_waterabilityentity02', contextKey: 'water_group' },
                          sequence(
                            forEachContextTarget(
                              'water_abilityentity02',
                              sequence(
                                step('createAbilityEntityTimedMarker', {
                                  markerId: 'tangtang_waterabilityentity03',
                                  durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                                  autoFinishByAction: false,
                                  timeDomain: 'global',
                                }),
                              ),
                            ),
                          ),
                          sequence(
                            forEachContextTarget(
                              'water_abilityentity02',
                              sequence(
                                step('createAbilityEntityTimedMarker', {
                                  markerId: 'tangtang_waterabilityentity02',
                                  durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                                  autoFinishByAction: false,
                                  timeDomain: 'global',
                                }),
                              ),
                            ),
                          ),
                        ),
                      ),
                      sequence(
                        forEachContextTarget(
                          'water_abilityentity02',
                          sequence(
                            step('createAbilityEntityTimedMarker', {
                              markerId: 'tangtang_waterabilityentity01',
                              durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                              autoFinishByAction: false,
                              timeDomain: 'global',
                            }),
                          ),
                        ),
                      ),
                    ),
                  ),
                  sequence(
                    step('spawnAbilityEntity', {
                      abilityEntityId: 'abilityentity_chr_0027_tangtang_comboskill_water',
                                            dieWhenSourceDies: false,
                      inheritActionBlackboard: true,
                      saveToContextKey: 'water_abilityentity01',
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0027_tangtang_water',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration_water': { kind: 'blackboard', key: 'duration_water' },
                      },
                    }),
                    forEachContextTarget(
                      'water_abilityentity01',
                      sequence(
                        step('createAbilityEntityTimedMarker', {
                          markerId: 'tangtang_waterabilityentity01',
                          durationSeconds: { kind: 'blackboard', key: 'duration_water' },
                          autoFinishByAction: false,
                          timeDomain: 'global',
                        }),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([106.7, 117.3, 128, 138.7, 149.4, 160, 170.7, 181.4, 192, 205.4, 221.4, 240]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct29:chr_0027_tangtang_combo_skill11:actionOrder2:34'),
          step('dealStagger', {
            value: 10,
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'tar_cnt' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
              step('modifyActionValue', {
                key: 'tar_cnt',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'combowater_cnt': 0,
    'tar_cnt': 0,
    'atk_scale': [1.067, 1.173, 1.28, 1.387, 1.494, 1.6, 1.707, 1.814, 1.92, 2.054, 2.214, 2.4],
    'duration_water': 30,
    'poise': 10,
    'usp': 10,
  },
);

export const tangtangUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0027_tangtang_ultimate_skill',
    timelineBlockFrames: 85,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
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
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0027_tangtang_ultskill_vfx'],
            reason: 'other',
          }),
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
        82,
      ),
      scheduled(
        76,
        sequence(
          step('modifyActionValue', {
            key: 'tornado_atk_scale01',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water01' },
          }),
          step('modifyActionValue', {
            key: 'tornado_atk_scale02',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water02' },
          }),
          step('modifyActionValue', {
            key: 'tornado_atk_scale03',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_water03' },
          }),
          step('modifyActionValue', {
            key: 'rate_spellvulnerable',
            operation: 'add',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_rate_spellvulnerable' },
          }),
          step('modifyActionValue', {
            key: 'rate_spellvulnerable_02',
            operation: 'add',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_rate_spellvulnerable_02' },
          }),
          step('modifyActionValue', {
            key: 'duration_spellvulnerable',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'EntityBB_abilityentity_duration_spellvulnerable' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent2' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'talent2_ultskill',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            sequence(),
          ),
        ),
      ),
      scheduled(
        76,
        sequence(
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0027_tangtang_ultskill',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
        ),
      ),
      scheduled(
        76,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        92,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        107,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        123,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        139,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        155,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        171,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        187,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:01:4'),
        ),
      ),
      scheduled(
        196,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([177.8, 195.6, 213.4, 231.1, 248.9, 266.7, 284.5, 302.3, 320, 342.3, 368.9, 400]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 15,
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:02:14'),
        ),
      ),
      scheduled(
        209,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([311.1, 342.2, 373.4, 404.5, 435.6, 466.7, 497.8, 528.9, 560, 598.9, 645.6, 700]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '8:ultimate13:abilityEntity32:chr_0027_tangtang_ultimate_skill34:chr_0027_tangtang_ultimate_skill_111:actionOrder2:331:02:23'),
        ),
      ),
    ],
  },
  {
    'talent2': 0,
    'talent2_ultskill': 0,
    'atk_scale_1': [0.178, 0.196, 0.213, 0.231, 0.249, 0.267, 0.284, 0.302, 0.32, 0.342, 0.369, 0.4],
    'atk_scale_2': [1.778, 1.956, 2.134, 2.311, 2.489, 2.667, 2.845, 3.023, 3.2, 3.423, 3.689, 4],
    'atk_scale_3': [3.111, 3.422, 3.734, 4.045, 4.356, 4.667, 4.978, 5.289, 5.6, 5.989, 6.456, 7],
    'display_atk_scale': [1.42, 1.56, 1.71, 1.85, 1.99, 2.13, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'display_duration': 4,
    'poise2': 15,
    'poise3': 20,
  },
);

export const tangtangGeneratedOperator: OperatorDefinition = {
  slug: 'tangtang',
  gameId: 'TANGTANG',
  rarity: 6,
  weaponType: 'handcannon',
  element: 'cryo',
  role: 'caster',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 37, 61, 86, 111, 123],
    agility: [23, 56, 91, 126, 162, 179],
    intellect: [8, 25, 42, 59, 77, 85],
    will: [10, 29, 50, 71, 91, 102],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [tangtangBasicAttack1, tangtangBasicAttack2, tangtangBasicAttack3, tangtangBasicAttack4, tangtangBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: tangtangFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: tangtangPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: tangtangBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: tangtangUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: tangtangComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0027_tangtang_skillappear_effect': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0027_tangtang_skillappear': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: -1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0027_tangtang_skillappear_effect',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
    },
    'buff_chr_0027_tangtang_water_wake': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.1,
    },
    'buff_chr_0027_tangtang_water': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: { blackboardKey: 'water_stack' },
      durationSeconds: { blackboardKey: 'duration_water' },
      blackboard: {
        'duration_water': 30,
        'water_stack': 2,
      },
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0027_tangtang_normal_skill_03': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit_2',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0,
          'dmg_up_water_ult': 0.3,
          'duration': 5,
          'duration_spellvulnerable': 10,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 3,
          'hit_spelllnflictionmax02': 1,
          'hit_spellvulnerablemax': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'rate_spellvulnerable': 0.05,
          'rate_spellvulnerable_02': 0.1,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill_03_02': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit_2',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0,
          'dmg_up_water_ult': 0.3,
          'duration': 5,
          'duration_spellvulnerable': 10,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 3,
          'hit_spelllnflictionmax02': 1,
          'hit_spellvulnerablemax': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'rate_spellvulnerable': 0.05,
          'rate_spellvulnerable_02': 0.1,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill_03_03': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit_2',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0,
          'dmg_up_water_ult': 0.3,
          'duration': 5,
          'duration_spellvulnerable': 10,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 3,
          'hit_spelllnflictionmax02': 1,
          'hit_spellvulnerablemax': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'rate_spellvulnerable': 0.05,
          'rate_spellvulnerable_02': 0.1,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable_02' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill_02': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit_1',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0.2,
          'dmg_up_water_ult': 0,
          'duration': 5,
          'duration_spellvulnerable': 10,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 3,
          'hit_spelllnflictionmax02': 1,
          'hit_spellvulnerablemax': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'rate_spellvulnerable': 0.05,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill_02_02': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit_1',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0.2,
          'dmg_up_water_ult': 0,
          'duration': 5,
          'duration_spellvulnerable': 10,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 3,
          'hit_spelllnflictionmax02': 1,
          'hit_spellvulnerablemax': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'rate_spellvulnerable': 0.05,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax02' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_normalskill_spellvulnerable'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spellvulnerablemax' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_normalskill_spellvulnerable',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration_spellvulnerable': { kind: 'blackboard', key: 'duration_spellvulnerable' },
                      'rate_spellvulnerable': { kind: 'blackboard', key: 'rate_spellvulnerable' },
                    },
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:13'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_water_projhit',
        blackboard: {
          'atb': 0,
          'atk_scale_1': 0,
          'atk_scale_2': 0,
          'atk_water': 0,
          'dmg_up_water_ult': 0.3,
          'duration': 5,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 5,
          'hit_spelllnflictionmax_01': 1,
          'poise_tornado': 0,
          'potential3': 0,
          'potential5': 0,
          'talent2': 0,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[2]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            8,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            16,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            24,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            32,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            39,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[8]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            55,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            63,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[10]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            71,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            79,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            86,
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                  sameSourceSkillCast: true,
                  operator: 'less',
                  value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'tornado_atk_scale01' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
            ),
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_normal_skill_move': { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
        skillId: 'chr_0027_tangtang_normal_skill_abilityentitymove',
        blackboard: {
          'atk_scale': 0.1,
          'atk_scale_03': 0,
          'duration': 5,
          'hit_cnt': 4,
          'hit_cntmax': 10,
          'hit_duration': 5,
          'poise': 5,
          'poise_tornado': 0,
          'water_cnt': 0,
        },
        scheduledSequences: [
          scheduled(
            12,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'water_cnt' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'water_cnt' },
                      operator: 'greaterOrEqual',
                      right: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_03',
                                                          dieWhenSourceDies: false,
                        inheritActionBlackboard: true,
                        target: 'caster',
                      }),
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_03_02',
                                                          dieWhenSourceDies: false,
                        inheritActionBlackboard: true,
                        target: 'caster',
                      }),
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_03_03',
                                                          dieWhenSourceDies: false,
                        inheritActionBlackboard: true,
                        target: 'caster',
                      }),
                      step('modifyActionValue', {
                        key: 'water_cnt',
                        operation: 'assign',
                        value: { kind: 'constant', value: 0 },
                      }),
                    ),
                    sequence(
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_02',
                                                          dieWhenSourceDies: false,
                        inheritActionBlackboard: true,
                        target: 'caster',
                      }),
                      step('spawnAbilityEntity', {
                        abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill_02_02',
                                                          dieWhenSourceDies: false,
                        inheritActionBlackboard: true,
                        target: 'caster',
                      }),
                      step('modifyActionValue', {
                        key: 'water_cnt',
                        operation: 'assign',
                        value: { kind: 'constant', value: 0 },
                      }),
                    ),
                  ),
                ),
                sequence(
                  step('spawnAbilityEntity', {
                    abilityEntityId: 'abilityentity_chr_0027_tangtang_normal_skill',
                                                  dieWhenSourceDies: false,
                    inheritActionBlackboard: true,
                    target: 'caster',
                  }),
                  step('modifyActionValue', {
                    key: 'water_cnt',
                    operation: 'assign',
                    value: { kind: 'constant', value: 0 },
                  }),
                ),
              ),
            ),
          ),
          scheduled(
            298,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_comboskill_water': { lifetime: { kind: 'limited', durationSeconds: 62 }, childSkill: {
        skillId: 'chr_0027_tangtang_combo_skill_water',
        blackboard: {
          'atk_scale_water': 1,
          'duration_talent1buff': 3,
          'max_stack': 0,
          'potential1': 0,
          'potential3_duration': 0,
          'potential5': 0,
          'potential5_dmg_up_water_ult': 0,
          'range_talent1buff': 5,
          'ratio_speed': 0.2,
          'ratio_speedreduction': 0.8,
          'talent1_speed': 0,
          'talent2_ultskill': 0,
          'tornado_atk_scale01': 0,
          'tornado_atk_scale02': 0,
          'tornado_atk_scale03': 0,
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
                  buffIds: ['buff_chr_0027_tangtang_water_wake'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(
            0,
            sequence(
              step('jumpTimeline', {
                destinationFrame: 1515,
                condition: {
                  kind: 'buffIdStackCompare',
                  target: 'currentAbilityEntity',
                  buffIds: ['buff_chr_0027_tangtang_water_ultskillwake'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              }),
            ),
            1500,
          ),
          scheduled(
            0,
            sequence(
              sequence(
                step('finishBuffsById', {
                  target: 'enemy',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_waterdebuff_outaura'],
                  reason: 'other',
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0027_tangtang_comboskill_waterdebuff',
                  definition: {
                    stackingType: 'highPriority',
                    priority: 0,
                    maxStackCount: 1,
                    durationSeconds: { blackboardKey: 'duration_waterdebuff' },
                    applyTagIds: [1925762097],
                    blackboard: {
                      'duration_waterdebuff': 30,
                      'ratio_speedreduction': 0.7,
                    },
                  },
                  target: 'enemy',
                  inheritSourceSkillCastInfo: true,
                  finishByAction: true,
                  blackboardAssignments: {
                    'ratio_speedreduction': { kind: 'blackboard', key: 'ratio_speedreduction' },
                  },
                }),
              ),
              sequence(
                step('finishBuffsById', {
                  target: 'partyExceptCaster',
                  buffIds: ['buff_chr_0027_tangtang_comboskill_waterbuff_outaura'],
                  reason: 'other',
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0027_tangtang_comboskill_waterbuff',
                  definition: {
                    stackingType: 'highPriority',
                    priority: { blackboardKey: 'ratio_speed' },
                    maxStackCount: 1,
                    durationSeconds: { blackboardKey: 'duration_waterbuff' },
                    blackboard: {
                      'duration_waterbuff': 30,
                      'ratio_speed': 0.1,
                    },
                    lifecycleSequences: {
                      start: sequence(
                        step('finishBuffsById', {
                          target: 'caster',
                          buffIds: ['buff_chr_0027_tangtang_comboskill_waterbuff_outaura'],
                          reason: 'other',
                        }),
                        step('applyBuff', {
                          buffId: 'buff_chr_0027_tangtang_comboskill_waterbuff_vfx',
                          definition: {
                            stackingType: 'enhance',
                            priority: 0,
                            maxStackCount: 1,
                            durationSeconds: 1,
                          },
                          target: 'caster',
                          inheritSourceSkillCastInfo: true,
                        }),
                      ),
                    },
                  },
                  target: 'partyExceptCaster',
                  inheritSourceSkillCastInfo: true,
                  finishByAction: true,
                  blackboardAssignments: {
                    'ratio_speed': { kind: 'blackboard', key: 'ratio_speed' },
                  },
                }),
              ),
            ),
            1500,
          ),
          scheduled(
            900,
            sequence(
              step('finishCurrentAbilityEntity', {}),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0027_tangtang_water'],
                reason: 'other',
                count: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            1500,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0027_tangtang_water'],
                reason: 'other',
                count: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            1500,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
          scheduled(
            1500,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0027_tangtang_comboskill_waterdebuff_outaura',
                definition: {
                  stackingType: 'highPriority',
                  priority: 0,
                  maxStackCount: 1,
                  durationSeconds: { blackboardKey: 'duration_talent1buff' },
                  applyTagIds: [1925762097],
                  blackboard: {
                    'duration_talent1buff': 3,
                    'ratio_speedreduction': 0.7,
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration_talent1buff': { kind: 'blackboard', key: 'duration_talent1buff' },
                  'ratio_speedreduction': { kind: 'blackboard', key: 'ratio_speedreduction' },
                },
              }),
            ),
          ),
          scheduled(
            1515,
            sequence(
              step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'ultskill_center_abilityentity', abilityEntityIds: ['abilityentity_chr_0027_tangtang_ultskill'] }),
              branch(
                {
                  kind: 'all',
                  conditions: [
                    { kind: 'singleEnemyPresent' },
                    {
                      kind: 'contextTargetCountCompare',
                      contextKey: 'ultskill_center_abilityentity',
                      operator: 'greaterOrEqual',
                      value: 1,
                    },
                  ],
                },
                sequence(
                  sequence(
                    branch(
                      {
                        kind: 'buffIdStackCompare',
                        target: 'enemy',
                        buffIds: ['buff_chr_0027_tangtang_comboskill_spelllnfliction'],
                        sameSourceSkillCast: true,
                        operator: 'less',
                        value: { kind: 'blackboard', key: 'hit_spelllnflictionmax_01' },
                      },
                      sequence(
                        branch(
                          {
                            kind: 'buffIdStackCompare',
                            target: 'enemy',
                            buffIds: ['buff_chr_0027_tangtang_comboskill_hit'],
                            sameSourceSkillCast: true,
                            operator: 'greaterOrEqual',
                            value: { kind: 'blackboard', key: 'hit_cnt' },
                          },
                          sequence(
                            step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                            step('applyBuff', {
                              buffId: 'buff_chr_0027_tangtang_comboskill_spelllnfliction',
                              definition: {
                                stackingType: 'unlimited',
                                priority: 0,
                                maxStackCount: { blackboardKey: 'hit_spelllnflictionmax' },
                                durationSeconds: { blackboardKey: 'hit_spellduration' },
                                blackboard: {
                                  'hit_spellduration': 6,
                                  'hit_spelllnflictionmax': 2,
                                },
                              },
                              target: 'enemy',
                              inheritSourceSkillCastInfo: true,
                            }),
                          ),
                        ),
                      ),
                    ),
                    step('dealDamage', {
                      damageType: 'cryo',
                      attackScale: percentage(0),
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: 0,
                    }, '10:comboSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder1:9'),
                  ),
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0027_tangtang_water'],
                    reason: 'other',
                    count: { kind: 'constant', value: 1 },
                  }),
                ),
              ),
            ),
          ),
          scheduled(
            1515,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0027_tangtang_ultskill': { lifetime: { kind: 'limited', durationSeconds: 10 } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent1_speed',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'ratio_speedreduction',
          operation: 'assign',
          value: [0.2, 0.4],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'ratio_speed',
          operation: 'assign',
          value: [0.1, 0.2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'duration_talent1buff',
          operation: 'assign',
          value: [3, 3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'range_talent1buff',
          operation: 'assign',
          value: [5, 5],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent2',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent2',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'dmg_up_water_ult',
          operation: 'assign',
          value: [0.4, 0.6],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'dmg_up_water_ult',
          operation: 'assign',
          value: [0.4, 0.6],
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
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['agility'],
          value: 20,
        },
        { kind: 'addStaticDamageIncrease', target: 'cryo', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [],
    },
    {
      key: 'potential4',
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
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_1',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_2',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'dmg_up_water_ult',
          operation: 'add',
          value: 0.8,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'dmg_up_water_ult',
          operation: 'add',
          value: 0.8,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['ultimate'] }] },
};
