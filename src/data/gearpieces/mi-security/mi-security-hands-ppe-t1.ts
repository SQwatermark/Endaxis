import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'MI Security Hands PPE T1',
  icon: '/equipment/item_equip_t4_suit_criti01_hand_03.webp',
  slotType: 'gloves',
  levelRequirement: 70,
  defense: 42,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [65, 71, 78, 84],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [43, 47, 51, 55],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'critRate' },
        target: 'self',
        value: [8.6, 9.5, 10.3, 11.2],
      },
    ],
  },
  setSlug: 'mi-security',
};

export default sheet;
