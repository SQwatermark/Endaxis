import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';
import claym13 from './wpn_claym_0013';
import claym17 from './wpn_claym_0017';
import lance6 from './wpn_lance_0006';
import sword15 from './wpn_sword_0015';
import sword17 from './wpn_sword_0017';

export const WEAPON_V2_R2_REVISION = 'endaxis-next-definitions-v2-weapons-1.4.4-r2';

/** r2→r3 的五项差量快照；其余项由整库旧哈希约束，禁止随未来生成静默改写。 */
export function restoreWeaponV2R2Definitions(
  current: readonly WeaponDefinition[],
): readonly WeaponDefinition[] {
  const overrides: readonly WeaponDefinition[] = [claym13, claym17, lance6, sword15, sword17];
  return current.map(definition => {
    const previous = overrides.find(override => override.slug === definition.slug);
    return previous ? { ...previous, assetSlug: definition.assetSlug } : definition;
  });
}
