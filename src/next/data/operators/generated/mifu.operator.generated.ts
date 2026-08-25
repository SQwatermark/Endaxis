/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentage, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const mifuComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0031_mifu_combo_skill',
    timelineBlockFrames: 35,
    cooldownFrames: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 570],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'buff_chr_0031_mifu_shield' } },
              ],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0031_mifu_potential_addattack',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'addattack_effect': { kind: 'blackboard', key: 'potential_addattack_effect' },
                      'addattack_duraion': { kind: 'blackboard', key: 'potential_addattack_duration' },
                    },
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
              step('storeSourceAttributeValue', {
                attribute: { kind: 'specific', key: 'maxHealth' },
                stage: 'finalNonConverted',
                useFloor: false,
                divisor: { kind: 'constant', value: 1 },
                multiplier: { kind: 'constant', value: 1 },
                base: { kind: 'constant', value: 0 },
                targetKey: 'talent_shield_maxhp',
              }),
              step('modifyActionValue', {
                key: 'talent_shield_maxhp',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'talent_shield_hppercent' },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0031_mifu_shield',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'talent_shield_duration' },
                  'FinalShield': { kind: 'blackboard', key: 'talent_shield_maxhp' },
                },
              }),
              step('createTimedMarker', {
                target: 'caster',
                markerId: 'buff_chr_0031_mifu_shield',
                durationSeconds: { kind: 'blackboard', key: 'talent_shield_cd' },
                autoFinishByAction: false,
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
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.36666 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        8,
      ),
      scheduled(
        2,
        sequence(
          step('modifyActionValue', {
            key: 'Ifmoveto',
            operation: 'assign',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct25:chr_0031_mifu_combo_skill11:actionOrder2:43'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct25:chr_0031_mifu_combo_skill11:actionOrder2:49'),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        31,
        sequence(
          step('modifyActionValue', {
            key: 'final_effect',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'rate' },
          }),
          step('modifyActionValue', {
            key: 'final_time',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'duration' },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'final_effect',
                operation: 'add',
                value: { kind: 'blackboard', key: 'extra_effect' },
              }),
              step('modifyActionValue', {
                key: 'final_time',
                operation: 'add',
                value: { kind: 'blackboard', key: 'extra_time' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_vulnerablephysic_comboskill',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'final_time' },
              'rate': { kind: 'blackboard', key: 'final_effect' },
            },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([51, 56, 61, 66, 71, 77, 82, 87, 92, 98, 106, 115]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct25:chr_0031_mifu_combo_skill11:actionOrder2:71'),
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
      scheduled(
        35,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        73,
      ),
    ],
  },
  {
    'extra_effect': 0,
    'extra_time': 0,
    'final_effect': 0,
    'final_time': 0,
    'potential': 0,
    'talent': 0,
    'talent_shield_hppercent': 0,
    'talent_shield_maxhp': 0,
    'atk_scale1': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
    'atk_scale2': [0.51, 0.56, 0.61, 0.66, 0.71, 0.77, 0.82, 0.87, 0.92, 0.98, 1.06, 1.15],
    'display_atk_scale': [1.11, 1.22, 1.33, 1.44, 1.55, 1.67, 1.78, 1.89, 2, 2.14, 2.3, 2.5],
    'duration': 16,
    'poise': 10,
    'rate': 0.05,
    'usp': 10,
    'potential_addattack_duration': 0,
    'potential_addattack_effect': 0,
    'talent_shield_cd': 0,
    'talent_shield_duration': 0,
  },
);

export const mifuBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0031_mifu_attack1',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([34, 37, 41, 44, 47, 51, 54, 57, 61, 65, 70, 76]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct21:chr_0031_mifu_attack111:actionOrder2:14'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'hit_target',
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
        9,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        10,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
    ],
  },
  {
    'hit_target': 0,
    'hitstop_times': 0,
    'atb': 0,
    'atk_scale': [0.34, 0.37, 0.41, 0.44, 0.47, 0.51, 0.54, 0.57, 0.61, 0.65, 0.7, 0.76],
  },
);

export const mifuBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0031_mifu_attack2',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([13, 15, 16, 17, 19, 20, 21, 23, 24, 26, 27, 30]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct21:chr_0031_mifu_attack211:actionOrder1:9'),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([25, 28, 30, 33, 35, 38, 40, 43, 45, 48, 52, 56]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct21:chr_0031_mifu_attack211:actionOrder2:19'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale1': [0.13, 0.15, 0.16, 0.17, 0.19, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.3],
    'atk_scale2': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
    'display_atk_scale': [0.38, 0.42, 0.46, 0.5, 0.54, 0.57, 0.61, 0.65, 0.69, 0.74, 0.79, 0.86],
  },
);

