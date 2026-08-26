import { describe, expect, it, vi } from 'vitest';
import type { ResolvedActionSequence, ResolvedCombatStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationExecutor } from './skillRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';

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
  it('逐项失败只跳过本项后继；保留目标快照与共享黑板，循环后继续', () => {
    const targetContext = new RuntimeTargetContext();
    targetContext.set('items', [
      { kind: 'abilityEntity', instanceId: 1 },
      { kind: 'abilityEntity', instanceId: 2 },
    ]);
    const blackboard = new ActionBlackboard({ count: 0 });
    const seen: unknown[] = [];
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: (step, context) => {
          if (step.kind !== 'setContextFlag') throw new Error('unexpected test operation');
          seen.push([step.parameters.flag, context?.currentTarget]);
          expect(context?.blackboard).toBe(blackboard);
          return true;
        },
        evaluate: (_condition, context) => {
          targetContext.set('items', []);
          context!.blackboard.assignDynamic('count', context!.blackboard.getNumber('count')! + 1);
          return (
            context?.currentTarget?.kind === 'abilityEntity' &&
            context.currentTarget.instanceId === 2
          );
        },
      },
      { blackboard, targetContext },
    );
    expect(
      runtime
        .createSequence(
          sequence(
            {
              kind: 'forEachContextTarget',
              parameters: { contextKey: 'items' },
              body: sequence({
                kind: 'conditional',
                parameters: { condition: { kind: 'combatActive' } },
                whenTrue: sequence(operation('accepted')),
              }),
            },
            operation('after'),
          ),
        )
        .executeInstant({}),
    ).toBe(true);
    expect(seen).toEqual([
      ['accepted', { kind: 'abilityEntity', instanceId: 2 }],
      ['after', undefined],
    ]);
    expect(blackboard.getNumber('count')).toBe(2);
  });

  it('逐目标循环空集合成功，但未知异常不得被当成条件失败吞掉', () => {
    const targetContext = new RuntimeTargetContext();
    targetContext.set('items', []);
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: () => {
          throw new Error('invalid data');
        },
        evaluate: () => false,
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );
    const definition = sequence({
      kind: 'forEachContextTarget',
      parameters: { contextKey: 'items' },
      body: sequence(operation('bad')),
    });
    expect(runtime.createSequence(definition).executeInstant({})).toBe(true);
    targetContext.set('items', [{ kind: 'abilityEntity', instanceId: 1 }]);
    expect(() => runtime.createSequence(definition).executeInstant({})).toThrow('invalid data');
  });

  it('同名子作用域只在同一父黑板内复用，不跨投射物宿主串板', () => {
    const fixture = createFixture();
    const step = {
      kind: 'withActionBlackboardScope',
      parameters: { scopeKey: 'callback', inheritParent: true, initialValues: {} },
      body: sequence(),
    } as const;
    const firstParent = new ActionBlackboard({ sourceValue: 2 });
    const secondParent = new ActionBlackboard({ sourceValue: 7 });
    const first = fixture.runtime.getActionBlackboardScope(step, firstParent);
    const second = fixture.runtime.getActionBlackboardScope(step, secondParent);
    expect(first).not.toBe(second);
    expect(first.getNumber('sourceValue')).toBe(2);
    expect(second.getNumber('sourceValue')).toBe(7);
    expect(fixture.runtime.getActionBlackboardScope(step, firstParent)).toBe(first);
  });

  it('逐目标循环在同一静态路径创建独立实体板，保留当前目标', () => {
    const targetContext = new RuntimeTargetContext();
    targetContext.set('lances', [
      { kind: 'abilityEntity', instanceId: 3 },
      { kind: 'abilityEntity', instanceId: 7 },
    ]);
    const observed: unknown[] = [];
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: (_step, context) => {
          observed.push([context!.currentTarget, context!.blackboard.getNumber('EntityBB_count')]);
          context!.blackboard.assignDynamic('EntityBB_count', 99);
          return true;
        },
        evaluate: () => true,
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );
    runtime
      .createSequence(
        sequence({
          kind: 'forEachContextTarget',
          parameters: { contextKey: 'lances' },
          body: sequence({
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'launch',
              lifetime: 'execution',
              initialValues: {},
              entityInitialValues: { EntityBB_count: 0 },
              inheritParent: true,
            },
            body: sequence({
              kind: 'withActionBlackboardScope',
              parameters: {
                scopeKey: 'callback',
                initialValues: {},
                inheritParent: true,
              },
              body: sequence(operation('visit')),
            }),
          }),
        }),
      )
      .executeInstant({});
    expect(observed).toEqual([
      [{ kind: 'abilityEntity', instanceId: 3 }, 0],
      [{ kind: 'abilityEntity', instanceId: 7 }, 0],
    ]);
  });

  it('兄弟回调共享宿主实体层，但各自 direct 修改不覆盖源快照或另一个回调', () => {
    const parent = new ActionBlackboard({ shared: 6 });
    const seen: unknown[] = [];
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: (step, context) => {
          if (step.kind !== 'setContextFlag') throw new Error('unexpected operation');
          const board = context!.blackboard;
          seen.push([
            step.parameters.flag,
            board.getNumber('shared'),
            board.getNumber('EntityBB_count'),
          ]);
          board.assign({ shared: 123 });
          board.assignDynamic('EntityBB_count', 8);
          return true;
        },
        evaluate: () => true,
      },
      { blackboard: parent },
    );
    const children = ['hit', 'reach'].map(key => ({
      kind: 'withActionBlackboardScope' as const,
      parameters: { scopeKey: key, initialValues: { shared: 0 }, inheritParent: true },
      body: sequence(operation(key)),
    }));
    const launch = sequence({
      kind: 'withActionBlackboardScope',
      parameters: {
        scopeKey: 'projectile',
        lifetime: 'execution',
        initialValues: {},
        inheritParent: true,
        entityInitialValues: { EntityBB_count: 0 },
      },
      body: sequence(...children),
    });
    const action = runtime.createSequence(launch);
    action.executeInstant({});
    parent.assign({ shared: 10 });
    action.executeInstant({});
    expect(seen).toEqual([
      ['hit', 6, 0],
      ['reach', 6, 8],
      ['hit', 10, 0],
      ['reach', 10, 8],
    ]);
    expect(parent.snapshot()).toEqual({ shared: 10 });
  });

  it.each([false, true])('回调边界 alwaysNext=%s 只影响局部短路，不跳过执行', alwaysNext => {
    const fixture = createFixture(false);
    fixture.runtime
      .createSequence(
        sequence(
          {
            kind: 'withActionBlackboardScope',
            parameters: {
              scopeKey: 'callback',
              initialValues: {},
              inheritParent: true,
              alwaysNext,
            },
            body: sequence({
              kind: 'conditional',
              parameters: { condition: { kind: 'combatActive' } },
              whenTrue: sequence(operation('blocked')),
            }),
          },
          operation('after'),
        ),
      )
      .executeInstant({});
    expect(fixture.operations.evaluate).toHaveBeenCalledTimes(1);
    expect(fixture.executed).toEqual(alwaysNext ? ['after'] : []);
  });

  it('execution 作用域在执行、tick 和 end 期间保持同一黑板', () => {
    const boards: ActionBlackboard[] = [];
    const runtime = new CombatActionSequenceRuntime(
      {
        execute: (_step, context) => {
          boards.push(context!.blackboard);
          return true;
        },
        end: (_step, context) => {
          boards.push(context!.blackboard);
        },
        evaluate: () => true,
      },
      { blackboard: new ActionBlackboard() },
    );
    const action = runtime.createSequence(
      sequence({
        kind: 'withActionBlackboardScope',
        parameters: {
          scopeKey: 'launch',
          lifetime: 'execution',
          initialValues: {},
          inheritParent: true,
        },
        body: sequence({
          kind: 'repeatEachTick',
          parameters: {},
          body: sequence(operation('tick')),
        }),
      }),
    );
    action.execute({});
    action.tick(0, {});
    action.tick(1, {});
    action.end({});
    expect(boards.length).toBe(4);
    expect(new Set(boards).size).toBe(1);
  });

  it('严格按照声明顺序执行普通步骤', () => {
    const fixture = createFixture();

    fixture.runtime
      .createSequence(sequence(operation('first'), operation('second')))
      .executeInstant({});

    expect(fixture.executed).toEqual(['first', 'second']);
  });

  it('在命中时创建并复用隔离的子 SkillData 动作黑板', () => {
    const parent = new ActionBlackboard({ inherited: 1, childOnly: 99 });
    const snapshots: Readonly<Record<string, unknown>>[] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        snapshots.push(context!.blackboard.snapshot());
        context!.blackboard.assignDynamic('childOnly', 3);
        return true;
      },
      evaluate: vi.fn(() => true),
    };
    const runtime = new CombatActionSequenceRuntime(operations, { blackboard: parent });
    const scoped: ResolvedCombatStep = {
      kind: 'withActionBlackboardScope',
      parameters: {
        scopeKey: 'projectile:child:1',
        initialValues: { inherited: 0, childOnly: 2 },
        inheritParent: true,
      },
      body: sequence(operation('child')),
    };
    const scheduled = sequence(scoped);
    parent.assignDynamic('inherited', 7);

    runtime.createSequence(scheduled).executeInstant({});
    runtime.createSequence(scheduled).executeInstant({});

    expect(snapshots).toEqual([
      { inherited: 7, childOnly: 99 },
      { inherited: 7, childOnly: 3 },
    ]);
    expect(parent.snapshot()).toEqual({ inherited: 7, childOnly: 99 });
  });

  it('在同一投射物作用域内复用模板实体黑板，并在运行时重置后重新初始化', () => {
    const observed: number[] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        const blackboard = context!.blackboard;
        observed.push(blackboard.getNumber('EntityBB_hitCount')!);
        blackboard.assignDynamic('EntityBB_hitCount', observed.at(-1)! + 1);
        return true;
      },
      evaluate: vi.fn(() => true),
    };
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard: new ActionBlackboard(),
    });
    const scoped: ResolvedCombatStep = {
      kind: 'withActionBlackboardScope',
      parameters: {
        scopeKey: 'projectile:instance:1',
        initialValues: {},
        entityInitialValues: { EntityBB_hitCount: 0 },
        inheritParent: true,
      },
      body: sequence(operation('hit')),
    };

    runtime.createSequence(sequence(scoped)).executeInstant({});
    runtime.createSequence(sequence(scoped)).executeInstant({});
    runtime.reset();
    runtime.createSequence(sequence(scoped)).executeInstant({});

    expect(observed).toEqual([0, 1, 0]);
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

  it('alwaysNext 条件失败时仍允许外层序列继续', () => {
    const fixture = createFixture(false);
    const conditional: ResolvedCombatStep = {
      kind: 'conditional',
      parameters: {
        condition: { kind: 'contextFlagEquals', flag: 'enabled', value: true },
        alwaysNext: true,
      },
      whenTrue: sequence(operation('true')),
    };

    const result = fixture.runtime
      .createSequence(sequence(conditional, operation('after')))
      .executeInstant({});

    expect(result).toBe(true);
    expect(fixture.executed).toEqual(['after']);
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

  it('在区间开始和之后每个 Tick 执行 repeatEachTick body，跳过调度器的起始同帧 Tick', () => {
    const fixture = createFixture();
    const action = fixture.runtime.createSequence(
      sequence({
        kind: 'repeatEachTick',
        parameters: {},
        body: sequence(operation('frame')),
      }),
    );

    action.execute({});
    action.tick(0, {});
    action.tick(1 / 30, {});
    action.tick(1 / 30, {});

    expect(fixture.executed).toEqual(['frame', 'frame', 'frame']);
  });

  it('对 Context 快照中的每个稳定目标同步执行 body', () => {
    const targetContext = new RuntimeTargetContext();
    targetContext.set('lances', [
      { kind: 'abilityEntity', instanceId: 3 },
      { kind: 'abilityEntity', instanceId: 7 },
    ]);
    const visited: number[] = [];
    const operations: CombatOperationExecutor = {
      execute: (_step, context) => {
        if (context?.currentTarget?.kind === 'abilityEntity') {
          visited.push(context.currentTarget.instanceId);
        }
        return true;
      },
      evaluate: () => false,
    };
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard: new ActionBlackboard(),
      targetContext,
    });

    runtime
      .createSequence(
        sequence({
          kind: 'forEachContextTarget',
          parameters: { contextKey: 'lances' },
          body: sequence(operation('visit')),
        }),
      )
      .executeInstant({});

    expect(visited).toEqual([3, 7]);
  });

  it('无条件时间轴跳转在首次执行时立即请求一次', () => {
    const requestTimelineJump = vi.fn();
    const fixture = createFixture();
    const runtime = new CombatActionSequenceRuntime(fixture.operations, {
      blackboard: new ActionBlackboard(),
      requestTimelineJump,
    });
    const action = runtime.createSequence(
      sequence({ kind: 'jumpTimeline', parameters: { destinationFrame: 150 } }),
    );

    action.execute({});
    action.tick(0, {});
    action.tick(1 / 30, {});

    expect(requestTimelineJump).toHaveBeenCalledTimes(1);
    expect(requestTimelineJump).toHaveBeenCalledWith(150);
  });

  it('条件时间轴跳转在后续 Tick 重试并只在首次通过时请求', () => {
    const requestTimelineJump = vi.fn();
    const conditionResults = [false, true];
    const operations: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => conditionResults.shift() ?? true),
    };
    const runtime = new CombatActionSequenceRuntime(operations, {
      blackboard: new ActionBlackboard(),
      requestTimelineJump,
    });
    const condition = { kind: 'combatActive' } as const;
    const action = runtime.createSequence(
      sequence({
        kind: 'jumpTimeline',
        parameters: { destinationFrame: 89, condition },
      }),
    );

    action.execute({});
    action.tick(0, {});
    expect(requestTimelineJump).not.toHaveBeenCalled();

    action.tick(1 / 30, {});
    action.tick(1 / 30, {});

    expect(operations.evaluate).toHaveBeenCalledTimes(2);
    expect(requestTimelineJump).toHaveBeenCalledTimes(1);
    expect(requestTimelineJump).toHaveBeenCalledWith(89);
  });
});
