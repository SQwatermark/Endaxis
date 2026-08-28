/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentage, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const endministratorComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0003_endminf_combo_skill',
    timelineBlockFrames: 23,
    cooldownFrames: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 450],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.867000043 },
            slot: "unassigned",
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        23,
      ),
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(),
            sequence(
              step('startTimeDilation', {
                scope: 'entity',
                durationSeconds: { kind: 'constant', value: 0.15 },
                slot: "TimeDilation/Layer/Entity/HitStop",
                priority: 30,
                curve: { kind: 'inline', keys: [{ time: 0, value: 0.05, inTangent: 0.000489342, outTangent: 0.000489342, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 0.6112276, value: 0.03604198, inTangent: 0.3674083, outTangent: 0.3674083, weightedMode: 0, inWeight: 0, outWeight: 0 }, { time: 1, value: 1, inTangent: 4.44, outTangent: 4.44, weightedMode: 0, inWeight: 0, outWeight: 0 }] },
                finishByAction: false,
                targets: ['caster'],
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          branch(
            { kind: 'singleEnemyPresent' },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentage(0),
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
              }, '10:comboSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[2]11:actionOrder2:36'),
              step('applyBuff', {
                buffId: 'buff_common_originum_frozen',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'duration': { kind: 'blackboard', key: 'duration' },
                  'atk_scale_trigger': { kind: 'blackboard', key: 'atk_scale_trigger' },
                  'originum_ult_break_scale': { kind: 'blackboard', key: 'originum_ult_break_scale' },
                },
              }),
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([45, 49, 54, 58, 62, 67, 71, 76, 80, 86, 93, 100]),
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '10:comboSkill11:conditional18:timelineActions[3]19:_sequenceActionData10:actionData3:[1]14:succeedActions10:actionData3:[4]11:actionOrder2:38'),
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.45, 0.49, 0.54, 0.58, 0.62, 0.67, 0.71, 0.76, 0.8, 0.86, 0.93, 1],
    'atk_scale_trigger': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'duration': [4, 4, 4, 4, 4, 4, 4, 4, 4, 4.5, 4.5, 5],
    'originum_ult_break_scale': [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    'poise': 10,
    'usp': 10,
  },
);

export const endministratorBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0003_endminf_attack1',
    timelineBlockFrames: 9,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([23, 25, 27, 29, 32, 34, 36, 39, 41, 44, 47, 51]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct24:chr_0003_endminf_attack111:actionOrder1:4'),
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
    'atk_scale': [0.23, 0.25, 0.27, 0.29, 0.32, 0.34, 0.36, 0.39, 0.41, 0.44, 0.47, 0.51],
  },
);

export const endministratorBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0003_endminf_attack2',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([27, 30, 32, 35, 38, 41, 43, 46, 49, 52, 56, 61]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct24:chr_0003_endminf_attack211:actionOrder1:5'),
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

export const endministratorBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0003_endminf_attack3',
    timelineBlockFrames: 17,
    scheduledSequences: [
      scheduled(
        5,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct24:chr_0003_endminf_attack311:actionOrder2:10'),
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
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
            stagger: 0,
          }, '12:basicAttack36:direct24:chr_0003_endminf_attack311:actionOrder2:17'),
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
    'display_atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.63, 0.68],
  },
);

export const endministratorBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0003_endminf_attack4',
    timelineBlockFrames: 32,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0003_endminf_attack411:actionOrder2:13'),
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
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0003_endminf_attack411:actionOrder2:20'),
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
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0003_endminf_attack411:actionOrder2:36'),
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
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([9, 10, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct24:chr_0003_endminf_attack411:actionOrder2:27'),
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
    'atk_scale': [0.09, 0.1, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19],
    'display_atk_scale': [0.35, 0.38, 0.41, 0.45, 0.48, 0.52, 0.55, 0.59, 0.62, 0.67, 0.72, 0.78],
  },
);

