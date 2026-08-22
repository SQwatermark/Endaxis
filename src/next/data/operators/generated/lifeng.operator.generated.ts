/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentage, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const lifengBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0015_lifeng_attack1',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        9,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([12, 13, 15, 16, 17, 18, 19, 21, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0015_lifeng_attack111:actionOrder1:7'),
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
        17,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([12, 13, 15, 16, 17, 18, 19, 21, 22, 23, 25, 27]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0015_lifeng_attack111:actionOrder2:15'),
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
    'atk_scale': [0.12, 0.13, 0.15, 0.16, 0.17, 0.18, 0.19, 0.21, 0.22, 0.23, 0.25, 0.27],
    'display_atk_scale': [0.24, 0.27, 0.29, 0.32, 0.34, 0.36, 0.39, 0.41, 0.44, 0.47, 0.5, 0.55],
  },
);

export const lifengBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0015_lifeng_attack2',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        4,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([29, 32, 35, 38, 41, 44, 47, 49, 52, 56, 60, 65]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0015_lifeng_attack211:actionOrder2:10'),
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
    'atk_scale': [0.29, 0.32, 0.35, 0.38, 0.41, 0.44, 0.47, 0.49, 0.52, 0.56, 0.6, 0.65],
  },
);

export const lifengBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0015_lifeng_attack3',
    timelineBlockFrames: 14,
    scheduledSequences: [
      scheduled(
        11,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([35, 39, 42, 46, 49, 53, 56, 60, 63, 67, 73, 79]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0015_lifeng_attack311:actionOrder1:6'),
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
    'display_atk_scale': [0.34, 0.37, 0.4, 0.44, 0.47, 0.5, 0.54, 0.57, 0.6, 0.64, 0.7, 0.75],
  },
);

export const lifengBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0015_lifeng_attack5',
    timelineBlockFrames: 35,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([18, 19, 21, 23, 25, 26, 28, 30, 32, 34, 36, 39]),
            tags: ['normalAttack'],
          }, '12:basicAttack46:direct23:chr_0015_lifeng_attack511:actionOrder2:15'),
        ),
      ),
      scheduled(
        24,
        sequence(
          branch(
            { kind: 'actionValueCompare', left: { kind: 'constant', value: 0 }, operator: 'equal', right: { kind: 'constant', value: 0 } },
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: percentages([50, 55, 60, 65, 70, 75, 80, 85, 90, 96, 104, 113]),
                tags: ['normalAttack', 'normalAttackLastCombo'],
                stagger: 19,
              }, '12:basicAttack411:conditional19:timelineActions[11]19:_sequenceActionData10:actionData3:[0]6:action10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:25'),
            ),
            undefined,
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentage(0),
            tags: [],
          }, '12:basicAttack46:direct23:chr_0015_lifeng_attack511:actionOrder2:30'),
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
    'atb': 21,
    'atk_scale': [0.18, 0.19, 0.21, 0.23, 0.25, 0.26, 0.28, 0.3, 0.32, 0.34, 0.36, 0.39],
    'atk_scale2': [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.96, 1.04, 1.13],
    'display_atk_scale': [0.68, 0.74, 0.81, 0.88, 0.95, 1.01, 1.08, 1.15, 1.22, 1.3, 1.4, 1.52],
    'poise': 19,
  },
);