export const mifuBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0031_mifu_attack3',
    timelineBlockFrames: 37,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0031_mifu_attack311:actionOrder2:19'),
        ),
      ),
      scheduled(
        10,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0031_mifu_attack311:actionOrder2:24'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'hit_target',
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
        16,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        18,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        19,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
          step('modifyActionValue', {
            key: 'hitstop_times',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([31, 34, 37, 40, 43, 46, 49, 52, 55, 59, 63, 69]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct21:chr_0031_mifu_attack311:actionOrder2:43'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('modifyActionValue', {
                key: 'hit_target',
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
        30,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        31,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
      scheduled(
        32,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'hit_target' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hitstop_times',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('modifyActionValue', {
            key: 'hit_target',
            operation: 'assign',
            value: { kind: 'constant', value: 0 },
          }),
        ),
      ),
    ],
  },
  {
    'hit_target': 0,
    'hitstop_times': 0,
    'atb': 0,
    'atk_scale1': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'atk_scale2': [0.31, 0.34, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.59, 0.63, 0.69],
    'display_atk_scale': [0.61, 0.67, 0.73, 0.79, 0.85, 0.91, 0.97, 1.03, 1.09, 1.16, 1.26, 1.36],
  },
);

export const mifuBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0031_mifu_attack4',
    timelineBlockFrames: 38,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct21:chr_0031_mifu_attack411:actionOrder2:11'),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([72, 79, 86, 93, 100, 107, 114, 122, 129, 138, 148, 161]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 25,
          }, '12:basicAttack46:direct21:chr_0031_mifu_attack411:actionOrder2:17'),
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
    'atb': 28,
    'atk_scale1': [0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.1, 0.11],
    'atk_scale2': [0.72, 0.79, 0.86, 0.93, 1, 1.07, 1.14, 1.22, 1.29, 1.38, 1.48, 1.61],
    'display_atk_scale': [0.77, 0.84, 0.92, 0.99, 1.07, 1.15, 1.22, 1.3, 1.38, 1.47, 1.59, 1.72],
    'poise': 25,
  },
);

export const mifuPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0031_mifu_plunging_attack_end',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        2,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct33:chr_0031_mifu_plunging_attack_end11:actionOrder1:3'),
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

export const mifuFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0031_mifu_powerattack',
    timelineBlockFrames: 38,
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
        53,
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
        38,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_buffpause',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        38,
      ),
      scheduled(
        6,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
                tags: ['powerAttack', 'normalAttack'],
                calculation: 'breakingAttack',
                calculationMultiplier: 0.3,
              }, '8:finisher11:conditional19:timelineActions[12]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:20'),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        17,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
                tags: ['powerAttack', 'normalAttack'],
                calculation: 'breakingAttack',
                calculationMultiplier: 0.2,
              }, '8:finisher11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:24'),
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
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
                tags: ['powerAttack', 'normalAttack'],
                calculation: 'breakingAttack',
                calculationMultiplier: 0.5,
              }, '8:finisher11:conditional19:timelineActions[15]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:34'),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'ifrightside': 0,
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const mifuBattleSkill1: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill1',
    sourceSkillId: 'chr_0031_mifu_normalskill_1',
    timelineBlockFrames: 11,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('changeResource', { resource: 'sp', amount: 50, recipient: 'team', spGainKind: 'refund', spGainSource: 'skill' }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'effect_z_scale',
            operation: 'divide',
            value: { kind: 'constant', value: 8 },
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([67, 73, 80, 87, 93, 100, 107, 113, 120, 128, 138, 150]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '12:battleSkill16:direct27:chr_0031_mifu_normalskill_111:actionOrder2:40'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'singleEnemyPresent' },
                {
                  kind: 'enemySuperArmorCompare',
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 30 },
                },
              ],
            },
            sequence(
              step('jumpTimeline', { destinationFrame: 105 }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        38,
      ),
      scheduled(
        104,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 204,
          }),
        ),
        104,
      ),
      scheduled(
        105,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        156,
      ),
    ],
  },
  {
    'atk_scale': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
    'display_atk_scale': [0.67, 0.73, 0.8, 0.87, 0.93, 1, 1.07, 1.13, 1.2, 1.28, 1.38, 1.5],
  },
);

