import { describe, expect, it } from 'vitest';
import { mifuGeneratedOperator } from './mifu.operator.generated';

describe('mifu generated operator', () => {
  it('keeps the chained battle skills as runtime-only replacements', () => {
    const group = mifuGeneratedOperator.skillGroups.find(candidate => candidate.key === 'battleSkill');
    const normalSkill2 =
      mifuGeneratedOperator.buffDefinitions?.buff_chr_0031_mifu_normalskill_2;

    expect(group === undefined || !('key' in group.skills) ? undefined : group.skills.key).toBe(
      'battleSkill1',
    );
    expect(group?.replacementSkills?.map(skill => skill.key)).toEqual([
      'battleSkill2',
      'battleSkill3',
    ]);
    expect(normalSkill2?.skillSlotReplacements).toEqual([
      {
        skillGroupKey: 'battleSkill',
        targetSkillKey: 'battleSkill2',
        revertedSkillKey: 'battleSkill1',
        inheritOriginSkillCooldownProgress: false,
      },
    ]);
  });

  it('compiles the native shield and sustained protection into the shield buff', () => {
    const definition = mifuGeneratedOperator.buffDefinitions?.buff_chr_0031_mifu_shield;

    expect(definition?.shields).toEqual([
      {
        infinityValue: false,
        value: { blackboardKey: 'FinalShield' },
        absorbCount: -1,
        absorbAllDamageWhenConsumed: false,
        removeBuffWhenConsumed: true,
        priority: 'normal',
        replaceHitEffect: true,
        damageAbsorptions: [],
      },
    ]);
    expect(definition?.sustainedProtection).toEqual({
      target: 'buffSource',
      superArmor: 35,
      impactResistance: 100,
    });
  });
});
