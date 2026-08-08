import { describe, expect, it, vi } from 'vitest';
import { ActionSequence } from '../actions/actionSequence';
import { CombatStep, type CombatExecutionContext } from '../actions/combatStep';
import { TimelineActionProcessor, type TimelineAction } from './timelineActionProcessor';

class RecordingStep extends CombatStep {
  constructor(
    readonly name: string,
    readonly events: string[],
  ) {
    super();
  }

  execute(): void {
    this.events.push(`${this.name}:execute`);
  }

  override tick(): void {
    this.events.push(`${this.name}:tick`);
  }

  override end(): void {
    this.events.push(`${this.name}:end`);
  }
}

function timelineAction(startFrame: number, name: string, events: string[]): TimelineAction {
  return {
    startFrame,
    sequence: new ActionSequence([new RecordingStep(name, events)]),
  };
}

function rangedTimelineAction(
  startFrame: number,
  endFrame: number,
  name: string,
  events: string[],
): TimelineAction {
  return { ...timelineAction(startFrame, name, events), endFrame };
}

describe('TimelineActionProcessor', () => {
  const context: CombatExecutionContext = {};

  it('executes and ends an action at its scheduled frame', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([timelineAction(2, 'action', events)]);
    processor.reset(context);

    processor.tick(1, 1 / 30, context);
    processor.tick(2, 1 / 30, context);
    processor.tick(3, 1 / 30, context);

    expect(events).toEqual(['action:execute', 'action:tick', 'action:end']);
    expect(processor.isComplete).toBe(true);
  });

  it('uses source order for equal start frames', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([
      timelineAction(1, 'first', events),
      timelineAction(1, 'second', events),
    ]);
    processor.reset(context);

    processor.tick(1, 1 / 30, context);

    expect(events).toEqual([
      'first:execute',
      'first:tick',
      'first:end',
      'second:execute',
      'second:tick',
      'second:end',
    ]);
  });

  it('executes actions only when their frames are reached', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([
      timelineAction(1, 'first', events),
      timelineAction(2, 'second', events),
    ]);
    processor.reset(context);
    processor.tick(1, 1 / 30, context);
    events.length = 0;

    processor.tick(2, 1 / 30, context);

    expect(events).toEqual(['second:execute', 'second:tick', 'second:end']);
  });

  it('does not execute future actions when a skill finishes early', () => {
    const events: string[] = [];
    const future = timelineAction(10, 'future', events);
    const lifecycle = { started: vi.fn(), ended: vi.fn() };
    const processor = new TimelineActionProcessor(
      [timelineAction(1, 'action', events), future],
      lifecycle,
    );
    processor.reset(context);
    processor.tick(1, 1 / 30, context);

    processor.end(2, context);

    expect(events).toEqual(['action:execute', 'action:tick', 'action:end']);
    expect(lifecycle.started).toHaveBeenCalledTimes(1);
    expect(lifecycle.ended).toHaveBeenCalledTimes(1);
    expect(processor.isComplete).toBe(false);
  });

  it('ticks an active ranged action until its inclusive end frame', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([rangedTimelineAction(2, 4, 'ranged', events)]);
    processor.reset(context);

    processor.tick(2, 1 / 30, context);
    processor.tick(3, 1 / 30, context);
    processor.tick(4, 1 / 30, context);

    expect(events).toEqual([
      'ranged:execute',
      'ranged:tick',
      'ranged:tick',
      'ranged:tick',
      'ranged:end',
    ]);
    expect(processor.isComplete).toBe(true);
  });

  it('ends an active ranged action when its parent skill is interrupted', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([rangedTimelineAction(1, 10, 'ranged', events)]);
    processor.reset(context);
    processor.tick(1, 1 / 30, context);

    processor.end(3, context);

    expect(events).toEqual(['ranged:execute', 'ranged:tick', 'ranged:end']);
  });

  it('rejects non-integer frames before runtime', () => {
    expect(() => new TimelineActionProcessor([timelineAction(1.5, 'invalid', [])])).toThrow(
      'timeline action 0 must use an integer frame',
    );
  });
});
