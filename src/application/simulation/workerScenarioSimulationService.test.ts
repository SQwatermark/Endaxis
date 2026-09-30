import { skillFixture } from '../../test/skillFixture';
import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills.ts';
import { expect, it, vi } from 'vitest';

import type { ActionGraphNode } from '../../../packages/game-data-contract/src/actionGraph';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import { createGameDataRepository } from '../../data/createGameDataRepository';
import { perlica } from '../../data/operators/perlica.generated';
import { placeSkillGroup } from '../../ui/timeline/interaction/placeSkillGroup';
import { createScenarioSimulationService } from './createScenarioSimulationService';
import {
  captureScenarioSimulationGameData,
  restoreScenarioSimulationGameData,
} from './scenarioSimulationGameData';
import { toSimulationWorkerResult } from './scenarioSimulationWorkerProtocol';
import { WorkerScenarioSimulationService } from './workerScenarioSimulationService';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioSimulationGameData } from './scenarioSimulationGameData';

function harness() {
  const worker = {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: null as any,
    onerror: null as any,
  };
  const gameData: ScenarioSimulationGameData = {
    revision: 'test',
    selectionKey: '',
    commonDefinitionSources: [],
    operators: [],
    weapons: [],
    gears: [],
    gearSets: [],
    enemies: [],
    mechanics: [],
    consumables: [],
    globalEffects: [],
  };
  const captureGameData = vi.fn(() => gameData);
  const service = new WorkerScenarioSimulationService(worker as unknown as Worker, captureGameData);
  const reply = (id: number) =>
    worker.onmessage({ data: { id, ok: true, result: { frame: id }, samples: [] } });
  return { worker, service, reply, captureGameData };
}

it('图场景通过 Worker 数据包往返后仍执行技能', async () => {
  const nodes: Record<string, ActionGraphNode> = {
    'step-0': { action: { kind: 'dealStagger', parameters: { value: 1 } }, next: null },
  };
  const graphSkill: SkillDefinition = skillFixture({
    key: 'worker-graph-skill',
    skillType: 'battleSkill',
    levelSource: 'battleSkill',
    timelineBlockFrames: 1,
    scheduledSequences: [{ startFrame: 0, sequence: { $sequence: 'step-0' } }],
    actionGraph: { main: { nodes }, macros: {} },
  });
  const definition: OperatorDefinition = {
    ...perlica,
    talents: [],
    potentials: [],
    comboSkillConditions: [],
    skillGroups: [
      {
        key: 'battleSkill',
        operationType: 'battleSkill' as const,
        skills: graphSkill,
      },
    ],
  };
  const source = createEmptyScenario('worker-graph', 'Worker graph');
  source.tracks[0] = {
    id: 'track:graph',
    operator: {
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { battleSkill: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 100 },
    skillCasts: [],
  };
  const scenario = placeSkillGroup({
    scenario: source,
    trackIndex: 0,
    operator: definition,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: () => 'cast:worker-graph' },
  }).scenario;
  const repository = createGameDataRepository({
    revision: 'worker-graph',
    operators: [definition],
    commonDefinitionSources: [],
  });
  const worker = {
    postMessage: vi.fn(
      async (request: import('./scenarioSimulationWorkerProtocol').SimulationWorkerRequest) => {
        const restored = restoreScenarioSimulationGameData(request.gameData!);
        const service = createScenarioSimulationService(restored);
        const result = await service.simulate(request.scenario, request.endFrame);
        worker.onmessage?.({
          data: { id: request.id, ok: true, result: toSimulationWorkerResult(result), samples: [] },
        } as MessageEvent);
      },
    ),
    terminate: vi.fn(),
    onmessage: null as ((event: MessageEvent) => void) | null,
    onerror: null as ((event: ErrorEvent) => void) | null,
  };
  const bridge = new WorkerScenarioSimulationService(worker as unknown as Worker, current =>
    captureScenarioSimulationGameData(current, repository),
  );
  const result = await bridge.simulate(scenario, 4);
  expect(worker.postMessage).toHaveBeenCalledOnce();
  expect(result.receiptEntries.some(entry => entry.event === 'SkillInputProcessed')).toBe(true);
  expect(result.enemyVitals.finalPoise).toBeLessThan(result.enemyVitals.initialPoise);
  bridge.dispose();
});
it('首次请求携带当前场景数据，引用集合不变时由后台复用', async () => {
  const { worker, service, reply, captureGameData } = harness();
  const scenario = createEmptyScenario('definitions', 'definitions');
  const first = service.simulate(scenario, 1);
  expect(worker.postMessage.mock.lastCall![0]).toHaveProperty('gameData');
  reply(1);
  await first;
  const second = service.simulate(scenario, 2);
  expect(worker.postMessage.mock.lastCall![0]).not.toHaveProperty('gameData');
  reply(2);
  await second;
  expect(captureGameData).toHaveBeenCalledOnce();
  scenario.mechanics.selections.push({
    id: 'selection',
    mechanicId: 'mechanic',
    enabled: false,
    parameters: {},
  });
  const changed = service.simulate(scenario, 3);
  expect(worker.postMessage.mock.lastCall![0]).toHaveProperty('gameData');
  expect(captureGameData).toHaveBeenCalledTimes(2);
  reply(3);
  await changed;
  service.dispose();
});

