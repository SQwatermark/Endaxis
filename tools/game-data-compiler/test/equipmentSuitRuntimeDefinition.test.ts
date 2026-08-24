import { describe, expect, it } from 'vitest';

import {
  buffRuntimeReadsBlackboardKey,
  compileEquipmentBuffRuntimeDefinitionSource,
  evaluateFixedFullHealthToggleCondition,
  type BuffRuntimeSource,
} from '../src/index.ts';

describe('装备套装 Buff 运行时投影', () => {
  it('把技能类型守卫、动态传参、属性修正和图标投影为正式 Next 定义', () => {
    const definition = compileEquipmentBuffRuntimeDefinitionSource(sourceFixture());

    expect(definition).toMatchObject({
      stackingType: 'unique',
      presentation: {
        visible: true,
        iconId: 'icon_battle_buff_atk_up',
        iconPath: '/icons/icon_battle_buff_atk_up.webp',
      },
      blackboard: { atk_up: 0.05, duration: 15 },
      attributeModifiers: [
        { attribute: 'Atk', slot: 'baseMultiplier', value: { blackboardKey: 'atk_up' } },
      ],
      abilityEventResponses: [
        {
          event: 'beforeCastSkill',
          priority: 0,
          sequence: {
            steps: [
              {
                kind: 'conditional',
                parameters: {
                  condition: { kind: 'eventSkillTypeIn', skillTypes: ['battleSkill'] },
                },
                whenTrue: {
                  steps: [
                    {
                      kind: 'applyBuff',
                      parameters: {
                        buffId: 'buff_child',
                        target: 'caster',
                        blackboardAssignments: {
                          atk_up: { kind: 'blackboard', key: 'atk_up' },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    });
  });

  it('fails closed on behavior payloads that are not in the common IR', () => {
    const source = sourceFixture();
    expect(() =>
      compileEquipmentBuffRuntimeDefinitionSource({
        ...source,
        unsupportedPayloads: [{ field: 'damageModifier', entryCount: 1 }],
      }),
    ).toThrow('unsupported Buff payloads: damageModifier');
  });

  it('distinguishes declared-only blackboard values from executable reads', () => {
    const source = sourceFixture();

    expect(buffRuntimeReadsBlackboardKey(source, 'unused')).toBe(false);
    expect(buffRuntimeReadsBlackboardKey(source, 'atk_up')).toBe(true);
    expect(buffRuntimeReadsBlackboardKey(source, 'duration')).toBe(false);
  });

  it('严格归约固定满血场景的 ToggleBuff 条件', () => {
    expect(
      evaluateFixedFullHealthToggleCondition({
        kind: 'currentHpRatio',
        comparison: 'GE',
        value: 0.8,
      }),
    ).toBe(true);
    expect(
      evaluateFixedFullHealthToggleCondition({
        kind: 'currentHpRatio',
        comparison: 'LE',
        value: 0.5,
      }),
    ).toBe(false);
    expect(
      evaluateFixedFullHealthToggleCondition({
        kind: 'currentHpRatio',
        comparison: 'LE',
        value: { kind: 'unresolvedSkillBlackboard', key: 'hp_ratio' },
      }),
    ).toBeNull();
  });

  it('只在调用方明确声明木桩边界时省略玩家受击事件', () => {
    const source = sourceFixture();
    const damageTakenSource: BuffRuntimeSource = {
      ...source,
      graph: {
        ...source.graph,
        abilityEvents: source.graph.abilityEvents.map(event => ({
          ...event,
          event: 'OnTakeDamage',
        })),
      },
    };

    expect(() => compileEquipmentBuffRuntimeDefinitionSource(damageTakenSource)).toThrow(
      'unsupported ability event "OnTakeDamage"',
    );
    expect(
      compileEquipmentBuffRuntimeDefinitionSource(
        damageTakenSource,
        new Set(),
        new Set(['OnTakeDamage']),
      ).abilityEventResponses,
    ).toBeUndefined();
  });

  it('把 OnOutputBuff 的标签条件投影为公共事件 Buff 条件', () => {
    const source = sourceFixture();
    const nativeEvent = source.graph.abilityEvents[0]!;
    const nativeSequence = nativeEvent.actions[0]!;
    const tagSource: BuffRuntimeSource = {
      ...source,
      graph: {
        ...source.graph,
        abilityEvents: [
          {
            ...nativeEvent,
            event: 'OnOutputBuff',
            actions: [
              {
                ...nativeSequence,
                actions: [
                  {
                    ...nativeSequence.actions[0]!,
                    body: {
                      kind: 'leaf',
                      value: {
                        family: 'condition',
                        action: {
                          kind: 'contextBuff',
                          sourceType: 'CheckBuffIdInContext',
                          checkType: 'Tag',
                          buffIds: [],
                          queryType: 'HasAny',
                          buffTagIds: [1466867135],
                        },
                      },
                    },
                  },
                  nativeSequence.actions[1]!,
                ],
              },
            ],
          },
        ],
      },
    };

    expect(compileEquipmentBuffRuntimeDefinitionSource(tagSource).abilityEventResponses).toEqual([
      {
        event: 'outputBuff',
        priority: 0,
        sequence: {
          steps: [
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'eventBuffTagsMatch',
                  match: 'hasAny',
                  buffTagIds: [1466867135],
                },
              },
              whenTrue: expect.any(Object),
            },
          ],
        },
      },
    ]);
  });

  it('保留线性事件链中段按真实事件目标统计 Buff 实例数的守卫', () => {
    const source = sourceFixture();
    const nativeEvent = source.graph.abilityEvents[0]!;
    const nativeSequence = nativeEvent.actions[0]!;
    const apply = nativeSequence.actions[1]!;
    const countCondition = {
      ...nativeSequence.actions[0]!,
      sourcePath: 'BuffData.buff_root.count',
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'condition' as const,
          action: {
            kind: 'buffStack' as const,
            sourceType: 'CheckBuffStackNumAdvanced',
            targetSource: 'Target',
            targetGroupKey: '',
            buffCheckType: 'Tag',
            buffIds: [],
            tagQueryType: 'hasAny' as const,
            buffTagIds: [1075718177],
            countType: 'BuffCount',
            comparison: 'GE',
            value: { value: 3, blackboardKey: 'stack_cond', levelValues: [3] },
            limitSkillCastId: false,
          },
        },
      },
    };
    const countSource: BuffRuntimeSource = {
      ...source,
      graph: {
        ...source.graph,
        declaredBlackboard: [
          ...source.graph.declaredBlackboard,
          { key: 'stack_cond', value: 3, isDynamic: false },
        ],
        abilityEvents: [
          {
            ...nativeEvent,
            event: 'OnOutputBuff',
            actions: [
              {
                ...nativeSequence,
                actions: [nativeSequence.actions[0]!, apply, countCondition, apply],
              },
            ],
          },
        ],
      },
    };

    const steps =
      compileEquipmentBuffRuntimeDefinitionSource(countSource).abilityEventResponses?.[0]?.sequence
        .steps;
    expect(steps).toEqual([
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'eventSkillTypeIn',
            skillTypes: ['battleSkill'],
          },
        },
        whenTrue: {
          steps: [
            expect.objectContaining({ kind: 'applyBuff' }),
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'eventTargetBuffCountCompare',
                  tagQueryType: 'hasAny',
                  buffTagIds: [1075718177],
                  operator: 'greaterOrEqual',
                  value: { kind: 'blackboard', key: 'stack_cond' },
                },
              },
              whenTrue: { steps: [expect.objectContaining({ kind: 'applyBuff' })] },
            },
          ],
        },
      },
    ]);
  });
});

