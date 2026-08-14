import { describe, expect, it } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatTimelineClock } from './combatTimelineClock';

describe('CombatTimelineClock', () => {
  it('integrates the current global scale and records only non-identity intervals', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    let scale = 0.5;
    const timeline = new CombatTimelineClock({
      clock,
      receipt,
      resolveGlobalScale: () => scale,
    });

    clock.advanceFrame();
    timeline.advanceFrame();
    clock.advanceFrame();
    timeline.advanceFrame();
    scale = 1;
    clock.advanceFrame();
    timeline.advanceFrame();
    clock.advanceFrame();
    timeline.advanceFrame();

    expect(timeline.frame).toBe(3);
    expect(receipt.entries.map(entry => entry.data)).toEqual([
      { logicalFrame: 0.5, globalScale: 0.5 },
      { logicalFrame: 1, globalScale: 0.5 },
      { logicalFrame: 2, globalScale: 1 },
    ]);
  });
});
