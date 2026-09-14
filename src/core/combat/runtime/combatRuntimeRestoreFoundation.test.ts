import { expect, it } from 'vitest';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { createAbilitySystemState } from './abilitySystemState';
import { prepareCombatRuntimeRestore } from './combatRuntimeRestorePreparation';
import { bindRestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import { CombatSharedRuntime } from './combatSharedRuntime';
import { CombatSkillPrograms } from './combatSkillPrograms';
import type { CombatStateGraph } from './combatStateGraph';
import { CombatVitals } from './combatVitals';
import { createGlobalBuffState } from './globalBuffState';
import { createProjectileLifecycleState } from './projectileLifecycleState';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';
import { createTimedMarkerState } from './timedMarkers';
import { bindRestoredCombatAbilityEntityDirectory } from './combatRuntimeAbilityEntityRestoration';
import { bindRestoredCombatBuffInstances } from './combatRuntimeBuffInstanceRestoration';
import { bindRestoredCombatRuntimeOperators } from './combatRuntimeOperatorRestoration';

const resources = {
  sp: 0,
  maxSp: 300,
  returnedSp: 0,
  sharedSpGain: { baseGainEfficiency: 1 },
  spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
  ultimateEnergySystemUnlocked: false,
  normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
  squad: [
    {
      operatorId: 'operator',
      ultimateEnergy: 0,
      maxUltimateEnergy: 100,
      ultimateEnergyGainMultiplier: 1,
      allowedUltimateEnergyRecoveryTags: null,
    },
  ],
};

const environmentInput = {
  criticalSamples: { nextCriticalSample: () => 1 },
  resolveNonRandomRuntimeSnapshot: () => ({
    runtimeExtensionMultiplier: 1,
    appliesIgniteDamageMultiplier: false,
    appliesPhysicalInflictionDamageMultiplier: false,
  }),
};

const enemy = {
  source: { kind: 'custom' as const, level: 90 },
  rank: 'mob' as const,
  health: 1000,
  superArmor: 100,
  defenderAttributes: {
    defense: 0,
    shelterDamageMultiplier: 0,
    breakingAttackDamageTakenMultiplier: 1,
    resistances: Object.fromEntries(
      ['physical', 'heat', 'electric', 'cryo', 'nature', 'ether'].map(element => [
        element,
        { percent: 0, damageTakenMultiplier: 1 },
      ]),
    ) as Record<
      'physical' | 'heat' | 'electric' | 'cryo' | 'nature' | 'ether',
      { percent: number; damageTakenMultiplier: number }
    >,
  },
  stagger: {
    maximum: 100,
    knotThresholds: [0.5],
    knotBreakDurationFrames: 30,
    brokenDurationFrames: 300,
    finisherSpRecovery: 100,
  },
};

it('整场恢复基础阶段直接绑定共享账本、环境和全部基础 Buff 外壳', () => {
  const originalShared = new CombatSharedRuntime({ resources, operatorOrder: ['operator'] });
  const originalEnvironment = new StandardPlayerDamageEnvironment({
    ...environmentInput,
    enemyVitals: new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    }),
  });
  const originalOperatorBuffs =
    originalEnvironment.runtimeOptions.createOperatorBuffRuntime!('operator');
  const saved = structuredClone({
    shared: originalShared.runtimeState,
    environment: originalEnvironment.runtimeState,
    enemyBuffs: originalEnvironment.runtimeOptions.enemyBuffRuntime.runtimeState!,
    operatorBuffs: originalOperatorBuffs.runtimeState!,
    semanticEvents: new CombatSemanticEventRuntime().runtimeState,
  });
  const graph: CombatStateGraph = {
    shared: saved.shared,
    environment: saved.environment,
    events: { native: new Map(), semantic: saved.semanticEvents },
    operators: new Map([
      [
        'operator',
        {
          blackboard: saved.operatorBuffs.entityBlackboard,
          ability: createAbilitySystemState(),
          skills: new Map(),
          passives: new Map(),
          equipment: null,
          initializations: new Map(),
          upgradeEvents: null,
          cooldowns: new Map(),
          statuses: null,
          timedMarkers: createTimedMarkerState(),
          buffs: saved.operatorBuffs,
        },
      ],
    ]),
    enemy: {
      statuses: null,
      timedMarkers: createTimedMarkerState(),
      buffs: saved.enemyBuffs,
    },
    instances: {
      abilityEntities: { instances: new Map(), deadSources: [] },
      projectiles: createProjectileLifecycleState(),
      globalBuffs: createGlobalBuffState(),
    },
  };
  const preparation = prepareCombatRuntimeRestore(
    graph,
    [{ operatorId: 'operator', skills: [] }],
    new CombatSkillPrograms(),
  );

  const restored = bindRestoredCombatRuntimeFoundation({
    preparation,
    shared: { resources },
    environment: environmentInput,
    enemy,
    resolveProjectileRuntimeDependencies: () => {
      throw new Error('fixture does not launch projectiles');
    },
  });

  expect(restored.shared.runtimeState).toBe(saved.shared);
  expect(restored.shared.clock.runtimeState).toBe(saved.shared.clock);
  expect(restored.environment.runtimeState).toBe(saved.environment);
  expect(restored.semanticEvents.runtimeState).toBe(saved.semanticEvents);
  expect(restored.environment.runtimeOptions.enemyBuffRuntime.runtimeState).toBe(saved.enemyBuffs);
  expect(restored.enemyBuffTarget).toBe(restored.environment.runtimeOptions.enemyBuffRuntime);
  expect(restored.operatorBuffTargets.get('operator')!.runtimeState).toBe(saved.operatorBuffs);
  expect(restored.operatorBuffTargets.get('operator')!.entityBlackboard!.runtimeState).toBe(
    graph.operators.get('operator')!.blackboard,
  );
  const entities = bindRestoredCombatAbilityEntityDirectory({
    preparation,
    foundation: restored,
  });
  expect(entities.runtime.runtimeState).toBe(graph.instances.abilityEntities);
  expect([...entities.targets.keys()]).toEqual(['enemy', 'operator']);
  const buffs = bindRestoredCombatBuffInstances({
    preparation,
    foundation: restored,
    entities,
    resolveDefinition: () => undefined,
    resolveGlobalDefinition: () => undefined,
  });
  expect(buffs.globalBuffs.runtimeState).toBe(graph.instances.globalBuffs);
  const operators = bindRestoredCombatRuntimeOperators({
    preparation,
    foundation: restored,
    entities,
    createCoreBindings: () => ({
      createSkillDependencies: () => {
        throw new Error('fixture has no skills');
      },
      abilityRuntime: {},
    }),
    createSourceBindings: () => ({
      createEquipmentExecutor: () => ({ execute: () => true, evaluate: () => true }),
      createInitializationOperations: () => ({ execute: () => true, evaluate: () => true }),
      createPassiveOperations: () => ({ execute: () => true, evaluate: () => true }),
      registerPassive: () => {
        throw new Error('fixture has no passive responses');
      },
      createUpgradeExecutor: () => ({ execute: () => true, evaluate: () => true }),
    }),
  });
  expect(operators.cores.get('operator')!.blackboard.runtimeState).toBe(
    graph.operators.get('operator')!.blackboard,
  );
  expect(operators.programs.get('operator')!.buffRuntime).toBe(
    restored.operatorBuffTargets.get('operator'),
  );
  operators.bindRestoredChildren();
  buffs.restoration.bindRelations();
  operators.disposeSources();
});
