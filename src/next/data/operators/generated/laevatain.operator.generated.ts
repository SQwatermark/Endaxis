/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const laevatainComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0016_laevat_combo_skill',
    timelineBlockFrames: 41,
    cooldownFrames: [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 270],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
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
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_hide_wpn_vfx',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        33,
      ),
      scheduled(
        3,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        5,
        sequence(
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [-1110095722, -421286163],
            },
            sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'blackboard', key: 'limit' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'count',
                    operation: 'assign',
                    value: { kind: 'blackboard', key: 'limit' },
                  }),
                ),
              ),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        6,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        15,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        18,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_combo_skill_hit_self',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'index' },
              operator: 'less',
              right: { kind: 'constant', value: 5 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'index',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'index' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_combo_skill_start',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                  'poise': { kind: 'blackboard', key: 'poise' },
                  'trigger': { kind: 'constant', value: 0.7 },
                },
              }),
            ),
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'index' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 2 },
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0016_laevat_combo_skill_start',
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                      'poise': { kind: 'blackboard', key: 'poise' },
                      'trigger': { kind: 'constant', value: 0.65 },
                    },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 3 },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_chr_0016_laevat_combo_skill_start',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                          'poise': { kind: 'blackboard', key: 'poise' },
                          'trigger': { kind: 'constant', value: 0.6 },
                        },
                      }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'index' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 4 },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_combo_skill_start',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                              'poise': { kind: 'blackboard', key: 'poise' },
                              'trigger': { kind: 'constant', value: 0.55 },
                            },
                          }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'index' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 5 },
                            },
                            sequence(
                              step('applyBuff', {
                                buffId: 'buff_chr_0016_laevat_combo_skill_start',
                                target: 'enemy',
                                inheritSourceSkillCastInfo: true,
                                blackboardAssignments: {
                                  'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
                                  'poise': { kind: 'blackboard', key: 'poise' },
                                  'trigger': { kind: 'constant', value: 0.55 },
                                },
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
      scheduled(
        21,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        27,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        36,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        39,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        42,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        46,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        49,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        52,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
      scheduled(
        55,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ult_end',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.1 },
            },
          }),
        ),
      ),
    ],
  },
  {
    'count': 0,
    'index': 0,
    'limit': 5,
    'atk_scale': [2.4, 2.64, 2.88, 3.12, 3.36, 3.6, 3.84, 4.08, 4.32, 4.62, 4.98, 5.4],
    'poise': 10,
    'usp_1_display': 25,
    'usp_2_display': 30,
    'usp_3_display': 35,
  },
);

export const laevatainBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0016_laevat_attack1',
    timelineBlockFrames: 10,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([16, 18, 19, 21, 22, 24, 26, 27, 29, 31, 33, 36]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0016_laevat_attack111:actionOrder1:6'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.16, 0.18, 0.19, 0.21, 0.22, 0.24, 0.26, 0.27, 0.29, 0.31, 0.33, 0.36],
  },
);

export const laevatainBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0016_laevat_attack2',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0016_laevat_attack211:actionOrder1:5'),
        ),
      ),
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([12, 13, 14, 16, 17, 18, 19, 20, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0016_laevat_attack211:actionOrder2:12'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.12, 0.13, 0.14, 0.16, 0.17, 0.18, 0.19, 0.2, 0.22, 0.23, 0.25, 0.27],
    'display_atk_scale': [0.24, 0.26, 0.29, 0.31, 0.34, 0.36, 0.38, 0.41, 0.43, 0.46, 0.5, 0.54],
  },
);

export const laevatainBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0016_laevat_attack3',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([25, 28, 30, 33, 35, 38, 40, 43, 45, 48, 52, 56]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0016_laevat_attack311:actionOrder1:6'),
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
    'atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
    'atb': 0,
  },
);

