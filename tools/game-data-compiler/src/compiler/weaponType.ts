import type { WeaponTypeSource } from '../source/weaponType.ts';

/** Endaxis 当前用于干员与武器兼容性校验的五类稳定身份。 */
export type ProjectedWeaponTypeSource =
  'sword' | 'greatsword' | 'polearm' | 'handcannon' | 'arts-unit';

const PROJECTED_WEAPON_TYPES: Readonly<
  Partial<Record<WeaponTypeSource, ProjectedWeaponTypeSource>>
> = {
  Sword: 'sword',
  Wand: 'arts-unit',
  Claymores: 'greatsword',
  Lance: 'polearm',
  Pistol: 'handcannon',
};

/**
 * 将同一个原生 WeaponType 投影为 OperatorDefinition 与 WeaponDefinition 共用的兼容性身份。
 * 原生 None/Gun 当前没有对应的 Next 类型，遇到时必须回到数据证据补边界。
 */
export function projectWeaponType(
  weaponType: WeaponTypeSource,
  path: string,
): ProjectedWeaponTypeSource {
  const result = PROJECTED_WEAPON_TYPES[weaponType];
  if (result === undefined) {
    throw new Error(`${path}: WeaponType ${weaponType} has no supported Next projection`);
  }
  return result;
}
