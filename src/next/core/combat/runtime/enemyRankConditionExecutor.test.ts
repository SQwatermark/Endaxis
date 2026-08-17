import { describe, expect, it, vi } from 'vitest';
import type { CombatOperationExecutor } from './skillRuntime';
import { EnemyRankConditionExecutor } from './enemyRankConditionExecutor';

describe('EnemyRankConditionExecutor', () => {
  it('matches only the captured native enemy rank', () => {
    const delegate: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => false),
    };
    const executor = new EnemyRankConditionExecutor('elite', delegate);

    expect(executor.evaluate({ kind: 'enemyRankIn', ranks: ['elite', 'boss'] })).toBe(true);
    expect(executor.evaluate({ kind: 'enemyRankIn', ranks: ['mob'] })).toBe(false);
    expect(delegate.evaluate).not.toHaveBeenCalled();
  });

  it('delegates unrelated conditions', () => {
    const delegate: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => true),
    };
    const executor = new EnemyRankConditionExecutor('boss', delegate);
    const condition = { kind: 'combatActive' } as const;

    expect(executor.evaluate(condition)).toBe(true);
    expect(delegate.evaluate).toHaveBeenCalledWith(condition);
  });
});
