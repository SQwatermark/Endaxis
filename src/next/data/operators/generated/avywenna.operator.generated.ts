/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const avywennaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0012_avywen_combo_skill',
    timelineBlockFrames: 21,
    cooldownFrames: [390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 390, 360],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        12,
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([169, 186, 203, 219, 236, 253, 270, 287, 304, 325, 350, 380]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct27:chr_0012_avywen_combo_skill11:actionOrder2:30'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0012_avywen_combo_skill_lance',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.69, 1.86, 2.03, 2.19, 2.36, 2.53, 2.7, 2.87, 3.04, 3.25, 3.5, 3.8],
    'lance_duration': 30,
    'poise': 10,
    'usp': 10,
  },
);

export const avywennaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0012_avywen_attack1',
    timelineBlockFrames: 8,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0012_avywen_attack111:actionOrder1:6'),
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
    'atk_scale': [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37],
  },
);

export const avywennaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0012_avywen_attack2',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([22, 24, 26, 28, 30, 32, 34, 37, 39, 41, 45, 48]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0012_avywen_attack211:actionOrder1:4'),
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
    'atk_scale': [0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37, 0.39, 0.41, 0.45, 0.48],
  },
);

export const avywennaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0012_avywen_attack3',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 43, 46]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0012_avywen_attack311:actionOrder1:4'),
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
    'atk_scale': [0.21, 0.23, 0.25, 0.27, 0.29, 0.31, 0.33, 0.35, 0.37, 0.39, 0.43, 0.46],
  },
);

export const avywennaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0012_avywen_attack4',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 23]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct23:chr_0012_avywen_attack411:actionOrder1:5'),
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
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct23:chr_0012_avywen_attack411:actionOrder2:13'),
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
    'atk_scale': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.23],
    'atk_scale_2': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const avywennaBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0012_avywen_attack5',
    timelineBlockFrames: 45,
    scheduledSequences: [
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([50, 55, 60, 65, 70, 75, 80, 85, 90, 96, 104, 113]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 17,
          }, '12:basicAttack56:direct23:chr_0012_avywen_attack511:actionOrder1:4'),
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
    'atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    'poise': 17,
  },
);

export const avywennaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0012_avywen_power_attack',
    timelineBlockFrames: 29,
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
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.3,
          }, '8:finisher6:direct28:chr_0012_avywen_power_attack11:actionOrder1:6'),
        ),
      ),
      scheduled(
        28,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.2,
          }, '8:finisher6:direct28:chr_0012_avywen_power_attack11:actionOrder2:14'),
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
        29,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.5,
          }, '8:finisher6:direct28:chr_0012_avywen_power_attack11:actionOrder2:23'),
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
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const avywennaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0012_avywen_plunging_attack_end',
    timelineBlockFrames: 11,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0012_avywen_plunging_attack_end11:actionOrder1:2'),
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

