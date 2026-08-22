/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, once, percentage, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const snowshineBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0014_aurora_attack1',
    timelineBlockFrames: 32,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([55, 61, 66, 72, 77, 83, 88, 94, 99, 106, 114, 124]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0014_aurora_attack111:actionOrder1:4'),
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
    'atk_scale': [0.55, 0.61, 0.66, 0.72, 0.77, 0.83, 0.88, 0.94, 0.99, 1.06, 1.14, 1.24],
  },
);

export const snowshineBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0014_aurora_attack2',
    timelineBlockFrames: 28,
    scheduledSequences: [
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([59, 64, 70, 76, 82, 88, 94, 99, 105, 113, 121, 132]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0014_aurora_attack211:actionOrder1:4'),
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
    'atk_scale': [0.59, 0.64, 0.7, 0.76, 0.82, 0.88, 0.94, 0.99, 1.05, 1.13, 1.21, 1.32],
  },
);

export const snowshineBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0014_aurora_attack3',
    timelineBlockFrames: 61,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale1',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.4 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale1' },
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0014_aurora_attack311:actionOrder2:17'),
        ),
      ),
      scheduled(
        39,
        sequence(
          step('calculateActionValue', {
            key: 'atk_scale2',
            operation: 'multiply',
            left: { kind: 'blackboard', key: 'atk_scale' },
            right: { kind: 'constant', value: 0.6 },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale2' },
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 23,
          }, '12:basicAttack36:direct23:chr_0014_aurora_attack311:actionOrder2:27'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  once(
                    'do-once:timelineActions[15]._sequenceActionData.actionData.[3].succeedActions.actionData.[0].succeedActions.actionData.[2]',
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
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 25,
    'atk_scale': [1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.93, 2.08, 2.25],
    'poise': 23,
  },
);

export const snowshineFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0014_aurora_power_attack',
    timelineBlockFrames: 41,
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
        75,
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
        41,
      ),
      scheduled(
        41,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct28:chr_0014_aurora_power_attack11:actionOrder1:5'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const snowshinePlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0014_aurora_plunging_attack_end',
    timelineBlockFrames: 21,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0014_aurora_plunging_attack_end11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const snowshineBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0014_aurora_normal_skill',
    timelineBlockFrames: 135,
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
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_1' },
              operator: 'greaterOrEqual',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_potential_1_listener',
                target: 'party',
                inheritSourceSkillCastInfo: false,
                finishByAction: true,
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
        51,
      ),
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-52-0',
                  event: { kind: 'operatorHit' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'eventDamageFeaturesMatch',
                        match: 'exceptAny',
                        features: ['dot', 'remainArea'],
                      },
                      sequence(
                        step('jumpTimeline', { destinationFrame: 107 }),
                      ),
                    ),
                  ),
                },
            ],
          }),
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-52-0',
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
                            step('jumpTimeline', { destinationFrame: 107 }),
                          ),
                        ),
                      ),
                    ),
                  ),
                },
            ],
          }),
        ),
        51,
      ),
      scheduled(
        106,
        sequence(
          step('finishTimeline', {}),
        ),
      ),
      scheduled(
        107,
        sequence(
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent_2_sup' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('changeResourceByActionValue', {
                resource: 'ultimateEnergy',
                amount: { kind: 'blackboard', key: 'talent_2_sup' },
                recipient: 'caster',
              }),
            ),
            undefined,
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        107,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_reduce_damage',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 1 },
              'taken_dmg': { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentage(1),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct28:chr_0014_aurora_normal_skill11:actionOrder2:83'),
        ),
      ),
      scheduled(
        107,
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
        110,
      ),
      scheduled(
        125,
        sequence(
          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
          once(
            'do-once:timelineActions[25]._sequenceActionData.actionData.[1]',
            sequence(
              step('changeResourceByActionValue', {
                resource: 'sp',
                amount: { kind: 'blackboard', key: 'potential_5_atb' },
                recipient: 'team',
                spGainKind: 'refund',
                spGainSource: 'skill',
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([200, 220, 240, 260, 280, 300, 320, 340, 360, 385, 415, 450]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 20,
          }, '11:battleSkill6:direct28:chr_0014_aurora_normal_skill11:actionOrder2:89'),
        ),
      ),
    ],
  },
  {
    'is_cam': 1,
    'potential_1': 0,
    'talent_2_sup': 0,
    'taken_dmg': 0.9,
    'atb_return_base': 30,
    'atk_scale': [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    'dmg_reduce': 0.9,
    'poise': 20,
    'potential_5_atb': 0,
  },
);

export const snowshineComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0014_aurora_combo_skill',
    timelineBlockFrames: 15,
    cooldownFrames: [750, 750, 750, 750, 750, 750, 750, 750, 720, 720, 720, 690],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.533 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        13,
      ),
      scheduled(
        12,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'usp' },
            recipient: 'caster',
          }),
        ),
      ),
      scheduled(
        12,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0014_aurora_combo_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
            target: 'enemy',
          }),
        ),
      ),
    ],
  },
  {
    'duration': 3,
    'heal_scale': [0.22, 0.27, 0.31, 0.36, 0.38, 0.4, 0.43, 0.45, 0.47, 0.48, 0.49, 0.5],
    'heal_scale_loop': [0.06, 0.07, 0.08, 0.09, 0.1, 0.1, 0.11, 0.11, 0.12, 0.12, 0.12, 0.13],
    'heal_static_value': [96, 115.2, 134.4, 153.6, 163.2, 172.8, 182.4, 192, 201.6, 206.4, 211.2, 216],
    'heal_static_value_loop': [24, 28.8, 33.6, 38.4, 40.8, 43.2, 45.6, 48, 50.4, 51.6, 52.8, 54],
    'interval': 0.5,
    'trigger_hp_ratio': 0.6,
    'usp': 10,
  },
);

