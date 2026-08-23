/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const pogranichnikBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0029_pograni_attack1',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([23, 25, 28, 30, 32, 35, 37, 39, 41, 44, 48, 52]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct24:chr_0029_pograni_attack111:actionOrder1:4'),
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
    'atk_scale': [0.23, 0.25, 0.28, 0.3, 0.32, 0.35, 0.37, 0.39, 0.41, 0.44, 0.48, 0.52],
  },
);

export const pogranichnikBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0029_pograni_attack2',
    timelineBlockFrames: 19,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([14, 15, 17, 18, 20, 21, 22, 24, 25, 27, 29, 32]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0029_pograni_attack211:actionOrder1:5'),
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
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([14, 15, 17, 18, 20, 21, 22, 24, 25, 27, 29, 32]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0029_pograni_attack211:actionOrder2:13'),
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
    'atk_scale': [0.14, 0.15, 0.17, 0.18, 0.2, 0.21, 0.22, 0.24, 0.25, 0.27, 0.29, 0.32],
    'display_atk_scale': [0.28, 0.31, 0.34, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.54, 0.58, 0.63],
  },
);

export const pogranichnikBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0029_pograni_attack3',
    timelineBlockFrames: 19,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct24:chr_0029_pograni_attack311:actionOrder2:10'),
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
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct24:chr_0029_pograni_attack311:actionOrder2:17'),
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
    'atk_scale': [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37],
    'display_atk_scale': [0.33, 0.36, 0.4, 0.43, 0.46, 0.5, 0.53, 0.56, 0.59, 0.64, 0.68, 0.74],
  },
);

export const pogranichnikBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0029_pograni_attack4',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder1:8'),
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
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder2:15'),
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
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder2:22'),
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
        11,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder2:31'),
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
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder2:38'),
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
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([6, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 14]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack46:direct24:chr_0029_pograni_attack411:actionOrder2:50'),
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
    'atk_scale': [0.06, 0.07, 0.08, 0.08, 0.09, 0.1, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14],
    'display_atk_scale': [0.38, 0.42, 0.46, 0.5, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.79, 0.86],
  },
);

export const pogranichnikBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0029_pograni_attack5',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([43, 47, 52, 56, 60, 65, 69, 73, 77, 83, 89, 97]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack56:direct24:chr_0029_pograni_attack511:actionOrder1:7'),
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
    ],
  },
  {
    'isHitbyMain': 0,
    'atb': 20,
    'atk_scale': [0.43, 0.47, 0.52, 0.56, 0.6, 0.65, 0.69, 0.73, 0.77, 0.83, 0.89, 0.97],
    'poise': 18,
  },
);

export const pogranichnikFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0029_pograni_power_attack',
    timelineBlockFrames: 27,
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
        47,
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
        27,
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct29:chr_0029_pograni_power_attack11:actionOrder2:12'),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct29:chr_0029_pograni_power_attack11:actionOrder2:21'),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
          }, '8:finisher6:direct29:chr_0029_pograni_power_attack11:actionOrder2:28'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const pogranichnikPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0029_pograni_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct36:chr_0029_pograni_plunging_attack_end11:actionOrder1:4'),
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

