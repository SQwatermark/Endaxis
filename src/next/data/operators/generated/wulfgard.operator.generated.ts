/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const wulfgardComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0006_wolfgd_combo_skill',
    timelineBlockFrames: 30,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
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
        12,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0006_wolfgd_combo_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0006_wolfgd_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.6, 0.66, 0.72, 0.78, 0.84, 0.9, 0.96, 1.02, 1.08, 1.16, 1.25, 1.35],
    'poise': 10,
    'usp': 10,
  },
);

export const wulfgardBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0006_wolfgd_attack1',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0006_wolfgd_attack133:chr_0006_wolfgd_attack1_projhit0111:actionOrder1:31:0'),
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
        14,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0006_wolfgd_attack131:chr_0006_wolfgd_attack1_projhit11:actionOrder1:81:0'),
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
    'atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const wulfgardBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0006_wolfgd_attack2',
    timelineBlockFrames: 23,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([18, 19, 21, 23, 25, 26, 28, 30, 32, 34, 36, 39]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0006_wolfgd_attack231:chr_0006_wolfgd_attack2_projhit11:actionOrder1:21:0'),
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
        16,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([18, 19, 21, 23, 25, 26, 28, 30, 32, 34, 36, 39]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0006_wolfgd_attack231:chr_0006_wolfgd_attack2_projhit11:actionOrder1:71:0'),
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
    'atk_scale': [0.18, 0.19, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39],
    'display_atk_scale': [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.67, 0.73, 0.79],
  },
);

