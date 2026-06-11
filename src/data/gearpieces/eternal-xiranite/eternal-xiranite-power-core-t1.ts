import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Eternal Xiranite Power Core T1',
  icon: '/equipment/item_equip_t4_suit_usp02_edc_02.webp',
  slotType: 'kit',
  levelRequirement: 70,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [32, 35, 38, 41],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [21, 23, 25, 27],
      },
    ],
  },
  skill3: {},
  setSlug: 'eternal-xiranite',
};

export default sheet;
