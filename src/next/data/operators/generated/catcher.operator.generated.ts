/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, once, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const catcherBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0020_meurs_attack1',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([35, 39, 42, 46, 49, 53, 56, 60, 63, 67, 73, 79]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct22:chr_0020_meurs_attack111:actionOrder1:8'),
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
    'atk_scale': [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.67, 0.73, 0.79],
  },
);

export const catcherBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0020_meurs_attack2',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([39, 42, 46, 50, 54, 58, 62, 65, 69, 74, 80, 87]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct22:chr_0020_meurs_attack211:actionOrder1:9'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
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
    'atb': 0,
    'atk_scale': [0.39, 0.42, 0.46, 0.5, 0.54, 0.58, 0.62, 0.65, 0.69, 0.74, 0.8, 0.87],
  },
);

export const catcherBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0020_meurs_attack3',
    timelineBlockFrames: 28,
    scheduledSequences: [
      scheduled(
        16,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([54, 59, 65, 70, 76, 81, 86, 92, 97, 104, 112, 122]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct22:chr_0020_meurs_attack311:actionOrder1:6'),
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
    'atk_scale': [0.54, 0.59, 0.65, 0.7, 0.76, 0.81, 0.86, 0.92, 0.97, 1.04, 1.12, 1.22],
  },
);

export const catcherBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0020_meurs_attack4',
    timelineBlockFrames: 45,
    scheduledSequences: [
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([71, 78, 85, 92, 99, 107, 114, 121, 128, 137, 147, 160]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 22,
          }, '12:basicAttack46:direct22:chr_0020_meurs_attack411:actionOrder1:8'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              once(
                'do-once:timelineActions[6]._sequenceActionData.actionData.[2].succeedActions.actionData.[2]',
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 25,
    'atk_scale': [0.71, 0.78, 0.85, 0.92, 0.99, 1.07, 1.14, 1.21, 1.28, 1.37, 1.47, 1.6],
    'poise': 22,
  },
);

export const catcherFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0020_meurs_power_attack',
    timelineBlockFrames: 35,
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
        35,
      ),
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
        75,
      ),
      scheduled(
        15,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.4,
          }, '8:finisher6:direct27:chr_0020_meurs_power_attack11:actionOrder2:17'),
        ),
      ),
      scheduled(
        35,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.6,
          }, '8:finisher6:direct27:chr_0020_meurs_power_attack11:actionOrder2:28'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const catcherPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0020_meurs_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0020_meurs_plunging_attack_end11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const catcherBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0020_meurs_normal_skill',
    timelineBlockFrames: 95,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb_return_base' },
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'default',
          }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-46-0',
                  event: { kind: 'operatorHit' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'eventDamageFeaturesMatch',
                        match: 'exceptAny',
                        features: ['dot', 'remainArea'],
                      },
                      sequence(
                        step('jumpTimeline', { destinationFrame: 60 }),
                      ),
                    ),
                  ),
                },
            ],
          }),
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-46-0',
                  event: { kind: 'buffApplied' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'eventBuffIdMatch',
                        buffIds: ['buff_eny_0018_lbtough_pre_catch'],
                      },
                      sequence(
                        branch(
                          { kind: 'singleEnemyPresent' },
                          sequence(
                            step('jumpTimeline', { destinationFrame: 60 }),
                          ),
                        ),
                      ),
                    ),
                  ),
                },
            ],
          }),
        ),
        60,
      ),
      scheduled(
        45,
        sequence(
          step('jumpTimeline', {
            destinationFrame: 255,
          }),
        ),
        46,
      ),
      scheduled(
        60,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
      scheduled(
        60,
        sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 0.7 },
            slot: 1464849466,
            priority: 10,
            curve: { kind: 'inline', keys: [{ time: 0, value: 0.3, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 0.5, value: 0.3, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0.333333343 }, { time: 1, value: 1, inTangent: 4.596606, outTangent: 4.596606, weightedMode: 0, inWeight: 0.0243593454, outWeight: 0 }] },
            finishByAction: false,
            targets: ['caster'],
            abilityEntityTargets: [{ kind: 'context', contextKey: 'tar' }],
          }),
        ),
        63,
      ),
      scheduled(
        83,
        sequence(
          step('applyBuff', {
            buffId: 'buff_physical_no_guard',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
          }),
          once(
            'do-once:timelineActions[25]._sequenceActionData.actionData.[1]',
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential5_atb' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('changeResourceByActionValue', {
                    resource: 'sp',
                    amount: { kind: 'blackboard', key: 'potential5_atb' },
                    recipient: 'team',
                    spGainKind: 'refund',
                    spGainSource: 'skill',
                  }),
                ),
              ),
            ),
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 285, 302, 320, 342, 369, 400]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '11:battleSkill6:direct27:chr_0020_meurs_normal_skill11:actionOrder2:80'),
        ),
      ),
      scheduled(
        194,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
    ],
  },
  {
    'is_cam': 1,
    'potential5_atb': 0,
    'atb_return_base': 30,
    'atk_scale': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.85, 3.02, 3.2, 3.42, 3.69, 4],
    'poise': 20,
    'taken_dmg': 0.9,
  },
);

