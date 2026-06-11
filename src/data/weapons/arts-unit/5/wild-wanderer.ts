import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 5,
  type: 'arts-unit',
  icon: '/weapons/arts-unit/wpn_artsunit_0004.webp',
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
        stat: { modifier: 'dmgBonus', elements: 'electric' },
        target: 'self',
        value: [4.4, 8, 11.6, 15.1, 18.7, 22.2, 25.8, 29.3, 34.7],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'artsIntensity' },
        target: 'self',
        value: [10, 12, 14, 16, 18, 20, 22, 24, 28],
      },
    ],
    triggers: [
      {
        trigger: {
          kind: 'onStatusApplied',
          status: 'electrification',
          target: 'enemy',
        },
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'dmgBonus', elements: ['physical', 'electric'] },
            target: 'team',
            value: [8, 9.6, 11.2, 12.8, 14.4, 16, 17.6, 19.2, 22.4],
            duration: 15,
          },
        ],
      },
    ],
  },
};

export default sheet;
