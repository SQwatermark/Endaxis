import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Swordmancer TAC Gloves',
  icon: '/equipment/item_equip_t4_suit_phy01_hand_01.webp',
  slotType: 'gloves',
  levelRequirement: 70,
  defense: 42,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
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
        stat: { modifier: 'dmgBonus', elements: 'physical' },
        target: 'self',
        value: [19.2, 21.1, 23, 24.9],
      },
    ],
  },
  setSlug: 'swordmancer',
};

export default sheet;