export const pogranichnikBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0029_pograni_normal_skill',
    timelineBlockFrames: 45,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        28,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([86, 94, 103, 111, 120, 128, 137, 145, 154, 165, 177, 192]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '11:battleSkill6:direct29:chr_0029_pograni_normal_skill11:actionOrder2:78'),
        ),
      ),
      scheduled(
        38,
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
        38,
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
                amount: { kind: 'blackboard', key: 'atb1' },
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
                    amount: { kind: 'blackboard', key: 'atb2' },
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
                        amount: { kind: 'blackboard', key: 'atb3' },
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
                            amount: { kind: 'blackboard', key: 'atb4' },
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
      ),
      scheduled(
        38,
        sequence(
          branch(
            { kind: 'not', condition: { kind: 'singleEnemyPresent' } },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential1' },
                  operator: 'greaterOrEqual',
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
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyPhysicalInfliction', {
            type: 'fracture',
            target: 'enemy',
            isExtra: false,
            noGuardBuffId: 'buff_physical_no_guard',
            noGuardDefinition: {
              stackingType: 'enhanceAndRefresh',
              presentation: {
                visible: true,
                iconId: 'icon_shadow_attribute_penetrate',
                showInHeadBarCommon: false,
                showInHeadBarAttached: true,
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
              priority: 100,
              maxStackCount: 4,
              durationSeconds: { blackboardKey: 'duration' },
              applyTagIds: [1075718177],
              blackboard: {
                'atk_scale': 0,
                'count': 0,
                'duration': 20,
                'skip_handle_cryst_break': 0,
              },
              lifecycleSequences: {
                start: sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_physical_handle_cryst_break',
                        target: 'buffOwner',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
                finish: sequence(
                  step('applyBuff', {
                    buffId: 'buff_physical_no_guard_fake',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                afterEnhance: sequence(
                  step('igniteBuffs', {
                    target: 'enemy',
                    source: 'currentBuffSource',
                    igniteType: 'NoGuard',
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'skip_handle_cryst_break' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_physical_handle_cryst_break',
                        target: 'buffOwner',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
              },
            },
            fractureBuffId: 'buff_physical_fracture',
            fractureDefinition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 3,
              triggerIntervalSeconds: 0,
              waitFirstTriggerInterval: false,
              maxTriggerCount: 0,
              blackboard: {
                'count': 0,
                'duration': 15,
              },
              lifecycleSequences: {
                start: sequence(
                  step('applyBuff', {
                    buffId: 'buff_physical_do_fracture',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'blackboard', key: 'duration' },
                    },
                  }),
                ),
              },
            },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([106, 116, 127, 137, 148, 158, 169, 180, 190, 203, 219, 238]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '11:battleSkill6:direct29:chr_0029_pograni_normal_skill11:actionOrder2:88'),
        ),
      ),
      scheduled(
        38,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'has_potential1': 0,
    'num': 0,
    'num_1': 0,
    'atb1': 5,
    'atb2': [10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15],
    'atb3': [20, 20, 20, 20, 20, 20, 20, 20, 20, 25, 25, 25],
    'atb4': [30, 30, 30, 30, 30, 30, 30, 30, 30, 35, 35, 35],
    'atk_scale': [0.86, 0.94, 1.03, 1.11, 1.2, 1.28, 1.37, 1.45, 1.54, 1.65, 1.77, 1.92],
    'atk_scale2': [1.06, 1.16, 1.27, 1.37, 1.48, 1.58, 1.69, 1.8, 1.9, 2.03, 2.19, 2.38],
    'poise': 5,
    'atb_return': 15,
  },
);

export const pogranichnikComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0029_pograni_combo_skill',
    timelineBlockFrames: 66,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0029_pograni_combo_skill_count4'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'EntityBB_noguard_count',
                operation: 'assign',
                value: { kind: 'constant', value: 4 },
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0029_pograni_combo_skill_count1', 'buff_chr_0029_pograni_combo_skill_count2', 'buff_chr_0029_pograni_combo_skill_count3', 'buff_chr_0029_pograni_combo_skill_count4'],
                reason: 'other',
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0029_pograni_combo_skill_count3'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'EntityBB_noguard_count',
                    operation: 'assign',
                    value: { kind: 'constant', value: 3 },
                  }),
                  step('finishBuffsById', {
                    target: 'enemy',
                    buffIds: ['buff_chr_0029_pograni_combo_skill_count1', 'buff_chr_0029_pograni_combo_skill_count2', 'buff_chr_0029_pograni_combo_skill_count3', 'buff_chr_0029_pograni_combo_skill_count4'],
                    reason: 'other',
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0029_pograni_combo_skill_count2'],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'EntityBB_noguard_count',
                        operation: 'assign',
                        value: { kind: 'constant', value: 2 },
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0029_pograni_combo_skill_count1', 'buff_chr_0029_pograni_combo_skill_count2', 'buff_chr_0029_pograni_combo_skill_count3', 'buff_chr_0029_pograni_combo_skill_count4'],
                        reason: 'other',
                      }),
                    ),
                    sequence(
                      step('modifyActionValue', {
                        key: 'EntityBB_noguard_count',
                        operation: 'assign',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('finishBuffsById', {
                        target: 'enemy',
                        buffIds: ['buff_chr_0029_pograni_combo_skill_count1', 'buff_chr_0029_pograni_combo_skill_count2', 'buff_chr_0029_pograni_combo_skill_count3', 'buff_chr_0029_pograni_combo_skill_count4'],
                        reason: 'other',
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
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
              operator: 'lessOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('jumpTimeline', { destinationFrame: 600 }),
            ),
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 2 },
                },
                sequence(
                  step('jumpTimeline', { destinationFrame: 400 }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_noguard_count' },
                      operator: 'lessOrEqual',
                      right: { kind: 'constant', value: 3 },
                    },
                    sequence(
                      step('jumpTimeline', { destinationFrame: 200 }),
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
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.8 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        21,
      ),
      scheduled(
        23,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([42, 46, 50, 55, 59, 63, 67, 71, 76, 81, 87, 95]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:123'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([54, 59, 65, 70, 76, 81, 86, 92, 97, 104, 112, 122]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:131'),
        ),
      ),
      scheduled(
        61,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb4',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb4' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb4' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([132, 145, 158, 172, 185, 198, 211, 224, 238, 254, 274, 297]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 9,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:138'),
        ),
      ),
      scheduled(
        191,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        200,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.8 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        221,
      ),
      scheduled(
        223,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([42, 46, 50, 55, 59, 63, 67, 71, 76, 81, 87, 95]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:146'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        237,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([54, 59, 65, 70, 76, 81, 86, 92, 97, 104, 112, 122]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:154'),
        ),
      ),
      scheduled(
        261,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb3',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb3' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb3' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([66, 73, 79, 86, 92, 99, 106, 112, 119, 127, 137, 149]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 4,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:161'),
        ),
      ),
      scheduled(
        391,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        400,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.700000048 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        418,
      ),
      scheduled(
        423,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([42, 46, 50, 55, 59, 63, 67, 71, 76, 81, 87, 95]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:169'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        437,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb2' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb2' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([54, 59, 65, 70, 76, 81, 86, 92, 97, 104, 112, 122]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:177'),
        ),
      ),
      scheduled(
        545,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        600,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.73300004 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        619,
      ),
      scheduled(
        623,
        sequence(
          step('calculateActionValue', {
            key: 'calc_atb1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atb1' },
            right: { kind: 'blackboard', key: 'atb_ratio' },
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'calc_atb1' },
            recipient: 'team',
            spGainKind: 'gain',
            spGainSource: 'skill',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([42, 46, 50, 55, 59, 63, 67, 71, 76, 81, 87, 95]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '10:comboSkill6:direct28:chr_0029_pograni_combo_skill11:actionOrder3:184'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
    ],
  },
  {
    'atb1': 5,
    'atb2': 7,
    'atb3': 13,
    'atb4': 23,
    'atk_scale': [0.42, 0.46, 0.5, 0.55, 0.59, 0.63, 0.67, 0.71, 0.76, 0.81, 0.87, 0.95],
    'atk_scale2': [0.54, 0.59, 0.65, 0.7, 0.76, 0.81, 0.86, 0.92, 0.97, 1.04, 1.12, 1.22],
    'atk_scale3': [0.66, 0.73, 0.79, 0.86, 0.92, 0.99, 1.06, 1.12, 1.19, 1.27, 1.37, 1.49],
    'atk_scale4': [1.32, 1.45, 1.58, 1.72, 1.85, 1.98, 2.11, 2.24, 2.38, 2.54, 2.74, 2.97],
    'poise1': 3,
    'poise3': 4,
    'poise4': 9,
    'usp': 10,
    'atb_ratio': 1,
  },
);