export const catcherComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0020_meurs_combo_skill',
    timelineBlockFrames: 24,
    cooldownFrames: [1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 1050, 990],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.567000031 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        14,
      ),
      scheduled(
        17,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([25, 27, 30, 32, 34, 37, 39, 42, 44, 47, 51, 55]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct26:chr_0020_meurs_combo_skill11:actionOrder2:11'),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([100, 110, 120, 130, 140, 150, 160, 170, 180, 193, 208, 225]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct26:chr_0020_meurs_combo_skill11:actionOrder2:16'),
        ),
      ),
      scheduled(
        20,
        sequence(
          step('modifyActionValue', {
            key: 'shield_duration',
            operation: 'add',
            value: { kind: 'blackboard', key: 'potential3_duration' },
          }),
          branch(
            { kind: 'casterControlled' },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0020_meurs_combo_skill_shield',
                target: 'casterAndLowestHealthRatioOperatorExceptCaster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'shield_def_rate': { kind: 'blackboard', key: 'shield_def_rate' },
                  'shield_base': { kind: 'blackboard', key: 'shield_base' },
                  'duration': { kind: 'blackboard', key: 'shield_duration' },
                },
              }),
            ),
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0020_meurs_combo_skill_shield',
                target: 'casterAndControlledOperator',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'shield_def_rate': { kind: 'blackboard', key: 'shield_def_rate' },
                  'shield_base': { kind: 'blackboard', key: 'shield_base' },
                  'duration': { kind: 'blackboard', key: 'shield_duration' },
                },
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [0.25, 0.27, 0.3, 0.32, 0.34, 0.37, 0.39, 0.42, 0.44, 0.47, 0.51, 0.55],
    'atk_scale_1': [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.93, 2.08, 2.25],
    'poise': 10,
    'shield_base': [360, 432, 504, 576, 612, 648, 684, 720, 756, 774, 792, 810],
    'shield_def_rate': [2.25, 2.7, 3.15, 3.6, 3.825, 4.05, 4.275, 4.5, 4.725, 4.84, 4.95, 5.06],
    'shield_duration': 10,
    'trigger_hp_ratio': 0.4,
    'usp': 10,
    'potential3_duration': 0,
  },
);

export const catcherUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0020_meurs_ultimate_skill',
    timelineBlockFrames: 103,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
    costFrame: 9,
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
        38,
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
        120,
      ),
      scheduled(
        46,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0020_meurs_ult_weak',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'weak_scale': { kind: 'blackboard', key: 'weak_scale' },
              'weak_duration': { kind: 'blackboard', key: 'weak_duration' },
            },
          }),
        ),
      ),
      scheduled(
        46,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([89, 98, 107, 116, 125, 134, 143, 151, 160, 172, 185, 200]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '8:ultimate11:conditional19:timelineActions[13]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:17'),
        ),
      ),
      scheduled(
        64,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([120, 132, 144, 156, 168, 180, 192, 204, 216, 231, 249, 270]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 5,
          }, '8:ultimate11:conditional19:timelineActions[14]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:24'),
        ),
      ),
      scheduled(
        85,
        sequence(
          branch(
            {
              kind: 'healthCompare',
              target: 'enemy',
              valueType: 'current',
              operator: 'greater',
              value: { kind: 'constant', value: 0 },
            },
            sequence(
              step('outputKnockDown', { target: 'enemy' }),
            ),
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([178, 196, 213, 231, 249, 267, 284, 302, 320, 342, 369, 400]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '8:ultimate11:conditional19:timelineActions[15]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder2:32'),
        ),
      ),
      scheduled(
        102,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0020_meurs_talent_shockwave',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
    ],
  },
  {
    'weak_scale': [0.2, 0.2, 0.2, 0.2, 0.2, 0.25, 0.25, 0.25, 0.25, 0.3, 0.3, 0.3],
    'weak_duration': 8,
    'atk_scale': [0.89, 0.98, 1.07, 1.16, 1.25, 1.34, 1.43, 1.51, 1.6, 1.72, 1.85, 2],
    'atk_scale_1': [1.2, 1.32, 1.44, 1.56, 1.68, 1.8, 1.92, 2.04, 2.16, 2.31, 2.49, 2.7],
    'atk_scale_2': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'poise': 5,
    'poise1': 10,
    'poise_display': 20,
  },
);

