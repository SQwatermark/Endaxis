import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { RuntimeTargetContext } from './runtimeTargetContext';
import { TargetContextOperationExecutor } from './targetContextOperationExecutor';

const terminal = {
  execute: () => false,
  evaluate: () => false,
};

describe('TargetContextOperationExecutor', () => {
  it('initializes, merges and deduplicates event targets by stable identity', () => {
    const executor = new TargetContextOperationExecutor('operator', terminal);
    const targetContext = new RuntimeTargetContext();
    const context = {
      blackboard: new ActionBlackboard(),
      targetContext,
      event: {
        kind: 'abilitySpellInfliction' as const,
        event: 'beforeTakeInfliction' as const,
        sourceId: 'operator',
        targetId: 'enemy',
        element: 'nature' as const,
      },
    };

    executor.execute(
      { kind: 'mergeContextTargets', parameters: { saveToContextKey: 'seen', sources: [] } },
      context,
    );
    expect(
      executor.evaluate(
        { kind: 'contextTargetContains', parentContextKey: 'seen', child: 'eventTarget' },
        context,
      ),
    ).toBe(false);

    const merge = {
      kind: 'mergeContextTargets' as const,
      parameters: {
        saveToContextKey: 'seen',
        sources: [
          { kind: 'target' as const, target: 'eventTarget' as const },
          { kind: 'context' as const, contextKey: 'seen' },
        ],
      },
    };
    executor.execute(merge, context);
    executor.execute(merge, context);
    expect(targetContext.get('seen')).toEqual([{ kind: 'enemy' }]);
    expect(
      executor.evaluate(
        { kind: 'contextTargetContains', parentContextKey: 'seen', child: 'eventTarget' },
        context,
      ),
    ).toBe(true);
  });
});
