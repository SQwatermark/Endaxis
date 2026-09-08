import { expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { PublishedOperatorMetadata } from './publishedOperatorMetadata';
import { capturePublishedWeaponSources, resolvePublishedBuffSource } from './publishedBuffSource';

it('captures native weapon presentation identity and custom names without retaining mutable definitions', () => {
  const weapon = { slug: 'wpn_funnel_0016', assetSlug: 'wpn_artsunit_0016' };
  const captured = capturePublishedWeaponSources([
    weapon,
    { slug: 'custom', displayName: '自定义武器' },
  ]);
  weapon.assetSlug = 'changed-after-publication';
  expect(
    resolvePublishedBuffSource(
      { sourceActionId: 'upgrade-initialization:weapon-trait:wpn_funnel_0016:skill3' },
      scenario,
      operators,
      captured,
    ),
  ).toEqual({ kind: 'weapon', slug: 'wpn_artsunit_0016' });
  expect(
    resolvePublishedBuffSource(
      { sourceActionId: 'equipment:weaponTrait:custom:skill3' },
      scenario,
      operators,
      captured,
    ),
  ).toEqual({ kind: 'custom', name: '自定义武器' });
});

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
    { levels: 2, passiveKeys: [] },
    { levels: 1, passiveKeys: ['passive-t'] },
  ],
  potentials: [{ levels: 1, passiveKeys: ['passive-p'] }],
};
const operators = new Map([['custom', metadata]]);

it('keeps the skill identity while carrying its own level-source title fallback', () => {
  const withTitles = new Map([
    ['custom', { ...metadata, skillLevelSources: { skill: 'ultimate' } }],
  ]);
  for (const sourceActionId of ['cast', 'skill']) {
    expect(
      resolvePublishedBuffSource({ sourceActionId, sourceId: 'track' }, scenario, withTitles),
    ).toEqual({ kind: 'skill', slug: 'native', key: 'skill', fallbackKey: 'ultimate' });
  }
});

it.each([
  ['cast', { kind: 'skill', slug: 'native', key: 'skill' }],
  ['skill', { kind: 'skill', slug: 'native', key: 'skill' }],
  ['upgrade-initialization:talent:1', { kind: 'talent', slug: 'native', index: 2 }],
  ['passive:passive-t', { kind: 'talent', slug: 'native', index: 2 }],
  ['upgrade-initialization:potential:0', { kind: 'potential', slug: 'native', index: 0 }],
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
