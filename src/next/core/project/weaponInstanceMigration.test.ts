import { describe, expect, it } from 'vitest';
import type { WeaponDefinition } from '../game-data/equipmentDefinition';
import { migrateWeaponInstance } from './weaponInstanceMigration';

function weapon(slug: string, keys: readonly string[], levelCount = 9): WeaponDefinition {
  return {
    slug,
    rarity: 5,
    weaponType: 'sword',
    baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
    traits: keys.map(key => ({ key, levelCount, modifiers: [] })),
  };
}
const source = weapon('old', ['skill1', 'skill3']);
const target = weapon('new', ['skill1', 'skill2', 'skill3']);
const instance = { weaponSlug: 'old', level: 90, tuned: true, potential: 3, traitLevels: [2, 7] };

describe('weapon instance migration', () => {
  it('preserves levels by key, requiring an explicit value for the missing middle slot', () => {
    expect(migrateWeaponInstance(instance, source, target, { skill2: 4 })).toEqual({
      ok: true,
      value: { ...instance, weaponSlug: 'new', traitLevels: [2, 4, 7] },
      addedTraitKeys: ['skill2'],
    });
    expect(instance.traitLevels).toEqual([2, 7]);
  });

  it('does not silently fill a missing slot', () => {
    expect(migrateWeaponInstance(instance, source, target)).toEqual({
      ok: false,
      issues: [
        {
          path: 'traitLevels[1]',
          message: "added trait 'skill2' requires an explicit level",
        },
      ],
    });
  });

  it('handles reordered keys even with unchanged array length', () => {
    expect(migrateWeaponInstance(instance, source, weapon('new', ['skill3', 'skill1']))).toEqual({
      ok: true,
      value: { ...instance, weaponSlug: 'new', traitLevels: [7, 2] },
      addedTraitKeys: [],
    });
  });

  it('requires explicit aliases for renamed traits and rejects merging two inputs', () => {
    const renamed = weapon('new', ['skill1', 'skill2']);
    expect(migrateWeaponInstance(instance, source, renamed, {}, { skill3: 'skill2' })).toEqual({
      ok: true,
      value: { ...instance, weaponSlug: 'new', traitLevels: [2, 7] },
      addedTraitKeys: [],
    });
    expect(migrateWeaponInstance(instance, source, renamed, {}, { skill3: 'skill1' }).ok).toBe(
      false,
    );
    expect(migrateWeaponInstance(instance, source, renamed, {}, { absent: 'skill2' }).ok).toBe(
      false,
    );
    expect(migrateWeaponInstance(instance, source, renamed, {}, { skill3: 'absent' }).ok).toBe(
      false,
    );
  });

  it.each([0, -1, 10, 1.5, NaN, Infinity])('rejects invalid explicit level %s', level => {
    expect(migrateWeaponInstance(instance, source, target, { skill2: level }).ok).toBe(false);
  });

  it.each([
    weapon('new', ['skill1']),
    weapon('new', ['skill1', 'skill1']),
    weapon('new', ['skill1', 'skill3'], 6),
    { ...target, weaponType: 'greatsword' as const },
  ])('rejects destructive or ambiguous target layouts', invalid => {
    expect(migrateWeaponInstance(instance, source, invalid, { skill2: 4 }).ok).toBe(false);
  });

  it('rejects duplicate source keys, unknown choices and overwriting a saved level', () => {
    expect(migrateWeaponInstance(instance, weapon('old', ['skill1', 'skill1']), target).ok).toBe(
      false,
    );
    expect(migrateWeaponInstance(instance, source, target, { skill2: 4, unknown: 1 }).ok).toBe(
      false,
    );
    expect(migrateWeaponInstance(instance, source, target, { skill2: 4, skill1: 9 }).ok).toBe(
      false,
    );
  });

  it('rejects malformed source instances without clamping or truncation', () => {
    for (const invalid of [
      { ...instance, weaponSlug: 'other' },
      { ...instance, traitLevels: [2] },
      { ...instance, traitLevels: [2, 7, 9] },
      { ...instance, traitLevels: [2, 10] },
    ])
      expect(migrateWeaponInstance(invalid, source, target, { skill2: 4 }).ok).toBe(false);
  });
});
