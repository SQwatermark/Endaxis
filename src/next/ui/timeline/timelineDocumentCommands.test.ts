import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { SkillCastDocument } from '../../core/project/schema';
import { moveSkillCast, updateSkillCastBasicField } from './timelineDocumentCommands';

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
});
