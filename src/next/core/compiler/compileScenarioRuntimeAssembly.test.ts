import { describe, expect, it, vi } from 'vitest';
import {
  CombatRuntimeAssembly,
  type CombatOperationExecutorContext,
  type EnemyBuffRuntime,
} from '../combat/runtime/combatRuntimeAssembly';
import type { CombatOperationExecutor } from '../combat/runtime/skillRuntime';
import { createEmptyScenario } from '../project/createProject';
import type { ScenarioDocument } from '../project/schema';
import { perlica } from '../../data/operators/perlica';
import type { WeaponDefinition } from '../game-data/equipmentDefinition';
import { placeSkillGroup } from '../../ui/timeline/placeSkillGroup';
import {
  compileScenarioRuntimeAssembly,
  type CompileScenarioRuntimeAssemblyOptions,
} from './compileScenarioRuntimeAssembly';

function createScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:assembly', '运行时装配样本');
  scenario.builds.operators.perlica = {
    id: 'perlica',
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  };
  scenario.tracks[0] = {
    operatorBuildId: 'perlica',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 20 },
    skillCasts: [],
  };
  scenario.battle.resourceRules = {
    maxSp: 300,
    initialSp: 120,
    spRecoveryPerSecond: 10,
    defaultSkillSpCost: 100,
  };
  return scenario;
}

function enemyBuffRuntime(): EnemyBuffRuntime {
  return {
    ownerId: 'enemy',
    advanceFrame: () => undefined,
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
    index: {
      getOperator: slug => (slug === perlica.slug ? perlica : null),
      getWeapon: () => null,
      getGear: () => null,
      getGearSet: () => null,
    },
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
    },
    environment: {
      enemyBuffRuntime: enemyBuffRuntime(),
      createOperationExecutor: () => operationExecutor(),
    },
  };
}

describe('compileScenarioRuntimeAssembly', () => {
  it('combines existing timeline and resource compilers into executable assembly options', () => {
    const settings = options();
    const compiled = compileScenarioRuntimeAssembly(createScenario(), settings);

    expect(compiled.resources.sp).toBe(120);
    expect(compiled.enemy).toMatchObject({
      source: { kind: 'custom', level: 90 },
      health: 100000,
      defenderAttributes: {
        defense: 100,
        breakingAttackDamageTakenMultiplier: 1,
      },
    });
    expect(compiled.resources.squad[0]).toMatchObject({
      operatorId: 'perlica',
      ultimateEnergy: 20,
      maxUltimateEnergy: 80,
    });
    expect(compiled.operators).toHaveLength(1);
    expect(compiled.operators[0]!.operatorId).toBe('perlica');
    expect(compiled.operators[0]!.panel).toMatchObject({
      operatorId: 'perlica',
      attack: 706,
      health: 5950,
      defense: 0,
    });
    expect(compiled.inputs).toEqual([]);
    expect(compiled.enemyBuffRuntime).toBe(settings.environment.enemyBuffRuntime);
    expect(compiled.createOperationExecutor).toBe(settings.environment.createOperationExecutor);
    expect(() => new CombatRuntimeAssembly(compiled)).not.toThrow();
  });

  it('delivers compiled equipment contributions to the runtime operation executor', () => {
    const scenario = createScenario();
    const weapon: WeaponDefinition = {
      slug: 'runtime-weapon',
      rarity: 6,
      weaponType: perlica.weaponType,
      baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
      traits: [
        {
          key: 'main-attribute',
          levelCount: 1,
          modifiers: [{ kind: 'attribute', attribute: 'main', operation: 'flat', value: 12 }],
        },
      ],
    };
    scenario.builds.weapons.weapon = {
      id: 'weapon',
      weaponSlug: weapon.slug,
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [1],
    };
    scenario.tracks[0]!.weaponBuildId = 'weapon';
    // 执行器只在有技能实例时构造；放置一个技能让装备贡献能到达运行时装订层。
    let nextId = 0;
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 60,
      ids: { allocate: kind => `${kind}:${++nextId}` },
    }).scenario;
    const settings = options();
    const createOperationExecutor = vi.fn((_context: CombatOperationExecutorContext) =>
      operationExecutor(),
    );
    const compiled = compileScenarioRuntimeAssembly(placed, {
      ...settings,
      index: {
        ...settings.index,
        getWeapon: slug => (slug === weapon.slug ? weapon : null),
      },
      environment: { ...settings.environment, createOperationExecutor },
    });

    new CombatRuntimeAssembly(compiled);

    expect(compiled.operators[0]!.equipmentContributions).toHaveLength(1);
    expect(createOperationExecutor).toHaveBeenCalled();
    expect(createOperationExecutor.mock.calls[0]![0].enemy).toBe(compiled.enemy);
    expect(
      createOperationExecutor.mock.calls[0]![0].equipmentContributions[0]!.modifiers[0],
    ).toEqual({
      kind: 'attribute',
      attribute: perlica.mainAttribute,
      operation: 'flat',
      value: 12,
    });
    expect(createOperationExecutor.mock.calls[0]![0].panel).toBe(compiled.operators[0]!.panel);
  });

  it('does not require empty runtime binding records', () => {
    const settings = options();
    expect(() => compileScenarioRuntimeAssembly(createScenario(), settings)).not.toThrow();
  });

  it('fails when runtime bindings reference an inactive operator', () => {
    const settings = options();

    expect(() =>
      compileScenarioRuntimeAssembly(createScenario(), {
        ...settings,
        operatorRuntimeBindings: new Map([
          ['perlica', {}],
          ['inactive', {}],
        ]),
      }),
    ).toThrow("runtime bindings reference inactive operator build 'inactive'");
  });

  it('propagates child compiler failures instead of supplying missing rules', () => {
    const settings = options();
    const getOperator = vi.fn(() => null);

    expect(() =>
      compileScenarioRuntimeAssembly(createScenario(), {
        ...settings,
        index: { ...settings.index, getOperator },
      }),
    ).toThrow(`operator definition '${perlica.slug}' does not exist`);
    expect(getOperator).toHaveBeenCalledWith(perlica.slug);

    const invalidInitialEnergy = createScenario();
    invalidInitialEnergy.tracks[0]!.initialState.ultimateEnergy = 81;
    expect(() => compileScenarioRuntimeAssembly(invalidInitialEnergy, settings)).toThrow(
      'scenario.tracks[0].initialState.ultimateEnergy exceeds its maximum',
    );
  });
});
