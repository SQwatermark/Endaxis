/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const gilbertaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0013_aglina_attack1',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile23:chr_0013_aglina_attack131:chr_0013_aglina_attack1_projhit11:actionOrder1:21:0'),
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
    'atb': 0,
    'atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const gilbertaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0013_aglina_attack2',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([18, 20, 22, 23, 25, 27, 29, 31, 32, 35, 37, 41]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0013_aglina_attack231:chr_0013_aglina_attack2_projhit11:actionOrder1:21:0'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([18, 20, 22, 23, 25, 27, 29, 31, 32, 35, 37, 41]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile23:chr_0013_aglina_attack231:chr_0013_aglina_attack2_projhit11:actionOrder1:61:0'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.29, 0.31, 0.32, 0.35, 0.37, 0.41],
    'display_atk_scale': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
  },
);

export const gilbertaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0013_aglina_attack3',
    timelineBlockFrames: 23,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 28, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0013_aglina_attack331:chr_0013_aglina_attack3_projhit11:actionOrder1:11:0'),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 28, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0013_aglina_attack331:chr_0013_aglina_attack3_projhit11:actionOrder1:51:0'),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 28, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile23:chr_0013_aglina_attack331:chr_0013_aglina_attack3_projhit11:actionOrder1:91:0'),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.22, 0.23, 0.24, 0.26, 0.28, 0.3],
    'display_atk_scale': [0.41, 0.45, 0.49, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.78, 0.84, 0.91],
  },
);

export const gilbertaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0013_aglina_attack4',
    timelineBlockFrames: 40,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 37]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 5.440000057220459,
          }, '12:basicAttack410:projectile23:chr_0013_aglina_attack431:chr_0013_aglina_attack4_projhit11:actionOrder1:21:0'),
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
                coefficient: 0.3334,
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
        25,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 37]),
            tags: ['normalAttack'],
            stagger: 5.28000020980835,
          }, '12:basicAttack410:projectile23:chr_0013_aglina_attack433:chr_0013_aglina_attack4_projhit_211:actionOrder1:41:0'),
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
                coefficient: 0.3334,
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
        27,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([17, 18, 20, 22, 23, 25, 27, 28, 30, 32, 35, 37]),
            tags: ['normalAttack'],
            stagger: 5.28000020980835,
          }, '12:basicAttack410:projectile23:chr_0013_aglina_attack433:chr_0013_aglina_attack4_projhit_211:actionOrder1:61:0'),
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
                coefficient: 0.3334,
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
    'atb': 16,
    'atk_scale': [0.17, 0.18, 0.2, 0.22, 0.23, 0.25, 0.27, 0.28, 0.3, 0.32, 0.35, 0.37],
    'display_atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.12],
    'poise': 16,
  },
);

export const gilbertaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0013_aglina_power_attack',
    timelineBlockFrames: 43,
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
        43,
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder1:2'),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder1:6'),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder2:10'),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder2:14'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder2:18'),
        ),
      ),
      scheduled(
        29,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder2:22'),
        ),
      ),
      scheduled(
        43,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.7,
          }, '8:finisher6:direct28:chr_0013_aglina_power_attack11:actionOrder2:26'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
    'display_atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const gilbertaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0013_aglina_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0013_aglina_plunging_attack_end11:actionOrder1:2'),
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

