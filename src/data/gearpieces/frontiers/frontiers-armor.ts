import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Frontiers Armor',
  icon: '/equipment/item_equip_t4_suit_atb01_body_01.webp',
  slotType: 'armor',
  levelRequirement: 70,
  defense: 56,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
        target: 'self',
        value: [87, 95, 104, 113],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [58, 63, 69, 75],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', skillTypes: 'ultimate' },
        target: 'self',
        value: [25.9, 28.5, 31.1, 33.6],
      },
    ],
  },
  setSlug: 'frontiers',
};

export default sheet;
