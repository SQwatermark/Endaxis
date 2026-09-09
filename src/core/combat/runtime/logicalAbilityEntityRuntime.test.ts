import { describe, expect, it, vi } from 'vitest';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';

function createRuntime() {
  return new LogicalAbilityEntityRuntime({
    resolveDeltaSeconds: () => 0.25,
  });
}

describe('LogicalAbilityEntityRuntime', () => {
  it('前一个宿主回调释放后一个实体后，快照不再推进已释放实体', () => {
    const observed: string[] = [];
    let releaseNext = () => {};
    const runtime = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 0.1,
      hooks: {
        tickBuffs: entity => {
          observed.push(entity.abilityEntityId);
          if (entity.abilityEntityId === 'first') releaseNext();
        },
      },
    });
    for (const id of ['first', 'second']) {
      const target = runtime.spawn({
        abilityEntityId: id,
        ownerId: 'owner',
        source: { kind: 'operator', operatorId: 'owner' },
        definition: { lifetime: { kind: 'infinite' } },
      });
      if (id === 'second')
        releaseNext = () => {
          runtime.finish(target, 'explicit');
        };
    }
    runtime.advanceFrame();
    expect(observed).toEqual(['first']);
  });
  it('更新中生成的实体立即start，但Buff和技能的时间增量均从下一轮开始', () => {
    const observed: string[] = [];
    let spawned = false;
    const runtime = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 0.1,
      hooks: {
        tickBuffs: entity => observed.push(`${entity.abilityEntityId}:buff`),
        recycleBuffs: entity => observed.push(`${entity.abilityEntityId}:recycle`),
      },
    });
    runtime.spawn({
      abilityEntityId: 'parent',
      ownerId: 'owner',
      source: { kind: 'operator', operatorId: 'owner' },
      definition: { lifetime: { kind: 'infinite' } },
      createChildRuntime: () => ({
        start: () => {},
        finish: () => {},
        advance: () => {
          if (spawned) return;
          spawned = true;
          runtime.spawn({
            abilityEntityId: 'child',
            ownerId: 'owner',
            source: { kind: 'operator', operatorId: 'owner' },
            definition: { lifetime: { kind: 'infinite' } },
            createChildRuntime: () => ({
              start: () => observed.push('child:start'),
              finish: () => {},
              advance: () => observed.push('child:skill'),
            }),
          });
        },
      }),
    });
    runtime.advanceFrame();
    expect(observed).toEqual(['parent:buff', 'child:start', 'parent:recycle']);
    observed.length = 0;
    runtime.advanceFrame();
    expect(observed).toEqual([
      'parent:buff',
      'parent:recycle',
      'child:buff',
      'child:skill',
      'child:recycle',
    ]);
  });
  it('每个实体依次推进Buff、技能和回收，不跨实体批处理', () => {
    const observed: string[] = [];
    const runtime = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 0.1,
      hooks: {
        tickBuffs: entity => observed.push(`${entity.abilityEntityId}:buff`),
        recycleBuffs: entity => observed.push(`${entity.abilityEntityId}:recycle`),
      },
    });
    for (const id of ['first', 'second'])
      runtime.spawn({
        abilityEntityId: id,
        ownerId: 'owner',
        source: { kind: 'operator', operatorId: 'owner' },
        definition: { lifetime: { kind: 'infinite' } },
        createChildRuntime: () => ({
          start: () => {},
          finish: () => {},
          advance: () => observed.push(`${id}:skill`),
        }),
      });
    runtime.advanceFrame();
    expect(observed).toEqual([
      'first:buff',
      'first:skill',
      'first:recycle',
      'second:buff',
      'second:skill',
      'second:recycle',
    ]);
  });

  it('Buff更新结束实体后不再执行其技能或普通回收阶段', () => {
    const skill = vi.fn();
    const recycle = vi.fn();
    const runtime = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 0.1,
      hooks: {
        tickBuffs: entity =>
          runtime.finish({ kind: 'abilityEntity', instanceId: entity.instanceId }, 'explicit'),
        recycleBuffs: recycle,
      },
    });
    runtime.spawn({
      abilityEntityId: 'test',
      ownerId: 'owner',
      source: { kind: 'operator', operatorId: 'owner' },
      definition: { lifetime: { kind: 'infinite' } },
      createChildRuntime: () => ({ start: () => {}, finish: () => {}, advance: skill }),
    });
    runtime.advanceFrame();
    expect(skill).not.toHaveBeenCalled();
    expect(recycle).not.toHaveBeenCalled();
  });
  it.each(['explicit', 'durationExpired'] as const)(
    '出生及 %s 结束保留同一份完整来源，出生先于子技能',
    reason => {
      const observed: string[] = [];
      const skillCastInfo = {
        skillCastId: 42,
        originSkillId: 'origin',
        originSkillType: 'comboSkill' as const,
        nonReturnedSpCost: 17,
      };
      const runtime = new LogicalAbilityEntityRuntime({
        resolveDeltaSeconds: () => 1,
        hooks: {
          spawned: snapshot => {
            expect(snapshot.skillCastInfo).toBe(skillCastInfo);
            observed.push('spawned');
          },
          finished: snapshot => {
            expect(snapshot.skillCastInfo).toBe(skillCastInfo);
            observed.push('finished');
          },
        },
      });
      const entity = runtime.spawn({
        abilityEntityId: 'test',
        definition: { lifetime: { kind: 'limited', durationSeconds: 1 } },
        ownerId: 'owner',
        source: { kind: 'operator', operatorId: 'owner' },
        skillCastInfo,
        createChildRuntime: () => ({
          start: () => {
            observed.push('child');
          },
          advance: () => {},
          finish: () => {},
        }),
      });
      if (reason === 'explicit') runtime.finish(entity, reason);
      else {
        runtime.advanceFrame();
        runtime.advanceFrame();
      }
      expect(observed).toEqual(['spawned', 'child', 'finished']);
    },
  );
  it('uses one instance set for zero-space range and owner/entity-id lookup', () => {
    const runtime = createRuntime();
    const a = runtime.spawn({
      abilityEntityId: 'water',
      definition: { lifetime: { kind: 'limited', durationSeconds: 1 } },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      abilityEntityId: 'sword',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      abilityEntityId: 'water',
      definition: { lifetime: { kind: 'limited', durationSeconds: 1 } },
      ownerId: 'b',
      source: { kind: 'operator', operatorId: 'b' },
    });

    expect(runtime.findAll()).toHaveLength(3);
    expect(
      runtime.findOwnerSpawned({
        ownerId: 'a',
        abilityEntityIds: ['water'],
      }),
    ).toEqual([a]);
  });

  it('keeps per-instance duration, target and entity blackboard state', () => {
    const runtime = createRuntime();
    const entity = runtime.spawn({
      abilityEntityId: 'water',
      definition: { lifetime: { kind: 'limited', durationSeconds: 1 } },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
      target: { kind: 'enemy' },
      overrideDurationSeconds: 0.5,
      blackboardAssignments: { EntityBB_power: 3 },
    });
    runtime.setRemainingDuration(entity, 0.75);
    runtime.setTarget(entity, { kind: 'operator', operatorId: 'b' });
    runtime.advanceFrame();

    expect(runtime.snapshot(entity)).toMatchObject({
      target: { kind: 'operator', operatorId: 'b' },
      remainingDurationSeconds: 0.5,
      elapsedDurationSeconds: 0.25,
      blackboard: { EntityBB_power: 3 },
    });
  });

  it('filters owner-spawned entities by their source skill-cast identity', () => {
    const runtime = createRuntime();
    const first = runtime.spawn({
      abilityEntityId: 'seal',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'arcane',
      source: { kind: 'operator', operatorId: 'arcane' },
      sourceSkillCastId: 17,
    });
    runtime.spawn({
      abilityEntityId: 'seal',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'arcane',
      source: { kind: 'operator', operatorId: 'arcane' },
      sourceSkillCastId: 18,
    });

    expect(
      runtime.findOwnerSpawned({
        ownerId: 'arcane',
        abilityEntityIds: ['seal'],
        sourceSkillCastId: 17,
      }),
    ).toEqual([first]);
  });

  it('expires limited instances while infinite instances remain active', () => {
    const finished = vi.fn();
    const runtime = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 0.25,
      hooks: { finished },
    });
    runtime.spawn({
      abilityEntityId: 'short',
      definition: { lifetime: { kind: 'limited', durationSeconds: 0.5 } },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      abilityEntityId: 'forever',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });

    runtime.advanceFrame();
    runtime.advanceFrame();

    expect(runtime.activeCount).toBe(1);
    expect(finished).toHaveBeenCalledWith(expect.any(Object), 'durationExpired');
  });

  it('requests the child skill once and honors source-death ownership', () => {
    const childSkillRequested = vi.fn();
    const runtime = new LogicalAbilityEntityRuntime({
      hooks: { childSkillRequested },
    });
    const entity = runtime.spawn({
      abilityEntityId: 'child',
      definition: {
        lifetime: { kind: 'infinite' },
        childSkill: { skillId: 'child_skill' },
      },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
      dieWhenSourceDies: true,
    });

    expect(childSkillRequested).toHaveBeenCalledTimes(1);
    expect(runtime.isActive(entity)).toBe(true);
    expect(runtime.notifySourceDied({ kind: 'operator', operatorId: 'a' })).toBe(1);
    expect(runtime.isActive(entity)).toBe(true);
    expect(runtime.snapshot(entity).isAlive).toBe(false);
    expect(runtime.findOwnerSpawned({ ownerId: 'a' })).toEqual([entity]);
    expect(runtime.notifySourceDied({ kind: 'operator', operatorId: 'a' })).toBe(0);
    runtime.advanceFrame();
    expect(runtime.isActive(entity)).toBe(false);
    expect(runtime.activeCount).toBe(0);
  });

  it('keeps a killed entity discoverable until its native controller recycle delay elapses', () => {
    const runtime = createRuntime();
    const entity = runtime.spawn({
      abilityEntityId: 'delayed-release',
      definition: {
        lifetime: { kind: 'infinite' },
        deathReleaseDelaySeconds: 0.5,
      },
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });

    runtime.kill(entity);
    runtime.advanceFrame();
    expect(runtime.findOwnerSpawned({ ownerId: 'a' })).toEqual([entity]);
    expect(runtime.snapshot(entity).isAlive).toBe(false);
    runtime.advanceFrame();
    expect(runtime.findOwnerSpawned({ ownerId: 'a' })).toEqual([]);
  });
});
