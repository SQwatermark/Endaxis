import { afterEach, expect, it, vi } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import { createGameDataRepository } from '../../data/createGameDataRepository';
import { captureScenarioSimulationGameData } from './scenarioSimulationGameData';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from './scenarioSimulationWorkerProtocol';

afterEach(() => vi.unstubAllGlobals());

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
