import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 5,
  type: 'sword',
  icon: '/weapons/sword/wpn_sword_0007.webp',
  baseAtk: [42, 120, 203, 286, 369, 411],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: [16, 28, 41, 54, 67, 80, 92, 105, 124],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'ultimateGainEfficiency' },
        target: 'self',
        value: [4.8, 8.6, 12.4, 16.2, 20, 23.8, 27.6, 31.4, 37.1],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'atkPercent' },
        target: 'self',
        value: [5, 6, 7, 8, 9, 10, 11, 12, 14],
      },
      {
        kind: 'status',
        stat: { modifier: 'artsIntensity' },
        target: 'self',
        value: [25, 30, 35, 40, 45, 50, 55, 60, 70],
      },
    ],
  },
};

export default sheet;
