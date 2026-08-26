import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';
import artsUnits from './arts-unit';
import greatswords from './greatsword';
import handcannons from './handcannon';
import polearms from './polearm';
import swords from './sword';

export const LEGACY_WEAPON_REVISION = 'endaxis-next-definitions-v1';
/** 固定的武器迁移来源，不代表整个历史客户端模拟库。 */
export const legacyWeaponDefinitions: readonly WeaponDefinition[] = Object.freeze([
  ...artsUnits,
  ...greatswords,
  ...handcannons,
  ...polearms,
  ...swords,
]);
