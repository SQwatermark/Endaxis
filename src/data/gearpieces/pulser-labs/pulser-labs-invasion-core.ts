import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Pulser Labs Invasion Core',
  icon: '/equipment/item_equip_t4_suit_pulse_cryst01_edc_03.webp',
  slotType: 'kit',
  levelRequirement: 70,
  defense: 21,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: [41, 45, 49, 53],
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'dmgBonus', skillTypes: 'ultimate' },
        target: 'self',
        value: [51.7, 56.9, 62.1, 67.3],
      },
    ],
  },
  setSlug: 'pulser-labs',
};

export default sheet;
