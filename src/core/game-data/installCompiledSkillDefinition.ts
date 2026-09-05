import type {
  OperatorDefinition,
  SkillDefinition,
  SkillGroupDefinition,
} from './operatorDefinition';

/**
 * 用完整动作图编译产物替换旧转换器中的同源技能，同时保留干员其余已转换数据。
 * 匹配只使用原生 sourceSkillId，并要求全干员定义中恰好命中一次。
 */
export function installCompiledSkillDefinition(
  operator: OperatorDefinition,
  compiled: SkillDefinition,
  supplementalBuffDefinitions: NonNullable<OperatorDefinition['buffDefinitions']> = {},
): OperatorDefinition {
  if (!compiled.sourceSkillId) throw new Error('compiled skill definition requires sourceSkillId');
  let matches = 0;
  const replace = (skill: SkillDefinition): SkillDefinition => {
    if (skill.sourceSkillId !== compiled.sourceSkillId) return skill;
    matches += 1;
    if (skill.key !== compiled.key)
      throw new Error(
        `compiled skill '${compiled.sourceSkillId}' key mismatch: '${skill.key}' != '${compiled.key}'`,
      );
    return compiled;
  };
  const replaceSet = (
    skills: SkillDefinition | readonly SkillDefinition[],
  ): SkillDefinition | readonly SkillDefinition[] =>
    Array.isArray(skills) ? skills.map(replace) : replace(skills as SkillDefinition);
  const replaceGroup = (group: SkillGroupDefinition): SkillGroupDefinition => ({
    ...group,
    skills: replaceSet(group.skills),
    ...(group.variants === undefined
      ? {}
      : {
          variants: group.variants.map(variant => ({
            ...variant,
            skills: replaceSet(variant.skills),
          })),
        }),
    ...(group.replacementSkills === undefined
      ? {}
      : { replacementSkills: group.replacementSkills.map(replace) }),
    ...(group.routedReplacementSkills === undefined
      ? {}
      : {
          routedReplacementSkills: group.routedReplacementSkills.map(routed => ({
            ...routed,
            skill: replace(routed.skill),
          })),
        }),
  });
  const result = {
    ...operator,
    skillGroups: operator.skillGroups.map(replaceGroup),
    buffDefinitions: {
      ...supplementalBuffDefinitions,
      ...operator.buffDefinitions,
    },
  };
  if (matches !== 1)
    throw new Error(
      `compiled skill '${compiled.sourceSkillId}' must match exactly once; matched ${matches}`,
    );
  return result;
}
