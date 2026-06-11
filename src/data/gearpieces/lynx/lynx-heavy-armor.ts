import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'LYNX Heavy Armor',
  icon: '/equipment/item_equip_t4_suit_heal01_body_01.webp',
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
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [58, 63, 69, 75],
      },
    ],
  },
  skill3: {},
  setSlug: 'lynx',
};

export default sheet;
