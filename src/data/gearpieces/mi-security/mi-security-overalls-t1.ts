import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'MI Security Overalls T1',
  icon: '/equipment/item_equip_t4_suit_criti01_body_03.webp',
  slotType: 'armor',
  levelRequirement: 70,
  defense: 56,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [87, 95, 104, 113],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [58, 63, 69, 75],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'critRate' },
        target: 'self',
        value: [5.2, 5.7, 6.2, 6.7],
      },
    ],
  },
  setSlug: 'mi-security',
};

export default sheet;
