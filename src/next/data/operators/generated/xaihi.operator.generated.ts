/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, forEachContextTarget, percentages, scheduled, sequence, step, withActionBlackboardScope, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const xaihiComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0011_seraph_combo_skill',
    timelineBlockFrames: 25,
    cooldownFrames: [240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 240, 210],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0011_seraph_combo_skill_listener', 'buff_chr_0011_seraph_normal_skill_heal'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.900000036 },
            slot: "unassigned",
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
            influenceSkillCooldownSeconds: { kind: 'constant', value: 0.4 },
          }),
        ),
        24,
      ),
      scheduled(
        24,
        sequence(
          step('findOwnerSpawnedAbilityEntities', { saveToContextKey: 'ball', abilityEntityIds: ['abilityentity_chr_0011_seraph_normal_skill', 'abilityentity_chr_0011_seraph_normal_skill_buff', 'abilityentity_chr_0027_tangtang_normal_skill_02_02'] }),
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              forEachContextTarget(
                'ball',
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0011_seraph_finishball_02',
                    target: 'currentAbilityEntity',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
              step('finishBuffsById', {
                target: 'party',
                buffIds: ['buff_chr_0011_seraph_atk_buff_normal_skill'],
                reason: 'other',
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
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_combo_skill_projhit:15.0',
            { atk_scale: 0, cryst_up: 0, duration: 0, exist_talent_1: 0, poise: 0, potential_3: 0, usp: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'exist_talent_1' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  branch(
                    {
                      kind: 'entityTagMatch',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      tags: ["Skill/Character/Common/SpellInflict/CrystInflict", "Skill/Character/Common/SpellStatus/Frozen"],
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0011_seraph_talent_1_crystup',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'cryst_up': { kind: 'blackboard', key: 'cryst_up' },
                          'duration': { kind: 'blackboard', key: 'duration' },
                        },
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
        ),
      ),
      scheduled(
        24,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_combo_skill_projhit:15.0',
            { atk_scale: 0, cryst_up: 0, duration: 0, exist_talent_1: 0, poise: 0, potential_3: 0, usp: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'potential_3' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 1 },
                    },
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_bounced' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                  ],
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'EntityBB_bounced',
                    operation: 'assign',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([200, 220, 240, 260, 280, 300, 320, 340, 360, 385, 415, 450]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill10:projectile27:chr_0011_seraph_combo_skill35:chr_0011_seraph_combo_skill_projhit11:actionOrder2:151:02:15'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_combo_skill_projhit:15.0',
            { atk_scale: 0, cryst_up: 0, duration: 0, exist_talent_1: 0, poise: 0, potential_3: 0, usp: 0 },
            true,
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
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
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    'poise': 10,
    'usp': 10,
    'cryst_up': 0,
    'duration': 0,
    'exist_talent_1': 0,
    'potential_3': 0,
  },
);

export const xaihiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0011_seraph_attack1',
    timelineBlockFrames: 13,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0011_seraph_attack131:chr_0011_seraph_attack1_projhit11:actionOrder1:41:0'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_attack1_projhit:4',
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
    'atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
  },
);

export const xaihiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0011_seraph_attack2',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([16, 18, 19, 21, 22, 24, 26, 27, 29, 31, 33, 36]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0011_seraph_attack231:chr_0011_seraph_attack2_projhit11:actionOrder1:21:0'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_attack2_projhit:2',
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
    'atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
    'display_atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
);

export const xaihiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0011_seraph_attack3',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([21, 23, 25, 27, 29, 32, 34, 36, 38, 40, 44, 47]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0011_seraph_attack331:chr_0011_seraph_attack3_projhit11:actionOrder1:41:0'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_attack3_projhit:4',
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
    'atk_scale': [0.21, 0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.38, 0.4, 0.44, 0.47],
    'display_atk_scale': [0.21, 0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.38, 0.4, 0.44, 0.47],
  },
);

