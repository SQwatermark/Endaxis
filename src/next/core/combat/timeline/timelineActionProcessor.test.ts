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

function timelineAction(
  startFrame: number,
  endFrame: number,
  name: string,
  events: string[],
): TimelineAction {
  return {
    startFrame,
    endFrame,
    sequence: new ActionSequence([new RecordingStep(name, events)]),
  };
}

describe('TimelineActionProcessor', () => {
  const context: CombatExecutionContext = {};

  it('starts, ticks, and ends an action on its inclusive frame interval', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([timelineAction(2, 3, 'action', events)]);
    processor.reset(context);

    processor.tick(1, 1 / 30, context);
    processor.tick(2, 1 / 30, context);
    processor.tick(3, 1 / 30, context);

    expect(events).toEqual(['action:execute', 'action:tick', 'action:tick', 'action:end']);
    expect(processor.isComplete).toBe(true);
  });

  it('uses source order for equal start frames', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([
      timelineAction(1, 1, 'first', events),
      timelineAction(1, 1, 'second', events),
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

  it('ticks an earlier active action before starting a later action', () => {
    const events: string[] = [];
    const processor = new TimelineActionProcessor([
      timelineAction(1, 3, 'active', events),
      timelineAction(2, 2, 'new', events),
    ]);
    processor.reset(context);
    processor.tick(1, 1 / 30, context);
    events.length = 0;

    processor.tick(2, 1 / 30, context);

    expect(events).toEqual(['active:tick', 'new:execute', 'new:tick', 'new:end']);
  });

  it('ends only active actions when a skill finishes early', () => {
    const events: string[] = [];
    const future = timelineAction(10, 10, 'future', events);
    const lifecycle = { started: vi.fn(), ended: vi.fn() };
    const processor = new TimelineActionProcessor(
      [timelineAction(1, 5, 'active', events), future],
      lifecycle,
    );
    processor.reset(context);
    processor.tick(1, 1 / 30, context);

    processor.end(2, context);

    expect(events).toEqual(['active:execute', 'active:tick', 'active:end']);
    expect(lifecycle.started).toHaveBeenCalledTimes(1);
    expect(lifecycle.ended).toHaveBeenCalledTimes(1);
    expect(processor.isComplete).toBe(false);
  });

  it('rejects invalid intervals before runtime', () => {
    expect(() => new TimelineActionProcessor([timelineAction(2, 1, 'invalid', [])])).toThrow(
      'timeline action 0 ends before it starts',
    );
  });
});
