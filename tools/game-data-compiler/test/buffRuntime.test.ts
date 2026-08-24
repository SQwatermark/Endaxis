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
    expect(parsed.attributeModifiers.modifiers[0]?.parameter).toEqual({
      value: 0,
      blackboardKey: 'atk_up',
      levelValues: [0.05],
    });
    expect(parsed.graph.abilityEvents[0]?.actions[0]?.actions[0]?.body).toMatchObject({
      kind: 'leaf',
      value: { family: 'condition', action: { kind: 'skillType', skillTypes: ['NormalSkill'] } },
    });
    expect(parsed.unsupportedPayloads).toEqual([]);
  });

  it('does not silently discard unsupported modifier payloads', () => {
    const parsed = parseBuffRuntimeSource(
      buffFixture({
        healModifier: [{}],
      }),
      'BuffData.buff_fixture',
    );
    expect(parsed.unsupportedPayloads).toEqual([{ field: 'healModifier', entryCount: 1 }]);
  });
});

function buffFixture(overrides: Record<string, unknown>): Record<string, unknown> {
  return {
    abilityEventAction: [],
    addingCooldown: scalarFixture(0),
    applyTags: [],
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
