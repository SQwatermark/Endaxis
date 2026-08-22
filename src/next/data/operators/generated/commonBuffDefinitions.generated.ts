/** 由 scripts/generate_next_operators 汇总 BuffData 生成；不要手工编辑。 */
import type { OperatorBuffDefinitions } from '../../../core/game-data/operatorDefinition';
import { branch, sequence, step } from '../definitionHelpers';

// prettier-ignore
export const generatedCommonBuffDefinitions = {
  'buff_common_damage_immune_medium': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [782082172, -104052028, -886962248],
    blackboard: {
      'duration': 9999,
    },
  },
  'buff_common_power_attack_disable_cast_skill': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    applyTagIds: [-1601691447, 817018340, -1486085048, -496376350, 2002680355],
  },
  'buff_common_damage_immune_ult_skill': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [782082172, -104052028, -886962248],
    blackboard: {
      'duration': 9999,
    },
    sustainedProtection: {
      target: 'owner',
      superArmor: 50,
      impactResistance: 100,
    },
  },
  'buff_common_cryst_triggered_physical_break': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    applyTagIds: [-615023885],
    blackboard: {
      'atk_scale': 0,
    },
    lifecycleSequences: {
      start: sequence(
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: ['cryoAbnormal'],
          features: ['shatter'],
        }, '50:buff_common_cryst_triggered_physical_break:start:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
      ),
    },
  },
  'buff_physical_handle_cryst_break': {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 10,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    blackboard: {
      'atk_scale': 0,
      'count': 0,
    },
    lifecycleSequences: {
      start: sequence(
        step('readBuffBlackboard', {
          target: 'enemy',
          query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [1535684437] },
          desiredKey: 'count',
          outputKey: 'count',
        }),
        step('finishBuffsByTag', {
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTagIds: [1535684437],
          reason: 'early',
        }),
        step('applyBuff', {
          buffId: 'buff_common_cryst_triggered_physical_break',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            'atk_scale': { kind: 'blackboard', key: 'atk_scale' },
          },
        }),
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
    },
  },
  'buff_physical_no_guard_fake': {
    stackingType: 'refresh',
    priority: 100,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [-508362979],
    blackboard: {
      'duration': 1,
    },
  },
  'buff_physical_no_guard': {
    stackingType: 'enhanceAndRefresh',
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
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ),
      finish: sequence(
        step('applyBuff', {
          buffId: 'buff_physical_no_guard_fake',
          target: 'enemy',
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
              target: 'enemy',
              inheritSourceSkillCastInfo: true,
            }),
          ),
        ),
      ),
    },
  },
  'buff_physical_do_fracture': {
    stackingType: 'stack',
    stackingKey: 'fracture',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: false,
    maxTriggerCount: 0,
    applyTagIds: [-430063731],
    blackboard: {
      'atk_scale': 0,
      'count': 0,
      'duration': 15,
      'extra_scaling': 1,
      'physical_res_down': 0,
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
            addition: { blackboardKey: 'physical_res_down' },
          },
        ],
      },
    ],
    lifecycleSequences: {
      start: sequence(
        step('modifyActionValue', {
          key: 'physical_res_down',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('applyBuff', {
          buffId: 'buff_physical_handle_cryst_break',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
        step('igniteBuffs', {
          target: 'enemy',
          source: 'caster',
          igniteType: 'PhysicalStatus',
        }),
        step('finishBuffsById', {
          target: 'enemy',
          buffIds: ['buff_physical_no_guard'],
          reason: 'early',
        }),
        step('dealDamage', {
          damageType: 'physical',
          attackScale: { kind: 'blackboard', key: 'atk_scale' },
          tags: [],
          features: ['physicalInfliction'],
        }, '33:buff_physical_do_fracture:start:311:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[1]11:actionOrder2:11'),
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
    },
  },
  'buff_common_pulse_triggered_start': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 3,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
  },
  'buff_common_pulse_triggered_fx': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
  },
  'buff_common_pulse_pulse_conduct_triggered_do': {
    stackingType: 'stack',
    stackingKey: 'pulse_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTagIds: [1466867135],
    blackboard: {
      'count': 1,
      'duration': 5,
      'extra_scaling': 1,
      'final_spell_resistance_decrease': 0,
      'spell_resistance_decrease': 0.2,
    },
    damageModifiers: [
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
            addition: { blackboardKey: 'final_spell_resistance_decrease' },
          },
        ],
      },
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
            zone: 'normal',
            addition: { blackboardKey: 'final_spell_resistance_decrease' },
          },
        ],
      },
      {
        enabledSide: 'defender',
        condition: {
          kind: 'eventDamageTypesMatch',
          damageTypes: ['cryo'],
        },
        processors: [
          {
            kind: 'damageScale',
            side: 'defender',
            zone: 'normal',
            addition: { blackboardKey: 'final_spell_resistance_decrease' },
          },
        ],
      },
      {
        enabledSide: 'defender',
        condition: {
          kind: 'eventDamageTypesMatch',
          damageTypes: ['nature'],
        },
        processors: [
          {
            kind: 'damageScale',
            side: 'defender',
            zone: 'normal',
            addition: { blackboardKey: 'final_spell_resistance_decrease' },
          },
        ],
      },
    ],
    lifecycleSequences: {
      start: sequence(
        step('applyBuff', {
          buffId: 'buff_common_pulse_triggered_start',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
        step('storeSourceAttributeValue', {
          attribute: { kind: 'specific', key: 'electricAbnormalDamageIncrease' },
          stage: 'finalNonConverted',
          useFloor: false,
          divisor: { kind: 'constant', value: 1 },
          multiplier: { kind: 'blackboard', key: 'spell_resistance_decrease' },
          base: { kind: 'blackboard', key: 'spell_resistance_decrease' },
          targetKey: 'final_spell_resistance_decrease',
        }),
        step('modifyActionValue', {
          key: 'final_spell_resistance_decrease',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('applyBuff', {
          buffId: 'buff_common_pulse_triggered_fx',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
      ),
    },
  },
  'buff_common_pulse_pulse_conduct_triggered': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 2,
    blackboard: {
      'consumed_layer': 0,
      'consumed_type': 1,
      'count': 1,
      'duration': 0,
      'extra_scaling': 1,
      'real_duration': 0,
    },
    lifecycleSequences: {
      start: sequence(
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'duration' },
            operator: 'greater',
            right: { kind: 'constant', value: 0 },
          },
          sequence(
            step('modifyActionValue', {
              key: 'real_duration',
              operation: 'assign',
              value: { kind: 'blackboard', key: 'duration' },
            }),
          ),
          undefined,
          { alwaysNext: true },
        ),
        step('applyBuff', {
          buffId: 'buff_common_pulse_pulse_conduct_triggered_do',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            'duration': { kind: 'blackboard', key: 'real_duration' },
            'count': { kind: 'blackboard', key: 'count' },
            'consumed_type': { kind: 'blackboard', key: 'consumed_type' },
            'consumed_layer': { kind: 'blackboard', key: 'consumed_layer' },
            'extra_scaling': { kind: 'blackboard', key: 'extra_scaling' },
          },
        }),
      ),
    },
  },
  'buff_common_damage_immune_talent': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [782082172, -104052028, -1128398902],
    blackboard: {
      'duration': 9999,
    },
    sustainedProtection: {
      target: 'owner',
      superArmor: 35,
      impactResistance: 100,
    },
  },
  'buff_common_natural_natural_corrupt_do': {
    stackingType: 'stack',
    stackingKey: 'natural_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: -1,
    applyTagIds: [-421286163],
    blackboard: {
      'additional_def_decrease': 0,
      'count': 1,
      'def_decrease': 0,
      'def_decrease_tick': 0,
      'duration': 0,
      'extra_scaling': 1,
      'max_def_decrease': 0,
      'start_def_decrease': 0,
      'tick': 0,
    },
    attributeModifiers: [
      {
        attribute: 'PhysicalResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'def_decrease' },
      },
      {
        attribute: 'PhysicalResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'additional_def_decrease' },
      },
      {
        attribute: 'FireResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'def_decrease' },
      },
      {
        attribute: 'FireResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'additional_def_decrease' },
      },
      {
        attribute: 'PulseResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'def_decrease' },
      },
      {
        attribute: 'PulseResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'additional_def_decrease' },
      },
      {
        attribute: 'CrystResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'def_decrease' },
      },
      {
        attribute: 'CrystResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'additional_def_decrease' },
      },
      {
        attribute: 'NaturalResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'def_decrease' },
      },
      {
        attribute: 'NaturalResistance',
        slot: 'baseAddition',
        value: { blackboardKey: 'additional_def_decrease' },
      },
    ],
    lifecycleSequences: {
      start: sequence(
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'def_decrease' },
            operator: 'greater',
            right: { kind: 'blackboard', key: 'start_def_decrease' },
          },
          sequence(
            step('modifyActionValue', {
              key: 'def_decrease',
              operation: 'assign',
              value: { kind: 'blackboard', key: 'start_def_decrease' },
            }),
          ),
        ),
      ),
      trigger: sequence(
        branch(
          {
            kind: 'actionValueCompare',
            left: { kind: 'blackboard', key: 'def_decrease' },
            operator: 'greater',
            right: { kind: 'blackboard', key: 'max_def_decrease' },
          },
          sequence(
            step('modifyActionValue', {
              key: 'def_decrease',
              operation: 'add',
              value: { kind: 'blackboard', key: 'def_decrease_tick' },
            }),
            step('modifyActionValue', {
              key: 'tick',
              operation: 'add',
              value: { kind: 'constant', value: 1 },
            }),
            branch(
              {
                kind: 'actionValueCompare',
                left: { kind: 'blackboard', key: 'def_decrease' },
                operator: 'greater',
                right: { kind: 'blackboard', key: 'max_def_decrease' },
              },
              sequence(),
              sequence(
                step('modifyActionValue', {
                  key: 'def_decrease',
                  operation: 'assign',
                  value: { kind: 'blackboard', key: 'max_def_decrease' },
                }),
              ),
              { alwaysNext: true },
            ),
          ),
        ),
      ),
    },
  },
  'buff_common_natural_natural_corrupt_triggered': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 2,
    blackboard: {
      'additional_def_decrease': 0,
      'consumed_layer': 0,
      'consumed_type': 3,
      'count': 1,
      'def_decrease': 0,
      'def_decrease_tick': 0,
      'def_decrease_tick_final': 0,
      'duration': 0,
      'extra_scaling': 1,
      'max_def_decrease': 0,
      'max_def_decrease_final': 0,
      'start_def_decrease': 0,
      'tick': 0,
    },
    lifecycleSequences: {
      start: sequence(
        step('modifyActionValue', {
          key: 'def_decrease_tick',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('modifyActionValue', {
          key: 'max_def_decrease',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('modifyActionValue', {
          key: 'start_def_decrease',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        branch(
          {
            kind: 'buffStackCompare',
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [-421286163],
            operator: 'greaterOrEqual',
            value: { kind: 'constant', value: 1 },
          },
          sequence(
            step('readBuffBlackboard', {
              target: 'enemy',
              query: { kind: 'tag', tagQueryType: 'hasAny', buffTagIds: [-421286163] },
              desiredKey: 'def_decrease',
              outputKey: 'def_decrease',
            }),
          ),
          undefined,
          { alwaysNext: true },
        ),
        step('applyBuff', {
          buffId: 'buff_common_natural_natural_corrupt_do',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            'def_decrease': { kind: 'blackboard', key: 'def_decrease' },
            'max_def_decrease': { kind: 'blackboard', key: 'max_def_decrease' },
            'def_decrease_tick': { kind: 'blackboard', key: 'def_decrease_tick' },
            'start_def_decrease': { kind: 'blackboard', key: 'start_def_decrease' },
            'duration': { kind: 'blackboard', key: 'duration' },
            'consumed_type': { kind: 'blackboard', key: 'consumed_type' },
            'consumed_layer': { kind: 'blackboard', key: 'consumed_layer' },
            'count': { kind: 'blackboard', key: 'count' },
          },
        }),
      ),
    },
  },
  'buff_common_affixes_slow': {
    stackingType: 'highPriority',
    priority: { blackboardKey: 'rate' },
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [1925762097],
    blackboard: { rate: 0, duration: 0 },
  },
  'buff_common_originum_frozen': {
    stackingType: 'stack',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [889346577],
    blackboard: {
      'atk_scale_trigger': 0,
      'atk_up_dynamic': 0,
      'duration': 9999,
      'duration_dynamic': 0,
      'endmin_usp': 0,
      'teammate_ratio': 0,
    },
    igniteEventResponses: [
      {
        igniteType: 'EndminUlt',
        finishAfterIgnited: true,
        sequence: sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
            tags: ['ultimateSkill'],
            features: ['canBreakWeakness'],
          }, '46:buff_common_originum_frozen:ignite:EndminUlt:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:10'),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'atk_up',
            outputKey: 'atk_up_dynamic',
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'duration',
            outputKey: 'duration_dynamic',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential2'] },
            desiredKey: 'ratio',
            outputKey: 'teammate_ratio',
          }),
          step('modifyActionValue', {
            key: 'atk_up_dynamic',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'teammate_ratio' },
          }),
          step('modifyActionValue', {
            key: 'duration_dynamic',
            operation: 'multiply',
            value: { kind: 'constant', value: 1 },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'partyExceptCaster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
          step('readBuffBlackboard', {
            target: 'enemy',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential3'] },
            desiredKey: 'usp',
            outputKey: 'endmin_usp',
          }),
          step('changeResourceByActionValue', {
            resource: 'ultimateEnergy',
            amount: { kind: 'blackboard', key: 'endmin_usp' },
            recipient: 'caster',
            ignoreUltimateEnergyGainMultiplier: true,
          }),
        ),
      },
      {
        igniteType: 'PhysicalStatus',
        finishAfterIgnited: true,
        sequence: sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '51:buff_common_originum_frozen:ignite:PhysicalStatus:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:24'),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'atk_up',
            outputKey: 'atk_up_dynamic',
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'duration',
            outputKey: 'duration_dynamic',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential2'] },
            desiredKey: 'ratio',
            outputKey: 'teammate_ratio',
          }),
          step('modifyActionValue', {
            key: 'atk_up_dynamic',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'teammate_ratio' },
          }),
          step('modifyActionValue', {
            key: 'duration_dynamic',
            operation: 'multiply',
            value: { kind: 'constant', value: 1 },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'partyExceptCaster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
        ),
      },
      {
        igniteType: 'NoGuard',
        finishAfterIgnited: true,
        sequence: sequence(
          step('dealDamage', {
            damageType: 'physical',
            attackScale: { kind: 'blackboard', key: 'atk_scale_trigger' },
            tags: ['comboSkill'],
            features: ['canBreakWeakness'],
          }, '44:buff_common_originum_frozen:ignite:NoGuard:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder2:35'),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'atk_up',
            outputKey: 'atk_up_dynamic',
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_talent_1'] },
            desiredKey: 'duration',
            outputKey: 'duration_dynamic',
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
          step('readBuffBlackboard', {
            target: 'caster',
            query: { kind: 'id', buffIds: ['buff_chr_0003_endminf_potential2'] },
            desiredKey: 'ratio',
            outputKey: 'teammate_ratio',
          }),
          step('modifyActionValue', {
            key: 'atk_up_dynamic',
            operation: 'multiply',
            value: { kind: 'blackboard', key: 'teammate_ratio' },
          }),
          step('modifyActionValue', {
            key: 'duration_dynamic',
            operation: 'multiply',
            value: { kind: 'constant', value: 1 },
          }),
          step('applyBuff', {
            buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
            target: 'partyExceptCaster',
            inheritSourceSkillCastInfo: true,
            blackboardAssignments: {
              'duration': { kind: 'blackboard', key: 'duration_dynamic' },
              'atk_up': { kind: 'blackboard', key: 'atk_up_dynamic' },
            },
          }),
        ),
      },
    ],
  },
  'buff_common_full_immune_medium': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: { blackboardKey: 'duration' },
    applyTagIds: [-808036568, -279045144, 1643653132, 2056757668, 195489960, 2136825092, 486381712, 782082172, -104052028, -886962248],
    blackboard: {
      'duration': 9999,
    },
    sustainedProtection: {
      target: 'owner',
      superArmor: 40,
      impactResistance: 100,
    },
  },
  'buff_common_burning_status': {
    stackingType: 'unique',
    priority: 0,
    maxStackCount: 1,
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 9999,
    blackboard: {
      'burning_atk_scale': 0,
      'duration': 20,
    },
    lifecycleSequences: {
      trigger: sequence(
        step('dealDamage', {
          damageType: 'heat',
          attackScale: { kind: 'blackboard', key: 'burning_atk_scale' },
          tags: ['fireAbnormal'],
          features: ['dot'],
        }, '36:buff_common_burning_status:trigger:011:conditional18:timelineActions[0]19:_sequenceActionData10:actionData3:[0]14:succeedActions10:actionData3:[0]11:actionOrder1:0'),
      ),
    },
  },
  'buff_common_fire_triggered_start': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 3,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: false,
    maxTriggerCount: 1,
  },
  'buff_common_fire_triggered_fx': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
  },
  'buff_common_fire_fire_burning_triggered': {
    stackingType: 'stack',
    stackingKey: 'fire_triggered',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: { blackboardKey: 'duration' },
    triggerIntervalSeconds: 1,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
    applyTagIds: [-1110095722],
    blackboard: {
      'burning_atk_scale': 0,
      'count': 1,
      'duration': 10,
      'extra_scaling': 1,
    },
    lifecycleSequences: {
      enable: sequence(
        step('applyBuff', {
          buffId: 'buff_common_burning_status',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            'burning_atk_scale': { kind: 'blackboard', key: 'burning_atk_scale' },
          },
        }),
      ),
      start: sequence(
        step('modifyActionValue', {
          key: 'burning_atk_scale',
          operation: 'multiply',
          value: { kind: 'blackboard', key: 'extra_scaling' },
        }),
        step('applyBuff', {
          buffId: 'buff_common_fire_triggered_start',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
        step('applyBuff', {
          buffId: 'buff_common_fire_triggered_fx',
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
      ),
    },
  },
  'buff_common_do_frozen': {
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
  'buff_common_frozen': {
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
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
          blackboardAssignments: {
            'duration': { kind: 'blackboard', key: 'duration' },
          },
        }),
      ),
    },
  },
  'buff_common_cryst_triggered_start': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 1,
    durationSeconds: 3,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: false,
    maxTriggerCount: 1,
  },
  'buff_common_cryst_triggered_fx': {
    stackingType: 'unlimited',
    priority: 0,
    maxStackCount: 0,
    durationSeconds: 5,
    triggerIntervalSeconds: 0,
    waitFirstTriggerInterval: true,
    maxTriggerCount: 1,
  },
  'buff_common_cryst_cryst_frozen_triggered_do': {
    stackingType: 'stack',
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
          target: 'enemy',
          inheritSourceSkillCastInfo: true,
        }),
      ),
    },
  },
  'buff_common_cryst_cryst_frozen_triggered': {
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
} satisfies OperatorBuffDefinitions;
