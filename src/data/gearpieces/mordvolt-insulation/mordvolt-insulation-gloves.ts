import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Mordvolt Insulation Gloves',
  icon: '/equipment/item_equip_t2_suit_wisd01_hand_01.webp',
  slotType: 'gloves',
  levelRequirement: 36,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: 33,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: 22,
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: ['heat', 'cryo', 'electric', 'nature'] },
        target: 'self',
        value: 9.2,
      },
    ],
  },
  setSlug: 'mordvolt-insulation',
};

export default sheet;
