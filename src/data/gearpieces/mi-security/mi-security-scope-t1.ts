import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'MI Security Scope T1',
  icon: '/equipment/item_equip_t4_suit_criti01_edc_06.webp',
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
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [21, 23, 25, 27],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'critRate' },
        target: 'self',
        value: [10.3, 11.4, 12.4, 13.5],
      },
    ],
  },
  setSlug: 'mi-security',
};

export default sheet;
