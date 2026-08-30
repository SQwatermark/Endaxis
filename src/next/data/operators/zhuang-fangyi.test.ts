import { describe, expect, it } from 'vitest';
import { compileOperatorDefinitionSkills } from '../../core/compiler/compileScenarioTimeline';
import type { OperatorInstanceDocument } from '../../core/project/schema';
import definition from './generated-definitions/zhuang-fangyi/zhuang-fangyi.operator.generated';
import { zhuangFangyi } from './zhuang-fangyi';

function buildAtLevel(skillLevel: number): OperatorInstanceDocument {
  return {
    operatorSlug: zhuangFangyi.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: {
      basicAttack: skillLevel,
      battleSkill: skillLevel,
      comboSkill: skillLevel,
      ultimate: skillLevel,
    },
    talentStates: {},
  };
}

describe('next Zhuang Fangyi definition', () => {
  it('uses the complete generated definition through the stable operator entry', () => {
    expect(zhuangFangyi).toBe(definition);
    expect(zhuangFangyi.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
  });

  it('keeps all fifteen player skills plus the runtime-only ultimate exit', () => {
    expect(zhuangFangyi.skillGroups.map(group => group.key)).toEqual([
      'basicAttack',
      'finisher',
      'plungingAttack',
      'battleSkill',
      'comboSkill',
      'ultimate',
      'enhancedBasicAttack',
    ]);
    const battle = zhuangFangyi.skillGroups.find(group => group.key === 'battleSkill');
    const combo = zhuangFangyi.skillGroups.find(group => group.key === 'comboSkill');
    expect(battle?.replacementSkills?.map(skill => skill.key)).toEqual(['enhancedBattleSkill']);
    expect(combo?.replacementSkills?.map(skill => skill.key)).toEqual(['enhancedComboSkill']);

    const skills = zhuangFangyi.skillGroups.flatMap(group => [
      ...(Array.isArray(group.skills) ? group.skills : [group.skills]),
      ...(group.replacementSkills ?? []),
    ]);
    expect(skills).toHaveLength(16);
    expect(new Set(skills.map(skill => skill.key)).size).toBe(16);
    expect(skills.every(skill => skill.scheduledSequences.length > 0)).toBe(true);
  });

  it('preserves both talent slots and all five potential slots', () => {
    expect(zhuangFangyi.talents.map(talent => talent.key)).toEqual(['talent1', 'talent2']);
    expect(zhuangFangyi.talents.every(talent => (talent.passiveSkills?.length ?? 0) > 0)).toBe(
      true,
    );
    expect(zhuangFangyi.potentials.map(potential => potential.key)).toEqual([
      'potential1',
      'potential2',
      'potential3',
      'potential4',
      'potential5',
    ]);
  });

  it('switches both enhanced skill slots for the lifetime of the ultimate Buff', () => {
    const ultimateBuff = zhuangFangyi.buffDefinitions?.buff_chr_0030_zhuangfy_ult_base;
    expect(ultimateBuff?.skillSlotReplacements).toEqual([
      {
        skillGroupKey: 'battleSkill',
        targetSkillKey: 'enhancedBattleSkill',
        revertedSkillKey: 'battleSkill',
        inheritOriginSkillCooldownProgress: false,
      },
      {
        skillGroupKey: 'comboSkill',
        targetSkillKey: 'enhancedComboSkill',
        revertedSkillKey: 'comboSkill',
        inheritOriginSkillCooldownProgress: true,
      },
    ]);
  });

  it.each(Array.from({ length: 12 }, (_, index) => index + 1))(
    'compiles every skill at level %i',
    skillLevel => {
      expect(() =>
        compileOperatorDefinitionSkills(
          'zhuang-fangyi-instance',
          buildAtLevel(skillLevel),
          zhuangFangyi,
        ),
      ).not.toThrow();
    },
  );
});
