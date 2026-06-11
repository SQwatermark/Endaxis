import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Bonekrusha Poncho T1',
  icon: '/equipment/item_equip_t4_suit_attri01_body_04.webp',
  slotType: 'armor',
  levelRequirement: 70,
  defense: 56,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [87, 95, 104, 113],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: [58, 63, 69, 75],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'ultimateGainEfficiency' },
        target: 'self',
        value: [12.3, 13.6, 14.8, 16],
      },
    ],
  },
  setSlug: 'bonekrusha',
};

export default sheet;
