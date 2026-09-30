import { expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { createGameDataRepository } from '../../data/createGameDataRepository';
import { commonBuffDefinitions } from '../../data/buffs/commonDefinitions';
import { perlica } from '../../data/operators/perlica.generated';
import { placeSkillGroup } from '../../ui/timeline/interaction/placeSkillGroup';
import { createScenarioSimulationService } from './createScenarioSimulationService';
import type { ScenarioSimulationRun } from './scenarioSimulationService';
import {
  fromSimulationWorkerResult,
  toSimulationWorkerResult,
  type SimulationPlan,
} from './scenarioSimulationWorkerProtocol';

async function fixture() {
  let scenario = createEmptyScenario('worker-snapshots', 'worker-snapshots');
  scenario.battle.prepFrames = 0;
  scenario.battle.resourceRules.initialSp = 0;
  scenario.battle.resourceRules.spRecoveryPerSecond = 0;
  scenario.globalConfig.customBuff = {
    stackingType: 'unlimited',
    durationSeconds: 1,
    presentation: { showProgressInHpBar: true },
  };
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
  for (const [frame, skillGroupKey] of ['battleSkill', 'comboSkill', 'ultimate'].entries()) {
    scenario = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey,
      startFrame: frame,
      ids: { allocate: kind => `${kind}:${frame}` },
    }).scenario;
  }
  const service = createScenarioSimulationService(
    createGameDataRepository({
      revision: 'worker-snapshots',
      operators: [perlica],
      commonDefinitionSources: [{ id: 'common', buffDefinitions: commonBuffDefinitions }],
    }),
  );
  try {
    return { scenario, run: await service.simulate(scenario, 4) };
  } finally {
    service.clearCache();
  }
}

function publishedSnapshots(run: ScenarioSimulationRun): object[] {
  const curves = [
    run.resourceCurves.sp,
    ...run.resourceCurves.ultimateEnergy,
    ...run.buffProgressCurves,
  ];
  const diagnostics = [
    run.availabilityDiagnostics,
    run.executionDiagnostics,
    run.comboWindowDiagnostics,
  ];
  return [
    run,
    run.resourceCurves,
    run.resourceCurves.ultimateEnergy,
    run.buffProgressCurves,
    run.enemyVitals,
    ...curves.flatMap(curve => [curve, curve.points, ...curve.points]),
    ...diagnostics.flatMap(group => [
      group,
      ...group.flatMap(value => [value, value.receiptSequences]),
    ]),
  ];
}

it.each(['run', 'planned'] as const)(
  '真实模拟快照以 %s 往返恢复发布保护，其他字段保持原有可变性',
  async kind => {
    const { scenario, run: local } = await fixture();
    expect(local.buffProgressCurves.length).toBeGreaterThan(0);
    expect(local.availabilityDiagnostics.length).toBeGreaterThan(0);
    expect(local.resourceCurves.ultimateEnergy).toHaveLength(1);
    const source = kind === 'run' ? local : { status: 'planned' as const, scenario, run: local };
    const wire = structuredClone(toSimulationWorkerResult(source));
    const wireRun =
      'receiptEntries' in wire ? wire : wire.status === 'planned' ? wire.run : undefined;
    if (wireRun === undefined) throw new Error('expected transferable simulation result');
    const received = fromSimulationWorkerResult(wire);
    const restored =
      'receiptHistory' in received
        ? received
        : received.status === 'planned'
          ? received.run
          : undefined;
    expect(restored).toBeDefined();
    if (restored === undefined) throw new Error('expected complete simulation result');
    const { receiptHistory: localHistory, ...localData } = local;
    const { receiptHistory: restoredHistory, ...restoredData } = restored;
    expect(restoredData).toEqual(localData);
    expect(restoredHistory).not.toBe(localHistory);
    expect(restored.receiptEntries).toBe(restoredHistory.toArray());
    expect(restored.receiptEntries).not.toBe(wireRun.receiptEntries);
    expect(restoredHistory.get(0)).not.toBe(wireRun.receiptEntries[0]);
    expect(restoredHistory.get(0)).toEqual(localHistory.get(0));
    expect(Reflect.set(wireRun.receiptEntries[0]!, 'frame', 987)).toBe(true);
    expect(restoredHistory.get(0)?.frame).toBe(localHistory.get(0)?.frame);
    expect(Object.isFrozen(restoredHistory.get(0))).toBe(true);
    expect(publishedSnapshots(local).every(Object.isFrozen)).toBe(true);
    expect(publishedSnapshots(restored).every(Object.isFrozen)).toBe(true);
    expect(Reflect.set(restored.resourceCurves.sp.points[0]!, 'value', 987)).toBe(false);
    expect(Reflect.set(restored.resourceCurves.ultimateEnergy[0]!.points[0]!, 'value', 987)).toBe(
      false,
    );
    expect(Reflect.set(restored.enemyVitals, 'finalPoise', 987)).toBe(false);
    expect(Reflect.set(restored.buffProgressCurves[0]!.points[0]!, 'ratio', 987)).toBe(false);
    expect(Reflect.set(restored.availabilityDiagnostics[0]!, 'frame', 987)).toBe(false);
    expect(Reflect.set(restored.availabilityDiagnostics[0]!.receiptSequences, '0', 987)).toBe(
      false,
    );
    for (const run of [local, restored]) {
      for (const value of [
        run.initialResources,
        run.finalResources,
        run.operatorPanels,
        run.enemyHealthCurve,
        run.enemyHealthCurve.points,
        run.poiseCurve,
        run.poiseCurve.points,
        run.availabilityDiagnostics[0]!.reasons,
      ])
        expect(Object.isFrozen(value)).toBe(false);
    }
    expect(Reflect.set(restored.initialResources, 'sp', 987)).toBe(true);
    expect(local.initialResources.sp).toBe(0);
    if ('status' in received && received.status === 'planned') {
      expect(Object.isFrozen(received)).toBe(false);
      expect(Object.isFrozen(received.scenario)).toBe(false);
      expect(Reflect.set(received.scenario, 'name', 'edited')).toBe(true);
      expect(scenario.name).toBe('worker-snapshots');
    }
  },
);

it('未完成规划的 Map 和可编辑方案仍按结构化克隆传输', () => {
  const plan: SimulationPlan = {
    status: 'incomplete',
    unresolvedCastIds: ['later'],
    plannedStartFrames: new Map([['earlier', 1]]),
    scenario: createEmptyScenario('incomplete', 'incomplete'),
  };
  const received = fromSimulationWorkerResult(structuredClone(toSimulationWorkerResult(plan)));
  expect(received).toEqual(plan);
  expect(Object.isFrozen(received)).toBe(false);
  if (!('status' in received) || received.status !== 'incomplete')
    throw new Error('expected incomplete');
  expect(received.plannedStartFrames).toBeInstanceOf(Map);
  expect(received.plannedStartFrames).not.toBe(plan.plannedStartFrames);
});
