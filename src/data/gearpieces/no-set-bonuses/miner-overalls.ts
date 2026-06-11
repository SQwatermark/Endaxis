import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Miner Overalls',
  icon: '/equipment/item_equip_t1_parts_tundra01_body_02.webp',
  slotType: 'armor',
  levelRequirement: 20,
  defense: 16,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'intellect' },
        target: 'self',
        value: 27,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: 18,
      },
    ],
  },
  skill3: {
    effects: [{ kind: 'status', stat: { modifier: 'flatHp' }, target: 'self', value: 125 }],
  },
  setSlug: 'no-set-bonuses',
};

export default sheet;
