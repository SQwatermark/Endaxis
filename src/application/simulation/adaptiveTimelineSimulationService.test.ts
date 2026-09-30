import { expect, it, vi } from 'vitest';
import type { ScenarioSimulationPerformanceSample } from './scenarioSimulationService';
import { AdaptiveTimelineSimulationService } from './adaptiveTimelineSimulationService';
import { createEmptyScenario } from '../../core/project/createProject';

function sample(totalMs: number): ScenarioSimulationPerformanceSample {
  return {
    totalMs,
    simulationMs: totalMs,
    projectionMs: 0,
    outcome: 'completed',
    endFrame: 60,
    receiptCount: 0,
  };
}

function backend(label: string) {
  const listeners = new Set<(value: ScenarioSimulationPerformanceSample) => void>();
  return {
    simulate: vi.fn(async () => ({ label })),
    planSkillChain: vi.fn(),
    subscribePerformance: vi.fn(
      (listener: (value: ScenarioSimulationPerformanceSample) => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    ),
    clearCache: vi.fn(),
    dispose: vi.fn(),
    publish: (value: ScenarioSimulationPerformanceSample) => {
      for (const listener of listeners) listener(value);
    },
  };
}

it('uses the local simulator for an entire drag when the latest worker run is fast', async () => {
  const worker = backend('worker');
  const local = backend('local');
  const service = new AdaptiveTimelineSimulationService(worker as never, () => local as never);
  const scenario = createEmptyScenario('adaptive:fast', 'fast');

  worker.publish(sample(200));
  service.beginInteractiveSession();
  expect(((await service.simulate(scenario, 60)) as unknown as { label: string }).label).toBe(
    'local',
  );
  local.publish(sample(201));
  expect(((await service.simulate(scenario, 60)) as unknown as { label: string }).label).toBe(
    'local',
  );
  service.endInteractiveSession();

  service.beginInteractiveSession();
  expect(((await service.simulate(scenario, 60)) as unknown as { label: string }).label).toBe(
    'worker',
  );
  service.dispose();
});

it('replaces a slow startup sample after one fast complete run, starting with the next drag', async () => {
  const worker = backend('worker');
  const local = backend('local');
  const service = new AdaptiveTimelineSimulationService(worker as never, () => local as never);
  const scenario = createEmptyScenario('adaptive:startup', 'startup');

  worker.publish(sample(201));
  worker.publish({ ...sample(1), outcome: 'aborted' });
  service.beginInteractiveSession();
  expect(await service.simulate(scenario, 60)).toEqual({ label: 'worker' });
  worker.publish(sample(20));
  expect(await service.simulate(scenario, 60)).toEqual({ label: 'worker' });
  service.endInteractiveSession();

  service.beginInteractiveSession();
  expect(await service.simulate(scenario, 60)).toEqual({ label: 'local' });
  service.endInteractiveSession();

  service.clearCache();
  service.beginInteractiveSession();
  expect(await service.simulate(scenario, 60)).toEqual({ label: 'worker' });
  service.dispose();
});
it('keeps slow and unmeasured scenarios in the worker', async () => {
  const worker = backend('worker');
  const local = backend('local');
  const service = new AdaptiveTimelineSimulationService(worker as never, () => local as never);
  const scenario = createEmptyScenario('adaptive:slow', 'slow');

  service.beginInteractiveSession();
  expect(((await service.simulate(scenario, 60)) as unknown as { label: string }).label).toBe(
    'worker',
  );
  service.endInteractiveSession();
  worker.publish(sample(201));
  service.beginInteractiveSession();
  expect(((await service.simulate(scenario, 60)) as unknown as { label: string }).label).toBe(
    'worker',
  );
  service.dispose();
});

it('性能观察异常不阻止其他订阅者或后续拖动的后端选择', async () => {
  const worker = backend('worker');
  const local = backend('local');
  const service = new AdaptiveTimelineSimulationService(worker as never, () => local as never);
  const observerError = new Error('adaptive observer failed');
  const report = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  const observed = vi.fn();
  service.subscribePerformance(() => {
    throw observerError;
  });
  service.subscribePerformance(observed);
  const scenario = createEmptyScenario('adaptive:observer', 'observer');
  try {
    expect(() => worker.publish(sample(20))).not.toThrow();
    service.beginInteractiveSession();
    expect(await service.simulate(scenario, 60)).toEqual({ label: 'local' });
    expect(() => local.publish(sample(300))).not.toThrow();
    service.endInteractiveSession();
    service.beginInteractiveSession();
    expect(await service.simulate(scenario, 60)).toEqual({ label: 'worker' });
    expect(observed.mock.calls.map(([value]) => value.totalMs)).toEqual([20, 300]);
    expect(report).toHaveBeenCalledTimes(2);
    expect(report).toHaveBeenCalledWith('Simulation performance subscriber failed', observerError);
  } finally {
    service.dispose();
    report.mockRestore();
  }
});
