/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, once, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const camilleBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([12.5, 13.8, 15, 16.3, 17.5, 18.8, 20, 21.3, 22.5, 24.1, 25.9, 28.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct24:chr_0033_camille_attack111:actionOrder1:5'),
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
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([12.5, 13.8, 15, 16.3, 17.5, 18.8, 20, 21.3, 22.5, 24.1, 25.9, 28.1]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct24:chr_0033_camille_attack111:actionOrder2:12'),
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
    'atk_scale_1': [0.125, 0.138, 0.15, 0.163, 0.175, 0.188, 0.2, 0.213, 0.225, 0.241, 0.259, 0.281],
    'atk_scale_2': [0.125, 0.138, 0.15, 0.163, 0.175, 0.188, 0.2, 0.213, 0.225, 0.241, 0.259, 0.281],
    'display_atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const camilleBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19.3, 20.8, 22.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0033_camille_attack211:actionOrder1:7'),
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
        14,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([10, 11, 12, 13, 14, 15, 16, 17, 18, 19.3, 20.8, 22.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0033_camille_attack211:actionOrder2:15'),
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
    'atk_scale_1': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.193, 0.208, 0.225],
    'atk_scale_2': [0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.193, 0.208, 0.225],
    'display_atk_scale': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.385, 0.415, 0.45],
  },
);

export const camilleBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 13,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([7.5, 8.3, 9, 9.8, 10.5, 11.3, 12, 12.8, 13.5, 14.4, 15.6, 16.9]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct24:chr_0033_camille_attack311:actionOrder2:22'),
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
        8,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([7.5, 8.3, 9, 9.8, 10.5, 11.3, 12, 12.8, 13.5, 14.4, 15.6, 16.9]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct24:chr_0033_camille_attack311:actionOrder2:22'),
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
        9,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([7.5, 8.3, 9, 9.8, 10.5, 11.3, 12, 12.8, 13.5, 14.4, 15.6, 16.9]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct24:chr_0033_camille_attack311:actionOrder2:22'),
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
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([7.5, 8.3, 9, 9.8, 10.5, 11.3, 12, 12.8, 13.5, 14.4, 15.6, 16.9]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct24:chr_0033_camille_attack311:actionOrder2:22'),
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
    'atk_scale': [0.075, 0.083, 0.09, 0.098, 0.105, 0.113, 0.12, 0.128, 0.135, 0.144, 0.156, 0.169],
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const camilleBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 38.5, 41.5, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0033_camille_attack411:actionOrder1:9'),
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
        20,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:71:7'),
        ),
      ),
      scheduled(
        22,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:12'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:17'),
        ),
      ),
      scheduled(
        26,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:22'),
        ),
      ),
      scheduled(
        28,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:27'),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:32'),
        ),
      ),
      scheduled(
        32,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.9, 4.2, 4.5]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile24:chr_0033_camille_attack432:chr_0033_camille_attack4_projhit11:actionOrder1:72:37'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale_1': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.385, 0.415, 0.45],
    'atk_scale_2': [0.02, 0.022, 0.024, 0.026, 0.028, 0.03, 0.032, 0.034, 0.036, 0.039, 0.042, 0.045],
    'display_atk_scale': [0.34, 0.374, 0.408, 0.442, 0.476, 0.51, 0.544, 0.578, 0.612, 0.655, 0.706, 0.765],
  },
);

export const camilleBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    timelineBlockFrames: 42,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.08 },
            slot: -1855252810,
            priority: 50,
            curve: { kind: 'inline', keys: [{ time: 0, value: 0.2, inTangent: 0.6, outTangent: 0.6, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0.8, inTangent: 0.6, outTangent: 0.6, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
            finishByAction: false,
            targets: ['caster'],
          }),
        ),
        15,
      ),
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([50, 55, 60, 65, 70, 75, 80, 85, 90, 96, 104, 113]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack56:direct24:chr_0033_camille_attack511:actionOrder2:13'),
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
    'atb': 20,
    'atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    'poise': 18,
  },
);