export const xaihiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0011_seraph_attack4',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile23:chr_0011_seraph_attack431:chr_0011_seraph_attack4_projhit11:actionOrder1:41:0'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_attack4_projhit:4',
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
        12,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([17, 18, 20, 21, 23, 25, 26, 28, 30, 32, 34, 37]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile23:chr_0011_seraph_attack431:chr_0011_seraph_attack4_projhit11:actionOrder1:31:0'),
          withActionBlackboardScope(
            'projectile:chr_0011_seraph_attack4_projhit:3',
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
    'atk_scale': [0.17, 0.18, 0.2, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.37],
    'display_atk_scale': [0.33, 0.36, 0.4, 0.43, 0.46, 0.5, 0.53, 0.56, 0.59, 0.64, 0.68, 0.74],
  },
);

export const xaihiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0011_seraph_attack5',
    timelineBlockFrames: 33,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([55, 61, 66, 72, 77, 83, 88, 94, 99, 106, 114, 124]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 15,
          }, '12:basicAttack56:direct23:chr_0011_seraph_attack511:actionOrder2:15'),
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
    ],
  },
  {
    'atb': 15,
    'atk_scale': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
    'display_atk_scale': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
    'poise': 15,
  },
);

export const xaihiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0011_seraph_power_attack',
    timelineBlockFrames: 34,
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
        50,
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
        34,
      ),
      scheduled(
        32,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct28:chr_0011_seraph_power_attack11:actionOrder1:7'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const xaihiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0011_seraph_plunging_attack_end',
    timelineBlockFrames: 13,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0011_seraph_plunging_attack_end11:actionOrder1:3'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const xaihiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0011_seraph_normal_skill',
    timelineBlockFrames: 31,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0011_seraph_talent_1_atb'],
                reason: 'other',
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
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_spawnball',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
              'heal_value': { kind: 'blackboard', key: 'heal_value' },
              'buff_duration': { kind: 'blackboard', key: 'buff_duration' },
              'will_up': { kind: 'blackboard', key: 'will_up' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'atk_up': [0.09, 0.09, 0.09, 0.09, 0.09, 0.11, 0.11, 0.11, 0.13, 0.13, 0.13, 0.15],
    'atk_scale': 0.1,
    'heal_value': [144, 172.8, 201.6, 230.4, 244.8, 259.2, 273.6, 288, 302.4, 309.6, 316.8, 324],
    'buff_duration': 25,
    'will_up': [0.336, 0.4, 0.47, 0.54, 0.57, 0.6, 0.64, 0.67, 0.71, 0.72, 0.74, 0.76],
    'duration': 20,
    'atb': 0,
  },
);

export const xaihiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0011_seraph_ultimate_skill',
    timelineBlockFrames: 67,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 1 },
            slot: "TimeDilation/Layer/Entity/HitStop",
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
        80,
      ),
      scheduled(
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_atk_buff',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_up': { kind: 'blackboard', key: 'atk_up' },
              'duration': { kind: 'blackboard', key: 'duration' },
              'wisd_up': { kind: 'blackboard', key: 'wisd_up' },
              'wisd_max': { kind: 'blackboard', key: 'wisd_max' },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0011_seraph_atk_buff_2',
            target: 'party',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
    ],
  },
  {
    'atk_up': [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.24],
    'duration': 12,
    'wisd_up': [0.00014, 0.00015, 0.00016, 0.00018, 0.00019, 0.0002, 0.00022, 0.00023, 0.00024, 0.00026, 0.00028, 0.0003],
    'wisd_max': [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.36],
  },
);