export const lifengFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0015_lifeng_power_attack',
    timelineBlockFrames: 33,
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
        33,
      ),
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
        68,
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
          }, '8:finisher6:direct28:chr_0015_lifeng_power_attack11:actionOrder2:14'),
        ),
      ),
      scheduled(
        33,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct28:chr_0015_lifeng_power_attack11:actionOrder2:19'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const lifengPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0015_lifeng_plunging_attack_end',
    timelineBlockFrames: 26,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0015_lifeng_plunging_attack_end11:actionOrder1:3'),
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

export const lifengBattleSkill: SkillDefinition = withSkillBlackboard(
    {
      key: 'battleSkill',
      sourceSkillId: 'chr_0015_lifeng_normal_skill',
      timelineBlockFrames: 67,
      costs: [{ resource: 'sp', value: 100 }],
      costFrame: 0,
      scheduledSequences: [
        scheduled(
          7,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: percentages([38, 42, 46, 50, 53, 57, 61, 65, 69, 73, 79, 86]),
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            }, '11:battleSkill6:direct28:chr_0015_lifeng_normal_skill11:actionOrder2:62'),
          ),
        ),
        scheduled(
          20,
          sequence(
            step('dealDamage', {
              damageType: 'physical',
              attackScale: percentages([38, 42, 46, 50, 53, 57, 61, 65, 69, 73, 79, 86]),
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
            }, '11:battleSkill6:direct28:chr_0015_lifeng_normal_skill11:actionOrder2:68'),
          ),
        ),
        scheduled(
          54,
          sequence(
            branch(
              {
                kind: 'buffStackCompare',
                target: 'enemy',
                tagQueryType: 'hasAny',
                buffTagIds: [1075718177],
                operator: 'lessOrEqual',
                value: { kind: 'blackboard', key: 'num' },
              },
              sequence(
                step('applyBuff', {
                  buffId: 'buff_chr_0015_lifeng_purify',
                  target: 'enemy',
                  inheritSourceSkillCastInfo: true,
                  blackboardAssignments: {
                    'rate': { kind: 'blackboard', key: 'phy_resist_down' },
                    'duration': { kind: 'blackboard', key: 'duration' },
                  },
                }),
              ),
              undefined,
              { alwaysNext: true },
            ),
          ),
        ),
        scheduled(
          54,
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
              attackScale: percentages([119, 131, 143, 155, 167, 178, 190, 202, 214, 229, 247, 268]),
              tags: ['normalSkill'],
              features: ['canBreakWeakness'],
              stagger: 10,
            }, '11:battleSkill6:direct28:chr_0015_lifeng_normal_skill11:actionOrder2:74'),
            step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
          ),
        ),
      ],
    },
  {
    'num': 0,
    'atk_scale': [0.38, 0.42, 0.46, 0.5, 0.53, 0.57, 0.61, 0.65, 0.69, 0.73, 0.79, 0.86],
    'atk_scale2': [1.19, 1.31, 1.43, 1.55, 1.67, 1.78, 1.9, 2.02, 2.14, 2.29, 2.47, 2.68],
    'duration': 12,
    'phy_resist_down': [0.05, 0.05, 0.05, 0.05, 0.05, 0.07, 0.07, 0.07, 0.09, 0.1, 0.1, 0.12],
    'poise': 10,
  },
);

export const lifengComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0015_lifeng_combo_skill',
    timelineBlockFrames: 50,
    cooldownFrames: [480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 480, 450],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            { kind: 'casterControlled' },
            sequence(
              branch(
                { kind: 'singleEnemyPresent' },
                sequence(
                  step('modifyActionValue', {
                    key: 'main_near',
                    operation: 'assign',
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
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.933 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        25,
      ),
      scheduled(
        19,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([47, 51, 56, 61, 65, 70, 75, 79, 84, 90, 97, 105]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '10:comboSkill6:direct27:chr_0015_lifeng_combo_skill11:actionOrder2:63'),
        ),
      ),
      scheduled(
        48,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0015_lifeng_combo_skill_tutorial_marker',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          }),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([167, 183, 200, 217, 233, 250, 267, 283, 300, 321, 346, 375]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct27:chr_0015_lifeng_combo_skill11:actionOrder2:76'),
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
    'main_near': 0,
    'atk_scale': [0.47, 0.51, 0.56, 0.61, 0.65, 0.7, 0.75, 0.79, 0.84, 0.9, 0.97, 1.05],
    'atk_scale2': [1.67, 1.83, 2, 2.17, 2.33, 2.5, 2.67, 2.83, 3, 3.21, 3.46, 3.75],
    'duration': 20,
    'poise': 10,
    'usp': 10,
  },
);

export const lifengUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0015_lifeng_ultimate_skill',
    timelineBlockFrames: 66,
    cooldownFrames: 450,
    costs: [{ resource: 'ultimateEnergy', value: 90 }],
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
        56,
      ),
      scheduled(
        1,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_isCombo' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'isCombo',
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
        58,
        sequence(
          step('spawnAbilityEntity', {
            abilityEntityId: 'abilityentity_chr_0015_lifeng_ultimate_skill',
            dieWhenSourceDies: false,
            inheritActionBlackboard: true,
          }),
        ),
      ),
    ],
  },
  {
    'isCombo': 0,
    'atk_scale1': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'atk_scale2': [1.78, 1.96, 2.13, 2.31, 2.49, 2.67, 2.84, 3.02, 3.2, 3.42, 3.69, 4],
    'atk_scale3': [2.67, 2.94, 3.2, 3.47, 3.74, 4, 4.27, 4.54, 4.8, 5.14, 5.54, 6],
    'poise': 5,
    'poise2': 5,
    'poise3': 5,
  },
);