export const catcherGeneratedOperator: OperatorDefinition = {
  slug: 'catcher',
  gameId: 'CATCHER',
  rarity: 4,
  weaponType: 'greatsword',
  element: 'physical',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [21, 54, 89, 124, 159, 176],
    agility: [9, 28, 47, 67, 87, 96],
    intellect: [8, 25, 42, 60, 77, 86],
    will: [11, 31, 53, 74, 96, 106],
    baseAttack: [30, 88, 148, 209, 270, 300],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [catcherBasicAttack1, catcherBasicAttack2, catcherBasicAttack3, catcherBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: catcherFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: catcherPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: catcherBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: catcherComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: catcherUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0020_meurs_combo_skill_shield': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_def_up',
        iconPath: '/icons/icon_battle_buff_def_up.webp',
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
        'duration': 10,
        'shield_base': 100,
        'shield_def_rate': 0.5,
      },
      shields: [
        {
          infinityValue: false,
          value: { attribute: 'Def', multiplier: { blackboardKey: 'shield_def_rate' }, addition: { blackboardKey: 'shield_base' } },
          absorbCount: -1,
          absorbAllDamageWhenConsumed: false,
          removeBuffWhenConsumed: true,
          priority: 'normal',
          replaceHitEffect: true,
          damageAbsorptions: [
          ],
        },
      ],
    },
    'buff_chr_0020_meurs_ult_weak': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'weak_duration' },
      blackboard: {
        'weak_duration': 0,
        'weak_scale': 0,
      },
    },
    'buff_chr_0020_meurs_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      triggerIntervalSeconds: 0.1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: 99999,
      blackboard: {
        'def_up': 0,
        'rate': 1,
      },
      attributeModifiers: [
        {
          attribute: 'Def',
          slot: 'baseAddition',
          value: { blackboardKey: 'def_up' },
        },
      ],
      lifecycleSequences: {
        trigger: sequence(
          step('storeSourceAttributeValue', {
            attribute: { kind: 'specific', key: 'will' },
            stage: 'finalNonConverted',
            useFloor: true,
            divisor: { kind: 'constant', value: 10 },
            multiplier: { kind: 'blackboard', key: 'rate' },
            base: { kind: 'constant', value: 0 },
            targetKey: 'def_up',
          }),
        ),
      },
    },
    'buff_chr_0020_meurs_potential_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 0,
      blackboard: {
        'def_scale': 1,
        'dmg_base': 100,
      },
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'eventDamageTagsMatch',
                  match: 'hasAny',
                  tags: ['normalSkill', 'ultimateSkill'],
                },
                sequence(
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'def_scale' },
                    tags: [],
                    calculation: 'attribute',
                    calculationAttribute: 'Def',
                    calculationAddition: { kind: 'blackboard', key: 'dmg_base' },
                  }, '46:buff_chr_0020_meurs_potential_1:outputDamage:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[3]11:actionOrder1:3'),
                ),
              ),
            ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0020_meurs_talent_shockwave': { lifetime: { kind: 'limited', durationSeconds: 2 }, childSkill: {
        skillId: 'chr_0020_meurs_talent_shockwave',
        blackboard: {
          'atb': 0,
          'atk_scale_shockwave': 0.42,
          'env_dmg': 20,
          'spawn_count': 0,
          'talent_1': 0,
        },
        scheduledSequences: [
          scheduled(
            3,
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                tags: ['ultimateSkill'],
              }, '77:abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave13:abilityEntity31:chr_0020_meurs_talent_shockwave11:actionOrder1:6'),
            ),
          ),
          scheduled(
            18,
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                tags: ['ultimateSkill'],
              }, '77:abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave13:abilityEntity31:chr_0020_meurs_talent_shockwave11:actionOrder1:8'),
            ),
          ),
          scheduled(
            33,
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale_shockwave' },
                tags: ['ultimateSkill'],
              }, '77:abilityentity_chr_0020_meurs_talent_shockwave:chr_0020_meurs_talent_shockwave13:abilityEntity31:chr_0020_meurs_talent_shockwave11:actionOrder2:10'),
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
          key: 'buff_chr_0020_meurs_talent_0',
          blackboard: {
            'rate': [1, 1.2],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0020_meurs_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'rate': { kind: 'blackboard', key: 'rate' },
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'talent_1',
          operation: 'assign',
          value: [1, 2],
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'atk_scale_shockwave',
          operation: 'assign',
          value: [0.3, 0.45],
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
          buffId: 'buff_chr_0020_meurs_potential_1',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'def_scale': { kind: 'constant', value: 5 },
            'dmg_base': { kind: 'constant', value: 300 },
          },
        }),
      ),
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['will'],
          value: 10,
        },
        { kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20 },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'potential3_duration',
          operation: 'assign',
          value: 5,
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential5_atb',
          operation: 'assign',
          value: 10,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
