import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Swordmancer Dagger',
  icon: '/equipment/item_equip_t4_suit_phy01_edc_04.webp',
  slotType: 'kit',
  levelRequirement: 70,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: [32, 35, 38, 41],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
        target: 'self',
        value: [21, 23, 25, 27],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', skillTypes: 'ultimate' },
        target: 'self',
        value: [51.7, 56.9, 62.1, 67.3],
      },
    ],
  },
  setSlug: 'swordmancer',
};

export default sheet;
