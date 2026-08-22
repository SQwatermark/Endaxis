/**
 * 决定一个技能块在模拟、显示和编辑时使用哪份技能定义。
 * 编译、投影和后续编辑器必须复用这里；各层不得自己推断定义来源。
 */
import type {
  OperatorDefinition,
  SkillDefinition,
  SkillGroupDefinition,
  SkillLevelSource,
} from '../game-data/operatorDefinition';
import type { SkillCastDocument } from '../project/schema';

/** 一次技能释放使用的技能定义及其所属技能组。 */
export interface ResolvedSkillDefinition {
  /** 模拟和显示使用的技能定义。自定义定义优先，否则使用技能模板。 */
  readonly definition: SkillDefinition;
  /** 定义所属的技能组（提供 skillType 与 levelSource）。 */
  readonly group: SkillGroupDefinition;
  /** 基础链使用组等级；具名形态可以明确改用另一养成技能等级。 */
  readonly levelSource: SkillLevelSource;
  readonly variantKey?: string;
}

/** 解析技能块当前引用的游戏数据模板，不考虑完整自定义覆盖。 */
export function resolveSkillTemplateDefinition(
  cast: SkillCastDocument,
  operator: OperatorDefinition,
): ResolvedSkillDefinition {
  const source = cast.source;
  if (source.kind !== 'operatorSkill') {
    throw new Error(`skill cast '${cast.id}' uses unsupported source kind '${source.kind}'`);
  }

  const directGroup = operator.skillGroups.find(
    candidate => candidate.key === source.skillGroupKey,
  );
  const directSkills =
    directGroup === undefined
      ? []
      : Array.isArray(directGroup.skills)
        ? directGroup.skills
        : [directGroup.skills];
  const directDefinition = directSkills.find(candidate => candidate.key === source.skillKey);
  const directVariant = directGroup?.variants?.find(variant =>
    (Array.isArray(variant.skills) ? variant.skills : [variant.skills]).some(
      candidate => candidate.key === source.skillKey,
    ),
  );
  const alias =
    directDefinition === undefined && directVariant === undefined
      ? operator.skillAliases?.find(
          candidate =>
            candidate.from[0] === source.skillGroupKey && candidate.from[1] === source.skillKey,
        )
      : undefined;
  const groupKey = alias?.to[0] ?? source.skillGroupKey;
  const skillKey = alias?.to[1] ?? source.skillKey;
  const group = operator.skillGroups.find(candidate => candidate.key === groupKey);
  if (group === undefined) {
    throw new Error(`operator '${operator.slug}' has no skill group '${source.skillGroupKey}'`);
  }
  const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
  const definition = skills.find(candidate => candidate.key === skillKey);
  const variant =
    definition === undefined
      ? group.variants?.find(candidate =>
          (Array.isArray(candidate.skills) ? candidate.skills : [candidate.skills]).some(
            skill => skill.key === skillKey,
          ),
        )
      : undefined;
  const variantDefinition =
    variant === undefined
      ? undefined
      : (Array.isArray(variant.skills) ? variant.skills : [variant.skills]).find(
          candidate => candidate.key === skillKey,
        );
  const resolvedDefinition = definition ?? variantDefinition;
  if (resolvedDefinition === undefined) {
    throw new Error(
      `skill group '${operator.slug}/${group.key}' has no skill '${source.skillKey}'`,
    );
  }
  return {
    definition: resolvedDefinition,
    group,
    levelSource: variant?.levelSource ?? group.levelSource,
    ...(variant === undefined ? {} : { variantKey: variant.key }),
  };
}

/**
 * 统一处理技能模板与自定义技能定义，调用方不应自行重复选择逻辑。
 * 先按 `source.kind` 确认来源类型，再决定定义来源：
 * - 已脱离模板（存在 `customDefinition`）：使用它，且 key 必须与 `source.skillKey` 一致；
 * - 未编辑块：从干员目录按 `source.skillGroupKey`/`source.skillKey` 反查。
 *
 * 调用方仍需按当前技能等级解析 `LevelValues`，并应用构筑修正。
 */
export function resolveEffectiveSkillDefinition(
  cast: SkillCastDocument,
  operator: OperatorDefinition,
): ResolvedSkillDefinition {
  const source = cast.source;
  if (source.kind !== 'operatorSkill') {
    throw new Error(`skill cast '${cast.id}' uses unsupported source kind '${source.kind}'`);
  }

  const template = resolveSkillTemplateDefinition(cast, operator);

  if (cast.customDefinition !== undefined) {
    const definition = cast.customDefinition;
    if (definition.key !== source.skillKey) {
      throw new Error(
        `custom definition key '${definition.key}' does not match source skill key '${source.skillKey}'`,
      );
    }
    return {
      definition,
      group: template.group,
      levelSource: template.levelSource,
      ...(template.variantKey === undefined ? {} : { variantKey: template.variantKey }),
    };
  }
  return template;
}
