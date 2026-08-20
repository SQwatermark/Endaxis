/** 由 scripts/generate_next_operators 生成；不要手工编辑。 */
import type { SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, once, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const emberComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0009_azrila_combo_skill',
    timelineBlockFrames: 39,
    cooldownFrames: [570, 570, 570, 570, 570, 570, 570, 570, 570, 570, 570, 540],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent1' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'shelterrate',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extrashelter' },
                  }),
                ),
              ),
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'blackboard', key: 'shelterrate' },
                  'duration': { kind: 'constant', value: -1 },
                },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.5 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        12,
      ),
      scheduled(
        26,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'singleEnemyPresent' },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'blackboard', key: 'shelterrate' },
                  'duration': { kind: 'blackboard', key: 'extratime' },
                },
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([102, 112, 122, 133, 143, 153, 163, 173, 184, 196, 212, 230]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct27:chr_0009_azrila_combo_skill11:actionOrder2:28'),
          step('heal', {
            target: 'controlledOperator',
            alwaysNext: true,
            attribute: 'will',
            multiplier: { kind: 'blackboard', key: 'will_additive' },
            addition: { kind: 'blackboard', key: 'heal_base' },
            tagIds: [-1517158118],
          }),
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_3' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'will_additive',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extracure' },
              }),
              step('modifyActionValue', {
                key: 'heal_base',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extracure' },
              }),
              step('heal', {
                target: 'lowestHealthRatioOperatorExceptControlled',
                alwaysNext: true,
                attribute: 'will',
                multiplier: { kind: 'blackboard', key: 'will_additive' },
                addition: { kind: 'blackboard', key: 'heal_base' },
                tagIds: [-1517158118],
              }),
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
    'extracure': 0,
    'extrashelter': 0,
    'heal_base': [300, 360, 420, 480, 510, 540, 570, 600, 630, 645, 660, 675],
    'potential_1': 0,
    'potential_3': 0,
    'shelterrate': 0,
    'talent1': 0,
    'will_additive': [0.7, 0.84, 0.98, 1.12, 1.19, 1.26, 1.33, 1.4, 1.47, 1.51, 1.54, 1.58],
    'atk_scale': [1.02, 1.12, 1.22, 1.33, 1.43, 1.53, 1.63, 1.73, 1.84, 1.96, 2.12, 2.3],
    'poise': 10,
    'usp': 10,
    'extratime': 0,
  },
);

export const emberBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0009_azrila_attack1',
    timelineBlockFrames: 24,
    scheduledSequences: [
      scheduled(
        13,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([38, 42, 46, 50, 54, 57, 61, 65, 69, 74, 79, 86]),
            tags: ['normalAttack'],
          }, '12:basicAttack16:direct23:chr_0009_azrila_attack111:actionOrder2:12'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.38, 0.42, 0.46, 0.5, 0.54, 0.57, 0.61, 0.65, 0.69, 0.74, 0.79, 0.86],
  },
);

export const emberBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0009_azrila_attack2',
    timelineBlockFrames: 18,
    scheduledSequences: [
      scheduled(
        6,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([54, 59, 64, 70, 75, 80, 86, 91, 96, 103, 111, 120]),
            tags: ['normalAttack'],
          }, '12:basicAttack26:direct23:chr_0009_azrila_attack211:actionOrder2:13'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.54, 0.59, 0.64, 0.7, 0.75, 0.8, 0.86, 0.91, 0.96, 1.03, 1.11, 1.2],
  },
);

export const emberBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0009_azrila_attack3',
    timelineBlockFrames: 35,
    scheduledSequences: [
      scheduled(
        18,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([66, 73, 80, 86, 93, 99, 106, 113, 119, 128, 138, 149]),
            tags: ['normalAttack'],
          }, '12:basicAttack36:direct23:chr_0009_azrila_attack311:actionOrder2:11'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.66, 0.73, 0.8, 0.86, 0.93, 0.99, 1.06, 1.13, 1.19, 1.28, 1.38, 1.49],
  },
);

export const emberBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0009_azrila_attack4',
    timelineBlockFrames: 53,
    scheduledSequences: [
      scheduled(
        26,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([82, 90, 98, 106, 114, 122, 131, 139, 147, 157, 169, 184]),
            tags: ['normalAttack', 'normalAttackLastCombo'],
            stagger: 25,
          }, '12:basicAttack46:direct23:chr_0009_azrila_attack411:actionOrder1:8'),
          branch(
            { kind: 'casterControlled' },
            sequence(
              once(
                'do-once:timelineActions[7]._sequenceActionData.actionData.[2].succeedActions.actionData.[2]',
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
      ),
    ],
  },
  {
    'atb': 28,
    'atk_scale': [0.82, 0.9, 0.98, 1.06, 1.14, 1.22, 1.31, 1.39, 1.47, 1.57, 1.69, 1.84],
    'poise': 25,
  },
);

export const emberFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0009_azrila_power_attack',
    timelineBlockFrames: 28,
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
        28,
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
          }, '8:finisher6:direct28:chr_0009_azrila_power_attack11:actionOrder2:40'),
        ),
      ),
      scheduled(
        23,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.9,
          }, '8:finisher6:direct28:chr_0009_azrila_power_attack11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const emberPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0009_azrila_plunging_attack_end',
    timelineBlockFrames: 12,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct35:chr_0009_azrila_plunging_attack_end11:actionOrder1:3'),
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

