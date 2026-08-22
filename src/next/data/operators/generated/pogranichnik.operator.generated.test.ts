import { describe, expect, it } from 'vitest';
import { pogranichnikGeneratedOperator } from './pogranichnik.operator.generated';

describe('pogranichnik generated operator', () => {
  it('keeps physical infliction, soldier variants, and both talent programs executable', () => {
    const battle = pogranichnikGeneratedOperator.skillGroups.find(
      group => group.key === 'battleSkill',
    );
    const ultimate = pogranichnikGeneratedOperator.skillGroups.find(
      group => group.key === 'ultimate',
    );
    const talent1 = pogranichnikGeneratedOperator.talents[0];
    const talent2 = pogranichnikGeneratedOperator.talents[1];
    const serializedBattle = JSON.stringify(battle);
    const serializedUltimate = JSON.stringify(ultimate);
    const serializedTalent1 = JSON.stringify(talent1);

    expect(pogranichnikGeneratedOperator.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
    expect(serializedBattle).toContain('applyPhysicalInfliction');
    expect(serializedUltimate).toContain('abilityentity_chr_0029_pograni_ultimate_skill');
    expect(serializedUltimate).toContain("chr_0029_pograni_ultimate_skill_abilityentity");
    expect(
      pogranichnikGeneratedOperator.abilityEntityDefinitions?.[
        'abilityentity_chr_0029_pograni_ultimate_skill'
      ]?.childSkill?.skillId,
    ).toBe('chr_0029_pograni_ultimate_skill_abilityentity_finish4');
    expect(serializedTalent1).toContain('spGained');
    expect(serializedTalent1).toContain('storeEventSpGainAmount');
    expect(talent2?.passiveSkills?.[0]?.blackboard?.duration).toEqual([5, 10]);
  });
});
