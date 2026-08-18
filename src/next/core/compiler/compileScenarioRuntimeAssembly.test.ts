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
  compileOperatorEntityBlackboardInitialValues,
  compileScenarioRuntimeAssembly,
  type CompileScenarioRuntimeAssemblyOptions,
} from './compileScenarioRuntimeAssembly';

function createScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:assembly', '运行时装配样本');

  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
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
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
    environment: {
      enemyBuffRuntime: enemyBuffRuntime(),
      createOperationExecutor: () => operationExecutor(),
    },
  };
}

describe('compileScenarioRuntimeAssembly', () => {
  it('derives entity blackboard values from final deck attributes, including equality', () => {
    const panel = compileScenarioRuntimeAssembly(createScenario(), options()).operators[0]!.panel!;
    const operator = {
      ...perlica,
      entityBlackboardInitializers: [
        {
          key: 'EntityBB_form',
          condition: {
            kind: 'deckAttributeCompare',
            left: 'intellect',
            operator: 'greaterOrEqual',
            right: 'will',
          },
          trueValue: 1,
          falseValue: 0,
        },
      ],
    } as const;

    expect(
      compileOperatorEntityBlackboardInitialValues(operator, {
        ...panel,
        attributes: { ...panel.attributes, intellect: 20, will: 20 },
      }),
    ).toEqual({
      level: panel.level,
      maxHealth: panel.health,
      strength: panel.attributes.strength,
      agility: panel.attributes.agility,
      intellect: 20,
      will: 20,
      EntityBB_form: 1,
    });
    expect(
      compileOperatorEntityBlackboardInitialValues(operator, {
        ...panel,
        attributes: { ...panel.attributes, intellect: 19, will: 20 },
      }),
    ).toEqual({
      level: panel.level,
      maxHealth: panel.health,
      strength: panel.attributes.strength,
      agility: panel.attributes.agility,
      intellect: 19,
      will: 20,
      EntityBB_form: 0,
    });
  });

  it('rejects duplicate entity blackboard initializer keys', () => {
    const panel = compileScenarioRuntimeAssembly(createScenario(), options()).operators[0]!.panel!;
    const initializer = {
      key: 'EntityBB_form',
      condition: {
        kind: 'deckAttributeCompare',
        left: 'intellect',
        operator: 'greaterOrEqual',
        right: 'will',
      },
      trueValue: 1,
      falseValue: 0,
    } as const;

    expect(() =>
      compileOperatorEntityBlackboardInitialValues(
        { ...perlica, entityBlackboardInitializers: [initializer, initializer] },
        panel,
      ),
    ).toThrow("duplicates entity blackboard initializer 'EntityBB_form'");
  });

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
      operatorId: 'track:0',
      ultimateEnergy: 20,
      maxUltimateEnergy: 80,
    });
    expect(compiled.operators).toHaveLength(1);
    expect(compiled.operators[0]!.operatorId).toBe('track:0');
    expect(compiled.operators[0]!.panel).toMatchObject({
      operatorId: 'track:0',
      attack: 706,
      health: 5950,
      defense: 0,
    });
    expect(compiled.inputs).toEqual([]);
    expect(compiled.isOperatorControlled?.('track:0', 0)).toBe(true);
    expect(compiled.isOperatorControlled?.('track:0', 30)).toBe(true);
    expect(compiled.enemyBuffRuntime).toBe(settings.environment.enemyBuffRuntime);
    expect(compiled.createOperationExecutor).toBe(settings.environment.createOperationExecutor);
    expect(() => new CombatRuntimeAssembly(compiled)).not.toThrow();
  });

  it('derives the controlled operator from scenario switch events', () => {
    const scenario = createScenario();
    scenario.tracks[1] = {
      ...scenario.tracks[0]!,
      id: 'track:1',
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    scenario.battle.controlSwitches.push({ id: 'switch:1', frame: 30, trackIndex: 1 });

    const compiled = compileScenarioRuntimeAssembly(scenario, options());

    expect(compiled.isOperatorControlled?.('track:0', 29)).toBe(true);
    expect(compiled.isOperatorControlled?.('track:0', 30)).toBe(false);
    expect(compiled.isOperatorControlled?.('track:1', 30)).toBe(true);
  });

  it('compiles external hit markers to stable operator instances in timeline order', () => {
    const scenario = createScenario();
    scenario.battle.externalEventMarkers = [
      {
        id: 'hit:late',
        frame: 60,
        target: { scope: 'team' },
        event: { kind: 'operatorHit', tags: ['ultimateSkill'], features: ['airborne'] },
      },
      {
        id: 'hit:early',
        frame: 30,
        target: { scope: 'operator', trackIndex: 0 },
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
    ];

    expect(compileScenarioRuntimeAssembly(scenario, options()).externalEvents).toEqual([
      {
        frame: 30,
        targetOperatorIds: ['track:0'],
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
      {
        frame: 60,
        targetOperatorIds: ['track:0'],
        event: { kind: 'operatorHit', tags: ['ultimateSkill'], features: ['airborne'] },
      },
    ]);
  });

  it('rejects external hit markers on empty tracks', () => {
    const scenario = createScenario();
    scenario.battle.externalEventMarkers = [
      {
        id: 'hit:empty',
        frame: 0,
        target: { scope: 'operator', trackIndex: 1 },
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
    ];

    expect(() => compileScenarioRuntimeAssembly(scenario, options())).toThrow(
      "external event marker 'hit:empty' references empty track 1",
    );
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

    scenario.tracks[0]!.weapon = {
      weaponSlug: weapon.slug,
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [1],
    };
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
          ['track:0', {}],
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
