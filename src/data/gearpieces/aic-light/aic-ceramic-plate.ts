import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'AIC Ceramic Plate',
  icon: '/equipment/item_equip_t1_suit_wisdwill01_edc_02.webp',
  slotType: 'kit',
  levelRequirement: 28,
  defense: 8,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: 16,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', skillTypes: 'battleSkill' },
        target: 'self',
        value: 16.2,
      },
    ],
  },
  setSlug: 'aic-light',
};

export default sheet;
