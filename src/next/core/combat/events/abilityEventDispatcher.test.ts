import { describe, expect, it } from 'vitest';
import { AbilityEventDispatcher } from './abilityEventDispatcher';

describe('AbilityEventDispatcher', () => {
  it('uses the confirmed callback, data-action, skill, and combo phase order', () => {
    const events: string[] = [];
    const dispatcher = new AbilityEventDispatcher<'hit', number>();
    dispatcher.registerCallback('hit', () => events.push('callback'));
    dispatcher.registerAction('hit', 10, () => events.push('action-low'));
    dispatcher.registerAction('hit', 20, () => events.push('action-high'));

    dispatcher.dispatch(
      { event: 'hit', payload: 1 },
      [
        { onAbilityEvent: () => events.push('skill-1') },
        { onAbilityEvent: () => events.push('skill-2') },
      ],
      { onAbilityEvent: () => events.push('combo') },
    );

    expect(events).toEqual([
      'callback',
      'action-high',
      'action-low',
      'skill-1',
      'skill-2',
      'combo',
    ]);
  });

  it('dispatches from snapshots when a callback mutates registration', () => {
    const events: string[] = [];
    const dispatcher = new AbilityEventDispatcher<'event'>();
    dispatcher.registerCallback('event', () => {
      events.push('first');
      dispatcher.registerCallback('event', () => events.push('late'));
    });

    dispatcher.dispatch({ event: 'event', payload: undefined }, []);
    dispatcher.dispatch({ event: 'event', payload: undefined }, []);

    expect(events).toEqual(['first', 'first', 'late']);
  });

  it('rejects unresolved equal-priority action ordering', () => {
    const dispatcher = new AbilityEventDispatcher<'event'>();
    dispatcher.registerAction('event', 0, () => undefined);

    expect(() => dispatcher.registerAction('event', 0, () => undefined)).toThrow(
      "ability event 'event' has multiple actions at unresolved priority 0",
    );
  });
});