it('去除请求代理时保留 Infinity 和共享图引用', async () => {
  const { worker, service, reply, captureGameData } = harness();
  const scenario = new Proxy(createEmptyScenario('proxy', 'proxy'), {});
  const graphNode = {
    action: { kind: 'dealStagger' as const, parameters: { value: Number.POSITIVE_INFINITY } },
    next: null,
  };
  const data = captureGameData.getMockImplementation()!;
  captureGameData.mockImplementation(() => {
    const packet = data();
    return {
      ...packet,
      commonDefinitionSources: [
        { id: 'graph', actionGraph: { nodes: { first: graphNode, second: graphNode } } },
      ],
    };
  });
  const pending = service.simulate(scenario, 1);
  const sent = worker.postMessage.mock.lastCall![0];
  const nodes = sent.gameData.commonDefinitionSources[0].actionGraph.nodes;
  expect(nodes.first.action.parameters.value).toBe(Number.POSITIVE_INFINITY);
  expect(nodes.first).toBe(nodes.second);
  expect(() => structuredClone(sent)).not.toThrow();
  reply(1);
  await pending;
  service.dispose();
});
it('在主线程从纯回执数据重建固定历史视图', async () => {
  const { worker, service } = harness();
  const scenario = createEmptyScenario('history', 'history');
  const pending = service.simulate(scenario, 1);
  const local = createScenarioSimulationService(
    createGameDataRepository({ revision: 'history', commonDefinitionSources: [] }),
  );
  const result = {
    ...toSimulationWorkerResult(await local.simulate(scenario, 1)),
    receiptEntries: [
      { sequence: 0, frame: 1, time: 1 / 30, event: 'SkillStarted', data: { castId: 'cast' } },
    ],
  };
  local.clearCache();
  worker.onmessage({
    data: { id: 1, ok: true, result, samples: [] },
  });
  const received = await pending;
  expect(received.receiptHistory.get(0)).toEqual(result.receiptEntries[0]);
  expect(received.receiptHistory.toArray()).toEqual(result.receiptEntries);
  expect(received.receiptHistory.toArray()).toBe(received.receiptEntries);
  expect(Object.isFrozen(received.receiptEntries)).toBe(true);
  service.dispose();
});
it('后台规划携带递归停止条件与预留身份，原场景不预先展开', async () => {
  const { worker, service, reply } = harness();
  const scenario = createEmptyScenario('recursive', 'recursive');
  const extension = {
    allowedSkillKeys: ['first', 'heavy'],
    terminalSkillKey: 'heavy',
    reservedCastIds: ['next'],
  };
  const planned = service.planSkillChain(
    scenario,
    ['seed'],
    100,
    undefined,
    'continuation',
    extension,
  );
  expect(worker.postMessage.mock.calls[0]![0].plan).toEqual({
    castIds: ['seed'],
    mode: 'continuation',
    extension,
  });
  expect(worker.postMessage.mock.calls[0]![0].scenario).toEqual(scenario);
  reply(1);
  await planned;
  service.dispose();
});
it('只发送一个在途与最新待算位置，完整结果返回后才继续', async () => {
  const { worker, service, reply } = harness();
  const scenario = createEmptyScenario('qa', 'qa');
  const first = service.simulate(scenario, 10);
  const replaced = service.simulate(scenario, 11).catch(error => error.name);
  const latest = service.simulate(scenario, 12);
  expect(await replaced).toBe('AbortError');
  expect(worker.postMessage).toHaveBeenCalledTimes(1);
  reply(1);
  expect((await first).frame).toBe(1);
  expect(worker.postMessage).toHaveBeenCalledTimes(2);
  expect(worker.postMessage.mock.lastCall![0].endFrame).toBe(12);
  expect(worker.postMessage.mock.lastCall![0]).not.toHaveProperty('gameData');
  reply(3);
  await latest;
  service.dispose();
});
it('定义版本变更使旧结果作废，新请求重新传当前场景数据', async () => {
  const { worker, service, reply } = harness();
  const scenario = createEmptyScenario('qa', 'qa');
  const old = service.simulate(scenario, 10).catch(error => error.name);
  service.clearCache();
  const next = service.simulate(scenario, 12);
  reply(1);
  expect(await old).toBe('AbortError');
  expect(worker.postMessage.mock.lastCall![0]).toHaveProperty('gameData');
  reply(2);
  await next;
  service.dispose();
});
it('线程故障拒绝在途及等待请求，不让页面永久运行中', async () => {
  const { worker, service } = harness();
  const scenario = createEmptyScenario('qa', 'qa');
  const first = service.simulate(scenario, 10).catch(error => error.message);
  const second = service.simulate(scenario, 11).catch(error => error.message);
  worker.onerror({ message: 'broken' });
  expect(await first).toBe('broken');
  expect(await second).toBe('broken');
  expect(worker.terminate).toHaveBeenCalledOnce();
});

