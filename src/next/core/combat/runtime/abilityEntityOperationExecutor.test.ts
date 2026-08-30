import { describe, expect, it, vi } from 'vitest';
import { ActionBlackboard } from './actionBlackboard';
import { AbilityEntityOperationExecutor } from './abilityEntityOperationExecutor';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatOperationContext } from './skillRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';

describe('AbilityEntityOperationExecutor', () => {
  it('resolves an ID-only spawn from the current compiled skill definition table', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const executor = new AbilityEntityOperationExecutor(
      'arclight',
      entities,
      { execute: () => false, evaluate: () => false },
      undefined,
      abilityEntityId =>
        abilityEntityId === 'pulse'
          ? { lifetime: { kind: 'limited', durationSeconds: 5 } }
          : undefined,
    );

    expect(
      executor.execute(
        {
          kind: 'spawnAbilityEntity',
          parameters: { abilityEntityId: 'pulse', dieWhenSourceDies: false },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
    expect(entities.findOwnerSpawned({ ownerId: 'arclight' })).toHaveLength(1);
  });

  it('resolves template duration and stacking limit from spawn entity-blackboard assignments', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const executor = new AbilityEntityOperationExecutor(
      'zhuang-fangyi',
      entities,
      { execute: () => false, evaluate: () => false },
      undefined,
      () => ({
        lifetime: {
          kind: 'limited',
          durationSeconds: { blackboardKey: 'EntityBB_duration', fallback: 45 },
        },
        maxStackingCount: { blackboardKey: 'EntityBB_limit', fallback: 5 },
      }),
    );
    const step: ResolvedCombatOperationStep = {
      kind: 'spawnAbilityEntity',
      parameters: {
        abilityEntityId: 'sword',
        dieWhenSourceDies: false,
        blackboardAssignments: {
          EntityBB_duration: { kind: 'constant', value: 12 },
          EntityBB_limit: { kind: 'constant', value: 1 },
        },
      },
    };
    const context = { blackboard: new ActionBlackboard() };

    executor.execute(step, context);
    const first = entities.findOwnerSpawned({ ownerId: 'zhuang-fangyi' })[0]!;
    expect(entities.snapshot(first).remainingDurationSeconds).toBe(12);
    executor.execute(step, context);

    expect(entities.isActive(first)).toBe(false);
    expect(entities.findOwnerSpawned({ ownerId: 'zhuang-fangyi' })).toHaveLength(1);
  });

  it('finishes only the entities created by a dieOnEnd spawn when that action ends', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const executor = new AbilityEntityOperationExecutor(
      'zhuang-fangyi',
      entities,
      { execute: () => false, evaluate: () => false },
      undefined,
      () => ({ lifetime: { kind: 'limited', durationSeconds: 5 } }),
    );
    const step: ResolvedCombatOperationStep = {
      kind: 'spawnAbilityEntity',
      parameters: {
        abilityEntityId: 'mirror',
        dieWhenSourceDies: true,
        finishByAction: true,
      },
    };
    const context = { blackboard: new ActionBlackboard() };

    executor.execute(step, context);
    executor.execute(step, context);
    expect(entities.activeCount).toBe(2);

    executor.end(step, context);
    expect(entities.activeCount).toBe(0);
  });

  it('keeps native query truncation after zero-space distance ordering is erased', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const first = entities.spawn({
      abilityEntityId: 'robot',
      definition: { lifetime: { kind: 'limited', durationSeconds: 10 } },
      ownerId: 'yvonne',
      source: { kind: 'operator', operatorId: 'yvonne' },
    });
    entities.spawn({
      abilityEntityId: 'robot',
      definition: { lifetime: { kind: 'limited', durationSeconds: 10 } },
      ownerId: 'yvonne',
      source: { kind: 'operator', operatorId: 'yvonne' },
    });
    const executor = new AbilityEntityOperationExecutor('yvonne', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();

    executor.execute(
      {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: {
          saveToContextKey: 'robots',
          abilityEntityIds: ['robot'],
          maxTargets: 1,
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );

    expect(targetContext.get('robots')).toEqual([first]);
  });

  it('uses a proven Context operator as the owner of an entity query', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const xaihiBall = entities.spawn({
      abilityEntityId: 'healing-ball',
      definition: { lifetime: { kind: 'limited', durationSeconds: 10 } },
      ownerId: 'xaihi',
      source: { kind: 'operator', operatorId: 'xaihi' },
    });
    entities.spawn({
      abilityEntityId: 'healing-ball',
      definition: { lifetime: { kind: 'limited', durationSeconds: 10 } },
      ownerId: 'party-member',
      source: { kind: 'operator', operatorId: 'party-member' },
    });
    const executor = new AbilityEntityOperationExecutor('party-member', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();
    targetContext.setSingle('seraph', { kind: 'operator', operatorId: 'xaihi' });

    executor.execute(
      {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: {
          saveToContextKey: 'ball',
          ownerContextKey: 'seraph',
          abilityEntityIds: ['healing-ball'],
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );

    expect(targetContext.get('ball')).toEqual([xaihiBall]);
  });

  it('releases the oldest same-template entity when the native stacking group is full', () => {
    const finished: string[] = [];
    const entities = new LogicalAbilityEntityRuntime({
      hooks: { finished: snapshot => finished.push(snapshot.abilityEntityId) },
    });
    const definition = {
      lifetime: { kind: 'limited' as const, durationSeconds: 10 },
      maxStackingCount: 1,
    };
    const first = entities.spawn({
      abilityEntityId: 'robot',
      definition,
      ownerId: 'yvonne',
      source: { kind: 'operator', operatorId: 'yvonne' },
    });
    const second = entities.spawn({
      abilityEntityId: 'robot',
      definition,
      ownerId: 'yvonne',
      source: { kind: 'operator', operatorId: 'yvonne' },
    });

    expect(entities.isActive(first)).toBe(false);
    expect(entities.isActive(second)).toBe(true);
    expect(finished).toEqual(['robot']);
  });

  it('spawns from operands and writes the resulting handle to Context', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const executor = new AbilityEntityOperationExecutor('arcane', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();

    expect(
      executor.execute(
        {
          kind: 'spawnAbilityEntity',
          parameters: {
            abilityEntityId: 'seal',
            definition: {
              lifetime: { kind: 'limited', durationSeconds: 5 },
            },

            target: 'enemy',
            overrideDurationSeconds: { kind: 'blackboard', key: 'duration' },
            saveToContextKey: 'bunshin1',
            dieWhenSourceDies: false,
            blackboardAssignments: {
              EntityBB_wisd_greater_will: { kind: 'blackboard', key: 'will' },
            },
            stringBlackboardAssignments: {
              EntityBB_hitedMark: 'attack1UltHitMark',
            },
          },
        },
        {
          blackboard: new ActionBlackboard({ duration: 40, will: 3 }),
          targetContext,
        },
      ),
    ).toBe(true);

    const [entity] = targetContext.get('bunshin1');
    expect(entity).toBeDefined();
    if (entity === undefined) throw new Error('expected spawned entity context');
    expect(entities.snapshot(entity)).toMatchObject({
      ownerId: 'arcane',
      target: { kind: 'enemy' },
      remainingDurationSeconds: 40,
      blackboard: {
        EntityBB_wisd_greater_will: 3,
        EntityBB_hitedMark: 'attack1UltHitMark',
      },
    });
  });

  it('preserves the current AbilityEntity as a nested spawn target', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const parent = entities.spawn({
      abilityEntityId: 'laser-target',
      definition: { lifetime: { kind: 'limited', durationSeconds: 5 } },
      ownerId: 'arcane',
      source: { kind: 'operator', operatorId: 'arcane' },
    });
    const executor = new AbilityEntityOperationExecutor('arcane', entities, {
      execute: () => false,
      evaluate: () => false,
    });

    expect(
      executor.execute(
        {
          kind: 'spawnAbilityEntity',
          parameters: {
            abilityEntityId: 'laser',
            definition: { lifetime: { kind: 'limited', durationSeconds: 1.5 } },
            target: 'currentAbilityEntity',
            dieWhenSourceDies: false,
          },
        },
        { blackboard: new ActionBlackboard(), currentTarget: parent },
      ),
    ).toBe(true);

    const nested = entities
      .findOwnerSpawned({ ownerId: 'arcane' })
      .find(entity => entities.snapshot(entity).abilityEntityId === 'laser');
    expect(nested).toBeDefined();
    if (nested === undefined) throw new Error('expected nested AbilityEntity');
    expect(entities.snapshot(nested).target).toEqual(parent);

    expect(() =>
      executor.execute(
        {
          kind: 'spawnAbilityEntity',
          parameters: {
            abilityEntityId: 'orphan',
            definition: { lifetime: { kind: 'infinite' } },
            target: 'currentAbilityEntity',
            dieWhenSourceDies: false,
          },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toThrow('requires a current target');
  });

  it('finds all owner-tag matches in zero space and exposes their count', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    entities.spawn({
      abilityEntityId: 'lance',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'avywenna',
      source: { kind: 'operator', operatorId: 'avywenna' },
    });
    entities.spawn({
      abilityEntityId: 'lance',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'other',
      source: { kind: 'operator', operatorId: 'other' },
    });
    const executor = new AbilityEntityOperationExecutor('avywenna', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const blackboard = new ActionBlackboard();
    const targetContext = new RuntimeTargetContext();

    expect(
      executor.execute(
        {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'ComboLances',
            abilityEntityIds: ['lance'],
            saveCountToBlackboardKey: 'ComboLanceCount',
          },
        },
        { blackboard, targetContext },
      ),
    ).toBe(true);

    expect(targetContext.get('ComboLances')).toHaveLength(1);
    expect(blackboard.getNumber('ComboLanceCount')).toBe(1);
    expect(
      executor.evaluate(
        {
          kind: 'contextTargetCountCompare',
          contextKey: 'ComboLances',
          operator: 'greaterOrEqual',
          value: 1,
        },
        { blackboard, targetContext },
      ),
    ).toBe(true);
  });

  it('applies native circular slot ordering in the zero-space projection', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    for (const index of [2, 0, 3, 1]) {
      entities.spawn({
        abilityEntityId: 'place',
        definition: { lifetime: { kind: 'infinite' } },
        ownerId: 'arcane',
        source: { kind: 'operator', operatorId: 'arcane' },
        blackboardAssignments: { EntityBB_index: index },
      });
    }
    const executor = new AbilityEntityOperationExecutor('arcane', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();

    executor.execute(
      {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: {
          saveToContextKey: 'places',
          abilityEntityIds: ['place'],
          circularOrder: {
            indexBlackboardKey: 'EntityBB_index',
            desiredCount: 4,
            reverseFlag: 1,
          },
        },
      },
      { blackboard: new ActionBlackboard(), targetContext },
    );

    expect(
      targetContext
        .get('places')
        .map(target => entities.entityBlackboard(target).getNumber('EntityBB_index')),
    ).toEqual([0, 3, 2, 1]);
  });

  it('clears circular query results on count mismatch and preserves finder order on bad slots', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    for (const index of [1, 1]) {
      entities.spawn({
        abilityEntityId: 'place',
        definition: { lifetime: { kind: 'infinite' } },
        ownerId: 'arcane',
        source: { kind: 'operator', operatorId: 'arcane' },
        blackboardAssignments: { EntityBB_index: index },
      });
    }
    const executor = new AbilityEntityOperationExecutor('arcane', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();
    const execute = (desiredCount: number) =>
      executor.execute(
        {
          kind: 'findOwnerSpawnedAbilityEntities',
          parameters: {
            saveToContextKey: 'places',
            abilityEntityIds: ['place'],
            circularOrder: {
              indexBlackboardKey: 'EntityBB_index',
              desiredCount,
              reverseFlag: -1,
            },
          },
        },
        { blackboard: new ActionBlackboard(), targetContext },
      );

    execute(3);
    expect(targetContext.get('places')).toEqual([]);
    execute(2);
    expect(targetContext.get('places')).toHaveLength(2);
  });

  it('picks one stable Context handle by a blackboard index and overwrites the output group', () => {
    const executor = new AbilityEntityOperationExecutor(
      'zhuang-fangyi',
      new LogicalAbilityEntityRuntime({}),
      { execute: () => false, evaluate: () => false },
    );
    const targetContext = new RuntimeTargetContext();
    targetContext.set('swords', [
      { kind: 'abilityEntity', instanceId: 4 },
      { kind: 'abilityEntity', instanceId: 7 },
    ]);
    targetContext.setSingle('swordInst', { kind: 'enemy' });

    expect(
      executor.execute(
        {
          kind: 'pickContextTarget',
          parameters: {
            sourceContextKey: 'swords',
            saveToContextKey: 'swordInst',
            index: { kind: 'blackboard', key: 'swordIndex' },
          },
        },
        {
          blackboard: new ActionBlackboard({ swordIndex: 1 }),
          targetContext,
        },
      ),
    ).toBe(true);
    expect(targetContext.get('swordInst')).toEqual([{ kind: 'abilityEntity', instanceId: 7 }]);
  });

  it('applies SkillCastIdValidator semantics to owner-spawned queries', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    for (const sourceSkillCastId of [21, 22]) {
      entities.spawn({
        abilityEntityId: 'seal',
        definition: { lifetime: { kind: 'infinite' } },
        ownerId: 'arcane',
        source: { kind: 'operator', operatorId: 'arcane' },
        sourceSkillCastId,
      });
    }
    const executor = new AbilityEntityOperationExecutor('arcane', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const targetContext = new RuntimeTargetContext();
    const skillCastInfo: CombatSkillCastInfo = {
      skillCastId: 22,
      originSkillId: 'comboSkill',
      originSkillType: 'comboSkill',
      nonReturnedSpCost: 0,
    };

    executor.execute(
      {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: {
          saveToContextKey: 'seals',
          abilityEntityIds: ['seal'],
          sameSourceSkillCast: true,
        },
      },
      { blackboard: new ActionBlackboard(), targetContext, skillCastInfo },
    );

    const [matched] = targetContext.get('seals');
    expect(matched).toBeDefined();
    if (matched === undefined) throw new Error('expected same-cast entity');
    expect(entities.snapshot(matched).sourceSkillCastId).toBe(22);
  });

  it('reads finite remaining duration from the current iterated entity', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const entity = entities.spawn({
      abilityEntityId: 'water',
      definition: { lifetime: { kind: 'limited', durationSeconds: 12 } },
      ownerId: 'tangtang',
      source: { kind: 'operator', operatorId: 'tangtang' },
    });
    const executor = new AbilityEntityOperationExecutor('tangtang', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const blackboard = new ActionBlackboard();

    expect(
      executor.execute(
        {
          kind: 'readAbilityEntityRemainingDuration',
          parameters: { outputKey: 'water_duration' },
        },
        { blackboard, currentTarget: entity },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('water_duration')).toBe(12);
    expect(
      executor.evaluate(
        {
          kind: 'abilityEntityRemainingDurationCompare',
          operator: 'less',
          value: { kind: 'constant', value: 13 },
          outputKey: 'remaining_before_compare',
        },
        { blackboard, currentTarget: entity },
      ),
    ).toBe(true);
    expect(blackboard.getNumber('remaining_before_compare')).toBe(12);

    expect(
      executor.execute(
        {
          kind: 'setAbilityEntityRemainingDuration',
          parameters: { value: { kind: 'constant', value: 30 } },
        },
        { blackboard, currentTarget: entity },
      ),
    ).toBe(true);
    expect(entities.snapshot(entity).remainingDurationSeconds).toBe(30);

    expect(
      executor.execute(
        { kind: 'finishCurrentAbilityEntity', parameters: {} },
        { blackboard, currentTarget: entity },
      ),
    ).toBe(true);
    expect(entities.activeCount).toBe(1);
    expect(entities.snapshot(entity).isAlive).toBe(false);
    entities.advanceFrame();
    expect(entities.activeCount).toBe(0);
  });

  it('advances an embedded child timeline with the entity local clock', () => {
    const entities = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 1 / 60,
    });
    const execute = vi.fn(
      (_step: ResolvedCombatOperationStep, _context?: CombatOperationContext) => true,
    );
    const rootOperations = { execute, evaluate: () => false };
    const executor = new AbilityEntityOperationExecutor('fixture', entities, rootOperations, {
      resolveOperations: () => rootOperations,
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'child-host',
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 10 },
            childSkill: {
              skillId: 'child-skill',
              initialBlackboard: { local: 3 },
              timelineActions: [
                {
                  startFrame: 2,
                  sequence: {
                    steps: [
                      {
                        kind: 'modifyActionValue',
                        parameters: {
                          key: 'result',
                          operation: 'assign',
                          value: { kind: 'blackboard', key: 'inherited' },
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          dieWhenSourceDies: false,
          inheritActionBlackboard: true,
          blackboardAssignments: { inherited: { kind: 'constant', value: 7 } },
        },
      },
      { blackboard: new ActionBlackboard({ inheritedParent: 11 }) },
    );

    entities.advanceFrame();
    entities.advanceFrame();
    entities.advanceFrame();
    expect(execute).not.toHaveBeenCalled();
    entities.advanceFrame();

    expect(execute).toHaveBeenCalledTimes(1);
    const operationContext = execute.mock.calls[0]?.[1];
    expect(operationContext?.blackboard.getNumber('local')).toBe(3);
    expect(operationContext?.blackboard.getNumber('inherited')).toBe(7);
    expect(operationContext?.blackboard.getNumber('inheritedParent')).toBe(11);
  });

  it('selects the named child skill bound by the spawn action', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const execute = vi.fn(() => true);
    const rootOperations = { execute, evaluate: () => false };
    const executor = new AbilityEntityOperationExecutor('fixture', entities, rootOperations, {
      resolveOperations: () => rootOperations,
    });
    const child = (skillId: string, flag: string) => ({
      skillId,
      initialBlackboard: {},
      timelineActions: [
        {
          startFrame: 0,
          sequence: {
            steps: [
              {
                kind: 'setContextFlag' as const,
                parameters: { flag, value: true, target: 'caster' as const },
              },
            ],
          },
        },
      ],
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'multi-child-host',
          childSkillId: 'child-b',
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 10 },
            childSkills: {
              'child-a': child('child-a', 'wrong-child'),
              'child-b': child('child-b', 'selected-child'),
            },
          },
          dieWhenSourceDies: false,
        },
      },
      { blackboard: new ActionBlackboard() },
    );

    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        parameters: expect.objectContaining({ flag: 'selected-child' }),
      }),
      expect.anything(),
    );
    expect(entities.snapshot(entities.findAll()[0]!).childSkillId).toBe('child-b');
  });

  it('applies child-skill timeline jumps on the ability entity local clock', () => {
    const entities = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 1 / 60,
    });
    const execute = vi.fn(
      (_step: ResolvedCombatOperationStep, _context?: CombatOperationContext) => true,
    );
    const delegate = { execute, evaluate: () => true };
    let executor!: AbilityEntityOperationExecutor;
    executor = new AbilityEntityOperationExecutor('fixture', entities, delegate, {
      resolveOperations: () => executor,
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'jump-host',
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 10 },
            childSkill: {
              skillId: 'jump-child',
              initialBlackboard: {},
              timelineActions: [
                {
                  startFrame: 1,
                  endFrame: 2,
                  sequence: {
                    steps: [{ kind: 'jumpTimeline', parameters: { destinationFrame: 5 } }],
                  },
                },
                {
                  startFrame: 3,
                  sequence: {
                    steps: [
                      {
                        kind: 'setContextFlag',
                        parameters: { flag: 'skipped', value: true, target: 'caster' },
                      },
                    ],
                  },
                },
                {
                  startFrame: 5,
                  sequence: {
                    steps: [
                      {
                        kind: 'setContextFlag',
                        parameters: { flag: 'destination', value: true, target: 'caster' },
                      },
                    ],
                  },
                },
              ],
            },
          },

          dieWhenSourceDies: false,
        },
      },
      { blackboard: new ActionBlackboard() },
    );

    entities.advanceFrame();
    entities.advanceFrame();
    expect(execute).not.toHaveBeenCalled();

    entities.advanceFrame();
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'setContextFlag',
        parameters: expect.objectContaining({ flag: 'destination' }),
      }),
      expect.anything(),
    );
  });

  it('lets an ability-entity child skill finish its own local timeline', () => {
    const entities = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: () => 1 / 30,
    });
    const execute = vi.fn(
      (_step: ResolvedCombatOperationStep, _context?: CombatOperationContext) => true,
    );
    const delegate = { execute, evaluate: () => true };
    let executor!: AbilityEntityOperationExecutor;
    executor = new AbilityEntityOperationExecutor('fixture', entities, delegate, {
      resolveOperations: () => executor,
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'finish-host',
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 10 },
            childSkill: {
              skillId: 'finish-child',
              initialBlackboard: {},
              timelineActions: [
                {
                  startFrame: 1,
                  sequence: { steps: [{ kind: 'finishTimeline', parameters: {} }] },
                },
                {
                  startFrame: 2,
                  sequence: {
                    steps: [
                      {
                        kind: 'setContextFlag',
                        parameters: { flag: 'must-not-run', value: true, target: 'caster' },
                      },
                    ],
                  },
                },
              ],
            },
          },
          dieWhenSourceDies: false,
        },
      },
      { blackboard: new ActionBlackboard() },
    );

    entities.advanceFrame();
    entities.advanceFrame();
    expect(execute).not.toHaveBeenCalled();
  });

  it('allows an embedded child timeline to finish its own host entity', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const delegate = { execute: () => false, evaluate: () => false };
    let executor!: AbilityEntityOperationExecutor;
    executor = new AbilityEntityOperationExecutor('fixture', entities, delegate, {
      resolveOperations: () => executor,
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          abilityEntityId: 'self-finishing-host',
          definition: {
            lifetime: { kind: 'limited', durationSeconds: 10 },
            childSkill: {
              skillId: 'self-finishing-skill',
              initialBlackboard: {},
              timelineActions: [
                {
                  startFrame: 1,
                  sequence: {
                    steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }],
                  },
                },
              ],
            },
          },

          dieWhenSourceDies: false,
          inheritActionBlackboard: false,
        },
      },
      { blackboard: new ActionBlackboard() },
    );

    expect(entities.activeCount).toBe(1);
    entities.advanceFrame();
    expect(entities.activeCount).toBe(1);
    expect(entities.snapshot(entities.findAll()[0]!).isAlive).toBe(false);
    entities.advanceFrame();
    expect(entities.activeCount).toBe(0);
  });

  it('starts a hidden child timeline on an existing iterated entity', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const entity = entities.spawn({
      abilityEntityId: 'seal',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'arcane',
      source: { kind: 'operator', operatorId: 'arcane' },
    });
    const execute = vi.fn(() => true);
    let executor!: AbilityEntityOperationExecutor;
    executor = new AbilityEntityOperationExecutor(
      'arcane',
      entities,
      { execute, evaluate: () => false },
      { resolveOperations: () => executor },
    );

    expect(
      executor.execute(
        {
          kind: 'startCurrentAbilityEntityChildSkill',
          parameters: {
            childSkill: {
              skillId: 'seal-end',
              initialBlackboard: {},
              timelineActions: [
                {
                  startFrame: 1,
                  sequence: {
                    steps: [
                      {
                        kind: 'setContextFlag',
                        parameters: { flag: 'hidden-child', value: true, target: 'caster' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        { blackboard: new ActionBlackboard(), currentTarget: entity },
      ),
    ).toBe(true);
    expect(execute).not.toHaveBeenCalled();

    entities.advanceFrame();

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({ kind: 'setContextFlag' }),
      expect.objectContaining({ currentTarget: entity }),
    );
  });

  it('keeps a source-death monitor alive until its recorded source dies', () => {
    const entities = new LogicalAbilityEntityRuntime({});
    const executor = new AbilityEntityOperationExecutor('gilberta', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const source = { kind: 'operator' as const, operatorId: 'gilberta' };
    const entity = entities.spawn({
      abilityEntityId: 'source-monitor',
      definition: { lifetime: { kind: 'infinite' } },
      ownerId: 'gilberta',
      source,
      dieWhenSourceDies: false,
    });
    const step = { kind: 'finishCurrentAbilityEntityWhenSourceDies' as const, parameters: {} };
    const context = { blackboard: new ActionBlackboard(), currentTarget: entity };

    expect(executor.execute(step, context)).toBe(true);
    expect(entities.activeCount).toBe(1);
    expect(entities.notifySourceDied(source)).toBe(0);
    expect(executor.execute(step, context)).toBe(true);
    expect(entities.snapshot(entity).isAlive).toBe(false);
    entities.advanceFrame();
    expect(entities.activeCount).toBe(0);
  });
});
