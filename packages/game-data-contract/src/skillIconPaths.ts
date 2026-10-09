import type { OperatorWeaponType, SkillType } from './primitives.ts';

/** 技能默认图标的文件约定，供生成器与显示层共用。 */
export function operatorSkillIconFile(skillType: SkillType, index = '01'): string | null {
  const name =
    skillType === 'battleSkill'
      ? 'battle'
      : skillType === 'comboSkill'
        ? 'combo'
        : skillType === 'ultimate'
          ? 'ultimate'
          : null;
  return name === null ? null : `${name} ${index}.webp`;
}

export function defaultOperatorSkillIconPath(
  slug: string,
  weaponType: OperatorWeaponType,
  skillType: SkillType,
): string {
  const file = operatorSkillIconFile(skillType);
  return file ? `/operators/${slug}/${file}` : `/icons/icon_attack_${weaponType}.webp`;
}
