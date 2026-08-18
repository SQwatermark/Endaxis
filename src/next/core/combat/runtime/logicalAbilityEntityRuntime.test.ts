import { describe, expect, it, vi } from 'vitest';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';

function createRuntime() {
  return new LogicalAbilityEntityRuntime({
    resolveDeltaSeconds: () => 0.25,
  });
}

describe('LogicalAbilityEntityRuntime', () => {
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
    expect(runtime.isActive(entity)).toBe(false);
    expect(runtime.activeCount).toBe(0);
  });
});
