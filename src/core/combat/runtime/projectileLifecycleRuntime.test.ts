import { describe, expect, it } from 'vitest';
import { ProjectileLifecycleRuntime } from './projectileLifecycleRuntime';
import { AbilityEntityInstanceIdAllocator } from './abilityEntityInstanceIdAllocator';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';

describe('ProjectileLifecycleRuntime', () => {
  it('来源在结束技能与 reset 通知期间可查，实际回收完成后释放', () => {
    const runtime = new ProjectileLifecycleRuntime();
    const source = { kind: 'abilityEntity' as const, instanceId: 99 };
    const seen: unknown[] = [];
    const projectile = runtime.launch({
      source,
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 1,
      finish: () => seen.push(runtime.findSource(projectile.target.instanceId)),
      beforeReset: () => seen.push(runtime.findSource(projectile.target.instanceId)),
    });
    projectile.onReset(() => seen.push(runtime.findSource(projectile.target.instanceId)));
    runtime.advanceFrame();
    runtime.advanceFrame();
    expect(runtime.isActive(projectile.target)).toBe(true);
    runtime.advanceFrame();
    expect(seen).toEqual([source, source, source]);
    expect(runtime.isActive(projectile.target)).toBe(false);
    expect(runtime.findSource(projectile.target.instanceId)).toBeUndefined();
  });
  it('与普通能力实体共享全场唯一的实例身份空间', () => {
    const ids = new AbilityEntityInstanceIdAllocator();
    const projectiles = new ProjectileLifecycleRuntime(() => ids.allocate());
    const entities = new LogicalAbilityEntityRuntime({ allocateInstanceId: () => ids.allocate() });
    const projectile = projectiles.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 1,
      finish: () => {},
      beforeReset: () => {},
    });
    const entity = entities.spawn({
      abilityEntityId: 'fixture',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    expect(projectile.target).toEqual({ kind: 'abilityEntity', instanceId: 1 });
    expect(entity).toEqual({ kind: 'abilityEntity', instanceId: 2 });
  });

  it('admits Default-group launches but defers launches made inside the Battle group', () => {
    const runtime = new ProjectileLifecycleRuntime();
    const calls: string[] = [];
    const launch = (name: string) =>
      runtime.launch({
        finishDelaySeconds: 10,
        recycleDelaySeconds: 0,
        resolveTickDeltaSeconds: () => 1,
        finish: () => {},
        beforeReset: () => {},
        abilityRuntime: { advanceFrame: () => calls.push(name) },
      });
    launch('default');
    runtime.beginAbilityFrame();
    launch('battle');
    runtime.advanceAbilityFrame();
    expect(calls).toEqual(['default']);
    runtime.beginAbilityFrame();
    runtime.advanceAbilityFrame();
    expect(calls).toEqual(['default', 'default', 'battle']);
  });

  it('keeps the marked object alive for Battle but never ticks an actually reset host', () => {
    const runtime = new ProjectileLifecycleRuntime();
    const calls: string[] = [];
    runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => 1,
      finish: () => calls.push('finish'),
      beforeReset: () => calls.push('end'),
      abilityRuntime: { advanceFrame: () => calls.push('ability') },
    });
    const frame = () => {
      runtime.advanceFrame();
      runtime.beginAbilityFrame();
      runtime.advanceAbilityFrame();
    };
    frame();
    frame();
    frame();
    expect(calls).toEqual(['finish', 'ability', 'ability', 'end']);
  });

  it('does not reuse component tick admission for the separate ability host', () => {
    const runtime = new ProjectileLifecycleRuntime();
    let ticks = 0;
    runtime.launch({
      finishDelaySeconds: 1,
      recycleDelaySeconds: 0,
      resolveTickDeltaSeconds: () => null,
      finish: () => {},
      beforeReset: () => {},
      abilityRuntime: { advanceFrame: () => ticks++ },
    });
    runtime.advanceFrame();
    runtime.beginAbilityFrame();
    runtime.advanceAbilityFrame();
    expect(ticks).toBe(1);
    expect(() => runtime.advanceAbilityFrame()).toThrow('captured first');
  });
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