export const endministratorBasicAttack5: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack5',
    sourceSkillId: 'chr_0003_endminf_attack5',
    timelineBlockFrames: 25,
    scheduledSequences: [
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([40, 44, 48, 52, 56, 60, 64, 68, 72, 77, 83, 90]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 18,
          }, '12:basicAttack56:direct24:chr_0003_endminf_attack511:actionOrder1:7'),
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
      scheduled(
        18,
        sequence(
          step('finishBuffsById', {
            target: 'enemy',
            buffIds: ['buff_chr_0003_endminf_attack4'],
            reason: 'other',
          }),
        ),
      ),
    ],
  },
  {
    'isHitbyMain': 0,
    'atb': 20,
    'atk_scale': [0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.77, 0.83, 0.9],
    'poise': 18,
  },
);

export const endministratorFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0003_endminf_power_attack2',
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
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.1,
          }, '8:finisher6:direct30:chr_0003_endminf_power_attack211:actionOrder2:16'),
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
        27,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct30:chr_0003_endminf_power_attack211:actionOrder2:28'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const endministratorPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0003_endminf_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct36:chr_0003_endminf_plunging_attack_end11:actionOrder1:4'),
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

export const endministratorBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0003_endminf_normal_skill',
    timelineBlockFrames: 24,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0003_endminf_potential1'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'enemy',
                  buffIds: ['buff_common_originum_frozen'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_returned' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('readBuffBlackboard', {
                target: 'caster',
                query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential1'] },
                desiredKey: 'atb_return',
                outputKey: 'atb_return',
              }),
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
                  applyTags: ["Skill/Character/Common/NoGuard"],
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
                  applyTags: ["Skill/Character/Common/PhysicalStatus/CrushStatus"],
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
                                slot: "TimeDilation/Layer/Entity/HitStop",
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
                                    slot: "TimeDilation/Layer/Entity/HitStop",
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
                                        slot: "TimeDilation/Layer/Entity/HitStop",
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
                                            slot: "TimeDilation/Layer/Entity/HitStop",
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
                                                slot: "TimeDilation/Layer/Entity/HitStop",
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
                ignoreHitEffect: false,
              }),
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'atb_return' },
                recipient: 'team',
                spGainKind: 'refund',
                spGainSource: 'skill',
              }),
              step('modifyActionValue', {
                key: 'has_returned',
                operation: 'assign',
                value: { kind: 'constant', value: 1 },
              }),
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([156, 171, 187, 202, 218, 234, 249, 265, 280, 300, 323, 350]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[5]11:actionOrder2:75'),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'trigger' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 0 },
                },
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
            sequence(
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
                  applyTags: ["Skill/Character/Common/NoGuard"],
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
                  applyTags: ["Skill/Character/Common/PhysicalStatus/CrushStatus"],
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
                                slot: "TimeDilation/Layer/Entity/HitStop",
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
                                    slot: "TimeDilation/Layer/Entity/HitStop",
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
                                        slot: "TimeDilation/Layer/Entity/HitStop",
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
                                            slot: "TimeDilation/Layer/Entity/HitStop",
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
                                                slot: "TimeDilation/Layer/Entity/HitStop",
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
                ignoreHitEffect: false,
              }),
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([156, 171, 187, 202, 218, 234, 249, 265, 280, 300, 323, 350]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '11:battleSkill11:conditional18:timelineActions[9]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:83'),
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'trigger' },
                  operator: 'lessOrEqual',
                  right: { kind: 'constant', value: 0 },
                },
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
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        11,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        11,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0003_endminf_potential5'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0003_endminf_potential5_trigger'],
                  operator: 'lessOrEqual',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0003_endminf_potential5_trigger',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
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
    'atb_return': 0,
    'has_returned': 0,
    'trigger': 0,
    'atk_scale': [1.56, 1.71, 1.87, 2.02, 2.18, 2.34, 2.49, 2.65, 2.8, 3, 3.23, 3.5],
    'poise': 10,
  },
);