export const snowshineUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0014_aurora_ultimate_skill',
    timelineBlockFrames: 71,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 80 }],
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
        60,
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
        90,
      ),
      scheduled(
        62,
        sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: percentages([200, 220, 240, 260, 280, 300, 320, 340, 360, 385, 415, 450]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
          }, '8:ultimate11:conditional18:timelineActions[6]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:12'),
        ),
      ),
      scheduled(
        62,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_2' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0014_aurora_ultimate_skill',
                dieWhenSourceDies: false,
                inheritActionBlackboard: true,
              }),
            ),
            sequence(
              step('spawnAbilityEntity', {
                abilityEntityId: 'abilityentity_chr_0014_aurora_ultimate_skill',
                definition: { lifetime: { kind: 'limited', durationSeconds: 8 }, childSkill: {
                  skillId: 'chr_0014_aurora_ultimate_skill_abilityrange',
                  blackboard: {
                    'atk_scale': 4,
                    'atk_scale_loop': 1,
                    'extra_duration': 0,
                    'frozen_level': 1,
                  },
                  scheduledSequences: [
                    scheduled(
                      4,
                      sequence(
                        sequence(
                          step('applyBuff', {
                            buffId: 'buff_chr_0014_aurora_ultimate_skill_frost',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            finishByAction: true,
                            blackboardAssignments: {
                              'extra_duration': { kind: 'blackboard', key: 'extra_duration' },
                            },
                          }),
                          step('applyBuff', {
                            buffId: 'buff_chr_0014_aurora_ultimate_skill_dmg',
                            target: 'enemy',
                            inheritSourceSkillCastInfo: true,
                            finishByAction: true,
                            blackboardAssignments: {
                              'atk_scale_loop': { kind: 'blackboard', key: 'atk_scale_loop' },
                            },
                          }),
                        ),
                      ),
                      157,
                    ),
                  ],
                } },
                dieWhenSourceDies: false,
                inheritActionBlackboard: true,
              }),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'potential_2': 0,
    'atk_scale': [2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.4, 3.6, 3.85, 4.15, 4.5],
    'atk_scale_loop': [0.29, 0.32, 0.35, 0.37, 0.4, 0.43, 0.46, 0.49, 0.52, 0.55, 0.6, 0.65],
    'duration': 5,
    'forst_allow_count': 2,
    'interval': 0.5,
    'poise': [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
    'extra_duration': 0,
  },
);

