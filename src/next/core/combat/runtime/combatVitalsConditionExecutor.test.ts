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

  it('resolves a dynamic Buff source from the operation context', () => {
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
    const resolveTarget = vi.fn(() => vitals);
    const executor = new CombatVitalsConditionExecutor({
      resolveTarget,
      delegate: { execute: vi.fn(() => false), evaluate: vi.fn(() => false) },
    });

    expect(
      executor.evaluate(
        {
          kind: 'healthCompare',
          target: 'buffSource',
          valueType: 'ratio',
          operator: 'less',
          value: { kind: 'constant', value: 0.5 },
        },
        { blackboard: new ActionBlackboard(), buffSourceId: 'operator:source' },
      ),
    ).toBe(true);
    expect(resolveTarget).toHaveBeenCalledWith('buffSource', 'operator:source');
  });

  it('compares current poise and preserves the native missing-poise fallback', () => {
    const withPoise = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 100,
      poise: 0,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const withoutPoise = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    let current = withPoise;
    const executor = new CombatVitalsConditionExecutor({
      resolveTarget: () => current,
      delegate: { execute: vi.fn(() => false), evaluate: vi.fn(() => false) },
    });
    const condition = {
      kind: 'poiseCompare' as const,
      target: 'enemy' as const,
      returnValueIfMissing: false,
      operator: 'equal' as const,
      value: { kind: 'constant' as const, value: 0 },
    };

    expect(executor.evaluate(condition, { blackboard: new ActionBlackboard() })).toBe(true);
    current = withoutPoise;
    expect(executor.evaluate(condition, { blackboard: new ActionBlackboard() })).toBe(false);
    expect(
      executor.evaluate(
        { ...condition, returnValueIfMissing: true },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
  });
});
