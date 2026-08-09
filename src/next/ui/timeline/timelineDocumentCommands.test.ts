import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { SkillCastDocument } from '../../core/project/schema';
import {
  moveSkillCast,
  removeSkillCast,
  setTrackOperator,
  updateSkillCastBasicField,
  updateSkillCastBooleanField,
  updateSkillCastColor,
} from './timelineDocumentCommands';

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
    operatorBuildId: null,
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [cast(locked)],
  };
  return value;
}

describe('moveSkillCast', () => {
  it('assigns an operator build to an empty track', () => {
    const original = createEmptyScenario('scenario:operator', '干员样本');
    const updated = setTrackOperator(original, 2, perlicaBuild);

    expect(updated.tracks[2]).toMatchObject({
      operatorBuildId: perlicaBuild.id,
      weaponBuildId: null,
      skillCasts: [],
    });
    expect(updated.builds.operators[perlicaBuild.id]).toEqual(perlicaBuild);
    expect(original.tracks[2]).toBeNull();
  });

  it('clears stale casts, connections and an orphaned build when changing operator', () => {
    const original = scenario();
    original.builds.operators[perlicaBuild.id] = perlicaBuild;
    original.tracks[0]!.operatorBuildId = perlicaBuild.id;
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

    expect(updated.tracks[0]!.operatorBuildId).toBe(arcaneBuild.id);
    expect(updated.tracks[0]!.skillCasts).toEqual([]);
    expect(updated.connections).toEqual([]);
    expect(updated.builds.operators[perlicaBuild.id]).toBeUndefined();
    expect(updated.builds.operators[arcaneBuild.id]).toEqual(arcaneBuild);
  });

  it('leaves the document unchanged when selecting the current operator again', () => {
    const original = scenario();
    original.builds.operators[perlicaBuild.id] = perlicaBuild;
    original.tracks[0]!.operatorBuildId = perlicaBuild.id;

    expect(setTrackOperator(original, 0, { ...perlicaBuild })).toBe(original);
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
});
