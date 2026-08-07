import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';

const delegate = {
  execute: vi.fn(() => false),
  evaluate: vi.fn(() => false),
};

describe('ActionBlackboardOperationExecutor', () => {
  it.each([
    ['assign', 9, 3, 3],
    ['add', 9, 3, 12],
    ['multiply', 9, 3, 27],
    ['divide', 9, 3, 3],
    ['divide', 9, 0.00001, 0],
    ['floor', 9, 2.999999, 3],
    ['ceil', 9, 3.000001, 3],
    ['roundToInt', 9, 2.5, 2],
    ['roundToInt', 9, 3.5, 4],
  ] as const)(
    'executes native %s action blackboard semantics',
    (operation, old, value, expected) => {
      const blackboard = new ActionBlackboard({ result: old });
      const executor = new ActionBlackboardOperationExecutor({
        execute: () => false,
        evaluate: () => false,
      });

      expect(
        executor.execute(
          {
            kind: 'modifyActionValue',
            parameters: { key: 'result', operation, value: { kind: 'constant', value } },
          },
          { blackboard },
        ),
      ).toBe(true);
      expect(blackboard.getNumber('result')).toBe(expected);
    },
  );

  it('uses zero when the mutation target key is absent', () => {
    const blackboard = new ActionBlackboard();
    const executor = new ActionBlackboardOperationExecutor({
      execute: () => false,
      evaluate: () => false,
    });

    executor.execute(
      {
        kind: 'modifyActionValue',
        parameters: {
          key: 'result',
          operation: 'add',
          value: { kind: 'constant', value: 2 },
        },
      },
      { blackboard },
    );

    expect(blackboard.getNumber('result')).toBe(2);
  });
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