export const gilbertaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0013_aglina_normal_skill',
    timelineBlockFrames: 123,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'radius',
                operation: 'assign',
                value: { kind: 'constant', value: 6.3 },
              }),
            ),
            sequence(
              step('modifyActionValue', {
                key: 'radius',
                operation: 'assign',
                value: { kind: 'constant', value: 5.2 },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0013_aglina_normal_skill',
                        dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
      scheduled(
        29,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([24, 27, 29, 32, 34, 36, 39, 41, 44, 47, 50, 55]),
            tags: ['normalSkill'],
          }, '11:battleSkill6:direct28:chr_0013_aglina_normal_skill11:actionOrder2:29'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        46,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([24, 27, 29, 32, 34, 36, 39, 41, 44, 47, 50, 55]),
            tags: ['normalSkill'],
          }, '11:battleSkill6:direct28:chr_0013_aglina_normal_skill11:actionOrder2:33'),
        ),
      ),
      scheduled(
        62,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([24, 27, 29, 32, 34, 36, 39, 41, 44, 47, 50, 55]),
            tags: ['normalSkill'],
          }, '11:battleSkill6:direct28:chr_0013_aglina_normal_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        78,
        sequence(
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([24, 27, 29, 32, 34, 36, 39, 41, 44, 47, 50, 55]),
            tags: ['normalSkill'],
          }, '11:battleSkill6:direct28:chr_0013_aglina_normal_skill11:actionOrder2:39'),
        ),
      ),
      scheduled(
        108,
        sequence(
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([58, 63, 69, 75, 81, 86, 92, 98, 104, 111, 120, 130]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct28:chr_0013_aglina_normal_skill11:actionOrder2:44'),
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'heal_const' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'not', condition: { kind: 'singleEnemyPresent' } },
              ],
            },
            sequence(
              branch(
                {
                  kind: 'healthCompare',
                  target: 'controlledOperator',
                  valueType: 'ratio',
                  operator: 'less',
                  value: { kind: 'constant', value: 0.99 },
                },
                sequence(
                  step('heal', {
                    target: 'controlledOperator',
                    alwaysNext: true,
                    attribute: 'intellect',
                    multiplier: { kind: 'blackboard', key: 'heal_scale' },
                    addition: { kind: 'blackboard', key: 'heal_const' },
                    tagIds: [-320297214],
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'healthCompare',
                      target: 'lowestHealthRatioOperator',
                      valueType: 'ratio',
                      operator: 'less',
                      value: { kind: 'constant', value: 0.99 },
                    },
                    sequence(
                      step('heal', {
                        target: 'lowestHealthRatioOperator',
                        alwaysNext: true,
                        attribute: 'intellect',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_const' },
                        tagIds: [-320297214],
                      }),
                    ),
                    sequence(
                      step('heal', {
                        target: 'controlledOperator',
                        alwaysNext: true,
                        attribute: 'intellect',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_const' },
                        tagIds: [-320297214],
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'heal_const': 0,
    'potential': 0,
    'radius': 5.2,
    'atk_scale_explosion': [0.58, 0.63, 0.69, 0.75, 0.81, 0.86, 0.92, 0.98, 1.04, 1.11, 1.2, 1.3],
    'atk_scale_pull': [0.24, 0.27, 0.29, 0.32, 0.34, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.55],
    'display_atk_scale_pull': [0.97, 1.07, 1.17, 1.26, 1.36, 1.46, 1.56, 1.65, 1.75, 1.87, 2.02, 2.19],
    'poise': 10,
    'heal_scale': 0,
  },
);

export const gilbertaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0013_aglina_combo_skill',
    timelineBlockFrames: 53,
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
        48,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0013_aglina_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([140, 154, 168, 182, 196, 210, 224, 238, 252, 270, 291, 315]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '10:comboSkill6:direct27:chr_0013_aglina_combo_skill11:actionOrder2:23'),
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'heal_const' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'not', condition: { kind: 'singleEnemyPresent' } },
              ],
            },
            sequence(
              branch(
                {
                  kind: 'healthCompare',
                  target: 'controlledOperator',
                  valueType: 'ratio',
                  operator: 'less',
                  value: { kind: 'constant', value: 0.99 },
                },
                sequence(
                  step('heal', {
                    target: 'controlledOperator',
                    alwaysNext: true,
                    attribute: 'intellect',
                    multiplier: { kind: 'blackboard', key: 'heal_scale' },
                    addition: { kind: 'blackboard', key: 'heal_const' },
                    tagIds: [-320297214],
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'healthCompare',
                      target: 'lowestHealthRatioOperator',
                      valueType: 'ratio',
                      operator: 'less',
                      value: { kind: 'constant', value: 0.99 },
                    },
                    sequence(
                      step('heal', {
                        target: 'lowestHealthRatioOperator',
                        alwaysNext: true,
                        attribute: 'intellect',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_const' },
                        tagIds: [-320297214],
                      }),
                    ),
                    sequence(
                      step('heal', {
                        target: 'controlledOperator',
                        alwaysNext: true,
                        attribute: 'intellect',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_const' },
                        tagIds: [-320297214],
                      }),
                    ),
                    { alwaysNext: true },
                  ),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
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
    'heal_const': 0,
    'atk_scale': [1.4, 1.54, 1.68, 1.82, 1.96, 2.1, 2.24, 2.38, 2.52, 2.7, 2.91, 3.15],
    'poise': 5,
    'usp': 10,
    'heal_scale': 0,
  },
);

export const gilbertaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0013_aglina_ultimate_skill',
    timelineBlockFrames: 64,
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        52,
      ),
      scheduled(
        60,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0013_aglina_ultimate_skill',
                        dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration' },
          }),
        ),
      ),
      scheduled(
        60,
        sequence(
          step('applyElementalInfliction', { element: 'nature', isExtra: false }),
          step('dealDamage', {
            damageType: 'nature',
            attackScale: percentages([333, 367, 400, 433, 467, 500, 534, 567, 600, 642, 692, 750]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '8:ultimate6:direct30:chr_0013_aglina_ultimate_skill11:actionOrder2:25'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [3.33, 3.67, 4, 4.33, 4.67, 5, 5.34, 5.67, 6, 6.42, 6.92, 7.5],
    'duration': 5,
    'move_speed_scalar': 0.8,
    'poise': 20,
    'spell_vulnerable_4stack': [0.252, 0.252, 0.252, 0.308, 0.308, 0.308, 0.364, 0.364, 0.364, 0.42, 0.42, 0.42],
    'spell_vulnerable_perstack': 0.1,
    'spell_vulnerable_rate': [0.18, 0.18, 0.18, 0.22, 0.22, 0.22, 0.26, 0.26, 0.26, 0.3, 0.3, 0.3],
  },
);

export const gilbertaGeneratedOperator: OperatorDefinition = {
  slug: 'gilberta',
  gameId: 'GILBERTA',
  rarity: 6,
  weaponType: 'arts-unit',
  element: 'nature',
  role: 'supporter',
  mainAttribute: 'will',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 26, 44, 62, 80, 89],
    agility: [9, 27, 45, 64, 83, 92],
    intellect: [16, 39, 64, 89, 114, 127],
    will: [20, 52, 86, 120, 154, 171],
    baseAttack: [30, 94, 161, 228, 296, 329],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [gilbertaBasicAttack1, gilbertaBasicAttack2, gilbertaBasicAttack3, gilbertaBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: gilbertaFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: gilbertaPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: gilbertaBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: gilbertaUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: gilbertaComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0013_aglina_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0013_aglina_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 6 }, childSkill: {
        skillId: 'chr_0013_aglina_normal_skill_abilityrange',
        blackboard: {
          'duration': 0,
          'hasrecovered': 0,
          'move_speed_scalar': 1,
          'potential_lv': 0,
          'radius': 0,
          'recovercost': 5,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0013_aglina_normal_skill_monitor',
                definition: {
                  stackingType: 'unlimited',
                  priority: 0,
                  maxStackCount: 1,
                  triggerIntervalSeconds: 0.15,
                  waitFirstTriggerInterval: false,
                  maxTriggerCount: -1,
                  lifecycleSequences: {
                    trigger: {
                      steps: [
                        step('finishCurrentAbilityEntityWhenSourceDies', {}),
                      ],
                    },
                  },
                },
                target: 'currentAbilityEntity',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0013_aglina_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 6 }, childSkill: {
        skillId: 'chr_0013_aglina_ultimate_skill_abilityrange',
        blackboard: {
          'BuffStack': 0,
          'FinalRate': 0,
          'duration': 0,
          'final_resistance_scalar': 0,
          'final_resistance_scalar_inair': 0,
          'move_speed_scalar': 1,
          'potential2': 0,
          'potential2_onceadd': 0,
          'radius': 5,
          'resistance_scalar': 0.3,
          'resistance_scalar_inair': 0.6,
          'spell_vulnerable_perstack': 0,
          'spell_vulnerable_rate': 0,
          'wisd_increase': 0,
          'wisd_increase_inair': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0013_aglina_ultimate_skill',
                definition: {
                  stackingType: 'stack',
                  priority: 0,
                  maxStackCount: 1,
                  applyTagIds: [1077554361],
                  blackboard: {
                    'BuffStack': 0,
                    'FinalRate': 0,
                    'final_resistance_scalar': 0,
                    'final_resistance_scalar_inair': 0,
                    'move_speed_scalar': 0,
                    'potential2': 0,
                    'spell_vulnerable_perstack': 0,
                    'spell_vulnerable_rate': 0,
                  },
                  lifecycleSequences: {
                    enable: sequence(
                      step('modifyActionValue', {
                        key: 'FinalRate',
                        operation: 'assign',
                        value: { kind: 'blackboard', key: 'spell_vulnerable_rate' },
                      }),
                      step('modifyActionValue', {
                        key: 'BuffStack',
                        operation: 'assign',
                        value: { kind: 'constant', value: 0 },
                      }),
                      branch(
                        {
                          kind: 'buffStackCompare',
                          target: 'enemy',
                          tagQueryType: 'hasAny',
                          buffTagIds: [1075718177],
                          operator: 'greater',
                          value: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'BuffStack',
                            query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1075718177] },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'potential2' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'BuffStack' },
                              operator: 'lessOrEqual',
                              right: { kind: 'constant', value: 3 },
                            },
                            sequence(
                              step('modifyActionValue', {
                                key: 'BuffStack',
                                operation: 'add',
                                value: { kind: 'constant', value: 1 },
                              }),
                            ),
                            undefined,
                            { alwaysNext: true },
                          ),
                          step('modifyActionValue', {
                            key: 'BuffStack',
                            operation: 'multiply',
                            value: { kind: 'constant', value: 2 },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                      step('modifyActionValue', {
                        key: 'BuffStack',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'spell_vulnerable_perstack' },
                      }),
                      step('modifyActionValue', {
                        key: 'BuffStack',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                      step('modifyActionValue', {
                        key: 'FinalRate',
                        operation: 'multiply',
                        value: { kind: 'blackboard', key: 'BuffStack' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0013_aglina_ultimate_spell_vulnerable',
                        definition: {
                          stackingType: 'stack',
                          priority: 0,
                          maxStackCount: 1,
                          blackboard: {
                            'rate': 0,
                          },
                          damageModifiers: [
                            {
                              enabledSide: 'defender',
                              condition: {
                                kind: 'eventDamageTypesMatch',
                                damageTypes: ['heat', 'electric', 'cryo', 'nature'],
                              },
                              processors: [
                                {
                                  kind: 'damageScale',
                                  side: 'defender',
                                  zone: 'vulnerable',
                                  addition: { blackboardKey: 'rate' },
                                },
                              ],
                            },
                          ],
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'rate': { kind: 'blackboard', key: 'FinalRate' },
                        },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_common_affixes_slow',
                        definition: {
                          stackingType: 'highPriority',
                          priority: { blackboardKey: 'rate' },
                          maxStackCount: 1,
                          durationSeconds: { blackboardKey: 'duration' },
                          applyTagIds: [1925762097],
                          blackboard: { rate: 0, duration: 0 },
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        finishByAction: true,
                        blackboardAssignments: {
                          rate: { kind: 'blackboard', key: 'move_speed_scalar' },
                          duration: { kind: 'constant', value: -1 },
                        },
                      }),
                    ),
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                finishByAction: true,
                blackboardAssignments: {
                  'FinalRate': { kind: 'blackboard', key: 'FinalRate' },
                  'spell_vulnerable_rate': { kind: 'blackboard', key: 'spell_vulnerable_rate' },
                  'potential2': { kind: 'blackboard', key: 'potential2' },
                  'BuffStack': { kind: 'blackboard', key: 'BuffStack' },
                  'spell_vulnerable_perstack': { kind: 'blackboard', key: 'spell_vulnerable_perstack' },
                  'move_speed_scalar': { kind: 'blackboard', key: 'move_speed_scalar' },
                },
              }),
            ),
            180,
          ),
        ],
    } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.6, 0.9],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_const',
          operation: 'assign',
          value: [72, 108],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.6, 0.9],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'heal_const',
          operation: 'assign',
          value: [72, 108],
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
          blackboardKey: 'potential',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'radiusadd_display',
          operation: 'assign',
          value: 0.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'radius',
          operation: 'assign',
          value: 6.3,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential2',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential2_onceadd',
          operation: 'assign',
          value: 0.1,
        },
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
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.3,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['finisher', 'ultimate'] }] },
};
