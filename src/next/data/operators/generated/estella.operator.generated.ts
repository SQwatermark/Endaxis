/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const estellaBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    timelineBlockFrames: 13,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([25, 28, 30, 33, 35, 38, 40, 43, 45, 48, 52, 56]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0021_whiten_attack111:actionOrder1:6'),
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
    'atk_scale': [0.25, 0.28, 0.3, 0.33, 0.35, 0.38, 0.4, 0.43, 0.45, 0.48, 0.52, 0.56],
  },
);

export const estellaBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([30, 33, 36, 39, 42, 45, 48, 51, 54, 58, 62, 68]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0021_whiten_attack211:actionOrder1:4'),
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
    'atk_scale': [0.3, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.58, 0.62, 0.68],
  },
);

export const estellaBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    timelineBlockFrames: 28,
    scheduledSequences: [
      scheduled(
        7,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([15, 17, 18, 20, 21, 23, 24, 26, 27, 29, 31, 34]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0021_whiten_attack311:actionOrder1:5'),
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
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([20, 22, 24, 26, 28, 30, 32, 34, 36, 39, 42, 45]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0021_whiten_attack311:actionOrder2:13'),
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
    'atk_scale': [0.15, 0.17, 0.18, 0.2, 0.21, 0.23, 0.24, 0.26, 0.27, 0.29, 0.31, 0.34],
    'atk_scale2': [0.2, 0.22, 0.24, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39, 0.42, 0.45],
    'display_atk_scale': [0.35, 0.39, 0.42, 0.46, 0.49, 0.53, 0.56, 0.6, 0.63, 0.67, 0.73, 0.79],
  },
);

export const estellaBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    timelineBlockFrames: 46,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([40, 44, 48, 52, 56, 60, 64, 68, 72, 77, 83, 90]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 17,
          }, '12:basicAttack46:direct23:chr_0021_whiten_attack411:actionOrder1:9'),
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
    'atb': 19,
    'atk_scale': [0.4, 0.44, 0.48, 0.52, 0.56, 0.6, 0.64, 0.68, 0.72, 0.77, 0.83, 0.9],
    'poise': 17,
  },
);

export const estellaFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    timelineBlockFrames: 30,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('applyBuff', {
            buffId: 'buff_common_damage_immune_medium',
            definition: {
              stackingType: 'unlimited',
              priority: 0,
              maxStackCount: 0,
              durationSeconds: { blackboardKey: 'duration' },
              applyTagIds: [782082172, -104052028, -886962248],
              blackboard: {
                'duration': 9999,
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
        30,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 1,
          }, '8:finisher6:direct28:chr_0021_whiten_power_attack11:actionOrder2:20'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const estellaPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0021_whiten_plunging_attack_end11:actionOrder1:2'),
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

export const estellaBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    timelineBlockFrames: 46,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        21,
        sequence(
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0021_whiten_talent_0_active'] },
            desiredKey: 'atb',
            outputKey: 'atb',
          }),
          step('changeResourceByActionValue', {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atb' },
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'default',
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0021_whiten_talent_0_active'],
            reason: 'other',
          }),
        ),
      ),
      scheduled(
        21,
        sequence(
          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_first_hit' },
              operator: 'equal',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'EntityBB_first_hit',
                operation: 'add',
                value: { kind: 'constant', value: 1 },
              }),
              step('modifyActionValue', {
                key: 'up_atk_scale',
                operation: 'assign',
                value: { kind: 'blackboard', key: 'atk_scale' },
              }),
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: { kind: 'blackboard', key: 'up_atk_scale' },
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]6:action10:actionData3:[0]14:succeedActions10:actionData3:[2]11:actionOrder1:9'),
              step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'cryo',
                attackScale: percentages([156, 171, 187, 202, 218, 234, 249, 265, 280, 300, 323, 350]),
                tags: ['normalSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '11:battleSkill11:conditional18:timelineActions[1]19:_sequenceActionData10:actionData3:[2]6:action10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:14'),
            ),
          ),
        ),
      ),
    ],
  },
  {
    'atk_scale': [1.56, 1.71, 1.87, 2.02, 2.18, 2.34, 2.49, 2.65, 2.8, 3, 3.23, 3.5],
    'poise': 10,
  },
);