export const mifuBattleSkill2: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill2',
    sourceSkillId: 'chr_0031_mifu_normalskill_2',
    timelineBlockFrames: 28,
    costs: [{ resource: 'sp', value: 50 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0031_mifu_comboprocess'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 99999 },
            slot: 257664179,
            priority: 50,
            curve: { kind: 'inline', keys: [{ time: 0, value: 1.25, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 1.25, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        15,
      ),
      scheduled(
        3,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([27, 30, 32, 35, 38, 41, 43, 46, 49, 52, 56, 61]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '12:battleSkill26:direct27:chr_0031_mifu_normalskill_211:actionOrder2:33'),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([27, 30, 32, 35, 38, 41, 43, 46, 49, 52, 56, 61]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '12:battleSkill26:direct27:chr_0031_mifu_normalskill_211:actionOrder2:39'),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0031_mifu_normalskill_2'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'stack' },
              operator: 'greater',
              right: { kind: 'blackboard', key: 'maxstack' },
            },
            sequence(
              step('modifyActionValue', {
                key: 'maxstack',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'stack' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyPhysicalInfliction', {
            type: 'crush',
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
                    target: 'buffOwner',
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
            crushedBuffId: 'buff_physical_crushed',
            crushedDefinition: {
              stackingType: 'stack',
              presentation: {
                visible: true,
                iconId: 'knockback',
                showInHeadBarCommon: false,
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
              stackingKey: 'physical',
              priority: 0,
              maxStackCount: 1,
              durationSeconds: { blackboardKey: 'duration' },
              triggerIntervalSeconds: 0,
              waitFirstTriggerInterval: true,
              maxTriggerCount: 1,
              applyTagIds: [-168668661],
              blackboard: {
                'atk_scale': 1,
                'count': 0,
                'dmg_multiplier': 1,
                'duration': 3,
                'ignore_hit_effect': 0,
              },
              lifecycleSequences: {
                start: sequence(
                  step('modifyActionValue', {
                    key: 'atk_scale',
                    operation: 'multiply',
                    value: { kind: 'blackboard', key: 'dmg_multiplier' },
                  }),
                  step('finishBuffsById', {
                    target: 'buffOwner',
                    buffIds: ['buff_physical_no_guard'],
                    reason: 'early',
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale' },
                    tags: [],
                    features: ['crush'],
                  }, '29:buff_physical_crushed:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[4]11:actionOrder1:4'),
                  step('applyBuff', {
                    buffId: 'buff_physical_handle_cryst_break',
                    target: 'buffOwner',
                    inheritSourceSkillCastInfo: true,
                  }),
                  step('igniteBuffs', {
                    target: 'buffOwner',
                    source: 'caster',
                    igniteType: 'PhysicalStatus',
                  }),
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'ignore_hit_effect' },
                      operator: 'less',
                      right: { kind: 'constant', value: 0.5 },
                    },
                    sequence(
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
                        { alwaysNext: true },
                      ),
                    ),
                  ),
                ),
              },
            },
            damageMultiplier: { kind: 'constant', value: 1 },
            ignoreHitEffect: true,
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'maxstack' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 3 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0031_mifu_normalskill_3',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([35, 39, 42, 46, 49, 53, 56, 60, 63, 68, 73, 79]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '12:battleSkill26:direct27:chr_0031_mifu_normalskill_211:actionOrder2:54'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        28,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_comboprocess',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        129,
      ),
    ],
  },
  {
    'maxstack': 0,
    'stack': 4,
    'atk_scale': [0.27, 0.3, 0.32, 0.35, 0.38, 0.41, 0.43, 0.46, 0.49, 0.52, 0.56, 0.61],
    'atk_scale2': [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.68, 0.73, 0.79],
    'display_atk_scale': [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.43, 1.51, 1.6, 1.72, 1.85, 2],
    'display_poise': 5,
    'poise': 5,
    'duration': 2,
  },
);