export const lifengGeneratedOperator: OperatorDefinition = {
  slug: 'lifeng',
  gameId: 'LIFENG',
  rarity: 6,
  weaponType: 'polearm',
  element: 'physical',
  role: 'guard',
  mainAttribute: 'agility',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [14, 38, 62, 86, 111, 123],
    agility: [20, 44, 69, 94, 119, 132],
    intellect: [13, 35, 58, 81, 104, 115],
    will: [12, 35, 58, 82, 105, 117],
    baseAttack: [30, 90, 153, 217, 280, 312],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [lifengBasicAttack1, lifengBasicAttack2, lifengBasicAttack3, lifengBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: lifengFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: lifengPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: lifengBattleSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: lifengUltimate },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: lifengComboSkill },
  ],
  buffDefinitions: {
    'buff_chr_0015_lifeng_purify': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 12,
        'rate': 0,
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
    'buff_chr_0015_lifeng_combo_skill_tutorial_marker': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 1,
    },
    'buff_chr_0015_lifeng_talent_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_up': 0,
      },
      attributeModifiers: [
        {
          attribute: 'AtkIncreaseFactorFromWisd',
          slot: 'baseAddition',
          value: { blackboardKey: 'atk_up' },
        },
        {
          attribute: 'AtkIncreaseFactorFromWill',
          slot: 'addition',
          value: { blackboardKey: 'atk_up' },
        },
      ],
    },
    'buff_chr_0015_lifeng_potential_5_1': {
      stackingType: 'unique',
      presentation: {
        visible: true,
        iconId: 'icon_battle_lifeng_potential_5',
        iconPath: '/icons/icon_battle_lifeng_potential_5.webp',
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
      blackboard: {
        'atk_scale_potential5': 0,
        'interval': 0,
        'poise_potential5': 0,
      },
    },
    'buff_chr_0015_lifeng_potential_5': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: { blackboardKey: 'interval' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale_potential5': 0,
        'interval': 0,
        'poise_potential5': 0,
      },
      lifecycleSequences: {
        trigger: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0015_lifeng_potential_5_1',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'atk_scale_potential5': { kind: 'blackboard', key: 'atk_scale_potential5' },
              'poise_potential5': { kind: 'blackboard', key: 'poise_potential5' },
              'interval': { kind: 'blackboard', key: 'interval' },
            },
          }),
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0015_lifeng_potential_5'],
            reason: 'other',
          }),
        ),
      },
    },
    'buff_chr_0015_lifeng_talent_2': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      triggerIntervalSeconds: 1,
      waitFirstTriggerInterval: false,
      maxTriggerCount: -1,
      blackboard: {
        'atk_scale_potential5': 0,
        'atk_scale_talent2': 0,
        'final_atk_scale_talent2': 0,
        'interval': 0,
        'poise_potential5': 0,
      },
      abilityEventResponses: [
        {
          event: 'outputKnockDown',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'buffIdStackCompare',
                  target: 'caster',
                  buffIds: ['buff_chr_0015_lifeng_potential_5_1'],
                  operator: 'greaterOrEqual',
                  value: { kind: 'constant', value: 1 },
                },
                sequence(
                  step('readBuffBlackboard', {
                    target: 'caster',
                    query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                    desiredKey: 'atk_scale_potential5',
                    outputKey: 'atk_scale_potential5',
                  }),
                  step('readBuffBlackboard', {
                    target: 'caster',
                    query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                    desiredKey: 'interval',
                    outputKey: 'interval',
                  }),
                  step('readBuffBlackboard', {
                    target: 'caster',
                    query: { kind: 'id', buffIds: ['buff_chr_0015_lifeng_potential_5_1'] },
                    desiredKey: 'poise_potential5',
                    outputKey: 'poise_potential5',
                  }),
                  step('calculateActionValue', {
                    key: 'final_atk_scale_talent2',
                    operation: 'add',
                    left: { kind: 'blackboard', key: 'atk_scale_talent2' },
                    right: { kind: 'blackboard', key: 'atk_scale_potential5' },
                  }),
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'final_atk_scale_talent2' },
                    tags: [],
                    stagger: { kind: 'blackboard', key: 'poise_potential5' },
                  }, '47:buff_chr_0015_lifeng_talent_2:outputKnockDown:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]14:succeedActions10:actionData3:[4]11:actionOrder1:6'),
                  step('finishBuffsById', {
                    target: 'caster',
                    buffIds: ['buff_chr_0015_lifeng_potential_5_1'],
                    reason: 'other',
                  }),
                  step('applyBuff', {
                    buffId: 'buff_chr_0015_lifeng_potential_5',
                    target: 'caster',
                    inheritSourceSkillCastInfo: true,
                    blackboardAssignments: {
                      'interval': { kind: 'blackboard', key: 'interval' },
                      'atk_scale_potential5': { kind: 'blackboard', key: 'atk_scale_potential5' },
                      'poise_potential5': { kind: 'blackboard', key: 'poise_potential5' },
                    },
                  }),
                ),
                sequence(
                  step('dealDamage', {
                    damageType: 'physical',
                    attackScale: { kind: 'blackboard', key: 'atk_scale_talent2' },
                    tags: [],
                  }, '47:buff_chr_0015_lifeng_talent_2:outputKnockDown:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder1:9'),
                ),
                { alwaysNext: true },
              ),
            ),
        },
      ],
    },
  },
  abilityEntityDefinitions: {
    'abilityentity_chr_0015_lifeng_ultimate_skill': { lifetime: { kind: 'limited', durationSeconds: 5 }, childSkill: {
        skillId: 'chr_0015_lifeng_ultimate_skill_abentity',
        blackboard: {
          'atk_scale1': 1,
          'atk_scale2': 1.5,
          'atk_scale3': 0,
          'isCombo': 0,
          'poise': 0,
          'poise2': 0,
          'poise3': 0,
        },
        scheduledSequences: [
          scheduled(
            6,
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
                attackScale: { kind: 'blackboard', key: 'atk_scale1' },
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise' },
              }, '84:abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity13:abilityEntity39:chr_0015_lifeng_ultimate_skill_abentity11:actionOrder1:5'),
            ),
          ),
          scheduled(
            66,
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
                attackScale: { kind: 'blackboard', key: 'atk_scale2' },
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise2' },
              }, '84:abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity13:abilityEntity39:chr_0015_lifeng_ultimate_skill_abentity11:actionOrder2:10'),
            ),
          ),
          scheduled(
            67,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'isCombo' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('jumpTimeline', {
                    destinationFrame: 150,
                  }),
                ),
              ),
            ),
          ),
          scheduled(
            67,
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'isCombo' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(),
                sequence(
                  step('modifyActionValue', {
                    key: 'EntityBB_isCombo',
                    operation: 'assign',
                    value: { kind: 'constant', value: 0 },
                  }),
                ),
                { alwaysNext: true },
              ),
            ),
          ),
          scheduled(
            121,
            sequence(
              step('dealDamage', {
                damageType: 'physical',
                attackScale: { kind: 'blackboard', key: 'atk_scale3' },
                tags: ['ultimateSkill'],
                features: ['canBreakWeakness'],
                stagger: { kind: 'blackboard', key: 'poise3' },
              }, '84:abilityentity_chr_0015_lifeng_ultimate_skill:chr_0015_lifeng_ultimate_skill_abentity13:abilityEntity39:chr_0015_lifeng_ultimate_skill_abentity11:actionOrder2:14'),
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
          key: 'chr_0015_lifeng_talent_1',
          blackboard: {
            'atk_up': [0.001, 0.0015],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0015_lifeng_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'atk_up': { kind: 'blackboard', key: 'atk_up' },
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
          key: 'buff_chr_0015_lifeng_talent_2',
          blackboard: {
            'atk_scale_talent2': [0.5, 1],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0015_lifeng_talent_2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'atk_scale_talent2': { kind: 'blackboard', key: 'atk_scale_talent2' },
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
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'phy_resist_down',
          operation: 'add',
          value: 0.05,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'num',
          operation: 'assign',
          value: 2,
        },
      ],
    },
    {
      key: 'potential2',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['strength', 'agility', 'intellect', 'will'],
          value: 15,
        },
      ],
    },
    {
      key: 'potential3',
      levels: 1,
      modifiers: [
        {
          kind: 'patchPassiveBlackboard',
          passiveSkillKey: 'chr_0015_lifeng_talent_1',
          blackboardKey: 'atk_up',
          operation: 'add',
          value: 0.0005,
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
      initializationSequence: sequence(
        step('applyBuff', {
          buffId: 'buff_chr_0015_lifeng_potential_5',
          target: 'caster',
          inheritSourceSkillCastInfo: false,
          blackboardAssignments: {
            'interval': { kind: 'constant', value: 15 },
            'atk_scale_potential5': { kind: 'constant', value: 2.5 },
            'poise_potential5': { kind: 'constant', value: 5 },
          },
        }),
      ),
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
