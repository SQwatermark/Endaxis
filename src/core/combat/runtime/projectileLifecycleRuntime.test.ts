import { describe, expect, it } from 'vitest';
import { ProjectileLifecycleRuntime } from './projectileLifecycleRuntime';

describe('ProjectileLifecycleRuntime', () => {
  it('uses native float32 subtraction at the finish boundary', () => {
    const runtime = new ProjectileLifecycleRuntime();
    let finishes = 0;
    runtime.launch({
      finishDelaySeconds: 0.3,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 0.1,
      finish: () => finishes++,
      beforeReset: () => {},
    });
    // Native 0.3f - 0.1f - 0.1f - 0.1f is still positive; double arithmetic is not.
    for (let tick = 0; tick < 3; tick++) runtime.advanceFrame();
    expect(finishes).toBe(0);
    runtime.advanceFrame();
    expect(finishes).toBe(1);
  });

  it('does not expire early using the ready epsilon', () => {
    const runtime = new ProjectileLifecycleRuntime();
    let delta = 0.999999;
    let finishes = 0;
    runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => delta,
      finish: () => finishes++,
      beforeReset: () => {},
    });
    runtime.advanceFrame();
    expect(finishes).toBe(0);
    delta = 0.001;
    runtime.advanceFrame();
    expect(finishes).toBe(1);
  });

  it('keeps its reference through finish and expiry, then cleans up before reset', () => {
    const runtime = new ProjectileLifecycleRuntime();
    const trace: string[] = [];
    const projectile = runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0.5,
      resolveTickDeltaSeconds: () => 0.5,
      finish: () => trace.push('finish'),
      beforeReset: () => trace.push('end-callback-skill'),
    });
    projectile.onReset(() => trace.push('reset'));
    runtime.advanceFrame();
    expect(trace).toEqual([]);
    runtime.advanceFrame();
    expect(trace).toEqual(['finish']);
    runtime.advanceFrame();
    expect(trace).toEqual(['finish']);
    expect(runtime.activeCount).toBe(1);
    runtime.advanceFrame();
    expect(trace).toEqual(['finish', 'end-callback-skill', 'reset']);
    expect(runtime.activeCount).toBe(0);
    runtime.advanceFrame();
    expect(trace).toHaveLength(3);
    expect(() => projectile.onReset(() => {})).toThrow('already reset');
  });

  it('does not reset on a skipped Tick, even after marking; zero delay still has phases', () => {
    const runtime = new ProjectileLifecycleRuntime();
    let delta: number | null = 1;
    const trace: string[] = [];
    runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => delta,
      finish: () => trace.push('finish'),
      beforeReset: () => trace.push('reset'),
    });
    runtime.advanceFrame();
    delta = 0;
    runtime.advanceFrame();
    expect(trace).toEqual(['finish']);
    delta = null;
    runtime.advanceFrame();
    expect(runtime.activeCount).toBe(1);
    delta = 0;
    runtime.advanceFrame();
    expect(trace).toEqual(['finish', 'reset']);
  });

  it('disposes one registration without releasing the object or the other registration', () => {
    const runtime = new ProjectileLifecycleRuntime();
    let resets = 0;
    const projectile = runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 1,
      finish: () => {},
      beforeReset: () => {},
    });
    const callback = () => resets++;
    const first = projectile.onReset(callback);
    projectile.onReset(callback);
    first.dispose();
    first.dispose();
    expect(runtime.activeCount).toBe(1);
    for (let tick = 0; tick < 3; tick++) runtime.advanceFrame();
    expect(resets).toBe(1);
  });

  it('does not advance a projectile launched by another finish callback in the same pass', () => {
    const runtime = new ProjectileLifecycleRuntime();
    const trace: string[] = [];
    const request = {
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 1,
      beforeReset: () => {},
    };
    runtime.launch({
      ...request,
      finish: () => {
        trace.push('parent');
        runtime.launch({ ...request, finish: () => trace.push('child') });
      },
    });
    runtime.advanceFrame();
    expect(trace).toEqual(['parent']);
    runtime.advanceFrame();
    expect(trace).toEqual(['parent', 'child']);
  });
});
