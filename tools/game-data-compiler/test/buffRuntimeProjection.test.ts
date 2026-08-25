import { describe, expect, it } from 'vitest';

import {
  buffRuntimeReadsBlackboardKey,
  compileBuffRuntimeDefinitionSource,
  evaluateFixedFullHealthToggleCondition,
  type BuffRuntimeSource,
  type DamageActionSource,
  type TargetReferenceSource,
} from '../src/index.ts';

describe('公共 Buff 运行时投影', () => {
  it('把技能类型守卫、动态传参、属性修正和图标投影为正式 Next 定义', () => {
    const definition = compileBuffRuntimeDefinitionSource(sourceFixture());

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
                        target: 'buffOwner',
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
      compileBuffRuntimeDefinitionSource({
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

    expect(() => compileBuffRuntimeDefinitionSource(damageTakenSource)).toThrow(
      'unsupported ability event "OnTakeDamage"',
    );
    expect(
      compileBuffRuntimeDefinitionSource(damageTakenSource, new Set(), new Set(['OnTakeDamage']))
        .abilityEventResponses,
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

    expect(compileBuffRuntimeDefinitionSource(tagSource).abilityEventResponses).toEqual([
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

  it('按原生 BuffCount 保留线性事件链中段的增强层数守卫', () => {
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
      compileBuffRuntimeDefinitionSource(countSource).abilityEventResponses?.[0]?.sequence.steps;
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

  it('闭合物理异常事件中的计数写回、动态乘法和 OR 条件', () => {
    const source = sourceFixture();
    const sequence = source.graph.abilityEvents[0]!.actions[0]!;
    const metadata = sequence.actions[0]!.metadata;
    const target = { targetSource: 'Target', targetGroupKey: '' } as never;
    const scalar = (value: number, blackboardKey: string | null = null) => ({
      value,
      blackboardKey,
      levelValues: null,
    });
    const conditionNode = (sourcePath: string, action: unknown, serverActionIndex: number) => ({
      sourcePath,
      metadata: { ...metadata, serverActionIndex },
      body: { kind: 'leaf' as const, value: { family: 'condition' as const, action } },
    });
    const mutationNode = (
      sourcePath: string,
      key: string,
      operation: string,
      value: ReturnType<typeof scalar>,
      serverActionIndex: number,
    ) => ({
      sourcePath,
      metadata: { ...metadata, serverActionIndex },
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'blackboardMutation' as const,
          action: {
            kind: 'blackboardMutation' as const,
            key,
            operation,
            value,
            directValue: true,
            calculationTarget: { targetSource: 'Owner' } as never,
            calculationType: 'HpRatio',
          },
        },
      },
    });
    const buffStack = (checkType: 'Tag' | 'Id', buffIds: readonly string[], tagIds: number[]) => ({
      kind: 'buffStack' as const,
      sourceType: 'CheckBuffStackNumAdvanced',
      targetSource: 'Target',
      targetGroupKey: '',
      buffCheckType: checkType,
      buffIds,
      tagQueryType: 'hasAny' as const,
      buffTagIds: tagIds,
      countType: 'BuffCount',
      comparison: 'GE',
      value: scalar(1),
      limitSkillCastId: false,
    });
    const ifElse = {
      sourcePath: 'BuffData.buff_root.specialMultiplier',
      metadata: { ...metadata, serverActionIndex: 3 },
      body: {
        kind: 'ifElse' as const,
        condition: {
          onlyExecuteWhenSourceIsMainCharacter: false,
          onlyExecuteWhenSourceIsGuard: false,
          actions: [
            conditionNode(
              'BuffData.buff_root.specialMultiplier.any',
              {
                kind: 'any',
                sourceType: 'OrConditionAction',
                groups: [
                  { conditions: [buffStack('Tag', [], [1066759270])], negated: [false] },
                  {
                    conditions: [buffStack('Id', ['buff_common_originum_frozen'], [])],
                    negated: [false],
                  },
                  {
                    conditions: [
                      {
                        kind: 'poise',
                        sourceType: 'CheckPoiseValue',
                        target,
                        returnValueIfMissing: false,
                        comparison: 'Equals',
                        value: scalar(0),
                      },
                    ],
                    negated: [false],
                  },
                ],
              },
              4,
            ),
          ],
        },
        whenTrue: {
          onlyExecuteWhenSourceIsMainCharacter: false,
          onlyExecuteWhenSourceIsGuard: false,
          actions: [
            mutationNode(
              'BuffData.buff_root.multiply',
              'perStack',
              'Multiply',
              scalar(0, 'special'),
              5,
            ),
          ],
        },
        whenFalse: {
          onlyExecuteWhenSourceIsMainCharacter: false,
          onlyExecuteWhenSourceIsGuard: false,
          actions: [],
        },
        alwaysNext: true,
      },
    };
    const eventSource: BuffRuntimeSource = {
      ...source,
      graph: {
        ...source.graph,
        abilityEvents: [
          {
            event: 'OnBeforeOutputPhysicalInfliction',
            actions: [
              {
                onlyExecuteWhenSourceIsMainCharacter: false,
                onlyExecuteWhenSourceIsGuard: false,
                actions: [
                  conditionNode(
                    'BuffData.buff_root.physicalType',
                    {
                      kind: 'physicalInflictionType',
                      sourceType: 'CheckPhysicalInflictionType',
                      types: ['fracture', 'crush'],
                      savedKey: '',
                    },
                    0,
                  ),
                  {
                    sourcePath: 'BuffData.buff_root.readCount',
                    metadata: { ...metadata, serverActionIndex: 1 },
                    body: {
                      kind: 'leaf',
                      value: {
                        family: 'buffQuery',
                        action: {
                          kind: 'buffStackRead',
                          sourceType: 'SaveBuffStackNumAdvanced',
                          target,
                          checkType: 'Tag',
                          buffIds: [],
                          tagQueryType: 'hasAny',
                          buffTagIds: [1075718177],
                          countType: 'BuffCount',
                          limitSkillCastId: false,
                          outputKey: 'count',
                        },
                      },
                    },
                  },
                  mutationNode(
                    'BuffData.buff_root.assign',
                    'perStack',
                    'Assign',
                    scalar(0, 'base'),
                    2,
                  ),
                  ifElse,
                ] as never,
              },
            ],
          },
        ],
      },
    };

    expect(compileBuffRuntimeDefinitionSource(eventSource).abilityEventResponses).toMatchObject([
      {
        event: 'beforeOutputPhysicalInfliction',
        sequence: {
          steps: [
            {
              parameters: {
                condition: {
                  kind: 'eventPhysicalInflictionTypeIn',
                  types: ['fracture', 'crush'],
                },
              },
              whenTrue: {
                steps: [
                  {
                    kind: 'readBuffStackCount',
                    parameters: { target: 'eventTarget', outputKey: 'count' },
                  },
                  {
                    kind: 'modifyActionValue',
                    parameters: { key: 'perStack', operation: 'assign' },
                  },
                  {
                    kind: 'conditional',
                    parameters: { condition: { kind: 'any' }, alwaysNext: true },
                    whenTrue: {
                      steps: [
                        {
                          kind: 'modifyActionValue',
                          parameters: { key: 'perStack', operation: 'multiply' },
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  it('把输出 Buff 后的全局冷却、简单伤害和冷却写入保留为同一短路线性链', () => {
    const source = sourceFixture();
    const nativeEvent = source.graph.abilityEvents[0]!;
    const nativeSequence = nativeEvent.actions[0]!;
    const metadata = nativeSequence.actions[0]!.metadata;
    const eventTagNode = {
      ...nativeSequence.actions[0]!,
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'condition' as const,
          action: {
            kind: 'contextBuff' as const,
            sourceType: 'CheckBuffIdInContext',
            checkType: 'Tag',
            buffIds: [],
            queryType: 'HasAny',
            buffTagIds: [-6380412],
          },
        },
      },
    };
    const cooldownNode = {
      sourcePath: 'BuffData.buff_root.cooldown',
      metadata: { ...metadata, serverActionIndex: 1 },
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'condition' as const,
          action: {
            kind: 'globalCooldown' as const,
            sourceType: 'CheckGlobalCDTimerAction',
            targetSource: 'Owner',
            targetGroupKey: '',
            buffId: 'buff_equipsuit_physuit_01',
          },
        },
      },
    };
    const damageNode = {
      sourcePath: 'BuffData.buff_root.damage',
      metadata: { ...metadata, serverActionIndex: 2 },
      body: {
        kind: 'leaf' as const,
        value: { family: 'damage' as const, action: simpleDamageFixture() },
      },
    };
    const cooldownWriteNode = {
      sourcePath: 'BuffData.buff_root.cooldownWrite',
      metadata: { ...metadata, serverActionIndex: 3 },
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'globalCooldown' as const,
          action: {
            kind: 'globalCooldownApplication' as const,
            target: fixedTarget('Source'),
            buffId: 'buff_equipsuit_physuit_01',
            duration: { value: 0, blackboardKey: 'duration', levelValues: [15] },
          },
        },
      },
    };
    const runtimeSource: BuffRuntimeSource = {
      ...source,
      graph: {
        ...source.graph,
        declaredBlackboard: [
          ...source.graph.declaredBlackboard,
          { key: 'atk_scale', value: 1, isDynamic: false },
          { key: 'poise', value: 0, isDynamic: false },
        ],
        abilityEvents: [
          {
            ...nativeEvent,
            event: 'OnOutputBuff',
            actions: [
              {
                ...nativeSequence,
                actions: [eventTagNode, cooldownNode, damageNode, cooldownWriteNode],
              },
            ],
          },
        ],
      },
    };

    expect(
      compileBuffRuntimeDefinitionSource(runtimeSource).abilityEventResponses?.[0]?.sequence.steps,
    ).toEqual([
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'eventBuffTagsMatch',
            match: 'hasAny',
            buffTagIds: [-6380412],
          },
        },
        whenTrue: {
          steps: [
            {
              kind: 'conditional',
              parameters: {
                condition: {
                  kind: 'not',
                  condition: {
                    kind: 'timedMarkerPresent',
                    target: 'caster',
                    markerId: 'buff_equipsuit_physuit_01',
                  },
                },
              },
              whenTrue: {
                steps: [
                  {
                    kind: 'dealDamage',
                    parameters: {
                      damageType: 'physical',
                      attackScale: { kind: 'blackboard', key: 'atk_scale' },
                      tags: [],
                      stagger: { kind: 'blackboard', key: 'poise' },
                    },
                  },
                  {
                    kind: 'createTimedMarker',
                    parameters: {
                      target: 'caster',
                      markerId: 'buff_equipsuit_physuit_01',
                      durationSeconds: { kind: 'blackboard', key: 'duration' },
                      autoFinishByAction: false,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  it('把首次启用声音与满血治疗双分支投影到既有 Buff 事件协议', () => {
    const source = sourceFixture();
    const nativeEvent = source.graph.abilityEvents[0]!;
    const nativeSequence = nativeEvent.actions[0]!;
    const applyNode = nativeSequence.actions[1]!;
    if (applyNode.body.kind !== 'leaf' || applyNode.body.value.family !== 'buffApplication') {
      throw new Error('invalid fixture');
    }
    const eventTargetApply = {
      ...applyNode,
      body: {
        kind: 'leaf' as const,
        value: {
          ...applyNode.body.value,
          action: {
            ...applyNode.body.value.action,
            target: { ...fixedTarget('Target'), targetGroupKey: '' },
          },
        },
      },
    };
    const overhealNode = {
      ...nativeSequence.actions[0]!,
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'condition' as const,
          action: {
            kind: 'overHeal' as const,
            sourceType: 'CheckOverHeal',
            overHealKey: '',
            finalHealKey: '',
            realHealKey: '',
          },
        },
      },
    };
    const negateNode = {
      sourcePath: 'BuffData.buff_root.not',
      metadata: { ...applyNode.metadata, serverActionIndex: 2 },
      body: { kind: 'negateNextResult' as const },
    };
    const presentationNode = {
      sourcePath: 'BuffData.buff_root.sound',
      metadata: applyNode.metadata,
      body: {
        kind: 'leaf' as const,
        value: {
          family: 'presentation' as const,
          action: {
            kind: 'playSound' as const,
            soundEvent: 'au_int_cure_one',
          } as never,
        },
      },
    };
    const compiled = compileBuffRuntimeDefinitionSource({
      ...source,
      graph: {
        ...source.graph,
        buffEvents: [
          {
            event: 'OnBuffStart',
            actions: [{ ...nativeSequence, actions: [applyNode, presentationNode] }],
          },
        ],
        abilityEvents: [
          {
            ...nativeEvent,
            event: 'OnOutputHeal',
            actions: [
              { ...nativeSequence, actions: [overhealNode, eventTargetApply] },
              { ...nativeSequence, actions: [negateNode, overhealNode, eventTargetApply] },
            ],
          },
        ],
      },
    });

    expect(compiled.lifecycleSequences).toMatchObject({
      start: { steps: [{ kind: 'applyBuff', parameters: { target: 'buffOwner' } }] },
    });
    expect(compiled.abilityEventResponses).toMatchObject([
      {
        event: 'outputHeal',
        sequence: {
          steps: [
            {
              parameters: { condition: { kind: 'eventOverheal' } },
              whenTrue: { steps: [{ parameters: { target: 'eventTarget' } }] },
            },
            {
              parameters: {
                condition: { kind: 'not', condition: { kind: 'eventOverheal' } },
              },
              whenTrue: { steps: [{ parameters: { target: 'eventTarget' } }] },
            },
          ],
        },
      },
    ]);
  });
});

function fixedTarget(targetSource: string): TargetReferenceSource {
  return {
    targetSource,
    targetGroupKey: targetSource === 'Target' ? 'ignored-residual' : '',
    selectorOwner: 'ActionOwner',
    ownerContextKey: '',
    centerType: 'ActionSource',
    centerContextKey: '',
    centerToGround: false,
    target: 'ActionSource',
    targetContextKey: '',
    enableAdvancedDirection: false,
    selectorDirection: 'SourceForward',
    finderType: null,
    finderShape: null,
    finderOwnerPartsQuery: null,
    validatorTypes: [],
    postProcessorTypes: [],
    priorityFilters: [],
    shuffleTargets: [],
    distanceValidators: [],
    finderSpawnedObjectType: null,
    validatorTagQueries: [],
  };
}

function simpleDamageFixture(): DamageActionSource {
  const common = {
    damageType: 'Physical',
    simpleCalculation: true,
    takeAttackSnapshot: false,
    damageDecorateMask: 0,
    controlEffectRoll: true,
    onlyEnableForMainOperator: false,
    processors: [],
    ignoreDamageImmuneLevel: 'None',
    ignorePoiseImmune: false,
    reduceDamageForGuard: false,
    reduceDamageForGuardRatio: 1,
    gainCost: false,
    costs: [],
    enablePoiseBreakTimeDilation: true,
    visualImportance: 'Level1',
    visualCoalitionEnabled: false,
    visualCoalitionGroupKey: '',
    alwaysStartNewCoalition: false,
    alwaysEndCoalition: false,
    updatePositionOnCoalition: true,
  } as const;
  return {
    kind: 'damage',
    alwaysNext: true,
    attacker: 'ActionOwner',
    target: fixedTarget('Target'),
    effectSource: fixedTarget('Owner'),
    hitEnvironment: false,
    units: [
      {
        ...common,
        attributeType: 'Hp',
        attackScale: { value: 0, blackboardKey: 'atk_scale', levelValues: [2.5] },
        serializedAttackCalculationPresent: false,
        attackCalculation: null,
        serializedPoiseCalculationPresent: false,
        poiseCalculation: null,
      },
      {
        ...common,
        attributeType: 'Poise',
        attackScale: { value: 0, blackboardKey: null, levelValues: null },
        serializedAttackCalculationPresent: false,
        attackCalculation: null,
        serializedPoiseCalculationPresent: true,
        poiseCalculation: {
          kind: 'definite',
          value: { value: 0, blackboardKey: 'poise', levelValues: [10] },
          applyScale: false,
          valueScale: { value: 0, blackboardKey: null, levelValues: null },
        },
      },
    ],
  };
}

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
