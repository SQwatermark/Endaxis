/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withActionBlackboardScope, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const rossiBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0028_wulfa_attack1',
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
            undefined,
            { alwaysNext: true },
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
    sourceSkillId: 'chr_0028_wulfa_attack2',
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
    sourceSkillId: 'chr_0028_wulfa_attack3',
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
            undefined,
            { alwaysNext: true },
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
    sourceSkillId: 'chr_0028_wulfa_attack4',
    timelineBlockFrames: 36,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              step('jumpTimeline', { destinationFrame: 189 }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        188,
        sequence(
          step('finishTimeline', {}),
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
    sourceSkillId: 'chr_0028_wulfa_attack5',
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
            undefined,
            { alwaysNext: true },
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
    sourceSkillId: 'chr_0028_wulfa_power_attack',
    timelineBlockFrames: 66,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_powerattack_resumecombo',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        65,
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
        65,
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
            undefined,
            { alwaysNext: true },
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
    sourceSkillId: 'chr_0028_wulfa_plunging_attack_end',
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

export const rossiBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0028_wulfa_normal_skill',
    timelineBlockFrames: 38,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('modifyActionValue', {
                key: 'skillimbue',
                operation: 'assign',
                value: { kind: 'constant', value: 0 },
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
            undefined,
            { alwaysNext: true },
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
            undefined,
            { alwaysNext: true },
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
            { kind: 'targetStaggered', target: 'enemy' },
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 215,
            condition: {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'FollowAttackTrigger' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.9 },
            },
          }),
        ),
        40,
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
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        214,
        sequence(
          step('finishTimeline', {}),
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
        215,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        272,
      ),
      scheduled(
        230,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_smarttarget',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_wolf_timer',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit2:149',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                      operator: 'greater',
                      value: { kind: 'constant', value: 0.5 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 1 },
                    },
                  ],
                },
                sequence(
                  branch(
                    { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'talent_1_1' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_2_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: false,
                                blackboardAssignments: {
                                  'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                  'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                  'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                  'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                  'talent_2': { kind: 'constant', value: 1 },
                                  'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                  'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                  'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                },
                              }),
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:21'),
                                ),
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 0 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:25'),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_2' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:33'),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 1 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:39'),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 0 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:43'),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:46'),
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
                sequence(
                  step('dealDamage', {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]11:failActions10:actionData3:[0]11:actionOrder2:88'),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit2:149',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_2' },
                recipient: 'caster',
              }),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit2:149',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
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
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit3:150',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_normalskill_success',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit3:150',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                      operator: 'greater',
                      value: { kind: 'constant', value: 0.5 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 1 },
                    },
                  ],
                },
                sequence(
                  branch(
                    { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'talent_1_1' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_2_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: false,
                                blackboardAssignments: {
                                  'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                  'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                  'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                  'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                  'talent_2': { kind: 'constant', value: 1 },
                                  'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                  'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                  'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                },
                              }),
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:16'),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:22'),
                                ),
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 0 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:26'),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_2' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:34'),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 1 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:40'),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 0 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:44'),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:47'),
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
                sequence(
                  step('dealDamage', {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[4]11:failActions10:actionData3:[0]11:actionOrder2:89'),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
        230,
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit3:150',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_2' },
                recipient: 'caster',
              }),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit3:150',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
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
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit4:151',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                      operator: 'greater',
                      value: { kind: 'constant', value: 0.5 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 1 },
                    },
                  ],
                },
                sequence(
                  branch(
                    { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'talent_1_1' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_2_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: false,
                                blackboardAssignments: {
                                  'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                  'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                  'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                  'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                  'talent_2': { kind: 'constant', value: 1 },
                                  'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                  'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                  'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                },
                              }),
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:21'),
                                ),
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 0 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:25'),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_2' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:33'),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 1 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:39'),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 0 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:43'),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:46'),
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
                sequence(
                  step('dealDamage', {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]11:failActions10:actionData3:[0]11:actionOrder2:88'),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit4:151',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_2' },
                recipient: 'caster',
              }),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit4:151',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
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
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit5:152',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              branch(
                {
                  kind: 'all',
                  conditions: [
                    {
                      kind: 'buffIdStackCompare',
                      target: 'enemy',
                      buffIds: ['buff_chr_0028_wulfa_normal_smarttarget'],
                      operator: 'greater',
                      value: { kind: 'constant', value: 0.5 },
                    },
                    {
                      kind: 'buffIdStackCompare',
                      target: 'caster',
                      buffIds: ['buff_chr_0028_wulfa_normal_wolf_timer'],
                      operator: 'equal',
                      value: { kind: 'constant', value: 1 },
                    },
                  ],
                },
                sequence(
                  branch(
                    { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'talent_1_1' },
                          operator: 'greater',
                          right: { kind: 'constant', value: 0.5 },
                        },
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_2_1' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: false,
                                blackboardAssignments: {
                                  'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                  'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                  'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                  'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                  'talent_2': { kind: 'constant', value: 1 },
                                  'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                  'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                  'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                },
                              }),
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:15'),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_2' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:21'),
                                ),
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 0 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:25'),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            { alwaysNext: true },
                          ),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'talent_1_2' },
                              operator: 'greater',
                              right: { kind: 'constant', value: 0.5 },
                            },
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'talent_2_1' },
                                  operator: 'greater',
                                  right: { kind: 'constant', value: 0.5 },
                                },
                                sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                    target: 'enemy',
                                    inheritSourceSkillCastInfo: false,
                                    blackboardAssignments: {
                                      'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                      'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                      'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                      'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                      'talent_2': { kind: 'constant', value: 1 },
                                      'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                      'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                      'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                    },
                                  }),
                                  step('dealDamage', {
                                    damageType: 'heat',
                                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                    tags: ['normalSkill'],
                                    features: ['canBreakWeakness'],
                                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:33'),
                                ),
                                sequence(
                                  branch(
                                    {
                                      kind: 'actionValueCompare',
                                      left: { kind: 'blackboard', key: 'talent_2_2' },
                                      operator: 'greater',
                                      right: { kind: 'constant', value: 0.5 },
                                    },
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 1 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:39'),
                                    ),
                                    sequence(
                                      step('applyBuff', {
                                        buffId: 'buff_chr_0028_wulfa_normal_bleed',
                                        target: 'enemy',
                                        inheritSourceSkillCastInfo: false,
                                        blackboardAssignments: {
                                          'duration': { kind: 'blackboard', key: 'duration_bleed' },
                                          'atk_scale': { kind: 'blackboard', key: 'atk_scale_bleed' },
                                          'extra_atk_scale': { kind: 'blackboard', key: 'bleed_critical_damage_scale' },
                                          'damage_cd': { kind: 'blackboard', key: 'bleed_critical_damage_interval' },
                                          'talent_2': { kind: 'constant', value: 0 },
                                          'damage_up': { kind: 'blackboard', key: 'damage_up' },
                                          'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                                          'talent2_burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
                                        },
                                      }),
                                      step('dealDamage', {
                                        damageType: 'heat',
                                        attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                        tags: ['normalSkill'],
                                        features: ['canBreakWeakness'],
                                        stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                                      }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:43'),
                                    ),
                                    { alwaysNext: true },
                                  ),
                                ),
                                { alwaysNext: true },
                              ),
                            ),
                            sequence(
                              step('dealDamage', {
                                damageType: 'heat',
                                attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                                tags: ['normalSkill'],
                                features: ['canBreakWeakness'],
                                stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:46'),
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
                sequence(
                  step('dealDamage', {
                    damageType: 'heat',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_once' },
                    tags: ['normalSkill'],
                    features: ['canBreakWeakness'],
                    stagger: [10, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 15],
                  }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[3]11:failActions10:actionData3:[0]11:actionOrder2:88'),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
        ),
      ),
      scheduled(
        230,
        sequence(
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit5:152',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_2' },
                recipient: 'caster',
              }),
            ),
          ),
          withActionBlackboardScope(
            'projectile:chr_0028_wulfa_normal_skill_projhit5:152',
            { atb_return: 10, atk_scale_3: 3, atk_scale_bleed: 0, atk_scale_once: 0, bleed_critical_damage_interval: 2, bleed_critical_damage_scale: 1, damage_up: 0, duration: 0, duration_bleed: 0, fire_duration: 0, heal_scale: 0.005, hit_bleed_num: 0, poise_2: 0, potential_upgrade: 0, skillimbue: 0, talent2_burning_damage_scale: 1.5, talent_1_1: 0, talent_1_2: 0, talent_2_1: 0, talent_2_2: 0, usp: 0, usp_2: 0 },
            true,
            sequence(
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
                { alwaysNext: true },
              ),
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
    'atb_return': 10,
    'atk_scale_once': 0,
    'bleed_critical_damage_interval': 2,
    'bleed_critical_damage_scale': 1,
    'damage_up': 0,
    'heal_scale': 0.2,
    'potential_upgrade': 0,
    'talent2_burning_damage_scale': 1.5,
    'talent_1_1': 0,
    'talent_1_2': 0,
    'talent_2_1': 0,
    'talent_2_2': 0,
  },
);

