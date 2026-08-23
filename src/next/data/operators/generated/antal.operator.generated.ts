/** 由 scripts/generate_next_operators 从解包数据生成；不要手工编辑。 */
import type { OperatorDefinition, SkillDefinition } from '../../../core/game-data/operatorDefinition';
import { branch, percentages, scheduled, sequence, step, withSkillBlackboard } from '../definitionHelpers';

// prettier-ignore
export const antalComboSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'comboSkill',
    sourceSkillId: 'chr_0023_antal_combo_skill',
    timelineBlockFrames: 24,
    cooldownFrames: [750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 750, 720],
    scheduledSequences: [
      scheduled(
        0,
        sequence(
          step('startTimeDilation', {
            scope: 'global',
            durationSeconds: { kind: 'constant', value: 0.667 },
            slot: 0,
            priority: 30,
            curve: { kind: 'named', key: 'ComboSkill' },
            finishByAction: false,
            ignoredTargets: ['caster'],
            ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
          }),
        ),
        17,
      ),
      scheduled(
        21,
        sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'EntityBB_combo_type' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 2 },
                },
                sequence(
                  step('applyPhysicalInfliction', {
                    type: 'fracture',
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
                                target: 'buffOwner',
                                inheritSourceSkillCastInfo: true,
                              }),
                            ),
                          ),
                        ),
                      },
                    },
                    fractureBuffId: 'buff_physical_fracture',
                    fractureDefinition: {
                      stackingType: 'unlimited',
                      priority: 0,
                      maxStackCount: 1,
                      durationSeconds: 3,
                      triggerIntervalSeconds: 0,
                      waitFirstTriggerInterval: false,
                      maxTriggerCount: 0,
                      blackboard: {
                        'count': 0,
                        'duration': 15,
                      },
                      lifecycleSequences: {
                        start: sequence(
                          step('applyBuff', {
                            buffId: 'buff_physical_do_fracture',
                            target: 'buffOwner',
                            inheritSourceSkillCastInfo: true,
                            blackboardAssignments: {
                              'duration': { kind: 'blackboard', key: 'duration' },
                            },
                          }),
                        ),
                      },
                    },
                  }),
                ),
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 1 },
                        },
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
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 3 },
                            },
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
                                        target: 'enemy',
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
                                ignoreHitEffect: false,
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
            sequence(
              branch(
                {
                  kind: 'actionValueCompare',
                  left: { kind: 'blackboard', key: 'EntityBB_combo_type' },
                  operator: 'equal',
                  right: { kind: 'constant', value: 0 },
                },
                sequence(
                  branch(
                    {
                      kind: 'actionValueCompare',
                      left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                      operator: 'equal',
                      right: { kind: 'constant', value: 0 },
                    },
                    sequence(
                      step('applyElementalInfliction', { element: 'heat', isExtra: false }),
                    ),
                    sequence(
                      branch(
                        {
                          kind: 'actionValueCompare',
                          left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                          operator: 'equal',
                          right: { kind: 'constant', value: 2 },
                        },
                        sequence(
                          step('applyElementalInfliction', { element: 'cryo', isExtra: false }),
                        ),
                        sequence(
                          branch(
                            {
                              kind: 'actionValueCompare',
                              left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                              operator: 'equal',
                              right: { kind: 'constant', value: 1 },
                            },
                            sequence(
                              step('applyElementalInfliction', { element: 'electric', isExtra: false }),
                            ),
                            sequence(
                              branch(
                                {
                                  kind: 'actionValueCompare',
                                  left: { kind: 'blackboard', key: 'EntityBB_combo_index' },
                                  operator: 'equal',
                                  right: { kind: 'constant', value: 3 },
                                },
                                sequence(
                                  step('applyElementalInfliction', { element: 'nature', isExtra: false }),
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
                sequence(),
              ),
            ),
            { alwaysNext: true },
          ),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([151, 166, 181, 196, 211, 227, 242, 257, 272, 291, 313, 340]),
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
            stagger: 10,
          }, '10:comboSkill6:direct26:chr_0023_antal_combo_skill11:actionOrder2:22'),
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
    'atk_scale': [1.51, 1.66, 1.81, 1.96, 2.11, 2.27, 2.42, 2.57, 2.72, 2.91, 3.13, 3.4],
    'poise': 10,
    'usp': 10,
    'count': 0,
    'duration': 5,
  },
);

export const antalBasicAttack1: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack1',
    sourceSkillId: 'chr_0023_antal_attack1',
    timelineBlockFrames: 15,
    scheduledSequences: [
      scheduled(
        8,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([23, 25, 28, 30, 32, 35, 37, 39, 41, 44, 48, 52]),
            tags: ['normalAttack'],
          }, '12:basicAttack110:projectile22:chr_0023_antal_attack130:chr_0023_antal_attack1_projhit11:actionOrder1:41:0'),
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
    'atb': 0,
    'atk_scale': [0.23, 0.25, 0.28, 0.3, 0.32, 0.35, 0.37, 0.39, 0.41, 0.44, 0.48, 0.52],
  },
);

export const antalBasicAttack2: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack2',
    sourceSkillId: 'chr_0023_antal_attack2',
    timelineBlockFrames: 20,
    scheduledSequences: [
      scheduled(
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([28, 31, 34, 36, 39, 42, 45, 48, 50, 54, 58, 63]),
            tags: ['normalAttack'],
          }, '12:basicAttack210:projectile22:chr_0023_antal_attack230:chr_0023_antal_attack2_projhit11:actionOrder1:31:0'),
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
    'atb': 0,
    'atk_scale': [0.28, 0.31, 0.34, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.54, 0.58, 0.63],
    'display_atk_scale': [0.28, 0.31, 0.34, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.54, 0.58, 0.63],
  },
);