it.each(['completed', 'failed', 'invalid-history'] as const)(
  '性能订阅者抛错后仍结算 %s 请求并继续待算位置',
  async outcome => {
    const { worker, service, reply } = harness();
    const scenario = createEmptyScenario('observer-error', 'observer-error');
    const observerError = new Error('performance observer failed');
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const observed = vi.fn();
    service.subscribePerformance(() => {
      throw observerError;
    });
    service.subscribePerformance(observed);
    const first = service.simulate(scenario, 1).then(
      result => ({ result }),
      (error: unknown) => ({ error }),
    );
    const second = service.simulate(scenario, 2);
    const sample = {
      totalMs: 1,
      simulationMs: 1,
      projectionMs: 0,
      outcome: outcome === 'failed' ? 'failed' : 'completed',
      endFrame: 1,
      receiptCount: 0,
    };
    try {
      expect(() =>
        worker.onmessage({
          data: {
            id: 1,
            samples: [sample],
            ...(outcome === 'failed'
              ? { ok: false, message: 'simulation failed' }
              : {
                  ok: true,
                  result:
                    outcome === 'completed'
                      ? { frame: 1 }
                      : { frame: 1, receiptEntries: [{ sequence: 1 }] },
                }),
          },
        }),
      ).not.toThrow();
      expect(worker.postMessage).toHaveBeenCalledTimes(2);
      expect(observed).toHaveBeenCalledWith(sample);
      expect(report).toHaveBeenCalledWith(
        'Simulation performance subscriber failed',
        observerError,
      );
      if (outcome === 'completed') expect(await first).toEqual({ result: { frame: 1 } });
      else
        expect(await first).toEqual({
          error: new Error(
            outcome === 'failed'
              ? 'simulation failed'
              : 'receipt history expected sequence 0, received 1',
          ),
        });
      reply(2);
      expect((await second).frame).toBe(2);
    } finally {
      service.dispose();
      report.mockRestore();
      await second.catch(() => undefined);
    }
  },
);

it('观察异常不改变取消、缓存换代和销毁时的请求结算', async () => {
  const { worker, service } = harness();
  const scenario = createEmptyScenario('observer-cancel', 'observer-cancel');
  const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const observer = vi.fn(() => {
    throw new Error('observer failed');
  });
  service.subscribePerformance(observer);
  const respond = (id: number) =>
    worker.onmessage({
      data: {
        id,
        ok: true,
        result: { frame: id },
        samples: [
          {
            totalMs: 1,
            simulationMs: 1,
            projectionMs: 0,
            outcome: 'completed',
            endFrame: id,
            receiptCount: 0,
          },
        ],
      },
    });
  const controller = new AbortController();
  const cancelled = service.simulate(scenario, 1, controller.signal).catch(error => error.name);
  try {
    controller.abort();
    expect(await cancelled).toBe('AbortError');
    // 已取消的计算仍占用线程，直到其响应到达才能发送下一位置。
    const stale = service.simulate(scenario, 2).catch(error => error.name);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);
    expect(() => respond(1)).not.toThrow();
    expect(worker.postMessage).toHaveBeenCalledTimes(2);
    service.clearCache();
    const disposed = service.simulate(scenario, 3).catch(error => error.name);
    expect(() => respond(2)).not.toThrow();
    expect(await stale).toBe('AbortError');
    expect(worker.postMessage).toHaveBeenCalledTimes(3);
    service.dispose();
    expect(await disposed).toBe('AbortError');
    expect(() => respond(3)).not.toThrow();
    expect(observer).toHaveBeenCalledTimes(2);
    expect(report).toHaveBeenCalledTimes(2);
    expect(worker.terminate).toHaveBeenCalledOnce();
  } finally {
    service.dispose();
    report.mockRestore();
  }
});

it.each(['dispose', 'clearCache'] as const)(
  '性能回调重入 %s 后仍拒绝已移出 active 的当前任务',
  async action => {
    const { worker, service } = harness();
    const scenario = createEmptyScenario('observer-reentry', 'observer-reentry');
    const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    service.subscribePerformance(() => {
      service[action]();
      throw new Error('observer failed after invalidation');
    });
    const first = service.simulate(scenario, 1).catch(error => error.name);
    const second = service.simulate(scenario, 2).catch(error => error.name);
    try {
      expect(() =>
        worker.onmessage({
          data: {
            id: 1,
            ok: true,
            result: { frame: 1 },
            samples: [
              {
                totalMs: 1,
                simulationMs: 1,
                projectionMs: 0,
                outcome: 'completed',
                endFrame: 1,
                receiptCount: 0,
              },
            ],
          },
        }),
      ).not.toThrow();
      expect(await first).toBe('AbortError');
      expect(await second).toBe('AbortError');
      expect(worker.postMessage).toHaveBeenCalledOnce();
      expect(report).toHaveBeenCalledOnce();
    } finally {
      service.dispose();
      report.mockRestore();
    }
  },
);