export const snowshineGeneratedOperator: OperatorDefinition = {
  slug: 'snowshine',
  gameId: 'SNOWSHINE',
  rarity: 5,
  weaponType: 'greatsword',
  element: 'cryo',
  role: 'defender',
  mainAttribute: 'strength',
  secondaryAttribute: 'will',
  attributes: {
    strength: [18, 47, 78, 108, 139, 154],
    agility: [12, 32, 52, 73, 94, 104],
    intellect: [9, 27, 46, 65, 84, 93],
    will: [10, 31, 53, 75, 97, 108],
    baseAttack: [30, 87, 147, 207, 267, 297],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [snowshineBasicAttack1, snowshineBasicAttack2, snowshineBasicAttack3] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: snowshineFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: snowshinePlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: snowshineBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: snowshineComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: snowshineUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0014_aurora_potential_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0.05,
      },
    },
    'buff_chr_0014_aurora_potential_1_listener': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 9999,
      },
      abilityEventResponses: [
        {
          event: 'beforeTakeSpellInfliction',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'caster',
                  tagQueryType: 'hasAny',
                  tagIds: [-1957150384],
                },
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0014_aurora_potential_1',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                  }),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0014_aurora_reduce_damage_remain': {
      stackingType: 'refresh',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 0.5,
        'potential_1': 0,
        'taken_dmg': 0.1,
      },
      sustainedProtection: {
        target: 'owner',
        superArmor: 30,
        impactResistance: 100,
      },
    },
    'buff_chr_0014_aurora_reduce_damage': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      applyTagIds: [1483840340],
      blackboard: {
        'duration': 9999,
        'potential_1': 0,
        'taken_dmg': 0.1,
      },
      sustainedProtection: {
        target: 'owner',
        superArmor: 30,
        impactResistance: 100,
      },
      lifecycleSequences: {
        finish: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0014_aurora_reduce_damage_remain',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'constant', value: 0.5 },
              'potential_1': { kind: 'blackboard', key: 'potential_1' },
              'taken_dmg': { kind: 'blackboard', key: 'taken_dmg' },
            },
          }),
        ),
      },
    },
    'buff_chr_0014_aurora_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0014_aurora_ultimate_skill_frost': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      triggerIntervalSeconds: 2,
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'duration': 5,
        'extra_duration': 0,
        'frozen_level': 1,
      },
      lifecycleSequences: {
        enable: sequence(
          step('startTimeDilation', {
            scope: 'entity',
            durationSeconds: { kind: 'constant', value: 2 },
            slot: -1855252810,
            priority: 50,
            curve: { kind: 'inline', keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: -1, outTangent: -1, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
            finishByAction: true,
            targets: ['caster'],
          }),
        ),
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_common_cryst_cryst_frozen_triggered',
            target: 'enemy',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'extra_duration': { kind: 'blackboard', key: 'extra_duration' },
            },
          }),
        ),
      },
    },
    'buff_chr_0014_aurora_ultimate_skill_dmg': {
      stackingType: 'highPriority',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 5,
      triggerIntervalSeconds: 0.5,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale_loop': 0.1,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('dealDamage', {
            damageType: 'cryo',
            attackScale: { kind: 'blackboard', key: 'atk_scale_loop' },
            tags: ['ultimateSkill'],
          }, '49:buff_chr_0014_aurora_ultimate_skill_dmg:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
        ),
      },
    },
    'buff_chr_0014_aurora_talent_0': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'heal_up': 0.1,
        'rate': 0.5,
      },
      healModifiers: [
        {
          enabledSide: 'healer',
          condition: {
            kind: 'targetHealthCompare',
            valueType: 'ratio',
            operator: 'lessOrEqual',
            value: { blackboardKey: 'rate' },
          },
          processors: [
            {
              kind: 'modifyCalculationResult',
              timing: 'afterCalculation',
              baseMultiplier: { blackboardKey: 'heal_up' },
              multiplierCount: 1,
            },
          ],
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0014_aurora_combo_skill': { lifetime: { kind: 'limited', durationSeconds: 3 }, childSkill: {
        skillId: 'chr_0014_aurora_combo_skill_abilityrange',
        blackboard: {
          'duration': 0,
          'heal_scale': 1,
          'heal_scale_loop': 1,
          'heal_static_value': 0,
          'heal_static_value_loop': 0,
          'interval': 0,
        },
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_combo_skill_heal',
                definition: {
                  stackingType: 'unique',
                  priority: 0,
                  maxStackCount: 0,
                  durationSeconds: 0.1,
                  blackboard: {
                    'heal_scale': 1,
                    'heal_static_value': 0,
                  },
                  lifecycleSequences: {
                    start: sequence(
                      step('heal', {
                        target: 'buffOwner',
                        alwaysNext: true,
                        attribute: 'will',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'heal_static_value' },
                        tagIds: [-1517158118],
                      }),
                    ),
                  },
                },
                target: 'partyExceptCaster',
                inheritSourceSkillCastInfo: false,
                finishByAction: true,
                blackboardAssignments: {
                  'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                  'heal_static_value': { kind: 'blackboard', key: 'heal_static_value' },
                },
              }),
            ),
            3,
          ),
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0014_aurora_combo_skill_heal_loop',
                definition: {
                  stackingType: 'unique',
                  priority: 0,
                  maxStackCount: 0,
                  durationSeconds: { blackboardKey: 'duration' },
                  triggerIntervalSeconds: { blackboardKey: 'interval' },
                  waitFirstTriggerInterval: true,
                  maxTriggerCount: 999,
                  blackboard: {
                    'duration': 0,
                    'heal_scale_loop': 0,
                    'heal_static_value_loop': 0,
                    'interval': 0,
                  },
                  lifecycleSequences: {
                    trigger: sequence(
                      step('heal', {
                        target: 'buffOwner',
                        alwaysNext: true,
                        attribute: 'will',
                        multiplier: { kind: 'blackboard', key: 'heal_scale_loop' },
                        addition: { kind: 'blackboard', key: 'heal_static_value_loop' },
                        tagIds: [-1517158118],
                      }),
                    ),
                  },
                },
                target: 'partyExceptCaster',
                inheritSourceSkillCastInfo: false,
                finishByAction: true,
                blackboardAssignments: {
                  'heal_scale_loop': { kind: 'blackboard', key: 'heal_scale_loop' },
                  'heal_static_value_loop': { kind: 'blackboard', key: 'heal_static_value_loop' },
                  'duration': { kind: 'blackboard', key: 'duration' },
                  'interval': { kind: 'blackboard', key: 'interval' },
                },
              }),
            ),
            900,
          ),
          scheduled(
            90,
            sequence(
              step('finishCurrentAbilityEntity', {}),
            ),
          ),
        ],
    } },
    'abilityentity_chr_0014_aurora_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 8 }, childSkill: {
        skillId: 'chr_0014_aurora_ultimate_skill_abilityrange_potential2',
        blackboard: {
          'atk_scale': 4,
          'atk_scale_loop': 1,
          'extra_duration': 0,
          'frozen_level': 1,
        },
        scheduledSequences: [
          scheduled(
            4,
            sequence(
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_frost',
                  definition: {
                    stackingType: 'stack',
                    priority: 0,
                    maxStackCount: 1,
                    durationSeconds: { blackboardKey: 'duration' },
                    triggerIntervalSeconds: 2,
                    waitFirstTriggerInterval: true,
                    maxTriggerCount: 1,
                    blackboard: {
                      'duration': 5,
                      'extra_duration': 0,
                      'frozen_level': 1,
                    },
                    lifecycleSequences: {
                      enable: sequence(
                        step('startTimeDilation', {
                          scope: 'entity',
                          durationSeconds: { kind: 'constant', value: 2 },
                          slot: -1855252810,
                          priority: 50,
                          curve: { kind: 'inline', keys: [{ time: 0, value: 1, inTangent: -1, outTangent: -1, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: -1, outTangent: -1, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
                          finishByAction: true,
                          targets: ['caster'],
                        }),
                      ),
                      trigger: sequence(
                        step('applyBuff', {
                          buffId: 'buff_common_cryst_cryst_frozen_triggered',
                          definition: {
                            stackingType: 'unlimited',
                            priority: 0,
                            maxStackCount: 1,
                            durationSeconds: 3,
                            blackboard: {
                              'consumed_layer': 0,
                              'consumed_type': 2,
                              'count': 1,
                              'duration': 0,
                              'extra_duration': 0,
                            },
                            lifecycleSequences: {
                              start: sequence(
                                step('modifyActionValue', {
                                  key: 'duration',
                                  operation: 'add',
                                  value: { kind: 'blackboard', key: 'extra_duration' },
                                }),
                                step('applyBuff', {
                                  buffId: 'buff_common_cryst_cryst_frozen_triggered_do',
                                  definition: {
                                    stackingType: 'stack',
                                    presentation: {
                                      visible: true,
                                      iconId: 'icon_battle_frozen',
                                      showInHeadBarCommon: true,
                                      showInHeadBarAttached: false,
                                      showInSquadIcon: false,
                                      onlyShowForMainCharacter: false,
                                      iconStyleInSquad: 'SpellAbnormal',
                                      abnormalColorType: 'Cryst',
                                      orderPriority: {
                                        useDirectoryValue: false,
                                        value: 0,
                                        category: 'AttachedAndAbnormal',
                                      },
                                    },
                                    stackingKey: 'cryst_triggered',
                                    priority: 0,
                                    maxStackCount: 1,
                                    durationSeconds: { blackboardKey: 'duration' },
                                    triggerIntervalSeconds: 1,
                                    waitFirstTriggerInterval: true,
                                    maxTriggerCount: 1,
                                    applyTagIds: [1535684437],
                                    blackboard: {
                                      'count': 1,
                                      'duration': 5,
                                      'final_phy_dmg_up': 0,
                                      'phy_dmg_up': 0.2,
                                    },
                                    lifecycleSequences: {
                                      enable: sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_common_frozen',
                                          definition: {
                                            stackingType: 'stack',
                                            priority: 0,
                                            maxStackCount: 1,
                                            durationSeconds: { blackboardKey: 'duration' },
                                            blackboard: {
                                              'duration': 9999,
                                            },
                                            lifecycleSequences: {
                                              enable: sequence(
                                                step('applyBuff', {
                                                  buffId: 'buff_common_do_frozen',
                                                  definition: {
                                                    stackingType: 'stack',
                                                    priority: 0,
                                                    maxStackCount: 1,
                                                    durationSeconds: { blackboardKey: 'duration' },
                                                    applyTagIds: [-717418722, 889346577],
                                                    blackboard: {
                                                      'duration': 9999,
                                                    },
                                                    lifecycleSequences: {
                                                      enable: sequence(
                                                        step('startTimeDilation', {
                                                          scope: 'entity',
                                                          durationSeconds: { kind: 'blackboard', key: 'duration' },
                                                          slot: -1855252810,
                                                          priority: 50,
                                                          curve: { kind: 'inline', keys: [{ time: 0, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0, outWeight: 0.333333343 }, { time: 1, value: 0, inTangent: 0, outTangent: 0, weightedMode: 0, inWeight: 0.333333343, outWeight: 0 }] },
                                                          finishByAction: true,
                                                          targets: ['caster'],
                                                        }),
                                                      ),
                                                    },
                                                  },
                                                  target: 'enemy',
                                                  inheritSourceSkillCastInfo: true,
                                                  blackboardAssignments: {
                                                    'duration': { kind: 'blackboard', key: 'duration' },
                                                  },
                                                }),
                                              ),
                                            },
                                          },
                                          target: 'enemy',
                                          inheritSourceSkillCastInfo: true,
                                          blackboardAssignments: {
                                            'duration': { kind: 'blackboard', key: 'duration' },
                                          },
                                        }),
                                      ),
                                      start: sequence(
                                        step('applyBuff', {
                                          buffId: 'buff_common_cryst_triggered_start',
                                          definition: {
                                            stackingType: 'unlimited',
                                            priority: 0,
                                            maxStackCount: 1,
                                            durationSeconds: 3,
                                            triggerIntervalSeconds: 0,
                                            waitFirstTriggerInterval: false,
                                            maxTriggerCount: 1,
                                          },
                                          target: 'enemy',
                                          inheritSourceSkillCastInfo: true,
                                        }),
                                        step('storeSourceAttributeValue', {
                                          attribute: { kind: 'specific', key: 'cryoAbnormalDamageIncrease' },
                                          stage: 'finalNonConverted',
                                          useFloor: false,
                                          divisor: { kind: 'constant', value: 1 },
                                          multiplier: { kind: 'blackboard', key: 'phy_dmg_up' },
                                          base: { kind: 'blackboard', key: 'phy_dmg_up' },
                                          targetKey: 'final_phy_dmg_up',
                                        }),
                                        step('applyBuff', {
                                          buffId: 'buff_common_cryst_triggered_fx',
                                          definition: {
                                            stackingType: 'unlimited',
                                            priority: 0,
                                            maxStackCount: 0,
                                            durationSeconds: 5,
                                            triggerIntervalSeconds: 0,
                                            waitFirstTriggerInterval: true,
                                            maxTriggerCount: 1,
                                          },
                                          target: 'enemy',
                                          inheritSourceSkillCastInfo: true,
                                        }),
                                      ),
                                    },
                                  },
                                  target: 'enemy',
                                  inheritSourceSkillCastInfo: true,
                                  blackboardAssignments: {
                                    'count': { kind: 'blackboard', key: 'count' },
                                    'duration': { kind: 'blackboard', key: 'duration' },
                                    'consumed_type': { kind: 'blackboard', key: 'consumed_type' },
                                    'consumed_layer': { kind: 'blackboard', key: 'consumed_layer' },
                                  },
                                }),
                              ),
                            },
                          },
                          target: 'enemy',
                          inheritSourceSkillCastInfo: true,
                          blackboardAssignments: {
                            'extra_duration': { kind: 'blackboard', key: 'extra_duration' },
                          },
                        }),
                      ),
                    },
                  },
                  target: 'enemy',
                  inheritSourceSkillCastInfo: true,
                  finishByAction: true,
                  blackboardAssignments: {
                    'extra_duration': { kind: 'blackboard', key: 'extra_duration' },
                  },
                }),
                step('applyBuff', {
                  buffId: 'buff_chr_0014_aurora_ultimate_skill_dmg',
                  definition: {
                    stackingType: 'highPriority',
                    priority: 0,
                    maxStackCount: 1,
                    durationSeconds: 5,
                    triggerIntervalSeconds: 0.5,
                    waitFirstTriggerInterval: true,
                    maxTriggerCount: -1,
                    blackboard: {
                      'atk_scale_loop': 0.1,
                    },
                    lifecycleSequences: {
                      trigger: sequence(
                        step('dealDamage', {
                          damageType: 'cryo',
                          attackScale: { kind: 'blackboard', key: 'atk_scale_loop' },
                          tags: ['ultimateSkill'],
                        }, '49:buff_chr_0014_aurora_ultimate_skill_dmg:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
                      ),
                    },
                  },
                  target: 'enemy',
                  inheritSourceSkillCastInfo: true,
                  finishByAction: true,
                  blackboardAssignments: {
                    'atk_scale_loop': { kind: 'blackboard', key: 'atk_scale_loop' },
                  },
                }),
              ),
            ),
            156,
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
          key: 'buff_chr_0014_aurora_talent_0',
          blackboard: {
            'heal_up': [0.15, 0.25],
            'rate': [0.45, 0.55],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0014_aurora_talent_0',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'heal_up': { kind: 'blackboard', key: 'heal_up' },
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
          skillGroupKey: 'battleSkill',
          blackboardKey: 'talent_2_sup',
          operation: 'assign',
          value: [6, 10],
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
          blackboardKey: 'potential_1',
          operation: 'assign',
          value: 1,
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
          blackboardKey: 'potential_2',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'potential_2_range',
          operation: 'assign',
          value: 0.2,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'ultimate',
          blackboardKey: 'extra_duration',
          operation: 'add',
          value: 2,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['will'],
          value: 20,
        },
        { kind: 'modifyBasePanelStat', stat: 'defense', operation: 'flat', value: 20 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_atb',
          operation: 'assign',
          value: 10,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
