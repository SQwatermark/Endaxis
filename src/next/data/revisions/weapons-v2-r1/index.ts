import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';
import pistol from './wpn_pistol_0005';
import sword from './wpn_sword_0010';

export const WEAPON_V2_R1_REVISION = 'endaxis-next-definitions-v2-weapons-1.4.4-r1';

/** r1→r2 仅改变两项运行定义。共享未变项，整库 r1 哈希禁止未来生成时无声改写历史。 */
export function restoreWeaponV2R1Definitions(
  current: readonly WeaponDefinition[],
): readonly WeaponDefinition[] {
  const overrides: readonly WeaponDefinition[] = [pistol, sword];
  return current.map(definition => {
    const previous = overrides.find(override => override.slug === definition.slug);
    // r1 正式注册的展示身份与 r2 相同；原始候选中的资源 ID 不作为 UI 展示 slug。
    return previous ? { ...previous, assetSlug: definition.assetSlug } : definition;
  });
}
