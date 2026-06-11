import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Frontiers Blight RES Gloves',
  icon: '/equipment/item_equip_t4_suit_atb01_hand_01.webp',
  slotType: 'gloves',
  levelRequirement: 70,
  defense: 42,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: [65, 71, 78, 84],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [43, 47, 51, 55],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', skillTypes: 'battleSkill' },
        target: 'self',
        value: [34.5, 38, 41.4, 44.9],
      },
    ],
  },
  setSlug: 'frontiers',
};

export default sheet;
