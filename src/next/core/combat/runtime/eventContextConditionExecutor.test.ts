import { describe, expect, it } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../tags/gameplayTags';

const terminal = {
  execute: () => true,
  evaluate: () => false,
};

describe('EventContextConditionExecutor', () => {
  it('matches the Buff source cast skill type instead of the current event type', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      skillCastInfo: {
        skillCastId: 3,
        originSkillId: 'weapon-source',
        originSkillType: 'battleSkill' as const,
        nonReturnedSpCost: 0,
      },
      event: {
        kind: 'abilitySkill' as const,
        event: 'beforeCastSkill' as const,
        sourceId: 'operator',
        targetId: 'enemy',
        skillId: 'current-combo',
        skillType: 'comboSkill' as const,
        skillCastId: 4,
      },
    };

    expect(
      executor.evaluate({ kind: 'originSkillTypeIn', skillTypes: ['battleSkill'] }, context),
    ).toBe(true);
    expect(
      executor.evaluate({ kind: 'originSkillTypeIn', skillTypes: ['comboSkill'] }, context),
    ).toBe(false);
    expect(
      executor.evaluate({ kind: 'eventSkillTypeIn', skillTypes: ['comboSkill'] }, context),
    ).toBe(true);
  });

  it('matches the physical-infliction type carried by a source output event', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      event: {
        kind: 'abilityPhysicalInfliction' as const,
        event: 'beforeOutputPhysicalInfliction' as const,
        sourceId: 'operator',
        targetId: 'enemy',
        type: 'fracture' as const,
      },
    };

    expect(
      executor.evaluate(
        { kind: 'eventPhysicalInflictionTypeIn', types: ['fracture', 'crush'] },
        context,
      ),
    ).toBe(true);
    expect(
      executor.evaluate({ kind: 'eventPhysicalInflictionTypeIn', types: ['knockDown'] }, context),
    ).toBe(false);
  });

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

  it('matches an applied Buff child tag through the versioned GameplayTag hierarchy', () => {
    const parentPath = 'Skill/Character/Common/PhysicalStatus';
    const childPath = `${parentPath}/FractureStatus`;
    const registry = new GameplayTagRegistry([parentPath, childPath]);
    const executor = new EventContextConditionExecutor(
      terminal,
      undefined,
      undefined,
      (_targetId, ownedTagIds, requiredTagIds, match) =>
        registry.query(
          ownedTagIds.map(value => value as ReturnType<typeof gameplayTagIdFromPath>),
          requiredTagIds.map(value => value as ReturnType<typeof gameplayTagIdFromPath>),
          match,
        ),
    );

    expect(
      executor.evaluate(
        {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTagIds: [gameplayTagIdFromPath(parentPath)],
        },
        {
          blackboard: new ActionBlackboard(),
          event: {
            kind: 'buffApplied',
            targetId: 'enemy',
            sourceId: 'operator',
            buffId: 'buff_physical_do_fracture',
            buffTagIds: [gameplayTagIdFromPath(childPath)],
          },
        },
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
    expect(
      executor.evaluate({ kind: 'eventSourceTargetMatch', operator: 'notEqual' }, context),
    ).toBe(true);
    expect(
      executor.evaluate(
        { kind: 'eventSourceTargetMatch', operator: 'equal' },
        { ...context, event: { ...context.event, targetId: 'operator:healer' } },
      ),
    ).toBe(true);
  });

  it('matches consumed Buff tags and writes the event Buff identity', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const blackboard = new ActionBlackboard({ buffid: '' });
    expect(
      executor.evaluate(
        {
          kind: 'eventBuffTagsMatch',
          match: 'hasAny',
          buffTagIds: [1466867135, -421286163],
          buffIdOutputKey: 'buffid',
        },
        {
          blackboard,
          event: {
            kind: 'buffConsumed',
            sourceOperatorId: 'operator',
            targetId: 'enemy',
            buffId: 'buff:conduct',
            layers: 3,
            buffTagIds: [1466867135],
            blackboardValues: { count: 3 },
          },
        },
      ),
    ).toBe(true);
    expect(blackboard.getString('buffid')).toBe('buff:conduct');
  });

  it('按 OnObtainAtb 的来源和获得方式筛选技力事件，并允许未勾选维度作为通配符', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      event: {
        kind: 'spGained' as const,
        sourceOperatorId: 'operator',
        source: 'skill' as const,
        gainKind: 'gain' as const,
        amount: 10,
      },
    };

    expect(
      executor.evaluate(
        { kind: 'eventSpGainMatch', sources: ['skill'], gainKinds: ['gain'] },
        context,
      ),
    ).toBe(true);
    expect(executor.evaluate({ kind: 'eventSpGainMatch', gainKinds: ['refund'] }, context)).toBe(
      false,
    );
    expect(executor.evaluate({ kind: 'eventSpGainMatch' }, context)).toBe(true);
  });

  it('compares the consumed layer snapshot and writes the configured output key', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const blackboard = new ActionBlackboard({ count: 0 });
    const context = {
      blackboard,
      event: {
        kind: 'buffConsumed' as const,
        sourceOperatorId: 'operator',
        targetId: 'enemy',
        buffId: 'buff:test',
        layers: 3,
      },
    };

    expect(
      executor.evaluate(
        {
          kind: 'eventConsumedBuffLayerCompare',
          operator: 'greaterOrEqual',
          value: { kind: 'constant', value: 1 },
          outputKey: 'count',
        },
        context,
      ),
    ).toBe(true);
    expect(blackboard.getNumber('count')).toBe(3);
  });

  it('compares the explicit action owner with the event target', () => {
    const executor = new EventContextConditionExecutor(terminal);
    const context = {
      blackboard: new ActionBlackboard(),
      actionOwnerId: 'operator:owner',
      event: {
        kind: 'abilityHeal' as const,
        event: 'outputHeal' as const,
        sourceId: 'operator:healer',
        targetId: 'operator:owner',
        requestedHealing: 10,
        actualHealing: 10,
        overhealing: 0,
        tagIds: [],
      },
    };

    expect(
      executor.evaluate({ kind: 'eventActionOwnerTargetMatch', operator: 'equal' }, context),
    ).toBe(true);
  });
});
