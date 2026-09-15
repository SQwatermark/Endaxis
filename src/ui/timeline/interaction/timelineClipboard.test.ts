import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../../core/project/createProject';
import type { ScenarioDocument, SkillCastDocument } from '../../../core/project/schema';
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

function cast(id: string, startFrame: number): SkillCastDocument {
  return {
    id,
    source: { kind: 'operatorSkill', skillGroupKey: 'basicAttack', skillKey: id },
    placement: { startFrame },
    presentation: {
      locked: false,
      disabled: false,
      customBars: [{ id: `bar:${id}`, text: id, offsetFrames: 0, durationFrames: 10 }],
    },
    customDefinition: {
      key: id,
      timelineBlockFrames: 10,
      scheduledSequences: [
        {
          startFrame: 2,
          sequence: {
            steps: [
              {
                kind: 'dealDamage',
                key: `hit:${id}`,
                parameters: { damageType: 'electric', attackScale: 1, tags: [] },
              },
            ],
          },
        },
      ],
    },
  };
}

function scenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:clipboard', '剪贴板样本');
  scenario.tracks[0] = {
    id: 'track:0',
    operator: null,
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [cast('cast:1', 30), cast('cast:2', 45), cast('cast:outside', 90)],
  };
  scenario.connections = [
    {
      id: 'connection:internal',
      consumption: false,
      from: { kind: 'damageHit', skillCastId: 'cast:1', stepKey: 'hit:cast:1' },
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
  it('完整组仅平移组首，并重映射内部前驱及手工命中端点', () => {
    const original = scenario();
    original.tracks[0]!.skillCasts[1]!.placement = { afterCastId: 'cast:1' };
    const clipboard = copyTimelineActions(original, new Set(['cast:1', 'cast:2']))!;
    expect(clipboard.casts.map(value => value.cast.placement)).toEqual([
      { startFrame: 30 },
      { afterCastId: 'cast:1' },
    ]);
    const pasted = pasteTimelineActions(original, clipboard, 100, ids());
    expect(pasted.scenario.tracks[0]!.skillCasts.slice(-2).map(cast => cast.placement)).toEqual([
      { startFrame: 100 },
      { afterCastId: 'skillCast:new:1' },
    ]);
    expect(pasted.scenario.connections.at(-1)!.from).toEqual({
      kind: 'damageHit',
      skillCastId: 'skillCast:new:1',
      stepKey: 'hit:cast:1',
    });
    expect(original.tracks[0]!.skillCasts[1]!.placement).toEqual({ afterCastId: 'cast:1' });
  });

  it('部分链从复制边界物化当前显示帧，内部剩余关系继续保留', () => {
    const original = scenario();
    original.tracks[0]!.skillCasts[1]!.placement = { afterCastId: 'cast:1' };
    original.tracks[0]!.skillCasts[2]!.placement = { afterCastId: 'cast:2' };
    const selected = new Set(['cast:2', 'cast:outside']);
    expect(() => copyTimelineActions(original, selected)).toThrow('without its predecessor');
    const clipboard = copyTimelineActions(
      original,
      selected,
      new Map([
        ['cast:2', 48],
        ['cast:outside', 80],
      ]),
    )!;
    expect(clipboard.originFrame).toBe(48);
    expect(clipboard.casts.map(value => value.cast.placement)).toEqual([
      { startFrame: 48 },
      { afterCastId: 'cast:2' },
    ]);
    const pasted = pasteTimelineActions(original, clipboard, 200, ids());
    expect(pasted.scenario.tracks[0]!.skillCasts.slice(-2).map(cast => cast.placement)).toEqual([
      { startFrame: 200 },
      { afterCastId: 'skillCast:new:1' },
    ]);
    expect(original.tracks[0]!.skillCasts[1]!.placement).toEqual({ afterCastId: 'cast:1' });
  });

  it('rebuilds every persisted identity and only copies internal connections', () => {
    const original = scenario();
    const clipboard = copyTimelineActions(original, new Set(['cast:1', 'cast:2']))!;

    const pasted = pasteTimelineActions(original, clipboard, 100, ids());
    const created = pasted.scenario.tracks[0]!.skillCasts.slice(-2);

    expect(created.map(value => value.id)).toEqual(['skillCast:new:1', 'skillCast:new:2']);
    expect(created.map(value => value.placement.startFrame)).toEqual([100, 115]);
    expect(created.map(value => value.presentation?.customBars?.[0]!.id)).toEqual([
      'bar:cast:1',
      'bar:cast:2',
    ]);
    expect(pasted.scenario.connections).toHaveLength(3);
    expect(pasted.scenario.connections.at(-1)).toEqual({
      id: 'connection:new:1',
      consumption: false,
      from: {
        kind: 'damageHit',
        skillCastId: 'skillCast:new:1',
        stepKey: 'hit:cast:1',
      },
      to: { kind: 'skillCast', skillCastId: 'skillCast:new:2' },
    });
    expect(original.tracks[0]!.skillCasts).toHaveLength(3);
  });

  it('returns no clipboard for an empty or stale selection', () => {
    const original = scenario();
    expect(copyTimelineActions(original, new Set())).toBeNull();
    expect(copyTimelineActions(original, new Set(['missing']))).toBeNull();
  });

  it('rejects invalid paste frames without changing the source', () => {
    const original = scenario();
    const clipboard = copyTimelineActions(original, new Set(['cast:1']))!;
    expect(pasteTimelineActions(original, clipboard, -1, ids()).skillCastIds).toHaveLength(1);
    expect(() =>
      pasteTimelineActions(original, clipboard, -original.battle.prepFrames - 1, ids()),
    ).toThrow('visible timeline');
    expect(original.tracks[0]!.skillCasts).toHaveLength(3);
  });
});
