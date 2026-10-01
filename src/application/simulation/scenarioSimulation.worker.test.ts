import { afterEach, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { createGameDataRepository } from '../../data/createGameDataRepository';
import { commonBuffDefinitions } from '../../data/buffs/commonDefinitions';
import { perlica } from '../../data/operators/perlica.generated';
import { placeSkillGroup } from '../../ui/timeline/interaction/placeSkillGroup';
import { createScenarioSimulationService } from './createScenarioSimulationService';
import { captureScenarioSimulationGameData } from './scenarioSimulationGameData';
import { toSimulationWorkerResult } from './scenarioSimulationWorkerProtocol';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from './scenarioSimulationWorkerProtocol';

afterEach(() => vi.unstubAllGlobals());

it('真实 Worker 切换回执模式和规划时保留接续事实，与各模式完整重算一致', async () => {
  vi.resetModules();
  const sent: SimulationWorkerResponse[] = [];
  const host: {
    onmessage?: (event: { data: SimulationWorkerRequest }) => Promise<void>;
    postMessage: (response: SimulationWorkerResponse) => void;
  } = { postMessage: response => sent.push(structuredClone(response)) };
  vi.stubGlobal('self', host);
  await import('./scenarioSimulation.worker');
  const initial = createEmptyScenario('worker-receipt-detail', 'worker-receipt-detail');
  initial.tracks[0] = {
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
  let identity = 0;
  const { scenario, skillCastIds } = placeSkillGroup({
    scenario: initial,
    trackIndex: 0,
    operator: perlica,
    skillGroupKey: 'basicAttack',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:worker-detail:${identity++}` },
  });
  const repository = createGameDataRepository({
    revision: 'worker-receipt-detail',
    operators: [perlica],
    commonDefinitionSources: [{ id: 'common', buffDefinitions: commonBuffDefinitions }],
  });
  const gameData = captureScenarioSimulationGameData(scenario, repository);
  const full = createScenarioSimulationService(repository);
  const optionalEvents = new Set([
    'CombatStepReached',
    'CombatConditionEvaluated',
    'TimelineActionStarted',
    'TimelineActionEnded',
  ]);
  let id = 0;
  try {
    for (const receiptDetail of ['detailed', 'standard', 'detailed'] as const) {
      const candidate = structuredClone(scenario);
      // 重叠的作者帧须由正式规划恢复接续，标准回执不能遗漏规划所需事实。
      candidate.tracks[0]!.skillCasts.forEach(cast => {
        cast.placement = { startFrame: id + 1 };
      });
      for (const plan of [undefined, { castIds: skillCastIds, mode: 'continuation' as const }]) {
        await host.onmessage!({
          data: {
            id: ++id,
            revision: 0,
            scenario: candidate,
            endFrame: 300,
            receiptDetail,
            ...(id === 1 ? { gameData } : {}),
            ...(plan === undefined ? {} : { plan }),
          },
        });
        const response = sent.at(-1)!;
        expect(response.ok).toBe(true);
        if (!response.ok) throw new Error(response.message);
        const expected = plan
          ? await full.planSkillChain(
              candidate,
              skillCastIds,
              300,
              undefined,
              'continuation',
              undefined,
              receiptDetail,
            )
          : await full.simulate(candidate, 300, undefined, receiptDetail);
        expect(response.result).toEqual(toSimulationWorkerResult(expected));
        const run =
          'receiptEntries' in response.result
            ? response.result
            : response.result.status === 'planned'
              ? response.result.run
              : undefined;
        expect(run).toBeDefined();
        if (!run) throw new Error('expected completed simulation or plan');
        const optional = run.receiptEntries.filter(entry => optionalEvents.has(entry.event));
        if (receiptDetail === 'standard') expect(optional).toEqual([]);
        else expect(optional.length).toBeGreaterThan(0);
        if (plan) {
          const accepted = run.receiptEntries.filter(
            entry => entry.event === 'SkillInputProcessed' && entry.data?.accepted === true,
          );
          expect(accepted.map(entry => entry.data?.castId)).toEqual(skillCastIds);
          expect(new Set(accepted.map(entry => entry.frame)).size).toBe(skillCastIds.length);
        }
      }
    }
  } finally {
    full.clearCache();
  }
});

it('真实 Worker 入口将初始化失败返回请求错误，丢弃旧仓库并允许后续有效包恢复', async () => {
  vi.resetModules();
  const sent: SimulationWorkerResponse[] = [];
  const host: {
    onmessage?: (event: { data: SimulationWorkerRequest }) => Promise<void>;
    postMessage: (response: SimulationWorkerResponse) => void;
  } = { postMessage: response => sent.push(structuredClone(response)) };
  vi.stubGlobal('self', host);
  await import('./scenarioSimulation.worker');
  const scenario = createEmptyScenario('worker-entry', 'worker-entry');
  const gameData = captureScenarioSimulationGameData(
    scenario,
    createGameDataRepository({ revision: 'entry' }),
  );
  let id = 0;
  const send = async (data?: typeof gameData) => {
    await expect(
      host.onmessage!({
        data: {
          id: ++id,
          revision: 0,
          scenario,
          endFrame: 1,
          ...(data === undefined ? {} : { gameData: data }),
        },
      }),
    ).resolves.toBeUndefined();
    expect(sent).toHaveLength(id);
    expect(sent.at(-1)!.id).toBe(id);
    return sent.at(-1)!;
  };
  expect(await send()).toMatchObject({
    ok: false,
    message: '后台模拟缺少当前场景的游戏数据',
    samples: [],
  });
  expect(await send(gameData)).toMatchObject({ ok: true });
  expect(
    await send({
      ...gameData,
      commonDefinitionSources: [{ id: 'duplicate' }, { id: 'duplicate' }],
    }),
  ).toEqual({
    id: 3,
    ok: false,
    message: "duplicate common definition source 'duplicate'",
    samples: [],
  });
  expect(await send()).toMatchObject({ ok: false, message: '后台模拟缺少当前场景的游戏数据' });
  expect(await send(gameData)).toMatchObject({ ok: true });
  expect(await send()).toMatchObject({ ok: true });
});

it('客户端收到初始化错误后结算当前请求，排队的同键请求重发有效定义并继续运行', async () => {
  vi.resetModules();
  const host: {
    onmessage?: (event: { data: SimulationWorkerRequest }) => Promise<void>;
    postMessage: (response: SimulationWorkerResponse) => void;
  } = {
    postMessage: response =>
      worker.onmessage?.({ data: structuredClone(response) } as MessageEvent),
  };
  const requests: SimulationWorkerRequest[] = [];
  const handlerFailures: unknown[] = [];
  const worker = {
    onmessage: null as ((event: MessageEvent<SimulationWorkerResponse>) => void) | null,
    onerror: null,
    onmessageerror: null,
    terminate: vi.fn(),
    postMessage(request: SimulationWorkerRequest) {
      requests.push(structuredClone(request));
      queueMicrotask(() => {
        void host.onmessage!({ data: structuredClone(request) }).catch(error => {
          handlerFailures.push(error);
        });
      });
    },
  };
  vi.stubGlobal('self', host);
  await import('./scenarioSimulation.worker');
  const { WorkerScenarioSimulationService } = await import('./workerScenarioSimulationService');
  const scenario = createEmptyScenario('same-key-retry', 'same-key-retry');
  const gameData = captureScenarioSimulationGameData(
    scenario,
    createGameDataRepository({ revision: 'retry' }),
  );
  const capture = vi
    .fn()
    .mockReturnValueOnce({
      ...gameData,
      commonDefinitionSources: [{ id: 'duplicate' }, { id: 'duplicate' }],
    })
    .mockReturnValue(gameData);
  const bridge = new WorkerScenarioSimulationService(worker as unknown as Worker, capture);
  try {
    const first = bridge.simulate(scenario, 1);
    const failure = expect(first).rejects.toThrow("duplicate common definition source 'duplicate'");
    const second = bridge.simulate(scenario, 2);
    await failure;
    const secondRun = await second;
    expect(secondRun.resourceCurves.sp.points.at(-1)?.frame).toBe(2);
    expect(capture).toHaveBeenCalledTimes(2);
    expect(requests[1]!.gameData).toEqual(gameData);
    const thirdRun = await bridge.simulate(scenario, 3);
    expect(thirdRun.resourceCurves.sp.points.at(-1)?.frame).toBe(3);
    expect(capture).toHaveBeenCalledTimes(2);
    expect(requests[2]!.gameData).toBeUndefined();
    expect(handlerFailures).toEqual([]);
  } finally {
    bridge.dispose();
  }
});
