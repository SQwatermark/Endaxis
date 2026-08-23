import { describe, expect, it } from 'vitest';
import type { GearPieceSheet, GearSetSheet, WeaponSheet } from '../../../data/types';
import { adaptSharedGear, adaptSharedGearSet, adaptSharedWeapon } from './adaptSharedEquipment';

describe('adaptSharedEquipment', () => {
  it('preserves two visible traits of a three-star weapon and normalizes percentage units', () => {
    const source: WeaponSheet = {
      rarity: 3,
      type: 'sword',
      icon: '/unused.webp',
      baseAtk: [29, 83, 140, 197, 254, 283],
      skill1: {
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'attributeFlat', attribute: 'sub' },
            target: 'self',
            value: [10, 18, 26, 34, 42, 51, 59, 67, 79],
          },
        ],
      },
      skill2: {},
      skill3: {
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'atkPercent' },
            target: 'self',
            value: [5, 9, 13, 17, 21, 25, 29, 33, 39],
          },
        ],
      },
    };

    const result = adaptSharedWeapon('test-sword', source);
    expect(result).toMatchObject({ ok: true, completeness: 'complete', issues: [] });
    if (!result.ok) throw new Error('expected complete adaptation');
    expect(result.definition).toEqual({
      slug: 'test-sword',
      iconPath: '/unused.webp',
      rarity: 3,
      weaponType: 'sword',
      baseAttackAtLevelNodes: [29, 83, 140, 197, 254, 283],
      traits: [
        {
          key: 'skill1',
          levelCount: 9,
          modifiers: [
            {
              kind: 'attribute',
              attribute: 'secondary',
              operation: 'flat',
              value: [10, 18, 26, 34, 42, 51, 59, 67, 79],
            },
          ],
        },
        {
          key: 'skill3',
          levelCount: 9,
          modifiers: [
            {
              kind: 'panelStat',
              stat: 'attackPercent',
              value: [0.05, 0.09, 0.13, 0.17, 0.21, 0.25, 0.29, 0.33, 0.39],
            },
          ],
        },
      ],
    });
  });

  it('maps accessory slots and expands old basic-attack damage scope', () => {
    const source: GearPieceSheet = {
      name: 'Test Gear',
      icon: '/unused.webp',
      slotType: 'kit',
      levelRequirement: 70,
      defense: 0,
      skill1: {
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'dmgBonus', skillTypes: 'basicAttack' },
            target: 'self',
            value: [10, 20, 30, 40],
          },
        ],
      },
      setSlug: 'test-set',
    };

    const result = adaptSharedGear('test-gear', source);
    expect(result).toMatchObject({ ok: true, completeness: 'complete', issues: [] });
    if (!result.ok) throw new Error('expected complete adaptation');
    expect(result.definition).toEqual({
      slug: 'test-gear',
      iconPath: '/unused.webp',
      slotType: 'accessory',
      levelRequirement: 70,
      baseDefense: 0,
      gearSetSlug: 'test-set',
      traits: [
        {
          key: 'skill1',
          levelCount: 4,
          modifiers: [
            {
              kind: 'damageBonus',
              damageTypes: ['physical', 'true', 'heat', 'electric', 'cryo', 'nature', 'ether'],
              skillTypes: ['basicAttack', 'finisher', 'plungingAttack'],
              value: [0.1, 0.2, 0.3, 0.4],
            },
          ],
        },
      ],
    });
  });

  it('maps static healing efficiency without treating it as a panel percentage', () => {
    const source: GearPieceSheet = {
      name: 'Healing Gear',
      icon: '/unused.webp',
      slotType: 'gloves',
      levelRequirement: 70,
      defense: 0,
      skill1: {
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'heal' },
            target: 'self',
            value: [6, 10, 20, 46.4],
          },
        ],
      },
    };

    const result = adaptSharedGear('healing-gear', source);
    expect(result).toMatchObject({ ok: true, completeness: 'complete' });
    if (!result.ok) throw new Error('expected complete adaptation');
    expect(result.definition.traits[0]!.modifiers).toEqual([
      {
        kind: 'staticHealingIncrease',
        target: 'output',
        value: [0.06, 0.1, 0.2, 0.46399999999999997],
      },
    ]);
  });

  it('rejects an entire definition instead of dropping dynamic behavior', () => {
    const source: GearSetSheet = {
      effects: [
        {
          kind: 'status',
          stat: { modifier: 'atkPercent' },
          target: 'self',
          value: 10,
        },
      ],
      triggers: [
        {
          trigger: { kind: 'onActionStart', skillTypes: 'ultimate' },
          effects: [{ kind: 'status', target: 'self', duration: 10 }],
        },
      ],
    };

    const result = adaptSharedGearSet('dynamic-set', source);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('expected strict adaptation failure');
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        slug: 'dynamic-set',
        path: 'triggers',
        code: 'unsupported-trigger',
      }),
    );
  });

  it('keeps the reliable base definition in permissive mode and reports omitted behavior', () => {
    const source: GearSetSheet = {
      effects: [
        {
          kind: 'status',
          stat: { modifier: 'atkPercent' },
          target: 'self',
          value: 10,
        },
      ],
      triggers: [
        {
          trigger: { kind: 'onActionStart', skillTypes: 'ultimate' },
          effects: [{ kind: 'status', target: 'self', duration: 10 }],
        },
      ],
    };

    const result = adaptSharedGearSet('dynamic-set', source, { mode: 'permissive' });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('expected permissive adaptation success');
    expect(result.completeness).toBe('partial');
    expect(result.definition).toEqual({
      slug: 'dynamic-set',
      modifiers: [{ kind: 'panelStat', stat: 'attackPercent', value: 0.1 }],
    });
    expect(result.issues).toContainEqual(
      expect.objectContaining({ path: 'triggers', code: 'unsupported-trigger' }),
    );
  });

  it('rejects leveled arrays whose length does not match the source progression', () => {
    const source: WeaponSheet = {
      rarity: 4,
      type: 'polearm',
      icon: '/unused.webp',
      baseAtk: [1, 2, 3, 4, 5, 6],
      skill1: {
        effects: [
          {
            kind: 'status',
            stat: { modifier: 'atkFlat' },
            target: 'self',
            value: [1, 2],
          },
        ],
      },
      skill2: {},
      skill3: {},
    };

    const result = adaptSharedWeapon('bad-levels', source);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('expected strict adaptation failure');
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: 'skill1.effects[0].value',
        code: 'invalid-level-values',
      }),
    );
  });
});
