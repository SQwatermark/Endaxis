import type { WeaponSheet } from '../../../types';

const sheet: WeaponSheet = {
  rarity: 5,
  type: 'polearm',
  icon: '/weapons/polearm/wpn_polearm_0006.webp',
  baseAtk: [42, 120, 203, 286, 369, 411],
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
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
        stat: { modifier: 'dmgBonus', skillTypes: 'comboSkill' },
        target: 'self',
        value: [10, 12, 14, 16, 18, 20, 22, 24, 28],
      },
    ],
    triggers: [
      {
        trigger: { kind: 'onActionStart', skillTypes: 'comboSkill' },
        effects: [
          {
            kind: 'oneTime',
            stat: { modifier: 'dmgBonus', elements: 'electric' },
            skillTypes: 'battleSkill',
            target: 'self',
            value: [10, 12, 14, 16, 18, 20, 22, 24, 28],
            stackStrategy: 'INDEPENDENT',
            maxStacks: 3,
            duration: 30,
          },
        ],
      },
    ],
  },
};

export default sheet;
