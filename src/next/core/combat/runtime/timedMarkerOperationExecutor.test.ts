import { describe, expect, it } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatClock } from './combatClock';
import type { CombatOperationExecutor } from './skillRuntime';
import { TimedMarkerOperationExecutor } from './timedMarkerOperationExecutor';
import { TimedMarkerContainer } from './timedMarkers';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';

const delegate: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

describe('TimedMarkerOperationExecutor', () => {
  it('creates, queries, and removes action-scoped markers', () => {
    const clock = new CombatClock();
    const caster = new TimedMarkerContainer('operator', clock);
    const enemy = new TimedMarkerContainer('enemy', clock);
    const executor = new TimedMarkerOperationExecutor({
      resolveTarget: target => (target === 'caster' ? caster : enemy),
      delegate,
    });
    const step: ResolvedCombatOperationStep = {
      kind: 'createTimedMarker',
      parameters: {
        target: 'caster',
        markerId: 'voice',
        durationSeconds: { kind: 'blackboard', key: 'duration' },
        autoFinishByAction: true,
      },
    };
    const context = { blackboard: new ActionBlackboard({ duration: 5 }) };

    expect(executor.execute(step, context)).toBe(true);
    expect(executor.execute(step, context)).toBe(true);
    expect(
      executor.evaluate({ kind: 'timedMarkerPresent', target: 'caster', markerId: 'voice' }),
    ).toBe(true);
    executor.end(step, context);
    expect(
      executor.evaluate({ kind: 'timedMarkerPresent', target: 'caster', markerId: 'voice' }),
    ).toBe(false);
  });

  it('uses the current ability entity local clock for time-dilated markers', () => {
    const entities = new LogicalAbilityEntityRuntime({ resolveDeltaSeconds: () => 1 / 60 });
    const target = entities.spawn({
      abilityEntityId: 'seal',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'operator',
      source: { kind: 'operator', operatorId: 'operator' },
    });
    const executor = new TimedMarkerOperationExecutor({
      resolveTarget: () => new TimedMarkerContainer('unused', new CombatClock()),
      resolveAbilityEntityTarget: current => entities.timedMarkers(current),
      delegate,
    });
    const context = { blackboard: new ActionBlackboard(), currentTarget: target };
    const step: ResolvedCombatOperationStep = {
      kind: 'createAbilityEntityTimedMarker',
      parameters: {
        markerId: 'end',
        durationSeconds: { kind: 'constant', value: 1 },
        autoFinishByAction: false,
      },
    };

    expect(executor.execute(step, context)).toBe(true);
    for (let frame = 0; frame < 30; frame += 1) entities.advanceFrame();
    expect(
      executor.evaluate({ kind: 'abilityEntityTimedMarkerPresent', markerId: 'end' }, context),
    ).toBe(true);
    for (let frame = 0; frame < 31; frame += 1) entities.advanceFrame();
    expect(
      executor.evaluate({ kind: 'abilityEntityTimedMarkerPresent', markerId: 'end' }, context),
    ).toBe(false);
  });
});