export const camilleFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 39,
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
        3,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack45:chr_0033_camille_power_attack_projhit_witheff11:actionOrder2:251:0'),
        ),
      ),
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:291:0'),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:261:0'),
        ),
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:301:0'),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:271:0'),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:311:0'),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.05,
          }, '8:finisher10:projectile29:chr_0033_camille_power_attack37:chr_0033_camille_power_attack_projhit11:actionOrder2:281:0'),
        ),
      ),
      scheduled(
        40,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.1 },
                slot: 257664179,
                priority: 50,
                curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                finishByAction: false,
                targets: ['enemy', 'caster'],
              }),
            ),
          ),
        ),
      ),
      scheduled(
        43,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.65,
          }, '8:finisher6:direct29:chr_0033_camille_power_attack11:actionOrder2:17'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.3 },
                slot: 257664179,
                priority: 10,
                curve: { kind: 'inline', keys: [{ time: 0, value: 1.5, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1.5, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                finishByAction: false,
                targets: ['enemy'],
              }),
            ),
          ),
        ),
      ),
      scheduled(
        46,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('startTimeDilation', {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 0.25 },
                slot: 257664179,
                priority: 50,
                curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1, inTangent: 2, outTangent: 2, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                finishByAction: false,
                ignoredTargets: [],
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
    'display_atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const camillePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct36:chr_0033_camille_plunging_attack_end11:actionOrder1:3'),
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
    'display_atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const camilleBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 18,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0033_camille_normal_skill',
            definition: { lifetime: { kind: 'limited', durationSeconds: 30 }, childSkill: {
              skillId: 'chr_0033_camille_normal_skill_abilityrange_first',
              scheduledSequences: [
                scheduled(
                  0,
                  sequence(
                    step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                    step('dealDamage', {
                      damageType: 'heat',
                      attackScale: percentages([89, 98, 107, 116, 125, 134, 143, 151, 160, 172, 185, 200]),
                      tags: ['normalSkill'],
                      features: ['canBreakWeakness'],
                      stagger: 10,
                    }, '11:battleSkill13:abilityEntity29:chr_0033_camille_normal_skill37:chr_0033_camille_normal_skill_projhit48:chr_0033_camille_normal_skill_abilityrange_first11:actionOrder2:101:21:6'),
                  ),
                ),
              ],
            } },
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
            saveToContextKey: 'Camille_Bat',
            blackboardAssignments: { 'EntityBB_bat_duration': { kind: 'blackboard', key: 'bat_duration' }, 'EntityBB_bat_atk_scale': { kind: 'blackboard', key: 'bat_atk_scale' }, 'EntityBB_atk_scale': { kind: 'blackboard', key: 'atk_scale' }, 'EntityBB_poise': { kind: 'blackboard', key: 'poise' }, 'EntityBB_weak_scale': { kind: 'blackboard', key: 'weak_scale' }, 'EntityBB_vulnerable_scale': { kind: 'blackboard', key: 'vulnerable_scale' } },
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.43, 1.51, 1.6, 1.72, 1.85, 2],
    'bat_atk_scale': [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    'bat_duration': 45,
    'poise': 10,
    'vulnerable_scale': [0.05, 0.05, 0.05, 0.055, 0.055, 0.055, 0.06, 0.06, 0.06, 0.065, 0.065, 0.07],
    'weak_scale': [0.05, 0.05, 0.05, 0.055, 0.055, 0.055, 0.06, 0.06, 0.06, 0.065, 0.065, 0.07],
  },
);

