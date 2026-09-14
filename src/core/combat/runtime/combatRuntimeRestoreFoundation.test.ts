import { expect, it, vi } from 'vitest';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { createAbilitySystemState } from './abilitySystemState';
import { CombatSharedRuntime } from './combatSharedRuntime';
import { CombatSkillPrograms } from './combatSkillPrograms';
import type { CombatStateGraph } from './combatStateGraph';
import { CombatVitals } from './combatVitals';
import { createGlobalBuffState } from './globalBuffState';
import { createProjectileLifecycleState } from './projectileLifecycleState';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';
import { createTimedMarkerState } from './timedMarkers';
import { ProjectileCallbackPrograms } from './projectileCallbackPrograms';
import { AbilityEntityChildSkillPrograms } from './abilityEntityChildSkillPrograms';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import { createBuffContainerState } from '../buffs/buffContainerState';
import { logicalAbilityEntityRuntimeId } from '../../game-data/logicalAbilityEntity';
import type { AbilityEntityBuffRuntime } from './combatRuntimeAssembly';
import { restoreCombatRuntime } from './combatRuntimeRestoration';

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
  const originalEntities = new LogicalAbilityEntityRuntime({});
  const entityTarget = originalEntities.spawn({
    abilityEntityId: 'summon',
    definition: { lifetime: { kind: 'limited', durationSeconds: 10 } },
    ownerId: 'operator',
    source: { kind: 'operator', operatorId: 'operator' },
  });
  if (entityTarget.kind !== 'abilityEntity') throw new Error('fixture entity was not created');
  const entityState = originalEntities.runtimeState.instances.get(entityTarget.instanceId)!;
  entityState.buffContainerCreated = true;
  entityState.buffs = createBuffContainerState(undefined, entityState.blackboard);
  graph.instances.abilityEntities.instances.set(entityTarget.instanceId, entityState);
  const program = {
    operatorId: 'operator',
    skills: [],
    abilityEntityDefinitions: {
      summon: { lifetime: { kind: 'limited' as const, durationSeconds: 10 } },
    },
  };
  const candidate = restoreCombatRuntime({
    graph,
    programs: [program],
    fixedSkillPrograms: new CombatSkillPrograms(),
    foundation: {
      shared: { resources },
      environment: environmentInput,
      enemy,
      resolveProjectileRuntimeDependencies: () => {
        throw new Error('fixture does not launch projectiles');
      },
    },
    objects: {
      callbackPrograms: new ProjectileCallbackPrograms(),
      buffs: {
        resolveDefinition: () => undefined,
        resolveGlobalDefinition: () => undefined,
      },
      operators: {
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
      },
      abilityEntityRelations: {
        childSkillPrograms: new AbilityEntityChildSkillPrograms(),
        createPassiveOperations: () => {
          throw new Error('fixture has no AbilityEntity passives');
        },
        registerPassive: () => {
          throw new Error('fixture has no AbilityEntity passive responses');
        },
        createChildSkillBindings: () => {
          throw new Error('fixture has no AbilityEntity child skills');
        },
      },
      createProjectileCallbackBindings: () => {
        throw new Error('fixture has no projectile callbacks');
      },
    },
  });
  const { foundation: restored, entities, objects, frame } = candidate;
  expect(candidate.enemyTimedMarkers.runtimeState).toBe(graph.enemy.timedMarkers);

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
  expect(entities.runtime.runtimeState).toBe(graph.instances.abilityEntities);
  expect([...entities.targets.keys()]).toEqual([
    'enemy',
    'operator',
    logicalAbilityEntityRuntimeId(entityTarget.instanceId),
  ]);
  const entityBuffs = entities.targets.get(
    logicalAbilityEntityRuntimeId(entityTarget.instanceId),
  ) as AbilityEntityBuffRuntime;
  const advanceEntityBuffs = vi.spyOn(entityBuffs, 'advanceWithDeltas');
  const releaseEntityBuffs = vi.spyOn(entityBuffs, 'releaseAll');
  expect(objects.buffs.globalBuffs.runtimeState).toBe(graph.instances.globalBuffs);
  expect(objects.projectiles.runtimeState).toBe(graph.instances.projectiles);
  expect(objects.operators.cores.get('operator')!.blackboard.runtimeState).toBe(
    graph.operators.get('operator')!.blackboard,
  );
  expect(objects.operators.programs.get('operator')!.buffRuntime).toBe(
    restored.operatorBuffTargets.get('operator'),
  );
  const previousFrame = restored.shared.clock.frame;
  frame.advanceFrame();
  expect(restored.shared.clock.frame).toBe(previousFrame + 1);
  expect(advanceEntityBuffs).toHaveBeenCalledOnce();
  entities.runtime.finish(entityTarget);
  expect(releaseEntityBuffs).toHaveBeenCalledOnce();
  expect(entities.targets.has(logicalAbilityEntityRuntimeId(entityTarget.instanceId))).toBe(false);
  objects.operators.disposeSources();
  objects.abilityEntityRelations.disposePassives();
});
