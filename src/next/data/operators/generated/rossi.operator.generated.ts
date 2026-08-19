/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const rossiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 9,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([27, 30, 32, 35, 38, 41, 43, 46, 49, 52, 56, 61]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0028_wulfa_attack111:actionOrder1:6'),
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
    'atk_scale': [0.27, 0.3, 0.32, 0.35, 0.38, 0.41, 0.43, 0.46, 0.49, 0.52, 0.56, 0.61],
  },
);

export const rossiBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0028_wulfa_attack211:actionOrder2:10'),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0028_wulfa_attack211:actionOrder2:18'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.5, 0.54, 0.57, 0.61, 0.65, 0.71],
  },
);

export const rossiBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct22:chr_0028_wulfa_attack311:actionOrder1:8'),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct22:chr_0028_wulfa_attack311:actionOrder2:15'),
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
    'atk_scale': [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
  },
);

export const rossiBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 36,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.2 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:33'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
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
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:39'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
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
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:45'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:51'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:57'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        195,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:66'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        198,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:72'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        203,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:78'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        205,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:84'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
                recipient: 'team',
                spGainKind: 'gain',
                spGainSource: 'normalAttack',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        213,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct22:chr_0028_wulfa_attack411:actionOrder2:90'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
                coefficient: 0.25,
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
    'atk_scale': [0.41, 0.45, 0.49, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.78, 0.84, 0.91],
  },
);

export const rossiBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    timelineBlockFrames: 31,
    scheduledSequences: [
      scheduled(
        15,
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
          ),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([50, 55, 60, 65, 70, 75, 80, 85, 90, 96, 104, 113]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack56:direct22:chr_0028_wulfa_attack511:actionOrder2:10'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'isHitbyMain',
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
    'isHitbyMain': 0,
    'atb': 21,
    'atk_scale': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    'poise': 18,
  },
);

export const rossiFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 66,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_powerattack_resumecombo',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'End_Early': 0,
                'duration': 10,
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
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct27:chr_0028_wulfa_power_attack11:actionOrder2:19'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResource', { resource: 'sp', amount: 0, recipient: 'team', spGainKind: 'gain', spGainSource: 'default' }),
            ),
          ),
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
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct27:chr_0028_wulfa_power_attack11:actionOrder2:30'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('changeResource', { resource: 'sp', amount: 0, recipient: 'team', spGainKind: 'gain', spGainSource: 'default' }),
            ),
          ),
        ),
      ),
      scheduled(
        36,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
          }, '8:finisher6:direct27:chr_0028_wulfa_power_attack11:actionOrder2:41'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const rossiPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0028_wulfa_plunging_attack_end11:actionOrder1:3'),
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

export const rossiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 38,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'skillimbue',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.3 },
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct27:chr_0028_wulfa_normal_skill11:actionOrder2:97'),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        22,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.3 },
          }),
        ),
      ),
      scheduled(
        22,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct27:chr_0028_wulfa_normal_skill11:actionOrder3:112'),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        35,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'constant', value: 0.4 },
          }),
          step('modifyActionValue', {
            key: 'trigger',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        35,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [1075718177],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'FollowAttackTrigger',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 5,
              }, '11:battleSkill11:conditional19:timelineActions[28]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder3:130'),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 5,
              }, '11:battleSkill11:conditional19:timelineActions[28]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder3:139'),
              step('modifyActionValue', {
                key: 'trigger',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_normalskill_failure',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'atk_scale': 0.3,
                    'damage_interval': 1,
                    'duration': 1,
                    'poise': 0,
                    'posie': 0,
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        215,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
            reason: 'early',
          }),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_smarttarget',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'atk_scale': 0.3,
                'damage_cd': 1.5,
                'damage_interval': 1,
                'duration': 2,
                'extra_atk_scale': 1.5,
                'poise': 0,
                'posie': 0,
                'talent_2': 0,
              },
            },
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_wolf_timer',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'duration': 3,
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
          }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_2' },
            recipient: 'caster',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_upgrade' },
              operator: 'equal',
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
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
          }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:16'),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_2' },
            recipient: 'caster',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_upgrade' },
              operator: 'equal',
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
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
          }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_2' },
            recipient: 'caster',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_upgrade' },
              operator: 'equal',
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
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
          }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
        ),
      ),
      scheduled(
        230,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_2' },
            recipient: 'caster',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_upgrade' },
              operator: 'equal',
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
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                reason: 'early',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'FollowAttackTrigger': 0,
    'skillimbue': 0,
    'trigger': 0,
    'atk_scale_1': [0.85, 0.94, 1.02, 1.11, 1.19, 1.28, 1.37, 1.45, 1.54, 1.64, 1.77, 1.92],
    'atk_scale_3': [1.28, 1.41, 1.53, 1.66, 1.79, 1.92, 2.04, 2.17, 2.3, 2.46, 2.65, 2.88],
    'atk_scale_bleed': [0.36, 0.4, 0.43, 0.47, 0.5, 0.54, 0.58, 0.61, 0.65, 0.69, 0.75, 0.81],
    'display_atk_scale_1': [0.85, 0.94, 1.02, 1.11, 1.19, 1.28, 1.37, 1.45, 1.54, 1.64, 1.77, 1.92],
    'duration_bleed': 15,
    'poise_1': 5,
    'poise_2': [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
    'usp_1': 15,
    'usp_2': 10,
  },
);

