import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument, SkillCastDocument } from '../../core/project/schema';
import type { TimelineDocumentIdAllocator, TimelineDocumentIdKind } from './placeSkillGroup';
import { copyTimelineActions, pasteTimelineActions } from './timelineClipboard';

function ids(): TimelineDocumentIdAllocator {
  const counters = new Map<TimelineDocumentIdKind, number>();
  return {
    allocate(kind) {
      const value = (counters.get(kind) ?? 0) + 1;
      counters.set(kind, value);
      return `${kind}:new:${value}`;
    },
  };
}

function cast(id: string, startFrame: number, groupIndex: number): SkillCastDocument {
  return {
    id,
    source: { kind: 'operatorSkill', skillGroupKey: 'basicAttack', skillKey: id },
    placement: { startFrame },
    placementGroup: {
      id: 'placementGroup:old',
      skillGroupKey: 'basicAttack',
      index: groupIndex,
      total: 2,
    },
    editable: {
      durationFrames: 10,
      locked: false,
      disabled: false,
      scheduledSequences: [
        {
          id: `scheduledSequence:${id}`,
          startFrame: 2,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                hitId: `hit:${id}`,
                parameters: { damageType: 'electric', attackScale: 1, tags: [] },
                edited: [],
              },
            ],
          },
          edited: [],
        },
      ],
      customBars: [{ id: `bar:${id}`, text: id, offsetFrames: 0, durationFrames: 10 }],
    },
    edited: [],
  };
}

function scenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:clipboard', '剪贴板样本');
  scenario.tracks[0] = {
    operator: null,
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [cast('cast:1', 30, 0), cast('cast:2', 45, 1), cast('cast:outside', 90, 0)],
  };
  scenario.connections = [
    {
      id: 'connection:internal',
      consumption: false,
      from: { kind: 'damageHit', skillCastId: 'cast:1', hitId: 'hit:cast:1' },
      to: { kind: 'skillCast', skillCastId: 'cast:2' },
    },
    {
      id: 'connection:external',
      consumption: false,
      from: { kind: 'skillCast', skillCastId: 'cast:2' },
      to: { kind: 'skillCast', skillCastId: 'cast:outside' },
    },
  ];
  return scenario;
}

describe('timelineClipboard', () => {
  it('rebuilds every persisted identity and only copies internal connections', () => {
    const original = scenario();
    const clipboard = copyTimelineActions(original, new Set(['cast:1', 'cast:2']))!;

    const pasted = pasteTimelineActions(original, clipboard, 100, ids());
    const created = pasted.scenario.tracks[0]!.skillCasts.slice(-2);

    expect(created.map(value => value.id)).toEqual(['skillCast:new:1', 'skillCast:new:2']);
    expect(created.map(value => value.placement.startFrame)).toEqual([100, 115]);
    expect(created.map(value => value.placementGroup)).toEqual([
      {
        id: 'placementGroup:new:1',
        skillGroupKey: 'basicAttack',
        index: 0,
        total: 2,
      },
      {
        id: 'placementGroup:new:1',
        skillGroupKey: 'basicAttack',
        index: 1,
        total: 2,
      },
    ]);
    expect(created.map(value => value.editable.scheduledSequences[0]!.id)).toEqual([
      'scheduledSequence:new:1',
      'scheduledSequence:new:2',
    ]);
    expect(created.map(value => value.editable.customBars[0]!.id)).toEqual([
      'customBar:new:1',
      'customBar:new:2',
    ]);
    expect(pasted.scenario.connections).toHaveLength(3);
    expect(pasted.scenario.connections.at(-1)).toEqual({
      id: 'connection:new:1',
      consumption: false,
      from: {
        kind: 'damageHit',
        skillCastId: 'skillCast:new:1',
        hitId: 'hit:new:1',
      },
      to: { kind: 'skillCast', skillCastId: 'skillCast:new:2' },
    });
    expect(original.tracks[0]!.skillCasts).toHaveLength(3);
  });

  it('unwraps a copied fragment when only one member of a placement group is selected', () => {
    const original = scenario();
    const clipboard = copyTimelineActions(original, new Set(['cast:2']))!;

    const pasted = pasteTimelineActions(original, clipboard, 0, ids());

    expect(pasted.scenario.tracks[0]!.skillCasts.at(-1)!.placementGroup).toBeUndefined();
  });

  it('returns no clipboard for an empty or stale selection', () => {
    const original = scenario();
    expect(copyTimelineActions(original, new Set())).toBeNull();
    expect(copyTimelineActions(original, new Set(['missing']))).toBeNull();
  });

  it('rejects invalid paste frames without changing the source', () => {
    const original = scenario();
    const clipboard = copyTimelineActions(original, new Set(['cast:1']))!;
    expect(() => pasteTimelineActions(original, clipboard, -1, ids())).toThrow(
      'non-negative integer',
    );
    expect(original.tracks[0]!.skillCasts).toHaveLength(3);
  });
});
