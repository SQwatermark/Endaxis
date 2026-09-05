import { describe, expect, it } from 'vitest';
import type { ResolvedActionSequence } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { ProjectileFinishCallbackRuntime } from './projectileFinishCallbackRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

const probe = {
  kind: 'setContextFlag',
  parameters: { flag: 'probe', value: true, target: 'caster' },
} as const;

function delayedProbe(): ResolvedActionSequence {
  return {
    steps: [
      {
        kind: 'scheduleProjectileFinishCallback',
        parameters: { delaySeconds: 3 },
        body: {
          steps: [
            {
              kind: 'withActionBlackboardScope',
              parameters: {
                scopeKey: 'projectile',
                lifetime: 'execution',
                initialValues: { local: 2 },
                inheritParent: true,
                entityInitialValues: { EntityBB_seed: 4 },
                entityAssignments: {
                  EntityBB_snapshot: { kind: 'blackboard', key: 'launchValue' },
                },
              },
              body: { steps: [probe] },
            },
          ],
        },
      },
    ],
  };
}

describe('ProjectileFinishCallbackRuntime', () => {
  it('registers only when the containing branch executes and survives its parent sequence end', () => {
    const scheduler = new ProjectileFinishCallbackRuntime();
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
      scheduleProjectileFinishCallback: (delaySeconds, execute) =>
        scheduler.schedule({
          delaySeconds,
          resolveDeltaSeconds: () => COMBAT_FRAME_INTERVAL,
          execute,
        }),
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
    expect(scheduler.pendingCount).toBe(0);

    passed = true;
    const parent = runtime.createSequence(branched);
    parent.executeInstant({});
    parent.end({});
    expect(scheduler.pendingCount).toBe(1);
    scheduler.advanceFrame();
    expect(executions).toBe(0);
    for (let frame = 1; frame < 90; frame += 1) scheduler.advanceFrame();
    expect(executions).toBe(1);
    expect(scheduler.pendingCount).toBe(0);
  });

  it('freezes launch direct values and creates the projectile entity scope at callback time', () => {
    const scheduler = new ProjectileFinishCallbackRuntime();
    const observed: number[][] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        observed.push([
          context!.blackboard.getNumber('launchValue')!,
          context!.blackboard.getNumber('local')!,
          context!.blackboard.getNumber('EntityBB_seed')!,
          context!.blackboard.getNumber('EntityBB_snapshot')!,
        ]);
        return true;
      },
      evaluate: () => true,
    };
    const blackboard = new ActionBlackboard({ launchValue: 7 });
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard,
      scheduleProjectileFinishCallback: (delaySeconds, execute) =>
        scheduler.schedule({
          delaySeconds,
          resolveDeltaSeconds: () => COMBAT_FRAME_INTERVAL,
          execute,
        }),
    });

    runtime.createSequence(delayedProbe()).executeInstant({});
    blackboard.assignDynamic('launchValue', 99);
    for (let frame = 0; frame < 90; frame += 1) scheduler.advanceFrame();
    expect(observed).toEqual([[7, 2, 4, 7]]);
  });
});
