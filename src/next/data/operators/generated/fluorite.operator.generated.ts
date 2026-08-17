/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const fluoriteBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([25, 28, 30, 33, 35, 38, 40, 43, 45, 48, 52, 56]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0022_bounda_attack131:chr_0022_bounda_attack1_projhit11:actionOrder1:71:0'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const fluoriteBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([33, 36, 39, 42, 46, 49, 52, 55, 59, 63, 67, 73]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0022_bounda_attack231:chr_0022_bounda_attack2_projhit11:actionOrder1:51:0'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.33, 0.36, 0.39, 0.42, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.67, 0.73],
    'display_atk_scale': [0.33, 0.36, 0.39, 0.42, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.67, 0.73],
  },
);

export const fluoriteBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([26, 28, 31, 33, 36, 38, 41, 43, 46, 49, 53, 57]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0022_bounda_attack331:chr_0022_bounda_attack3_projhit11:actionOrder1:41:0'),
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
    'atk_scale': [0.26, 0.28, 0.31, 0.33, 0.36, 0.38, 0.41, 0.43, 0.46, 0.49, 0.53, 0.57],
  },
);

export const fluoriteBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 52,
    scheduledSequences: [
      scheduled(
        29,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 102, 108, 116, 125, 135]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 15,
          }, '12:basicAttack410:projectile23:chr_0022_bounda_attack431:chr_0022_bounda_attack4_projhit11:actionOrder1:41:0'),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 102, 108, 116, 125, 135]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 15,
          }, '12:basicAttack410:projectile23:chr_0022_bounda_attack431:chr_0022_bounda_attack4_projhit11:actionOrder1:41:0'),
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
    'atb': 15,
    'atk_scale': [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    'attack_poise': 15,
    'display_atk_scale': [1.8, 1.98, 2.16, 2.34, 2.52, 2.7, 2.88, 3.06, 3.24, 3.47, 3.74, 4.05],
  },
);

export const fluoriteBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    timelineBlockFrames: 49,
    scheduledSequences: [
      scheduled(
        26,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 102, 108, 116, 125, 135]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 15,
          }, '12:basicAttack510:projectile25:chr_0022_bounda_attack4_131:chr_0022_bounda_attack4_projhit11:actionOrder1:41:0'),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([60, 66, 72, 78, 84, 90, 96, 102, 108, 116, 125, 135]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 15,
          }, '12:basicAttack510:projectile25:chr_0022_bounda_attack4_131:chr_0022_bounda_attack4_projhit11:actionOrder1:41:0'),
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
    'atb': 15,
    'atk_scale': [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    'attack_poise': 15,
    'display_atk_scale': [1.8, 1.98, 2.16, 2.34, 2.52, 2.7, 2.88, 3.06, 3.24, 3.47, 3.74, 4.05],
  },
);

export const fluoriteFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 22,
    scheduledSequences: [
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
        20,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct28:chr_0022_bounda_power_attack11:actionOrder2:10'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const fluoritePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0022_bounda_plunging_attack_end11:actionOrder1:5'),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
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
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const fluoriteBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 35,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0022_bounda_normal_skill_onlymark',
            definition: {
              stackingType: 'stack',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: 5,
              triggerIntervalSeconds: 0,
              waitFirstTriggerInterval: true,
              maxTriggerCount: 1,
              applyTagIds: [-1486085048],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        99,
        sequence(
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([187, 206, 224, 243, 262, 280, 299, 318, 336, 360, 388, 420]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill13:abilityEntity28:chr_0022_bounda_normal_skill36:chr_0022_bounda_normal_skill_projhit41:chr_0022_bounda_normal_skill_abilityrange11:actionOrder2:191:01:6'),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([187, 206, 224, 243, 262, 280, 299, 318, 336, 360, 388, 420]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill13:abilityEntity28:chr_0022_bounda_normal_skill36:chr_0022_bounda_normal_skill_projhit41:chr_0022_bounda_normal_skill_abilityrange11:actionOrder2:191:01:6'),
        ),
      ),
      scheduled(
        159,
        sequence(
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([187, 206, 224, 243, 262, 280, 299, 318, 336, 360, 388, 420]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill13:abilityEntity28:chr_0022_bounda_normal_skill36:chr_0022_bounda_normal_skill_projhit41:chr_0022_bounda_normal_skill_abilityrange11:actionOrder2:191:02:20'),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([187, 206, 224, 243, 262, 280, 299, 318, 336, 360, 388, 420]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill13:abilityEntity28:chr_0022_bounda_normal_skill36:chr_0022_bounda_normal_skill_projhit41:chr_0022_bounda_normal_skill_abilityrange11:actionOrder2:191:02:20'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.87, 2.06, 2.24, 2.43, 2.62, 2.8, 2.99, 3.18, 3.36, 3.6, 3.88, 4.2],
    'boom_up': 0.3,
    'duration': 3,
    'move_speed_scalar': 0.3,
    'poise': 10,
  },
);