export const rossiComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    timelineBlockFrames: 37,
    cooldownFrames: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 420],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'timing_success',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            definition: {
              stackingType: 'enhanceAndOverwriteDuration',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: 10,
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_combo_usetimer'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_cannottrigger',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'duration': 10,
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
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        13,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.35 },
          }),
          step('calculateActionValue', {
            key: 'poise_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'poise' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'blackboard', key: 'poise_once' },
          }, '11:comboSkill26:direct28:chr_0028_wulfa_combo_2_skill11:actionOrder2:29'),
          step('calculateActionValue', {
            key: 'count',
            operation: 'add',
            left: { kind: 'blackboard', key: 'count' },
            right: { kind: 'constant', value: 1 },
          }),
          step('calculateActionValue', {
            key: 'can_trigger_combo',
            operation: 'add',
            left: { kind: 'blackboard', key: 'can_trigger_combo' },
            right: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        22,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('calculateActionValue', {
                key: 'cam_shoulderoffset_X',
                operation: 'multiply',
                left: { kind: 'blackboard', key: 'cam_shoulderoffset_X' },
                right: { kind: 'constant', value: 165 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.35 },
          }),
          step('calculateActionValue', {
            key: 'poise_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'poise' },
            right: { kind: 'constant', value: 0.5 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'blackboard', key: 'poise_once' },
          }, '11:comboSkill26:direct28:chr_0028_wulfa_combo_2_skill11:actionOrder2:44'),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.1 },
          }),
          step('calculateActionValue', {
            key: 'count',
            operation: 'add',
            left: { kind: 'blackboard', key: 'count' },
            right: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
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
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'can_trigger_combo' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                operation: 'set',
                basis: 'absoluteSeconds',
                value: { kind: 'constant', value: 0 },
              }),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
                reason: 'other',
              }),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'can_trigger_combo': 0,
    'count': 0,
    'atk_scale_once': 0,
    'atk_scale': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    'display_atk_scale_2_f': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    'display_atk_scale_2_s': [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    'display_crit_increase_duration': 15,
    'display_crit_increase_rate': 0.25,
    'display_poise_2_f': 5,
    'display_poise_2_s': 10,
    'display_usp_2_f': 0,
    'display_usp_2_s': 10,
    'poise': 0,
    'usp': 10,
  },
);

