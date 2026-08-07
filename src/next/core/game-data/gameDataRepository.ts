import type { OperatorDefinition } from './operatorDefinition';

export interface WeaponDefinitionRef {
  slug: string;
}

export interface GearDefinitionRef {
  slug: string;
}

export const MECHANIC_FAMILIES = ['stage', 'contingencyContract', 'seasonTower', 'custom'] as const;
export type MechanicFamily = (typeof MECHANIC_FAMILIES)[number];

export type MechanicParameterType = 'boolean' | 'number' | 'string';

export interface MechanicParameterDefinition {
  key: string;
  type: MechanicParameterType;
  required: boolean;
  defaultValue?: boolean | number | string;
}

/** 这里只保存目录元数据；可执行行为由机制适配器编译。 */
export interface MechanicDefinitionRef {
  id: string;
  family: MechanicFamily;
  revision: string;
  parameters: readonly MechanicParameterDefinition[];
}

/** 新核心使用的只读游戏数据边界。 */
export interface GameDataRepository {
  getOperator(slug: string): OperatorDefinition | null;
  getWeapon(slug: string): WeaponDefinitionRef | null;
  getGear(slug: string): GearDefinitionRef | null;
  getMechanic(id: string): MechanicDefinitionRef | null;
}
