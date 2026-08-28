import { describe, expect, it } from 'vitest';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

describe('CombatSemanticEventRuntime', () => {
  it('matches consumed Buff identity and consuming operator', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'buffConsumed', buffIds: ['buff:no-guard'] },
      phase: 'dataAction',
      handle: context => {
        if (context.event.kind === 'buffConsumed') {
          received.push(`${context.event.kind}:${context.event.sourceOperatorId}`);
        }
      },
    });

    runtime.emit({
      kind: 'buffConsumed',
      sourceOperatorId: 'operator:b',
      targetId: 'enemy',
      buffId: 'buff:no-guard',
      layers: 1,
    });
    runtime.emit({
      kind: 'buffConsumed',
      sourceOperatorId: 'operator:a',
      targetId: 'enemy',
      buffId: 'buff:other',
      layers: 1,
    });
    runtime.emit({
      kind: 'buffConsumed',
      sourceOperatorId: 'operator:a',
      targetId: 'enemy',
      buffId: 'buff:no-guard',
      layers: 2,
    });

    expect(received).toEqual(['buffConsumed:operator:a']);
  });

  it('routes Buff application facts only to the Buff owner', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    for (const ownerOperatorId of ['operator:a', 'operator:b']) {
      runtime.register({
        ownerOperatorId,
        trigger: { kind: 'buffApplied' },
        phase: 'skill',
        handle: context => {
          expect(context.event.kind).toBe('buffApplied');
          received.push(ownerOperatorId);
        },
      });
    }

    runtime.emit({
      kind: 'buffApplied',
      targetId: 'operator:b',
      buffId: 'buff:test',
      sourceId: 'operator:a',
      buffTags: [],
    });

    expect(received).toEqual(['operator:b']);
  });

  it('routes external hit facts only to the targeted operator', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    for (const ownerOperatorId of ['operator:a', 'operator:b']) {
      runtime.register({
        ownerOperatorId,
        trigger: { kind: 'operatorHit' },
        phase: 'skill',
        handle: () => received.push(ownerOperatorId),
      });
    }

    runtime.emit({
      kind: 'operatorHit',
      targetOperatorId: 'operator:b',
      tags: ['normalAttack'],
      features: ['crush'],
    });

    expect(received).toEqual(['operator:b']);
  });

  it('routes successful heal facts only to the receiver, including zero-real-delta heals', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    for (const ownerOperatorId of ['operator:healer', 'operator:receiver']) {
      runtime.register({
        ownerOperatorId,
        trigger: { kind: 'operatorHealed' },
        phase: 'skill',
        handle: ({ event }) => {
          expect(event).toMatchObject({
            kind: 'operatorHealed',
            sourceOperatorId: 'operator:healer',
            targetOperatorId: 'operator:receiver',
            requestedHealing: 100,
            actualHealing: 0,
            overhealing: 100,
            tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
          });
          received.push(ownerOperatorId);
        },
      });
    }

    runtime.emit({
      kind: 'operatorHealed',
      sourceOperatorId: 'operator:healer',
      targetOperatorId: 'operator:receiver',
      requestedHealing: 100,
      actualHealing: 0,
      overhealing: 100,
      tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
    });

    expect(received).toEqual(['operator:receiver']);
  });

  it('can route successful healing by its source without changing the receiver default', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:healer',
      trigger: { kind: 'operatorHealed', role: 'source' },
      phase: 'dataAction',
      handle: () => received.push('source'),
    });
    runtime.register({
      ownerOperatorId: 'operator:receiver',
      trigger: { kind: 'operatorHealed' },
      phase: 'dataAction',
      handle: () => received.push('target'),
    });

    runtime.emit({
      kind: 'operatorHealed',
      sourceOperatorId: 'operator:healer',
      targetOperatorId: 'operator:receiver',
      requestedHealing: 100,
      actualHealing: 0,
      overhealing: 100,
      tags: ['Skill/Character/Common/Heal/NormalSkillHeal'],
    });

    expect(received).toEqual(['source', 'target']);
  });

  it('routes airborne output to the source operator regardless of its target', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    for (const ownerOperatorId of ['operator:a', 'operator:b']) {
      runtime.register({
        ownerOperatorId,
        trigger: { kind: 'airborneOutput' },
        phase: 'skill',
        handle: () => received.push(ownerOperatorId),
      });
    }

    runtime.emit({
      kind: 'airborneOutput',
      sourceOperatorId: 'operator:a',
      targetId: 'enemy',
    });

    expect(received).toEqual(['operator:a']);
  });

  it('distinguishes operator and team scopes while preserving registration order', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:b',
      trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      phase: 'dataAction',
      handle: () => received.push('operator-b'),
    });
    runtime.register({
      ownerOperatorId: 'operator:b',
      trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'team' },
      phase: 'dataAction',
      handle: () => received.push('team'),
    });

    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });
    expect(received).toEqual(['team']);

    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:b',
      tags: ['normalSkill'],
    });
    expect(received).toEqual(['team', 'operator-b', 'team']);
  });

  it('matches elemental lists, skill groups and owner-relative status targets', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: {
        kind: 'elementalInflictionApplied',
        elements: ['heat', 'nature'],
        scope: 'team',
      },
      phase: 'dataAction',
      handle: () => received.push('infliction'),
    });
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'skillHit', skillGroupKey: 'battleSkill', scope: 'operator' },
      phase: 'dataAction',
      handle: () => received.push('skill'),
    });
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'statusExpired', statusKey: 'enhanced', target: 'caster' },
      phase: 'dataAction',
      handle: () => received.push('status'),
    });

    runtime.emit({
      kind: 'elementalInflictionApplied',
      sourceOperatorId: 'operator:b',
      elements: ['nature'],
    });
    runtime.emit({
      kind: 'skillHit',
      sourceOperatorId: 'operator:a',
      skillGroupKey: 'battleSkill',
    });
    runtime.emit({ kind: 'statusExpired', targetId: 'operator:a', statusKey: 'enhanced' });
    expect(received).toEqual(['infliction', 'skill', 'status']);
  });

  it('matches physical infliction type and team scope', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'physicalInflictionApplied', types: ['fracture', 'crush'], scope: 'team' },
      phase: 'combo',
      handle: () => received.push('physical'),
    });

    runtime.emit({
      kind: 'physicalInflictionApplied',
      sourceOperatorId: 'operator:b',
      targetId: 'enemy',
      type: 'knockDown',
    });
    runtime.emit({
      kind: 'physicalInflictionApplied',
      sourceOperatorId: 'operator:b',
      targetId: 'enemy',
      type: 'fracture',
    });

    expect(received).toEqual(['physical']);
  });

  it('matches enemy defeat events by operator or team scope', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'enemyDefeated', scope: 'operator' },
      phase: 'dataAction',
      handle: () => received.push('operator'),
    });
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'enemyDefeated', scope: 'team' },
      phase: 'dataAction',
      handle: () => received.push('team'),
    });

    runtime.emit({ kind: 'enemyDefeated', sourceOperatorId: 'operator:b', tags: ['normalSkill'] });
    runtime.emit({ kind: 'enemyDefeated', sourceOperatorId: 'operator:a', tags: ['comboSkill'] });

    expect(received).toEqual(['team', 'operator', 'team']);
  });

  it('supports disposing a registration', () => {
    const runtime = new CombatSemanticEventRuntime();
    let count = 0;
    const registration = runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'damageTagHit', tag: 'normalAttack', scope: 'operator' },
      phase: 'dataAction',
      handle: () => count++,
    });
    registration.dispose();
    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalAttack'],
    });
    expect(count).toBe(0);
  });

  it('dispatches native phases in order and sorts data actions by priority', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    const register = (
      phase: 'callback' | 'dataAction' | 'skill' | 'combo',
      label: string,
      priority = 0,
    ) => {
      const base = {
        ownerOperatorId: 'operator:a',
        trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'team' },
        handle: () => received.push(label),
      } as const;
      return phase === 'dataAction'
        ? runtime.register({ ...base, phase, priority })
        : runtime.register({ ...base, phase });
    };

    register('combo', 'combo');
    register('dataAction', 'data-low', 1);
    register('skill', 'skill');
    register('callback', 'callback');
    register('dataAction', 'data-high', 2);

    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(received).toEqual(['callback', 'data-high', 'data-low', 'skill', 'combo']);
  });

  it('uses a phase snapshot while preserving synchronous nested dispatch', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    const trigger = { kind: 'damageTagHit', tag: 'normalSkill', scope: 'team' } as const;
    let nested = false;
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger,
      phase: 'callback',
      handle: () => {
        received.push(nested ? 'nested-callback' : 'outer-callback');
        if (nested) return;
        nested = true;
        runtime.register({
          ownerOperatorId: 'operator:a',
          trigger,
          phase: 'callback',
          handle: () => received.push('late-callback'),
        });
        runtime.emit({
          kind: 'damageTagHit',
          sourceOperatorId: 'operator:a',
          tags: ['normalSkill'],
        });
      },
    });

    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(received).toEqual(['outer-callback', 'nested-callback', 'late-callback']);
  });

  it('evaluates conditions through the shared operation chain before handling', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    let evaluations = 0;
    let executorCreations = 0;
    const operations: CombatOperationExecutor = {
      execute: () => true,
      evaluate: condition => {
        evaluations += 1;
        return condition.kind === 'combatActive';
      },
    };
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'damageTagHit', tag: 'normalSkill', scope: 'operator' },
      phase: 'dataAction',
      condition: { kind: 'combatActive' },
      createOperations: () => {
        executorCreations += 1;
        return operations;
      },
      handle: (_context, getOperations) => {
        expect(getOperations()).toBe(operations);
        received.push('handled');
      },
    });

    runtime.emit({
      kind: 'damageTagHit',
      sourceOperatorId: 'operator:a',
      tags: ['normalSkill'],
    });

    expect(evaluations).toBe(1);
    expect(executorCreations).toBe(1);
    expect(received).toEqual(['handled']);
  });

  it('routes skill SP gains only to their source operator and exact gain method', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    for (const ownerOperatorId of ['operator:a', 'operator:b']) {
      runtime.register({
        ownerOperatorId,
        trigger: { kind: 'spGained', source: 'skill', gainKind: 'gain' },
        phase: 'dataAction',
        handle: () => received.push(ownerOperatorId),
      });
    }

    runtime.emit({
      kind: 'spGained',
      sourceOperatorId: 'operator:b',
      source: 'normalAttack',
      gainKind: 'gain',
      amount: 10,
    });
    runtime.emit({
      kind: 'spGained',
      sourceOperatorId: 'operator:b',
      source: 'skill',
      gainKind: 'refund',
      amount: 10,
    });
    runtime.emit({
      kind: 'spGained',
      sourceOperatorId: 'operator:b',
      source: 'skill',
      gainKind: 'gain',
      amount: 10,
    });

    expect(received).toEqual(['operator:b']);
  });

  it('matches an upgrade reaction event only for its owner and reaction', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: string[] = [];
    runtime.register({
      ownerOperatorId: 'operator:a',
      trigger: { kind: 'reactionApplied', reaction: 'electrification' },
      phase: 'dataAction',
      handle: () => received.push('matched'),
    });

    runtime.emit({
      kind: 'reactionApplied',
      sourceOperatorId: 'operator:b',
      reaction: 'electrification',
    });
    runtime.emit({
      kind: 'reactionApplied',
      sourceOperatorId: 'operator:a',
      reaction: 'corrosion',
    });
    runtime.emit({
      kind: 'reactionApplied',
      sourceOperatorId: 'operator:a',
      reaction: 'electrification',
    });

    expect(received).toEqual(['matched']);
  });

  it('routes attachment consumption only to the operator that caused it', () => {
    const runtime = new CombatSemanticEventRuntime();
    const received: number[] = [];
    runtime.register({
      ownerOperatorId: 'operator:last-rite',
      trigger: { kind: 'elementalAttachmentConsumed' },
      phase: 'dataAction',
      handle: context => {
        if (context.event.kind === 'elementalAttachmentConsumed') {
          received.push(context.event.layers);
        }
      },
    });

    runtime.emit({
      kind: 'elementalAttachmentConsumed',
      sourceOperatorId: 'operator:other',
      targetId: 'enemy',
      element: 'cryo',
      layers: 2,
    });
    runtime.emit({
      kind: 'elementalAttachmentConsumed',
      sourceOperatorId: 'operator:last-rite',
      targetId: 'enemy',
      element: 'cryo',
      layers: 4,
    });

    expect(received).toEqual([4]);
  });
});
