import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Redeemer Seal',
  icon: '/equipment/item_equip_t4_parts_wuling01_edc_03.webp',
  slotType: 'kit',
  levelRequirement: 70,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [43, 47, 51, 55],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'ultimateGainEfficiency' },
        target: 'self',
        value: [25.7, 28.3, 30.9, 33.4],
      },
    ],
  },
  setSlug: 'no-set-bonuses',
};

export default sheet;
