import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 5,
  type: 'handcannon',
  icon: '/weapons/handcannon/wpn_handcannon_0006.webp',
  baseAtk: [42, 120, 203, 286, 369, 411],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: [16, 28, 41, 54, 67, 80, 92, 105, 124],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: ['heat', 'cryo', 'electric', 'nature'] },
        target: 'self',
        value: [4.4, 8, 11.6, 15.1, 18.7, 22.2, 25.8, 29.3, 34.7],
      },
    ],
  },
  skill3: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'critRate' },
        target: 'self',
        value: [3, 3.6, 4.2, 4.8, 5.4, 6, 6.6, 7.2, 8.4],
      },
    ],
    triggers: [
      {
        trigger: {
          kind: 'onStatusApplied',
          status: ['solidification', 'electrification', 'corrosion', 'combustion'],
          target: 'enemy',
        },
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'atkPercent' },
            target: 'self',
            value: [7.5, 9, 10.5, 12, 13.5, 15, 16.5, 18, 21],
            stackStrategy: 'INDEPENDENT',
            maxStacks: 2,
            duration: 20,
            icd: 0.1,
          },
        ],
      },
    ],
  },
};

export default sheet;
