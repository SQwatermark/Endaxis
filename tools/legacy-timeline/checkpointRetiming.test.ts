import { expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../src/core/project/createProject';
import type { EndaxisProjectDocument, ScenarioDocument } from '../../src/core/project/schema';
import { perlica } from '../../src/data/operators/perlica';
import { commonBuffDefinitions } from '../../src/data/buffs/commonDefinitions';
import { placeSkillGroup } from '../../src/ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from '../../src/application/scenarioSimulationService';
import { CheckpointRetimingSession } from './checkpointRetiming';
import { retimeLegacyProjectBySimulation } from './heuristicRetiming';

function fixture() {
  let scenario = createEmptyScenario('test', 'checkpoint retiming');
  scenario.battle.durationFrames = 500;
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
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  for (const [index, frame] of [10, 11].entries()) {
    scenario = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'plungingAttack',
      startFrame: frame,
      ids: { allocate: () => `legacy:test:track:0:cast:${index}` },
    }).scenario;
  }
  scenario.battle.controlSwitches = [{ id: 'before', frame: 4, trackIndex: 0 }];
  const service = new ScenarioSimulationService({
    index: {
      getOperator: slug => (slug === perlica.slug ? perlica : null),
      getCommonBuffDefinitions: () => commonBuffDefinitions,
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
  });
  return { scenario, service };
}

it('真实技能的截面修复与整场重跑相同，构筑只装配一次', () => {
  const { scenario, service } = fixture();
  const source = {
    scenarioList: [
      {
        id: 'test',
        data: {
          tracks: [{ actions: [{ startTime: 10 }, { startTime: 11 }] }],
          switchEvents: [{ id: 'before', time: 4 }],
        },
      },
    ],
  };
  const baseline = { scenarios: [structuredClone(scenario)] } as EndaxisProjectDocument;
  const candidate = structuredClone(baseline);
  const run = (input: ScenarioDocument, end: number) => {
    const session = service.createCombatSession(input, end);
    session.advanceToFrame(end);
    return session.collectResult();
  };
  const expected = retimeLegacyProjectBySimulation(baseline, source, run);
  const forbiddenFullRun = vi.fn(() => {
    throw new Error('unexpected full resimulation');
  });
  const createSession = vi.fn(
    (input: ScenarioDocument, frame: number) =>
      new CheckpointRetimingSession(service.createInputCombatSession(input, frame)),
  );
  const actual = retimeLegacyProjectBySimulation(candidate, source, forbiddenFullRun, undefined, {
    compileInputs: input => service.compileFixedInputs(input),
    createSession,
  });
  expect(candidate).toEqual(baseline);
  const { checkpoints, ...stats } = actual.simulationStats;
  expect({ ...actual, simulationStats: stats }).toEqual(expected);
  expect(checkpoints).toMatchObject({ compiledSessions: 1, trials: 2 });
  expect(createSession).toHaveBeenCalledTimes(1);
  expect(forbiddenFullRun).not.toHaveBeenCalled();
});

it('观察在所需事实出现的帧末停止，继续观察沿用同一分支', () => {
  const { scenario, service } = fixture();
  const main = service.createInputCombatSession(scenario);
  const planner = new CheckpointRetimingSession(main);
  const fork = vi.spyOn(main, 'fork');
  const trial = planner.trial(
    service.compileFixedInputs(scenario).filter(input => input.frame < 11),
  );
  const result = trial.advanceToFrame(300, observation =>
    observation.receiptEntries.some(entry => entry.event === 'SkillOperableBoundaryReached'),
  );
  const boundary = result.receiptEntries.find(
    entry => entry.event === 'SkillOperableBoundaryReached',
  )!;
  const branch = fork.mock.results[0]!.value as ReturnType<typeof main.fork>;
  expect(boundary).toBeDefined();
  expect(branch.runtime.frame).toBe(boundary.frame);
  expect(branch.runtime.frame).toBeLessThan(300);
  trial.advanceToFrame(300);
  expect(branch.runtime.frame).toBe(300);
  expect(fork).toHaveBeenCalledTimes(1);
  expect(main.runtime.frame).toBe(0);
});

it('观察越过下一输入后仍从主会话截面试放，延长窗口不重新分叉', () => {
  const { scenario, service } = fixture();
  const inputs = service.compileFixedInputs(scenario);
  const main = service.createInputCombatSession(scenario);
  const planner = new CheckpointRetimingSession(main);
  planner.advanceBefore(4, []);
  const fork = vi.spyOn(main, 'fork');
  const first = planner.trial(inputs.filter(input => input.frame < 11));
  first.advanceToFrame(100);
  first.advanceToFrame(200);
  expect(fork).toHaveBeenCalledTimes(1);
  expect(main.runtime.frame).toBe(3);
  planner.advanceBefore(
    11,
    inputs.filter(input => input.frame < 11),
  );
  const second = planner.trial(inputs.filter(input => input.frame >= 11));
  const result = second.advanceToFrame(200);
  expect(result.receiptEntries.filter(entry => entry.event === 'SkillInputProcessed')).toHaveLength(
    2,
  );
  expect(main.runtime.frame).toBe(10);
  expect(() => planner.trial(inputs)).toThrow('after the saved input boundary');
});