export const avywennaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0012_avywen_normal_skill',
    timelineBlockFrames: 34,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'lance_count',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'lance_count',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('modifyActionValue', {
            key: 'lance_count',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'ComboLances', abilityEntityIds: ['abilityentity_chr_0012_avywen_combo_skill_lance'] }),
          forEachContextTarget(
            'ComboLances',
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0012_avywen_lance_becalled',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  sequence(
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
                            buffTagIds: [-1640994543],
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
                        step('dealDamage', {
                          damageType: 'electric',
                          attackScale: percentages([75, 82, 90, 97, 104, 112, 119, 127, 134, 144, 155, 168]),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: 5,
                        }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[1]11:actionOrder1:7'),
                      ),
                      sequence(
                        step('dealDamage', {
                          damageType: 'electric',
                          attackScale: percentages([75, 82, 90, 97, 104, 112, 119, 127, 134, 144, 155, 168]),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: 5,
                        }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[3]11:failActions10:actionData3:[0]11:actionOrder2:12'),
                      ),
                      { alwaysNext: true },
                    ),
                    branch(
                      { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                      sequence(
                        step('startTimeDilation', {
                          scope: 'global',
                          durationSeconds: { kind: 'constant', value: 0.2 },
                          slot: 1464849466,
                          priority: 10,
                          curve: { kind: 'inline', keys: [{ time: 0, value: 0.2, inTangent: 0.04379496, outTangent: 0.04379496, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 0.8847446, value: 0.2387474, inTangent: 0.04379496, outTangent: 6.604918, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1, inTangent: 6.604918, outTangent: 6.604918, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                          finishByAction: false,
                          ignoredTargets: ['controlled'],
                        }),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                      recipient: 'caster',
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('modifyActionValue', {
            key: 'lance_count',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'UltiLances', abilityEntityIds: ['abilityentity_chr_0012_avywen_ultimate_skill'] }),
          forEachContextTarget(
            'UltiLances',
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0012_avywen_lance_becalled',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0012_avywen_lance_pulse_check',
                      target: 'enemy',
                      inheritSourceSkillCastInfo: true,
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
                            buffTagIds: [-1640994543],
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
                        step('dealDamage', {
                          damageType: 'electric',
                          attackScale: percentages([192, 211, 230, 250, 269, 288, 307, 326, 346, 370, 398, 432]),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: 10,
                        }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[1]11:actionOrder1:8'),
                        step('startTimeDilation', {
                          scope: 'entity',
                          durationSeconds: { kind: 'constant', value: 0.4 },
                          slot: 1464849466,
                          priority: 10,
                          curve: { kind: 'named', key: 'interrupt_weakness' },
                          finishByAction: false,
                          targets: ['enemy', 'caster'],
                        }),
                      ),
                      sequence(
                        step('dealDamage', {
                          damageType: 'electric',
                          attackScale: percentages([192, 211, 230, 250, 269, 288, 307, 326, 346, 370, 398, 432]),
                          tags: ['normalSkill'],
                          features: ['canBreakWeakness'],
                          stagger: 10,
                        }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[4]11:failActions10:actionData3:[0]11:actionOrder2:13'),
                        step('startTimeDilation', {
                          scope: 'entity',
                          durationSeconds: { kind: 'constant', value: 0.4 },
                          slot: 1464849466,
                          priority: 10,
                          curve: { kind: 'named', key: 'interrupt_weakness' },
                          finishByAction: false,
                          targets: ['enemy', 'caster'],
                        }),
                      ),
                      { alwaysNext: true },
                    ),
                    branch(
                      { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                      sequence(
                        step('startTimeDilation', {
                          scope: 'global',
                          durationSeconds: { kind: 'constant', value: 0.2 },
                          slot: 1464849466,
                          priority: 10,
                          curve: { kind: 'inline', keys: [{ time: 0, value: 0.2, inTangent: 0.04379496, outTangent: 0.04379496, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 0.8847446, value: 0.2387474, inTangent: 0.04379496, outTangent: 6.604918, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1, inTangent: 6.604918, outTangent: 6.604918, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                          finishByAction: false,
                          ignoredTargets: ['controlled'],
                        }),
                      ),
                      undefined,
                      { alwaysNext: true },
                    ),
                    step('changeResourceByActionValue', {
                      resource: 'ultimateEnergy',
                      amount: { kind: 'blackboard', key: 'EntityBB_talent0' },
                      recipient: 'caster',
                    }),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([67, 73, 80, 87, 93, 100, 107, 113, 120, 128, 138, 150]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '11:battleSkill6:direct28:chr_0012_avywen_normal_skill11:actionOrder2:30'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    'atk_scale_lance': [0.75, 0.82, 0.9, 0.97, 1.04, 1.12, 1.19, 1.27, 1.34, 1.44, 1.55, 1.68],
    'atk_scale_lance_ult': [1.92, 2.11, 2.3, 2.5, 2.69, 2.88, 3.07, 3.26, 3.46, 3.7, 3.98, 4.32],
    'poise': 5,
    'poise_lance': 5,
    'poise_lance_ult': 10,
    'potential_5_rate': 0,
  },
);

export const avywennaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0012_avywen_ultimate_skill',
    timelineBlockFrames: 57,
    cooldownFrames: 300,
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
        30,
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
      scheduled(
        45,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0012_avywen_ultimate_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
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
                  'pulse_vul_rate': { kind: 'blackboard', key: 'pulse_vul_rate' },
                  'pulse_vul_duration': { kind: 'blackboard', key: 'pulse_vul_duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([422, 464, 507, 549, 591, 633, 675, 718, 760, 813, 876, 950]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
          }, '8:ultimate6:direct30:chr_0012_avywen_ultimate_skill11:actionOrder2:29'),
        ),
      ),
    ],
  },
  {
    'pulse_vul_duration': 0,
    'atk_scale': [4.22, 4.64, 5.07, 5.49, 5.91, 6.33, 6.75, 7.18, 7.6, 8.13, 8.76, 9.5],
    'lance_duration_ult': 30,
    'poise': [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    'pulse_resist_down_duration': [5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8],
    'pulse_resist_down_rate': [0.3, 0.32, 0.32, 0.32, 0.32, 0.34, 0.34, 0.34, 0.34, 0.36, 0.38, 0.4],
    'pulse_vul_rate': 0,
  },
);

export const avywennaGeneratedOperator: OperatorDefinition = {
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
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [avywennaBasicAttack1, avywennaBasicAttack2, avywennaBasicAttack3, avywennaBasicAttack4, avywennaBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: avywennaFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: avywennaPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: avywennaBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: avywennaComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: avywennaUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0012_avywen_lance_becalled': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
    },
    'buff_chr_0012_avywen_lance_pulse_check': {
      stackingType: 'unique',
      priority: 1,
      maxStackCount: 1,
      durationSeconds: 0.3,
      lifecycleSequences: {
        start: sequence(
          step('applyElementalInfliction', { element: 'electric', isExtra: false }),
        ),
      },
    },
    'buff_chr_0012_avywen_ultimate_skill_debuff': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'pulse_vul_duration' },
      blackboard: {
        'pulse_vul_duration': 10,
        'pulse_vul_rate': 0.3,
      },
    },
    'buff_chr_0012_avywen_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0012_avywen_combo_skill_lance': { lifetime: { kind: 'limited', durationSeconds: 62 }, childSkill: {
        skillId: 'chr_0012_avywen_combo_skill_lance',
        blackboard: {
          'atk_scale_lance': 1,
          'poise_lance': 0,
          'potential_2': 0,
          'talent_atb_gain': 0,
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
          scheduled(
            900,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
          scheduled(
            1500,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0012_avywen_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 62 }, childSkill: {
        skillId: 'chr_0012_avywen_ultimate_skill_lance',
        blackboard: {
          'atk_scale_lance_ult': 1,
          'poise_lance_ult': 0,
          'potential_2': 0,
          'talent_atb_gain_ulti': 0,
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
          scheduled(
            900,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
          scheduled(
            1500,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
  },
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
      passiveSkills: [
        {
          key: 'buff_chr_0012_avywen_talent_0',
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0012_avywen_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'pulse_vul_rate',
          operation: 'assign',
          value: [0.06, 0.1],
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
        {
          kind: 'addBuildAttribute',
          attributes: ['will'],
          value: 15,
        },
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_rate',
          operation: 'assign',
          value: 1.15,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
