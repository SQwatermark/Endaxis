import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Redeemer Armor',
  icon: '/equipment/item_equip_t4_parts_wuling01_body_02.webp',
  slotType: 'armor',
  levelRequirement: 70,
  defense: 56,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [115, 126, 138, 149],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'ultimateGainEfficiency' },
        target: 'self',
        value: [12.9, 14.1, 15.4, 16.7],
      },
    ],
  },
  setSlug: 'no-set-bonuses',
};

export default sheet;
