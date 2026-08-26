import { describe, expect, it } from 'vitest';
import { parseBuffRuntimeSource } from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

describe('Buff 运行时公共来源', () => {
  it('保留生命周期、图标、属性修正和可执行技能类型条件', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        hasIcon: true,
        blackboard: [
          { key: 'atk_up', valueDouble: 0.05, valueStr: '', isDynamic: false },
          { key: 'duration', valueDouble: 15, valueStr: '', isDynamic: false },
        ],
        duration: scalarFixture(0, 'duration'),
        lifeType: 'Limited',
        attributeModifier: {
          isConvertedAttribute: false,
          attributeModifiers: [
            {
              modifyAttributeType: 'Specific',
              attributeType: 'Atk',
              formulaItem: 'BaseMultiplier',
              param: scalarFixture(0, 'atk_up'),
            },
          ],
        },
        abilityEventAction: [
          {
            abilityEvent: 'OnBeforeCastSkill',
            actions: [sequence([checkSkillType('NormalSkill')])],
          },
          {
            abilityEvent: 'OnBeforeCastSkill',
            actions: [sequence([checkOriginSkillType('NormalSkill')])],
          },
        ],
      }),
      'BuffData.buff_fixture',
    );

    expect(parsed.presentation).toMatchObject({
      hasIcon: true,
      spritePath: 'icon_battle_buff_atk_up',
      showInSquadIcon: true,
    });
    expect(parsed.lifecycle).toMatchObject({
      lifeType: 'Limited',
      stackingType: 'Refresh',
      stackEffectCount: 0,
    });
    expect(parsed.lifecycle.duration).toEqual({
      value: 0,
      blackboardKey: 'duration',
      levelValues: [15],
    });
    expect(parsed.applyTagIds).toEqual([-1757502026]);
    expect(parsed.attributeModifiers.modifiers[0]?.parameter).toEqual({
      value: 0,
      blackboardKey: 'atk_up',
      levelValues: [0.05],
    });
    expect(parsed.graph.abilityEvents[0]?.actions[0]?.actions[0]?.body).toMatchObject({
      kind: 'leaf',
      value: { family: 'condition', action: { kind: 'skillType', skillTypes: ['NormalSkill'] } },
    });
    expect(parsed.graph.abilityEvents[1]?.actions[0]?.actions[0]?.body).toMatchObject({
      kind: 'leaf',
      value: {
        family: 'condition',
        action: {
          kind: 'originSkillType',
          skillTypes: ['NormalSkill'],
          attackTypeMask: 'All',
        },
      },
    });
    expect(parsed.unsupportedPayloads).toEqual([]);
  });

  it('does not silently discard unsupported modifier payloads', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        globalModifier: [{}],
      }),
      'BuffData.buff_fixture',
    );
    expect(parsed.unsupportedPayloads).toEqual([{ field: 'globalModifier', entryCount: 1 }]);
  });

  it('结构化读取普攻末段主控条件的即时失衡属性修正', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        blackboard: [{ key: 'poise_up', valueDouble: 0.3, valueStr: '', isDynamic: false }],
        poiseModifier: [
          {
            enableSide: 'Attacker',
            condition: sequence([
              {
                $type:
                  'Beyond.Gameplay.Core.Conditions.CheckDamageDecorateMask+Data, Gameplay.Beyond',
                isEnable: true,
                priorityLevel: 'Default',
                priorityOffset: 0,
                serverActionIndex: 0,
                checkType: 'HasAll',
                mask: 2097152,
              },
              {
                $type:
                  'Beyond.Gameplay.Core.Conditions.CheckMainCharacterCondition+Data, Gameplay.Beyond',
                isEnable: true,
                priorityLevel: 'Default',
                priorityOffset: 0,
                serverActionIndex: 1,
                checkTarget: targetFixture('Source'),
              },
            ]),
            poiseProcessors: [
              {
                $type: 'Beyond.Gameplay.Core.InstantModifyAttributeForPoise, Gameplay.Beyond',
                modifyTargetSide: 'Attacker',
                modifier: {
                  modifyAttributeType: 'Specific',
                  attributeType: 'PoiseDamageOutputScalar',
                  formulaItem: 'BaseAddition',
                  param: scalarFixture(0, 'poise_up'),
                },
              },
            ],
          },
        ],
      }),
      'BuffData.buff_fixture',
    );

    expect(parsed.poiseModifiers).toMatchObject([
      {
        enabledSide: 'Attacker',
        condition: {
          actions: [
            { body: { value: { action: { kind: 'damageDecorateMask', mask: 2097152 } } } },
            { body: { value: { action: { kind: 'mainOperator', targetSource: 'Source' } } } },
          ],
        },
        processors: [
          {
            kind: 'instantAttribute',
            modifyTargetSide: 'Attacker',
            modifier: {
              attributeType: 'PoiseDamageOutputScalar',
              formulaItem: 'BaseAddition',
              parameter: { blackboardKey: 'poise_up', levelValues: [0.3] },
            },
          },
        ],
      },
    ]);
  });

  it('结构化读取 DefiniteValueCalculation 护盾', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        blackboard: [{ key: 'shield_valid', valueDouble: 500, valueStr: '', isDynamic: false }],
        shieldConfigs: [
          {
            infinityValue: false,
            valueCalculation: {
              $type: 'Beyond.Gameplay.Core.DefiniteValueCalculation, Gameplay.Beyond',
              value: scalarFixture(0, 'shield_valid'),
              applyScale: false,
              valueScale: scalarFixture(0),
            },
            damageAbsorptions: [],
            absorbCnt: scalarFixture(-1),
            absorbAllDmgWhenConsume: false,
            removeBuffWhenConsume: true,
            priority: 'Normal',
            replaceHitEffect: true,
            hitEffect: {},
          },
        ],
      }),
      'BuffData.buff_fixture',
    );

    expect(parsed.shields).toMatchObject([
      {
        infinityValue: false,
        value: { blackboardKey: 'shield_valid', levelValues: [500] },
        damageAbsorptions: [],
        absorbCount: { value: -1 },
        removeBuffWhenConsumed: true,
        priority: 'Normal',
      },
    ]);
  });

  it('结构化读取带治疗 Tag 条件的即时治疗属性修正', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        blackboard: [{ key: 'heal_up', valueDouble: 0.2, valueStr: '', isDynamic: false }],
        healModifier: [
          {
            enableSide: 'Healer',
            condition: sequence([
              {
                $type: 'Beyond.Gameplay.Core.Conditions.CheckHealTag+Data, Gameplay.Beyond',
                isEnable: true,
                priorityLevel: 'Default',
                priorityOffset: 0,
                serverActionIndex: 0,
                query: { queryType: 'HasAny', tags: [{ tagId: -1517158118 }] },
              },
            ]),
            healProcessors: [
              {
                $type: 'Beyond.Gameplay.Core.InstantModifyAttributeForHeal, Gameplay.Beyond',
                modifyTargetSide: 'Attacker',
                modifier: {
                  modifyAttributeType: 'Specific',
                  attributeType: 'HealOutputIncrease',
                  formulaItem: 'BaseAddition',
                  param: scalarFixture(0, 'heal_up'),
                },
              },
            ],
          },
        ],
      }),
      'BuffData.buff_fixture',
    );

    expect(parsed.healModifiers).toMatchObject([
      {
        enabledSide: 'Healer',
        condition: { actions: [{ body: { value: { action: { kind: 'healTag' } } } }] },
        processors: [
          {
            kind: 'instantAttribute',
            modifyTargetSide: 'Attacker',
            modifier: {
              attributeType: 'HealOutputIncrease',
              formulaItem: 'BaseAddition',
              parameter: { blackboardKey: 'heal_up', levelValues: [0.2] },
            },
          },
        ],
      },
    ]);
  });
});

