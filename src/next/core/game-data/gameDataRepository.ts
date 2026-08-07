/**
 * 编译和解析阶段访问版本化游戏数据的只读端口。
 * 具体数据源由应用层注入；核心不得借此读取项目状态、UI 状态或可变运行时对象。
 */
import type { OperatorDefinition } from './operatorDefinition';

/** 尚未展开的武器目录引用；面板解析器负责读取其完整定义。 */
export interface WeaponDefinitionRef {
  slug: string;
}

/** 尚未展开的装备目录引用；面板解析器负责读取其完整定义。 */
export interface GearDefinitionRef {
  slug: string;
}

export const MECHANIC_FAMILIES = ['stage', 'contingencyContract', 'seasonTower', 'custom'] as const;
/** 决定一项场景机制由哪类 Adapter 解释。 */
export type MechanicFamily = (typeof MECHANIC_FAMILIES)[number];

/** 机制目录当前允许暴露给项目编辑器的参数类型。 */
export type MechanicParameterType = 'boolean' | 'number' | 'string';

/** 一项机制参数的目录契约；项目值必须先按此定义校验。 */
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
