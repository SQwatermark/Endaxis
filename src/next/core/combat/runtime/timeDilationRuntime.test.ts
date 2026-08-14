import { describe, expect, it } from 'vitest';
import { TimeDilationRuntime } from './timeDilationRuntime';

const LOW = 10;
const HIGH = 20;

function createRuntime() {
  return new TimeDilationRuntime({
    priorities: new Map([
      [LOW, 10],
      [HIGH, 50],
    ]),
    ultimateSlot: 99,
  });
}

describe('TimeDilationRuntime', () => {
  it('lets the source ignore a global curve while other operators use it', () => {
    const runtime = createRuntime();
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      curve: progress => 0.01 + progress * 0.99,
      ignoredOperatorIds: ['caster'],
    });

    expect(runtime.currentGlobalScale).toBeCloseTo(0.01);
    expect(runtime.getOperatorScale('caster')).toBe(1);
    expect(runtime.getOperatorScale('other')).toBeCloseTo(0.01);

    runtime.advanceFrame();

    expect(runtime.currentGlobalScale).toBeCloseTo(0.01);
    runtime.advanceFrame();
    expect(runtime.currentGlobalScale).toBeGreaterThan(0.01);
  });

  it('keeps the stronger same-slot instance and replaces a weaker one with higher priority', () => {
    const runtime = createRuntime();
    const first = runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: HIGH,
      constantScale: 0.2,
    });
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.1,
    });
    expect(runtime.globalInstances.map(instance => instance.id)).toEqual([first]);

    const replacement = runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: HIGH,
      constantScale: 0.4,
    });
    expect(runtime.globalInstances.map(instance => instance.id)).toEqual([replacement]);
    expect(runtime.currentGlobalScale).toBe(0.4);
  });

  it('uses the lowest scale across different global slots and keeps registration order on ties', () => {
    const runtime = createRuntime();
    const first = runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.3,
      influenceSkillCooldownSeconds: 0.5,
    });
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      constantScale: 0.3,
    });
    expect(runtime.globalInstances[0]?.id).toBe(first);
    expect(runtime.activeGlobalInfluencesSkillCooldown).toBe(true);
  });

  it('multiplies entity and global scales unless the operator ignores global scale', () => {
    const runtime = createRuntime();
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.5,
      ignoredOperatorIds: ['ignored'],
    });
    runtime.startEntity({
      operatorId: 'ignored',
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      curve: () => 0.4,
    });
    runtime.startEntity({
      operatorId: 'other',
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      curve: () => 0.4,
    });

    expect(runtime.getOperatorScale('ignored')).toBeCloseTo(0.4);
    expect(runtime.getOperatorScale('other')).toBeCloseTo(0.2);
  });

  it('removes a naturally expired instance on the tick after it crosses duration', () => {
    const runtime = createRuntime();
    runtime.startGlobal({
      durationSeconds: 1 / 30,
      slot: 1,
      priority: LOW,
      constantScale: 0.1,
    });

    runtime.advanceFrame();
    expect(runtime.globalInstances).toHaveLength(1);
    runtime.advanceFrame();
    expect(runtime.globalInstances).toHaveLength(1);
    runtime.advanceFrame();
    expect(runtime.globalInstances).toHaveLength(0);
  });

  it('starts and stops the configured ultimate slot explicitly', () => {
    const runtime = createRuntime();
    const id = runtime.startUltimate(HIGH, 0, ['caster']);

    expect(runtime.currentGlobalScale).toBe(0);
    expect(runtime.getOperatorScale('caster')).toBe(1);

    runtime.stop(id);
    expect(runtime.currentGlobalScale).toBe(1);
  });
});
