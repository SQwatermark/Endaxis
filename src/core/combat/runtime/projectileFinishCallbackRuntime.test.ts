import { describe, expect, it } from 'vitest';
import type { ResolvedActionSequence } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { ProjectileLifecycleRuntime } from './projectileLifecycleRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

const probe = {
  kind: 'setContextFlag',
  parameters: { flag: 'probe', value: true, target: 'caster' },
} as const;

function delayedProbe(): ResolvedActionSequence {
  return {
    steps: [
      {
        kind: 'withActionBlackboardScope',
        parameters: {
          scopeKey: 'projectile',
          lifetime: 'execution',
          initialValues: {},
          inheritParent: true,
          entityInitialValues: { EntityBB_seed: 4 },
          entityAssignments: {
            EntityBB_snapshot: { kind: 'blackboard', key: 'launchValue' },
            EntityBB_sourceSnapshot: { kind: 'blackboard', key: 'EntityBB_source', fallback: 0 },
          },
        },
        body: {
          steps: [
            {
              kind: 'scheduleProjectileFinishCallback',
              parameters: { delaySeconds: 3, recycleDelaySeconds: 0 },
              body: {
                steps: [
                  {
                    kind: 'withActionBlackboardScope',
                    parameters: {
                      scopeKey: 'callback',
                      lifetime: 'execution',
                      initialValues: { local: 2 },
                      inheritParent: true,
                    },
                    body: { steps: [probe] },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  };
}

describe('projectile callback action lifecycle', () => {
  it('keeps projectile reset separate from the existing instant callback action lifetime', () => {
    const scheduler = new ProjectileLifecycleRuntime();
    const trace: string[] = [];
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: () => {
          trace.push('callback');
          return true;
        },
        end: () => trace.push('end-callback'),
        evaluate: () => true,
      },
      {
        blackboard: new ActionBlackboard(),
        scheduleProjectileFinishCallback: (
          delaySeconds,
          recycleDelaySeconds,
          execute,
          beforeReset,
        ) => {
          const instance = scheduler.launch({
            finishDelaySeconds: delaySeconds,
            recycleDelaySeconds,
            resolveTickDeltaSeconds: () => 1,
            finish: execute,
            beforeReset,
          });
          instance.onReset(() => trace.push('reset'));
        },
      },
    );
    const parent = runtime.createSequence({
      steps: [
        {
          kind: 'scheduleProjectileFinishCallback',
          parameters: { delaySeconds: 1, recycleDelaySeconds: 1 },
          body: { steps: [probe] },
        },
      ],
    });
    parent.executeInstant({});
    parent.end({});
    expect(trace).toEqual([]);
    scheduler.advanceFrame();
    expect(trace).toEqual(['callback', 'end-callback']);
    parent.end({});
    scheduler.advanceFrame();
    expect(trace).toEqual(['callback', 'end-callback']);
    scheduler.advanceFrame();
    expect(trace).toEqual(['callback', 'end-callback', 'reset']);
    scheduler.advanceFrame();
    expect(trace).toHaveLength(3);
  });

  it('registers only when the containing branch executes and survives its parent sequence end', () => {
    const scheduler = new ProjectileLifecycleRuntime();
    let passed = false;
    let executions = 0;
    const operations: CombatOperationExecutor = {
      execute: () => {
        executions += 1;
        return true;
      },
      evaluate: () => passed,
    };
    const blackboard = new ActionBlackboard({ launchValue: 7 });
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard,
      scheduleProjectileFinishCallback: (
        delaySeconds,
        recycleDelaySeconds,
        execute,
        beforeReset,
      ) => {
        scheduler.launch({
          finishDelaySeconds: delaySeconds,
          recycleDelaySeconds,
          resolveTickDeltaSeconds: () => COMBAT_FRAME_INTERVAL,
          finish: execute,
          beforeReset,
        });
      },
    });
    const branched: ResolvedActionSequence = {
      steps: [
        {
          kind: 'conditional',
          parameters: {
            condition: { kind: 'probability', probability: { kind: 'constant', value: 1 } },
          },
          whenTrue: delayedProbe(),
        },
      ],
    };

    runtime.createSequence(branched).executeInstant({});
    expect(scheduler.activeCount).toBe(0);

    passed = true;
    const parent = runtime.createSequence(branched);
    parent.executeInstant({});
    parent.end({});
    expect(scheduler.activeCount).toBe(1);
    scheduler.advanceFrame();
    expect(executions).toBe(0);
    for (let frame = 1; frame < 91; frame += 1) scheduler.advanceFrame();
    expect(executions).toBe(1);
    expect(scheduler.activeCount).toBe(1);
    scheduler.advanceFrame();
    scheduler.advanceFrame();
    expect(scheduler.activeCount).toBe(0);
  });

  it('samples direct and entity assignment inputs at launch and isolates repeated projectiles', () => {
    const scheduler = new ProjectileLifecycleRuntime();
    let sourceEnabled = true;
    const observed: number[][] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        observed.push([
          context!.blackboard.getNumber('launchValue')!,
          context!.blackboard.getNumber('local')!,
          context!.blackboard.getNumber('EntityBB_seed')!,
          context!.blackboard.getNumber('EntityBB_snapshot')!,
          context!.blackboard.getNumber('EntityBB_sourceSnapshot')!,
        ]);
        context!.blackboard.assignDynamic('EntityBB_seed', 500);
        return true;
      },
      evaluate: () => true,
    };
    const entityBlackboard = new ActionBlackboard({ EntityBB_source: 11 });
    const blackboard = new ActionBlackboard({ launchValue: 7 }, entityBlackboard);
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard,
      canExecuteAction: () => sourceEnabled,
      scheduleProjectileFinishCallback: (
        delaySeconds,
        recycleDelaySeconds,
        execute,
        beforeReset,
      ) => {
        scheduler.launch({
          finishDelaySeconds: delaySeconds,
          recycleDelaySeconds,
          resolveTickDeltaSeconds: () => COMBAT_FRAME_INTERVAL,
          finish: execute,
          beforeReset,
        });
      },
    });

    runtime.createSequence(delayedProbe()).executeInstant({});
    blackboard.assignDynamic('launchValue', 99);
    blackboard.assignDynamic('EntityBB_source', 22);
    runtime.createSequence(delayedProbe()).executeInstant({});
    blackboard.assignDynamic('launchValue', 100);
    blackboard.assignDynamic('EntityBB_source', 33);
    // 回调动作宿主是投射物，不继承发射动作宿主的启用状态。
    sourceEnabled = false;
    for (let frame = 0; frame < 91; frame += 1) scheduler.advanceFrame();
    expect(observed).toEqual([
      [7, 2, 4, 7, 11],
      [99, 2, 4, 99, 22],
    ]);
    expect(entityBlackboard.getNumber('EntityBB_seed')).toBeUndefined();
    expect(entityBlackboard.getNumber('EntityBB_source')).toBe(33);
  });
});
