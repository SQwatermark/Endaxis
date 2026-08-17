/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const arclightBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 9,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct21:chr_0007_ikut_attack111:actionOrder1:4'),
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

export const arclightBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 14, 15, 16, 18, 19, 20, 21, 23, 24, 26, 28]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct21:chr_0007_ikut_attack211:actionOrder1:4'),
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
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.13, 0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.28],
  },
);

export const arclightBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 14, 16, 17, 18, 20, 21, 22, 23, 25, 27, 29]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0007_ikut_attack311:actionOrder1:5'),
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
          ),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 14, 16, 17, 18, 20, 21, 22, 23, 25, 27, 29]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0007_ikut_attack311:actionOrder2:13'),
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
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.13, 0.14, 0.16, 0.17, 0.18, 0.2, 0.21, 0.22, 0.23, 0.25, 0.27, 0.29],
    'display_atk_scale': [0.26, 0.29, 0.31, 0.34, 0.36, 0.39, 0.42, 0.44, 0.47, 0.5, 0.54, 0.59],
  },
);

export const arclightBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0007_ikut_attack411:actionOrder2:21'),
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
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0007_ikut_attack411:actionOrder2:21'),
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
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0007_ikut_attack411:actionOrder2:21'),
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
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.12, 0.13, 0.14, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.23, 0.25, 0.27],
    'display_atk_scale': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
  },
);

export const arclightBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([48, 52, 57, 62, 67, 71, 76, 81, 86, 91, 99, 107]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 16,
          }, '12:basicAttack56:direct21:chr_0007_ikut_attack511:actionOrder1:6'),
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
          ),
        ),
      ),
    ],
  },
  {
    'atb': 17,
    'atk_scale': [0.48, 0.52, 0.57, 0.62, 0.67, 0.71, 0.76, 0.81, 0.86, 0.91, 0.99, 1.07],
    'poise': 16,
  },
);

export const arclightFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 40,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
            definition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 0,
              durationSeconds: { blackboardKey: 'duration' },
              applyTagIds: [782082172, -104052028, -886962248],
              blackboard: {
                'duration': 9999,
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_power_attack_disable_cast_skill',
            definition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 0,
              applyTagIds: [-1601691447, 817018340, -1486085048, -496376350, 2002680355],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct26:chr_0007_ikut_power_attack11:actionOrder2:14'),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct26:chr_0007_ikut_power_attack11:actionOrder2:22'),
        ),
      ),
      scheduled(
        38,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct26:chr_0007_ikut_power_attack11:actionOrder2:30'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const arclightPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct33:chr_0007_ikut_plunging_attack_end11:actionOrder1:3'),
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