export const rossiComboSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill2',
    sourceSkillId: 'chr_0028_wulfa_combo_2_skill',
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
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        45,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: "unassigned",
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
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        65,
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
            undefined,
            { alwaysNext: true },
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
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_2_damagewait',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_scale': { kind: 'blackboard', key: 'atk_scale_once' },
              'trigger_times': { kind: 'constant', value: 3 },
              'damage_interval': { kind: 'constant', value: 0.125 },
              'duration': { kind: 'constant', value: 0.3 },
            },
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        37,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'can_trigger_combo' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_2_qte_timerlistening',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'time_succeed': { kind: 'blackboard', key: 'time_succeed' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
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
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                    operation: 'set',
                    basis: 'absoluteSeconds',
                    value: { kind: 'constant', value: 0 },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_usetimer',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
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
    'cam_shoulderoffset_X': 0,
    'poise_once': 0.01,
    'time_succeed': 0.4,
  },
);

export const rossiComboSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill3',
    sourceSkillId: 'chr_0028_wulfa_combo_3_skill',
    timelineBlockFrames: 52,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_usecount',
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
                slot: "unassigned",
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
                undefined,
                { alwaysNext: true },
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
              step('jumpTimeline', { destinationFrame: 212 }),
            ),
            { alwaysNext: true },
          ),
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
                slot: "unassigned",
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
                undefined,
                { alwaysNext: true },
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
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
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        40,
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.633 },
            slot: "unassigned",
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
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        60,
      ),
      scheduled(
        29,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'buff_stack',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"] },
              }),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"],
                reason: 'early',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                count: { kind: 'blackboard', key: 'buff_stack' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                  buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"] },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    count: { kind: 'blackboard', key: 'buff_stack' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                      buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"] },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        count: { kind: 'blackboard', key: 'buff_stack' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                          buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"] },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            count: { kind: 'blackboard', key: 'buff_stack' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                        { alwaysNext: true },
                      ),
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
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_physical_no_guard',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('finishBuffsById', {
                    target: 'enemy',
                    buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                    reason: 'other',
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
            undefined,
            { alwaysNext: true },
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
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
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
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        59,
      ),
      scheduled(
        211,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_criticalrate',
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
            slot: "unassigned",
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
        212,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_defup',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        259,
      ),
      scheduled(
        227,
        sequence(
          branch(
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('readBuffStackCount', {
                target: 'enemy',
                outputKey: 'buff_stack',
                query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"] },
              }),
              step('finishBuffsByTag', {
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTags: ["Skill/Character/Common/SpellInflict/FireInflict"],
                reason: 'early',
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                count: { kind: 'blackboard', key: 'buff_stack' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                  buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffStackCount', {
                    target: 'enemy',
                    outputKey: 'buff_stack',
                    query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"] },
                  }),
                  step('finishBuffsByTag', {
                    target: 'enemy',
                    tagQueryType: 'hasAny',
                    buffTags: ["Skill/Character/Common/SpellInflict/NaturalInflict"],
                    reason: 'early',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    count: { kind: 'blackboard', key: 'buff_stack' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                      buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                    sequence(
                      step('readBuffStackCount', {
                        target: 'enemy',
                        outputKey: 'buff_stack',
                        query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"] },
                      }),
                      step('finishBuffsByTag', {
                        target: 'enemy',
                        tagQueryType: 'hasAny',
                        buffTags: ["Skill/Character/Common/SpellInflict/PulseInflict"],
                        reason: 'early',
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        count: { kind: 'blackboard', key: 'buff_stack' },
                      }),
                      step('applyBuff', {
                        buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                          buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"],
                          operator: 'greaterOrEqual',
                          value: { kind: 'constant', value: 1 },
                        },
                        sequence(
                          step('readBuffStackCount', {
                            target: 'enemy',
                            outputKey: 'buff_stack',
                            query: { kind: 'tag', tagQueryType: 'hasAny', buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"] },
                          }),
                          step('finishBuffsByTag', {
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            buffTags: ["Skill/Character/Common/SpellInflict/CrystInflict"],
                            reason: 'early',
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_inflictnum',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            count: { kind: 'blackboard', key: 'buff_stack' },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_combo_hasinflict',
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
                        { alwaysNext: true },
                      ),
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
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
                sequence(
                  step('finishBuffsById', {
                    target: 'enemy',
                    buffIds: ['buff_chr_0028_wulfa_combo_hasinflict'],
                    reason: 'other',
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
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_tut_comboskill_finish',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        257,
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
    'atk_scale_once': 0,
    'poise_once': 0,
    'potential_atk_multiply': 1,
  },
);

export const rossiUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0028_wulfa_ultimate_skill',
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
        58,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
            blackboardAssignments: {
              'critical_damage_up_to_bleed': { kind: 'blackboard', key: 'crit_damage_up_to_bleed' },
            },
          }),
        ),
        208,
      ),
      scheduled(
        63,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_1' },
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
              }, '8:ultimate11:conditional19:timelineActions[40]19:_sequenceActionData10:actionData3:[0]13:actionOnEvent10:actionData3:[4]14:succeedActions10:actionData3:[0]11:actionOrder3:152'),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        63,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
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
              tags: ["Immune/Damage", "SelectCategory/Unmarkable"],
            },
            sequence(),
            sequence(
              branch(
                { kind: 'enemyRankIn', ranks: ['mob'] },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0028_wulfa_ult_stopenemy',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'constant', value: 2.866664 },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        65,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        66,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        69,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        71,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        74,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        75,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        77,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        78,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        80,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        83,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        84,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        87,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        88,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        90,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        92,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        94,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        96,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        97,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        99,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        102,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        103,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        106,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        108,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        111,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              branch(
                { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
                undefined,
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
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
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
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
            undefined,
            { alwaysNext: true },
          ),
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
    'potential_5_critical_damage': 0,
    'potential_5_damage_scale': 1.2,
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
  buffDefinitions: {
    'buff_chr_0028_wulfa_powerattack_resumecombo': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'End_Early': 0,
        'duration': 10,
      },
    },
    'buff_chr_0028_wulfa_tut_normalskill_failure': {
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_failure12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_failure11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_failure12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_failure11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_failure12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_failure11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_failure12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_failure11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_normal_defup': {
      stackingType: 'refresh',
      timeClock: 'global',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_scale': 0.3,
        'damage_cd': 1.5,
        'damage_interval': 1,
        'damage_up': 0.12,
        'defup': -0.5,
        'duration': 5,
        'extra_atk_scale': 1.5,
        'heal_scale': 0.2,
        'poise': 0,
        'posie': 0,
        'talent2_burning_damage_scale': 1.5,
        'talent_2': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'product',
              addition: { blackboardKey: 'defup' },
            },
          ],
        },
      ],
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_defup12:buffInterval32:buff_chr_0028_wulfa_normal_defup11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_defup12:buffInterval32:buff_chr_0028_wulfa_normal_defup11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_defup12:buffInterval32:buff_chr_0028_wulfa_normal_defup11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_defup12:buffInterval32:buff_chr_0028_wulfa_normal_defup11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_normal_smarttarget': {
      stackingType: 'refresh',
      timeClock: 'global',
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '38:buff_chr_0028_wulfa_normal_smarttarget12:buffInterval38:buff_chr_0028_wulfa_normal_smarttarget11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '38:buff_chr_0028_wulfa_normal_smarttarget12:buffInterval38:buff_chr_0028_wulfa_normal_smarttarget11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '38:buff_chr_0028_wulfa_normal_smarttarget12:buffInterval38:buff_chr_0028_wulfa_normal_smarttarget11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '38:buff_chr_0028_wulfa_normal_smarttarget12:buffInterval38:buff_chr_0028_wulfa_normal_smarttarget11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_normal_wolf_timer': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 3,
      },
    },
    'buff_chr_0028_wulfa_normal_bleed_effect': {
      stackingType: 'refresh',
      timeClock: 'global',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_scale': 0.3,
        'damage_cd': 1.5,
        'damage_interval': 1,
        'duration': 0.9,
        'extra_atk_scale': 1.5,
        'poise': 0,
        'posie': 0,
        'talent_2': 0,
      },
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '39:buff_chr_0028_wulfa_normal_bleed_effect12:buffInterval39:buff_chr_0028_wulfa_normal_bleed_effect11:actionOrder1:11:01:2'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '39:buff_chr_0028_wulfa_normal_bleed_effect12:buffInterval39:buff_chr_0028_wulfa_normal_bleed_effect11:actionOrder1:11:11:2'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '39:buff_chr_0028_wulfa_normal_bleed_effect12:buffInterval39:buff_chr_0028_wulfa_normal_bleed_effect11:actionOrder1:11:21:2'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '39:buff_chr_0028_wulfa_normal_bleed_effect12:buffInterval39:buff_chr_0028_wulfa_normal_bleed_effect11:actionOrder1:11:31:2'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_talent2_heal_effect': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0.5,
        'interval': 0.3,
      },
    },
    'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_scale': 0.3,
        'burning_damage_scale': 1.5,
        'damage_cd': 1.5,
        'damage_interval': 1,
        'duration': 1.2,
        'heal_scale': 0.05,
        'poise': 0,
        'posie': 0,
      },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            branch(
              {
                kind: 'buffStackCompare',
                target: 'buffOwner',
                tagQueryType: 'hasAny',
                buffTags: ["Skill/Character/Common/SpellStatus/Burning"],
                operator: 'greater',
                value: { kind: 'constant', value: 0.5 },
              },
              sequence(
                step('calculateActionValue', {
                  key: 'atk_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'atk_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step('calculateActionValue', {
                  key: 'heal_scale',
                  operation: 'multiply',
                  left: { kind: 'blackboard', key: 'heal_scale' },
                  right: { kind: 'blackboard', key: 'burning_damage_scale' },
                }),
                step('dealDamage', {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: [],
                  features: ['talentDamage'],
                }, '50:buff_chr_0028_wulfa_normal_bleed_crit_extra_damage11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder1:4'),
                step('heal', {
                  target: 'buffSource',
                  alwaysNext: false,
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                  tags: [],
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'buffSource',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              sequence(
                step('dealDamage', {
                  damageType: 'heat',
                  attackScale: { kind: 'blackboard', key: 'atk_scale' },
                  tags: [],
                  features: ['talentDamage'],
                }, '50:buff_chr_0028_wulfa_normal_bleed_crit_extra_damage11:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:11'),
                step('heal', {
                  target: 'buffSource',
                  alwaysNext: false,
                  attribute: 'intellect',
                  multiplier: { kind: 'blackboard', key: 'heal_scale' },
                  addition: { kind: 'constant', value: 0 },
                  tags: [],
                }),
                branch(
                  {
                    kind: 'all',
                    conditions: [
                      {
                        kind: 'buffIdStackCompare',
                        target: 'caster',
                        buffIds: ['buff_chr_0028_wulfa_talent2_heal_effect'],
                        operator: 'equal',
                        value: { kind: 'constant', value: 0 },
                      },
                      {
                        kind: 'healthCompare',
                        target: 'buffSource',
                        valueType: 'ratio',
                        operator: 'less',
                        value: { kind: 'constant', value: 1 },
                      },
                    ],
                  },
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0028_wulfa_talent2_heal_effect',
                      target: 'buffSource',
                      inheritSourceSkillCastInfo: true,
                    }),
                  ),
                  undefined,
                  { alwaysNext: true },
                ),
              ),
              { alwaysNext: true },
            ),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_normal_bleed': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_wulfa_blood',
        iconPath: '/operators/rossi/icon_battle_buff_wulfa_blood.webp',
        showInHeadBarCommon: true,
        showInHeadBarAttached: false,
        showInSquadIcon: false,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'KeywordDebuff',
        },
      },
      timeClock: 'global',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale': 0.3,
        'damage_cd': 1.5,
        'damage_interval': 1,
        'damage_up': 0.12,
        'duration': 1,
        'extra_atk_scale': 1.5,
        'heal_scale': 0.2,
        'poise': 0,
        'posie': 0,
        'talent2_burning_damage_scale': 1.5,
        'talent_2': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['physical'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['heat'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'damage_up' },
            },
          ],
        },
      ],
      lifecycleSequences: {
        trigger: sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: [],
            features: ['dot', 'talentDamage'],
          }, '42:buff_chr_0028_wulfa_normal_bleed:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:2'),
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_normal_bleed_effect',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'takeCriticalDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent_2' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0.5 },
                },
                sequence(
                  branch(
                    { kind: 'eventSourceMatchesBuffSource' },
                    sequence(
                      branch(
                        {
                          kind: 'eventDamageTagsMatch',
                          match: 'hasAny',
                          tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0028_wulfa_normal_bleed_crit_extra_damage',
                            target: 'buffOwner',
                            inheritSourceSkillCastInfo: false,
                            blackboardAssignments: {
                              'atk_scale': { kind: 'blackboard', key: 'extra_atk_scale' },
                              'damage_cd': { kind: 'blackboard', key: 'damage_cd' },
                              'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                              'burning_damage_scale': { kind: 'blackboard', key: 'talent2_burning_damage_scale' },
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_bleed12:buffInterval32:buff_chr_0028_wulfa_normal_bleed11:actionOrder2:101:02:11'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_bleed12:buffInterval32:buff_chr_0028_wulfa_normal_bleed11:actionOrder2:101:12:11'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_bleed12:buffInterval32:buff_chr_0028_wulfa_normal_bleed11:actionOrder2:101:22:11'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '32:buff_chr_0028_wulfa_normal_bleed12:buffInterval32:buff_chr_0028_wulfa_normal_bleed11:actionOrder2:101:32:11'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_tut_normalskill_success': {
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_success12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_success11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_success12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_success11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_success12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_success11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '43:buff_chr_0028_wulfa_tut_normalskill_success12:buffInterval43:buff_chr_0028_wulfa_tut_normalskill_success11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_combo_usecount': {
      stackingType: 'enhanceAndOverwriteDuration',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: 10,
    },
    'buff_chr_0028_wulfa_combo_cannottrigger': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 10,
      },
    },
    'buff_chr_0028_wulfa_combo_2_damage': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: { blackboardKey: 'damage_interval' },
      waitFirstTriggerInterval: false,
      maxTriggerCount: { blackboardKey: 'trigger_times' },
      blackboard: {
        'atk_scale': 0.3,
        'damage_interval': 0.1,
        'duration': 1,
        'poise': 0,
        'posie': 0,
        'trigger_times': 3,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '44:buff_chr_0028_wulfa_combo_2_damage:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
        ),
      },
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '34:buff_chr_0028_wulfa_combo_2_damage12:buffInterval34:buff_chr_0028_wulfa_combo_2_damage11:actionOrder1:41:01:5'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '34:buff_chr_0028_wulfa_combo_2_damage12:buffInterval34:buff_chr_0028_wulfa_combo_2_damage11:actionOrder1:41:11:5'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '34:buff_chr_0028_wulfa_combo_2_damage12:buffInterval34:buff_chr_0028_wulfa_combo_2_damage11:actionOrder1:41:21:5'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '34:buff_chr_0028_wulfa_combo_2_damage12:buffInterval34:buff_chr_0028_wulfa_combo_2_damage11:actionOrder1:41:31:5'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_combo_2_damagewait': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_scale': 0.3,
        'damage_interval': 0.1,
        'duration': 3,
        'poise': 0,
        'posie': 0,
        'trigger_times': 3,
      },
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0028_wulfa_combo_2_damage',
            target: 'buffOwner',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
              'poise': { kind: 'blackboard', key: 'poise' },
              'trigger_times': { kind: 'blackboard', key: 'trigger_times' },
              'damage_interval': { kind: 'blackboard', key: 'damage_interval' },
            },
          }),
        ),
      },
    },
    'buff_chr_0028_wulfa_combo_2_qte_timer': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0.5,
      },
    },
    'buff_chr_0028_wulfa_tut_comboskill_failure': {
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_failure12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_failure11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_failure12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_failure11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_failure12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_failure11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_failure12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_failure11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_combo_2_qte_timerlistening': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 6,
        'time_succeed': 0.5,
        'time_warning': 0.5,
      },
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0028_wulfa_combo_2_qte_timer'],
                  operator: 'greaterOrEqual',
                  value: 1,
                },
              ],
            },
            sequence(
                step('modifyActionValue', {
                  key: 'EntityBB_Combo_QTE_Trigger',
                  operation: 'assign',
                  value: { kind: 'constant', value: 1 },
                }),
            ),
            ),
          ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: false,
                }),
              ),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: true,
                }),
              ),
            ),
          ),
        },
      ],
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('modifyActionValue', {
              key: 'EntityBB_Combo_QTE_Trigger',
              operation: 'assign',
              value: { kind: 'constant', value: 0 },
            }),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_combo_2_qte_timer',
              target: 'buffOwner',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'blackboard', key: 'time_succeed' },
              },
            }),
          ),
        ),
        scheduled(
          35,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0028_wulfa_tut_comboskill_failure',
              target: 'buffOwner',
              inheritSourceSkillCastInfo: true,
              blackboardAssignments: {
                'duration': { kind: 'constant', value: 0.2 },
              },
            }),
            step('finishBuffsById', {
              target: 'buffOwner',
              buffIds: ['buff_train_output_succbuff_or_failbuff_by_id'],
              reason: 'early',
            }),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_combo_usetimer': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'End_Early': 0,
        'duration': 6,
        'need_set_cd': 1,
      },
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0028_wulfa_combo_usecount'],
            reason: 'other',
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'need_set_cd' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 0.5 },
            },
            sequence(
              step('adjustSkillCooldown', {
                target: 'caster',
                skill: { kind: 'id', skillId: 'chr_0028_wulfa_combo_2_skill' },
                operation: 'set',
                basis: 'baseDurationRatio',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0028_wulfa_powerattack_resumecombo'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: false,
                }),
              ),
            ),
          ),
        },
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventSkillIdIn', skillIds: ['chr_0028_wulfa_power_attack'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: true,
                }),
              ),
            ),
          ),
        },
      ],
    },
    'buff_chr_0028_wulfa_combo_criticalrate': {
      stackingType: 'refresh',
      presentation: {
        visible: true,
        iconId: 'icon_battle_crit_up',
        iconPath: '/icons/icon_battle_crit_up.webp',
        showInHeadBarCommon: false,
        showInHeadBarAttached: false,
        showInSquadIcon: true,
        onlyShowForMainCharacter: false,
        iconStyleInSquad: 'LifeTime',
        abnormalColorType: 'Physical',
        orderPriority: {
          useDirectoryValue: false,
          value: 0,
          category: 'CommonCharBuff',
        },
      },
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
          attribute: 'criticalRate',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_rate' },
        },
        {
          attribute: 'criticalDamageIncrease',
          slot: 'baseAddition',
          value: { blackboardKey: 'critical_damage_inc' },
        },
      ],
    },
    'buff_chr_0028_wulfa_combo_inflictnum': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 10,
      },
    },
    'buff_chr_0028_wulfa_combo_hasinflict': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 10,
      },
    },
    'buff_chr_0028_wulfa_tut_comboskill_success': {
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_success12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_success11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_success12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_success11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_success12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_success11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '42:buff_chr_0028_wulfa_tut_comboskill_success12:buffInterval42:buff_chr_0028_wulfa_tut_comboskill_success11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_tut_comboskill_finish': {
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
      scheduledSequences: [
        scheduled(
          10,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '41:buff_chr_0028_wulfa_tut_comboskill_finish12:buffInterval41:buff_chr_0028_wulfa_tut_comboskill_finish11:actionOrder1:01:01:1'),
          ),
        ),
        scheduled(
          12,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '41:buff_chr_0028_wulfa_tut_comboskill_finish12:buffInterval41:buff_chr_0028_wulfa_tut_comboskill_finish11:actionOrder1:01:11:1'),
          ),
        ),
        scheduled(
          15,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '41:buff_chr_0028_wulfa_tut_comboskill_finish12:buffInterval41:buff_chr_0028_wulfa_tut_comboskill_finish11:actionOrder1:01:21:1'),
          ),
        ),
        scheduled(
          18,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'posie' },
            }, '41:buff_chr_0028_wulfa_tut_comboskill_finish12:buffInterval41:buff_chr_0028_wulfa_tut_comboskill_finish11:actionOrder1:01:31:1'),
          ),
        ),
      ],
    },
    'buff_chr_0028_wulfa_ult_crit_damage_up_to_bleed': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 3,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'critical_damage_up_to_bleed': 0.2,
        'duration': 5,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'eventDamageTagsMatch',
            match: 'hasAll',
            tags: ['ultimateSkill'],
          },
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'attacker',
              attribute: 'criticalDamageIncrease',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'critical_damage_up_to_bleed' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    'buff_chr_0028_wulfa_ult_stopenemy': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 4,
      durationSeconds: { blackboardKey: 'duration' },
      applyTags: ["Status/Immobilized"],
      blackboard: {
        'duration': 1.5,
        'usp_stage_1': 0.35,
        'usp_stage_2': 0.7,
        'usp_stage_3': 1,
      },
    },
  },
  talents: [
    {
      key: 'talent1',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_1',
          operation: 'assign',
          value: [1, 0],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'atk_scale_bleed',
          operation: 'assign',
          value: [0.25, 0.3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'duration_bleed',
          operation: 'assign',
          value: [15, 25],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'damage_up',
          operation: 'assign',
          value: [0.06, 0.12],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_1_2',
          operation: 'assign',
          value: [0, 1],
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
          blackboardKey: 'talent_2_1',
          operation: 'assign',
          value: [1, 0],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_scale',
          operation: 'assign',
          value: [0.12, 0.24],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'bleed_critical_damage_interval',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'heal_scale',
          operation: 'assign',
          value: [0.04, 0.08],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent2_burning_damage_scale',
          operation: 'assign',
          value: [1.5, 1.5],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_2',
          operation: 'assign',
          value: [0, 1],
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
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_s',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
          blackboardKey: 'atk_scale_f',
          operation: 'multiply',
          value: 1.15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          skillKey: 'comboSkill3',
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
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
