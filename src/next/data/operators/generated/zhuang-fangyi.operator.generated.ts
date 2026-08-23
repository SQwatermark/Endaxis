/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const zhuangFangyiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0030_zhuangfy_attack1',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile25:chr_0030_zhuangfy_attack133:chr_0030_zhuangfy_attack1_projhit11:actionOrder1:31:0'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile25:chr_0030_zhuangfy_attack133:chr_0030_zhuangfy_attack1_projhit11:actionOrder1:41:0'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'display_atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
);

export const zhuangFangyiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0030_zhuangfy_attack2',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'sword_dist' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 10 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'add',
                value: { kind: 'constant', value: 3 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'assign',
                value: { kind: 'constant', value: 14 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0030_zhuangfy_attack239:chr_0030_zhuangfy_attack2_sword_projhit11:actionOrder2:101:0'),
        ),
      ),
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile25:chr_0030_zhuangfy_attack239:chr_0030_zhuangfy_attack2_sword_projhit11:actionOrder2:111:0'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack2',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
    ],
  },
  {
    'sword_dist': 0,
    'atk_scale': [0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.08],
    'atk_scale_sword': [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
    'display_atk_scale': [0.24, 0.26, 0.29, 0.31, 0.34, 0.36, 0.38, 0.41, 0.43, 0.46, 0.5, 0.54],
  },
);

export const zhuangFangyiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0030_zhuangfy_attack3',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'sword_dist' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 10 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'add',
                value: { kind: 'constant', value: 3 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'sword_dist',
                operation: 'assign',
                value: { kind: 'constant', value: 14 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:101:0'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:111:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:121:0'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([8, 9, 10, 10, 11, 12, 13, 14, 14, 15, 17, 18]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile25:chr_0030_zhuangfy_attack339:chr_0030_zhuangfy_attack3_sword_projhit11:actionOrder2:131:0'),
        ),
      ),
    ],
  },
  {
    'sword_dist': 0,
    'atk_scale_sword': [0.08, 0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.14, 0.15, 0.17, 0.18],
    'display_atk_scale': [0.32, 0.35, 0.39, 0.42, 0.45, 0.48, 0.52, 0.55, 0.58, 0.62, 0.67, 0.72],
  },
);

export const zhuangFangyiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0030_zhuangfy_attack4',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack2',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.11, 0.12, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.23, 0.25],
    'display_atk_scale': [0.45, 0.5, 0.54, 0.59, 0.63, 0.68, 0.72, 0.77, 0.81, 0.87, 0.93, 1.01],
  },
);

export const zhuangFangyiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0030_zhuangfy_attack5',
    timelineBlockFrames: 50,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack5',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
          }),
        ),
      ),
    ],
  },
  {
    'atb': 18,
    'atk_scale': [0.48, 0.53, 0.58, 0.62, 0.67, 0.72, 0.77, 0.82, 0.86, 0.92, 1, 1.08],
    'poise': 18,
  },
);

export const zhuangFangyiEnhancedBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack1',
    sourceSkillId: 'chr_0030_zhuangfy_attack1_ult',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        22,
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 86, 93, 100, 106, 113, 120, 128, 138, 150]),
            tags: ['normalAttack'],
          }, '20:enhancedBasicAttack113:abilityEntity29:chr_0030_zhuangfy_attack1_ult44:chr_0030_zhuangfy_attack1_ult_1_abilityrange11:actionOrder2:111:01:4'),
        ),
      ),
    ],
  },
  {
    'target_in_range': 0,
    'atk_scale': [0.67, 0.73, 0.8, 0.86, 0.93, 1, 1.06, 1.13, 1.2, 1.28, 1.38, 1.5],
  },
);

export const zhuangFangyiEnhancedBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack2',
    sourceSkillId: 'chr_0030_zhuangfy_attack2_ult',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        17,
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([94, 103, 112, 122, 131, 140, 150, 159, 168, 180, 194, 210]),
            tags: ['normalAttack'],
          }, '20:enhancedBasicAttack213:abilityEntity29:chr_0030_zhuangfy_attack2_ult44:chr_0030_zhuangfy_attack1_ult_1_abilityrange11:actionOrder2:101:01:4'),
        ),
      ),
    ],
  },
  {
    'target_in_range': 0,
    'atk_scale': [0.94, 1.03, 1.12, 1.22, 1.31, 1.4, 1.5, 1.59, 1.68, 1.8, 1.94, 2.1],
  },
);

export const zhuangFangyiEnhancedBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBasicAttack3',
    sourceSkillId: 'chr_0030_zhuangfy_attack3_ult',
    timelineBlockFrames: 60,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        35,
      ),
      scheduled(
        3,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_attack3_ult',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'thunder',
          }),
        ),
      ),
    ],
  },
  {
    'atb': 20,
    'atk_scale': [1.34, 1.47, 1.6, 1.74, 1.87, 2, 2.14, 2.27, 2.4, 2.57, 2.77, 3],
    'poise': 18,
  },
);