export const camilleComboSkill1: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill1',
    timelineBlockFrames: 51,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 570, 570, 570, 540],
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
        19,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 35, 37, 40, 43, 45, 48, 51, 55, 60]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '11:comboSkill16:direct28:chr_0033_camille_combo_skill11:actionOrder2:51'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 35, 37, 40, 43, 45, 48, 51, 55, 60]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '11:comboSkill16:direct28:chr_0033_camille_combo_skill11:actionOrder2:60'),
        ),
      ),
      scheduled(
        47,
        sequence(
          once(
            'do-once:timelineActions[27]._sequenceActionData.actionData.[2]',
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:comboSkill111:conditional19:timelineActions[27]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder2:81'),
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [2079142122],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_0' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('heal', {
                    target: 'controlledOperator',
                    attribute: 'intellect',
                    multiplier: { kind: 'blackboard', key: 'heal_sub_multi' },
                    addition: { kind: 'blackboard', key: 'heal_base' },
                    tagIds: [-1517158118],
                  }),
                ),
              ),
            ),
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'usp_gained' },
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
                key: 'usp_gained',
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
    'talent_0': 0,
    'usp_gained': 0,
    'atb': [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    'atk_scale_1_1': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_1_2': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_1_3': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'display_atk_scale': [1.33, 1.47, 1.6, 1.73, 1.86, 2, 2.13, 2.26, 2.4, 2.56, 2.76, 3],
    'poise': 10,
    'usp': 10,
  },
);

export const camilleComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    timelineBlockFrames: 79,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0033_camille_ult_henshin_state'],
            reason: 'early',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.900000036 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        24,
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 35, 37, 40, 43, 45, 48, 51, 55, 60]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '11:comboSkill26:direct30:chr_0033_camille_combo_skill_211:actionOrder2:92'),
        ),
      ),
      scheduled(
        33,
        sequence(
          once(
            'do-once:timelineActions[40]._sequenceActionData.actionData.[1]',
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 35, 37, 40, 43, 45, 48, 51, 55, 60]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:comboSkill26:direct30:chr_0033_camille_combo_skill_211:actionOrder3:103'),
        ),
      ),
      scheduled(
        49,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 35, 37, 40, 43, 45, 48, 51, 55, 60]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '11:comboSkill26:direct30:chr_0033_camille_combo_skill_211:actionOrder3:112'),
        ),
      ),
      scheduled(
        52,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 0,
            priority: 100,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
          }),
        ),
        67,
      ),
      scheduled(
        70,
        sequence(
          once(
            'do-once:timelineActions[42]._sequenceActionData.actionData.[3]',
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_ex' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([142, 157, 171, 185, 199, 214, 228, 242, 256, 274, 295, 320]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:comboSkill211:conditional19:timelineActions[42]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]11:actionOrder3:134'),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_0' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('heal', {
                target: 'controlledOperator',
                attribute: 'intellect',
                multiplier: { kind: 'blackboard', key: 'heal_sub_multi' },
                addition: { kind: 'blackboard', key: 'heal_base' },
                tagIds: [-1517158118],
              }),
            ),
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'usp_gained' },
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
                key: 'usp_gained',
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
    'talent_0': 0,
    'usp_gained': 0,
    'atb': [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    'atb_ex': [16, 16, 16, 16, 16, 16, 18, 18, 18, 20, 20, 20],
    'atk_scale_2_1': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_2_2': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_2_3': [0.27, 0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.45, 0.48, 0.51, 0.55, 0.6],
    'atk_scale_2_4': [1.42, 1.57, 1.71, 1.85, 1.99, 2.14, 2.28, 2.42, 2.56, 2.74, 2.95, 3.2],
    'display_atk_scale_2': [2.22, 2.44, 2.67, 2.89, 3.11, 3.33, 3.56, 3.78, 4, 4.28, 4.61, 5],
    'display_poise_ex': 20,
    'poise': 10,
    'poise_2': 10,
    'usp': 10,
  },
);

