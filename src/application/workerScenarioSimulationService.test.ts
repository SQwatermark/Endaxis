import { expect, it, vi } from 'vitest';
import { WorkerScenarioSimulationService } from './workerScenarioSimulationService';
import { createEmptyScenario } from '../core/project/createProject';

function harness() {
  const worker = {
    postMessage: vi.fn(),
    terminate: vi.fn(),
    onmessage: null as any,
    onerror: null as any,
  };
  const library = { operators: {}, weapons: {}, gears: {}, gearSets: {} };
  const service = new WorkerScenarioSimulationService(worker as unknown as Worker, () => library);
  const reply = (id: number) =>
    worker.onmessage({ data: { id, ok: true, result: { frame: id }, samples: [] } });
  return { worker, service, reply };
}
it('在主线程从纯回执数据重建固定历史视图', async () => {
  const { worker, service } = harness();
  const scenario = createEmptyScenario('history', 'history');
  const pending = service.simulate(scenario, 1);
  const result = {
    frame: 1,
    receiptEntries: [
      { sequence: 0, frame: 1, time: 1 / 30, event: 'SkillStarted', data: { castId: 'cast' } },
    ],
  };
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
  expect(worker.postMessage.mock.lastCall![0]).not.toHaveProperty('library');
  reply(3);
  await latest;
  service.dispose();
});
it('定义版本变更使旧结果作废，新请求重新传模板库', async () => {
  const { worker, service, reply } = harness();
  const scenario = createEmptyScenario('qa', 'qa');
  const old = service.simulate(scenario, 10).catch(error => error.name);
  service.clearCache();
  const next = service.simulate(scenario, 12);
  reply(1);
  expect(await old).toBe('AbortError');
  expect(worker.postMessage.mock.lastCall![0]).toHaveProperty('library');
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
