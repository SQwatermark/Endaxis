import type {
  ScenarioSimulationPerformanceSample,
  ScenarioSimulationPerformanceSubscriber,
} from './scenarioSimulationService';

/** 性能观察不能改变模拟结果或阻止其他观察者；错误保留在控制台供排查。 */
export function notifySimulationPerformanceSubscribers(
  subscribers: Iterable<ScenarioSimulationPerformanceSubscriber>,
  sample: ScenarioSimulationPerformanceSample,
): void {
  for (const subscriber of subscribers) {
    try {
      subscriber(sample);
    } catch (error) {
      console.error('Simulation performance subscriber failed', error);
    }
  }
}
