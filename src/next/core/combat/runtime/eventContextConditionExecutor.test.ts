import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';

const terminal = {
  execute: () => true,
  evaluate: () => false,
};

describe('EventContextConditionExecutor', () => {
  it('matches the Buff identity carried by an application event', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      event: {
        kind: 'buffApplied' as const,
        targetId: 'operator',
        buffId: 'buff:matched',
        sourceId: 'enemy',
        buffTagIds: [101, 202],
      },
    };

    expect(
      executor.evaluate({ kind: 'eventBuffIdMatch', buffIds: ['buff:matched'] }, context),
    ).toBe(true);
    expect(executor.evaluate({ kind: 'eventBuffIdMatch', buffIds: ['buff:other'] }, context)).toBe(
      false,
    );
    expect(
      executor.evaluate(
        { kind: 'eventBuffTagsMatch', match: 'hasAny', buffTagIds: [202] },
        context,
      ),
    ).toBe(true);
  });

  it.each([
    ['ignite', true],
    ['early', true],
    ['absorbed', false],
    ['other', false],
  ] as const)('classifies finished Buff reason %s', (reason, expected) => {
    const executor = new EventContextConditionExecutor(terminal);
    expect(
      executor.evaluate(
        { kind: 'eventBuffEndedEarly' },
        {
          blackboard: new ActionBlackboard(),
          event: {
            kind: 'buffFinished',
            targetId: 'enemy',
            buffId: 'seal',
            sourceId: 'operator',
            reason,
          },
        },
      ),
    ).toBe(expected);
  });

  it.each([
    ['exact', ['comboSkill'], true],
    ['exact', ['comboSkill', 'powerAttack'], false],
    ['hasAny', ['normalSkill', 'comboSkill'], true],
    ['hasAll', ['comboSkill', 'powerAttack'], false],
    ['exceptAny', ['normalSkill'], true],
    ['exceptAll', ['comboSkill', 'powerAttack'], true],
  ] as const)('evaluates %s against damage tags', (match, tags, expected) => {
    const executor = new EventContextConditionExecutor(terminal);
    expect(
      executor.evaluate(
        { kind: 'eventDamageTagsMatch', match, tags },
        {
          blackboard: new ActionBlackboard(),
          event: {
            kind: 'enemyDefeated',
            sourceOperatorId: 'operator',
            tags: ['comboSkill'],
          },
        },
      ),
    ).toBe(expected);
  });

  it('rejects use outside an event response and returns false for unrelated events', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const condition = {
      kind: 'eventDamageTagsMatch',
      match: 'hasAny',
      tags: ['comboSkill'],
    } as const;
    expect(() => executor.evaluate(condition, { blackboard: new ActionBlackboard() })).toThrow(
      'requires a combat event context',
    );
    expect(
      executor.evaluate(condition, {
        blackboard: new ActionBlackboard(),
        event: { kind: 'statusExpired', targetId: 'enemy', statusKey: 'status' },
      }),
    ).toBe(false);
  });

  it('evaluates damage features independently from skill tags', () => {
    const executor = new EventContextConditionExecutor(terminal);
    expect(
      executor.evaluate(
        {
          kind: 'eventDamageFeaturesMatch',
          match: 'hasAll',
          features: ['airborne', 'canBreakWeakness'],
        },
        {
          blackboard: new ActionBlackboard(),
          event: {
            kind: 'operatorHit',
            targetOperatorId: 'operator',
            tags: ['ultimateSkill'],
            features: ['airborne', 'canBreakWeakness'],
          },
        },
      ),
    ).toBe(true);
  });
});
