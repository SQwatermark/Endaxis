import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatClock } from './combatClock';
import type { CombatOperationExecutor } from './skillRuntime';
import { TimedMarkerOperationExecutor } from './timedMarkerOperationExecutor';
import { TimedMarkerContainer } from './timedMarkers';

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
    const step: Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }> = {
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
});
