import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 5,
  type: 'sword',
  icon: '/weapons/sword/wpn_sword_0020.webp',
  baseAtk: [42, 120, 203, 286, 369, 411],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'strength' },
        target: 'self',
        value: [16, 28, 41, 54, 67, 80, 92, 105, 124],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: 'cryo' },
        target: 'self',
        value: [4.4, 8, 11.6, 15.1, 18.7, 22.2, 25.8, 29.3, 34.7],
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
    ],
    triggers: [
      {
        trigger: {
          kind: 'onStatusApplied',
          status: 'solidification',
          target: 'enemy',
          skillTypes: 'battleSkill',
        },
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'increasedDmgTaken', elements: 'cryo' },
            target: 'enemy',
            value: [7, 8.4, 9.8, 11.2, 12.6, 14, 15.4, 16.8, 19.6],
            duration: 15,
          },
        ],
      },
    ],
  },
};

export default sheet;
