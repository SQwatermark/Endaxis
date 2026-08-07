import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';

const delegate = {
  execute: vi.fn(() => false),
  evaluate: vi.fn(() => false),
};

describe('ActionBlackboardOperationExecutor', () => {
  it('compares dynamic action values with native float tolerance', () => {
    const executor = new ActionBlackboardOperationExecutor(delegate);
    const context = { blackboard: new ActionBlackboard({ swordCount: 3 }) };

    expect(
      executor.evaluate(
        {
          kind: 'actionValueCompare',
          left: { kind: 'blackboard', key: 'swordCount' },
          operator: 'equal',
          right: { kind: 'constant', value: 3.000009 },
        },
        context,
      ),
    ).toBe(true);
  });

  it('rejects a missing action value instead of silently choosing a branch', () => {
    const executor = new ActionBlackboardOperationExecutor(delegate);

    expect(() =>
      executor.evaluate(
        {
          kind: 'actionValueCompare',
          left: { kind: 'blackboard', key: 'missing' },
          operator: 'greater',
          right: { kind: 'constant', value: 0 },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toThrow("action blackboard value 'missing' is missing");
  });

  it('recursively evaluates composite conditions through the executor chain', () => {
    const evaluate = vi.fn(condition => condition.kind === 'buffStackCompare');
    const executor = new ActionBlackboardOperationExecutor({
      execute: () => false,
      evaluate,
    });

    expect(
      executor.evaluate(
        {
          kind: 'all',
          conditions: [
            {
              kind: 'actionValueCompare',
              left: { kind: 'blackboard', key: 'swordCount' },
              operator: 'equal',
              right: { kind: 'constant', value: 3 },
            },
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              tagQueryType: 'hasAny',
              buffTagIds: [1],
              operator: 'greaterOrEqual',
              value: 1,
            },
          ],
        },
        { blackboard: new ActionBlackboard({ swordCount: 3 }) },
      ),
    ).toBe(true);
    expect(evaluate).toHaveBeenCalledOnce();
  });
});