export const rossiComboSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill3',
    timelineBlockFrames: 52,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
            definition: {
              stackingType: 'enhanceAndOverwriteDuration',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: 10,
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
            operation: 'set',
            basis: 'baseDurationRatio',
            value: { kind: 'constant', value: 1 },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0028_wulfa_combo_usetimer', 'buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_Combo_QTE_Trigger' },
              operator: 'greater',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timer', 'buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
                reason: 'early',
              }),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('startTimeDilation', {
                scope: 'global',
                durationSeconds: { kind: 'constant', value: 0.4 },
                slot: 0,
                priority: 50,
                curve: { kind: 'inline', keys: [{ time: 0, value: 0.01, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 0.1, value: 0.01, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 0.8, value: 0.01, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 0.01, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                finishByAction: false,
                ignoredTargets: ['caster'],
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  step('calculateActionValue', {
                    key: 'atk_scale_s',
                    operation: 'multiply',
                    left: { kind: 'blackboard', key: 'atk_scale_s' },
                    right: { kind: 'blackboard', key: 'potential_atk_multiply' },
                  }),
                ),
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timer', 'buff_chr_0028_wulfa_combo_2_qte_timerlistening'],
                reason: 'early',
              }),
              step('modifyActionValue', {
                key: 'timing_success',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'critical_damage_inc': 0.15,
                'critical_rate': 0.1,
                'duration': 10,
                'usp_stage_1': 0.35,
                'usp_stage_2': 0.7,
                'usp_stage_3': 1,
              },
              attributeModifiers: [
                {
                  attribute: 'CriticalRate',
                  slot: 'baseAddition',
                  value: { blackboardKey: 'critical_rate' },
                },
                {
                  attribute: 'CriticalDamageIncrease',
                  slot: 'baseAddition',
                  value: { blackboardKey: 'critical_damage_inc' },
                },
              ],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'crit_increase_duration' },
              'critical_rate': { kind: 'blackboard', key: 'crit_increase_rate' },
              'critical_damage_inc': { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_cannottrigger',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'duration': 10,
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
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        16,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [-1558844517],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'buff_stack',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1558844517] },
              }),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTagIds: [-1558844517],
                reason: 'early',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                definition: {
                  stackingType: 'stack',
                  priority: 0,
                  maxStackCount: 4,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'duration': 10,
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                count: { kind: 'blackboard', key: 'buff_stack' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'duration': 10,
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              step('modifyActionValue', {
                key: 'can_trigger_combo',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [-1411846745],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1411846745] },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTagIds: [-1411846745],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                    definition: {
                      stackingType: 'stack',
                      priority: 0,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 10,
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    count: { kind: 'blackboard', key: 'buff_stack' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    definition: {
                      stackingType: 'refresh',
                      priority: 0,
                      maxStackCount: 3,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 10,
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
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
                        outputKey: 'buff_stack',
                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTagIds: [2123008650],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                        definition: {
                          stackingType: 'stack',
                          priority: 0,
                          maxStackCount: 4,
                          durationSeconds: { blackboardKey: 'duration' },
                          blackboard: {
                            'duration': 10,
                          },
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        count: { kind: 'blackboard', key: 'buff_stack' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        definition: {
                          stackingType: 'refresh',
                          priority: 0,
                          maxStackCount: 3,
                          durationSeconds: { blackboardKey: 'duration' },
                          blackboard: {
                            'duration': 10,
                          },
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
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
                            outputKey: 'buff_stack',
                            query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1570888476] },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTagIds: [1570888476],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                            definition: {
                              stackingType: 'stack',
                              priority: 0,
                              maxStackCount: 4,
                              durationSeconds: { blackboardKey: 'duration' },
                              blackboard: {
                                'duration': 10,
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            count: { kind: 'blackboard', key: 'buff_stack' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            definition: {
                              stackingType: 'refresh',
                              priority: 0,
                              maxStackCount: 3,
                              durationSeconds: { blackboardKey: 'duration' },
                              blackboard: {
                                'duration': 10,
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 0 },
                          }),
                          step('modifyActionValue', {
                            key: 'buff_stack',
                            operation: 'assign',
                            value: { kind: 'constant', value: 0 },
                          }),
                          step('modifyActionValue', {
                            key: 'spellinflict_stack_max',
                            operation: 'assign',
                            value: { kind: 'constant', value: 0 },
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_physical_no_guard',
                definition: {
                  stackingType: 'enhanceAndRefresh',
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
                            definition: {
                              stackingType: 'stack',
                              priority: 0,
                              maxStackCount: 1,
                              durationSeconds: 10,
                              triggerIntervalSeconds: 0,
                              waitFirstTriggerInterval: true,
                              maxTriggerCount: 1,
                              blackboard: {
                                'atk_scale': 0,
                                'count': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('readBuffBlackboard', {
                                    target: 'enemy',
                                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1535684437] },
                                    desiredKey: 'count',
                                    outputKey: 'count',
                                  }),
                                  step('finishBuffsByTag', {
                                    target: 'enemy',
                                    tagQueryType: 'hasAny',
                                    buffTagIds: [1535684437],
                                    reason: 'early',
                                  }),
                                  step('applyBuff', {
                                    buffId: 'buff_common_cryst_triggered_physical_break',
                                    definition: {
                                      stackingType: 'unlimited',
                                      priority: 0,
                                      maxStackCount: 0,
                                      durationSeconds: 5,
                                      applyTagIds: [-615023885],
                                      blackboard: {
                                        'atk_scale': 0,
                                      },
                                      lifecycleSequences: {
                                        start: sequence(
                                          step('dealDamage', {
                                            damageType: 'physical',
                                            attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                            tags: [],
                                            features: ['shatter'],
                                          }, '50:buff_common_cryst_triggered_physical_break:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
                                        ),
                                      },
                                    },
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                    },
                                  }),
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'count' },
                                      operator: 'equal',
                                      right: { kind: 'constant', value: 0 },
                                    },
                                    sequence(
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: { kind: 'constant', value: 0.1 },
                                        slot: 1464849466,
                                        priority: 15,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['caster', 'caster'],
                                      }),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 1 },
                                        },
                                        sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 1464849466,
                                            priority: 10,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['caster', 'caster'],
                                          }),
                                        ),
                                        sequence(
                                          branch(
                                            {
                                              kind: 'actionValueCompare',
                                              left: { kind: 'blackboard', key: 'count' },
                                              operator: 'equal',
                                              right: { kind: 'constant', value: 2 },
                                            },
                                            sequence(
                                              step('startTimeDilation', {
                                                scope: 'entity',
                                                durationSeconds: { kind: 'constant', value: 0.25 },
                                                slot: 1464849466,
                                                priority: 20,
                                                curve: { kind: 'named', key: 'interrupt_weakness' },
                                                finishByAction: false,
                                                targets: ['caster', 'caster'],
                                              }),
                                            ),
                                            sequence(
                                              branch(
                                                {
                                                  kind: 'actionValueCompare',
                                                  left: { kind: 'blackboard', key: 'count' },
                                                  operator: 'equal',
                                                  right: { kind: 'constant', value: 3 },
                                                },
                                                sequence(
                                                  step('startTimeDilation', {
                                                    scope: 'entity',
                                                    durationSeconds: { kind: 'constant', value: 0.5 },
                                                    slot: 1464849466,
                                                    priority: 20,
                                                    curve: { kind: 'named', key: 'interrupt_weakness' },
                                                    finishByAction: false,
                                                    targets: ['caster', 'caster'],
                                                  }),
                                                ),
                                                sequence(
                                                  branch(
                                                    {
                                                      kind: 'actionValueCompare',
                                                      left: { kind: 'blackboard', key: 'count' },
                                                      operator: 'equal',
                                                      right: { kind: 'constant', value: 4 },
                                                    },
                                                    sequence(
                                                      step('startTimeDilation', {
                                                        scope: 'entity',
                                                        durationSeconds: { kind: 'constant', value: 0.65 },
                                                        slot: 1464849466,
                                                        priority: 20,
                                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                                        finishByAction: false,
                                                        targets: ['caster', 'caster'],
                                                      }),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                      ),
                    ),
                    finish: sequence(
                      step('applyBuff', {
                        buffId: 'buff_physical_no_guard_fake',
                        definition: {
                          stackingType: 'refresh',
                          priority: 100,
                          maxStackCount: 1,
                          durationSeconds: { blackboardKey: 'duration' },
                          applyTagIds: [-508362979],
                          blackboard: {
                            'duration': 1,
                          },
                        },
                        target: 'enemy',
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
                            definition: {
                              stackingType: 'stack',
                              priority: 0,
                              maxStackCount: 1,
                              durationSeconds: 10,
                              triggerIntervalSeconds: 0,
                              waitFirstTriggerInterval: true,
                              maxTriggerCount: 1,
                              blackboard: {
                                'atk_scale': 0,
                                'count': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('readBuffBlackboard', {
                                    target: 'enemy',
                                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1535684437] },
                                    desiredKey: 'count',
                                    outputKey: 'count',
                                  }),
                                  step('finishBuffsByTag', {
                                    target: 'enemy',
                                    tagQueryType: 'hasAny',
                                    buffTagIds: [1535684437],
                                    reason: 'early',
                                  }),
                                  step('applyBuff', {
                                    buffId: 'buff_common_cryst_triggered_physical_break',
                                    definition: {
                                      stackingType: 'unlimited',
                                      priority: 0,
                                      maxStackCount: 0,
                                      durationSeconds: 5,
                                      applyTagIds: [-615023885],
                                      blackboard: {
                                        'atk_scale': 0,
                                      },
                                      lifecycleSequences: {
                                        start: sequence(
                                          step('dealDamage', {
                                            damageType: 'physical',
                                            attackScale: { kind: 'blackboard', key: 'atk_scale' },
                                            tags: [],
                                            features: ['shatter'],
                                          }, '50:buff_common_cryst_triggered_physical_break:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
                                        ),
                                      },
                                    },
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                    },
                                  }),
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'count' },
                                      operator: 'equal',
                                      right: { kind: 'constant', value: 0 },
                                    },
                                    sequence(
                                      step('startTimeDilation', {
                                        scope: 'entity',
                                        durationSeconds: { kind: 'constant', value: 0.1 },
                                        slot: 1464849466,
                                        priority: 15,
                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                        finishByAction: false,
                                        targets: ['caster', 'caster'],
                                      }),
                                    ),
                                    sequence(
                                      branch(
                                        {
                                          kind: 'actionValueCompare',
                                          left: { kind: 'blackboard', key: 'count' },
                                          operator: 'equal',
                                          right: { kind: 'constant', value: 1 },
                                        },
                                        sequence(
                                          step('startTimeDilation', {
                                            scope: 'entity',
                                            durationSeconds: { kind: 'constant', value: 0.1 },
                                            slot: 1464849466,
                                            priority: 10,
                                            curve: { kind: 'named', key: 'interrupt_weakness' },
                                            finishByAction: false,
                                            targets: ['caster', 'caster'],
                                          }),
                                        ),
                                        sequence(
                                          branch(
                                            {
                                              kind: 'actionValueCompare',
                                              left: { kind: 'blackboard', key: 'count' },
                                              operator: 'equal',
                                              right: { kind: 'constant', value: 2 },
                                            },
                                            sequence(
                                              step('startTimeDilation', {
                                                scope: 'entity',
                                                durationSeconds: { kind: 'constant', value: 0.25 },
                                                slot: 1464849466,
                                                priority: 20,
                                                curve: { kind: 'named', key: 'interrupt_weakness' },
                                                finishByAction: false,
                                                targets: ['caster', 'caster'],
                                              }),
                                            ),
                                            sequence(
                                              branch(
                                                {
                                                  kind: 'actionValueCompare',
                                                  left: { kind: 'blackboard', key: 'count' },
                                                  operator: 'equal',
                                                  right: { kind: 'constant', value: 3 },
                                                },
                                                sequence(
                                                  step('startTimeDilation', {
                                                    scope: 'entity',
                                                    durationSeconds: { kind: 'constant', value: 0.5 },
                                                    slot: 1464849466,
                                                    priority: 20,
                                                    curve: { kind: 'named', key: 'interrupt_weakness' },
                                                    finishByAction: false,
                                                    targets: ['caster', 'caster'],
                                                  }),
                                                ),
                                                sequence(
                                                  branch(
                                                    {
                                                      kind: 'actionValueCompare',
                                                      left: { kind: 'blackboard', key: 'count' },
                                                      operator: 'equal',
                                                      right: { kind: 'constant', value: 4 },
                                                    },
                                                    sequence(
                                                      step('startTimeDilation', {
                                                        scope: 'entity',
                                                        durationSeconds: { kind: 'constant', value: 0.65 },
                                                        slot: 1464849466,
                                                        priority: 20,
                                                        curve: { kind: 'named', key: 'interrupt_weakness' },
                                                        finishByAction: false,
                                                        targets: ['caster', 'caster'],
                                                      }),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                        ),
                      ),
                    ),
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                reason: 'other',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        29,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
            right: { kind: 'blackboard', key: 'damage_add' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'add',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'blackboard', key: 'atk_scale_s' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'blackboard', key: 'potential_atk_multiply' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'constant', value: 1 },
          }),
          step('calculateActionValue', {
            key: 'poise_once',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'poise_s' },
            right: { kind: 'constant', value: 1 },
          }),
          step('finishBuffsById', {
            target: 'enemy',
            buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
            reason: 'other',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'blackboard', key: 'poise_once' },
          }, '11:comboSkill36:direct28:chr_0028_wulfa_combo_3_skill11:actionOrder3:234'),
          step('calculateActionValue', {
            key: 'count',
            operation: 'add',
            left: { kind: 'blackboard', key: 'count' },
            right: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'timing_success' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
              ],
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_s' },
                recipient: 'caster',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_success',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'atk_scale': 0.3,
                    'damage_interval': 1,
                    'duration': 1,
                    'poise': 0,
                    'posie': 0,
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'atk_scale': 0.3,
                    'damage_interval': 1,
                    'duration': 1,
                    'poise': 0,
                    'posie': 0,
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'atk_scale': 0.3,
                    'damage_interval': 1,
                    'duration': 1,
                    'poise': 0,
                    'posie': 0,
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'atk_scale': 0.3,
                'damage_interval': 1,
                'duration': 1,
                'poise': 0,
                'posie': 0,
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'critical_damage_inc': 0.15,
                'critical_rate': 0.1,
                'duration': 10,
                'usp_stage_1': 0.35,
                'usp_stage_2': 0.7,
                'usp_stage_3': 1,
              },
              attributeModifiers: [
                {
                  attribute: 'CriticalRate',
                  slot: 'baseAddition',
                  value: { blackboardKey: 'critical_rate' },
                },
                {
                  attribute: 'CriticalDamageIncrease',
                  slot: 'baseAddition',
                  value: { blackboardKey: 'critical_damage_inc' },
                },
              ],
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'crit_increase_duration' },
              'critical_rate': { kind: 'blackboard', key: 'crit_increase_rate' },
              'critical_damage_inc': { kind: 'blackboard', key: 'crit_damage_increase_rate' },
            },
          }),
        ),
      ),
      scheduled(
        212,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        222,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [-1558844517],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'buff_stack',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1558844517] },
              }),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTagIds: [-1558844517],
                reason: 'early',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                definition: {
                  stackingType: 'stack',
                  priority: 0,
                  maxStackCount: 4,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'duration': 10,
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                count: { kind: 'blackboard', key: 'buff_stack' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'duration': 10,
                  },
                },
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
              }),
              step('modifyActionValue', {
                key: 'can_trigger_combo',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'buffStackCompare',
                  target: 'enemy',
                  tagQueryType: 'hasAny',
                  buffTagIds: [-1411846745],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-1411846745] },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTagIds: [-1411846745],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                    definition: {
                      stackingType: 'stack',
                      priority: 0,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 10,
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    count: { kind: 'blackboard', key: 'buff_stack' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                    definition: {
                      stackingType: 'refresh',
                      priority: 0,
                      maxStackCount: 3,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 10,
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('modifyActionValue', {
                    key: 'can_trigger_combo',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
                ),
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
                        outputKey: 'buff_stack',
                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [2123008650] },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTagIds: [2123008650],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                        definition: {
                          stackingType: 'stack',
                          priority: 0,
                          maxStackCount: 4,
                          durationSeconds: { blackboardKey: 'duration' },
                          blackboard: {
                            'duration': 10,
                          },
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        count: { kind: 'blackboard', key: 'buff_stack' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                        definition: {
                          stackingType: 'refresh',
                          priority: 0,
                          maxStackCount: 3,
                          durationSeconds: { blackboardKey: 'duration' },
                          blackboard: {
                            'duration': 10,
                          },
                        },
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                      step('modifyActionValue', {
                        key: 'can_trigger_combo',
                        operation: 'add',
                        value: { kind: 'constant', value: 1 },
                      }),
                    ),
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
                            outputKey: 'buff_stack',
                            query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1570888476] },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTagIds: [1570888476],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                            definition: {
                              stackingType: 'stack',
                              priority: 0,
                              maxStackCount: 4,
                              durationSeconds: { blackboardKey: 'duration' },
                              blackboard: {
                                'duration': 10,
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            count: { kind: 'blackboard', key: 'buff_stack' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
                            definition: {
                              stackingType: 'refresh',
                              priority: 0,
                              maxStackCount: 3,
                              durationSeconds: { blackboardKey: 'duration' },
                              blackboard: {
                                'duration': 10,
                              },
                            },
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                          }),
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 1 },
                          }),
                        ),
                        sequence(
                          step('modifyActionValue', {
                            key: 'can_trigger_combo',
                            operation: 'add',
                            value: { kind: 'constant', value: 0 },
                          }),
                          step('modifyActionValue', {
                            key: 'spellinflict_stack_max',
                            operation: 'assign',
                            value: { kind: 'constant', value: 0 },
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('finishBuffsById', {
                target: 'enemy',
                buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                reason: 'other',
              }),
            ),
          ),
        ),
      ),
      scheduled(
        227,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'spellinflict_stack_max' },
            right: { kind: 'blackboard', key: 'damage_add' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'add',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'blackboard', key: 'atk_scale_s' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'blackboard', key: 'potential_atk_multiply' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_once',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'atk_scale_once' },
            right: { kind: 'constant', value: 1 },
          }),
          step('calculateActionValue', {
            key: 'poise_once',
            operation: 'divide',
            left: { kind: 'blackboard', key: 'poise_f' },
            right: { kind: 'constant', value: 1 },
          }),
          step('finishBuffsById', {
            target: 'enemy',
            buffIds: ['buff_chr_0028_wulfa_combo_inflictnum'],
            reason: 'other',
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: { kind: 'blackboard', key: 'poise_once' },
          }, '11:comboSkill36:direct28:chr_0028_wulfa_combo_3_skill11:actionOrder3:119'),
          step('calculateActionValue', {
            key: 'count',
            operation: 'add',
            left: { kind: 'blackboard', key: 'count' },
            right: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        227,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp_s' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'timing_success' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                definition: {
                  stackingType: 'refresh',
                  priority: 0,
                  maxStackCount: 3,
                  durationSeconds: { blackboardKey: 'duration' },
                  blackboard: {
                    'atk_scale': 0.3,
                    'damage_interval': 1,
                    'duration': 1,
                    'poise': 0,
                    'posie': 0,
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            definition: {
              stackingType: 'refresh',
              priority: 0,
              maxStackCount: 3,
              durationSeconds: { blackboardKey: 'duration' },
              blackboard: {
                'atk_scale': 0.3,
                'damage_interval': 1,
                'duration': 1,
                'poise': 0,
                'posie': 0,
              },
            },
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
    ],
  },
  {
    'buff_stack': 0,
    'can_trigger_combo': 0,
    'count': 0,
    'potential_1': 0,
    'spellinflict_stack_max': 0,
    'timing_success': 0,
    'crit_increase_duration': 15,
    'crit_increase_rate': [0.15, 0.15, 0.15, 0.17, 0.17, 0.17, 0.19, 0.19, 0.21, 0.21, 0.23, 0.25],
    'crit_damage_increase_rate': [0.3, 0.3, 0.3, 0.34, 0.34, 0.34, 0.38, 0.38, 0.42, 0.42, 0.46, 0.5],
    'atk_scale_f': [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    'atk_scale_s': [1.33, 1.47, 1.6, 1.73, 1.87, 2, 2.13, 2.27, 2.4, 2.57, 2.77, 3],
    'damage_add': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
    'poise_f': 5,
    'poise_s': 5,
    'usp_f': 10,
    'usp_s': 10,
  },
);

export const rossiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 156,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 110 }],
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
        57,
      ),
      scheduled(
        57,
        sequence(
          step('dealFixedDamage', {
            damageType: 'physical',
            value: 0.01,
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0028_wulfa_ultimate_skill11:actionOrder2:46'),
        ),
      ),
      scheduled(
        58,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale_1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_1' },
            right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_2' },
            right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
          }),
          step('calculateActionValue', {
            key: 'atk_scale_3',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale_3' },
            right: { kind: 'blackboard', key: 'potential_5_damage_scale' },
          }),
          step('calculateActionValue', {
            key: 'crit_damage_up_to_bleed',
            operation: 'add',
            left: { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
            right: { kind: 'blackboard', key: 'potential_5_critical_damage' },
          }),
        ),
      ),
      scheduled(
        63,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[40]19:_sequenceActionData10:actionData3:[0]13:actionOnEvent10:actionData3:[4]14:succeedActions10:actionData3:[0]11:actionOrder3:152'),
        ),
      ),
      scheduled(
        63,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[42]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:176'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        64,
        sequence(
          step('dealFixedDamage', {
            damageType: 'physical',
            value: 0.01,
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0028_wulfa_ultimate_skill11:actionOrder2:57'),
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [-1706530655, 1717826765],
            },
            sequence(),
            sequence(
              branch(
                { kind: 'enemyRankIn', ranks: ['mob'] },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_ult_stopenemy',
                    definition: {
                      stackingType: 'refresh',
                      priority: 0,
                      maxStackCount: 4,
                      durationSeconds: { blackboardKey: 'duration' },
                      applyTagIds: [430405417],
                      blackboard: {
                        'duration': 1.5,
                        'usp_stage_1': 0.35,
                        'usp_stage_2': 0.7,
                        'usp_stage_3': 1,
                      },
                    },
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'constant', value: 2.866664 },
                    },
                  }),
                ),
              ),
            ),
          ),
        ),
      ),
      scheduled(
        65,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[43]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:229'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        66,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[44]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:282'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        69,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[45]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:335'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        71,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[46]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:388'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        74,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[47]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:441'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        75,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[48]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:494'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        77,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[49]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:547'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        78,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[50]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:600'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        80,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[51]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:653'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        83,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[52]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:706'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        84,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[53]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:759'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        87,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[54]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:812'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        88,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[55]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:865'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        90,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[56]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:918'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        92,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[57]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder3:971'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        94,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[58]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1024'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        96,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[59]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1077'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        97,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[60]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1130'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        99,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[61]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1183'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        102,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[62]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1236'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        103,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[63]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1289'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        106,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[64]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1342'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        108,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[65]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1395'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        111,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate11:conditional19:timelineActions[66]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[3]14:succeedActions10:actionData3:[0]11:actionOrder4:1448'),
          step('modifyActionValue', {
            key: 'hit_times',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        122,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        122,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct29:chr_0028_wulfa_ultimate_skill11:actionOrder2:75'),
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        131,
        sequence(
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        131,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 25,
          }, '8:ultimate11:conditional19:timelineActions[22]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:84'),
          step('modifyActionValue', {
            key: 'hit_num',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
    ],
  },
  {
    'camera_blocked': 0,
    'hit_num': 0,
    'hit_times': 0,
    'random_hurtanimation': 0,
    'crit_damage_up_to_bleed': 0.6,
    'atk_scale_1': [0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.24],
    'atk_scale_2': [1.11, 1.22, 1.33, 1.44, 1.56, 1.67, 1.78, 1.89, 2, 2.14, 2.31, 2.5],
    'atk_scale_3': [3.33, 3.67, 4, 4.33, 4.67, 5, 5.34, 5.67, 6, 6.42, 6.92, 7.5],
    'atk_scale_crit_fire': [0.14, 0.15, 0.16, 0.18, 0.19, 0.2, 0.22, 0.23, 0.24, 0.26, 0.28, 0.3],
    'display_atk_scale_1_max': [2.75, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5.25, 5.5, 6],
    'display_atk_scale_1_min': [1.28, 1.41, 1.54, 1.66, 1.79, 1.92, 2.05, 2.18, 2.3, 2.46, 2.66, 2.88],
    'poise': 25,
  },
);

