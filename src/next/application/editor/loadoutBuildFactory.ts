/**
 * 把只读定义转换为可编辑的初始养成实例。
 * 这里集中的是编辑器默认策略，不是游戏事实；调用方必须提供文档身份，并可在创建后通过命令修改。
 */
import type { GearDefinition, WeaponDefinition } from '../../core/game-data/equipmentDefinition';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import type {
  GearBuildDocument,
  OperatorBuildDocument,
  WeaponBuildDocument,
} from '../../core/project/schema';

export function createDefaultOperatorBuild(
  id: string,
  operator: OperatorDefinition,
): OperatorBuildDocument {
  const skillLevels = Object.fromEntries(
    [...new Set(operator.skillGroups.map(group => group.levelSource))].map(source => [source, 12]),
  );
  return {
    id,
    operatorSlug: operator.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels,
    talentStates: {},
  };
}

export function createDefaultWeaponBuild(
  id: string,
  weapon: WeaponDefinition,
): WeaponBuildDocument {
  return {
    id,
    weaponSlug: weapon.slug,
    level: 90,
    tuned: true,
    potential: 0,
    traitLevels: weapon.traits.map(() => 1),
  };
}

export function createDefaultGearBuild(
  id: string,
  gear: GearDefinition,
  artificingTier: number,
): GearBuildDocument {
  return {
    id,
    gearSlug: gear.slug,
    artificingLevels: gear.traits.map(() => artificingTier),
  };
}
