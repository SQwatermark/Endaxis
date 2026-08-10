import { describe, expect, it } from 'vitest';
import { gameplayTagId } from '../combat/tags/gameplayTags';
import { createEmptyScenario } from '../project/createProject';
import type { ScenarioDocument, TrackDocument } from '../project/schema';
import {
  compileScenarioResources,
  type CompileScenarioResourcesOptions,
  type ResolvedOperatorResourceRules,
} from './compileScenarioResources';

function track(operatorId: string | null, ultimateEnergy = 0): TrackDocument {
  return {
    operator:
      operatorId === null
        ? null
        : {
            id: operatorId,
            operatorSlug: operatorId,
            level: 90,
            promoted: true,
            potential: 0,
            trustLevel: 4,
            skillLevels: {},
            talentStates: {},
          },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy },
    skillCasts: [],
  };
}

function scenario(): ScenarioDocument {
  const value = createEmptyScenario('scenario:resources', '资源编译样本');
  value.tracks[0] = track('alpha', 30);
  value.tracks[2] = track('beta', 40);
  value.battle.resourceRules = {
    maxSp: 300,
    initialSp: 120,
    spRecoveryPerSecond: 10,
    defaultSkillSpCost: 100,
  };
  return value;
}

function operatorRules(
  overrides: Partial<ResolvedOperatorResourceRules> = {},
): ResolvedOperatorResourceRules {
  return {
    maxUltimateEnergy: 100,
    ultimateEnergyGainMultiplier: 1,
    allowedUltimateEnergyRecoveryTagIds: null,
    ...overrides,
  };
}

function options(): CompileScenarioResourcesOptions {
  return {
    sharedSpGain: { baseGainEfficiency: 1.25 },
    spRecoveryPauseDuration: 1.5,
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
    operators: new Map([
      ['alpha', operatorRules()],
      [
        'beta',
        operatorRules({
          maxUltimateEnergy: 80,
          ultimateEnergyGainMultiplier: 1.2,
          allowedUltimateEnergyRecoveryTagIds: new Set([gameplayTagId(7)]),
        }),
      ],
    ]),
  };
}

describe('compileScenarioResources', () => {
  it('combines scenario-owned values and explicitly resolved rules in track order', () => {
    const compiled = compileScenarioResources(scenario(), options());

    expect(compiled).toEqual({
      sp: 120,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1.25 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1.5, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      squad: [
        {
          operatorId: 'alpha',
          ultimateEnergy: 30,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          allowedUltimateEnergyRecoveryTagIds: null,
        },
        {
          operatorId: 'beta',
          ultimateEnergy: 40,
          maxUltimateEnergy: 80,
          ultimateEnergyGainMultiplier: 1.2,
          allowedUltimateEnergyRecoveryTagIds: new Set([gameplayTagId(7)]),
        },
      ],
      normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
    });
  });

  it('uses the user maximum override without requiring a resolved maximum', () => {
    const value = scenario();
    value.tracks[0]!.initialState.maxUltimateEnergyOverride = 60;
    const settings = options();
    const operators = new Map(settings.operators);
    operators.set('alpha', operatorRules({ maxUltimateEnergy: undefined }));

    expect(
      compileScenarioResources(value, { ...settings, operators }).squad[0]!.maxUltimateEnergy,
    ).toBe(60);
  });

  it('fails when an operator maximum has neither project nor resolved source', () => {
    const settings = options();
    const operators = new Map(settings.operators);
    operators.set('alpha', operatorRules({ maxUltimateEnergy: undefined }));

    expect(() => compileScenarioResources(scenario(), { ...settings, operators })).toThrow(
      "resolved resource rules for 'alpha' have no maxUltimateEnergy",
    );
  });

  it('fails when resolved rules for an occupied track are missing', () => {
    const settings = options();
    const operators = new Map(settings.operators);
    operators.delete('beta');

    expect(() => compileScenarioResources(scenario(), { ...settings, operators })).toThrow(
      "resolved resource rules for operator instance 'beta' do not exist",
    );
  });

  it('rejects inherited scenarios instead of resetting their runtime resource state', () => {
    const value = scenario();
    value.inheritance = { sourceScenarioId: 'source', boundaryId: 'cycle:1' };

    expect(() => compileScenarioResources(value, options())).toThrow(
      'inherited resource compilation is not connected',
    );
  });

  it('rejects invalid shared SP and ultimate-energy ranges at the compiler boundary', () => {
    const invalidSp = scenario();
    invalidSp.battle.resourceRules.initialSp = 301;
    expect(() => compileScenarioResources(invalidSp, options())).toThrow('initialSp exceeds maxSp');

    const invalidUltimate = scenario();
    invalidUltimate.tracks[2]!.initialState.ultimateEnergy = 81;
    expect(() => compileScenarioResources(invalidUltimate, options())).toThrow(
      'ultimateEnergy exceeds its maximum',
    );
  });

  it('rejects resource state on a track without an operator', () => {
    const value = scenario();
    value.tracks[1] = track(null, 1);

    expect(() => compileScenarioResources(value, options())).toThrow(
      'configures resources without an operator instance',
    );
  });

  it('rejects assigning the same operator build to multiple tracks', () => {
    const value = scenario();
    value.tracks[1] = track('alpha', 0);

    expect(() => compileScenarioResources(value, options())).toThrow(
      "operator instance 'alpha' is assigned to multiple tracks",
    );
  });
});
