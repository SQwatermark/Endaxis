import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Miner Compression Core T1',
  icon: '/equipment/item_equip_t3_parts_tundra01_edc_03.webp',
  slotType: 'kit',
  levelRequirement: 50,
  defense: 15,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: 31,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'ultimateGainEfficiency' },
        target: 'self',
        value: 18.6,
      },
    ],
  },
  setSlug: 'no-set-bonuses',
};

export default sheet;
