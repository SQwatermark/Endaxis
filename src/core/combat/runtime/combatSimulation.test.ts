import { describe, expect, it, vi } from 'vitest';
import { CombatClock } from './combatClock';
import { CombatSimulation } from './combatSimulation';

describe('CombatSimulation', () => {
  it('advances the shared clock before runtime systems', () => {
    const clock = new CombatClock();
    const observedFrames: number[] = [];
    const simulation = new CombatSimulation(clock);
    simulation.add({ advanceFrame: () => observedFrames.push(clock.frame) });

    simulation.advanceFrames(3);

    expect(observedFrames).toEqual([1, 2, 3]);
    expect(clock.time).toBe(0.1);
  });

  it('ticks systems in registration order', () => {
    const simulation = new CombatSimulation(new CombatClock());
    const order: string[] = [];
    simulation.add({ advanceFrame: vi.fn(() => order.push('first')) });
    simulation.add({ advanceFrame: vi.fn(() => order.push('second')) });

    simulation.advanceFrame();

    expect(order).toEqual(['first', 'second']);
  });
});
