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
  it('applies the first no-guard layer before executing the fracture Buff chain', () => {
    let noGuardCount = 0;
    const applied: string[] = [];
    const consumed: Array<{ buffId: string; layers: number; sourceOperatorId: string }> = [];
    const target = {
      ownerId: 'enemy',
      apply: (request: { buffId: string }) => {
        applied.push(request.buffId);
        if (request.buffId === 'buff_physical_no_guard') noGuardCount += 1;
        if (request.buffId === 'buff_physical_fracture') noGuardCount = 0;
        return true;
      },
      getCountByIds: (ids: readonly string[]) =>
        ids.includes('buff_physical_no_guard') ? noGuardCount : 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'antal',
      sourceActionId: 'comboSkill',
      resolveTarget: () => target,
      onBuffConsumed: event => consumed.push(event),
      delegate,
    });
    const step = {
      kind: 'applyPhysicalInfliction' as const,
      parameters: {
        type: 'fracture' as const,
        target: 'enemy' as const,
        isExtra: false,
        noGuardBuffId: 'buff_physical_no_guard',
        noGuardDefinition: { stackingType: 'unlimited' as const },
        fractureBuffId: 'buff_physical_fracture',
        fractureDefinition: { stackingType: 'refresh' as const },
      },
    };
    const context = {
      blackboard: new ActionBlackboard(),
      skillCastInfo: {
        skillCastId: 1,
        originSkillId: 'comboSkill',
        nonReturnedSpCost: 0,
      },
    };

    expect(executor.execute(step, context)).toBe(true);
    expect(executor.execute(step, context)).toBe(true);
    expect(applied).toEqual(['buff_physical_no_guard', 'buff_physical_fracture']);
    expect(consumed).toEqual([
      {
        sourceOperatorId: 'antal',
        targetId: 'enemy',
        buffId: 'buff_physical_no_guard',
        layers: 1,
      },
    ]);
  });

  it('resolves Crush assignments only when the existing no-guard layer is consumed', () => {
    let noGuardCount = 1;
    const applied: Array<{ buffId: string; blackboardValues: Readonly<Record<string, number>> }> =
      [];
    const target = {
      ownerId: 'enemy',
      apply: (request: { buffId: string; blackboardValues: Readonly<Record<string, number>> }) => {
        applied.push(request);
        if (request.buffId === 'buff_physical_crushed') noGuardCount = 0;
        return true;
      },
      getCountByIds: (ids: readonly string[]) =>
        ids.includes('buff_physical_no_guard') ? noGuardCount : 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'dapan',
      resolveTarget: () => target,
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'applyPhysicalInfliction',
          parameters: {
            type: 'crush',
            target: 'enemy',
            isExtra: false,
            noGuardBuffId: 'buff_physical_no_guard',
            noGuardDefinition: { stackingType: 'enhanceAndRefresh' },
            crushedBuffId: 'buff_physical_crushed',
            crushedDefinition: { stackingType: 'stack', stackingKey: 'physical' },
            damageMultiplier: { kind: 'blackboard', key: 'crush_multi' },
            ignoreHitEffect: true,
          },
        },
        {
          blackboard: new ActionBlackboard({ crush_multi: 1.75 }),
          skillCastInfo: { skillCastId: 1, originSkillId: 'combo', nonReturnedSpCost: 0 },
        },
      ),
    ).toBe(true);
    expect(applied).toEqual([
      expect.objectContaining({
        buffId: 'buff_physical_crushed',
        blackboardValues: { dmg_multiplier: 1.75, ignore_hit_effect: 1 },
      }),
    ]);
  });

  it('finishes only Buff instances created for the active action interval', () => {
    const finished: string[] = [];
    const target = {
      ownerId: 'enemy',
      applyScoped: () => ({
        finish: (reason: string) => {
          finished.push(reason);
          return true;
        },
      }),
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const step = {
      kind: 'applyBuff' as const,
      parameters: {
        buffId: 'aura-buff',
        target: 'enemy' as const,
        finishByAction: true,
      },
    };

    expect(executor.execute(step, { blackboard: new ActionBlackboard() })).toBe(true);
    expect(finished).toEqual([]);

    executor.end(step, { blackboard: new ActionBlackboard() });
    expect(finished).toEqual(['other']);
  });

  it('finishes the Buff instance supplied by its lifecycle event context', () => {
    const blackboard = new ActionBlackboard();
    const reasons: string[] = [];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => {
        throw new Error('finishCurrentBuff must not resolve an entity Buff container');
      },
      delegate,
    });

    expect(
      executor.execute(
        { kind: 'finishCurrentBuff', parameters: { reason: 'early' } },
        {
          blackboard,
          finishCurrentBuff: reason => {
            reasons.push(reason);
            return true;
          },
        },
      ),
    ).toBe(true);
    expect(reasons).toEqual(['early']);
  });

  it('finishes Buffs on the current ability entity without aliasing it to the caster', () => {
    const finished: string[][] = [];
    const entityTarget = {
      ownerId: 'abilityEntity:7',
      getCountByIds: () => 0,
      finishByIds: (ids: readonly string[]) => {
        finished.push([...ids]);
        return ids.length;
      },
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => {
        throw new Error('current ability entity must not resolve through CombatTarget');
      },
      resolveCurrentAbilityEntityTarget: () => entityTarget,
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'finishBuffsById',
          parameters: {
            target: 'currentAbilityEntity',
            buffIds: ['effect', 'effect-line'],
            reason: 'other',
          },
        },
        {
          blackboard: new ActionBlackboard(),
          currentTarget: { kind: 'abilityEntity', instanceId: 7 },
        },
      ),
    ).toBe(true);
    expect(finished).toEqual([['effect', 'effect-line']]);
  });

  it('resolves a partial Buff finish count from the current action blackboard', () => {
    const calls: { ids: readonly string[]; count: number; reason: string }[] = [];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => ({
        ownerId: 'operator',
        getCountByIds: () => 0,
        findFirstByIds: () => undefined,
        finishByIds: () => 0,
        finishCountByIds: (ids, count, reason) => {
          calls.push({ ids, count, reason });
          return count;
        },
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
      }),
      delegate,
    });
    const blackboard = new ActionBlackboard({ layers: 1 });

    expect(
      executor.execute(
        {
          kind: 'finishBuffsById',
          parameters: {
            target: 'caster',
            buffIds: ['preparation'],
            reason: 'other',
            count: { kind: 'blackboard', key: 'layers' },
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(calls).toEqual([{ ids: ['preparation'], count: 1, reason: 'other' }]);
  });

  it('resolves a partial tag Buff finish count from the current action blackboard', () => {
    const calls: { tags: readonly number[]; count: number; reason: string }[] = [];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => ({
        ownerId: 'enemy',
        getCountByIds: () => 0,
        findFirstByIds: () => undefined,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
        findFirstByTags: () => undefined,
        finishByTags: () => 0,
        finishCountByTags: (tags, _type, count, reason) => {
          calls.push({ tags, count, reason });
          return count;
        },
      }),
      delegate,
    });
    const tag = gameplayTagIdFromPath('buff/status/fire');

    expect(
      executor.execute(
        {
          kind: 'finishBuffsByTag',
          parameters: {
            target: 'enemy',
            tagQueryType: 'hasAny',
            buffTagIds: [tag],
            reason: 'early',
            count: { kind: 'constant', value: 1 },
          },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
    expect(calls).toEqual([{ tags: [tag], count: 1, reason: 'early' }]);
  });

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
        findFirstByIds: () => undefined,
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

  it('writes the executing Buff enhance count for an environment query', () => {
    const blackboard = new ActionBlackboard({ count: 0 });
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => {
        throw new Error('environment query must not resolve a target container');
      },
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'count',
            query: { kind: 'environment' },
          },
        },
        { blackboard, getCurrentBuffEnhanceCount: () => 4 },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('count')).toBe(4);
  });

  it('resolves action-blackboard assignments before applying a index buff', () => {
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
      findFirstByIds: () => undefined,
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

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'external-event-buff',
            target: 'caster',
            inheritSourceSkillCastInfo: true,
          },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
    expect(applied[1]).toEqual({
      buffId: 'external-event-buff',
      sourceId: 'operator',
      blackboardValues: {},
    });
  });

  it('resolves an id-only application from the operator Buff blueprint table', () => {
    const applied: unknown[] = [];
    const definition = {
      stackingType: 'refresh' as const,
      priority: 0,
      maxStackCount: 1,
    };
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
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      resolveBuffDefinition: buffId => (buffId === 'operator-mark' ? definition : undefined),
      delegate,
    });

    expect(
      executor.execute({
        kind: 'applyBuff',
        parameters: { buffId: 'operator-mark', target: 'caster' },
      }),
    ).toBe(true);
    expect(applied).toEqual([
      {
        buffId: 'operator-mark',
        definition,
        sourceId: 'operator',
        blackboardValues: {},
      },
    ]);
  });

  it('applies a party Buff to every resolved operator target', () => {
    const appliedTo: string[] = [];
    const createTarget = (ownerId: string) => ({
      ownerId,
      apply: () => {
        appliedTo.push(ownerId);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    });
    const party = [createTarget('operator-a'), createTarget('operator-b')];
    const executor = new BuffOperationExecutor({
      sourceId: 'operator-a',
      resolveTarget: () => party[0]!,
      resolveApplicationTargets: target => (target === 'party' ? party : [party[0]!]),
      delegate,
    });

    expect(
      executor.execute({
        kind: 'applyBuff',
        parameters: { buffId: 'party-buff', target: 'party' },
      }),
    ).toBe(true);
    expect(appliedTo).toEqual(['operator-a', 'operator-b']);
  });

  it('resolves a lifecycle child Buff and query against the current Buff owner', () => {
    const applied: unknown[] = [];
    const owner = {
      ownerId: 'operator-b',
      apply: (request: unknown) => {
        applied.push(request);
        return true;
      },
      getCountByIds: () => 3,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator-a',
      resolveTarget: () => owner,
      resolveEventTarget: targetId => {
        expect(targetId).toBe('operator-b');
        return owner;
      },
      delegate,
    });
    const context = {
      blackboard: new ActionBlackboard({ count: 0 }),
      buffOwnerId: 'operator-b',
    };

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: { buffId: 'owner-child', target: 'buffOwner' },
        },
        context,
      ),
    ).toBe(true);
    expect(
      executor.execute(
        {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'buffOwner',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['owner-child'] },
          },
        },
        context,
      ),
    ).toBe(true);
    expect(applied).toEqual([
      expect.objectContaining({ buffId: 'owner-child', sourceId: 'operator-a' }),
    ]);
    expect(context.blackboard.getNumber('count')).toBe(3);
  });

  it('resolves an operator-healed semantic event target for Buff application', () => {
    const applied: unknown[] = [];
    const target = {
      ownerId: 'operator-b',
      apply: (request: unknown) => {
        applied.push(request);
        return true;
      },
      getCountByIds: () => 0,
      finishByIds: () => 0,
      holdByIds: () => ({ release: () => undefined }),
      getCountByTags: () => 0,
      matchesEntityTags: () => false,
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator-a',
      resolveTarget: () => target,
      resolveEventTarget: targetId => {
        expect(targetId).toBe('operator-b');
        return target;
      },
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: { buffId: 'healing-trigger-buff', target: 'eventTarget' },
        },
        {
          blackboard: new ActionBlackboard(),
          event: {
            kind: 'operatorHealed',
            sourceOperatorId: 'operator-a',
            targetOperatorId: 'operator-b',
            requestedHealing: 100,
            actualHealing: 0,
            overhealing: 100,
            tagIds: [1],
          },
        },
      ),
    ).toBe(true);
    expect(applied).toEqual([
      expect.objectContaining({ buffId: 'healing-trigger-buff', sourceId: 'operator-a' }),
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
        findFirstByIds: () => undefined,
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
        findFirstByIds: () => undefined,
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

  it('uses the current ability entity handle as the Buff source', () => {
    const applied: unknown[] = [];
    const target = {
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
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      resolveCurrentAbilityEntityTarget: () => ({ ...target, ownerId: 'abilityEntity:7' }),
      delegate,
    });

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'entity-sourced-mark',
            target: 'enemy',
            source: 'currentAbilityEntity',
          },
        },
        {
          blackboard: new ActionBlackboard(),
          currentTarget: { kind: 'abilityEntity', instanceId: 7 },
        },
      ),
    ).toBe(true);
    expect(applied).toEqual([expect.objectContaining({ sourceId: 'abilityEntity:7' })]);
  });

  it('repeats a Buff using the runtime action-blackboard count', () => {
    const applied: unknown[] = [];
    const target = {
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
      findFirstByIds: () => undefined,
      findFirstByTags: () => undefined,
      finishByTags: () => 0,
    };
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => target,
      delegate,
    });
    const blackboard = new ActionBlackboard({ count: 2.5 });

    expect(
      executor.execute(
        {
          kind: 'applyBuff',
          parameters: {
            buffId: 'stack-marker',
            target: 'enemy',
            count: { kind: 'blackboard', key: 'count' },
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(applied).toHaveLength(3);
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
      findFirstByIds: () => undefined,
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
          calls.push('index');
          return true;
        },
        getCountByIds: () => 0,
        finishByIds: () => 0,
        holdByIds: () => ({ release: () => undefined }),
        getCountByTags: () => 0,
        matchesEntityTags: () => false,
        findFirstByIds: () => undefined,
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
      resolveEventTarget: id => {
        expect(id).toBe('enemy');
        return target;
      },
      delegate,
    });
    const condition = {
      kind: 'buffStackCompare' as const,
      target: 'buffOwner' as const,
      tagQueryType: 'hasAny' as const,
      buffTagIds: [gameplayTagIdFromPath(path)],
      operator: 'greaterOrEqual' as const,
      value: { kind: 'constant' as const, value: 2.000009 },
    };
    const context = {
      blackboard: new ActionBlackboard({ threshold: 2.000011 }),
      buffOwnerId: 'enemy',
    };

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
            query: {
              kind: 'tag',
              tagQueryType: 'hasAny',
              buffTagIds: [gameplayTagIdFromPath(path)],
            },
            desiredKey: 'count',
            outputKey: 'conductCount',
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('conductCount')).toBe(4);
  });

  it('reads the first Buff matching an ID query', () => {
    const target = new CombatBuffContainer(
      'caster',
      new CombatAttributeSet(),
      new GameplayTagRegistry([]),
    );
    target.add(
      {
        id: 'other',
        stackingType: 'unlimited',
        blackboard: { value: 3 },
      },
      'operator',
    );
    target.add(
      {
        id: 'wanted',
        stackingType: 'unlimited',
        blackboard: { value: 8 },
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
            target: 'caster',
            query: { kind: 'id', buffIds: ['wanted'] },
            desiredKey: 'value',
            outputKey: 'result',
          },
        },
        { blackboard },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('result')).toBe(8);
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
        query: {
          kind: 'tag' as const,
          tagQueryType: 'hasAny' as const,
          buffTagIds: [gameplayTagIdFromPath(path)],
        },
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

  it('limits Buff stack queries to the current inherited skill cast', () => {
    const caster = new CombatBuffContainer('operator', new CombatAttributeSet());
    const skillCastInfo = {
      skillCastId: 7,
      originSkillId: 'normal',
      nonReturnedSpCost: 0,
    };
    caster.add({ id: 'infliction', stackingType: 'unlimited' }, 'operator', { skillCastInfo });
    caster.add({ id: 'infliction', stackingType: 'unlimited' }, 'operator', {
      skillCastInfo: { ...skillCastInfo, skillCastId: 8 },
    });
    const executor = new BuffOperationExecutor({
      sourceId: 'operator',
      resolveTarget: () => caster,
      delegate,
    });
    const context = { blackboard: new ActionBlackboard(), skillCastInfo };

    expect(
      executor.evaluate(
        {
          kind: 'buffIdStackCompare',
          target: 'caster',
          buffIds: ['infliction'],
          sameSourceSkillCast: true,
          operator: 'equal',
          value: 1,
        },
        context,
      ),
    ).toBe(true);
    expect(
      executor.execute(
        {
          kind: 'readBuffStackCount',
          parameters: {
            target: 'caster',
            outputKey: 'count',
            query: { kind: 'id', buffIds: ['infliction'] },
            sameSourceSkillCast: true,
          },
        },
        context,
      ),
    ).toBe(true);
    expect(context.blackboard.getNumber('count')).toBe(1);
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