export const fluoriteComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 17,
    cooldownFrames: [1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1200, 1140],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-27-0',
                  event: { kind: 'enemyDefeated', scope: 'operator' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'eventDamageTagsMatch',
                        match: 'hasAll',
                        tags: ['comboSkill'],
                      },
                      sequence(
                        branch(
                          {
                            kind: 'actionValueCompare',
                            left: { kind: 'blackboard', key: 'atk_up_potential_4' },
                            operator: 'greater',
                            right: { kind: 'constant', value: 0 },
                          },
                          sequence(
                            step('applyBuff', {
                              buffId: 'buff_chr_0022_bounda_potential_4',
                              target: 'caster',
                              inheritSourceSkillCastInfo: true,
                              blackboardAssignments: {
                                'atk_up_potential_4': { kind: 'blackboard', key: 'atk_up_potential_4' },
                                'duration_potential_4': { kind: 'blackboard', key: 'duration_potential_4' },
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
        20,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.533 },
            slot: 0,
            priority: -593023102,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
          }),
        ),
        13,
      ),
      scheduled(
        15,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
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
                  left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 3 },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'nature', isExtra: false }),
                ),
              ),
            ),
          ),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([169, 186, 203, 220, 237, 254, 270, 287, 304, 325, 351, 380]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct27:chr_0022_bounda_combo_skill11:actionOrder2:19'),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atb': 10,
    'atk_scale': [1.69, 1.86, 2.03, 2.2, 2.37, 2.54, 2.7, 2.87, 3.04, 3.25, 3.51, 3.8],
    'atk_scale_add_1': [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 1, 1.2, 1.2],
    'atk_scale_add_2': [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 2, 2.4, 2.4],
    'atk_scale_add_3': [1.05, 1.2, 1.35, 1.5, 1.65, 1.8, 1.95, 2.1, 2.25, 2.6, 3.2, 3.2],
    'atk_scale_add_4': [1.33, 1.5, 1.67, 1.83, 2, 2.18, 2.35, 2.52, 2.69, 3.33, 4.15, 4.15],
    'poise': 10,
    'usp': 10,
  },
);

export const fluoriteUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 77,
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
        59,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([111, 122, 133, 144, 156, 167, 178, 189, 200, 214, 231, 250]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '8:ultimate10:projectile30:chr_0022_bounda_ultimate_skill40:chr_0022_bounda_ultimate_skill_1_projhit11:actionOrder2:251:0'),
        ),
      ),
      scheduled(
        63,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([111, 122, 133, 144, 156, 167, 178, 189, 200, 214, 231, 250]),
            tags: ['ultimateSkill'],
            stagger: 5,
          }, '8:ultimate10:projectile30:chr_0022_bounda_ultimate_skill40:chr_0022_bounda_ultimate_skill_2_projhit11:actionOrder2:261:0'),
        ),
      ),
      scheduled(
        67,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([111, 122, 133, 144, 156, 167, 178, 189, 200, 214, 231, 250]),
            tags: ['ultimateSkill'],
            stagger: 5,
          }, '8:ultimate10:projectile30:chr_0022_bounda_ultimate_skill40:chr_0022_bounda_ultimate_skill_3_projhit11:actionOrder2:271:0'),
        ),
      ),
      scheduled(
        72,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [-1411846745],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 2 },
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
                  value: { kind: 'constant', value: 2 },
                },
                sequence(
                  step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                ),
              ),
            ),
          ),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([111, 122, 133, 144, 156, 167, 178, 189, 200, 214, 231, 250]),
            tags: ['ultimateSkill'],
            stagger: 5,
          }, '8:ultimate10:projectile30:chr_0022_bounda_ultimate_skill40:chr_0022_bounda_ultimate_skill_4_projhit11:actionOrder2:281:6'),
        ),
      ),
    ],
  },
  {
    'atk_scale1': [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    'atk_scale2': [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    'atk_scale3': [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    'atk_scale4': [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    'boom_up': 0.3,
    'poise': 5,
  },
);

export const fluoriteGeneratedOperator: OperatorDefinition = {
  slug: 'fluorite',
  gameId: 'FLUORITE',
  rarity: 4,
  weaponType: 'handcannon',
  element: 'nature',
  role: 'caster',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [14, 30, 47, 64, 81, 90],
    agility: [14, 47, 81, 116, 150, 168],
    intellect: [12, 34, 57, 80, 103, 114],
    will: [10, 27, 45, 64, 82, 91],
    baseAttack: [30, 88, 150, 211, 272, 303],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [fluoriteBasicAttack1, fluoriteBasicAttack2, fluoriteBasicAttack3, fluoriteBasicAttack4, fluoriteBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: fluoriteFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: fluoritePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: fluoriteBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: fluoriteUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: fluoriteComboSkill },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
    },
    {
      key: 'talent2',
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
          kind: 'addBuildAttribute',
          attributes: ['agility', 'intellect'],
          value: 10,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_potential',
          operation: 'assign',
          value: 6,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_lv',
          operation: 'assign',
          value: 3,
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
          multiplier: 0.9,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['finisher', 'ultimate'] }] },
};