export const emberBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0009_azrila_normal_skill',
    timelineBlockFrames: 51,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('listenForCombatEvents', {
            responses: [
                {
                  key: 'native-event-29-0',
                  event: { kind: 'operatorHit' },
                  sequence: sequence(
                    branch(
                      {
                        kind: 'eventDamageFeaturesMatch',
                        match: 'exceptAny',
                        features: ['dot', 'remainArea'],
                      },
                      sequence(
                        step('applyBuff', {
                          buffId: 'buff_chr_0009_azrila_normal_skill_gpsuccess',
                          target: 'caster',
                          inheritSourceSkillCastInfo: true,
                        }),
                      ),
                    ),
                  ),
                },
            ],
          }),
        ),
        38,
      ),
      scheduled(
        0,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'talent1' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  step('modifyActionValue', {
                    key: 'shelterrate',
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extrashelter' },
                  }),
                ),
              ),
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'blackboard', key: 'shelterrate' },
                  'duration': { kind: 'constant', value: -1 },
                },
              }),
            ),
          ),
        ),
      ),
      scheduled(
        0,
        sequence(
          step('modifyActionValue', {
            key: 'input_angle',
            operation: 'assign',
            value: { kind: 'constant', value: 100 },
          }),
        ),
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([32, 36, 39, 42, 45, 49, 52, 55, 58, 62, 67, 73]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
          }, '11:battleSkill6:direct28:chr_0009_azrila_normal_skill11:actionOrder2:50'),
        ),
      ),
      scheduled(
        38,
        sequence(
          branch(
            {
              kind: 'all',
              conditions: [
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'potential_1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
                { kind: 'singleEnemyPresent' },
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'talent1' },
                  operator: 'greater',
                  right: { kind: 'constant', value: 0 },
                },
              ],
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0009_azrila_normal_skill_shelter',
                target: 'caster',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  'rate': { kind: 'blackboard', key: 'shelterrate' },
                  'duration': { kind: 'blackboard', key: 'extratime' },
                },
              }),
            ),
          ),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([141, 155, 169, 183, 197, 211, 226, 240, 254, 271, 292, 317]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '11:battleSkill6:direct28:chr_0009_azrila_normal_skill11:actionOrder2:62'),
          branch(
            {
              kind: 'buffIdStackCompare',
              target: 'caster',
              buffIds: ['buff_chr_0009_azrila_normal_skill_gpsuccess'],
              operator: 'greaterOrEqual',
              value: { kind: 'constant', value: 1 },
            },
            sequence(
              step('dealStagger', {
                value: 10,
              }),
            ),
          ),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'extrashelter': 0,
    'potential_1': 0,
    'shelterrate': 0,
    'talent1': 0,
    'atk_scale': [0.32, 0.36, 0.39, 0.42, 0.45, 0.49, 0.52, 0.55, 0.58, 0.62, 0.67, 0.73],
    'atk_scale2': [1.41, 1.55, 1.69, 1.83, 1.97, 2.11, 2.26, 2.4, 2.54, 2.71, 2.92, 3.17],
    'display_atk_scale': [1.73, 1.91, 2.08, 2.25, 2.43, 2.6, 2.77, 2.95, 3.12, 3.34, 3.6, 3.9],
    'displayextrapoise': 10,
    'displaypoise': 10,
    'extrapoise': 10,
    'poise': 10,
    'extratime': 0,
  },
);

export const emberUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0009_azrila_ultimate_skill',
    timelineBlockFrames: 59,
    cooldownFrames: 600,
    costs: [{ resource: 'ultimateEnergy', value: 100 }],
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
        0,
        sequence(
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        48,
      ),
      scheduled(
        50,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'greater',
              right: { kind: 'constant', value: 0 },
            },
            sequence(
              step('modifyActionValue', {
                key: 'hp_percent',
                operation: 'multiply',
                value: { kind: 'blackboard', key: 'extrashield' },
              }),
            ),
          ),
          step('modifyActionValue', {
            key: 'FinalShield',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'hp_percent' },
          }),
          step('dealDamage', {
            damageType: 'heat',
            attackScale: percentages([289, 318, 347, 376, 404, 433, 462, 491, 520, 556, 599, 650]),
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
            stagger: 25,
          }, '8:ultimate6:direct30:chr_0009_azrila_ultimate_skill11:actionOrder2:25'),
          step('applyBuff', {
            buffId: 'buff_chr_0009_azrila_ultimateshield',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'hp_percent': { kind: 'blackboard', key: 'hp_percent' },
              'potential_5': { kind: 'blackboard', key: 'potential_5' },
              'extraattack': { kind: 'blackboard', key: 'extraattack' },
              'FinalShield': { kind: 'blackboard', key: 'FinalShield' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'extrashield': 0,
    'hp_percent': [0.18, 0.18, 0.18, 0.2, 0.2, 0.2, 0.22, 0.22, 0.22, 0.25, 0.25, 0.25],
    'potential_5': 0,
    'duration': 10,
    'extraattack': 0,
    'FinalShield': 0,
    'atk_scale': [2.89, 3.18, 3.47, 3.76, 4.04, 4.33, 4.62, 4.91, 5.2, 5.56, 5.99, 6.5],
    'poise': 25,
  },
);
