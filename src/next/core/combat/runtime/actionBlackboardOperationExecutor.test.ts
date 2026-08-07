import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

const delegate: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

function context(values: Record<string, number>): CombatOperationContext {
  return { blackboard: new ActionBlackboard(values) };
}

describe('ActionBlackboardOperationExecutor', () => {
  it('evaluates resolved operands in declared sequence order', () => {
    const executor = new ActionBlackboardOperationExecutor(delegate);
    const operationContext = context({ conductCnt: 2, attackPerConduct: 0.09, attack: 0.45 });
    const steps: Exclude<ResolvedCombatStep, { kind: 'conditional' }>[] = [
      {
        kind: 'calculateBlackboard',
        parameters: {
          outputKey: 'attackBonus',
          operation: 'multiply',
          left: { blackboardKey: 'conductCnt' },
          right: { blackboardKey: 'attackPerConduct' },
        },
      },
      {
        kind: 'modifyBlackboard',
        parameters: {
          key: 'attack',
          operation: 'add',
          value: { blackboardKey: 'attackBonus' },
        },
      },
    ];

    for (const step of steps) executor.execute(step, operationContext);

    expect(operationContext.blackboard.getNumber('attackBonus')).toBeCloseTo(0.18);
    expect(operationContext.blackboard.getNumber('attack')).toBeCloseTo(0.63);
  });

  it('supports assign and divide but rejects missing numeric inputs', () => {
    const executor = new ActionBlackboardOperationExecutor(delegate);
    const operationContext = context({ count: 4 });

    executor.execute(
      {
        kind: 'calculateBlackboard',
        parameters: {
          outputKey: 'interval',
          operation: 'divide',
          left: { blackboardKey: 'count' },
          right: { value: 2 },
        },
      },
      operationContext,
    );
    executor.execute(
      {
        kind: 'modifyBlackboard',
        parameters: { key: 'result', operation: 'assign', value: { blackboardKey: 'interval' } },
      },
      operationContext,
    );

    expect(operationContext.blackboard.getNumber('result')).toBe(2);
    expect(() =>
      executor.execute(
        {
          kind: 'modifyBlackboard',
          parameters: { key: 'missing', operation: 'add', value: { value: 1 } },
        },
        operationContext,
      ),
    ).toThrow("action blackboard key 'missing' is not numeric");
  });
});
