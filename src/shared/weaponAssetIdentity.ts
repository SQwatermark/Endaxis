/** 原生武器 ID 前缀到项目版本化图标资产前缀的唯一映射。 */
export const NATIVE_WEAPON_ASSET_PREFIX_REPLACEMENTS = [
  ['wpn_claym_', 'wpn_greatsword_'],
  ['wpn_lance_', 'wpn_polearm_'],
  ['wpn_pistol_', 'wpn_handcannon_'],
  ['wpn_funnel_', 'wpn_artsunit_'],
] as const;

/** 原生 ItemTable iconId 到项目图标 basename；未知前缀保持原值。 */
export function projectNativeWeaponAssetIdentity(iconId: string): string {
  const replacement = NATIVE_WEAPON_ASSET_PREFIX_REPLACEMENTS.find(([prefix]) =>
    iconId.startsWith(prefix),
  );
  return replacement === undefined ? iconId : iconId.replace(replacement[0], replacement[1]);
}
