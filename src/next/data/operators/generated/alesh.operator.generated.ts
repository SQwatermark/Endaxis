/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const aleshComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0024_deepfin_combo_skill',
    timelineBlockFrames: 39,
    cooldownFrames: [270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 270, 240],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0024_deepfin_combo_camera',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(),
                sequence(
                  step('jumpTimeline', { destinationFrame: 4 }),
                ),
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('jumpTimeline', { destinationFrame: 4 }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('calculateActionValue', {
            key: 'prob_max',
            operation: 'add',
            left: { kind: 'blackboard', key: 'prob' },
            right: { kind: 'blackboard', key: 'prob_max' },
          }),
          step('calculateActionValue', {
            key: 'prob_add',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'prob_add' },
            right: { kind: 'blackboard', key: 'rate' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'prob' },
              operator: 'lessOrEqual',
              right: { kind: 'blackboard', key: 'prob_max' },
            },
            sequence(
              branch(
                {
                  kind: 'probability',
                  probability: { kind: 'blackboard', key: 'prob' },
                },
                sequence(
                  step('jumpTimeline', { destinationFrame: 65 }),
                ),
              ),
            ),
            sequence(
              branch(
                {
                  kind: 'probability',
                  probability: { kind: 'blackboard', key: 'prob_max' },
                },
                sequence(
                  step('jumpTimeline', { destinationFrame: 65 }),
                ),
              ),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        22,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([33, 37, 40, 43, 47, 50, 53, 57, 60, 64, 69, 75]),
            tags: ['comboSkill'],
          }, '10:comboSkill6:direct28:chr_0024_deepfin_combo_skill11:actionOrder2:61'),
        ),
      ),
      scheduled(
        38,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([100, 110, 120, 130, 140, 150, 160, 170, 180, 193, 208, 225]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct28:chr_0024_deepfin_combo_skill11:actionOrder2:27'),
        ),
      ),
      scheduled(
        38,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_normal' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        64,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 120,
          }),
        ),
        66,
      ),
      scheduled(
        77,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([53, 59, 64, 69, 75, 80, 85, 91, 96, 103, 111, 120]),
            tags: ['comboSkill'],
          }, '10:comboSkill6:direct28:chr_0024_deepfin_combo_skill11:actionOrder2:66'),
        ),
      ),
      scheduled(
        93,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_sp' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'default',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct28:chr_0024_deepfin_combo_skill11:actionOrder2:35'),
        ),
      ),
      scheduled(
        93,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_normal' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        93,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_3' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0024_deepfin_potential_3',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'atk_up': { kind: 'blackboard', key: 'atk_up' },
                  'duration': { kind: 'blackboard', key: 'Duration' },
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
    'potential_3': 0,
    'atb': [10, 10, 10, 10, 10, 12, 12, 12, 12, 13, 13, 15],
    'atb_sp': 10,
    'atk_scale_1': [0.33, 0.37, 0.4, 0.43, 0.47, 0.5, 0.53, 0.57, 0.6, 0.64, 0.69, 0.75],
    'atk_scale_1ex': [0.53, 0.59, 0.64, 0.69, 0.75, 0.8, 0.85, 0.91, 0.96, 1.03, 1.11, 1.2],
    'atk_scale_2': [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.93, 2.08, 2.25],
    'atk_scale_2ex': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'atk_scale_display': [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    'atk_scale_display_ex': [2.13, 2.35, 2.56, 2.77, 2.99, 3.2, 3.41, 3.63, 3.84, 4.11, 4.43, 4.8],
    'poise': 10,
    'prob': 0.1,
    'usp_normal': 10,
    'Duration': 10,
    'atk_up': 0.15,
    'rate': 10,
  },
);

export const aleshBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0024_deepfin_attack1',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([18, 19, 21, 23, 25, 26, 28, 30, 32, 34, 36, 39]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct24:chr_0024_deepfin_attack111:actionOrder1:6'),
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
    'atk_scale': [0.18, 0.19, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39],
  },
);

export const aleshBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0024_deepfin_attack2',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0024_deepfin_attack211:actionOrder1:6'),
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
    'atk_scale': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.23],
  },
);

export const aleshBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0024_deepfin_attack3',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct24:chr_0024_deepfin_attack311:actionOrder1:9'),
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
    'atk_scale': [0.28, 0.3, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.53, 0.57, 0.62],
  },
);

export const aleshBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0024_deepfin_attack4',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0024_deepfin_attack411:actionOrder1:6'),
          branch(
            { kind: 'casterControlled' },
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
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.28, 0.3, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.53, 0.57, 0.62],
  },
);

