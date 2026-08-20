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
      blackboard: { EntityBB_wisd_greater_will: 3 },
    });
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
        },
        { blackboard, currentTarget: entity },
      ),
    ).toBe(true);

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
    expect(entities.activeCount).toBe(0);
  });
});