export const estellaComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    timelineBlockFrames: 20,
    cooldownFrames: [540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 540, 510],
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
          branch(
            {
              kind: 'entityTagMatch',
              target: 'enemy',
              tagQueryType: 'hasAny',
              tagIds: [1535684437],
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'has_potential1' },
                  operator: 'greaterOrEqual',
                  right: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'duration',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'rate_plus' },
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                    definition: {
                      stackingType: 'stack',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 3,
                        'rate': -0.3,
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
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'blackboard', key: 'duration' },
                      'rate': { kind: 'blackboard', key: 'rate' },
                    },
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: percentages([280, 308, 336, 364, 392, 420, 448, 476, 504, 539, 581, 630]),
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: 10,
                  }, '10:comboSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[3]11:actionOrder2:27'),
                ),
                sequence(
                  step('applyBuff', {
                    buffId: 'buff_chr_0021_whiten_combo_skill_physical_vulnerable',
                    definition: {
                      stackingType: 'stack',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: { blackboardKey: 'duration' },
                      blackboard: {
                        'duration': 3,
                        'rate': -0.3,
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
                    target: 'enemy',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'duration': { kind: 'blackboard', key: 'duration' },
                      'rate': { kind: 'blackboard', key: 'rate' },
                    },
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: percentages([280, 308, 336, 364, 392, 420, 448, 476, 504, 539, 581, 630]),
                    tags: ['comboSkill'],
                    features: ['canBreakWeakness'],
                    stagger: 10,
                  }, '10:comboSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[2]11:actionOrder2:31'),
                ),
              ),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([160, 176, 192, 208, 224, 240, 256, 272, 288, 308, 332, 360]),
                tags: ['comboSkill'],
                features: ['canBreakWeakness'],
                stagger: 10,
              }, '10:comboSkill11:conditional18:timelineActions[7]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]11:failActions10:actionData3:[1]11:actionOrder2:34'),
            ),
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
    'duration': 6,
    'has_potential1': 0,
    'rate_plus': -0.1,
    'atk_scale': [1.6, 1.76, 1.92, 2.08, 2.24, 2.4, 2.56, 2.72, 2.88, 3.08, 3.32, 3.6],
    'atk_scale2': [2.8, 3.08, 3.36, 3.64, 3.92, 4.2, 4.48, 4.76, 5.04, 5.39, 5.81, 6.3],
    'poise': 10,
    'rate': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.15, 0.15, 0.15],
    'usp': 10,
  },
);

export const estellaUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    timelineBlockFrames: 60,
    cooldownFrames: 300,
    costs: [{ resource: 'ultimateEnergy', value: 70 }],
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
        30,
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
        54,
      ),
      scheduled(
        54,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'atk_scale' },
          }),
          step('modifyActionValue', {
            key: 'atk_scale_total',
            operation: 'add',
            value: { kind: 'blackboard', key: 'dmg_up_total' },
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_total' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
          }, '8:ultimate6:direct30:chr_0021_whiten_ultimate_skill11:actionOrder2:29'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4.89, 5.38, 5.86, 6.35, 6.84, 7.33, 7.82, 8.31, 8.8, 9.41, 10.14, 11],
    'poise': [15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20],
  },
);

export const estellaGeneratedOperator: OperatorDefinition = {
  slug: 'estella',
  gameId: 'ESTELLA',
  rarity: 4,
  weaponType: 'polearm',
  element: 'cryo',
  role: 'guard',
  mainAttribute: 'will',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [13, 32, 53, 73, 94, 104],
    agility: [8, 27, 47, 67, 87, 97],
    intellect: [14, 34, 56, 78, 99, 110],
    will: [15, 44, 74, 105, 136, 151],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [estellaBasicAttack1, estellaBasicAttack2, estellaBasicAttack3, estellaBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: estellaFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: estellaPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: estellaBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: estellaUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: estellaComboSkill },
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
          skillGroupKey: 'comboSkill',
          blackboardKey: 'has_potential1',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'comboSkill',
          blackboardKey: 'rate_plus',
          operation: 'assign',
          value: 3,
        },
      ],
    },
    {
      key: 'potential2',
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
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'distance',
          operation: 'assign',
          value: 12,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'dmg_up',
          operation: 'assign',
          value: 0.4,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['will', 'strength'],
          value: 10,
        },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [],
    },
  ],
  conversionSupport: { completeness: 'partial', missingCapabilities: [{ capability: 'talentEffects' }, { capability: 'potentialEffects' }, { capability: 'skillBehavior', skillGroupKeys: ['ultimate'] }] },
};
