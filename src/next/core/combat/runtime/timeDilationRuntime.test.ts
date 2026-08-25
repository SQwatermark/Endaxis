import { describe, expect, it } from 'vitest';
import { TimeDilationRuntime } from './timeDilationRuntime';

const LOW = 10;
const HIGH = 20;

function createRuntime() {
  return new TimeDilationRuntime({});
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

  it('reports accepted, replaced and rejected instances with their source', () => {
    const events: string[] = [];
    const runtime = new TimeDilationRuntime(
      {},
      {
        started: (_kind, instance) => events.push(`started:${instance.source?.sourceActionId}`),
        rejected: (_kind, instance) => events.push(`rejected:${instance.source?.sourceActionId}`),
        ended: (_kind, instance, reason) =>
          events.push(`ended:${instance.source?.sourceActionId}:${reason}`),
      },
    );
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.5,
      source: { sourceId: 'operator', sourceActionId: 'first' },
    });
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: HIGH,
      constantScale: 0.4,
      source: { sourceId: 'operator', sourceActionId: 'second' },
    });
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.3,
      source: { sourceId: 'operator', sourceActionId: 'third' },
    });

    expect(events).toEqual([
      'started:first',
      'ended:first:replaced',
      'started:second',
      'rejected:third',
    ]);
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
      entityId: 'ignored',
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      curve: () => 0.4,
    });
    runtime.startEntity({
      entityId: 'other',
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

  it('accepts a zero-duration entity instance for its native validity window', () => {
    const runtime = createRuntime();
    runtime.startEntity({
      entityId: 'target',
      durationSeconds: 0,
      slot: 1,
      priority: LOW,
      curve: () => 0,
    });

    expect(runtime.getEntityScale('target')).toBe(0);
    runtime.advanceFrame();
    expect(runtime.entityInstances).toHaveLength(1);
    runtime.advanceFrame();
    expect(runtime.entityInstances).toHaveLength(0);
  });

  it('starts and stops the configured ultimate slot explicitly', () => {
    const runtime = createRuntime();
    const id = runtime.startUltimate(HIGH, 0, ['caster']);

    expect(runtime.currentGlobalScale).toBe(0);
    expect(runtime.getOperatorScale('caster')).toBe(1);

    runtime.stop(id);
    expect(runtime.currentGlobalScale).toBe(1);
  });

  it('resolves default, global, self and cooldown clocks independently', () => {
    const runtime = createRuntime();
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.5,
      influenceSkillCooldownSeconds: 0.25,
      ignoredOperatorIds: ['ignored'],
    });
    runtime.startEntity({
      entityId: 'ignored',
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      curve: () => 0.4,
    });

    expect(runtime.getAbilityTickDeltas('ignored', 1 / 30, 2)).toEqual({
      defaultDeltaSeconds: 1 / 30,
      globalScaledDeltaSeconds: 1 / 60,
      selfScaledDeltaSeconds: (1 / 30) * 0.4,
      skillCooldownDeltaSeconds: 1 / 60,
    });
    expect(runtime.getAbilityTickDeltas('other', 1 / 30, 0).defaultDeltaSeconds).toBe(1 / 60);
  });

  it('uses global-scaled lifetime only for configured entity slots', () => {
    const runtime = new TimeDilationRuntime({
      entityLifetimeUsesGlobalScaleBySlot: new Map([[2, true]]),
    });
    runtime.startGlobal({
      durationSeconds: 1,
      slot: 1,
      priority: LOW,
      constantScale: 0.5,
    });
    runtime.startEntity({
      entityId: 'scaled',
      durationSeconds: 1,
      slot: 2,
      priority: LOW,
      curve: () => 1,
    });
    runtime.startEntity({
      entityId: 'raw',
      durationSeconds: 1,
      slot: 3,
      priority: LOW,
      curve: () => 1,
    });

    runtime.advanceFrame();

    expect(
      runtime.entityInstances.find(instance => instance.entityId === 'scaled')?.elapsedSeconds,
    ).toBeCloseTo(1 / 60);
    expect(
      runtime.entityInstances.find(instance => instance.entityId === 'raw')?.elapsedSeconds,
    ).toBeCloseTo(1 / 30);
  });
});