export const mifuBattleSkill3: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill3',
    sourceSkillId: 'chr_0031_mifu_normalskill_3',
    timelineBlockFrames: 46,
    costs: [{ resource: 'sp', value: 50 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              step('finishBuffsById', {
                target: 'caster',
                buffIds: ['buff_chr_0031_mifu_comboprocess'],
                reason: 'other',
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'distance' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 6 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'cam_angle',
                    operation: 'assign',
                    value: { kind: 'constant', value: 40 },
                  }),
                ),
                sequence(
                  step('modifyActionValue', {
                    key: 'cam_angle',
                    operation: 'assign',
                    value: { kind: 'constant', value: 60 },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0031_mifu_normalskill_3'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'singleEnemyPresent' },
                { kind: 'singleEnemyPresent' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'Ifmoveto',
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
        23,
        sequence(
          step('dealStagger', {
            value: 5,
          }),
        ),
      ),
      scheduled(
        25,
        sequence(
          step('dealStagger', {
            value: 5,
          }),
        ),
      ),
      scheduled(
        26,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_runtime',
            operation: 'assign',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'PhysicalAndSpellInflictionEnhance' },
            stage: 'finalNonConverted',
            useFloor: false,
            divisor: { kind: 'constant', value: 1 },
            multiplier: { kind: 'constant', value: 0.01 },
            base: { kind: 'constant', value: 1 },
            targetKey: 'yuanshi_multi',
          }),
          step('modifyActionValue', {
            key: 'atk_scale_runtime',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'yuanshi_multi' },
          }),
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'any',
                  conditions: [
                    {
                      kind: 'poiseCompare',
                      target: 'enemy',
                      returnValueIfMissing: false,
                      operator: 'equal',
                      value: { kind: 'constant', value: 0 },
                    },
                    {
                      kind: 'buffStackCompare',
                      target: 'enemy',
                      tagQueryType: 'hasAny',
                      buffTagIds: [1066759270],
                      operator: 'greaterOrEqual',
                      value: { kind: 'constant', value: 1 },
                    },
                  ],
                },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'crushmulti',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('modifyActionValue', {
                key: 'crushmultiadd_talent_runtime',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'crushmultiadd_talent' },
              }),
              step('modifyActionValue', {
                key: 'crushmulti',
                operation: 'add',
                value: { kind: 'blackboard', key: 'crushmultiadd_talent_runtime' },
              }),
              step('modifyActionValue', {
                key: 'atk_scale_runtime',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'crushmulti' },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_runtime' },
            tags: [],
            features: ['canBreakWeakness', 'crush'],
          }, '12:battleSkill36:direct27:chr_0031_mifu_normalskill_311:actionOrder2:55'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'Ifmoveto': 0,
    'atk_scale': [4, 4.16, 4.32, 4.48, 4.64, 4.8, 4.96, 5.12, 5.28, 5.48, 5.72, 6],
    'atk_scale_runtime': 0,
    'cam_angle': 0,
    'crushmulti': 1,
    'crushmultiadd_talent': 0,
    'crushmultiadd_talent_runtime': 0,
    'distance': 4,
    'ifrightside': 0,
    'talent': 0,
    'yuanshi_multi': 1,
    'display_poise': 10,
    'poise': 5,
  },
);

export const mifuUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0031_mifu_ultimate_skill',
    timelineBlockFrames: 113,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_buffpause',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        105,
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
        71,
      ),
      scheduled(
        75,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([90, 99, 108, 117, 126, 135, 144, 153, 162, 173, 187, 203]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct28:chr_0031_mifu_ultimate_skill11:actionOrder2:62'),
        ),
      ),
      scheduled(
        98,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentage(0),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '8:ultimate6:direct28:chr_0031_mifu_ultimate_skill11:actionOrder2:68'),
        ),
      ),
      scheduled(
        102,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0031_mifu_normalskill_2',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        102,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([221, 243, 265, 287, 309, 331, 354, 376, 398, 425, 458, 497]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '8:ultimate6:direct28:chr_0031_mifu_ultimate_skill11:actionOrder2:74'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.9, 0.99, 1.08, 1.17, 1.26, 1.35, 1.44, 1.53, 1.62, 1.73, 1.87, 2.03],
    'atk_scale2': [2.21, 2.43, 2.65, 2.87, 3.09, 3.31, 3.54, 3.76, 3.98, 4.25, 4.58, 4.97],
    'display_atk_scale': [3.11, 3.42, 3.73, 4.04, 4.35, 4.66, 4.98, 5.29, 5.6, 5.99, 6.45, 7],
    'display_poise': 20,
    'poise': 0,
    'poise2': 20,
  },
);

