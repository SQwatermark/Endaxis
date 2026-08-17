import { describe, expect, it, vi } from 'vitest';
import { gameplayTagId } from '../tags/gameplayTags';
import { ActionBlackboard } from './actionBlackboard';
import { AbilityEntityOperationExecutor } from './abilityEntityOperationExecutor';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatOperationContext } from './skillRuntime';

describe('AbilityEntityOperationExecutor', () => {
  it('spawns from operands and writes the resulting handle to Context', () => {
    const entities = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'seal',
          bornTagIds: [gameplayTagId(1)],
          lifetime: { kind: 'limited', durationSeconds: 5 },
          maxStackingCount: 4,
        },
      ],
    });
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
            templateId: 'seal',
            childSkillId: 'seal_skill',
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
      childSkillId: 'seal_skill',
      remainingDurationSeconds: 40,
      blackboard: { EntityBB_wisd_greater_will: 3 },
    });
  });

  it('finds all owner-tag matches in zero space and exposes their count', () => {
    const entities = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'lance',
          bornTagIds: [gameplayTagId(1447025331)],
          lifetime: { kind: 'infinite' },
          maxStackingCount: -1,
        },
      ],
    });
    entities.spawn({
      templateId: 'lance',
      ownerId: 'avywenna',
      source: { kind: 'operator', operatorId: 'avywenna' },
    });
    entities.spawn({
      templateId: 'lance',
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
            tagQuery: { type: 'hasAny', tagIds: [1447025331] },
            saveCountToBlackboardKey: 'ComboLanceCount',
          },
        },
        { blackboard, targetContext },
      ),
    ).toBe(true);

    expect(targetContext.get('ComboLances')).toHaveLength(1);
    expect(blackboard.getNumber('ComboLanceCount')).toBe(1);
  });

  it('reads finite remaining duration from the current iterated entity', () => {
    const entities = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'water',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 12 },
          maxStackingCount: -1,
        },
      ],
    });
    const entity = entities.spawn({
      templateId: 'water',
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
      templates: [
        {
          id: 'child-host',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 10 },
          maxStackingCount: -1,
        },
      ],
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
          templateId: 'child-host',
          childSkillId: 'child-skill',
          dieWhenSourceDies: false,
          inheritActionBlackboard: true,
          blackboardAssignments: { inherited: { kind: 'constant', value: 7 } },
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

  it('allows an embedded child timeline to finish its own host entity', () => {
    const entities = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'self-finishing-host',
          bornTagIds: [],
          lifetime: { kind: 'limited', durationSeconds: 10 },
          maxStackingCount: -1,
        },
      ],
    });
    const delegate = { execute: () => false, evaluate: () => false };
    let executor!: AbilityEntityOperationExecutor;
    executor = new AbilityEntityOperationExecutor('fixture', entities, delegate, {
      resolveOperations: () => executor,
    });

    executor.execute(
      {
        kind: 'spawnAbilityEntity',
        parameters: {
          templateId: 'self-finishing-host',
          childSkillId: 'self-finishing-skill',
          dieWhenSourceDies: false,
          inheritActionBlackboard: false,
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
      },
      { blackboard: new ActionBlackboard() },
    );

    expect(entities.activeCount).toBe(1);
    entities.advanceFrame();
    expect(entities.activeCount).toBe(0);
  });

  it('keeps a source-death monitor alive until its recorded source dies', () => {
    const entities = new LogicalAbilityEntityRuntime({
      templates: [
        {
          id: 'source-monitor',
          bornTagIds: [],
          lifetime: { kind: 'infinite' },
          maxStackingCount: -1,
        },
      ],
    });
    const executor = new AbilityEntityOperationExecutor('gilberta', entities, {
      execute: () => false,
      evaluate: () => false,
    });
    const source = { kind: 'operator' as const, operatorId: 'gilberta' };
    const entity = entities.spawn({
      templateId: 'source-monitor',
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