export const wulfgardBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0006_wolfgd_attack3',
    timelineBlockFrames: 32,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([19, 20, 22, 24, 26, 28, 30, 31, 33, 36, 38, 42]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0006_wolfgd_attack331:chr_0006_wolfgd_attack3_projhit11:actionOrder1:21:0'),
          branch(
            { kind: 'casterControlled' },
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
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([19, 20, 22, 24, 26, 28, 30, 31, 33, 36, 38, 42]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0006_wolfgd_attack331:chr_0006_wolfgd_attack3_projhit11:actionOrder1:71:0'),
          branch(
            { kind: 'casterControlled' },
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
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([19, 20, 22, 24, 26, 28, 30, 31, 33, 36, 38, 42]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0006_wolfgd_attack331:chr_0006_wolfgd_attack3_projhit11:actionOrder2:121:0'),
          branch(
            { kind: 'casterControlled' },
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
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.19, 0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.31, 0.33, 0.36, 0.38, 0.42],
    'display_atk_scale': [0.56, 0.61, 0.67, 0.72, 0.78, 0.83, 0.89, 0.94, 1, 1.07, 1.15, 1.25],
  },
);

export const wulfgardBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0006_wolfgd_attack4',
    timelineBlockFrames: 53,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([68, 74, 81, 88, 95, 101, 108, 115, 122, 130, 140, 152]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack410:projectile23:chr_0006_wolfgd_attack431:chr_0006_wolfgd_attack4_projhit11:actionOrder1:51:1'),
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
    'atb': 18,
    'atk_scale': [0.68, 0.74, 0.81, 0.88, 0.95, 1.01, 1.08, 1.15, 1.22, 1.3, 1.4, 1.52],
    'poise': 18,
  },
);

export const wulfgardFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0006_wolfgd_power_attack',
    timelineBlockFrames: 34,
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
        60,
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
        34,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct28:chr_0006_wolfgd_power_attack11:actionOrder1:3'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const wulfgardPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0006_wolfgd_plunging_attack_end',
    timelineBlockFrames: 8,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0006_wolfgd_plunging_attack_end11:actionOrder1:3'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const wulfgardBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0006_wolfgd_normal_skill',
    timelineBlockFrames: 32,
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
              tagIds: [-1110095722, 1466867135],
            },
            sequence(
              step('modifyActionValue', {
                key: 'SpellInflict',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 1.67,
          }, '11:battleSkill10:projectile28:chr_0006_wolfgd_normal_skill36:chr_0006_wolfgd_normal_skill_projhit11:actionOrder1:51:1'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 1.67,
          }, '11:battleSkill10:projectile28:chr_0006_wolfgd_normal_skill36:chr_0006_wolfgd_normal_skill_projhit11:actionOrder1:81:1'),
        ),
      ),
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'SpellInflict' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              sequence(
                step('dealDamage', {
                  damageType: 'heat',
                  attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 1.67,
                }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[0]38:chr_0006_wolfgd_normal_skill_projhit_111:actionOrder2:131:0'),
              ),
            ),
            sequence(
              sequence(
                step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                step('dealDamage', {
                  damageType: 'heat',
                  attackScale: percentages([34, 37, 41, 44, 48, 51, 54, 58, 61, 65, 71, 77]),
                  tags: ['normalSkill'],
                  features: ['canBreakWeakness'],
                  stagger: 1.67,
                }, '11:battleSkill11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[0]55:chr_0006_wolfgd_normal_skill_projhit_FireSpellInfiction11:actionOrder2:141:1'),
              ),
            ),
            { alwaysNext: true },
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        31,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'SpellInflict' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('jumpTimeline', { destinationFrame: 118 }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        117,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 247,
          }),
        ),
        117,
      ),
      scheduled(
        141,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_3' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0006_wolfgd_talent_0_effectbuff'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0006_wolfgd_talent_0'] },
                desiredKey: 'add',
                outputKey: 'add',
              }),
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0006_wolfgd_talent_0'] },
                desiredKey: 'duration',
                outputKey: 'duration',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'add': { kind: 'blackboard', key: 'add' },
                  'duration': { kind: 'blackboard', key: 'duration' },
                },
              }),
              step('modifyActionValue', {
                key: 'teammate_percent',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'add' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                target: 'party',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'add': { kind: 'blackboard', key: 'teammate_percent' },
                  'duration': { kind: 'blackboard', key: 'duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        141,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [-1110095722, 1466867135],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent2' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'potential_2' },
                      operator: 'greater',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('modifyActionValue', {
                        key: 'returnskillpower',
                        operation: 'add',
                        value: { kind: 'blackboard', key: 'potential_skillpower' },
                      }),
                    ),
                    undefined,
                    { alwaysNext: true },
                  ),
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'returnskillpower' },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('dealDamage', {
                damageType: 'heat',
                attackScale: percentages([378, 415, 453, 491, 529, 566, 604, 642, 680, 727, 784, 850]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 5,
              }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[2]14:succeedActions10:actionData3:[1]11:actionOrder2:10'),
            ),
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step('dealDamage', {
                damageType: 'heat',
                attackScale: percentages([36, 40, 43, 47, 50, 54, 58, 61, 65, 69, 75, 81]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 0,
              }, '11:battleSkill11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[2]11:failActions10:actionData3:[1]11:actionOrder2:12'),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'SpellInflict': 0,
    'add': 0,
    'duration': 0,
    'potential_3': 0,
    'teammate_percent': 0,
    'atk_scale': [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
    'atk_scale_plus': [3.78, 4.15, 4.53, 4.91, 5.29, 5.66, 6.04, 6.42, 6.8, 7.27, 7.84, 8.5],
    'atk_scale_plus_fail': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    'display_atk_scale': [1.02, 1.12, 1.22, 1.33, 1.43, 1.53, 1.63, 1.74, 1.84, 1.96, 2.12, 2.3],
    'poise_extra_bullet': 5,
    'poise_extra_bullet_fail': 0,
    'poise_first_bullet': 1.67,
    'poise_first_bullet_display': 5,
    'potential_2': 0,
    'potential_skillpower': 0,
    'returnskillpower': 0,
    'talent2': 0,
  },
);

export const wulfgardUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0006_wolfgd_ultimate_skill',
    timelineBlockFrames: 75,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'type', skillType: 'comboSkill' },
                operation: 'set',
                basis: 'absoluteSeconds',
                value: { kind: 'constant', value: 0 },
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
          }),
        ),
        46,
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
        45,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_fire_fire_burning_triggered',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        46,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 35, 38, 42, 45, 48, 51, 54, 58, 62, 66, 72]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '8:ultimate6:direct30:chr_0006_wolfgd_ultimate_skill11:actionOrder2:19'),
        ),
      ),
      scheduled(
        52,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 35, 38, 42, 45, 48, 51, 54, 58, 62, 66, 72]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '8:ultimate6:direct30:chr_0006_wolfgd_ultimate_skill11:actionOrder2:23'),
        ),
      ),
      scheduled(
        59,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 35, 38, 42, 45, 48, 51, 54, 58, 62, 66, 72]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '8:ultimate6:direct30:chr_0006_wolfgd_ultimate_skill11:actionOrder2:27'),
        ),
      ),
      scheduled(
        64,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 35, 38, 42, 45, 48, 51, 54, 58, 62, 66, 72]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '8:ultimate6:direct30:chr_0006_wolfgd_ultimate_skill11:actionOrder2:31'),
        ),
      ),
      scheduled(
        69,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 35, 38, 42, 45, 48, 51, 54, 58, 62, 66, 72]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 3,
          }, '8:ultimate6:direct30:chr_0006_wolfgd_ultimate_skill11:actionOrder2:35'),
        ),
      ),
    ],
  },
  {
    'potential_5': 0,
    'atk_scale': [0.32, 0.35, 0.38, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.66, 0.72],
    'display_atk_scale': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'poise': 3,
    'poise_display': 15,
  },
);

