import type { GearPieceSheet } from '../../types';

const sheet: GearPieceSheet = {
  name: 'Miner Cleansuit',
  icon: '/equipment/item_equip_t1_parts_tundra01_body_06.webp',
  slotType: 'armor',
  levelRequirement: 28,
  defense: 22,
  skill1: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'will' },
        target: 'self',
        value: 37,
      },
    ],
  },
  skill2: {
    effects: [
      {
        kind: 'status',
        stat: { modifier: 'attributeFlat', attribute: 'agility' },
        target: 'self',
        value: 25,
      },
    ],
  },
  skill3: {
    effects: [{ kind: 'status', stat: { modifier: 'hpPercent' }, target: 'self', value: 9 }],
  },
  setSlug: 'no-set-bonuses',
};

export default sheet;