export const laevatainBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0016_laevat_attack4',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([13, 14, 16, 17, 18, 20, 21, 22, 23, 25, 27, 29]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct23:chr_0016_laevat_attack411:actionOrder2:13'),
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
        12,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([13, 14, 16, 17, 18, 20, 21, 22, 23, 25, 27, 29]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile23:chr_0016_laevat_attack432:chr_0016_laevat_attack_5_projhit11:actionOrder1:41:1'),
        ),
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([13, 14, 16, 17, 18, 20, 21, 22, 23, 25, 27, 29]),
            tags: ['normalAttack'],
          }, '12:basicAttack410:projectile23:chr_0016_laevat_attack432:chr_0016_laevat_attack_5_projhit11:actionOrder1:71:1'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.13, 0.14, 0.16, 0.17, 0.18, 0.2, 0.21, 0.22, 0.23, 0.25, 0.27, 0.29],
    'display_atk_scale': [0.39, 0.43, 0.47, 0.51, 0.55, 0.59, 0.62, 0.66, 0.7, 0.75, 0.81, 0.88],
    'atb': 0,
  },
);

export const laevatainBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0016_laevat_attack5',
    timelineBlockFrames: 34,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 34, 37, 40, 42, 45, 48, 51, 55, 60]),
            tags: ['normalAttack'],
          }, '12:basicAttack56:direct23:chr_0016_laevat_attack511:actionOrder1:9'),
        ),
      ),
      scheduled(
        26,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([27, 29, 32, 34, 37, 40, 42, 45, 48, 51, 55, 60]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack56:direct23:chr_0016_laevat_attack511:actionOrder2:19'),
          branch(
            {
              kind: 'all',
              conditions: [
                { kind: 'singleEnemyPresent' },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'count' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'count': 0,
    'atb': 20,
    'atk_scale': [0.27, 0.29, 0.32, 0.34, 0.37, 0.4, 0.42, 0.45, 0.48, 0.51, 0.55, 0.6],
    'display_atk_scale': [0.53, 0.58, 0.64, 0.69, 0.74, 0.8, 0.85, 0.9, 0.95, 1.02, 1.1, 1.19],
    'poise': 18,
  },
);

export const laevatainFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0016_laevat_power_attack',
    timelineBlockFrames: 42,
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
        42,
      ),
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.2,
          }, '8:finisher6:direct28:chr_0016_laevat_power_attack11:actionOrder2:17'),
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
        42,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.8,
          }, '8:finisher6:direct28:chr_0016_laevat_power_attack11:actionOrder2:28'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const laevatainPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0016_laevat_plunging_attack_end',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0016_laevat_plunging_attack_end11:actionOrder1:4'),
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

export const laevatainBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0016_laevat_normal_skill',
    timelineBlockFrames: 118,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_has_max_energy',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        4,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0016_laevat_normal_skill',
                        dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            saveToContextKey: 'ball',
          }),
        ),
      ),
      scheduled(
        30,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_has_max_energy'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        37,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 215,
          }),
        ),
        51,
      ),
      scheduled(
        104,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_3',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_energy'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        104,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_fire_fire_burning_triggered',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'extra_scaling': { kind: 'blackboard', key: 'extra_scaling' },
            },
          }),
          step('modifyActionValue', {
            key: 'second_hit',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'second_hit' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
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
            attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct28:chr_0016_laevat_normal_skill11:actionOrder2:37'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'extra_usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        214,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 231,
          }),
        ),
        215,
      ),
    ],
  },
  {
    'second_hit': 0,
    'duration': 5,
    'extra_scaling': 1,
    'atk_scale': [0.62, 0.68, 0.75, 0.81, 0.87, 0.93, 0.99, 1.06, 1.12, 1.2, 1.29, 1.4],
    'atk_scale_2': [0.06, 0.07, 0.08, 0.08, 0.09, 0.09, 0.1, 0.11, 0.11, 0.12, 0.13, 0.14],
    'atk_scale_3': [3.42, 3.76, 4.1, 4.45, 4.79, 5.13, 5.47, 5.81, 6.16, 6.58, 7.1, 7.7],
    'count': 4,
    'extra_usp': 100,
    'poise': 10,
    'poise_extra': 10,
    'atb': 0,
    'ratio': 1,
  },
);

export const laevatainBattleSkillDuringUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkillDuringUltimate',
    sourceSkillId: 'chr_0016_laevat_normal_skill_during_ult',
    timelineBlockFrames: 33,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_has_max_energy',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_pause_ult',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            finishByAction: true,
          }),
        ),
        115,
      ),
      scheduled(
        13,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_common_energy_shard_attached_fire'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'triggered_burning' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'triggered_burning',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([147, 161, 176, 191, 205, 220, 235, 249, 264, 282, 304, 330]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '25:battleSkillDuringUltimate6:direct39:chr_0016_laevat_normal_skill_during_ult11:actionOrder2:43'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          step('modifyActionValue', {
            key: 'entered',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_energy',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
      ),
      scheduled(
        23,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_common_energy_shard_attached_fire'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'triggered_burning' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'triggered_burning',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([164, 181, 197, 214, 230, 247, 263, 279, 296, 316, 341, 370]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '25:battleSkillDuringUltimate6:direct39:chr_0016_laevat_normal_skill_during_ult11:actionOrder2:58'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          step('modifyActionValue', {
            key: 'entered',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
        ),
      ),
      scheduled(
        24,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 75,
            condition: {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0016_laevat_has_max_energy'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
          }),
        ),
        27,
      ),
      scheduled(
        39,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 196,
          }),
        ),
        40,
      ),
      scheduled(
        98,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_3',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_energy'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        98,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_fire_fire_burning_triggered',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'extra_scaling': { kind: 'blackboard', key: 'extra_scaling' },
            },
          }),
          step('modifyActionValue', {
            key: 'second_hit',
            operation: 'add',
            value: { kind: 'constant', value: 1 },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'second_hit' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb' },
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
            attackScale: { kind: 'blackboard', key: 'atk_scale_3' },
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '25:battleSkillDuringUltimate6:direct39:chr_0016_laevat_normal_skill_during_ult11:actionOrder2:72'),
        ),
      ),
      scheduled(
        195,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 270,
          }),
        ),
        196,
      ),
    ],
  },
  {
    'second_hit': 0,
    'triggered_burning': 0,
    'duration': 5,
    'extra_scaling': 1,
    'atk_scale': [1.47, 1.61, 1.76, 1.91, 2.05, 2.2, 2.35, 2.49, 2.64, 2.82, 3.04, 3.3],
    'atk_scale_2': [1.64, 1.81, 1.97, 2.14, 2.3, 2.47, 2.63, 2.79, 2.96, 3.16, 3.41, 3.7],
    'atk_scale_3': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
    'count': 4,
    'poise': 10,
    'poise_extra': 10,
    'atb': 0,
    'ratio': 1,
  },
);

export const laevatainUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0016_laevat_ultimate_skill',
    timelineBlockFrames: 74,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 300 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_ult_dash', 'buff_chr_0016_laevat_show_weapon', 'buff_chr_0016_laevat_ring_start_asset', 'buff_chr_0016_laevat_ult_dash', 'buff_chr_0016_laevat_ult_end', 'buff_chr_0016_laevat_ultimate_sfx_loop'],
            reason: 'other',
          }),
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
        61,
      ),
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_show_weapon',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
        ),
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
        73,
      ),
    ],
  },
  {
    'atk_scale': [2.7, 2.97, 3.24, 3.51, 3.78, 4.05, 4.32, 4.59, 4.86, 5.2, 5.6, 6.08],
    'count': 4,
    'duration': 15,
  },
);

export const laevatainUltimateAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack1',
    sourceSkillId: 'chr_0016_laevat_ult_attack1',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '15:ultimateAttack16:direct27:chr_0016_laevat_ult_attack111:actionOrder2:13'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'stopped' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'stopped',
                    operation: 'add',
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
    'stopped': 0,
    'atb': 0,
    'atk_scale': [0.65, 0.71, 0.78, 0.84, 0.91, 0.97, 1.04, 1.1, 1.17, 1.25, 1.34, 1.46],
    'ratio': 1,
  },
);