export const arclightBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 36,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [1466867135],
            },
            sequence(
              step('modifyActionValue', {
                key: 'SpawnThird',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct26:chr_0007_ikut_normal_skill11:actionOrder1:8'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '11:battleSkill6:direct26:chr_0007_ikut_normal_skill11:actionOrder2:13'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        112,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct26:chr_0007_ikut_normal_skill11:actionOrder2:20'),
        ),
      ),
      scheduled(
        118,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '11:battleSkill6:direct26:chr_0007_ikut_normal_skill11:actionOrder2:25'),
        ),
      ),
      scheduled(
        136,
        sequence(
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  tagIds: [1466867135],
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
                          'pulse_up': { kind: 'blackboard', key: 'pulse_up' },
                          'duration': { kind: 'blackboard', key: 'duration' },
                          'count': { kind: 'blackboard', key: 'count' },
                        },
                      }),
                    ),
                  ),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                  step('dealDamage', {
                    damageType: 'electric',
                    attackScale: percentages([180, 198, 216, 234, 252, 270, 288, 306, 324, 347, 374, 405]),
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: 5,
                  }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[3]11:actionOrder2:42'),
                  step('modifyActionValue', {
                    key: 'thirdhit',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                  }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[2]14:succeedActions10:actionData3:[5]11:actionOrder2:44'),
                  step('applyBuff', {
                    buffId: 'buff_common_obtain_ultimate_sp',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTagIds: [1466867135],
                    reason: 'early',
                  }),
                ),
                sequence(
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: 5,
                  }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:48'),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                  }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[2]11:failActions10:actionData3:[2]11:actionOrder2:50'),
                  step('applyBuff', {
                    buffId: 'buff_common_obtain_ultimate_sp',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([45, 50, 54, 59, 63, 68, 72, 77, 81, 87, 93, 101]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
              }, '11:battleSkill11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[0]11:actionOrder2:53'),
              step('applyBuff', {
                buffId: 'buff_common_obtain_ultimate_sp',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'SpawnThird': 0,
    'talent_1': 0,
    'thirdhit': 0,
    'atb': [30, 30, 30, 30, 30, 35, 35, 35, 35, 35, 35, 40],
    'atk_scale': [0.45, 0.5, 0.54, 0.59, 0.63, 0.68, 0.72, 0.77, 0.81, 0.87, 0.93, 1.01],
    'atk_scale2': [1.8, 1.98, 2.16, 2.34, 2.52, 2.7, 2.88, 3.06, 3.24, 3.47, 3.74, 4.05],
    'poise1': 5,
    'poise2': 5,
  },
);

export const arclightComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 27,
    cooldownFrames: 90,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 0,
            priority: -593023102,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            influenceSkillCooldownSeconds: { kind: 'constant', value: 0.4 },
          }),
        ),
        12,
      ),
      scheduled(
        17,
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
            attackScale: percentages([52, 57, 62, 67, 73, 78, 83, 88, 93, 100, 107, 117]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '10:comboSkill6:direct25:chr_0007_ikut_combo_skill11:actionOrder2:46'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([52, 57, 62, 67, 73, 78, 83, 88, 93, 100, 107, 117]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct25:chr_0007_ikut_combo_skill11:actionOrder2:52'),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0007_ikut_combo_skill_tutorial_marker',
            definition: {
              stackingType: 'unique',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 1,
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([52, 57, 62, 67, 73, 78, 83, 88, 93, 100, 107, 117]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct25:chr_0007_ikut_combo_skill11:actionOrder2:58'),
        ),
      ),
    ],
  },
  {
    'atb': [8, 8, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10],
    'atk_scale': [0.52, 0.57, 0.62, 0.67, 0.73, 0.78, 0.83, 0.88, 0.93, 1, 1.07, 1.17],
    'display_atk_scale': [1.55, 1.71, 1.86, 2.02, 2.18, 2.33, 2.49, 2.64, 2.8, 2.99, 3.22, 3.5],
    'poise': 5,
    'usp': 5,
  },
);

export const arclightUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 77,
    cooldownFrames: 450,
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
            priority: -2059842104,
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
            priority: -1742631616,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        56,
      ),
      scheduled(
        61,
        sequence(
          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([156, 171, 187, 202, 218, 234, 249, 265, 280, 300, 323, 350]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
          }, '8:ultimate13:abilityEntity28:chr_0007_ikut_ultimate_skill37:chr_0007_ikut_ultimate_skill_abentity11:actionOrder2:551:5'),
        ),
      ),
      scheduled(
        117,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([244, 269, 293, 318, 342, 367, 391, 415, 440, 470, 507, 550]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
          }, '8:ultimate13:abilityEntity28:chr_0007_ikut_ultimate_skill37:chr_0007_ikut_ultimate_skill_abentity11:actionOrder2:552:12'),
        ),
      ),
    ],
  },
  {
    'isWall': 0,
    'atk_scale1': [1.56, 1.71, 1.87, 2.02, 2.18, 2.34, 2.49, 2.65, 2.8, 3, 3.23, 3.5],
    'atk_scale2': [2.44, 2.69, 2.93, 3.18, 3.42, 3.67, 3.91, 4.15, 4.4, 4.7, 5.07, 5.5],
    'poise1': [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
    'poise2': [7, 7, 7, 7, 7, 7, 7, 7, 7, 10, 10, 10],
  },
);

export const arclightGeneratedOperator: OperatorDefinition = {
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
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [arclightBasicAttack1, arclightBasicAttack2, arclightBasicAttack3, arclightBasicAttack4, arclightBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: arclightFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: arclightPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: arclightBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: arclightUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: arclightComboSkill },
  ],
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
          value: [0.0005, 0.0008],
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
      modifiers: [],
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
        {
          kind: 'addBuildAttribute',
          attributes: ['agility', 'intellect'],
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'pulse_up',
          operation: 'multiply',
          value: 1.3,
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
      modifiers: [],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['ultimate'] }] },
};
