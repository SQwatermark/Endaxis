import { effectScope, shallowRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../../core/project/createProject';
import { createInteractionSession } from '../../interaction/interactionSession';
import { createEmptyTimelineActionSelection } from './timelineActionSelection';
import { useTimelineCastMove } from './useTimelineCastMove';

afterEach(() => vi.unstubAllGlobals());

function fixture() {
  const events = new EventTarget();
  class Lane {
    readonly dataset = { trackIndex: '0' };
    closest() {
      return this;
    }
    getBoundingClientRect() {
      return { left: 0 };
    }
  }
  vi.stubGlobal('window', events);
  vi.stubGlobal('Element', Lane);
  vi.stubGlobal('document', { elementFromPoint: () => new Lane() });
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn(() => 1),
  );
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  const original = createEmptyScenario('drag', 'drag');
  original.battle.prepFrames = 0;
  original.tracks[0] = {
    id: 'track',
    operator: null,
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [
      {
        id: 'cast',
        placement: { startFrame: 10 },
        source: { kind: 'operatorSkill', skillGroupKey: 'attack', skillKey: 'a1' },
      },
    ],
  };
  const scenario = shallowRef(original);
  const actionSelection = shallowRef(createEmptyTimelineActionSelection());
  const interactionSession = createInteractionSession();
  const simulationService = { beginInteractiveSession: vi.fn(), endInteractiveSession: vi.fn() };
  const commitScenario = vi.fn(() => true);
  const scope = effectScope();
  const movement = scope.run(() =>
    useTimelineCastMove({
      scenario,
      actionSelection,
      interactionSession,
      simulationService,
      resolvedSkillCastStartFrames: shallowRef(new Map([['cast', 10]])),
      timelineScroll: shallowRef(null),
      pxPerFrame: shallowRef(1),
      snapFrames: shallowRef(1),
      cursorFrame: shallowRef(0),
      trackHeaderWidth: 180,
      rulerHeight: 60,
      timelineFramePx: frame => frame,
      alignSelectedCastToTarget: () => false,
      applyActionSelection: selection => {
        actionSelection.value = selection;
      },
      commitScenario,
      simulateNow: async () => true,
      warnLocked: vi.fn(),
    }),
  )!;
  movement.beginCastMove(
    {
      button: 0,
      pointerId: 1,
      clientX: 10,
      clientY: 100,
      currentTarget: { getBoundingClientRect: () => ({ left: 10 }) },
      preventDefault() {},
      stopPropagation() {},
    } as unknown as PointerEvent,
    0,
    'cast',
  );
  const move = () =>
    events.dispatchEvent(
      Object.assign(new Event('pointermove'), {
        pointerId: 1,
        clientX: 30,
        clientY: 100,
      }),
    );
  move();
  expect(scenario.value.tracks[0]!.skillCasts[0]!.placement.startFrame).toBe(30);
  return {
    scenario,
    original,
    movement,
    interactionSession,
    simulationService,
    commitScenario,
    scope,
    move,
  };
}

describe('timeline cast move lifecycle', () => {
  it('rolls back a cancelled preview and releases listeners without adding history', () => {
    const f = fixture();
    expect(f.interactionSession.current?.owner).toBe('cast-move');
    f.movement.cancelCastMove();
    expect(f.scenario.value).toBe(f.original);
    expect(f.interactionSession.current).toBeNull();
    expect(f.simulationService.endInteractiveSession).toHaveBeenCalledTimes(1);
    f.move();
    expect(f.scenario.value).toBe(f.original);
    expect(f.commitScenario).not.toHaveBeenCalled();
    f.scope.stop();
    expect(f.simulationService.endInteractiveSession).toHaveBeenCalledTimes(1);
  });

  it('discards the old preview on project replacement without restoring the old scenario', () => {
    const f = fixture();
    const replacement = createEmptyScenario('replacement', 'replacement');
    f.scenario.value = replacement;
    f.movement.discardCastMove();
    f.interactionSession.cancel();
    f.scope.stop();
    expect(f.scenario.value).toBe(replacement);
    expect(f.movement.castMoveGesture.value).toBeNull();
    expect(f.simulationService.endInteractiveSession).toHaveBeenCalledTimes(1);
    expect(f.commitScenario).not.toHaveBeenCalled();
  });
});