export const mifuGeneratedOperator: OperatorDefinition = {
  slug: 'mifu',
  gameId: 'MIFU',
  rarity: 6,
  weaponType: 'greatsword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [22, 54, 88, 122, 156, 173],
    agility: [10, 27, 46, 65, 83, 92],
    intellect: [9, 27, 45, 63, 81, 90],
    will: [14, 37, 60, 84, 107, 119],
    baseAttack: [30, 91, 155, 219, 283, 315],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [mifuBasicAttack1, mifuBasicAttack2, mifuBasicAttack3, mifuBasicAttack4] },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: mifuPlungingAttack },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: mifuFinisher },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: mifuBattleSkill1, replacementSkills: [mifuBattleSkill2, mifuBattleSkill3] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: mifuUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: mifuComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0031_mifu_potential_addattack': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      durationSeconds: { blackboardKey: 'addattack_duraion' },
      triggerIntervalSeconds: 0,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'addattack_duraion': 0,
        'addattack_effect': 0,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'addattack_effect' },
        },
      ],
    },
    'buff_chr_0031_mifu_shield': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_shield',
        iconPath: '/icons/icon_battle_shield.webp',
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
      applyTagIds: [-1757502026],
      blackboard: {
        'FinalShield': 1000,
        'duration': 8,
        'extraattack': 0,
        'potential_5': 0,
        'shelter': 0,
      },
      shields: [
        {
          infinityValue: false,
          value: { blackboardKey: 'FinalShield' },
          absorbCount: -1,
          absorbAllDamageWhenConsumed: false,
          removeBuffWhenConsumed: true,
          priority: 'normal',
          replaceHitEffect: true,
          damageAbsorptions: [
          ],
        },
      ],
      sustainedProtection: {
        target: 'buffSource',
        superArmor: 35,
        impactResistance: 100,
      },
    },
    'buff_chr_0031_mifu_normalskill_2': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
        showInHeadBarCommon: false,
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
      durationSeconds: 15,
      applyTagIds: [282004889],
      blackboard: {
        'def': 0,
        'dur': 0,
        'prob': 0,
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkill2',
          revertedSkillKey: 'battleSkill1',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0031_mifu_normalskill_3'],
            reason: 'other',
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: false,
                }),
              ),
            ),
          ),
        },
      ],
    },
    'buff_chr_0031_mifu_vulnerablephysic_comboskill': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_down',
        iconPath: '/icons/icon_battle_buff_def_down.webp',
        showInHeadBarCommon: false,
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
        'duration': 15,
        'rate': 0.25,
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
              zone: 'vulnerable',
              addition: { blackboardKey: 'rate' },
            },
          ],
        },
      ],
    },
    'buff_chr_0031_mifu_comboprocess': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0031_mifu_buffpause': {
      stackingType: 'unique',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_down',
        iconPath: '/icons/icon_battle_buff_def_down.webp',
        showInHeadBarCommon: false,
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
      blackboard: {
        'def': 0,
        'dur': 0,
        'prob': 0,
      },
    },
    'buff_chr_0031_mifu_normalskill_3': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
        showInHeadBarCommon: false,
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
      durationSeconds: 15,
      applyTagIds: [1741176079],
      blackboard: {
        'def': 0,
        'dur': 0,
        'prob': 0,
      },
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkill3',
          revertedSkillKey: 'battleSkill1',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0031_mifu_normalskill_2'],
            reason: 'other',
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0031_mifu_buffpause'] },
              sequence(
                step('setCurrentBuffTimePaused', {
                  paused: false,
                }),
              ),
            ),
          ),
        },
      ],
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
          skillKey: 'battleSkill3',
          blackboardKey: 'talent',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'crushmultiadd_talent',
          operation: 'assign',
          value: [0.1, 0.2],
        },
      ],
    },
    {
      key: 'talent2',
      levels: 2,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent',
          operation: 'assign',
          value: [1, 1],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_hppercent',
          operation: 'assign',
          value: [0.15, 0.3],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_duration',
          operation: 'assign',
          value: [10, 10],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_cd',
          operation: 'assign',
          value: [60, 60],
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
          kind: 'addSkillCooldownFrames',
          skillGroupKey: 'comboSkill',
          frames: -60,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extra_effect',
          operation: 'assign',
          value: 0.05,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'extra_time',
          operation: 'assign',
          value: 4,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['strength'],
          value: 20,
        },
        { kind: 'modifyBasePanelStat', stat: 'artsIntensity', operation: 'flat', value: 16 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_cd',
          operation: 'add',
          value: -15,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'talent_shield_duration',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_addattack_effect',
          operation: 'assign',
          value: 0.06,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential_addattack_duration',
          operation: 'assign',
          value: 20,
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
          blackboardKey: 'poise2',
          operation: 'add',
          value: 5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill1',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill2',
          blackboardKey: 'atk_scale2',
          operation: 'multiply',
          value: 1.1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill3',
          blackboardKey: 'atk_scale',
          operation: 'multiply',
          value: 1.1,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