function sourceFixture(): BuffRuntimeSource {
  const metadata = {
    nativeType: 'fixture',
    nativeName: 'fixture',
    enabled: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 0,
  };
  return {
    graph: {
      buffId: 'buff_root',
      declaredBlackboard: [
        { key: 'atk_up', value: 0.05, isDynamic: false },
        { key: 'duration', value: 15, isDynamic: false },
      ],
      useTimeDilationDeltaTime: false,
      onlyUseSelfTimeDilation: false,
      timelineActions: [],
      buffEvents: [],
      igniteEvents: [],
      abilityEvents: [
        {
          event: 'OnBeforeCastSkill',
          actions: [
            {
              onlyExecuteWhenSourceIsMainCharacter: false,
              onlyExecuteWhenSourceIsGuard: false,
              actions: [
                {
                  sourcePath: 'BuffData.buff_root.condition',
                  metadata,
                  body: {
                    kind: 'leaf',
                    value: {
                      family: 'condition',
                      action: {
                        kind: 'skillType',
                        sourceType: 'CheckSkillType',
                        skillTypes: ['NormalSkill'],
                      },
                    },
                  },
                },
                {
                  sourcePath: 'BuffData.buff_root.apply',
                  metadata: { ...metadata, serverActionIndex: 1 },
                  body: {
                    kind: 'leaf',
                    value: {
                      family: 'buffApplication',
                      action: {
                        kind: 'buffApplication',
                        buffs: [
                          {
                            buffId: 'buff_child',
                            assignBlackboard: true,
                            assignments: [
                              {
                                targetKey: 'atk_up',
                                valueType: 'Numeric',
                                numericValue: 0,
                                stringValue: '',
                                useDirectValue: false,
                                inputValueKey: 'atk_up',
                              },
                            ],
                            readIdFromBlackboard: false,
                            buffIdKey: '',
                          },
                        ],
                        count: { value: 1, blackboardKey: null, levelValues: null },
                        target: { targetSource: 'Owner' } as never,
                        buffSource: 'ActionOwner',
                        contextKey: '',
                        autoFinishByAction: false,
                        inheritSkillIds: [],
                        finishWithNextSkillIfNotInherited: true,
                        asChildBuff: false,
                        inheritSourceSkillCastId: false,
                        inheritSourceSkillCastInfo: true,
                        isExtra: false,
                        passTargetGroupsToBuff: false,
                        overrideBuffIconDuration: false,
                        buffIconDuration: {
                          durationSourceType: 'AbilityEntity',
                          timedMarkerId: '',
                        },
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    presentation: {
      hasIcon: true,
      spritePath: 'icon_battle_buff_atk_up',
      showInHeadBarCommon: false,
      showInHeadBarAttached: false,
      showInSquadIcon: true,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderUseDirectoryValue: false,
      orderPriorityValue: 0,
      orderPriorityEnum: 'CommonCharBuff',
    },
    lifecycle: {
      lifeType: 'Infinity',
      duration: { value: 0, blackboardKey: null, levelValues: null },
      triggerInterval: { value: -1, blackboardKey: null, levelValues: null },
      waitFirstTriggerInterval: false,
      maxTriggerCount: { value: -1, blackboardKey: null, levelValues: null },
      stackingIdentifierType: 'Id',
      stackingType: 'Unique',
      stackingKey: '',
      priority: { value: 0, blackboardKey: null, levelValues: null },
      negatePriority: false,
      maxStackCount: { value: 0, blackboardKey: null, levelValues: null },
      needsStackEffect: false,
      stackEffectCount: 0,
      stackEffectActionTypes: [],
    },
    attributeModifiers: {
      isConvertedAttribute: false,
      modifiers: [
        {
          modifyAttributeType: 'Specific',
          attributeType: 'Atk',
          formulaItem: 'BaseMultiplier',
          parameter: { value: 0, blackboardKey: 'atk_up', levelValues: [0.05] },
        },
      ],
    },
    applyTagIds: [],
    extendTagIds: [],
    unsupportedPayloads: [],
  };
}
