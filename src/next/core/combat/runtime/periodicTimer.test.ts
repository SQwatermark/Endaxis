import { describe, expect, it } from 'vitest';
import { PeriodicTimer } from './periodicTimer';

describe('PeriodicTimer', () => {
  it('advances and clamps at the ready boundary', () => {
    const timer = new PeriodicTimer();
    timer.reset(10, true);

    expect(timer.update(3)).toBe(false);
    expect(timer.progress).toBeCloseTo(0.3);
    expect(timer.update(7)).toBe(true);
    expect(timer.isReady).toBe(true);
    expect(timer.progress).toBe(1);
  });

  it('preserves the native invalid state', () => {
    const timer = new PeriodicTimer();
    expect(timer.isValid).toBe(false);
    expect(timer.progress).toBe(0);
  });

  it('sets remaining time while preserving the configured period', () => {
    const timer = new PeriodicTimer();
    timer.reset(10, true);

    timer.setRemaining(4);
    expect(timer.remaining).toBe(4);
    expect(timer.passed).toBe(6);
    expect(timer.progress).toBeCloseTo(0.6);

    timer.setRemaining(20);
    expect(timer.remaining).toBe(20);
    expect(timer.passed).toBe(0);
    expect(timer.progress).toBe(0);
  });
});
