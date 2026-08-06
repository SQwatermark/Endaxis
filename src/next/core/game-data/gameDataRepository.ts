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

/** Catalog metadata only; executable behavior is compiled by a mechanic adapter. */
export interface MechanicDefinitionRef {
  id: string;
  family: MechanicFamily;
  revision: string;
  parameters: readonly MechanicParameterDefinition[];
}

/** Read-only game data boundary used by the new core. */
export interface GameDataRepository {
  getOperator(slug: string): OperatorDefinition | null;
  getWeapon(slug: string): WeaponDefinitionRef | null;
  getGear(slug: string): GearDefinitionRef | null;
  getMechanic(id: string): MechanicDefinitionRef | null;
}
