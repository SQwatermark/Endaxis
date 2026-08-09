import { describe, expect, it, vi } from 'vitest';
import type { BuffOperationTarget } from '../core/combat/runtime/buffOperationExecutor';
import type { CombatOperationExecutor } from '../core/combat/runtime/skillRuntime';
import type { CompileScenarioRuntimeAssemblyOptions } from '../core/compiler/compileScenarioRuntimeAssembly';
import { createEmptyScenario } from '../core/project/createProject';
import type { ScenarioDocument } from '../core/project/schema';
import { runScenarioSimulation } from './runScenarioSimulation';

function createScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:application', '应用层模拟样本');
  scenario.battle.resourceRules = {
    maxSp: 300,
    initialSp: 0,
    spRecoveryPerSecond: 30,
    defaultSkillSpCost: 100,
  };
  return scenario;
}

function enemyBuffs(): BuffOperationTarget {
  return {
    ownerId: 'enemy',
    getCountByIds: () => 0,
    findFirstByIds: () => undefined,
    finishByIds: () => 0,
    holdByIds: () => ({ release() {} }),
    getCountByTags: () => 0,
    matchesEntityTags: () => false,
    findFirstByTags: () => undefined,
    finishByTags: () => 0,
  };
}

function operationExecutor(): CombatOperationExecutor {
  return {
    execute: () => true,
    evaluate: () => true,
  };
}

function options(): CompileScenarioRuntimeAssemblyOptions {
  return {
    catalog: { getOperator: () => null },
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
      operators: new Map(),
    },
    environment: {
      enemyBuffs: enemyBuffs(),
      createOperationExecutor: () => operationExecutor(),
    },
  };
}

describe('runScenarioSimulation', () => {
  it('compiles a scenario, advances to the exact end frame, and returns immutable receipts', () => {
    const result = runScenarioSimulation({
      scenario: createScenario(),
      options: options(),
      endFrame: 3,
    });

    expect(result.frame).toBe(3);
    expect(result.receiptEntries).toHaveLength(3);
    expect(result.receiptEntries.map(entry => entry.frame)).toEqual([1, 2, 3]);
    expect(result.receiptEntries.at(-1)).toMatchObject({
      event: 'SpChanged',
      data: { currentValue: 3 },
    });
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.receiptEntries)).toBe(true);
    expect(Object.isFrozen(result.receiptEntries[0])).toBe(true);
    expect(Object.isFrozen(result.receiptEntries[0]!.data)).toBe(true);
  });

  it.each([-1, 1.5, Number.NaN])('rejects invalid endFrame %s before compilation', endFrame => {
    const settings = options();
    const getOperator = vi.fn(settings.catalog.getOperator);

    expect(() =>
      runScenarioSimulation({
        scenario: createScenario(),
        options: { ...settings, catalog: { getOperator } },
        endFrame,
      }),
    ).toThrow('endFrame must be a non-negative integer');
    expect(getOperator).not.toHaveBeenCalled();
  });

  it('rejects an end frame beyond the scenario duration', () => {
    const scenario = createScenario();
    scenario.battle.durationFrames = 2;

    expect(() => runScenarioSimulation({ scenario, options: options(), endFrame: 3 })).toThrow(
      'must not exceed scenario battle duration',
    );
  });

  it('supports frame zero without advancing the runtime', () => {
    const result = runScenarioSimulation({
      scenario: createScenario(),
      options: options(),
      endFrame: 0,
    });

    expect(result).toEqual({ frame: 0, receiptEntries: [] });
  });
});
