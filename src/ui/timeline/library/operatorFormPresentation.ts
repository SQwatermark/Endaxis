import type { OperatorSkillDefinitionBinding } from '../../../core/game-data/operatorSkillDefinitions';
import { defaultOperatorSkillIconPath } from '../../../../packages/game-data-contract/src/skillIconPaths';
/**
 * 根据干员最终面板判断当前展示形态。
 * 形态条件来自干员定义，调用方只需提供已经计算完成的面板属性；本文件不包含任何干员特例。
 */
import type { OperatorPanelAttributes } from '../../../core/compiler/resolveOperatorPanel';
import type { OperatorDefinition } from '../../../core/game-data/operatorDefinition';
import { compareCombatNumbers } from '../../../core/mechanics/combatNumbers.ts';

export function resolveOperatorPresentationFormKey(
  definition: Readonly<OperatorDefinition>,
  attributes: Readonly<OperatorPanelAttributes>,
): string | null {
  for (const group of definition.skillGroups) {
    for (const variant of group.presentationVariants ?? []) {
      if (
        compareCombatNumbers(
          attributes[variant.condition.left],
          attributes[variant.condition.right],
          variant.condition.operator,
        )
      ) {
        return variant.key;
      }
    }
  }
  return null;
}

/** 条件覆盖、显式路径、技能类型默认图标，按此顺序解析。 */
export function resolveOperatorSkillIcon(
  { skill, group }: OperatorSkillDefinitionBinding,
  formKey: string | null,
  operator: Pick<OperatorDefinition, 'slug' | 'assetSlug' | 'weaponType'>,
): string {
  const slug = operator.assetSlug ?? operator.slug;
  const fallback = defaultOperatorSkillIconPath(slug, operator.weaponType, skill.skillType);
  if (['basicAttack', 'plungingAttack', 'finisher'].includes(skill.skillType)) return fallback;
  const iconName =
    (skill.useSkillGroupIcon
      ? group.presentationVariants?.find(variant => variant.key === formKey)?.iconName
      : undefined) ?? skill.iconName;
  return iconName ? `/operators/${slug}/${iconName}.webp` : fallback;
}