export const aleshBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0024_deepfin_attack5',
    timelineBlockFrames: 31,
    scheduledSequences: [
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 17,
          }, '12:basicAttack56:direct24:chr_0024_deepfin_attack511:actionOrder1:8'),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([28, 30, 33, 36, 39, 41, 44, 47, 50, 53, 57, 62]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack56:direct24:chr_0024_deepfin_attack511:actionOrder2:22'),
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
    'atb': 19,
    'atk_scale': [0.28, 0.3, 0.33, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.53, 0.57, 0.62],
    'atk_scale_display': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
    'poise': 17,
  },
);

export const aleshFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0024_deepfin_power_attack',
    timelineBlockFrames: 47,
    scheduledSequences: [
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
        75,
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
        47,
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct29:chr_0024_deepfin_power_attack11:actionOrder2:10'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResource', { resource: 'sp', amount: 0, recipient: 'team', spGainKind: 'gain', spGainSource: 'default' }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        47,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([320, 352, 384, 416, 448, 480, 512, 544, 576, 616, 664, 720]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct29:chr_0024_deepfin_power_attack11:actionOrder2:19'),
        ),
      ),
    ],
  },
  {
    'camera': 0,
    'atk_scale1': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'atk_scale2': [3.2, 3.52, 3.84, 4.16, 4.48, 4.8, 5.12, 5.44, 5.76, 6.16, 6.64, 7.2],
    'atk_scale_display': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const aleshPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0024_deepfin_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct36:chr_0024_deepfin_plunging_attack_end11:actionOrder1:4'),
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

export const aleshBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0024_deepfin_normal_skill',
    timelineBlockFrames: 51,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'num_1' },
              operator: 'greater',
              right: { kind: 'blackboard', key: 'num' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'num',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'num_1' },
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
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_1' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('calculateActionValue', {
                key: 'atb_1',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_1' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_2',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_2' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_3',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_3' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              step('calculateActionValue', {
                key: 'atb_4',
                operation: 'add',
                left: { kind: 'blackboard', key: 'atb_4' },
                right: { kind: 'blackboard', key: 'potential_1_atb' },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'num' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_1' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'num' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_2' },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'num' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 3 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb_3' },
                            recipient: 'team',
                            spGainKind: 'gain',
                            spGainSource: 'skill',
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'num' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 4 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_4' },
                                recipient: 'team',
                                spGainKind: 'gain',
                                spGainSource: 'skill',
                              }),
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
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'num' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_1' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'num' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 2 },
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'sp',
                        amount: { kind: 'blackboard', key: 'atb_2' },
                        recipient: 'team',
                        spGainKind: 'gain',
                        spGainSource: 'skill',
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'num' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 3 },
                        },
                        sequence(
                          step('changeResourceByActionValue', {
                            resource: 'sp',
                            amount: { kind: 'blackboard', key: 'atb_3' },
                            recipient: 'team',
                            spGainKind: 'gain',
                            spGainSource: 'skill',
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'num' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 4 },
                            },
                            sequence(
                              step('changeResourceByActionValue', {
                                resource: 'sp',
                                amount: { kind: 'blackboard', key: 'atb_4' },
                                recipient: 'team',
                                spGainKind: 'gain',
                                spGainSource: 'skill',
                              }),
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([200, 220, 240, 260, 280, 300, 320, 340, 360, 385, 415, 450]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct29:chr_0024_deepfin_normal_skill11:actionOrder2:63'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        27,
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
                target: 'enemy',
                outputKey: 'count',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1570888476] },
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
    'num': 0,
    'num_1': 0,
    'potential_1': 0,
    'atb_1': [10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15],
    'atb_2': [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    'atb_3': [30, 30, 30, 30, 30, 30, 30, 30, 30, 35, 35, 35],
    'atb_4': [40, 40, 40, 40, 40, 40, 40, 40, 40, 45, 45, 45],
    'atk_scale': [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    'poise': 10,
    'potential_1_atb': 0,
  },
);

export const aleshUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0024_deepfin_ultimate_skill',
    timelineBlockFrames: 96,
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
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        110,
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
        77,
      ),
      scheduled(
        89,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-19-0',
                  event: { kind: 'enemyDefeated', scope: 'operator' },
                  sequence: sequence(
                    step('modifyActionValue', {
                      key: 'kill_num',
                      operation: 'add',
                      value: { kind: 'constant', value: 1 },
                    }),
                  ),
                },
            ],
          }),
        ),
        91,
      ),
      scheduled(
        90,
        sequence(
          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
        ),
      ),
      scheduled(
        91,
        sequence(
          step('modifyActionValue', {
            key: 'atb_up',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'kill_num' },
          }),
          step('modifyActionValue', {
            key: 'atb_up',
            operation: 'add',
            value: { kind: 'blackboard', key: 'atb' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'atb_up' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 100 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_up' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_max' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    'atb_up': [12, 12, 12, 12, 12, 12, 12, 12, 12, 15, 15, 15],
    'kill_num': 0,
    'atb_max': 100,
    'atk_scale': [4.36, 4.79, 5.23, 5.66, 6.1, 6.53, 6.97, 7.41, 7.84, 8.39, 9.04, 9.8],
    'poise': 20,
  },
);

export const aleshGeneratedOperator: OperatorDefinition = {
  slug: 'alesh',
  gameId: 'ALESH',
  rarity: 5,
  weaponType: 'sword',
  element: 'cryo',
  role: 'vanguard',
  mainAttribute: 'strength',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [20, 49, 80, 111, 142, 158],
    agility: [9, 27, 47, 66, 86, 95],
    intellect: [13, 37, 62, 87, 113, 125],
    will: [10, 27, 45, 63, 81, 89],
    baseAttack: [30, 90, 152, 215, 277, 309],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [aleshBasicAttack1, aleshBasicAttack2, aleshBasicAttack3, aleshBasicAttack4, aleshBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: aleshFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: aleshPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: aleshBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: aleshComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: aleshUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0024_deepfin_combo_camera': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: 1,
      blackboard: {
        'CD': 0,
        'count': 0,
        'owner_mainchar_alpha': 0,
        'owner_mainchar_distance': 0,
        'usp': 10,
      },
    },
    'buff_chr_0024_deepfin_potential_3': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0.15,
        'duration': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    'buff_chr_0024_deepfin_talent_1': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      blackboard: {
        'CD': 0,
        'count': 0,
        'usp': 10,
      },
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' } },
                sequence(
                  branch(
                    {
                      kind: 'eventBuffIdMatch',
                      buffIds: ['buff_common_originum_frozen'],
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        recipient: 'caster',
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'talent',
                        durationSeconds: { kind: 'blackboard', key: 'CD' },
                        autoFinishByAction: false,
                      }),
                    ),
                  ),
                ),
              ),
            ),
        },
        {
          event: 'outputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' } },
                sequence(
                  branch(
                    {
                      kind: 'eventBuffTagsMatch',
                      match: 'hasAny',
                      buffTagIds: [1535684437],
                    },
                    sequence(
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp' },
                        recipient: 'caster',
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'talent',
                        durationSeconds: { kind: 'blackboard', key: 'CD' },
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
    'buff_chr_0024_deepfin_talent_1_auro': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 2,
      blackboard: {
        'CD': 3,
        'count': 0,
        'usp': 10,
        'usp_final': 0,
        'usp_self': 12,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0024_deepfin_talent_1',
            target: 'partyExceptCaster',
            inheritSourceSkillCastInfo: false,
            finishByAction: true,
            blackboardAssignments: {
              'usp': { kind: 'blackboard', key: 'usp' },
              'CD': { kind: 'blackboard', key: 'CD' },
            },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'talent' } },
                sequence(
                  branch(
                    {
                      kind: 'eventBuffTagsMatch',
                      match: 'hasAny',
                      buffTagIds: [1535684437],
                    },
                    sequence(
                      step('calculateActionValue', {
                        key: 'usp_final',
                        operation: 'add',
                        left: { kind: 'blackboard', key: 'usp' },
                        right: { kind: 'blackboard', key: 'usp_self' },
                      }),
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp_final' },
                        recipient: 'caster',
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'talent',
                        durationSeconds: { kind: 'blackboard', key: 'CD' },
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
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
      passiveSkills: [
        {
          key: 'buff_chr_0024_deepfin_talent_1_auro',
          blackboard: {
            'usp': [3, 4],
            'usp_self': [6, 8],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0024_deepfin_talent_1_auro',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'usp': { kind: 'blackboard', key: 'usp' },
                'usp_self': { kind: 'blackboard', key: 'usp_self' },
              },
            }),
          ),
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'prob_add',
          operation: 'assign',
          value: [0.002, 0.005],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'prob_max',
          operation: 'assign',
          value: [0.3, 0.3],
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
  ],
  potentials: [
    {
      key: 'potential1',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_1_atb',
          operation: 'add',
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['strength', 'intellect'],
          value: 15,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 0.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'Duration',
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'hp_tar',
          operation: 'assign',
          value: 0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'assign',
          value: 1.5,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
