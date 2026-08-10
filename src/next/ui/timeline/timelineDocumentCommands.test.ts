import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { SkillCastDocument } from '../../core/project/schema';
import {
  moveSkillCast,
  moveSkillCasts,
  removeSkillCast,
  removeSkillCasts,
  setTrackGear,
  setTrackOperator,
  setTrackWeapon,
  swapTimelineTracks,
  updateBattleResourceRule,
  updateSkillCastBasicField,
  updateSkillCastBooleanField,
  updateSkillCastColor,
  updateTrackInitialUltimateEnergy,
} from './timelineDocumentCommands';

describe('updateBattleResourceRule', () => {
  it('updates shared SP rules without mutating the scenario', () => {
    const original = scenario();
    const updated = updateBattleResourceRule(original, 'spRecoveryPerSecond', 18.5);

    expect(updated).not.toBe(original);
    expect(updated.battle.resourceRules.spRecoveryPerSecond).toBe(18.5);
    expect(original.battle.resourceRules.spRecoveryPerSecond).not.toBe(18.5);
  });

  it('clamps initial SP when the maximum is reduced', () => {
    const original = scenario();
    original.battle.resourceRules.initialSp = 200;

    expect(updateBattleResourceRule(original, 'maxSp', 120).battle.resourceRules).toMatchObject({
      maxSp: 120,
      initialSp: 120,
    });
    expect(
      updateBattleResourceRule(original, 'initialSp', 400).battle.resourceRules.initialSp,
    ).toBe(original.battle.resourceRules.maxSp);
  });

  it('rejects invalid values and preserves no-op identity', () => {
    const original = scenario();
    expect(
      updateBattleResourceRule(original, 'initialSp', original.battle.resourceRules.initialSp),
    ).toBe(original);
    expect(() => updateBattleResourceRule(original, 'initialSp', -1)).toThrow(
      'initialSp must be a non-negative finite number',
    );
  });
});

describe('swapTimelineTracks', () => {
  it('swaps complete track slots and remaps control switches', () => {
    const original = createEmptyScenario('scenario:tracks', '轨道排序样本');
    original.tracks[0] = {
      ...scenario().tracks[0]!,
      operator: { ...perlicaBuild, id: 'operator:a' },
    };
    original.tracks[1] = {
      ...scenario().tracks[0]!,
      operator: { ...perlicaBuild, id: 'operator:b' },
    };
    original.battle.controlSwitches = [
      { id: 'switch:a', frame: 0, trackIndex: 0 },
      { id: 'switch:b', frame: 30, trackIndex: 1 },
      { id: 'switch:c', frame: 60, trackIndex: 2 },
    ];

    const swapped = swapTimelineTracks(original, 0, 1);

    expect(swapped.tracks[0]?.operator?.id).toBe('operator:b');
    expect(swapped.tracks[1]?.operator?.id).toBe('operator:a');
    expect(swapped.battle.controlSwitches.map(value => value.trackIndex)).toEqual([1, 0, 2]);
    expect(original.tracks[0]?.operator?.id).toBe('operator:a');
  });
});

describe('updateTrackInitialUltimateEnergy', () => {
  it('updates the persistent track value and clamps it to the resolved maximum', () => {
    const original = scenario();
    const updated = updateTrackInitialUltimateEnergy(original, 0, 120, 80);

    expect(updated.tracks[0]?.initialState.ultimateEnergy).toBe(80);
    expect(original.tracks[0]?.initialState.ultimateEnergy).toBe(0);
    expect(updateTrackInitialUltimateEnergy(updated, 0, 80, 80)).toBe(updated);
  });

  it('rejects empty tracks and invalid numeric boundaries', () => {
    const original = scenario();
    expect(() => updateTrackInitialUltimateEnergy(original, 1, 10, 80)).toThrow('empty');
    expect(() => updateTrackInitialUltimateEnergy(original, 0, Number.NaN, 80)).toThrow(
      'finite non-negative',
    );
  });
});

const perlicaBuild = {
  id: 'operator:perlica',
  operatorSlug: 'perlica',
  level: 90,
  promoted: true,
  potential: 0,
  trustLevel: 4,
  skillLevels: { basicAttack: 12 },
  talentStates: {},
};

