import { describe, expect, it } from 'vitest';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { CombatVitals } from './combatVitals';

function createVitals(overrides: Partial<ConstructorParameters<typeof CombatVitals>[0]> = {}) {
  return new CombatVitals({
    health: 1000,
    maxHealth: 1000,
    maxPoise: 100,
    poise: 100,
    poiseRecoveryTime: 1,
    poiseRecoveryTimeMultiplier: 1,
    poiseBrokenEndTime: 0,
    poiseImmune: false,
    ...overrides,
  });
}

describe('CombatVitals', () => {
  it('requires a positive maximum health that covers current health', () => {
    expect(() => createVitals({ maxHealth: 0 })).toThrow('maxHealth must be positive');
    expect(() => createVitals({ health: 1001 })).toThrow('health exceeds maxHealth');
  });

  it('clamps health damage to zero and reports actual damage', () => {
    const vitals = createVitals({ health: 100 });
    expect(vitals.takeDamage(150)).toEqual({
      requestedDamage: 150,
      actualDamage: 100,
      previousHealth: 100,
      currentHealth: 0,
    });
  });

  it('clamps poise damage, starts recovery, and supports pausing', () => {
    const vitals = createVitals({ poise: 80, poiseRecoveryTimeMultiplier: 0.5 });
    expect(vitals.applyPoiseDelta(-120)).toBe(-80);
    expect(vitals.beginPoiseBreakIfZero()).toBe(true);
    vitals.tick(COMBAT_FRAME_INTERVAL);
    const progress = vitals.poiseRecoveryProgress;
    vitals.stopPoiseRecovery = true;
    vitals.tick(COMBAT_FRAME_INTERVAL * 10);
    expect(vitals.poiseRecoveryProgress).toBe(progress);
    vitals.stopPoiseRecovery = false;
    expect(vitals.tick(COMBAT_FRAME_INTERVAL * 14)).toEqual(['poiseRecovered']);
    expect(vitals.poise).toBe(100);
    expect(vitals.hasPoiseBrokenTag).toBe(false);
  });

  it('exposes immunity while leaving its event-sensitive check to the executor', () => {
    const vitals = createVitals({ poiseImmune: true });
    expect(vitals.poiseImmune).toBe(true);
    expect(vitals.applyPoiseDelta(-25)).toBe(-25);
  });

  it('advances the broken-tag timer in the same tick that recovers poise', () => {
    const vitals = createVitals({
      poiseRecoveryTime: COMBAT_FRAME_INTERVAL,
      poiseBrokenEndTime: COMBAT_FRAME_INTERVAL,
    });
    vitals.applyPoiseDelta(-100);
    vitals.beginPoiseBreakIfZero();
    const observed: [string, boolean][] = [];
    expect(
      vitals.tick(COMBAT_FRAME_INTERVAL, transition => {
        observed.push([transition, vitals.hasPoiseBrokenTag]);
      }),
    ).toEqual(['poiseRecovered', 'poiseBrokenTagEnded']);
    expect(observed).toEqual([
      ['poiseRecovered', true],
      ['poiseBrokenTagEnded', false],
    ]);
    expect(vitals.hasPoiseBrokenTag).toBe(false);
  });
});
