import { describe, expect, it } from 'vitest';
import { zhuangFangyiGeneratedSource } from './zhuang-fangyi.generated';
import { adaptGeneratedBuffDefinition } from './adaptGeneratedBuffDefinition';

function requireBuff(id: string) {
  const buff = zhuangFangyiGeneratedSource.buffDefinitions.find(item => item.buffId === id);
  if (buff === undefined) throw new Error(`missing generated fixture '${id}'`);
  return buff;
}

describe('adaptGeneratedBuffDefinition', () => {
  it('adapts an attribute-only generated buff without changing native slot semantics', () => {
    const entry = adaptGeneratedBuffDefinition(
      requireBuff('buff_chr_0030_zhuangfy_ult_skill_free'),
    );

    expect(entry.attributeModifiers).toEqual([
      {
        attribute: 'AtbCostAddition',
        slot: 'baseAddition',
        value: -100,
      },
    ]);
  });

  it('preserves extend tags in the stable Buff index shape', () => {
    const source = requireBuff('buff_chr_0030_zhuangfy_ult_skill_free');
    expect(
      adaptGeneratedBuffDefinition({ ...source, extendTagIds: [123] }).extendTagIds,
    ).toEqual([123]);
  });

  it('preserves native icon identity and visibility in the runtime definition', () => {
    const source = requireBuff('buff_chr_0030_zhuangfy_ult_skill_free');
    expect(
      adaptGeneratedBuffDefinition({
        ...source,
        presentation: {
          hasIcon: true,
          spritePath: 'icon_battle_buff_atk_up',
          showInHeadBarCommon: true,
          showInHeadBarAttached: false,
          showInSquadIcon: true,
          onlyShowForMainCharacter: false,
          iconStyleInSquad: 'Default',
          abnormalColorType: 'Physical',
          orderUseDirectoryValue: false,
          orderPriorityValue: 12,
          orderPriorityEnum: 'CommonCharBuff',
        },
      }).presentation,
    ).toEqual({
      visible: true,
      iconId: 'icon_battle_buff_atk_up',
      showInHeadBarCommon: true,
      showInHeadBarAttached: false,
      showInSquadIcon: true,
      onlyShowForMainCharacter: false,
      iconStyleInSquad: 'Default',
      abnormalColorType: 'Physical',
      orderPriority: {
        useDirectoryValue: false,
        value: 12,
        category: 'CommonCharBuff',
      },
    });
  });

  it('preserves presentation-only child Buff identities after numeric behavior is inlined', () => {
    const source = requireBuff('buff_chr_0030_zhuangfy_ult_skill_free');
    expect(
      adaptGeneratedBuffDefinition({
        ...source,
        childPresentations: [
          {
            buffId: 'buff_child_icon',
            presentation: {
              hasIcon: true,
              spritePath: 'icon_battle_affix_cryst_enhance',
              showInHeadBarCommon: true,
              showInHeadBarAttached: false,
              showInSquadIcon: true,
              onlyShowForMainCharacter: false,
              iconStyleInSquad: 'LifeTime',
              abnormalColorType: 'Physical',
              orderUseDirectoryValue: false,
              orderPriorityValue: 0,
              orderPriorityEnum: 'KeywordDebuff',
            },
          },
        ],
      }).childPresentations,
    ).toEqual([
      {
        buffId: 'buff_child_icon',
        presentation: {
          visible: true,
          iconId: 'icon_battle_affix_cryst_enhance',
          showInHeadBarCommon: true,
          showInHeadBarAttached: false,
          showInSquadIcon: true,
          onlyShowForMainCharacter: false,
          iconStyleInSquad: 'LifeTime',
          abnormalColorType: 'Physical',
          orderPriority: {
            useDirectoryValue: false,
            value: 0,
            category: 'KeywordDebuff',
          },
        },
      },
    ]);
  });

  it('recognizes extend tags but still rejects other unsupported behavior', () => {
    expect(requireBuff('buff_chr_0030_zhuangfy_ult_base').extendTagIds).not.toEqual([]);
    expect(() =>
      adaptGeneratedBuffDefinition(requireBuff('buff_chr_0030_zhuangfy_ult_base')),
    ).toThrow('eventActions');
  });

  it('rejects shared buffs with unsupported event actions instead of manufacturing empty buffs', () => {
    expect(() =>
      adaptGeneratedBuffDefinition(requireBuff('buff_common_obtain_ultimate_sp')),
    ).toThrow('eventActions');
  });

  it('rejects unresolved level values instead of selecting a default silently', () => {
    const source = requireBuff('buff_chr_0030_zhuangfy_ult_skill_free');
    expect(() =>
      adaptGeneratedBuffDefinition({
        ...source,
        attributeModifiers: [
          {
            ...source.attributeModifiers[0]!,
            value: { ...source.attributeModifiers[0]!.value, levelValues: [-100, -90] },
          },
        ],
      }),
    ).toThrow('unresolved level values');
  });
});