export const pogranichnikUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0029_pograni_ultimate_skill',
    timelineBlockFrames: 91,
    cooldownFrames: 300,
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
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_ult_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        90,
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
        75,
      ),
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0029_pograni_ultimate_skill'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        74,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            definition: { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
              skillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
              blackboard: {
                'atb_final': 0,
                'atb_trigger': 4,
                'atk_scale_final': 0,
                'atk_scale_rush': 1,
                'atk_scale_trigger': 0,
                'duration': 20,
                'poise_final': 0,
                'radius': 5,
              },
              scheduledSequences: [
                scheduled(
                  3,
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'duration' },
                        'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
                        'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                        'atb_trigger': { kind: 'blackboard', key: 'atb_trigger' },
                        'atb_final': { kind: 'blackboard', key: 'atb_final' },
                        'poise_final': { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                  ),
                ),
                scheduled(
                  50,
                  sequence(
                    step('finishCurrentAbilityEntity', {}),
                  ),
                ),
              ],
            } },
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'ae1',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            definition: { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
              skillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
              blackboard: {
                'atb_final': 0,
                'atb_trigger': 4,
                'atk_scale_final': 0,
                'atk_scale_rush': 1,
                'atk_scale_trigger': 0,
                'duration': 20,
                'poise_final': 0,
                'radius': 5,
              },
              scheduledSequences: [
                scheduled(
                  3,
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'duration' },
                        'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
                        'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                        'atb_trigger': { kind: 'blackboard', key: 'atb_trigger' },
                        'atb_final': { kind: 'blackboard', key: 'atb_final' },
                        'poise_final': { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                  ),
                ),
                scheduled(
                  50,
                  sequence(
                    step('finishCurrentAbilityEntity', {}),
                  ),
                ),
              ],
            } },
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'ae2',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            definition: { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
              skillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
              blackboard: {
                'atb_final': 0,
                'atb_trigger': 4,
                'atk_scale_final': 0,
                'atk_scale_rush': 1,
                'atk_scale_trigger': 0,
                'duration': 20,
                'poise_final': 0,
                'radius': 5,
              },
              scheduledSequences: [
                scheduled(
                  3,
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'duration' },
                        'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
                        'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                        'atb_trigger': { kind: 'blackboard', key: 'atb_trigger' },
                        'atb_final': { kind: 'blackboard', key: 'atb_final' },
                        'poise_final': { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                  ),
                ),
                scheduled(
                  50,
                  sequence(
                    step('finishCurrentAbilityEntity', {}),
                  ),
                ),
              ],
            } },
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'ae3',
          }),
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
            definition: { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
              skillId: 'chr_0029_pograni_ultimate_skill_abilityentity',
              blackboard: {
                'atb_final': 0,
                'atb_trigger': 4,
                'atk_scale_final': 0,
                'atk_scale_rush': 1,
                'atk_scale_trigger': 0,
                'duration': 20,
                'poise_final': 0,
                'radius': 5,
              },
              scheduledSequences: [
                scheduled(
                  3,
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0029_pograni_ultimate_skill',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'duration' },
                        'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
                        'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                        'atb_trigger': { kind: 'blackboard', key: 'atb_trigger' },
                        'atb_final': { kind: 'blackboard', key: 'atb_final' },
                        'poise_final': { kind: 'blackboard', key: 'poise_final' },
                      },
                    }),
                  ),
                ),
                scheduled(
                  50,
                  sequence(
                    step('finishCurrentAbilityEntity', {}),
                  ),
                ),
              ],
            } },
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'ae4',
          }),
        ),
      ),
      scheduled(
        76,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([133, 147, 160, 173, 186, 200, 213, 226, 240, 256, 276, 300]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '8:ultimate6:direct31:chr_0029_pograni_ultimate_skill11:actionOrder2:29'),
        ),
      ),
    ],
  },
  {
    'atb_final': [30, 30, 30, 30, 30, 30, 30, 30, 30, 40, 40, 40],
    'atb_trigger': [7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 7.5, 10, 10, 10],
    'atk_scale_final': [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    'atk_scale_rush': [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    'atk_scale_trigger': [0.45, 0.49, 0.53, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.92, 1],
    'duration': 30,
    'poise_final': 15,
    'poise_rush': 10,
  },
);

export const pogranichnikGeneratedOperator: OperatorDefinition = {
  slug: 'pogranichnik',
  gameId: 'POGRANICHNIK',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'vanguard',
  mainAttribute: 'will',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [12, 31, 51, 71, 91, 101],
    agility: [13, 34, 55, 77, 99, 110],
    intellect: [10, 28, 48, 67, 87, 97],
    will: [20, 52, 87, 121, 156, 173],
    baseAttack: [30, 92, 157, 223, 288, 321],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [pogranichnikBasicAttack1, pogranichnikBasicAttack2, pogranichnikBasicAttack3, pogranichnikBasicAttack4, pogranichnikBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: pogranichnikFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: pogranichnikPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: pogranichnikBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: pogranichnikComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: pogranichnikUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0029_pograni_ultimate_skill_finall_rush': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1.2,
      blackboard: {
        'atb_final': 0,
        'atk_scale_final': 0,
        'count': 4,
        'duration': 20,
        'poise_final': 0,
      },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              dieWhenSourceDies: false,
              inheritActionBlackboard: true,
              target: 'caster',
            }),
          ),
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              dieWhenSourceDies: false,
              inheritActionBlackboard: true,
              target: 'caster',
            }),
          ),
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              dieWhenSourceDies: false,
              inheritActionBlackboard: true,
              target: 'caster',
            }),
          ),
        ),
        scheduled(
          0,
          sequence(
            step('spawnAbilityEntity', {
              abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill',
              dieWhenSourceDies: false,
              inheritActionBlackboard: true,
              target: 'caster',
            }),
          ),
        ),
      ],
    },
    'buff_chr_0029_pograni_talent1': {
      stackingType: 'highPriorityWithMaxStack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_pograni_talent_1',
        iconPath: '/operators/pogranichnik/icon_battle_pograni_talent_1.webp',
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
      maxStackCount: { blackboardKey: 'max_stack' },
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0.1,
        'duration': 20,
        'max_stack': 3,
        'physpell_up': 10,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
        {
          attribute: 'PhysicalAndSpellInflictionEnhance',
          slot: 'baseAddition',
          value: { blackboardKey: 'physpell_up' },
        },
      ],
    },
    'buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atb_final': 0,
        'atb_trigger': 0,
        'atk_scale_final': 0,
        'atk_scale_trigger': 0,
        'atk_up_temp': 0,
        'duration': 20,
        'duration_temp': 0,
        'interval': 0.1,
        'max_stack_owner_temp': 0,
        'max_stack_team_temp': 0,
        'physpell_up_temp': 0,
        'poise_final': 0,
        'radius': 5,
      },
      abilityEventResponses: [
        {
          event: 'beforeTakePhysicalInfliction',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0029_pograni_soldier_attacked' } },
                sequence(
                  step('finishBuffsById', {
                    target: 'buffSource',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                    reason: 'other',
                    count: { kind: 'constant', value: 1 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0029_pograni_ultimate_skill_finall_rush',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                      'atb_final': { kind: 'blackboard', key: 'atb_final' },
                      'poise_final': { kind: 'blackboard', key: 'poise_final' },
                    },
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'chr_0029_pograni_soldier_attacked',
                    durationSeconds: { kind: 'blackboard', key: 'interval' },
                    autoFinishByAction: false,
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                    desiredKey: 'duration',
                    outputKey: 'duration_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'atk_up',
                    outputKey: 'atk_up_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'physpell_up',
                    outputKey: 'physpell_up_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'max_stack_owner',
                    outputKey: 'max_stack_owner_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'max_stack_team',
                    outputKey: 'max_stack_team_temp',
                  }),
                  branch(
                    { kind: 'eventSourceMatchesBuffSource' },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0029_pograni_talent1',
                        target: 'eventTarget',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'duration': { kind: 'blackboard', key: 'duration_temp' },
                          'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                          'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                          'max_stack': { kind: 'blackboard', key: 'max_stack_owner_temp' },
                        },
                      }),
                    ),
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0029_pograni_talent1',
                        target: 'eventTarget',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'duration': { kind: 'blackboard', key: 'duration_temp' },
                          'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                          'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                          'max_stack': { kind: 'blackboard', key: 'max_stack_team_temp' },
                        },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
        },
        {
          event: 'beforeTakePhysicalInfliction',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0029_pograni_soldier_attacked' } },
                sequence(
                  step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill', definition: { lifetime: { kind: 'limited', durationSeconds: 50 } }, dieWhenSourceDies: false, inheritActionBlackboard: true, target: 'caster' }),
                  step('finishBuffsById', {
                    target: 'buffSource',
                    buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                    reason: 'other',
                    count: { kind: 'constant', value: 1 },
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'chr_0029_pograni_soldier_attacked',
                    durationSeconds: { kind: 'blackboard', key: 'interval' },
                    autoFinishByAction: false,
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                    desiredKey: 'duration',
                    outputKey: 'duration_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'atk_up',
                    outputKey: 'atk_up_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'physpell_up',
                    outputKey: 'physpell_up_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'max_stack_owner',
                    outputKey: 'max_stack_owner_temp',
                  }),
                  step('readBuffBlackboard', {
                    target: 'buffSource',
                    query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                    desiredKey: 'max_stack_team',
                    outputKey: 'max_stack_team_temp',
                  }),
                  branch(
                    { kind: 'eventSourceMatchesBuffSource' },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0029_pograni_talent1',
                        target: 'eventTarget',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'duration': { kind: 'blackboard', key: 'duration_temp' },
                          'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                          'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                          'max_stack': { kind: 'blackboard', key: 'max_stack_owner_temp' },
                        },
                      }),
                    ),
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0029_pograni_talent1',
                        target: 'eventTarget',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'duration': { kind: 'blackboard', key: 'duration_temp' },
                          'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                          'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                          'max_stack': { kind: 'blackboard', key: 'max_stack_team_temp' },
                        },
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
              ),
            ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0029_pograni_soldier_attacked' } },
                sequence(
                  branch(
                    { kind: 'eventSourceMatchesBuffSourceEntitySource' },
                    sequence(
                      branch(
                        {
                          kind: 'eventDamageTagsMatch',
                          match: 'hasAll',
                          tags: ['comboSkill'],
                        },
                        sequence(
                          step('finishBuffsById', {
                            target: 'buffSource',
                            buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                            reason: 'other',
                            count: { kind: 'constant', value: 1 },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0029_pograni_ultimate_skill_finall_rush',
                            target: 'buffOwner',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
                              'atb_final': { kind: 'blackboard', key: 'atb_final' },
                              'poise_final': { kind: 'blackboard', key: 'poise_final' },
                            },
                          }),
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'chr_0029_pograni_soldier_attacked',
                            durationSeconds: { kind: 'blackboard', key: 'interval' },
                            autoFinishByAction: false,
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                            desiredKey: 'duration',
                            outputKey: 'duration_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'atk_up',
                            outputKey: 'atk_up_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'physpell_up',
                            outputKey: 'physpell_up_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'max_stack_owner',
                            outputKey: 'max_stack_owner_temp',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0029_pograni_talent1',
                            target: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'duration': { kind: 'blackboard', key: 'duration_temp' },
                              'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                              'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                              'max_stack': { kind: 'blackboard', key: 'max_stack_owner_temp' },
                            },
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
        },
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0029_pograni_soldier_attacked' } },
                sequence(
                  branch(
                    { kind: 'eventSourceMatchesBuffSourceEntitySource' },
                    sequence(
                      branch(
                        {
                          kind: 'eventDamageTagsMatch',
                          match: 'hasAll',
                          tags: ['comboSkill'],
                        },
                        sequence(
                          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0029_pograni_ultimate_skill', definition: { lifetime: { kind: 'limited', durationSeconds: 50 } }, dieWhenSourceDies: false, inheritActionBlackboard: true, target: 'caster' }),
                          step('finishBuffsById', {
                            target: 'buffSource',
                            buffIds: ['buff_chr_0029_pograni_ultimate_skill_count'],
                            reason: 'other',
                            count: { kind: 'constant', value: 1 },
                          }),
                          step('createTimedMarker', {
                            target: 'caster',
                            markerId: 'chr_0029_pograni_soldier_attacked',
                            durationSeconds: { kind: 'blackboard', key: 'interval' },
                            autoFinishByAction: false,
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent2'] },
                            desiredKey: 'duration',
                            outputKey: 'duration_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'atk_up',
                            outputKey: 'atk_up_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'physpell_up',
                            outputKey: 'physpell_up_temp',
                          }),
                          step('readBuffBlackboard', {
                            target: 'buffSource',
                            query: { kind: 'id', buffIds: ['buff_chr_0029_pograni_talent1_exist'] },
                            desiredKey: 'max_stack_owner',
                            outputKey: 'max_stack_owner_temp',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0029_pograni_talent1',
                            target: 'buffSource',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'duration': { kind: 'blackboard', key: 'duration_temp' },
                              'atk_up': { kind: 'blackboard', key: 'atk_up_temp' },
                              'physpell_up': { kind: 'blackboard', key: 'physpell_up_temp' },
                              'max_stack': { kind: 'blackboard', key: 'max_stack_owner_temp' },
                            },
                          }),
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
    'buff_chr_0029_pograni_ultimate_skill_count': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_pograni_buff',
        iconPath: '/operators/pogranichnik/icon_battle_pograni_buff.webp',
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
      maxStackCount: 99,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'count': 4,
        'duration': 30,
      },
    },
    'buff_chr_0029_pograni_ultimate_skill': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atb_final': 0,
        'atb_trigger': 0,
        'atk_scale_final': 0,
        'atk_scale_rush': 0,
        'atk_scale_trigger': 0,
        'count': 5,
        'duration': 20,
        'poise_final': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0029_pograni_ultimate_skill_abilityentity_inaura',
            target: 'enemy',
            inheritSourceSkillCastInfo: false,
            finishByAction: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
              'atk_scale_final': { kind: 'blackboard', key: 'atk_scale_final' },
              'atb_trigger': { kind: 'blackboard', key: 'atb_trigger' },
              'atb_final': { kind: 'blackboard', key: 'atb_final' },
              'poise_final': { kind: 'blackboard', key: 'poise_final' },
            },
          }),
        ),
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0029_pograni_ultimate_skill_count',
            target: 'buffSource',
            inheritSourceSkillCastInfo: true,
            count: { kind: 'blackboard', key: 'count' },
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
            },
          }),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffSource',
            buffIds: ['buff_chr_0029_pograni_ultimate_skill_effect_layer'],
            reason: 'other',
          }),
        ),
      },
    },
    'buff_chr_0029_pograni_talent1_exist': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      blackboard: {
        'atk_up': 0,
        'max_stack_owner': 5,
        'max_stack_team': 3,
        'physpell_up': 0,
      },
    },
    'buff_chr_0029_pograni_talent2': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      blackboard: {
        'duration': 20,
      },
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0029_pograni_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 50 }, childSkill: {
        skillId: 'chr_0029_pograni_ultimate_skill_abilityentity_finish4',
        blackboard: {
          'atb_final': 50,
          'atk_scale_final': 1,
          'minAngle': 0,
          'number': 0,
          'owner_mainchar_alpha': 0,
          'owner_mainchar_distance': 0,
          'poise_final': 0,
          'radius': 5,
        },
        scheduledSequences: [
          scheduled(
            25,
            sequence(
              branch(
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'chr_0029_pograni_ultimate_finalhit' } },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'atb_final' },
                    recipient: 'team',
                    spGainKind: 'gain',
                    spGainSource: 'skill',
                  }),
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'chr_0029_pograni_ultimate_finalhit',
                    durationSeconds: { kind: 'constant', value: 0.1 },
                    autoFinishByAction: false,
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_final' },
                    tags: ['ultimateSkill'],
                    features: ['canBreakWeakness'],
                    stagger: { kind: 'blackboard', key: 'poise_final' },
                  }, '99:abilityentity_chr_0029_pograni_ultimate_skill:chr_0029_pograni_ultimate_skill_abilityentity_finish411:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[4]11:actionOrder2:13'),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            31,
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0029_pograni_ultimate_skill'],
                reason: 'other',
              }),
            ),
          ),
          scheduled(
            75,
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
      modifiers: [],
      passiveSkills: [
        {
          key: 'chr_0029_pograni_talent1',
          blackboard: {
            'atb_gain': 80,
            'atk_up': [0.04, 0.08],
            'duration': 20,
            'max_stack_owner': 3,
            'physpell_up': [4, 8],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0029_pograni_talent1_exist',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'atk_up': { kind: 'blackboard', key: 'atk_up' },
                'physpell_up': { kind: 'blackboard', key: 'physpell_up' },
                'max_stack_owner': { kind: 'blackboard', key: 'max_stack_owner' },
              },
            }),
            step('listenForCombatEvents', {
              responses: [
                  {
                    key: 'native-event-1-0',
                    event: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
                    phase: 'dataAction',
                    priority: 0,
                    sequence: sequence(
                      step('storeEventSpGainAmount', { outputKey: 'atb_contain_temp' }),
                      step('modifyActionValue', {
                        key: 'EntityBB_atb_contain',
                        operation: 'add',
                        value: { kind: 'blackboard', key: 'atb_contain_temp' },
                      }),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_atb_contain' },
                          operator: 'greaterOrEqual',
                          right: { kind: 'blackboard', key: 'atb_gain' },
                        },
                        sequence(
                          step('calculateActionValue', {
                            key: 'atb_gain_minus',
                            operation: 'multiply',
                            left: { kind: 'blackboard', key: 'atb_gain' },
                            right: { kind: 'constant', value: -1 },
                          }),
                          step('modifyActionValue', {
                            key: 'EntityBB_atb_contain',
                            operation: 'add',
                            value: { kind: 'blackboard', key: 'atb_gain_minus' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0029_pograni_talent1',
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'duration': { kind: 'blackboard', key: 'duration' },
                              'atk_up': { kind: 'blackboard', key: 'atk_up' },
                              'physpell_up': { kind: 'blackboard', key: 'physpell_up' },
                              'max_stack': { kind: 'blackboard', key: 'max_stack_owner' },
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
          key: 'buff_chr_0029_pograni_talent2',
          blackboard: {
            'duration': [5, 10],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0029_pograni_talent2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'duration' },
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
          value: 15,
        },
      ],
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
        { kind: 'addStaticDamageIncrease', target: 'physical', value: 0.1 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0029_pograni_talent1',
          blackboardKey: 'atb_gain',
          operation: 'assign',
          value: 60,
        },
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0029_pograni_talent1',
          blackboardKey: 'max_stack_owner',
          operation: 'assign',
          value: 5,
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
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atb_ratio',
          operation: 'assign',
          value: 1.2,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