export const antalBasicAttack3: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack3',
    sourceSkillId: 'chr_0023_antal_attack3',
    timelineBlockFrames: 22,
    scheduledSequences: [
      scheduled(
        14,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
        ),
      ),
      scheduled(
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0023_antal_attack330:chr_0023_antal_attack3_projhit11:actionOrder1:41:0'),
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
        18,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: { kind: 'blackboard', key: 'atk_scale' },
            tags: ['normalAttack'],
          }, '12:basicAttack310:projectile22:chr_0023_antal_attack330:chr_0023_antal_attack3_projhit11:actionOrder1:51:0'),
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
    'atb': 0,
    'atk_scale': [0.34, 0.37, 0.41, 0.44, 0.48, 0.51, 0.54, 0.58, 0.61, 0.65, 0.71, 0.77],
  },
);

export const antalBasicAttack4: SkillDefinition = withSkillBlackboard(
  {
    key: 'basicAttack4',
    sourceSkillId: 'chr_0023_antal_attack4',
    timelineBlockFrames: 38,
    scheduledSequences: [
      scheduled(
        27,
        sequence(
          step('modifyActionValue', {
            key: 'atk_scale',
            operation: 'multiply',
            value: { kind: 'constant', value: 0.5 },
          }),
        ),
      ),
      scheduled(
        27,
        sequence(
          branch(
            { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'have_recovered' } },
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack', 'normalAttackLastCombo'],
                stagger: 15,
              }, '12:basicAttack411:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:2'),
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
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'have_recovered',
                    durationSeconds: { kind: 'constant', value: 0.5 },
                    autoFinishByAction: false,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '12:basicAttack411:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:10'),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
      scheduled(
        27,
        sequence(
          branch(
            { kind: 'not', condition: { kind: 'timedMarkerPresent', target: 'caster', markerId: 'have_recovered' } },
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack', 'normalAttackLastCombo'],
                stagger: 15,
              }, '12:basicAttack411:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:2'),
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
                  step('createTimedMarker', {
                    target: 'caster',
                    markerId: 'have_recovered',
                    durationSeconds: { kind: 'constant', value: 0.5 },
                    autoFinishByAction: false,
                  }),
                ),
                undefined,
                { alwaysNext: true },
              ),
            ),
            sequence(
              step('dealDamage', {
                damageType: 'electric',
                attackScale: { kind: 'blackboard', key: 'atk_scale' },
                tags: ['normalAttack'],
              }, '12:basicAttack411:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]11:failActions10:actionData3:[0]11:actionOrder2:10'),
            ),
            { alwaysNext: true },
          ),
        ),
      ),
    ],
  },
  {
    'atb': 15,
    'atk_scale': [0.51, 0.56, 0.61, 0.66, 0.71, 0.77, 0.82, 0.87, 0.92, 0.98, 1.06, 1.15],
    'poise': 15,
  },
);

