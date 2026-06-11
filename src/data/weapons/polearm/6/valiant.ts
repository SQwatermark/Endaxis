import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 6,
  type: 'polearm',
  icon: '/weapons/polearm/wpn_polearm_0010.webp',
  baseAtk: [50, 145, 245, 345, 445, 495],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: [20, 36, 52, 68, 84, 100, 116, 132, 156],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'physical' },
        target: 'self',
        value: [5.6, 10, 14.4, 18.9, 23.3, 27.8, 32.2, 36.7, 43.3],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'atkPercent' },
        target: 'self',
        value: [10, 12, 14, 16, 18, 20, 22, 24, 28],
      },
    ],
    triggers: [
      {
        trigger: {
          kind: 'onStatusApplied',
          status: ['lift', 'knockdown', 'crush', 'breach'],
          target: 'enemy',
        },
        effects: [
          {
            kind: 'damageHit',
            element: 'physical',
            multiplier: [120, 144, 168, 192, 216, 240, 264, 288, 366],
          },
        ],
      },
    ],
  },
};

export default sheet;
