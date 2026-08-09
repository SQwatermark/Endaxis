import { describe, expect, it } from 'vitest';
import { AbilityEventDispatcher } from './abilityEventDispatcher';
import { AbilityEventListenerStep } from './abilityEventListenerStep';

describe('AbilityEventListenerStep', () => {
  it('keeps event actions registered until the outer step ends', () => {
    const events: string[] = [];
    const dispatcher = new AbilityEventDispatcher<'hit'>();
    const listener = new AbilityEventListenerStep<'hit'>(dispatcher, [
      { event: 'hit', priority: 10, execute: () => events.push('listener') },
    ]);

    listener.execute({});
    dispatcher.dispatch({ event: 'hit', payload: undefined }, []);
    listener.end({});
    dispatcher.dispatch({ event: 'hit', payload: undefined }, []);

    expect(events).toEqual(['listener']);
  });

  it('rolls back earlier registrations when a later map cannot be registered', () => {
    const events: string[] = [];
    const dispatcher = new AbilityEventDispatcher<'first' | 'second'>();
    dispatcher.registerAction('second', 10, () => events.push('existing'));
    const listener = new AbilityEventListenerStep<'first' | 'second'>(dispatcher, [
      { event: 'first', priority: 10, execute: () => events.push('rolled-back') },
      { event: 'second', priority: 10, execute: () => events.push('unreachable') },
    ]);

    expect(() => listener.execute({})).toThrow(
      "ability event 'second' has multiple actions at unresolved priority 10",
    );
    dispatcher.dispatch({ event: 'first', payload: undefined }, []);
    dispatcher.dispatch({ event: 'second', payload: undefined }, []);

    expect(events).toEqual(['existing']);
  });
});