export const antalFinisher: SkillDefinition = withSkillBlackboard(
  {
    key: 'finisher',
    sourceSkillId: 'chr_0023_antal_power_attack',
    timelineBlockFrames: 32,
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
        30,
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
        42,
      ),
      scheduled(
        10,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.06,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack37:chr_0023_antal_power_attack02_projhit11:actionOrder2:181:0'),
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
        12,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.06,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack37:chr_0023_antal_power_attack02_projhit11:actionOrder2:191:0'),
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
        14,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.06,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack37:chr_0023_antal_power_attack02_projhit11:actionOrder2:201:0'),
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
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.06,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack37:chr_0023_antal_power_attack02_projhit11:actionOrder2:211:0'),
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
        16,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.06,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack37:chr_0023_antal_power_attack02_projhit11:actionOrder2:221:0'),
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
        25,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([400, 440, 480, 520, 560, 600, 640, 680, 720, 770, 830, 900]),
            tags: ['powerAttack', 'normalAttack'],
            calculation: 'breakingAttack',
            calculationMultiplier: 0.7,
          }, '8:finisher10:projectile27:chr_0023_antal_power_attack35:chr_0023_antal_power_attack_projhit11:actionOrder2:271:1'),
        ),
      ),
    ],
  },
  {
    'atk_scale': [4, 4.4, 4.8, 5.2, 5.6, 6, 6.4, 6.8, 7.2, 7.7, 8.3, 9],
  },
);

export const antalPlungingAttack: SkillDefinition = withSkillBlackboard(
  {
    key: 'plungingAttack',
    sourceSkillId: 'chr_0023_antal_plunging_attack_end',
    timelineBlockFrames: 16,
    scheduledSequences: [
      scheduled(
        1,
        sequence(
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([80, 88, 96, 104, 112, 120, 128, 136, 144, 154, 166, 180]),
            tags: ['normalAttack', 'plungingAttack'],
          }, '14:plungingAttack6:direct34:chr_0023_antal_plunging_attack_end11:actionOrder1:2'),
        ),
      ),
    ],
  },
  {
    'atb': 0,
    'atk_scale': [0.8, 0.88, 0.96, 1.04, 1.12, 1.2, 1.28, 1.36, 1.44, 1.54, 1.66, 1.8],
  },
);

export const antalBattleSkill: SkillDefinition = withSkillBlackboard(
  {
    key: 'battleSkill',
    sourceSkillId: 'chr_0023_antal_normal_skill',
    timelineBlockFrames: 31,
    costs: [{ resource: 'sp', value: 100 }],
    costFrame: 0,
    scheduledSequences: [
      scheduled(
        20,
        sequence(
          step('finishBuffsById', {
            target: 'caster',
            buffIds: ['buff_chr_0023_antal_normal_skill'],
            reason: 'other',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_normal_skill',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            source: 'enemy',
            blackboardAssignments: {
              'rate': { kind: 'blackboard', key: 'rate' },
              'duration': { kind: 'blackboard', key: 'duration' },
              'potential_3': { kind: 'blackboard', key: 'potential_3' },
              'potential_3_atb': { kind: 'blackboard', key: 'potential_3_atb' },
              'potential_5': { kind: 'blackboard', key: 'potential_5' },
              'delay_time': { kind: 'blackboard', key: 'delay_time' },
              'potential_5_rate': { kind: 'blackboard', key: 'potential_5_rate' },
            },
          }),
          step('dealDamage', {
            damageType: 'electric',
            attackScale: percentages([89, 98, 107, 116, 124, 133, 142, 151, 160, 171, 185, 200]),
            tags: ['normalSkill'],
            features: ['canBreakWeakness'],
            stagger: 0,
          }, '11:battleSkill6:direct27:chr_0023_antal_normal_skill11:actionOrder2:11'),
          step('gainSquadUltimateEnergyFromSkillCost', { coefficient: 1 }),
        ),
      ),
    ],
  },
  {
    'rate': [0.05, 0.05, 0.06, 0.06, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09, 0.09, 0.1],
    'duration': 60,
    'potential_3': 0,
    'potential_3_atb': 0,
    'potential_5': 0,
    'delay_time': 0,
    'potential_5_rate': 0,
    'atk_scale': [0.89, 0.98, 1.07, 1.16, 1.24, 1.33, 1.42, 1.51, 1.6, 1.71, 1.85, 2],
  },
);

