import type { OperatorDefinition } from './operatorDefinition';

export interface WeaponDefinitionRef {
  slug: string;
}

export interface GearDefinitionRef {
  slug: string;
}

/** Read-only game data boundary used by the new core. */
export interface GameDataRepository {
  getOperator(slug: string): OperatorDefinition | null;
  getWeapon(slug: string): WeaponDefinitionRef | null;
  getGear(slug: string): GearDefinitionRef | null;
}