export const endministratorUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0003_endminf_ultimate_skill',
    timelineBlockFrames: 56,
    cooldownFrames: 300,
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
        44,
      ),
      scheduled(
        50,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([356, 391, 427, 462, 498, 533, 569, 604, 640, 684, 738, 800]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 25,
          }, '8:ultimate6:direct31:chr_0003_endminf_ultimate_skill11:actionOrder2:31'),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'enemy',
              buffIds: ['buff_common_originum_frozen'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([267, 294, 320, 347, 374, 400, 427, 454, 480, 514, 554, 600]),
                tags: ['ultimateSkill'],
              }, '8:ultimate11:conditional18:timelineActions[5]19:_sequenceActionData10:actionData3:[3]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:35'),
              step('igniteBuffs', {
                target: 'enemy',
                source: 'caster',
                igniteType: 'EndminUlt',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        50,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0003_endminf_potential5'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0003_endminf_potential5_trigger'],
                  operator: 'lessOrEqual',
                  value: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0003_endminf_potential5_trigger',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
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
    'atk_scale': [3.56, 3.91, 4.27, 4.62, 4.98, 5.33, 5.69, 6.04, 6.4, 6.84, 7.38, 8],
    'originum_ult_break_scale': [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    'poise': 25,
  },
);

export const endministratorGeneratedOperator: OperatorDefinition = {
  slug: 'endministrator',
  gameId: 'ENDMINISTRATOR',
  rarity: 6,
  weaponType: 'sword',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [14, 38, 62, 86, 111, 123],
    agility: [14, 41, 69, 98, 126, 140],
    intellect: [9, 28, 47, 67, 87, 96],
    will: [10, 31, 53, 74, 96, 107],
    baseAttack: [30, 92, 157, 222, 287, 319],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [endministratorBasicAttack1, endministratorBasicAttack2, endministratorBasicAttack3, endministratorBasicAttack4, endministratorBasicAttack5] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: endministratorFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: endministratorPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: endministratorBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: endministratorUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: endministratorComboSkill },
  ],
  skillAliases: [{ from: ['basicAttackMale', 'basicAttackMale1'], to: ['basicAttack', 'basicAttack1'] }, { from: ['basicAttackMale', 'basicAttackMale2'], to: ['basicAttack', 'basicAttack2'] }, { from: ['basicAttackMale', 'basicAttackMale3'], to: ['basicAttack', 'basicAttack3'] }, { from: ['basicAttackMale', 'basicAttackMale4'], to: ['basicAttack', 'basicAttack4'] }, { from: ['basicAttackMale', 'basicAttackMale5'], to: ['basicAttack', 'basicAttack5'] }, { from: ['basicAttackFemale', 'basicAttackFemale1'], to: ['basicAttack', 'basicAttack1'] }, { from: ['basicAttackFemale', 'basicAttackFemale2'], to: ['basicAttack', 'basicAttack2'] }, { from: ['basicAttackFemale', 'basicAttackFemale3'], to: ['basicAttack', 'basicAttack3'] }, { from: ['basicAttackFemale', 'basicAttackFemale4'], to: ['basicAttack', 'basicAttack4'] }, { from: ['basicAttackFemale', 'basicAttackFemale5'], to: ['basicAttack', 'basicAttack5'] }, { from: ['finisherMale', 'finisherMale'], to: ['finisher', 'finisher'] }, { from: ['finisherFemale', 'finisherFemale'], to: ['finisher', 'finisher'] }, { from: ['plungingAttackMale', 'plungingAttackMale'], to: ['plungingAttack', 'plungingAttack'] }, { from: ['plungingAttackFemale', 'plungingAttackFemale'], to: ['plungingAttack', 'plungingAttack'] }, { from: ['battleSkill', 'battleSkillFemale'], to: ['battleSkill', 'battleSkill'] }, { from: ['ultimate', 'ultimateFemale'], to: ['ultimate', 'ultimate'] }, { from: ['comboSkill', 'comboSkillFemale'], to: ['comboSkill', 'comboSkill'] }],
  buffDefinitions: {
    'buff_chr_0003_endminf_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0003_endminf_talent_1_tirgger': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
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
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'atk_up': 0.1,
        'duration': 10,
      },
      attributeModifiers: [
        {
          attribute: 'Atk',
          slot: 'baseMultiplier',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    'buff_chr_0003_endminf_potential5_trigger': {
      stackingType: 'unlimited',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.1,
    },
    'buff_chr_0003_endminf_talent_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atk_up': 0.15,
        'duration': 15,
      },
    },
    'buff_chr_0003_endminf_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'dmg': 0,
      },
      damageModifiers: [
        {
          enabledSide: 'attacker',
          condition: {
            kind: 'all',
            conditions: [
              {
                kind: 'eventDamageTypesMatch',
                damageTypes: ['physical'],
              },
              {
                kind: 'buffIdCountCompare',
                target: 'enemy',
                buffIds: ['buff_common_originum_frozen'],
                operator: 'greaterOrEqual',
                value: 1,
              },
            ],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'normal',
              addition: { blackboardKey: 'dmg' },
            },
          ],
        },
      ],
    },
    'buff_chr_0003_endminf_talent_0_aura': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'dmg': 0,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_0',
            target: 'party',
            inheritSourceSkillCastInfo: false,
            finishByAction: true,
            blackboardAssignments: {
              'dmg': { kind: 'blackboard', key: 'dmg' },
            },
          }),
        ),
      },
    },
    'buff_chr_0003_endminf_potential1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'atb_return': 50,
      },
    },
    'buff_chr_0003_endminf_potential2': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'ratio': 0.5,
      },
    },
    'buff_chr_0003_endminf_potential3': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'usp': 15,
      },
    },
    'buff_chr_0003_endminf_potential5': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'cd_minus': 0,
      },
      abilityEventResponses: [
        {
          event: 'addedBuff',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventBuffIdMatch',
                  buffIds: ['buff_chr_0003_endminf_potential5_trigger'],
                },
                sequence(
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0003_endminf_combo_skill' },
                    operation: 'reduce',
                    basis: 'absoluteSeconds',
                    value: { kind: 'blackboard', key: 'cd_minus' },
                  }),
                  step('adjustSkillCooldown', {
                    target: 'caster',
                    skill: { kind: 'id', skillId: 'chr_0002_endminm_combo_skill' },
                    operation: 'reduce',
                    basis: 'absoluteSeconds',
                    value: { kind: 'blackboard', key: 'cd_minus' },
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
      modifiers: [],
      passiveSkills: [
        {
          key: 'buff_chr_0003_endminf_talent_1',
          blackboard: {
            'atk_up': [0.15, 0.3],
            'duration': [15, 15],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0003_endminf_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'atk_up': { kind: 'blackboard', key: 'atk_up' },
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
      modifiers: [],
      passiveSkills: [
        {
          key: 'chr_0003_endminf_talent_0',
          blackboard: {
            'dmg': [0.1, 0.2],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0003_endminf_talent_0_aura',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'dmg': { kind: 'blackboard', key: 'dmg' },
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'atb_return': { kind: 'constant', value: 50 },
          },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential2',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'ratio': { kind: 'constant', value: 0.5 },
          },
        }),
      ),
    },
    {
      key: 'potential3',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential3',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'usp': { kind: 'constant', value: 15 },
          },
        }),
      ),
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['agility'],
          value: 25,
        },
        { kind: 'modifyBasePanelStat', stat: 'health', operation: 'percent', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0003_endminf_potential5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'cd_minus': { kind: 'constant', value: 2 },
          },
        }),
      ),
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