function buffFixture(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    abilityEventAction: [],
    addingCooldown: scalarFixture(0),
    applyTags: [{ tagId: -1757502026 }],
    attributeModifier: { isConvertedAttribute: false, attributeModifiers: [] },
    blackboard: [],
    buffEventAction: [],
    damageModifier: [],
    dispelConfig: { canBeDispelled: false, dispelledLevel: 'Default' },
    duration: scalarFixture(0),
    finishOnRepatriate: false,
    globalModifier: [],
    hasAddingCooldown: false,
    hasIcon: false,
    healModifier: [],
    iconConfig: iconFixture(),
    id: 'buff_fixture',
    igniteEventAction: [],
    ignoreCooldownWhenAdding: false,
    ignoreTagImmune: false,
    lifeType: 'Infinity',
    maxTriggerCnt: scalarFixture(1),
    onlyUseSelfTimeDilation: false,
    poiseModifier: [],
    shieldConfigs: [],
    stackingSettings: stackingFixture(),
    tagsAfterTriggerExtendBuffAction: [],
    timelineActions: [],
    triggerInterval: scalarFixture(0),
    useTimeDilationDt: false,
    waitFirstTriggerInterval: true,
    ...overrides,
  };
}

function iconFixture(): Record<string, unknown> {
  return {
    _spritePath: 'icon_battle_buff_atk_up',
    showInHeadBarCommon: false,
    showInHeadBarAttached: false,
    showInSquadIcon: true,
    onlyShowForMainCharacter: false,
    blinkInMainCharHpBar: false,
    showProgressInHpBar: false,
    showProgressInNormalSkillButton: false,
    useWeakProgressInNormalSkillButton: false,
    showProgressInUltimateSkillButton: false,
    forceRaiseIconEvent: false,
    iconStyleInSquad: 'Default',
    abnormalColorType: 'Physical',
    _orderPriorityConfig: {
      useDirectoryValue: false,
      priorityValue: 0,
      priorityEnum: 'CommonCharBuff',
    },
    showWarningBackground: false,
    playStrongInAnimation: false,
    hasCharHpBarVfxType: false,
    charHpBarVfxType: 'Fire',
  };
}

function stackingFixture(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    identifierType: 'Id',
    stackingType: 'Refresh',
    stackingKey: '',
    usePriorityKey: false,
    priorityKey: '',
    negatePriority: false,
    priority: 0,
    useMaxStackCntKey: false,
    maxStackCntKey: '',
    maxStackCnt: 0,
    isNeedStackEffect: false,
    stackEffects: [],
    ...overrides,
  };
}

function sequence(actionData: unknown[]): Record<string, unknown> {
  return {
    actionData,
    onlyExecuteWhenSourceIsMainChar: false,
    onlyExecuteWhenSourceIsGuard: false,
  };
}

function checkSkillType(skillType: string): Record<string, unknown> {
  return {
    $type: 'Beyond.Gameplay.Core.Conditions.CheckSkillType+Data, Gameplay.Beyond',
    isEnable: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 0,
    checkTargetCurSkill: false,
    skillOwner: targetFixture('Target'),
    mustBeforeExclusiveTime: false,
    skillTypeList: [skillType],
    attackTypeMask: 'All',
  };
}

function checkOriginSkillType(skillType: string): Record<string, unknown> {
  return {
    $type: 'Beyond.Gameplay.Core.CheckOriginSkillType+Data, Gameplay.Beyond',
    isEnable: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 0,
    skillTypeList: [skillType],
    attackTypeMask: 'All',
  };
}