export const laevatainUltimateAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack2',
    sourceSkillId: 'chr_0016_laevat_ult_attack2',
    timelineBlockFrames: 27,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '15:ultimateAttack26:direct27:chr_0016_laevat_ult_attack211:actionOrder2:23'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'stopped1' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'stopped1',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '15:ultimateAttack26:direct27:chr_0016_laevat_ult_attack211:actionOrder2:36'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'stopped2' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'stopped2',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'stopped1': 0,
    'stopped2': 0,
    'atb': 0,
    'atk_scale': [0.41, 0.45, 0.49, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.78, 0.84, 0.91],
    'display_atk_scale': [0.81, 0.89, 0.97, 1.05, 1.13, 1.22, 1.3, 1.38, 1.46, 1.56, 1.68, 1.82],
    'ratio': 1,
  },
);

export const laevatainUltimateAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack3',
    sourceSkillId: 'chr_0016_laevat_ult_attack3',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
        ),
      ),
      scheduled(
        9,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '15:ultimateAttack36:direct27:chr_0016_laevat_ult_attack311:actionOrder2:13'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'stopped' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'stopped',
                    operation: 'add',
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
    'stopped': 0,
    'atb': 0,
    'atk_scale': [1.15, 1.27, 1.39, 1.5, 1.62, 1.73, 1.85, 1.96, 2.08, 2.22, 2.4, 2.6],
    'ratio': 1,
  },
);

export const laevatainUltimateAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimateAttack4',
    sourceSkillId: 'chr_0016_laevat_ult_attack4',
    timelineBlockFrames: 35,
    scheduledSequences: [
      scheduled(
        22,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'ratio' },
          }),
        ),
      ),
      scheduled(
        22,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '15:ultimateAttack46:direct27:chr_0016_laevat_ult_attack411:actionOrder2:22'),
        ),
      ),
      scheduled(
        26,
        sequence(
          step('applyElementalInfliction', { element: 'heat', isExtra: false }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 24,
          }, '15:ultimateAttack46:direct27:chr_0016_laevat_ult_attack411:actionOrder2:27'),
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'hit' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'singleEnemyPresent' },
              ],
            },
            sequence(
              step('modifyActionValue', {
                key: 'hit',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'stopped' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'stopped',
                    operation: 'add',
                    value: { kind: 'constant', value: 1 },
                  }),
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
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'hit': 0,
    'stopped': 0,
    'atb': 22,
    'atk_scale': [1.01, 1.11, 1.22, 1.32, 1.42, 1.52, 1.62, 1.72, 1.82, 1.95, 2.1, 2.28],
    'display_atk_scale': [2.03, 2.23, 2.43, 2.63, 2.84, 3.04, 3.24, 3.44, 3.65, 3.9, 4.2, 4.56],
    'poise': 24,
    'ratio': 1,
  },
);

