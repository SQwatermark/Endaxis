import { expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { PublishedOperatorMetadata } from './publishedOperatorMetadata';
import { resolvePublishedBuffSource } from './publishedBuffSource';

const scenario = createEmptyScenario('test', 'test');
scenario.tracks[0] = {
  id: 'track',
  operator: {
    operatorSlug: 'custom',
    level: 1,
    promoted: false,
    potential: 0,
    trustLevel: 0,
    skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
    talentStates: {},
  },
  weapon: null,
  gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
  initialState: { ultimateEnergy: 0 },
  skillCasts: [
    {
      id: 'cast',
      source: { kind: 'operatorSkill', skillGroupKey: 'group', skillKey: 'skill' },
      placement: { startFrame: 0 },
    },
  ],
};
const metadata: PublishedOperatorMetadata = {
  slug: 'custom',
  assetSlug: 'native',
  displayName: 'custom name',
  skillKeys: ['skill'],
  talents: [
    { key: 't1', levels: 2, passiveKeys: [] },
    { key: 't2', levels: 1, passiveKeys: ['passive-t'] },
  ],
  potentials: [{ key: 'p1', levels: 1, passiveKeys: ['passive-p'] }],
};
const operators = new Map([['custom', metadata]]);

it.each([
  ['cast', { kind: 'skill', slug: 'native', key: 'skill' }],
  ['skill', { kind: 'skill', slug: 'native', key: 'skill' }],
  ['upgrade-initialization:talent:t2', { kind: 'talent', slug: 'native', index: 2 }],
  ['passive:passive-t', { kind: 'talent', slug: 'native', index: 2 }],
  ['upgrade-initialization:potential:p1', { kind: 'potential', slug: 'native', index: 0 }],
  ['passive:passive-p', { kind: 'potential', slug: 'native', index: 0 }],
  ['unknown', undefined],
] as const)('resolves published source %s without a live definition repository', (id, expected) => {
  expect(
    resolvePublishedBuffSource({ sourceId: 'track', sourceActionId: id }, scenario, operators),
  ).toEqual(expected);
});

it.each(['weaponTrait', 'weapon-trait', 'gearTrait', 'gear-trait', 'gearSet', 'gear-set'])(
  'keeps equipment alias %s',
  alias => {
    const kind = alias.startsWith('weapon')
      ? 'weapon'
      : alias === 'gearSet' || alias === 'gear-set'
        ? 'gearSet'
        : 'gear';
    for (const prefix of ['equipment', 'upgrade-initialization'])
      expect(
        resolvePublishedBuffSource(
          { sourceActionId: `${prefix}:${alias}:item:rest` },
          scenario,
          operators,
        ),
      ).toEqual({ kind, slug: 'item' });
  },
);

it('does not invent names without a publication or matching source', () => {
  expect(
    resolvePublishedBuffSource({ sourceActionId: 'cast' }, undefined, operators),
  ).toBeUndefined();
  expect(resolvePublishedBuffSource({}, scenario, operators)).toBeUndefined();
  expect(
    resolvePublishedBuffSource(
      { sourceActionId: 'passive:passive-t', sourceId: 'missing' },
      scenario,
      operators,
    ),
  ).toBeUndefined();
});
