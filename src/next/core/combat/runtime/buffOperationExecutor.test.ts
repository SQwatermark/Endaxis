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
  it('writes a matching Buff stack count to the action blackboard', () => {
    const blackboard = new ActionBlackboard();
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => ({
        ownerId: 'enemy',
        getCountByIds: () => 3,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 2,
        matchesEntityTags: () => false,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
      }),
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'enemy',
            outputKey: 'inflictCnt',
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTagIds: [gameplayTagIdFromPath('buff/status/conduct')],
            },
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('inflictCnt')).toBe(2);
  });

  it('resolves action-blackboard assignments before applying a catalog buff', () => {
    const applied: unknown[] = [];
    const target = {
      ownerId: 'caster',
      apply: (request: unknown) => {
        applied.push(request);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
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

  it('uses an explicitly selected entity as the Buff source', () => {
    const applied: unknown[] = [];
    const targets = {
      caster: {
        ownerId: 'operator',
        getCountByIds: () => 0,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
      },
      enemy: {
        ownerId: 'enemy-1',
        apply: (request: unknown) => {
          applied.push(request);
          return true;
        },
        getCountByIds: () => 0,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
      },
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: target => targets[target],
      delegate,
    });

    expect(
      executor.execute({
        kind: 'applyBuff',
        parameters: {
          buffId: 'mark',
          target: 'enemy',
          source: 'enemy',
        },
      }),
    ).toBe(true);
    expect(applied).toEqual([
      {
        buffId: 'mark',
        sourceId: 'enemy-1',
        blackboardValues: {},
      },
    ]);
  });

  it('forwards the current skill-cast snapshot only when the action requests it', () => {
    const applied: unknown[] = [];
    const target = {
      ownerId: 'caster',
      apply: (request: unknown) => {
        applied.push(request);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const skillCastInfo = {
      skillCastId: 7,
      originSkillId: 'ultimate',
      nonReturnedSpCost: 90,
    };

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'ultimate-base',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        { blackboard: new ActionBlackboard(), skillCastInfo },
      ),
    ).toBe(true);
    expect(applied).toEqual([
      {
        buffId: 'ultimate-base',
        sourceId: 'operator',
        blackboardValues: {},
        skillCastInfo,
      },
    ]);
  });

  it('keeps legacy applyBuff timing fields on the existing delegate path', () => {
    const calls: string[] = [];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => ({
        ownerId: 'enemy',
        apply: () => {
          calls.push('catalog');
          return true;
        },
        getCountByIds: () => 0,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
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
      value: { kind: 'constant' as const, value: 2.000009 },
    };
    const context = { blackboard: new ActionBlackboard({ threshold: 2.000011 }) };

    expect(executor.evaluate(condition, context)).toBe(true);
    expect(
      executor.evaluate({ ...condition, value: { kind: 'blackboard', key: 'threshold' } }, context),
    ).toBe(false);
  });

  it('queries the entity tag container instead of buff classification tags', () => {
    const parentPath = 'combat/state/special';
    const childPath = 'combat/state/special/enhanced';
    const classificationPath = 'buff/classification/enhancement';
    const target = new CombatBuffContainer(
      'operator',
      new CombatAttributeSet(),
      new GameplayTagRegistry([parentPath, childPath, classificationPath]),
    );
    target.add(
      {
        id: 'enhanced-state',
        stackingType: 'unlimited',
        applyTags: [gameplayTagIdFromPath(classificationPath)],
      },
      'operator',
    );
    target.addEntityTags([gameplayTagIdFromPath(childPath)]);
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const condition = {
      kind: 'entityTagMatch' as const,
      target: 'caster' as const,
      tagQueryType: 'hasAny' as const,
      tagIds: [gameplayTagIdFromPath(parentPath)],
    };

    expect(executor.evaluate(condition)).toBe(true);
    expect(
      executor.evaluate({
        ...condition,
        tagIds: [gameplayTagIdFromPath(classificationPath)],
      }),
    ).toBe(false);
    target.removeEntityTags([gameplayTagIdFromPath(childPath)]);
    expect(executor.evaluate(condition)).toBe(false);
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
      executor.evaluate(
        {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['sword-trigger'],
          operator: 'equal',
          value: { kind: 'blackboard', key: 'expectedStacks' },
        },
        { blackboard: new ActionBlackboard({ expectedStacks: 2 }) },
      ),
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

  it('releases the exact Buff hold when the ranged operation ends', () => {
    const caster = new CombatBuffContainer('operator', new CombatAttributeSet());
    const buff = caster.add(
      { id: 'ultimate-base', stackingType: 'unlimited', durationSeconds: 1 },
      'operator',
    )!;
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => caster,
      delegate,
    });
    const operation = {
      kind: 'holdBuffsById' as const,
      parameters: { target: 'caster' as const, buffIds: ['ultimate-base'] },
    };

    expect(executor.execute(operation)).toBe(true);
    expect(buff.isFinishable).toBe(false);

    executor.end(operation);

    expect(buff.isFinishable).toBe(true);
  });
});