export const antalUltimate: SkillDefinition = withSkillBlackboard(
  {
    key: 'ultimate',
    sourceSkillId: 'chr_0023_antal_ultimate_skill',
    timelineBlockFrames: 56,
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
          step('startUltimateTimeDilation', {
            priority: 100,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
          }),
        ),
        42,
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
        60,
      ),
      scheduled(
        49,
        sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_utimate_skill',
            target: 'party',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration' },
              'rate': { kind: 'blackboard', key: 'rate' },
            },
          }),
        ),
      ),
    ],
  },
  {
    'duration': 12,
    'rate': [0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.2],
  },
);

export const antalGeneratedOperator: OperatorDefinition = {
  slug: 'antal',
  gameId: 'ANTAL',
  rarity: 4,
  weaponType: 'arts-unit',
  element: 'electric',
  role: 'supporter',
  mainAttribute: 'intellect',
  secondaryAttribute: 'strength',
  attributes: {
    strength: [15, 40, 65, 91, 116, 129],
    agility: [9, 25, 43, 60, 78, 86],
    intellect: [15, 47, 81, 114, 148, 165],
    will: [9, 25, 41, 58, 74, 82],
    baseAttack: [30, 87, 147, 207, 267, 297],
    baseHealth: [500, 1566, 2689, 3811, 4934, 5495],
  },
  skillGroups: [
    { key: 'basicAttack', skillType: 'basicAttack', levelSource: 'basicAttack', skills: [antalBasicAttack1, antalBasicAttack2, antalBasicAttack3, antalBasicAttack4] },
    { key: 'finisher', skillType: 'finisher', levelSource: 'basicAttack', skills: antalFinisher },
    { key: 'plungingAttack', skillType: 'plungingAttack', levelSource: 'basicAttack', skills: antalPlungingAttack },
    { key: 'battleSkill', skillType: 'battleSkill', levelSource: 'battleSkill', skills: antalBattleSkill },
    { key: 'comboSkill', skillType: 'comboSkill', levelSource: 'comboSkill', skills: antalComboSkill },
    { key: 'ultimate', skillType: 'ultimate', levelSource: 'ultimate', skills: antalUltimate },
  ],
  buffDefinitions: {
    'buff_chr_0023_antal_talent_1_combotrigger': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: 0.1,
    },
    'buff_chr_0023_antal_tageffect': {
      stackingType: 'stack',
      presentation: {
        visible: true,
        iconId: 'icon_battle_antal_buff',
        iconPath: '/operators/antal/icon_battle_antal_buff.webp',
        showInHeadBarCommon: true,
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
      triggerIntervalSeconds: { blackboardKey: 'delay_time' },
      waitFirstTriggerInterval: true,
      maxTriggerCount: 1,
      blackboard: {
        'delay_time': 0,
        'duration': 0,
        'potential_3': 0,
        'potential_3_atb': 0,
        'potential_5': 0,
        'potential_5_rate': 0,
        'rate': 0,
        'rate_add': 0.05,
      },
      damageModifiers: [
        {
          enabledSide: 'defender',
          condition: {
            kind: 'eventDamageTypesMatch',
            damageTypes: ['electric'],
          },
          processors: [
            {
              kind: 'damageScale',
              side: 'defender',
              zone: 'vulnerable',
              addition: { blackboardKey: '__keyword_rate_0_0_0' },
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
              zone: 'vulnerable',
              addition: { blackboardKey: '__keyword_rate_0_0_1' },
            },
          ],
        },
      ],
      keywordEnhancements: [
        {
          triggerBuffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
          operation: 'add',
          targetKey: '__keyword_rate_0_0_0',
          initialValue: { blackboardKey: 'rate' },
          value: { blackboardKey: 'potential_5_rate' },
        },
        {
          triggerBuffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
          operation: 'add',
          targetKey: '__keyword_rate_0_0_1',
          initialValue: { blackboardKey: 'rate' },
          value: { blackboardKey: 'potential_5_rate' },
        },
      ],
      lifecycleSequences: {
        finish: sequence(
          step('finishBuffsById', {
            target: 'buffOwner',
            buffIds: ['buff_chr_0023_antal_talent_1_combotrigger'],
            reason: 'other',
          }),
        ),
        trigger: sequence(
          branch(
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'potential_5' },
              operator: 'equal',
              right: { kind: 'constant', value: 1 },
            },
            sequence(
              step('applyBuff', {
                buffId: 'buff_chr_0023_antal_talent_1_combotrigger',
                target: 'buffOwner',
                inheritSourceSkillCastInfo: true,
              }),
            ),
          ),
        ),
      },
    },
    'buff_chr_0023_antal_normal_skill': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'delay_time': 0,
        'duration': 60,
        'potential_3': 0,
        'potential_3_atb': 0,
        'potential_5': 0,
        'potential_5_rate': 0,
        'rate': 0.2,
      },
      lifecycleSequences: {
        start: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_tageffect',
            target: 'buffSource',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'rate': { kind: 'blackboard', key: 'rate' },
              'duration': { kind: 'blackboard', key: 'duration' },
              'potential_3': { kind: 'blackboard', key: 'potential_3' },
              'potential_3_atb': { kind: 'blackboard', key: 'potential_3_atb' },
              'potential_5_rate': { kind: 'blackboard', key: 'potential_5_rate' },
              'potential_5': { kind: 'blackboard', key: 'potential_5' },
              'delay_time': { kind: 'blackboard', key: 'delay_time' },
            },
          }),
        ),
      },
    },
    'buff_chr_0023_antal_utimate_skill': {
      stackingType: 'stack',
      priority: 0,
      maxStackCount: 1,
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: {
        'duration': 20,
        'healvalue': 500,
        'multiplier': 3,
        'rate': 0.4,
      },
    },
    'buff_chr_0023_antal_talent_1_heal_trigger': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      blackboard: {
        'cd': 0,
        'healvalue': 0,
        'multiplier': 0,
      },
      abilityEventResponses: [
        {
          event: 'outputDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                {
                  kind: 'entityTagMatch',
                  target: 'caster',
                  tagQueryType: 'hasAny',
                  tagIds: [-1748167886],
                },
                sequence(
                  branch(
                    {
                      kind: 'eventDamageTagsMatch',
                      match: 'hasAny',
                      tags: ['normalSkill', 'ultimateSkill', 'comboSkill'],
                    },
                    sequence(
                      step('heal', {
                        target: 'buffOwner',
                        alwaysNext: true,
                        attribute: 'strength',
                        multiplier: { kind: 'blackboard', key: 'multiplier' },
                        addition: { kind: 'blackboard', key: 'healvalue' },
                        tagIds: [],
                      }),
                      step('createTimedMarker', {
                        target: 'caster',
                        markerId: 'buff_chr_0023_antal_talent_1_heal_trigger',
                        durationSeconds: { kind: 'blackboard', key: 'cd' },
                        autoFinishByAction: false,
                      }),
                    ),
                  ),
                ),
              ),
            ),
        },
      ],
    },
    'buff_chr_0023_antal_talent_1': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 2,
      blackboard: {
        'cd': 30,
        'healvalue': 300,
        'multiplier': 3,
      },
      lifecycleSequences: {
        enable: sequence(
          step('applyBuff', {
            buffId: 'buff_chr_0023_antal_talent_1_heal_trigger',
            target: 'party',
            inheritSourceSkillCastInfo: false,
            finishByAction: true,
            blackboardAssignments: {
              'healvalue': { kind: 'blackboard', key: 'healvalue' },
              'cd': { kind: 'blackboard', key: 'cd' },
              'multiplier': { kind: 'blackboard', key: 'multiplier' },
            },
          }),
        ),
      },
    },
    'buff_chr_0023_antal_talent_2': {
      stackingType: 'unique',
      priority: 0,
      maxStackCount: 1,
      blackboard: {
        'heal_scale': 0.1,
        'healvalue': 300,
        'probability': 0.3,
      },
      abilityEventResponses: [
        {
          event: 'beforeTakeDamage',
          priority: 0,
          sequence:
            sequence(
              branch(
                { kind: 'eventDamageTypeIn', damageTypes: ['physical'] },
                sequence(
                  branch(
                    {
                      kind: 'probability',
                      probability: { kind: 'blackboard', key: 'probability' },
                    },
                    sequence(
                      step('applyBuff', {
                        buffId: 'buff_common_damage_immune_talent',
                        target: 'buffSource',
                        inheritSourceSkillCastInfo: true,
                        blackboardAssignments: {
                          'duration': { kind: 'constant', value: 0.01 },
                        },
                      }),
                      step('heal', {
                        target: 'buffOwner',
                        alwaysNext: true,
                        attribute: 'strength',
                        multiplier: { kind: 'blackboard', key: 'heal_scale' },
                        addition: { kind: 'blackboard', key: 'healvalue' },
                        tagIds: [],
                      }),
                    ),
                  ),
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
          key: 'buff_chr_0023_antal_talent_1',
          blackboard: {
            'cd': [30, 30],
            'healvalue': [72, 108],
            'multiplier': [0.6, 0.9],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0023_antal_talent_1',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'cd': { kind: 'blackboard', key: 'cd' },
                'healvalue': { kind: 'blackboard', key: 'healvalue' },
                'multiplier': { kind: 'blackboard', key: 'multiplier' },
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
          key: 'buff_chr_0023_antal_talent_2',
          blackboard: {
            'heal_scale': [0.23, 0.38],
            'healvalue': [27, 45],
            'probability': [0.3, 0.3],
          },
          enableSequence: sequence(
            step('applyBuff', {
              buffId: 'buff_chr_0023_antal_talent_2',
              target: 'caster',
              inheritSourceSkillCastInfo: false,
              blackboardAssignments: {
                'heal_scale': { kind: 'blackboard', key: 'heal_scale' },
                'healvalue': { kind: 'blackboard', key: 'healvalue' },
                'probability': { kind: 'blackboard', key: 'probability' },
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
          skillGroupKey: 'ultimate',
          blackboardKey: 'rate',
          operation: 'multiply',
          value: 1.1,
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
          blackboardKey: 'potential_3',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_3_atb',
          operation: 'add',
          value: 15,
        },
      ],
    },
    {
      key: 'potential4',
      levels: 1,
      modifiers: [
        {
          kind: 'addBuildAttribute',
          attributes: ['intellect'],
          value: 10,
        },
        { kind: 'modifyBasePanelStat', stat: 'health', operation: 'percent', value: 0.1 },
      ],
    },
    {
      key: 'potential5',
      levels: 1,
      modifiers: [
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5',
          operation: 'assign',
          value: 1,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'delay_time',
          operation: 'add',
          value: 20,
        },
        {
          kind: 'patchSkillBlackboard',
          skillGroupKey: 'battleSkill',
          blackboardKey: 'potential_5_rate',
          operation: 'add',
          value: 0.04,
        },
      ],
    },
  ],
  conversionSupport: { completeness: 'complete', missingCapabilities: [] },
};
