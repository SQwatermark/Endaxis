import { describe, expect, it } from 'vitest';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

describe('CombatSemanticEventRuntime', () => {
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
});