export const wulfgardGeneratedOperator: OperatorDefinition = {
  slug: 'wulfgard',
  gameId: 'WULFGARD',
  rarity: 5,
  weaponType: 'handcannon',
  element: 'heat',
  role: 'caster',
  mainAttribute: 'strength',
  secondaryAttribute: 'agility',
  attributes: {
    strength: [18, 49, 81, 113, 145, 161],
    agility: [9, 27, 47, 66, 85, 95],
    intellect: [9, 27, 45, 64, 83, 92],
    will: [13, 34, 56, 78, 100, 111],
    baseAttack: [30, 86, 146, 205, 264, 294],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [wulfgardBasicAttack1, wulfgardBasicAttack2, wulfgardBasicAttack3, wulfgardBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: wulfgardFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: wulfgardPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: wulfgardBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: wulfgardComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: wulfgardUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0006_wolfgd_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0006_wolfgd_talent_0_effectbuff': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_wolfgd_talent_1',
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
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'add': 0,
        'duration': 0,
      },
      attributeModifiers: [
        {
          attribute: 'FireDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'add' },
        },
      ],
    },
    'buff_chr_0006_wolfgd_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'add': 0,
        'duration': 0,
      },
      abilityEventResponses: [
        {
          event: 'outputBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffTagsMatch',
                  match: 'hasAny',
                  buffTagIds: [-1110095722],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0006_wolfgd_talent_0_effectbuff',
                    target: 'buffSource',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'blackboard', key: 'duration' },
                      'add': { kind: 'blackboard', key: 'add' },
                    },
                  }),
                ),
              ),
            ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0006_wolfgd_combo_skill': { lifetime: { kind: 'limited', durationSeconds: 1.5 }, childSkill: {
        skillId: 'chr_0006_wolfgd_combo_skill_abilityrange',
        blackboard: {
          'atk_scale': 5,
          'duration': 0,
          'move_speed_scalar': 1,
          'poise': 0,
          'radius': 5,
          'usp': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0006_wolfgd_combo_skill_tutorial_marker',
                definition: {
                  stackingType: 'unique',
                  priority: 0,
                  maxStackCount: 1,
                  durationSeconds: 1,
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '82:abilityentity_chr_0006_wolfgd_combo_skill:chr_0006_wolfgd_combo_skill_abilityrange13:abilityEntity40:chr_0006_wolfgd_combo_skill_abilityrange11:actionOrder1:4'),
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp' },
                recipient: 'caster',
              }),
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
          key: 'buff_chr_0006_wolfgd_talent_0',
          blackboard: {
            'add': [0.2, 0.3],
            'duration': [10, 10],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0006_wolfgd_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'add': { kind: 'blackboard', key: 'add' },
                'duration': { kind: 'blackboard', key: 'duration' },
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'returnskillpower',
          operation: 'assign',
          value: [5, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent2',
          operation: 'assign',
          value: [1, 1],
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
          kind: 'addBuildAttribute',
          attributes: ['strength', 'agility'],
          value: 15,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_skillpower',
          operation: 'assign',
          value: 10,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 1,
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
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'teammate_percent',
          operation: 'assign',
          value: 0.5,
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
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
