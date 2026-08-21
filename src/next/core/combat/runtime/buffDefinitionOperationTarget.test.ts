import { describe, expect, it, vi } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import type { CombatBuffDefinitionEntry } from '../buffs/combatBuffDefinitions';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';

type Attribute = 'cost';

describe('BuffDefinitionOperationTarget', () => {
  it('uses each apply step definition only when creating its own runtime instance', () => {
    const container = new CombatBuffContainer('operator', new CombatAttributeSet<string>());
    const compiledEntries: CombatBuffDefinitionEntry[] = [];
    const target = new BuffDefinitionOperationTarget(container, {
      get: () => undefined,
      compile: entry => {
        compiledEntries.push(entry);
        return {
          id: entry.id,
          stackingType: entry.stackingType,
          durationSeconds: entry.durationSeconds,
        };
      },
    });

    const firstDefinition = {
      stackingType: 'refresh',
      durationSeconds: 5,
      presentation: { iconPath: '/icons/buffs/shared.webp' },
    } as const;
    const secondDefinition = { stackingType: 'refresh', durationSeconds: 9 } as const;
    target.apply({
      buffId: 'shared-key',
      definition: firstDefinition,
      sourceId: 'first',
      blackboardValues: {},
    });
    const instance = container.buffs[0]!;
    target.apply({
      buffId: 'shared-key',
      definition: secondDefinition,
      sourceId: 'second',
      blackboardValues: {},
    });

    expect(container.buffs).toHaveLength(1);
    expect(instance.definition.durationSeconds).toBe(5);
    expect(instance.remainingDuration).toBe(9);
    expect(compiledEntries[0]).not.toHaveProperty('presentation');
  });

  it('resolves a stable identity and keeps application values on the created instance', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('cost', 100, { minimum: 0, maximum: 100 });
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'free-skill',
      stackingType: 'unique',
      blackboard: { amount: -20 },
      attributeModifiers: [
        {
          attribute: 'cost',
          values: { slot: 'baseAddition', blackboardKey: 'amount' },
          timing: 'runtime',
        },
      ],
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: id => (id === definition.id ? definition : undefined),
    });

    expect(
      target.apply({
        buffId: 'free-skill',
        sourceId: 'operator',
        blackboardValues: { amount: -100 },
      }),
    ).toBe(true);
    expect(attributes.get('cost')).toBe(0);
  });

  it('keeps an inline dynamic max stack count until application blackboard resolution', () => {
    const container = new CombatBuffContainer('operator', new CombatAttributeSet<string>());
    const compiledEntries: CombatBuffDefinitionEntry[] = [];
    const target = new BuffDefinitionOperationTarget(container, {
      get: () => undefined,
      compile: entry => {
        compiledEntries.push(entry);
        return { id: entry.id, stackingType: entry.stackingType };
      },
    });
    const definition = {
      stackingType: 'stack',
      maxStackCount: { blackboardKey: 'max_stack' },
    } as const;

    for (let index = 0; index < 3; index += 1) {
      target.apply({
        buffId: 'dynamic-stack',
        definition,
        sourceId: 'operator',
        blackboardValues: { max_stack: 2 },
      });
    }

    expect(compiledEntries[0]).not.toHaveProperty('maxStackCount');
    expect(container.getCountById('dynamic-stack')).toBe(2);
  });

  it('rejects an unknown identity instead of creating an empty definition', () => {
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      { get: () => undefined },
    );

    expect(() =>
      target.apply({ buffId: 'missing', sourceId: 'operator', blackboardValues: {} }),
    ).toThrow("unknown combat buff 'missing'");
  });

  it('advances the owned container with the shared combat frame interval', () => {
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition: CombatBuffDefinition<never> = {
      id: 'one-frame',
      stackingType: 'unique',
      durationSeconds: 1 / 30,
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: id => (id === definition.id ? definition : undefined),
    });

    target.apply({ buffId: definition.id, sourceId: 'operator', blackboardValues: {} });
    expect(container.getCountById(definition.id)).toBe(1);

    target.advanceFrame();
    expect(container.getCountById(definition.id)).toBe(0);
  });

  it('stores the supplied skill-cast snapshot on the created Buff instance', () => {
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition: CombatBuffDefinition<never> = {
      id: 'inherited-cast',
      stackingType: 'unique',
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: () => definition,
    });
    const skillCastInfo = {
      skillCastId: 3,
      originSkillId: 'battleSkill',
      nonReturnedSpCost: 90,
    };

    target.apply({
      buffId: definition.id,
      sourceId: 'operator',
      blackboardValues: {},
      skillCastInfo,
    });

    expect(container.buffs[0]?.skillCastInfo).toEqual(skillCastInfo);
  });

  it('rejects lifecycle sequences until a Buff-owned sequence runtime is configured', () => {
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      },
    );

    expect(() =>
      target.apply({
        buffId: 'active-buff',
        sourceId: 'operator',
        blackboardValues: {},
        definition: {
          stackingType: 'unique',
          lifecycleSequences: { start: { steps: [] } },
        },
      }),
    ).toThrow('no Buff sequence runtime is configured');
  });

  it('binds lifecycle definitions to the configured per-instance operation factory', () => {
    let executed = false;
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      },
    );
    target.configureLifecycleOperations(() => ({
      execute: () => {
        executed = true;
        return true;
      },
      evaluate: () => true,
    }));

    expect(
      target.apply({
        buffId: 'active-buff',
        sourceId: 'operator',
        blackboardValues: {},
        definition: {
          stackingType: 'unique',
          lifecycleSequences: {
            start: {
              steps: [
                {
                  kind: 'setContextFlag',
                  parameters: { flag: 'started', value: true, target: 'caster' },
                },
              ],
            },
          },
        },
      }),
    ).toBe(true);
    expect(executed).toBe(true);
  });

  it('notifies the owner event boundary after a Buff is successfully applied', () => {
    const onBuffApplied = vi.fn();
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      },
      undefined,
      undefined,
      onBuffApplied,
    );

    expect(
      target.apply({
        buffId: 'added-buff',
        sourceId: 'operator',
        blackboardValues: {},
        definition: { stackingType: 'unique' },
      }),
    ).toBe(true);
    expect(onBuffApplied).toHaveBeenCalledWith({
      targetId: 'operator',
      buffId: 'added-buff',
      sourceId: 'operator',
      buffTagIds: [],
    });
  });

  it('publishes before-output identity before attempting to create the Buff instance', () => {
    const container = new CombatBuffContainer('enemy', new CombatAttributeSet());
    const countsBeforeAttempt: number[] = [];
    const before = vi.fn(event => {
      countsBeforeAttempt.push(container.buffs.length);
      expect(event).toEqual({
        targetId: 'enemy',
        buffId: 'frozen',
        sourceId: 'yvonne',
        buffTagIds: [1535684437],
      });
    });
    const after = vi.fn();
    const output = vi.fn();
    const target = new BuffDefinitionOperationTarget(
      container,
      {
        get: () => undefined,
        compile: entry => ({
          id: entry.id,
          stackingType: entry.stackingType,
          applyTags: entry.applyTagIds?.map(String),
        }),
      },
      undefined,
      undefined,
      after,
      before,
      output,
    );
    const request = {
      buffId: 'frozen',
      sourceId: 'yvonne',
      blackboardValues: {},
      definition: { stackingType: 'unique' as const, applyTagIds: [1535684437] },
    };

    expect(target.apply(request)).toBe(true);
    expect(target.apply(request)).toBe(false);

    expect(before).toHaveBeenCalledTimes(2);
    expect(after).toHaveBeenCalledOnce();
    expect(output).toHaveBeenCalledOnce();
    expect(countsBeforeAttempt).toEqual([0, 1]);
  });

  it('publishes the exact successful Buff application to the scene observer', () => {
    const observer = vi.fn();
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      },
    );
    target.configureBuffAppliedObserver(observer);

    expect(
      target.apply({
        buffId: 'added-buff',
        sourceId: 'enemy',
        blackboardValues: {},
        definition: { stackingType: 'unique' },
      }),
    ).toBe(true);
    expect(observer).toHaveBeenCalledWith({
      targetId: 'operator',
      buffId: 'added-buff',
      sourceId: 'enemy',
      buffTagIds: [],
    });
    expect(() => target.configureBuffAppliedObserver(observer)).toThrow('observer is configured');
  });

  it('registers an added-Buff response before publishing the successful application', () => {
    let handleAdded: ((payload: unknown) => void) | undefined;
    const execute = vi.fn(() => true);
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      {
        get: () => undefined,
        compile: entry => ({ id: entry.id, stackingType: entry.stackingType }),
      },
      undefined,
      (event, _priority, handle) => {
        expect(event).toBe('addedBuff');
        handleAdded = handle;
        return { dispose: vi.fn() };
      },
      event => handleAdded?.(event),
    );
    target.configureLifecycleOperations(() => ({ execute, evaluate: () => true }));

    expect(
      target.apply({
        buffId: 'listens-for-add',
        sourceId: 'operator',
        blackboardValues: {},
        definition: {
          stackingType: 'unique',
          abilityEventResponses: [
            {
              event: 'addedBuff',
              priority: 0,
              sequence: {
                steps: [
                  {
                    kind: 'setContextFlag',
                    parameters: { flag: 'added', value: true, target: 'caster' },
                  },
                ],
              },
            },
          ],
        },
      }),
    ).toBe(true);
    expect(execute).toHaveBeenCalledOnce();
  });

  it('rejects configuring lifecycle operations more than once', () => {
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      { get: () => undefined },
    );
    const operations = { execute: () => true, evaluate: () => true };

    target.configureLifecycleOperations(() => operations);
    expect(() => target.configureLifecycleOperations(() => operations)).toThrow(
      'lifecycle operations are configured',
    );
  });
});
