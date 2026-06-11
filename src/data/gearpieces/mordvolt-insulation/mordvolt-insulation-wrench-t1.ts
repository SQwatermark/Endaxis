import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Mordvolt Insulation Wrench T1',
  icon: '/equipment/item_equip_t2_suit_wisd01_edc_02.webp',
  slotType: 'kit',
  levelRequirement: 36,
  defense: 10,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: 21,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'cryo' },
        target: 'self',
        value: 11.7,
      },
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'electric' },
        target: 'self',
        value: 11.7,
      },
    ],
  },
  setSlug: 'mordvolt-insulation',
};

export default sheet;
