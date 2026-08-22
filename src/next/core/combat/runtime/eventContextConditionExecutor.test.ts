import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';

const terminal = {
  execute: () => true,
  evaluate: () => false,
};

describe('EventContextConditionExecutor', () => {
  it('matches only the requested element on an enemy infliction event', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const condition = {
      kind: 'eventInflictionElementIn',
      elements: ['cryo', 'nature'],
    } as const;
    const context = {
      blackboard: new ActionBlackboard(),
      event: {
        kind: 'abilitySpellInfliction' as const,
        event: 'beforeTakeInfliction' as const,
        sourceId: 'fluorite',
        targetId: 'enemy',
        element: 'nature' as const,
      },
    };

    expect(executor.evaluate(condition, context)).toBe(true);
    expect(
      executor.evaluate(condition, {
        ...context,
        event: { ...context.event, element: 'electric' as const },
      }),
    ).toBe(false);
  });

  it('matches an explicitly typed external operator hit and rejects an unspecified type', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const condition = { kind: 'eventDamageTypeIn', damageTypes: ['heat'] } as const;

    expect(
      executor.evaluate(condition, {
        blackboard: new ActionBlackboard(),
        event: {
          kind: 'operatorHit',
          targetOperatorId: 'operator',
          damageType: 'heat',
          tags: [],
          features: [],
        },
      }),
    ).toBe(true);
    expect(
      executor.evaluate(condition, {
        blackboard: new ActionBlackboard(),
        event: {
          kind: 'operatorHit',
          targetOperatorId: 'operator',
          tags: [],
          features: [],
        },
      }),
    ).toBe(false);
  });
  it('matches the ability damage source against live control state', () => {
    const executor = new EventContextConditionExecutor(
      terminal,
      operatorId => operatorId === 'operator:controlled',
    );
    const context = {
      blackboard: new ActionBlackboard(),
      event: {
        kind: 'abilityDamage' as const,
        event: 'beforeTakeDamage' as const,
        sourceId: 'operator:controlled',
        targetId: 'enemy',
        tags: [] as const,
        features: [] as const,
      },
    };

    expect(executor.evaluate({ kind: 'eventSourceControlled' }, context)).toBe(true);
    expect(
      executor.evaluate(
        { kind: 'eventSourceControlled' },
        { ...context, event: { ...context.event, sourceId: 'operator:other' } },
      ),
    ).toBe(false);
  });

  it('resolves SourceFinder through the Buff-source AbilityEntity provenance', () => {
    const executor = new EventContextConditionExecutor(terminal, undefined, entityId =>
      entityId === 'ability-entity:7' ? 'pogranichnik' : entityId,
    );
    const condition = { kind: 'eventSourceMatchesBuffSourceEntitySource' } as const;
    const context = {
      blackboard: new ActionBlackboard(),
      buffSourceId: 'ability-entity:7',
      event: {
        kind: 'abilityPhysicalInfliction' as const,
        event: 'beforeTakePhysicalInfliction' as const,
        sourceId: 'pogranichnik',
        targetId: 'ability-entity:7',
      },
    };

    expect(executor.evaluate(condition, context)).toBe(true);
    expect(
      executor.evaluate(condition, {
        ...context,
        event: { ...context.event, sourceId: 'another-operator' },
      }),
    ).toBe(false);
  });

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

  it('matches heal tags and writes native overheal outputs before returning', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const blackboard = new ActionBlackboard();
    const context = {
      blackboard,
      event: {
        kind: 'abilityHeal' as const,
        event: 'receiveHeal' as const,
        sourceId: 'operator:healer',
        targetId: 'operator:receiver',
        requestedHealing: 216,
        actualHealing: 0,
        overhealing: 216,
        tagIds: [-320297214],
      },
    };

    expect(
      executor.evaluate(
        { kind: 'eventHealTagsMatch', match: 'hasAny', tagIds: [-320297214, 1] },
        context,
      ),
    ).toBe(true);
    expect(
      executor.evaluate(
        {
          kind: 'eventOverheal',
          overHealKey: 'over',
          finalHealKey: 'final',
          realHealKey: 'real',
        },
        context,
      ),
    ).toBe(true);
    expect(blackboard.snapshot()).toMatchObject({ over: 216, final: 216, real: 0 });
  });
});
