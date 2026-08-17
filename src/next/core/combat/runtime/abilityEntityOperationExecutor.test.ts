import { describe, expect, it } from 'vitest';
import { gameplayTagId } from '../tags/gameplayTags';
import { ActionBlackboard } from './actionBlackboard';
import { AbilityEntityOperationExecutor } from './abilityEntityOperationExecutor';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';

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
  });
});
