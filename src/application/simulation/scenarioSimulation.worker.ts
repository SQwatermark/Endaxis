import { createScenarioSimulationService } from './createScenarioSimulationService';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from './scenarioSimulationWorkerProtocol';
import { toSimulationWorkerResult } from './scenarioSimulationWorkerProtocol';
import type {
  ScenarioSimulationPerformanceSample,
  ScenarioSimulationService,
} from './scenarioSimulationService';
import { restoreScenarioSimulationGameData } from './scenarioSimulationGameData';

let service: ScenarioSimulationService | undefined;
// 主线程保证单个在途请求；此处只执行正式模拟与投影，不维护另一套模型。
self.onmessage = async (event: MessageEvent<SimulationWorkerRequest>) => {
  const request = event.data;
  const samples: ScenarioSimulationPerformanceSample[] = [];
  let response: SimulationWorkerResponse;
  let unsubscribe: (() => void) | undefined;
  try {
    if (request.gameData !== undefined) {
      const previous = service;
      // 新定义恢复失败后不能继续把旧仓库当成新版本复用。
      service = undefined;
      previous?.clearCache();
      service = createScenarioSimulationService(
        restoreScenarioSimulationGameData(request.gameData),
        true,
      );
    }
    const currentService = service;
    if (currentService === undefined) throw new Error('后台模拟缺少当前场景的游戏数据');
    unsubscribe = currentService.subscribePerformance(sample => samples.push(sample));
    const result = request.plan
      ? await currentService.planSkillChain(
          request.scenario,
          request.plan.castIds,
          request.endFrame,
          undefined,
          request.plan.mode,
          request.plan.extension,
        )
      : await currentService.simulate(request.scenario, request.endFrame);
    response = { id: request.id, ok: true, result: toSimulationWorkerResult(result), samples };
  } catch (error) {
    response = {
      id: request.id,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      samples,
    };
  } finally {
    unsubscribe?.();
  }
  self.postMessage(response);
};
