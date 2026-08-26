import type {
  ComboSkillConditionDefinition,
  OperatorDefinition,
  SkillDefinition,
} from './operatorDefinition';

/** 新编译器已接管的角色常驻字段；迁移完成后可直接成为完整 OperatorDefinition 的组成部分。 */
export interface OperatorRuntimeDefinition {
  readonly operatorSlug: string;
  readonly entityBlackboard: Readonly<Record<string, number | string>>;
  readonly comboSkillConditions: readonly ComboSkillConditionDefinition[];
  readonly skillMetadata: readonly {
    readonly skillGroupKey: string;
    readonly sourceSkillId: string;
    readonly costFrame: number;
    readonly comboSmartTarget?: 'input' | 'trigger';
  }[];
}

/** 按明确来源身份安装，不根据名称/前缀猜技能。不会修改传入的旧迁移 oracle。 */
export function applyOperatorRuntimeDefinition(
  base: OperatorDefinition,
  runtime: OperatorRuntimeDefinition,
): OperatorDefinition {
  if (base.slug !== runtime.operatorSlug)
    throw new Error('operator runtime definition identity mismatch');
  if (base.comboSkillConditions !== undefined || (base.comboSkillRegistrations?.length ?? 0) > 0)
    throw new Error(`operator '${base.slug}' already owns combo conditions`);
  for (const [key, value] of Object.entries(base.entityBlackboard ?? {})) {
    if (Object.hasOwn(runtime.entityBlackboard, key) && runtime.entityBlackboard[key] !== value)
      throw new Error(`operator '${base.slug}' has conflicting template value '${key}'`);
  }
  const seen = new Set<string>();
  for (const metadata of runtime.skillMetadata) {
    if (seen.has(metadata.sourceSkillId))
      throw new Error(`duplicate runtime skill metadata '${metadata.sourceSkillId}'`);
    seen.add(metadata.sourceSkillId);
  }
  const matched = new Map<string, number>();
  const skillGroups = base.skillGroups.map(group => {
    const update = (skill: SkillDefinition): SkillDefinition => {
      const metadata = runtime.skillMetadata.find(
        item => item.skillGroupKey === group.key && item.sourceSkillId === skill.sourceSkillId,
      );
      if (metadata === undefined) return skill;
      if (group.skillType !== 'comboSkill')
        throw new Error('combo metadata must bind to a combo skill group');
      if (
        (skill.costFrame !== undefined && skill.costFrame !== metadata.costFrame) ||
        (skill.comboSmartTarget !== undefined &&
          skill.comboSmartTarget !== metadata.comboSmartTarget)
      )
        throw new Error(`conflicting runtime cast metadata '${metadata.sourceSkillId}'`);
      matched.set(metadata.sourceSkillId, (matched.get(metadata.sourceSkillId) ?? 0) + 1);
      return {
        ...skill,
        costFrame: metadata.costFrame,
        ...(metadata.comboSmartTarget === undefined
          ? {}
          : { comboSmartTarget: metadata.comboSmartTarget }),
      };
    };
    const updateSet = (skills: SkillDefinition | readonly SkillDefinition[]) =>
      Array.isArray(skills) ? skills.map(update) : update(skills as SkillDefinition);
    return {
      ...group,
      skills: updateSet(group.skills),
      ...(group.variants === undefined
        ? {}
        : {
            variants: group.variants.map(variant => ({
              ...variant,
              skills: updateSet(variant.skills),
            })),
          }),
      ...(group.replacementSkills === undefined
        ? {}
        : { replacementSkills: group.replacementSkills.map(update) }),
    };
  });
  for (const metadata of runtime.skillMetadata)
    if (matched.get(metadata.sourceSkillId) !== 1)
      throw new Error(`runtime metadata '${metadata.sourceSkillId}' must match exactly one skill`);
  return {
    ...base,
    entityBlackboard: { ...base.entityBlackboard, ...runtime.entityBlackboard },
    comboSkillConditions: runtime.comboSkillConditions,
    skillGroups,
  };
}
