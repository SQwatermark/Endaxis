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
          tags: [],
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
} satisfies OperatorBuffDefinitions;