export const rossiGeneratedOperator: OperatorDefinition = {
  slug: 'rossi',
  gameId: 'ROSSI',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'intellect',
  attributes: {
    strength: [9, 28, 48, 68, 88, 97],
    agility: [23, 55, 90, 124, 159, 176],
    intellect: [14, 36, 59, 83, 106, 118],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 93, 159, 225, 291, 323],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [rossiBasicAttack1, rossiBasicAttack2, rossiBasicAttack3, rossiBasicAttack4, rossiBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: rossiFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: rossiPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: rossiBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: [rossiComboSkill2, rossiComboSkill3] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: rossiUltimate },
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
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_upgrade',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_1',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_3',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill3',
          blackboardKey: 'atk_scale_s',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill3',
          blackboardKey: 'atk_scale_f',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill3',
          blackboardKey: 'damage_add',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atb_return',
          operation: 'assign',
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
          attributes: ['agility'],
          value: 20,
        },
        { kind: 'modifyBasePanelStat', stat: 'criticalRate', operation: 'flat', value: 0.07 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'add',
          value: 0.08,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'add',
          value: -0.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'add',
          value: 0.04,
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
          blackboardKey: 'potential_5_damage_scale',
          operation: 'assign',
          value: 1.1,
        },
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
          blackboardKey: 'potential_5_critical_damage',
          operation: 'assign',
          value: 0.3,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['battleSkill', 'comboSkill2', 'comboSkill3', 'ultimate'] }] },
};