export const camilleUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 125,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 130 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 2.77 },
            slot: 0,
            priority: 100,
            curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
            finishByAction: true,
            ignoredTargets: ['caster'],
          }),
        ),
        69,
      ),
      scheduled(
        75,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        77,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        79,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        81,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        83,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        85,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        87,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([17.8, 19.6, 21.3, 23.1, 24.9, 26.7, 28.4, 30.2, 32, 34.2, 36.9, 40]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:36'),
        ),
      ),
      scheduled(
        104,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([53.3, 58.7, 64, 69.3, 74.7, 80, 85.3, 90.7, 96, 102.7, 110.6, 120]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:40'),
        ),
      ),
      scheduled(
        120,
        sequence(
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'enemy',
              buffIds: ['buff_chr_0033_camille_ult_hit'],
              operator: 'lessOrEqual',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step('applyBuff', {
                buffId: 'buff_chr_0033_camille_ult_hit',
                definition: {
                  stackingType: 'unique',
                  priority: 1,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  durationSeconds: 1,
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
          once(
            'do-once:timelineActions[33]._sequenceActionData.actionData.[1]',
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'skill',
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([88.9, 97.8, 106.7, 115.6, 124.5, 133.4, 142.3, 151.2, 160.1, 171.2, 184.5, 200.1]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 15,
          }, '8:ultimate6:direct31:chr_0033_camille_ultimate_skill11:actionOrder2:50'),
        ),
      ),
    ],
  },
  {
    'duration': 15,
    'atb': [32, 32, 32, 32, 32, 32, 32, 32, 36, 36, 36, 40],
    'atk_scale_1': [0.178, 0.196, 0.213, 0.231, 0.249, 0.267, 0.284, 0.302, 0.32, 0.342, 0.369, 0.4],
    'atk_scale_2': [0.533, 0.587, 0.64, 0.693, 0.747, 0.8, 0.853, 0.907, 0.96, 1.027, 1.106, 1.2],
    'atk_scale_3': [0.889, 0.978, 1.067, 1.156, 1.245, 1.334, 1.423, 1.512, 1.601, 1.712, 1.845, 2.001],
    'display_atk_scale': [2.667, 2.933, 3.2, 3.467, 3.733, 4, 4.267, 4.533, 4.8, 5.133, 5.533, 6],
    'poise': 15,
  },
);

export const camilleGeneratedOperator: OperatorDefinition = {
  slug: 'camille',
  gameId: 'CAMILLE',
  rarity: 6,
  weaponType: 'polearm',
  element: 'heat',
  role: 'vanguard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [13, 32, 52, 72, 92, 102],
    agility: [17, 48, 80, 112, 144, 160],
    intellect: [14, 38, 64, 90, 116, 129],
    will: [11, 28, 46, 64, 82, 92],
    baseAttack: [30, 91, 155, 219, 283, 315],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [camilleBasicAttack1, camilleBasicAttack2, camilleBasicAttack3, camilleBasicAttack4, camilleBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: camilleFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: camillePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: camilleBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: [camilleComboSkill1, camilleComboSkill2] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: camilleUltimate },
  ],
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill1',
          blackboardKey: 'talent_0',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill1',
          blackboardKey: 'combo_duration',
          operation: 'assign',
          value: [15, 15],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill1',
          blackboardKey: 'heal_base',
          operation: 'assign',
          value: [30, 60],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill1',
          blackboardKey: 'heal_sub_multi',
          operation: 'assign',
          value: [0.15, 0.3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill2',
          blackboardKey: 'talent_0',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill2',
          blackboardKey: 'combo_duration',
          operation: 'assign',
          value: [15, 15],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill2',
          blackboardKey: 'heal_base',
          operation: 'assign',
          value: [30, 60],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill2',
          blackboardKey: 'heal_sub_multi',
          operation: 'assign',
          value: [0.15, 0.3],
        },
      ],
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
      modifiers: [],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['agility', 'intellect'],
          value: 20,
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
      modifiers: [],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['battleSkill', 'ultimate'] }] },
};
