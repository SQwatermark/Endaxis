import { describe, expect, it } from 'vitest';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { CombatVitals } from './combatVitals';

function createVitals(overrides: Partial<ConstructorParameters<typeof CombatVitals>[0]> = {}) {
  return new CombatVitals({
    health: 1000,
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
    expect(vitals.applyPoiseDelta(-120)).toMatchObject({
      actualDelta: -80,
      brokePoise: true,
      currentPoise: 0,
    });
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

  it('checks poise immunity after the caller has had a chance to run before-events', () => {
    const vitals = createVitals({ poiseImmune: true });
    expect(vitals.applyPoiseDelta(-25)).toMatchObject({ cancelled: true, actualDelta: 0 });
    expect(vitals.applyPoiseDelta(-25, true)).toMatchObject({ cancelled: false, actualDelta: -25 });
  });

  it('advances the broken-tag timer in the same tick that recovers poise', () => {
    const vitals = createVitals({
      poiseRecoveryTime: COMBAT_FRAME_INTERVAL,
      poiseBrokenEndTime: COMBAT_FRAME_INTERVAL,
    });
    vitals.applyPoiseDelta(-100);
    expect(vitals.tick(COMBAT_FRAME_INTERVAL)).toEqual(['poiseRecovered', 'poiseBrokenTagEnded']);
    expect(vitals.hasPoiseBrokenTag).toBe(false);
  });
});
