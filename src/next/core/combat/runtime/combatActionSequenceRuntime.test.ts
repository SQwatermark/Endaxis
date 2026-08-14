import { describe, expect, it, vi } from 'vitest';
import type { ResolvedActionSequence, ResolvedCombatStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

function operation(flag: string): ResolvedCombatStep {
  return {
    kind: 'setContextFlag',
    parameters: { flag, value: true, target: 'caster' },
  };
}

function sequence(...steps: ResolvedCombatStep[]): ResolvedActionSequence {
  return { steps };
}

function createFixture(conditionResult = true) {
  const executed: string[] = [];
  const operations: CombatOperationExecutor = {
    execute: vi.fn(step => {
      executed.push(step.parameters.flag as string);
      return true;
    }),
    evaluate: vi.fn(() => conditionResult),
  };
  const runtime = new CombatActionSequenceRuntime(operations, {
    blackboard: new ActionBlackboard(),
  });
  return { executed, operations, runtime };
}

describe('CombatActionSequenceRuntime', () => {
  it('严格按照声明顺序执行普通步骤', () => {
    const fixture = createFixture();

    fixture.runtime
      .createSequence(sequence(operation('first'), operation('second')))
      .executeInstant({});

    expect(fixture.executed).toEqual(['first', 'second']);
  });

  it('根据条件结果只执行对应分支', () => {
    const fixture = createFixture(false);
    const conditional: ResolvedCombatStep = {
      kind: 'conditional',
      parameters: {
        condition: { kind: 'contextFlagEquals', flag: 'enabled', value: true },
      },
      whenTrue: sequence(operation('true')),
      whenFalse: sequence(operation('false')),
    };

    fixture.runtime.createSequence(sequence(conditional)).executeInstant({});

    expect(fixture.executed).toEqual(['false']);
    expect(fixture.operations.evaluate).toHaveBeenCalledTimes(1);
  });

  it('在当前状态所有者内去重 once，并允许显式重置', () => {
    const fixture = createFixture();
    const once: ResolvedCombatStep = {
      kind: 'once',
      parameters: { scopeKey: 'shared-effect' },
      body: sequence(operation('once')),
    };
    const action = sequence(once);

    fixture.runtime.createSequence(action).executeInstant({});
    fixture.runtime.createSequence(action).executeInstant({});
    expect(fixture.executed).toEqual(['once']);

    fixture.runtime.reset();
    fixture.runtime.createSequence(action).executeInstant({});
    expect(fixture.executed).toEqual(['once', 'once']);
  });
});
