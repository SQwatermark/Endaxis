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

  it('preserves extend tags in the stable Buff catalog shape', () => {
    const source = requireBuff('buff_chr_0030_zhuangfy_ult_skill_free');
    expect(
      adaptGeneratedBuffDefinition({ ...source, extendTagIds: [123] }).extendTagIds,
    ).toEqual([123]);
  });

  it('recognizes extend tags but still rejects other unsupported behavior', () => {
    expect(requireBuff('buff_chr_0030_zhuangfy_ult_base').extendTagIds).not.toEqual([]);
    expect(() =>
      adaptGeneratedBuffDefinition(requireBuff('buff_chr_0030_zhuangfy_ult_base')),
    ).toThrow('eventActions');
  });

  it('rejects missing shared definitions instead of manufacturing empty buffs', () => {
    expect(() =>
      adaptGeneratedBuffDefinition(requireBuff('buff_common_obtain_ultimate_sp')),
    ).toThrow('no available source definition');
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