function cast(locked = false): SkillCastDocument {
  return {
    id: 'cast:1',
    source: { kind: 'operatorSkill', skillGroupKey: 'skill', skillKey: 'skill' },
    placement: { startFrame: 30 },
    editable: {
      durationFrames: 20,
      locked,
      disabled: false,
      scheduledSequences: [],
      customBars: [],
    },
    edited: [],
  };
}

function scenario(locked = false) {
  const value = createEmptyScenario('scenario:move', '移动样本');
  value.tracks[0] = {
    operator: null,
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [cast(locked)],
  };
  return value;
}

describe('moveSkillCast', () => {
  it('assigns an operator to an empty track', () => {
    const original = createEmptyScenario('scenario:operator', '干员样本');
    const updated = setTrackOperator(original, 2, perlicaBuild);

    expect(updated.tracks[2]).toMatchObject({
      operator: perlicaBuild,
      weapon: null,
      skillCasts: [],
    });
    expect(original.tracks[2]).toBeNull();
  });

  it('clears stale casts, connections and track equipment when changing operator', () => {
    const original = scenario();
    original.tracks[0] = {
      ...original.tracks[0]!,
      operator: perlicaBuild,
      weapon: {
        id: 'weapon:old',
        weaponSlug: 'old',
        level: 90,
        tuned: true,
        potential: 0,
        traitLevels: [1],
      },
      gears: {
        armor: { id: 'gear:old', gearSlug: 'old', artificingLevels: [0] },
        gloves: null,
        accessory1: null,
        accessory2: null,
      },
    };
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'skillCast', skillCastId: 'cast:2' },
      },
    ];
    const arcaneBuild = { ...perlicaBuild, id: 'operator:arcane', operatorSlug: 'arcane' };

    const updated = setTrackOperator(original, 0, arcaneBuild);

    expect(updated.tracks[0]!.operator).toEqual(arcaneBuild);
    expect(updated.tracks[0]!.skillCasts).toEqual([]);
    expect(updated.connections).toEqual([]);
    expect(updated.tracks[0]!.weapon).toBeNull();
    expect(updated.tracks[0]!.gears).toEqual({
      armor: null,
      gloves: null,
      accessory1: null,
      accessory2: null,
    });
  });

  it('leaves the document unchanged when selecting the current operator again', () => {
    const original = scenario();
    original.tracks[0] = { ...original.tracks[0]!, operator: perlicaBuild };

    expect(setTrackOperator(original, 0, { ...perlicaBuild })).toBe(original);
  });

  it('assigns, replaces and removes a weapon on a track', () => {
    const original = scenario();
    original.tracks[0] = { ...original.tracks[0]!, operator: perlicaBuild };
    const first = {
      id: 'weapon:first',
      weaponSlug: 'first',
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [1, 1, 1],
    };
    const second = { ...first, id: 'weapon:second', weaponSlug: 'second' };

    const equipped = setTrackWeapon(original, 0, first);
    const replaced = setTrackWeapon(equipped, 0, second);
    const cleared = setTrackWeapon(replaced, 0, null);

    expect(equipped.tracks[0]!.weapon).toEqual(first);
    expect(replaced.tracks[0]!.weapon).toEqual(second);
    expect(cleared.tracks[0]!.weapon).toBeNull();
    expect(original.tracks[0]!.weapon).toBeNull();
  });

  it('rejects equipping a weapon on an empty track', () => {
    const original = createEmptyScenario('scenario:empty-weapon', '空轨道');
    expect(() =>
      setTrackWeapon(original, 0, {
        id: 'weapon:first',
        weaponSlug: 'first',
        level: 90,
        tuned: true,
        potential: 0,
        traitLevels: [1],
      }),
    ).toThrow('track 0 is empty');
  });

  it('assigns independent gear slots and clears them separately', () => {
    const original = scenario();
    const armor = { id: 'gear:armor', gearSlug: 'armor', artificingLevels: [0, 0, 0] };
    const accessory = {
      id: 'gear:accessory1',
      gearSlug: 'accessory',
      artificingLevels: [0, 0],
    };

    const armored = setTrackGear(original, 0, 'armor', armor);
    const equipped = setTrackGear(armored, 0, 'accessory1', accessory);
    const cleared = setTrackGear(equipped, 0, 'armor', null);

    expect(equipped.tracks[0]!.gears).toEqual({
      armor: armor,
      gloves: null,
      accessory1: accessory,
      accessory2: null,
    });
    expect(cleared.tracks[0]!.gears.armor).toBeNull();
    expect(cleared.tracks[0]!.gears.accessory1).toEqual(accessory);
    expect(original.tracks[0]!.gears).toEqual({
      armor: null,
      gloves: null,
      accessory1: null,
      accessory2: null,
    });
  });

  it('rejects equipping gear on an empty track', () => {
    const original = createEmptyScenario('scenario:empty-gear', '空轨道');
    expect(() =>
      setTrackGear(original, 0, 'armor', {
        id: 'gear:armor',
        gearSlug: 'armor',
        artificingLevels: [0],
      }),
    ).toThrow('track 0 is empty');
  });

  it('moves only the requested cast without mutating the source scenario', () => {
    const original = scenario();
    const moved = moveSkillCast(original, 0, 'cast:1', 75);

    expect(original.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(30);
    expect(moved.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(75);
    expect(moved.tracks[1]).toBe(original.tracks[1]);
  });

  it('does not move a locked cast', () => {
    const original = scenario(true);
    expect(moveSkillCast(original, 0, 'cast:1', 75)).toBe(original);
  });

  it('rejects invalid frames and missing cast identities', () => {
    expect(() => moveSkillCast(scenario(), 0, 'cast:1', 1.5)).toThrow('non-negative integer');
    expect(() => moveSkillCast(scenario(), 0, 'missing', 30)).toThrow("no skill cast 'missing'");
  });

  it('updates a basic editable value and records user ownership', () => {
    const original = scenario();
    const updated = updateSkillCastBasicField(original, 0, 'cast:1', 'durationFrames', 45);

    expect(updated.tracks[0]!.skillCasts[0]!.editable.durationFrames).toBe(45);
    expect(updated.tracks[0]!.skillCasts[0]!.edited).toEqual(['durationFrames']);
    expect(original.tracks[0]!.skillCasts[0]!.edited).toEqual([]);
  });

  it('validates frame and enhancement fields at the command boundary', () => {
    expect(() => updateSkillCastBasicField(scenario(), 0, 'cast:1', 'cooldownFrames', 1.5)).toThrow(
      'non-negative integer',
    );
    expect(() =>
      updateSkillCastBasicField(scenario(), 0, 'cast:1', 'enhancement', {
        kind: 'duration',
        frames: -1,
      }),
    ).toThrow('enhancement.frames');
  });

  it('updates lock and disabled states without mutating the source', () => {
    const original = scenario();
    const locked = updateSkillCastBooleanField(original, 0, 'cast:1', 'locked', true);
    const disabled = updateSkillCastBooleanField(locked, 0, 'cast:1', 'disabled', true);

    expect(original.tracks[0]!.skillCasts[0]!.editable).toMatchObject({
      locked: false,
      disabled: false,
    });
    expect(disabled.tracks[0]!.skillCasts[0]!.editable).toMatchObject({
      locked: true,
      disabled: true,
    });
    expect(disabled.tracks[0]!.skillCasts[0]!.edited).toEqual(['locked', 'disabled']);
  });

  it('sets and clears an action color as a user-owned field', () => {
    const original = scenario();
    const colored = updateSkillCastColor(original, 0, 'cast:1', '#ff4d4f');
    const reset = updateSkillCastColor(colored, 0, 'cast:1', null);

    expect(colored.tracks[0]!.skillCasts[0]!.editable.color).toBe('#ff4d4f');
    expect(reset.tracks[0]!.skillCasts[0]!.editable.color).toBeNull();
    expect(reset.tracks[0]!.skillCasts[0]!.edited).toEqual(['color']);
    expect(original.tracks[0]!.skillCasts[0]!.editable.color).toBeUndefined();
  });

  it('removes the cast and every connection that points to it', () => {
    const original = scenario();
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'damageHit', skillCastId: 'cast:2', hitId: 'hit:1' },
      },
      {
        id: 'connection:2',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:2' },
        to: { kind: 'skillCast', skillCastId: 'cast:3' },
      },
    ];

    const removed = removeSkillCast(original, 0, 'cast:1');
    expect(removed.tracks[0]!.skillCasts).toEqual([]);
    expect(removed.connections.map(connection => connection.id)).toEqual(['connection:2']);
    expect(original.tracks[0]!.skillCasts).toHaveLength(1);
  });

  it('renumbers a remaining placement group and unwraps its last member', () => {
    const original = scenario();
    const grouped = [0, 1, 2].map(index => ({
      ...cast(),
      id: `cast:${index + 1}`,
      placementGroup: { id: 'group:1', skillGroupKey: 'basicAttack', index, total: 3 },
    }));
    original.tracks[0]!.skillCasts = grouped;

    const twoMembers = removeSkillCast(original, 0, 'cast:2');
    expect(twoMembers.tracks[0]!.skillCasts.map(value => value.placementGroup)).toEqual([
      { id: 'group:1', skillGroupKey: 'basicAttack', index: 0, total: 2 },
      { id: 'group:1', skillGroupKey: 'basicAttack', index: 1, total: 2 },
    ]);

    const oneMember = removeSkillCast(twoMembers, 0, 'cast:1');
    expect(oneMember.tracks[0]!.skillCasts[0]!.placementGroup).toBeUndefined();
  });

  it('removes selected casts across tracks as one immutable command', () => {
    const original = scenario();
    original.tracks[0]!.skillCasts.push({ ...cast(), id: 'cast:2' });
    original.tracks[1] = {
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [{ ...cast(), id: 'cast:3' }],
    };
    original.connections = [
      {
        id: 'connection:1',
        consumption: false,
        from: { kind: 'skillCast', skillCastId: 'cast:1' },
        to: { kind: 'skillCast', skillCastId: 'cast:3' },
      },
    ];

    const removed = removeSkillCasts(original, new Set(['cast:1', 'cast:3']));

    expect(removed.tracks[0]!.skillCasts.map(value => value.id)).toEqual(['cast:2']);
    expect(removed.tracks[1]!.skillCasts).toEqual([]);
    expect(removed.connections).toEqual([]);
    expect(original.tracks[0]!.skillCasts).toHaveLength(2);
  });

  it('ignores stale batch selection identities without creating a document revision', () => {
    const original = scenario();
    expect(removeSkillCasts(original, new Set())).toBe(original);
    expect(removeSkillCasts(original, new Set(['missing']))).toBe(original);
  });
});

