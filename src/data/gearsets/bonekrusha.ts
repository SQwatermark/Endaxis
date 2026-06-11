import type { GearSetSheet } from '../types';

const sheet: GearSetSheet = {
  effects: [
    {
      kind: 'status',
      stat: { modifier: 'atkPercent' },
      target: 'self',
      value: 15,
    },
  ],
  triggers: [
    {
      trigger: { kind: 'onActionStart', skillTypes: 'comboSkill' },
      effects: [
        {
          name: 'bonekrushingSmash',
          kind: 'oneTime',
          stat: { modifier: 'dmgBonus', skillTypes: 'battleSkill' },
          skillTypes: 'battleSkill',
          value: 30,
          duration: 999,
          maxStacks: 2,
          icon: '/equipment/item_equip_t4_suit_attri01_edc_04.webp',
        },
      ],
    },
  ],
};

export default sheet;
