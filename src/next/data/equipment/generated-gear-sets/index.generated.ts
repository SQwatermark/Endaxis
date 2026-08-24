import generatedGearSet0 from './suit_atk01.generated';
import generatedGearSet1 from './suit_combo_cd01.generated';

import type { GearSetDefinition } from '../../../core/game-data/equipmentDefinition';

export const generatedGearSetDefinitions = [
  generatedGearSet0,
  generatedGearSet1,
] as const satisfies readonly GearSetDefinition[];
