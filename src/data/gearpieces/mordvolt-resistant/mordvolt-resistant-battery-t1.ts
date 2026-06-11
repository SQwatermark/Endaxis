import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Mordvolt Resistant Battery T1',
  icon: '/equipment/item_equip_t3_suit_will01_edc_01.webp',
  slotType: 'kit',
  levelRequirement: 50,
  defense: 15,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: 23,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: 15,
      },
    ],
  },
  skill3: {},
  setSlug: 'mordvolt-resistant',
};

export default sheet;
