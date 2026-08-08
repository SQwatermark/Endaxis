import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { CombatVitals } from './combatVitals';
import { CombatVitalsConditionExecutor } from './combatVitalsConditionExecutor';

describe('CombatVitalsConditionExecutor', () => {
  it('compares current health and health ratio against action values', () => {
    const vitals = new CombatVitals({
      health: 400,
      maxHealth: 1000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const executor = new CombatVitalsConditionExecutor({
      resolveTarget: () => vitals,
      delegate: { execute: vi.fn(() => false), evaluate: vi.fn(() => false) },
    });
    const context = { blackboard: new ActionBlackboard({ threshold: 0.5 }) };

    expect(
      executor.evaluate(
        {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'ratio',
          operator: 'less',
          value: { kind: 'blackboard', key: 'threshold' },
        },
        context,
      ),
    ).toBe(true);
    expect(
      executor.evaluate(
        {
          kind: 'healthCompare',
          target: 'enemy',
          valueType: 'current',
          operator: 'greater',
          value: { kind: 'constant', value: 500 },
        },
        context,
      ),
    ).toBe(false);
  });
});
