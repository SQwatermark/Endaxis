import { describe, expect, it } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';
import { ActionBlackboard } from './actionBlackboard';
import { BuffOperationExecutor } from './buffOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';

const delegate: CombatOperationExecutor = {
  execute: () => false,
  evaluate: () => false,
};

describe('BuffOperationExecutor', () => {
  it('resolves action-blackboard assignments before applying a catalog buff', () => {
    const applied: unknown[] = [];
    const target = {
      apply: (request: unknown) => {
        applied.push(request);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      getCountByTags: () => 0,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const blackboard = new ActionBlackboard({ rate: 4 });

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'ultimate-base',
            target: 'caster',
            blackboardAssignments: {
              duration: { kind: 'constant', value: 25 },
              comboRate: { kind: 'blackboard', key: 'rate' },
            },
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(applied).toEqual([
      {
        buffId: 'ultimate-base',
        sourceId: 'operator',
        blackboardValues: { duration: 25, comboRate: 4 },
      },
    ]);
  });

  it('keeps legacy applyBuff timing fields on the existing delegate path', () => {
    const calls: string[] = [];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => ({
        apply: () => {
          calls.push('catalog');
          return true;
        },
        getCountByIds: () => 0,
        finishByIds: () => 0,
        getCountByTags: () => 0,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
      }),
      delegate: {
        execute: () => {
          calls.push('delegate');
          return true;
        },
        evaluate: () => false,
      },
    });

    expect(
      executor.execute({
        kind: 'applyBuff',
        parameters: {
          buffId: 'legacy',
          target: 'enemy',
          durationSeconds: 10,
          effectiveness: 1,
        },
      }),
    ).toBe(true);
    expect(calls).toEqual(['delegate']);
  });

  it('compares matching buff enhance stacks with the native tolerance', () => {
    const path = 'buff/status/conduct';
    const target = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet(),
      new GameplayTagRegistry([path]),
    );
    const definition = {
      id: 'conduct',
      stackingType: 'enhance' as const,
      maxStackCount: 4,
      applyTags: [gameplayTagIdFromPath(path)],
    };
    target.add(definition, 'operator');
    target.add(definition, 'operator');
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const condition = {
      kind: 'buffStackCompare' as const,
      target: 'enemy' as const,
      tagQueryType: 'hasAny' as const,
      buffTagIds: [gameplayTagIdFromPath(path)],
      operator: 'greaterOrEqual' as const,
      value: 2.000009,
    };

    expect(executor.evaluate(condition)).toBe(true);
    expect(executor.evaluate({ ...condition, value: 2.000011 })).toBe(false);
  });

  it('reads the first matching active buff and writes its value to the action blackboard', () => {
    const path = 'buff/status/conduct';
    const target = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet(),
      new GameplayTagRegistry([path]),
    );
    target.add(
      {
        id: 'first',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(path)],
        blackboard: { count: 4 },
      },
      'operator',
    );
    target.add(
      {
        id: 'second',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(path)],
        blackboard: { count: 9 },
      },
      'operator',
    );
    const blackboard = new ActionBlackboard();
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'readBuffBlackboard',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [gameplayTagIdFromPath(path)],
            desiredKey: 'count',
            outputKey: 'conductCount',
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('conductCount')).toBe(4);
  });

  it('writes zero for a missing key but fails when no buff matches', () => {
    const matchedPath = 'buff/status/conduct';
    const missingPath = 'buff/status/missing';
    const target = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet(),
      new GameplayTagRegistry([matchedPath, missingPath]),
    );
    target.add(
      {
        id: 'matched',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(matchedPath)],
      },
      'operator',
    );
    const blackboard = new ActionBlackboard({ output: 7 });
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const createStep = (path: string) => ({
      kind: 'readBuffBlackboard' as const,
      parameters: {
        target: 'enemy' as const,
        tagQueryType: 'hasAny' as const,
        buffTagIds: [gameplayTagIdFromPath(path)],
        desiredKey: 'count',
        outputKey: 'output',
      },
    });

    expect(executor.execute(createStep(matchedPath), { blackboard })).toBe(true);
    expect(blackboard.getNumber('output')).toBe(0);
    blackboard.assignDynamic('output', 7);
    expect(executor.execute(createStep(missingPath), { blackboard })).toBe(false);
    expect(blackboard.getNumber('output')).toBe(7);
  });

  it('finishes every matching active buff with the configured reason', () => {
    const path = 'buff/status/conduct';
    const otherPath = 'buff/status/other';
    const target = new CombatBuffContainer(
      'enemy',
      new CombatAttributeSet(),
      new GameplayTagRegistry([path, otherPath]),
    );
    const first = target.add(
      {
        id: 'first',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(path)],
      },
      'operator',
    );
    const second = target.add(
      {
        id: 'second',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(path)],
      },
      'operator',
    );
    const unrelated = target.add(
      {
        id: 'unrelated',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(otherPath)],
      },
      'operator',
    );
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });

    expect(
      executor.execute({
        kind: 'finishBuffsByTag',
        parameters: {
          target: 'enemy',
          tagQueryType: 'hasAny',
          buffTagIds: [gameplayTagIdFromPath(path)],
          reason: 'early',
        },
      }),
    ).toBe(true);
    expect(first?.finishReason).toBe('early');
    expect(second?.finishReason).toBe('early');
    expect(unrelated?.isFinished).toBe(false);
  });

  it('queries and finishes caster buffs by stable Buff identity', () => {
    const caster = new CombatBuffContainer('operator', new CombatAttributeSet());
    const active = caster.add(
      { id: 'sword-trigger', stackingType: 'stack', maxStackCount: 3 },
      'operator',
    );
    caster.add({ id: 'sword-trigger', stackingType: 'stack', maxStackCount: 3 }, 'operator');
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => caster,
      delegate,
    });

    expect(
      executor.evaluate({
        kind: 'buffIdStackCompare',
        target: 'caster',
        buffIds: ['sword-trigger'],
        operator: 'greaterOrEqual',
        value: 2,
      }),
    ).toBe(true);
    expect(
      executor.execute({
        kind: 'finishBuffsById',
        parameters: {
          target: 'caster',
          buffIds: ['sword-trigger'],
          reason: 'other',
        },
      }),
    ).toBe(true);
    expect(active?.finishReason).toBe('other');
    expect(caster.getCountById('sword-trigger')).toBe(0);
  });
});