export const laevatainGeneratedOperator: OperatorDefinition = {
  slug: 'laevatain',
  gameId: 'LAEVATAIN',
  rarity: 6,
  weaponType: 'sword',
  element: 'heat',
  role: 'striker',
  mainAttribute: 'intellect',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 36, 60, 85, 109, 121],
    agility: [9, 28, 49, 69, 89, 99],
    intellect: [22, 55, 90, 125, 160, 177],
    will: [9, 26, 44, 62, 80, 89],
    baseAttack: [30, 91, 156, 221, 285, 318],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [laevatainBasicAttack1, laevatainBasicAttack2, laevatainBasicAttack3, laevatainBasicAttack4, laevatainBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: laevatainFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: laevatainPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: laevatainBattleSkill, replacementSkills: [laevatainBattleSkillDuringUltimate] },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: [laevatainUltimate, laevatainUltimateAttack1, laevatainUltimateAttack2, laevatainUltimateAttack3, laevatainUltimateAttack4] },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: laevatainComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0016_laevat_ring_start_asset': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      skillSlotReplacements: [
        {
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkillDuringUltimate',
          revertedSkillKey: 'battleSkill',
          inheritOriginSkillCooldownProgress: false,
        },
      ],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_wpn_vfx'],
            reason: 'other',
          }),
        ),
      },
    },
    'buff_chr_0016_laevat_ult_end': {
      stackingType: 'extend',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 15,
      },
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_ring_start_asset', 'buff_chr_0016_laevat_ultimate_sfx_loop'],
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
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
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
    'buff_chr_0016_laevat_show_weapon': {
      stackingType: 'extend',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 15,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      applyTagIds: [-388303696],
      blackboard: {
        'duration': 16,
      },
      sustainedProtection: {
        target: 'owner',
        superArmor: 25,
        impactResistance: 100,
      },
      lifecycleSequences: {
        start: sequence(
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_ring_start_asset',
              target: 'caster',
              inheritSourceSkillCastInfo: true,
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_ult_end',
              target: 'caster',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
        finish: sequence(
          step('adjustSkillCooldown', {
            target: 'caster',
            skill: { kind: 'type', skillType: 'ultimate' },
            operation: 'set',
            basis: 'absoluteSeconds',
            value: { kind: 'constant', value: 10 },
          }),
        ),
      },
      abilityEventResponses: [
        {
          event: 'finishedBuff',
          priority: 0,
          sequence: sequence(
            branch(
              { kind: 'eventBuffIdMatch', buffIds: ['buff_chr_0016_laevat_pause_ult'] },
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
    'buff_chr_0016_laevat_hide_wpn_vfx': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      lifecycleSequences: {
        start: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_wpn_vfx'],
            reason: 'other',
          }),
        ),
      },
    },
    'buff_chr_0016_laevat_ignore_fire_resist': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
      blackboard: {
        'ignore_fire_resist': 0,
        'ignore_fire_resist_duration': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          processors: [
            {
              kind: 'instantAttribute',
              targetSide: 'defender',
              attribute: 'FireResistance',
              values: {
                slot: 'baseAddition',
                value: { blackboardKey: 'ignore_fire_resist' },
              },
              attributeTiming: 'runtime',
            },
          ],
        },
      ],
    },
    'buff_chr_0016_laevat_energy_icon_5': {
      stackingType: 'unlimited',
      priority: 5,
      maxStackCount: 5,
      blackboard: {
        'duration': 0,
        'ignore_fire_resist': 0,
        'ignore_fire_resist_duration': 0,
      },
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
            },
          }),
        ),
      },
    },
    'buff_chr_0016_laevat_energy': {
      stackingType: 'enhance',
      priority: 0,
      maxStackCount: { blackboardKey: 'max_stack' },
      blackboard: {
        'count': 0,
        'duration': 0,
        'ignore': 0,
        'ignore_fire_resist': 0,
        'ignore_fire_resist_duration': 0,
        'max_stack': 4,
      },
      lifecycleSequences: {
        start: sequence(
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
            desiredKey: 'ignore_fire_resist',
            outputKey: 'ignore_fire_resist',
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
            desiredKey: 'ignore_fire_resist_duration',
            outputKey: 'ignore_fire_resist_duration',
          }),
        ),
        finish: sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
            reason: 'other',
          }),
        ),
        enhanceChanged: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'blackboard', key: 'max_stack' },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy_icon_5',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                  'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                },
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      },
    },
    'buff_chr_0016_laevat_combo_skill_hit_self': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
      scheduledSequences: [
        scheduled(
          21,
          sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_energy',
              target: 'caster',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ],
    },
    'buff_chr_0016_laevat_combo_skill_usp': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 3,
      blackboard: {
        'count': 0,
        'usp_1': 25,
        'usp_2': 5,
        'usp_3': 5,
        'usp_4': 0,
      },
      lifecycleSequences: {
        start: sequence(
          step('readBuffStackCount', {
            target: 'caster',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_combo_skill_usp'] },
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'count' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'usp_1' },
                recipient: 'caster',
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
                  step('changeResourceByActionValue', {
                    resource: 'ultimateEnergy',
                    amount: { kind: 'blackboard', key: 'usp_2' },
                    recipient: 'caster',
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
                      step('changeResourceByActionValue', {
                        resource: 'ultimateEnergy',
                        amount: { kind: 'blackboard', key: 'usp_3' },
                        recipient: 'caster',
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
                          step('changeResourceByActionValue', {
                            resource: 'ultimateEnergy',
                            amount: { kind: 'blackboard', key: 'usp_4' },
                            recipient: 'caster',
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
      },
    },
    'buff_chr_0016_laevat_combo_skill_hit': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: 0.7,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'atk_scale': 0,
        'poise': 0,
      },
      scheduledSequences: [
        scheduled(
          0,
          sequence(
            step('dealDamage', {
              damageType: 'heat',
              attackScale: { kind: 'blackboard', key: 'atk_scale' },
              tags: ['comboSkill'],
              features: ['canBreakWeakness'],
              stagger: { kind: 'blackboard', key: 'poise' },
            }, '36:buff_chr_0016_laevat_combo_skill_hit4:buff36:buff_chr_0016_laevat_combo_skill_hit11:actionOrder1:1'),
            step('finishBuffsByTag', {
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [-1110095722],
              reason: 'early',
            }),
            step('applyBuff', {
              buffId: 'buff_chr_0016_laevat_combo_skill_usp',
              target: 'caster',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ],
    },
    'buff_chr_0016_laevat_combo_skill_start': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 2,
      triggerIntervalSeconds: { blackboardKey: 'trigger' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'atk_scale': 0,
        'poise': 0,
        'trigger': 1,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0016_laevat_combo_skill_hit',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'poise': { kind: 'blackboard', key: 'poise' },
              'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
            },
          }),
        ),
      },
    },
    'buff_chr_0016_laevat_has_max_energy': {
      stackingType: 'unlimited',
      priority: 1,
      maxStackCount: 5,
      durationSeconds: 2,
      blackboard: {
        'duration': 0,
      },
    },
    'buff_chr_0016_laevat_pause_ult': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
    },
    'buff_chr_0016_laevat_potential_5': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'curr_duration': 0,
        'extend_duration': 0,
        'max_duration': 0,
      },
      abilityEventResponses: [
        {
          event: 'afterKillEntity',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'curr_duration' },
                  operator: 'less',
                  right: { kind: 'blackboard', key: 'max_duration' },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'curr_duration',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extend_duration' },
                  }),
                  sequence(
                    step('applyBuff', {
                      buffId: 'buff_chr_0016_laevat_ult_end',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'extend_duration' },
                      },
                    }),
                    step('applyBuff', {
                      buffId: 'buff_chr_0016_laevat_show_weapon',
                      target: 'caster',
                      inheritSourceSkillCastInfo: true,
                      blackboardAssignments: {
                        'duration': { kind: 'blackboard', key: 'extend_duration' },
                      },
                    }),
                  ),
                ),
              ),
            ),
        },
        {
          event: 'finishedBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffIdMatch',
                  buffIds: ['buff_chr_0016_laevat_ring_start_asset'],
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'curr_duration',
                    operation: 'assign',
                    value: { kind: 'constant', value: 0 },
                  }),
                ),
              ),
            ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0016_laevat_normal_skill': { lifetime: { kind: 'limited', durationSeconds: 5 }, childSkill: {
        skillId: 'chr_0016_laevat_normal_skill_abilityentity',
        blackboard: {
          'atk_scale': 3,
          'atk_scale_2': 0,
          'atk_scale_3': 0,
          'hit_count': 0,
          'poise': 0,
        },
        scheduledSequences: [
          scheduled(
            18,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder1:3'),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
            ),
          ),
          scheduled(
            25,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:11'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            29,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:19'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            33,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:27'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            37,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:35'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            41,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:43'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            45,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:51'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            50,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:59'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            54,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:67'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            58,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:75'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
          scheduled(
            62,
            sequence(
              step('dealDamage', {
                damageType: 'heat',
                attackScale: { kind: 'blackboard', key: 'atk_scale_2' },
                tags: ['normalSkill'],
              }, '85:abilityentity_chr_0016_laevat_normal_skill:chr_0016_laevat_normal_skill_abilityentity13:abilityEntity42:chr_0016_laevat_normal_skill_abilityentity11:actionOrder2:83'),
              step('modifyActionValue', {
                key: 'hit_count',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('applyBuff', {
                buffId: 'buff_chr_0016_laevat_energy',
                definition: {
                  stackingType: 'enhance',
                  priority: 0,
                  maxStackCount: { blackboardKey: 'max_stack' },
                  blackboard: {
                    'count': 0,
                    'duration': 0,
                    'ignore': 0,
                    'ignore_fire_resist': 0,
                    'ignore_fire_resist_duration': 0,
                    'max_stack': 4,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist',
                        outputKey: 'ignore_fire_resist',
                      }),
                      step('readBuffBlackboard', {
                        target: 'caster',
                        query: { kind: 'id', buffIds: ['buff_chr_0016_laevat_passive'] },
                        desiredKey: 'ignore_fire_resist_duration',
                        outputKey: 'ignore_fire_resist_duration',
                      }),
                    ),
                    finish: sequence(
                      step('finishBuffsById', {
                        target: 'caster',
                        buffIds: ['buff_chr_0016_laevat_energy_icon_5'],
                        reason: 'other',
                      }),
                    ),
                    enhanceChanged: sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'count' },
                          operator: 'equal',
                          right: { kind: 'blackboard', key: 'max_stack' },
                        },
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0016_laevat_energy_icon_5',
                            definition: {
                              stackingType: 'unlimited',
                              priority: 5,
                              maxStackCount: 5,
                              blackboard: {
                                'duration': 0,
                                'ignore_fire_resist': 0,
                                'ignore_fire_resist_duration': 0,
                              },
                              lifecycleSequences: {
                                start: sequence(
                                  step('applyBuff', {
                                    buffId: 'buff_chr_0016_laevat_ignore_fire_resist',
                                    definition: {
                                      stackingType: 'stack',
                                      priority: 0,
                                      maxStackCount: 1,
                                      durationSeconds: { blackboardKey: 'ignore_fire_resist_duration' },
                                      blackboard: {
                                        'ignore_fire_resist': 0,
                                        'ignore_fire_resist_duration': 0,
                                      },
                                      damageModifiers: [
                                        {
                                          enabledSide: 'attacker',
                                          processors: [
                                            {
                                              kind: 'instantAttribute',
                                              targetSide: 'defender',
                                              attribute: 'FireResistance',
                                              values: {
                                                slot: 'baseAddition',
                                                value: { blackboardKey: 'ignore_fire_resist' },
                                              },
                                              attributeTiming: 'runtime',
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                    target: 'caster',
                                    inheritSourceSkillCastInfo: true,
                                    blackboardAssignments: {
                                      'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                                      'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                                    },
                                  }),
                                ),
                              },
                            },
                            target: 'caster',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'ignore_fire_resist': { kind: 'blackboard', key: 'ignore_fire_resist' },
                              'ignore_fire_resist_duration': { kind: 'blackboard', key: 'ignore_fire_resist_duration' },
                            },
                          }),
                        ),
                        undefined,
                        { alwaysNext: true },
                      ),
                    ),
                  },
                },
                target: 'caster',
                inheritSourceSkillCastInfo: true,
              }),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
          ),
        ],
    } },
  },
  talents: [
    {
      key: 'talent1',
      levels: 3,
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
          skillKey: 'battleSkill',
          blackboardKey: 'atb',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'atb',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['intellect'],
          value: 20,
        },
        { kind: 'addStaticDamageIncrease', target: 'normalAttack', value: 0.15 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'duration',
          operation: 'multiply',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkill',
          blackboardKey: 'extra_scaling',
          operation: 'assign',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'duration',
          operation: 'multiply',
          value: 1.5,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          skillKey: 'battleSkillDuringUltimate',
          blackboardKey: 'extra_scaling',
          operation: 'assign',
          value: 1.5,
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
          skillKey: 'ultimateAttack1',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'ultimateAttack2',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'ultimateAttack3',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          skillKey: 'ultimateAttack4',
          blackboardKey: 'ratio',
          operation: 'assign',
          value: 1.2,
        },
      ],
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0016_laevat_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'extend_duration': { kind: 'constant', value: 1 },
            'max_duration': { kind: 'constant', value: 7 },
          },
        }),
      ),
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }] },
};
