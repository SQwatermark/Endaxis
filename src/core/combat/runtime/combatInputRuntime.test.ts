import { describe, expect, it, vi } from 'vitest';
import { CombatClock } from './combatClock';
import { CombatInputRuntime } from './combatInputRuntime';
import { CombatReceiptCollector } from '../receipt/combatReceipt';

describe('CombatInputRuntime', () => {
  it('preserves same-frame input order and records acceptance', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const tryStartSkill = vi.fn(
      (_operatorId: string, skillId: string, castId?: string) =>
        skillId === 'first' && castId === 'cast:first',
    );
    const runtime = new CombatInputRuntime({
      clock,
      receipt,
      tryStartSkill,
      inputs: [
        { frame: 0, operatorId: 'operator', skillId: 'first', castId: 'cast:first' },
        { frame: 0, operatorId: 'operator', skillId: 'second', castId: 'cast:second' },
      ],
    });

    runtime.applyCurrentFrame();

    expect(tryStartSkill.mock.calls).toEqual([
      ['operator', 'first', 'cast:first'],
      ['operator', 'second', 'cast:second'],
    ]);
    expect(receipt.entries.map(entry => entry.data?.accepted)).toEqual([true, false]);
    expect(receipt.entries.map(entry => entry.data?.castId)).toEqual(['cast:first', 'cast:second']);
  });

  it('rejects out-of-order schedules instead of silently sorting them', () => {
    expect(
      () =>
        new CombatInputRuntime({
          clock: new CombatClock(),
          receipt: new CombatReceiptCollector(),
          tryStartSkill: () => true,
          inputs: [
            { frame: 2, operatorId: 'operator', skillId: 'later' },
            { frame: 1, operatorId: 'operator', skillId: 'earlier' },
          ],
        }),
    ).toThrow('scheduled skill inputs must be ordered by frame');
  });
});
