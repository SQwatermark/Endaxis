/**
 * Next UI 对旧版养成范围与装备展示规则的集中适配。
 *
 * 这些规则目前仅服务于实例编辑界面，不属于 Next 项目模型或战斗运行时。调用方应使用
 * 本文件导出的 Next 侧类型；未来目录原生提供约束后，可在这里切换实现而不影响组件。
 */
import { getOperatorSkillMax as getLegacyOperatorSkillMax } from '@/utils/operatorBounds';
import { skillLevelLabel as getLegacySkillLevelLabel } from '@/utils/operatorBounds';
import { getSkillBounds as getLegacyWeaponSkillBounds } from '@/utils/weaponBounds';
import {
  getEquipmentLevelColor as getLegacyEquipmentLevelColor,
  isEquipmentArtificable as isLegacyEquipmentArtificable,
} from '@/utils/equipmentLevels';

export type NextOperatorLevel = 1 | 20 | 40 | 60 | 80 | 90;
export type NextWeaponLevel = 1 | 20 | 40 | 60 | 80 | 90;

export interface WeaponTraitLevelBounds {
  readonly min: number;
  readonly max: number;
}

export interface WeaponTraitBounds {
  readonly skill1: WeaponTraitLevelBounds;
  readonly skill2: WeaponTraitLevelBounds;
  readonly skill3: WeaponTraitLevelBounds;
}

export function getOperatorSkillMax(level: NextOperatorLevel, promoted: boolean): number {
  return getLegacyOperatorSkillMax(level, promoted);
}

export function formatOperatorSkillLevel(level: number): string {
  return getLegacySkillLevelLabel(level);
}

export function getWeaponTraitBounds(
  level: NextWeaponLevel,
  tuned: boolean,
  potential: number,
): WeaponTraitBounds {
  return getLegacyWeaponSkillBounds(level, tuned, potential);
}

export function getEquipmentLevelColor(level: number | string | null | undefined): string {
  return getLegacyEquipmentLevelColor(level);
}

export function isEquipmentArtificable(level: number | string | null | undefined): boolean {
  return isLegacyEquipmentArtificable(level);
}