export const zhuangFangyiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0030_zhuangfy_power_attack',
    timelineBlockFrames: 41,
    availability: { kind: 'targetStaggered', target: 'enemy' },
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0030_zhuangfy_power_attack11:actionOrder2:10'),
        ),
      ),
      scheduled(
        40,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct30:chr_0030_zhuangfy_power_attack11:actionOrder2:13'),
          step('gainFinisherSp', { factor: 1, recipient: 'team' }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const zhuangFangyiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0030_zhuangfy_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct37:chr_0030_zhuangfy_plunging_attack_end11:actionOrder2:16'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const zhuangFangyiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0030_zhuangfy_normal_skill',
    timelineBlockFrames: 45,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'swordsForExtend', abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'] }),
          forEachContextTarget(
            'swordsForExtend',
            sequence(
              branch(
                {
                  kind: 'abilityEntityRemainingDurationCompare',
                  operator: 'less',
                  value: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 3 } }),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
                reason: 'other',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1466867135],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffBlackboard', {
                    target: 'enemy',
                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1466867135] },
                    desiredKey: 'count',
                    outputKey: 'conductCnt',
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTagIds: [1466867135],
                    reason: 'early',
                  }),
                  step('modifyActionValue', {
                    key: 'sword_gene_num',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'conductCnt' },
                  }),
                  step('modifyActionValue', {
                    key: 'sword_gene_num',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'sword_gene_num' },
                      operator: 'lessOrEqual',
                      right: { kind: 'blackboard', key: 'max_conduct_sword' },
                    },
                    sequence(),
                    sequence(
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'assign',
                        value: { kind: 'blackboard', key: 'max_conduct_sword' },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_return' },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'default',
                  }),
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                  sequence(
                    branch(
                      { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                      sequence(
                        branch(
                          { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                          sequence(
                            step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',  dieWhenSourceDies: true, inheritActionBlackboard: true, blackboardAssignments: { 'EntityBB_swordDuration': { kind: 'blackboard', key: 'sword_duration' }, 'EntityBB_swordLimit': { kind: 'blackboard', key: 'remain_sword_limit' } } }),
                          ),
                          undefined,
                          { alwaysNext: true },
                        ),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                      operator: 'less',
                      right: { kind: 'blackboard', key: 'free_sword_limit' },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                  sequence(
                    branch(
                      { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                      sequence(
                        branch(
                          { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                          sequence(
                            step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',  dieWhenSourceDies: true, inheritActionBlackboard: true, blackboardAssignments: { 'EntityBB_swordDuration': { kind: 'blackboard', key: 'sword_duration' }, 'EntityBB_swordLimit': { kind: 'blackboard', key: 'remain_sword_limit' } } }),
                          ),
                          undefined,
                          { alwaysNext: true },
                        ),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                  ),
                  step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',  dieWhenSourceDies: true, inheritActionBlackboard: true }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          branch(
            { kind: 'combatActive' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_talent1',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1',
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
        13,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'swordTriggerInterval',
                operation: 'divide',
                left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                right: { kind: 'constant', value: 90 },
              }),
              step('modifyActionValue', {
                key: 'swordTriggerInterval',
                operation: 'multiply',
                value: { kind: 'constant', value: -1 },
              }),
              step('calculateActionValue', {
                key: 'swordTriggerInterval',
                operation: 'add',
                left: { kind: 'constant', value: 0.3 },
                right: { kind: 'blackboard', key: 'swordTriggerInterval' },
              }),
              step('calculateActionValue', {
                key: 'atk_up_final',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_up_per_conduct' },
                right: { kind: 'blackboard', key: 'conductCnt' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'interval': { kind: 'blackboard', key: 'swordTriggerInterval' },
                  'sword_range': { kind: 'blackboard', key: 'sword_range' },
                  'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                  'poise': { kind: 'blackboard', key: 'poise' },
                  'usp_extra': { kind: 'blackboard', key: 'usp_extra' },
                  'atk_up_final': { kind: 'blackboard', key: 'atk_up_final' },
                  'remain_sword_limit': { kind: 'blackboard', key: 'remain_sword_limit' },
                  'final_rate': { kind: 'blackboard', key: 'final_rate' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 116,
            condition: {
              kind: 'any',
              conditions: [
                { kind: 'timedMarkerPresent', target: 'caster', markerId: 'skillEnd' },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
          }),
        ),
        116,
      ),
    ],
  },
  {
    'conductCnt': 0,
    'free_sword_limit': 3,
    'max_conduct_sword': 3,
    'swordTriggerInterval': 0,
    'sword_gene_num': 0,
    'atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    'atk_up_per_conduct': [0.03, 0.04, 0.04, 0.04, 0.05, 0.05, 0.05, 0.06, 0.06, 0.07, 0.08, 0.09],
    'final_rate': 6,
    'poise': 15,
    'remain_sword_limit': 9,
    'sword_duration': 36,
    'sword_range': 50,
    'usp_extra': 6,
    'usp_extra_limit': 54,
    'atb_return': 0,
    'atk_up_final': 0,
  },
);

export const zhuangFangyiEnhancedBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedBattleSkill',
    sourceSkillId: 'chr_0030_zhuangfy_normal_skill_ult',
    timelineBlockFrames: 30,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'swordsForExtend', abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'] }),
          forEachContextTarget(
            'swordsForExtend',
            sequence(
              branch(
                {
                  kind: 'abilityEntityRemainingDurationCompare',
                  operator: 'less',
                  value: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('setAbilityEntityRemainingDuration', { value: { kind: 'constant', value: 3 } }),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        18,
      ),
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                    sequence(
                      sequence(
                        branch(
                          { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                          sequence(
                            branch(
                              { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                              sequence(
                                step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',  dieWhenSourceDies: true, inheritActionBlackboard: true, blackboardAssignments: { 'EntityBB_swordDuration': { kind: 'blackboard', key: 'sword_duration' }, 'EntityBB_swordLimit': { kind: 'blackboard', key: 'remain_sword_limit' } } }),
                              ),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
                          undefined,
                          { alwaysNext: true },
                        ),
                      ),
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
                        reason: 'other',
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
                      buffTagIds: [1466867135],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffBlackboard', {
                        target: 'enemy',
                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1466867135] },
                        desiredKey: 'count',
                        outputKey: 'conductCnt',
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTagIds: [1466867135],
                        reason: 'early',
                      }),
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'add',
                        value: { kind: 'blackboard', key: 'conductCnt' },
                      }),
                      step('modifyActionValue', {
                        key: 'sword_gene_num',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'sword_gene_num' },
                          operator: 'lessOrEqual',
                          right: { kind: 'blackboard', key: 'max_conduct_sword' },
                        },
                        sequence(),
                        sequence(
                          step('modifyActionValue', {
                            key: 'sword_gene_num',
                            operation: 'assign',
                            value: { kind: 'blackboard', key: 'max_conduct_sword' },
                          }),
                        ),
                        { alwaysNext: true },
                      ),
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_return' },
                        recipient: 'team',
                        spGainKind: 'refund',
                        spGainSource: 'default',
                      }),
                      branch(
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'sword_gene_num',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      sequence(
                        branch(
                          { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                          sequence(
                            branch(
                              { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                              sequence(
                                step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',  dieWhenSourceDies: true, inheritActionBlackboard: true, blackboardAssignments: { 'EntityBB_swordDuration': { kind: 'blackboard', key: 'sword_duration' }, 'EntityBB_swordLimit': { kind: 'blackboard', key: 'remain_sword_limit' } } }),
                              ),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
                          undefined,
                          { alwaysNext: true },
                        ),
                      ),
                      step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                          operator: 'less',
                          right: { kind: 'blackboard', key: 'free_sword_limit' },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'sword_gene_num',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      branch(
                        {
                          kind: 'buffIdStackCompare',
                          target: 'caster',
                          buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('modifyActionValue', {
                            key: 'sword_gene_num',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      sequence(
                        branch(
                          { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                          sequence(
                            branch(
                              { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                              sequence(
                                step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',  dieWhenSourceDies: true, inheritActionBlackboard: true, blackboardAssignments: { 'EntityBB_swordDuration': { kind: 'blackboard', key: 'sword_duration' }, 'EntityBB_swordLimit': { kind: 'blackboard', key: 'remain_sword_limit' } } }),
                              ),
                              undefined,
                              { alwaysNext: true },
                            ),
                          ),
                          undefined,
                          { alwaysNext: true },
                        ),
                      ),
                      step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',  dieWhenSourceDies: true, inheritActionBlackboard: true }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            { kind: 'combatActive' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_talent1',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1',
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
        15,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult',
            dieWhenSourceDies: true,
            inheritActionBlackboard: true,
            blackboardAssignments: { 'EntityBB_SwordNum': { kind: 'blackboard', key: 'EntityBB_SwordNum' } },
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('calculateActionValue', {
            key: 'atk_up_final',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'conductCnt' },
            right: { kind: 'blackboard', key: 'atk_up_per_conduct' },
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 100,
            condition: {
              kind: 'any',
              conditions: [
                { kind: 'timedMarkerPresent', target: 'caster', markerId: 'skillEnd' },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
          }),
        ),
        100,
      ),
      scheduled(
        100,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_skill_free'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'conductCnt': 0,
    'free_sword_limit': 3,
    'max_conduct_sword': 3,
    'sword_gene_num': 0,
    'atb_return': 0,
    'atk_scale': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    'atk_up_per_conduct': [0.08, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18],
    'final_rate': 6,
    'poise': 15,
    'remain_sword_limit': 9,
    'sword_duration': 36,
    'sword_range': 50,
  },
);

export const zhuangFangyiComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0030_zhuangfy_combo_skill',
    timelineBlockFrames: 25,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
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
        24,
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
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'inflictCnt',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
              }),
              step('modifyActionValue', {
                key: 'conductCnt',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1466867135],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'conductCnt' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'assign',
                    value: { kind: 'constant', value: 4 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('applyBuff', {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'count': { kind: 'blackboard', key: 'conductCnt' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct29:chr_0030_zhuangfy_combo_skill11:actionOrder2:49'),
          step('finishBuffsByTag', {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [2123008650],
            reason: 'early',
          }),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
              step('calculateActionValue', {
                key: 'usp_extra',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'usp_extra' },
                right: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_extra' },
                recipient: 'caster',
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
    'conductCnt': 0,
    'inflictCnt': 0,
    'atk_scale': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'poise': 10,
    'usp': 10,
    'usp_extra': 10,
  },
);

export const zhuangFangyiEnhancedComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'enhancedComboSkill',
    sourceSkillId: 'chr_0030_zhuangfy_combo_skill_ult',
    timelineBlockFrames: 25,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
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
        0,
        sequence(
          step('holdBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
          }),
        ),
        28,
      ),
      scheduled(
        24,
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
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'inflictCnt',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
              }),
              step('modifyActionValue', {
                key: 'conductCnt',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'inflictCnt' },
              }),
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1466867135],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'conductCnt' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 4 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'conductCnt',
                    operation: 'assign',
                    value: { kind: 'constant', value: 4 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('applyBuff', {
                buffId: 'buff_common_pulse_pulse_conduct_triggered',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'count': { kind: 'blackboard', key: 'conductCnt' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([240, 264, 288, 312, 336, 360, 384, 408, 432, 462, 498, 540]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '18:enhancedComboSkill6:direct33:chr_0030_zhuangfy_combo_skill_ult11:actionOrder2:51'),
          step('finishBuffsByTag', {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [2123008650],
            reason: 'early',
          }),
        ),
      ),
    ],
  },
  {
    'conductCnt': 0,
    'inflictCnt': 0,
    'atk_scale': [2.4, 2.64, 2.88, 3.12, 3.36, 3.6, 3.84, 4.08, 4.32, 4.62, 4.98, 5.4],
    'poise': 10,
  },
);

export const zhuangFangyiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0030_zhuangfy_ultimate_skill',
    timelineBlockFrames: 91,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 240 }],
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
            ignoredAbilityEntityTargets: [{ kind: 'context', contextKey: 'ult_postmodel_mirror' }, { kind: 'context', contextKey: 'ult_postmodel' }],
          }),
        ),
        78,
      ),
      scheduled(
        78,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_base',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'combo_cd_rate': { kind: 'blackboard', key: 'combo_cd_rate' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'duration': 25,
    'combo_cd_rate': 4,
    'duration_extra': 1,
  },
);

export const zhuangFangyiGeneratedOperator: OperatorDefinition = {
  slug: 'zhuang-fangyi',
  gameId: 'ZHUANG FANGYI',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'striker',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [10, 29, 49, 69, 89, 99],
    agility: [10, 29, 49, 69, 89, 99],
    intellect: [17, 39, 63, 87, 111, 123],
    will: [24, 58, 94, 130, 166, 184],
    baseAttack: [30, 93, 160, 227, 293, 326],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [zhuangFangyiBasicAttack1, zhuangFangyiBasicAttack2, zhuangFangyiBasicAttack3, zhuangFangyiBasicAttack4, zhuangFangyiBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: zhuangFangyiFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: zhuangFangyiPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: zhuangFangyiBattleSkill, replacementSkills: [zhuangFangyiEnhancedBattleSkill] },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: zhuangFangyiComboSkill, replacementSkills: [zhuangFangyiEnhancedComboSkill] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: zhuangFangyiUltimate },
    { key: 'enhancedBasicAttack', skillType: 'basicAttack', levelSource: 'ultimate', skills: [zhuangFangyiEnhancedBasicAttack1, zhuangFangyiEnhancedBasicAttack2, zhuangFangyiEnhancedBasicAttack3] },
  ],
  buffDefinitions: {
    'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      applyTagIds: [1670936726],
      lifecycleSequences: {
        start: sequence(
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'ownerHpZero',
          priority: 0,
          sequence:
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_normal_skill_trigger_sword_tar',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
            ),
        },
      ],
    },
    'buff_chr_0030_zhuangfy_talent1': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: 0.1,
    },
    'buff_chr_0030_zhuangfy_talent1_mark': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: 0.1,
    },
    'buff_chr_0030_zhuangfy_sword_triggerd': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 0,
      durationSeconds: 1,
      blackboard: {
        'atk_scale': 1,
        'atk_scale_final': 0,
        'final_rate': 0,
        'poise': 0,
        'randomVFX': 0,
        'remain_sword_limit': 0,
        'swordCnt': 0,
        'swordIndex': 0,
        'usp_extra': 0,
      },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('modifyActionValue', {
              key: 'swordCnt',
              operation: 'add',
              value: { kind: 'constant', value: -1 },
            }),
          ),
        ),
        scheduled(
          3,
          sequence(
            step('createTimedMarker', {
              target: 'caster',
              markerId: 'skillEnd',
              durationSeconds: { kind: 'constant', value: 0.1 },
              autoFinishByAction: false,
            }),
          ),
        ),
        scheduled(
          3,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
              target: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'swordIndex' },
                operator: 'equal',
                right: { kind: 'constant', value: 0 },
              },
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                }, '37:buff_chr_0030_zhuangfy_sword_triggerd11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[5]14:succeedActions10:actionData3:[0]11:actionOrder2:20'),
                branch(
                  {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'swordIndex' },
                    operator: 'less',
                    right: { kind: 'blackboard', key: 'remain_sword_limit' },
                  },
                  sequence(
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp_extra' },
                      recipient: 'caster',
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              sequence(
                step('dealDamage', {
                  damageType: 'electric',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: ['normalSkill'],
                }, '37:buff_chr_0030_zhuangfy_sword_triggerd11:conditional18:timelineActions[4]19:_sequenceActionData10:actionData3:[5]11:failActions10:actionData3:[0]11:actionOrder2:25'),
                branch(
                  {
                    kind: 'actionValueCompare',
                    left: { kind: 'blackboard', key: 'swordIndex' },
                    operator: 'less',
                    right: { kind: 'blackboard', key: 'remain_sword_limit' },
                  },
                  sequence(
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'usp_extra' },
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
        scheduled(
          6,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
              target: 'buffSource',
              inheritSourceSkillCastInfo: true,
            }),
            step('calculateActionValue', {
              key: 'atk_scale_final',
              operation: 'multiply',
              left: { kind: 'blackboard', key: 'atk_scale' },
              right: { kind: 'blackboard', key: 'final_rate' },
            }),
            step('dealDamage', {
              damageType: 'electric',
              attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            }, '37:buff_chr_0030_zhuangfy_sword_triggerd4:buff37:buff_chr_0030_zhuangfy_sword_triggerd11:actionOrder2:37'),
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'swordIndex' },
                operator: 'less',
                right: { kind: 'blackboard', key: 'remain_sword_limit' },
              },
              sequence(
                step('changeResourceByActionValue', {
                  resource: 'ultimateEnergy',
                  amount: { kind: 'blackboard', key: 'usp_extra' },
                  recipient: 'caster',
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
            step('finishBuffsById', {
              target: 'buffSource',
              buffIds: ['buff_chr_0030_zhuangfy_normal_skill_trigger_sword'],
              reason: 'other',
            }),
          ),
        ),
      ],
    },
    'buff_chr_0030_zhuangfy_normal_skill_trigger_sword': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      triggerIntervalSeconds: { blackboardKey: 'interval' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 50,
      applyTagIds: [-1486085048],
      blackboard: {
        'atb_return': 0,
        'atk_scale': 0,
        'atk_up_final': 0,
        'final_rate': 0,
        'interval': 0.3,
        'isUlt': 0,
        'poise': 0,
        'remain_sword_limit': 0,
        'swordCnt': 0,
        'swordIndex': 0,
        'sword_range': 20,
        'usp_extra': 0,
      },
      lifecycleSequences: {
        start: sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'add',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'blackboard', key: 'atk_up_final' },
          }),
          branch(
            { kind: 'not', condition: { kind: 'singleEnemyPresent' } },
            sequence(
              step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'swordTar', abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_fake_target'] }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'sword', abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'] }),
        ),
        finish: sequence(
          step('finishBuffsByTag', {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [1670936726],
            reason: 'other',
          }),
        ),
        trigger: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'swordIndex' },
              operator: 'less',
              right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
            },
            sequence(
              sequence(
                step('pickContextTarget', { sourceContextKey: 'sword', saveToContextKey: 'swordInst', index: { kind: 'blackboard', key: 'swordIndex' } }),
                forEachContextTarget(
                  'swordInst',
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0030_zhuangfy_sword_triggerd',
                      target: 'currentAbilityEntity',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'swordIndex': { kind: 'blackboard', key: 'swordIndex' },
                        'swordCnt': { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                        'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                        'poise': { kind: 'blackboard', key: 'poise' },
                        'usp_extra': { kind: 'blackboard', key: 'usp_extra' },
                        'remain_sword_limit': { kind: 'blackboard', key: 'remain_sword_limit' },
                        'final_rate': { kind: 'blackboard', key: 'final_rate' },
                      },
                    }),
                  ),
                ),
              ),
              step('modifyActionValue', {
                key: 'swordIndex',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0030_zhuangfy_ult_hide_model': {
      stackingType: 'stack',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.1,
    },
    'buff_chr_0030_zhuangfy_ult_hide_model_holder': {
      stackingType: 'stack',
      priority: 1,
      maxStackCount: 1,
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_hide_model',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: false,
          }),
        ),
      },
    },
    'buff_chr_0030_zhuangfy_dash_hide': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.2,
    },
    'buff_chr_0030_zhuangfy_ult_body_vfx': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 0,
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffIdMatch',
                  buffIds: ['buff_common_dash_immune_teammate'],
                },
                sequence(
                  branch(
                    { kind: 'casterControlled' },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0030_zhuangfy_dash_hide',
                        target: 'buffSource',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0030_zhuangfy_ult_skill_free': {
      stackingType: 'unique',
      presentation: {
        visible: true,
        iconId: 'icon_battle_zhuangfy_debuff_01',
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
      priority: 1,
      maxStackCount: 0,
      attributeModifiers: [
        {
          attribute: 'AtbCostAddition',
          slot: 'baseAddition',
          value: -100,
        },
      ],
    },
    'buff_chr_0030_zhuangfy_ult_base': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'Default',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'CommonCharBuff',
        },
      },
      priority: 1,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [-388303696, 189882742],
      extendTagIds: [-1486085048, -496376350],
      blackboard: {
        'combo_cd_rate': 3,
        'duration': 10,
      },
      sustainedProtection: {
        target: 'buffSource',
        superArmor: 35,
        impactResistance: 100,
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'enhancedBattleSkill',
          revertedSkillKey: 'battleSkill',
          inheritOriginSkillCooldownProgress: false,
        },
        {
          skillGroupKey: 'comboSkill',
          targetSkillKey: 'enhancedComboSkill',
          revertedSkillKey: 'comboSkill',
          inheritOriginSkillCooldownProgress: true,
        },
      ],
      attributeModifiers: [
        {
          attribute: 'ComboSkillCooldownRecoveryScalar',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'combo_cd_rate' },
        },
      ],
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_hide_model_holder',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_body_vfx',
            target: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0030_zhuangfy_ult_skill_free',
            target: 'buffSource',
            inheritSourceSkillCastInfo: true,
          }),
        ),
        finish: sequence(
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 15 },
          }),
        ),
      },
    },
    'buff_chr_0030_zhuangfy_passive_check_sword': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0.03,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'swordRange': 50,
        'swordsNum': 0,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'swordsInRange', abilityEntityIds: ['abilityentity_chr_0030_zhuangfy_normal_skill_sword'], saveCountToBlackboardKey: 'swordsNum' }),
          step('modifyActionValue', {
            key: 'EntityBB_SwordNum',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'swordsNum' },
          }),
        ),
      },
    },
    'buff_chr_0030_zhuangfy_talent1_base': {
      stackingType: 'stack',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'base_rate': 0,
        'duration': 0,
        'enhance_rate': 0,
      },
      attributeModifiers: [
        {
          attribute: 'electricEnhancedDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: '__keyword_rate_0_0_0' },
          target: 'buffSource',
        },
      ],
      keywordEnhancements: [
        {
          triggerBuffIds: ['buff_chr_0030_zhuangfy_talent1_mark'],
          operation: 'add',
          targetKey: '__keyword_rate_0_0_0',
          initialValue: { blackboardKey: 'base_rate' },
          value: { blackboardKey: 'enhance_rate' },
        },
      ],
    },
    'buff_chr_0030_zhuangfy_talent2_heal': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0,
        'heal': 0,
      },
      lifecycleSequences: {
        start: sequence(
          step('heal', {
            target: 'buffSource',
            alwaysNext: true,
            attribute: 'maxHealth',
            multiplier: { kind: 'blackboard', key: 'heal' },
            addition: { kind: 'constant', value: 0 },
            tagIds: [],
          }),
        ),
      },
    },
    'buff_chr_0030_zhuangfy_potential1_more_sword': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 9,
      abilityEventResponses: [
        {
          event: 'skillEnd',
          priority: 0,
          sequence:
            sequence(
              step('finishBuffsById', {
                target: 'buffSource',
                buffIds: ['buff_chr_0030_zhuangfy_potential1_more_sword'],
                reason: 'other',
              }),
            ),
        },
      ],
    },
    'buff_chr_0030_zhuangfy_potential1': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      abilityEventResponses: [
        {
          event: 'enterFight',
          priority: 0,
          sequence:
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_potential1_more_sword',
                target: 'buffSource',
                inheritSourceSkillCastInfo: true,
              }),
            ),
        },
      ],
    },
    'buff_chr_0030_zhuangfy_potential5': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'ignore_pulse_resist': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'buffIdCountCompare',
            target: 'caster',
            buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
            operator: 'greaterOrEqual',
            value: 1,
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'defender',
              attribute: 'PulseResistance',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'ignore_pulse_resist' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0030_zhuangfy_attack2': { lifetime: { kind: 'limited', durationSeconds: 1 }, childSkill: {
        skillId: 'chr_0030_zhuangfy_attack2_abilityrange',
        blackboard: {
          'atk_scale': 0.2,
          'thunderPosIndex': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '78:abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange13:abilityEntity38:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:2'),
            ),
          ),
          scheduled(
            9,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '78:abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange21:abilityEntityInterval38:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:81:02:14'),
            ),
          ),
          scheduled(
            11,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '78:abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange21:abilityEntityInterval38:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:81:12:14'),
            ),
          ),
          scheduled(
            14,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '78:abilityentity_chr_0030_zhuangfy_attack2:chr_0030_zhuangfy_attack2_abilityrange21:abilityEntityInterval38:chr_0030_zhuangfy_attack2_abilityrange11:actionOrder1:81:22:14'),
            ),
          ),
          scheduled(
            897,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0030_zhuangfy_attack5': { lifetime: { kind: 'limited', durationSeconds: 1 }, childSkill: {
        skillId: 'chr_0030_zhuangfy_attack5_abilityrange',
        blackboard: {
          'atb': 20,
          'atk_scale': 0.2,
          'effectZ': 2,
          'hasGainAtb': 0,
          'poise': 15,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack', 'normalAttackLastCombo'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '78:abilityentity_chr_0030_zhuangfy_attack5:chr_0030_zhuangfy_attack5_abilityrange13:abilityEntity38:chr_0030_zhuangfy_attack5_abilityrange11:actionOrder2:11'),
            ),
          ),
          scheduled(
            0,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
              step('modifyActionValue', {
                key: 'hasGainAtb',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            4,
            sequence(
              step('modifyActionValue', {
                key: 'hasGainAtb',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            8,
            sequence(
              step('modifyActionValue', {
                key: 'hasGainAtb',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            897,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0030_zhuangfy_attack3_ult': { lifetime: { kind: 'limited', durationSeconds: 1 }, childSkill: {
        skillId: 'chr_0030_zhuangfy_attack3_ult_abilityrange',
        blackboard: {
          'atb': 0,
          'atk_scale': 0.2,
          'poise': 0,
          'randomRotate': 0,
          'thunderPosIndex': 0,
        },
        scheduledSequences: [
          scheduled(
            30,
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
          scheduled(
            30,
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack', 'normalAttackLastCombo'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '86:abilityentity_chr_0030_zhuangfy_attack3_ult:chr_0030_zhuangfy_attack3_ult_abilityrange13:abilityEntity42:chr_0030_zhuangfy_attack3_ult_abilityrange11:actionOrder1:2'),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0030_zhuangfy_normal_skill_fake_target': { lifetime: { kind: 'limited', durationSeconds: 1 } },
    'abilityentity_chr_0030_zhuangfy_normal_skill_sword': { lifetime: { kind: 'limited', durationSeconds: 45 } },
    'abilityentity_chr_0030_zhuangfy_normal_skill_ult': { lifetime: { kind: 'limited', durationSeconds: 1 }, childSkill: {
        skillId: 'chr_0030_zhuangfy_normal_skill_ult_abilityrange',
        blackboard: {
          'atk_scale': 0,
          'atk_scale_final': 0,
          'atk_up_final': 0,
          'final_rate': 0,
          'poise': 0,
          'randomVFX': 0,
          'sword_index': 0,
          'sword_range': 0,
          'tick_index': 1,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('calculateActionValue', {
                key: 'atk_scale_final',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atk_scale' },
                right: { kind: 'blackboard', key: 'atk_up_final' },
              }),
            ),
          ),
          scheduled(
            12,
            sequence(
              branch(
                {
                  kind: 'not',
                  condition:
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'less',
                      right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                    }
                },
                sequence(
                  step('jumpTimeline', {
                    destinationFrame: 64,
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
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
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
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
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
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
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
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
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
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            29,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            29,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            35,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            35,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            41,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            41,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            47,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            53,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            53,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            60,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'tick_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                    definition: {
                      stackingType: 'unlimited',
                      priority: 1,
                      maxStackCount: { blackboardKey: 'max_stack' },
                      durationSeconds: 0.1,
                    },
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'tick_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                        features: ['canBreakWeakness'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[0]11:actionOrder2:17'),
                    ),
                    sequence(
                      step('dealDamage', {
                        damageType: 'electric',
                        attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                        tags: ['normalSkill'],
                      }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[0]12:actionOnTick10:actionData3:[0]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:19'),
                    ),
                    { alwaysNext: true },
                  ),
                  step('modifyActionValue', {
                    key: 'tick_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            60,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'sword_index' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'EntityBB_SwordNum' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'sword_index',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            67,
            sequence(
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'skillEnd',
                durationSeconds: { kind: 'constant', value: 0.1 },
                autoFinishByAction: false,
              }),
            ),
          ),
          scheduled(
            69,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0030_zhuangfy_talent1_mark',
                definition: {
                  stackingType: 'unlimited',
                  priority: 1,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  durationSeconds: 0.1,
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('calculateActionValue', {
                key: 'atk_scale_final',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'atk_scale_final' },
                right: { kind: 'blackboard', key: 'final_rate' },
              }),
              step('applyElementalInfliction', { element: 'electric', isExtra: false }),
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '96:abilityentity_chr_0030_zhuangfy_normal_skill_ult:chr_0030_zhuangfy_normal_skill_ult_abilityrange13:abilityEntity47:chr_0030_zhuangfy_normal_skill_ult_abilityrange11:actionOrder2:28'),
            ),
          ),
        ],
    } },
  },
  passiveSkills: [
    {
      key: 'chr_0030_zhuangfy_check_sword_passive',
      blackboard: {
        'swordNum': 0,
        'swordRange': 50,
      },
      enableSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0030_zhuangfy_passive_check_sword',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'swordRange': { kind: 'blackboard', key: 'swordRange' },
          },
        }),
      ),
    },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'chr_0030_zhuangfy_talent1',
          blackboard: {
            'base_rate': [0.09, 0.18],
            'duration': 5,
            'enhance_rate': [0.01, 0.02],
          },
          enableSequence: sequence(
            step('listenForCombatEvents', {
              responses: [
                  {
                    key: 'native-event-0-0',
                    event: { kind: 'buffApplied' },
                    phase: 'dataAction',
                    priority: 0,
                    sequence: sequence(
                      branch(
                        {
                          kind: 'eventBuffIdMatch',
                          buffIds: ['buff_chr_0030_zhuangfy_talent1'],
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0030_zhuangfy_talent1_base',
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'duration': { kind: 'blackboard', key: 'duration' },
                              'base_rate': { kind: 'blackboard', key: 'base_rate' },
                              'enhance_rate': { kind: 'blackboard', key: 'enhance_rate' },
                            },
                          }),
                        ),
                      ),
                    ),
                  },
              ],
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
          key: 'chr_0030_zhuangfy_talent2',
          blackboard: {
            'base_rate': 0.09,
            'duration': 99,
            'heal': [0.09, 0.18],
            'sword_rate': 0.01,
          },
          enableSequence: sequence(
            step('listenForCombatEvents', {
              responses: [
                  {
                    key: 'native-event-0-0',
                    event: { kind: 'operatorHit' },
                    phase: 'dataAction',
                    priority: 0,
                    sequence: sequence(
                      branch(
                        {
                          kind: 'entityTagMatch',
                          target: 'caster',
                          tagQueryType: 'exceptAny',
                          tagIds: [-727577212, 1622340854, 1357114970],
                        },
                        sequence(
                          step('calculateActionValue', {
                            key: 'swordRateFinal',
                            operation: 'multiply',
                            left: { kind: 'blackboard', key: 'sword_rate' },
                            right: { kind: 'blackboard', key: 'swordsNum' },
                          }),
                          step('calculateActionValue', {
                            key: 'probability',
                            operation: 'add',
                            left: { kind: 'blackboard', key: 'base_rate' },
                            right: { kind: 'blackboard', key: 'swordRateFinal' },
                          }),
                          branch(
                            {
                              kind: 'probability',
                              probability: { kind: 'blackboard', key: 'probability' },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_common_damage_immune_talent',
                                target: 'caster',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  'duration': { kind: 'constant', value: 0.01 },
                                },
                              }),
                              step('applyBuff', {
                                buffId: 'buff_chr_0030_zhuangfy_talent2_heal',
                                target: 'caster',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  'heal': { kind: 'blackboard', key: 'heal' },
                                  'duration': { kind: 'blackboard', key: 'duration' },
                                },
                              }),
                            ),
                          ),
                        ),
                      ),
                    ),
                  },
              ],
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
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atk_up_per_conduct',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'enhancedBattleSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'enhancedBattleSkill',
          blackboardKey: 'atk_up_per_conduct',
          operation: 'multiply',
          value: 1.15,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0030_zhuangfy_potential1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['will'],
          value: 20,
        },
        { kind: 'addStaticDamageIncrease', target: 'battleSkill', value: 0.15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'sword_duration',
          operation: 'add',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'enhancedBattleSkill',
          blackboardKey: 'sword_duration',
          operation: 'add',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'enhancedBattleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 10,
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
          multiplier: 0.85,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0030_zhuangfy_potential5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'ignore_pulse_resist': { kind: 'constant', value: -15 },
          },
        }),
      ),
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
