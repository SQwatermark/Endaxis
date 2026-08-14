import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { TimeDilationOperationExecutor } from './timeDilationOperationExecutor';
import { TimeDilationRuntime } from './timeDilationRuntime';

const PRIORITY = 20;
const delegate: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

function runtime() {
  return new TimeDilationRuntime({
    priorities: new Map([[PRIORITY, 10]]),
    curves: new Map([['constant-half', () => 0.5]]),
  });
}

describe('TimeDilationOperationExecutor', () => {
  it('starts a named global curve and lets the caster ignore it', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetId: target => (target === 'caster' ? 'operator' : 'enemy'),
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const step: Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }> = {
      kind: 'startTimeDilation',
      parameters: {
        scope: 'global',
        durationSeconds: { kind: 'blackboard', key: 'duration' },
        slot: 1,
        priority: PRIORITY,
        curve: { kind: 'named', key: 'constant-half' },
        finishByAction: false,
        ignoredTargets: ['caster'],
      },
    };

    expect(executor.execute(step, { blackboard: new ActionBlackboard({ duration: 2 }) })).toBe(
      true,
    );
    expect(timeDilation.currentGlobalScale).toBe(0.5);
    expect(timeDilation.getOperatorScale('operator')).toBe(1);
    expect(timeDilation.getOperatorScale('enemy')).toBe(0.5);
  });

  it('creates one entity instance per target and stops action-scoped instances', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetId: target => (target === 'caster' ? 'operator' : 'enemy'),
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const step: Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }> = {
      kind: 'startTimeDilation',
      parameters: {
        scope: 'entity',
        durationSeconds: { kind: 'constant', value: 1 },
        slot: 2,
        priority: PRIORITY,
        curve: {
          kind: 'inline',
          keys: [
            {
              time: 0,
              value: 0.25,
              inTangent: 0,
              outTangent: 0,
              weightedMode: 0,
              inWeight: 0,
              outWeight: 0,
            },
          ],
        },
        finishByAction: true,
        targets: ['caster', 'enemy'],
      },
    };
    const context = { blackboard: new ActionBlackboard() };

    executor.execute(step, context);
    expect(timeDilation.entityInstances.map(instance => instance.operatorId)).toEqual([
      'operator',
      'enemy',
    ]);
    executor.end(step, context);
    expect(timeDilation.entityInstances).toEqual([]);
  });

  it('keeps the ultimate caster running and stops the constant scale with the action', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetId: target => (target === 'caster' ? 'operator' : 'enemy'),
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const step: Extract<ResolvedCombatStep, { kind: 'startUltimateTimeDilation' }> = {
      kind: 'startUltimateTimeDilation',
      parameters: {
        priority: PRIORITY,
        targetScale: { kind: 'constant', value: 0 },
        ignoredTargets: [],
      },
    };
    const context = { blackboard: new ActionBlackboard() };

    executor.execute(step, context);
    expect(timeDilation.currentGlobalScale).toBe(0);
    expect(timeDilation.getOperatorScale('operator')).toBe(1);
    expect(timeDilation.getOperatorScale('enemy')).toBe(0);
    executor.end(step, context);
    expect(timeDilation.currentGlobalScale).toBe(1);
  });
});