describe('moveSkillCasts', () => {
  function multiTrackScenario() {
    const value = scenario();
    value.tracks[0]!.skillCasts.push({
      ...cast(),
      id: 'cast:2',
      placement: { startFrame: 60 },
    });
    value.tracks[1] = {
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [{ ...cast(), id: 'cast:3', placement: { startFrame: 90 } }],
    };
    value.battle.durationFrames = 120;
    return value;
  }

  it('moves selected casts across tracks while preserving their relative positions', () => {
    const original = multiTrackScenario();
    const moved = moveSkillCasts(original, new Set(['cast:1', 'cast:3']), 0, 'cast:1', 45);

    expect(moved.tracks[0]!.skillCasts.map(value => value.placement.startFrame)).toEqual([45, 60]);
    expect(moved.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(105);
    expect(original.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(30);
  });

  it('clamps the shared delta at both timeline boundaries', () => {
    const original = multiTrackScenario();
    const selection = new Set(['cast:1', 'cast:3']);
    const movedLeft = moveSkillCasts(original, selection, 0, 'cast:1', 0);
    const movedRight = moveSkillCasts(original, selection, 0, 'cast:1', 100);

    expect(movedLeft.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(0);
    expect(movedLeft.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(60);
    expect(movedRight.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(60);
    expect(movedRight.tracks[1]!.skillCasts[0]!.placement.startFrame).toBe(120);
  });

  it('keeps the whole selection unchanged when any selected cast is locked', () => {
    const original = multiTrackScenario();
    original.tracks[1]!.skillCasts[0]!.editable.locked = true;

    expect(moveSkillCasts(original, new Set(['cast:1', 'cast:3']), 0, 'cast:1', 45)).toBe(original);
  });

  it('rejects stale selections and anchors outside the selection', () => {
    const original = multiTrackScenario();
    expect(() => moveSkillCasts(original, new Set(['cast:1', 'missing']), 0, 'cast:1', 45)).toThrow(
      'missing or duplicate',
    );
    expect(() => moveSkillCasts(original, new Set(['cast:3']), 0, 'cast:1', 45)).toThrow(
      'does not contain anchor',
    );
  });
});
