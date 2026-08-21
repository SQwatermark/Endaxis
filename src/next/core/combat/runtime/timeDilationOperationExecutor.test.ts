import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { logicalAbilityEntityRuntimeId } from '../../game-data/logicalAbilityEntity';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import { TimeDilationOperationExecutor } from './timeDilationOperationExecutor';
import { TimeDilationRuntime } from './timeDilationRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';

const PRIORITY = 20;
const delegate: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

function runtime() {
  return new TimeDilationRuntime({
    curves: new Map([['constant-half', () => 0.5]]),
  });
}

describe('TimeDilationOperationExecutor', () => {
  it('starts a named global curve and lets the caster ignore it', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
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

  it('resolves the controlled operator when the global action executes', () => {
    const timeDilation = runtime();
    const resolvedTargets: string[] = [];
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => {
        resolvedTargets.push(target);
        return target === 'controlled' ? ['active-operator'] : [target];
      },
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const step: Extract<ResolvedCombatStep, { kind: 'startTimeDilation' }> = {
      kind: 'startTimeDilation',
      parameters: {
        scope: 'global',
        durationSeconds: { kind: 'constant', value: 1 },
        slot: 1,
        priority: PRIORITY,
        curve: { kind: 'named', key: 'constant-half' },
        finishByAction: false,
        ignoredTargets: ['controlled'],
      },
    };

    executor.execute(step, { blackboard: new ActionBlackboard() });

    expect(resolvedTargets).toEqual(['controlled']);
    expect(timeDilation.getOperatorScale('active-operator')).toBe(1);
    expect(timeDilation.getOperatorScale('operator')).toBe(0.5);
  });

  it('creates one entity instance per target and stops action-scoped instances', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
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
    expect(timeDilation.entityInstances.map(instance => instance.entityId)).toEqual([
      'operator',
      'enemy',
    ]);
    executor.end(step, context);
    expect(timeDilation.entityInstances).toEqual([]);
  });

  it('resolves logical AbilityEntity queries for global exclusions and entity effects', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
      resolveAbilityEntityTargetIds: query => {
        expect(query).toEqual({ kind: 'ownerSpawned' });
        return ['ability-entity:1'];
      },
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const context = { blackboard: new ActionBlackboard() };
    executor.execute(
      {
        kind: 'startTimeDilation',
        parameters: {
          scope: 'global',
          durationSeconds: { kind: 'constant', value: 1 },
          slot: 1,
          priority: PRIORITY,
          curve: { kind: 'named', key: 'constant-half' },
          finishByAction: false,
          ignoredTargets: [],
          ignoredAbilityEntityTargets: [{ kind: 'ownerSpawned' }],
        },
      },
      context,
    );
    executor.execute(
      {
        kind: 'startTimeDilation',
        parameters: {
          scope: 'entity',
          durationSeconds: { kind: 'constant', value: 1 },
          slot: 2,
          priority: PRIORITY,
          curve: { kind: 'named', key: 'constant-half' },
          finishByAction: false,
          targets: [],
          abilityEntityTargets: [{ kind: 'ownerSpawned' }],
        },
      },
      context,
    );

    expect(timeDilation.currentGlobalScale).toBe(0.5);
    expect(timeDilation.getEntityScale('ability-entity:1')).toBe(0.5);
    expect(timeDilation.entityInstances.map(instance => instance.entityId)).toEqual([
      'ability-entity:1',
    ]);
  });

  it('resolves ability entities already stored in the current target Context', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
      resolveContextAbilityEntityId: instanceId => logicalAbilityEntityRuntimeId(instanceId),
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });
    const targetContext = new RuntimeTargetContext();
    targetContext.setSingle('mirror', { kind: 'abilityEntity', instanceId: 7 });

    executor.execute(
      {
        kind: 'startUltimateTimeDilation',
        parameters: {
          priority: PRIORITY,
          targetScale: { kind: 'constant', value: 0 },
          ignoredTargets: [],
          ignoredAbilityEntityTargets: [{ kind: 'context', contextKey: 'mirror' }],
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );

    expect(timeDilation.getEntityScale('ability-entity:7')).toBe(1);
    expect(timeDilation.getEntityScale('enemy')).toBe(0);
  });

  it('treats an absent optional ignored AbilityEntity Context as an empty set', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
      resolveContextAbilityEntityId: instanceId => logicalAbilityEntityRuntimeId(instanceId),
      sourceId: 'operator',
      sourceActionId: 'skill',
      delegate,
    });

    expect(() =>
      executor.execute(
        {
          kind: 'startUltimateTimeDilation',
          parameters: {
            priority: PRIORITY,
            targetScale: { kind: 'constant', value: 0 },
            ignoredTargets: [],
            ignoredAbilityEntityTargets: [{ kind: 'context', contextKey: 'optional-model' }],
          },
        },
        { blackboard: new ActionBlackboard(), targetContext: new RuntimeTargetContext() },
      ),
    ).not.toThrow();
    expect(timeDilation.getEntityScale('enemy')).toBe(0);
  });

  it('keeps the ultimate caster running and stops the constant scale with the action', () => {
    const timeDilation = runtime();
    const executor = new TimeDilationOperationExecutor({
      runtime: timeDilation,
      resolveTargetIds: target => [target === 'caster' ? 'operator' : 'enemy'],
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
