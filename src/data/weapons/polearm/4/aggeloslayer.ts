import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 4,
  type: 'polearm',
  icon: '/weapons/polearm/wpn_polearm_0008.webp',
  baseAtk: [34, 100, 169, 238, 307, 341],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [12, 21, 31, 40, 50, 60, 69, 79, 93],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', elements: ['heat', 'cryo', 'electric', 'nature'] },
        target: 'self',
        value: [3.3, 6, 8.7, 11.3, 14, 16.7, 19.3, 22, 26],
      },
    ],
  },
  skill3: {
    triggers: [
      {
        trigger: {
          kind: 'onHit',
          skillTypes: 'battleSkill',
        },
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'atkPercent' },
            target: 'self',
            value: [12, 14.4, 16.8, 19.2, 21.6, 24, 26.4, 28.8, 33.6],
            duration: 20,
          },
        ],
      },
    ],
  },
};

export default sheet;