export const xaihiGeneratedOperator: OperatorDefinition = {
  slug: 'xaihi',
  gameId: 'XAIHI',
  rarity: 5,
  weaponType: 'arts-unit',
  element: 'cryo',
  role: 'supporter',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 26, 44, 62, 80, 89],
    agility: [9, 26, 45, 64, 82, 91],
    intellect: [15, 39, 64, 89, 114, 127],
    will: [15, 43, 74, 104, 134, 150],
    baseAttack: [30, 86, 144, 203, 262, 291],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [xaihiBasicAttack1, xaihiBasicAttack2, xaihiBasicAttack3, xaihiBasicAttack4, xaihiBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: xaihiFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: xaihiPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: xaihiBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: xaihiComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: xaihiUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0011_seraph_finishball_02': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
    },
    'buff_chr_0011_seraph_talent_1_crystup': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_cryst_taken_up',
        iconPath: '/icons/icon_battle_cryst_taken_up.webp',
        showInHeadBarCommon: true,
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
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'cryst_up': 0,
        'duration': 0,
      },
      damageModifiers: [
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
              zone: 'normal',
              addition: { blackboardKey: 'cryst_up' },
            },
          ],
        },
      ],
    },
    'buff_chr_0011_seraph_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0011_seraph_spawnball': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'atk_scale': 0.1,
        'atk_up': 0,
        'buff_duration': 0,
        'heal_value': 30,
        'potential_1': 0,
        'will_up': 0,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('spawnAbilityEntity', { abilityEntityId: 'abilityentity_chr_0011_seraph_normal_skill',  dieWhenSourceDies: false, inheritActionBlackboard: true }),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      },
    },
    'buff_chr_0011_seraph_atk_buff': {
      stackingType: 'stack',
      childPresentations: [
        {
          buffId: 'buff_chr_0011_seraph_ultimate_effect',
          presentation: {
            visible: true,
            iconId: 'icon_battle_affix_cryst_enhance',
            iconPath: '/icons/icon_battle_affix_cryst_enhance.webp',
            showInHeadBarCommon: true,
            showInHeadBarAttached: false,
            showInSquadIcon: true,
            onlyShowForMainCharacter: false,
            iconStyleInSquad: 'LifeTime',
            abnormalColorType: 'Physical',
            orderPriority: {
              useDirectoryValue: false,
              value: 0,
              category: 'KeywordDebuff',
            },
          },
        },
        {
          buffId: 'buff_chr_0011_seraph_ultimate_effect_2',
          presentation: {
            visible: true,
            iconId: 'icon_battle_affix_natural_enhance',
            iconPath: '/icons/icon_battle_affix_natural_enhance.webp',
            showInHeadBarCommon: true,
            showInHeadBarAttached: false,
            showInSquadIcon: true,
            onlyShowForMainCharacter: false,
            iconStyleInSquad: 'LifeTime',
            abnormalColorType: 'Physical',
            orderPriority: {
              useDirectoryValue: false,
              value: 0,
              category: 'KeywordDebuff',
            },
          },
        },
      ],
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0,
        'duration': 0,
        'final_atkup': 0,
        'final_final_atkup': 0,
        'wisd_max': 0,
        'wisd_up': 0,
      },
      attributeModifiers: [
        {
          attribute: 'cryoEnhancedDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'final_final_atkup' },
        },
        {
          attribute: 'natureEnhancedDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'final_final_atkup' },
        },
      ],
      lifecycleSequences: {
        start: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'intellect' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'blackboard', key: 'wisd_up' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'final_atkup',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'final_atkup' },
              operator: 'greaterOrEqual',
              right: { kind: 'blackboard', key: 'wisd_max' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'wisd_max' },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'final_final_atkup',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'final_atkup' },
              }),
            ),
            { alwaysNext: true },
          ),
          step('calculateActionValue', {
            key: 'final_final_atkup',
            operation: 'add',
            left: { kind: 'blackboard', key: 'final_final_atkup' },
            right: { kind: 'blackboard', key: 'atk_up' },
          }),
        ),
      },
    },
    'buff_chr_0011_seraph_atk_buff_2': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.2,
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 1,
      blackboard: {
        'atk_scale': 0,
        'heal_value': 0,
      },
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0011_seraph_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 30 } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'exist_talent_1',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'cryst_up',
          operation: 'assign',
          value: [0.07, 0.1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'duration',
          operation: 'assign',
          value: [5, 5],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'exist_talent_2',
          operation: 'assign',
          value: [1],
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
          operation: 'add',
          value: 0.05,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'multiplySkillCost',
          skillGroupKey: 'ultimate',
          resource: 'ultimateEnergy',
          multiplier: 0.9,
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
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['intellect'],
          value: 15,
        },
        { kind: 'addStaticHealingIncrease', target: 'output', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_up',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_up',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'wisd_max',
          operation: 'multiply',
          value: 1.1,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
