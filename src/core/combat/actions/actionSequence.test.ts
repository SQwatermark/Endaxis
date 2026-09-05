import { describe, expect, it } from 'vitest';
import { CombatStep, STEP_RESULT_MODE, type CombatExecutionContext } from './combatStep';
import { ActionSequence } from './actionSequence';

class ProbeStep extends CombatStep {
  constructor(
    private readonly name: string,
    private readonly calls: string[],
    private readonly result = true,
  ) {
    super();
  }

  execute(): void {
    this.calls.push(`execute:${this.name}`);
  }

  override tryExecute(): boolean {
    this.execute();
    return this.result;
  }

  override tick(): void {
    this.calls.push(`tick:${this.name}`);
  }

  override end(): void {
    this.calls.push(`end:${this.name}`);
  }

  override reset(): void {
    this.calls.push(`reset:${this.name}`);
  }
}

describe('ActionSequence', () => {
  it('executes synchronously in configured order and stops at the first failure', () => {
    const calls: string[] = [];
    const sequence = new ActionSequence([
      new ProbeStep('buff', calls),
      new ProbeStep('condition', calls, false),
      new ProbeStep('damage', calls),
    ]);

    expect(sequence.tryExecute({})).toBe(false);
    expect(calls).toEqual(['execute:buff', 'execute:condition']);
  });

  it('ticks and ends only successfully executed children', () => {
    const calls: string[] = [];
    const context: CombatExecutionContext = {};
    const sequence = new ActionSequence([
      new ProbeStep('first', calls),
      new ProbeStep('second', calls),
    ]);

    expect(sequence.tryExecute(context)).toBe(true);
    sequence.tick(1 / 30, context);
    sequence.end(context);

    expect(calls).toEqual([
      'execute:first',
      'execute:second',
      'tick:first',
      'tick:second',
      'end:first',
      'end:second',
    ]);
  });

  it('can invert the next step result', () => {
    const calls: string[] = [];
    const context: CombatExecutionContext = {
      sequence: { resultMode: STEP_RESULT_MODE.invertNextResult },
    };
    const sequence = new ActionSequence([
      new ProbeStep('condition', calls, false),
      new ProbeStep('damage', calls),
    ]);

    expect(sequence.tryExecute(context)).toBe(true);
    expect(context.sequence?.resultMode).toBe(STEP_RESULT_MODE.normal);
    expect(calls).toEqual(['execute:condition', 'execute:damage']);
  });
});
