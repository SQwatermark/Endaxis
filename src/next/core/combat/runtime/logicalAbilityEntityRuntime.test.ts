import { describe, expect, it, vi } from 'vitest';
import { gameplayTagId, GameplayTagRegistry } from '../tags/gameplayTags';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';

const water = gameplayTagId(100);
const sword = gameplayTagId(200);

function createRuntime() {
  return new LogicalAbilityEntityRuntime({
    templates: [
      {
        id: 'water',
        bornTagIds: [water],
        lifetime: { kind: 'limited', durationSeconds: 1 },
        maxStackingCount: -1,
      },
      {
        id: 'sword',
        bornTagIds: [sword],
        lifetime: { kind: 'infinite' },
        maxStackingCount: 1,
      },
    ],
    tagRegistry: new GameplayTagRegistry([]),
    resolveDeltaSeconds: () => 0.25,
  });
}

describe('LogicalAbilityEntityRuntime', () => {
  it('uses one instance set for zero-space range and owner/tag lookup', () => {
    const runtime = createRuntime();
    const a = runtime.spawn({
      templateId: 'water',
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      templateId: 'sword',
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      templateId: 'water',
      ownerId: 'b',
      source: { kind: 'operator', operatorId: 'b' },
    });

    expect(runtime.findAll()).toHaveLength(3);
    expect(
      runtime.findOwnerSpawned({
        ownerId: 'a',
        tagQuery: { type: 'hasAll', tagIds: [water] },
      }),
    ).toEqual([a]);
  });

  it('keeps per-instance duration, target and entity blackboard state', () => {
    const runtime = createRuntime();
    const entity = runtime.spawn({
      templateId: 'water',
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

  it('expires limited instances while infinite instances remain active', () => {
    const finished = vi.fn();
    const runtime = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'short',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 0.5 },
          maxStackingCount: -1,
        },
        {
          id: 'forever',
          bornTagIds: [],
          lifetime: { kind: 'infinite' },
          maxStackingCount: -1,
        },
      ],
      resolveDeltaSeconds: () => 0.25,
      hooks: { finished },
    });
    runtime.spawn({
      templateId: 'short',
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
    });
    runtime.spawn({
      templateId: 'forever',
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
      templates: [
        {
          id: 'child',
          bornTagIds: [],
          lifetime: { kind: 'infinite' },
          maxStackingCount: -1,
        },
      ],
      hooks: { childSkillRequested },
    });
    runtime.spawn({
      templateId: 'child',
      ownerId: 'a',
      source: { kind: 'operator', operatorId: 'a' },
      childSkillId: 'child_skill',
      dieWhenSourceDies: true,
    });

    expect(childSkillRequested).toHaveBeenCalledTimes(1);
    expect(runtime.notifySourceDied({ kind: 'operator', operatorId: 'a' })).toBe(1);
    expect(runtime.activeCount).toBe(0);
  });
});
