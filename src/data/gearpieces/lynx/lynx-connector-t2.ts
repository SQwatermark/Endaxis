import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'LYNX Connector T2',
  icon: '/equipment/item_equip_t4_suit_heal01_edc_02.webp',
  slotType: 'kit',
  levelRequirement: 70,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
        target: 'self',
        value: [41, 45, 49, 53],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'hpPercent' },
        target: 'self',
        value: [41.4, 45.5, 49.7, 53.8],
      },
    ],
  },
  setSlug: 'lynx',
};

export default sheet;
