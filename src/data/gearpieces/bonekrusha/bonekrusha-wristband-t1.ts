import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Bonekrusha Wristband T1',
  icon: '/equipment/item_equip_t4_suit_attri01_hand_02.webp',
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
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
        target: 'self',
        value: [43, 47, 51, 55],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'cryo' },
        target: 'self',
        value: [19.2, 21.1, 23, 24.9],
      },
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'electric' },
        target: 'self',
        value: [19.2, 21.1, 23, 24.9],
      },
    ],
  },
  setSlug: 'bonekrusha',
};

export default sheet;
