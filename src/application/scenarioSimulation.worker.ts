import { createEditorSimulationService } from './editorSimulationService';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
} from './scenarioSimulationWorkerProtocol';
import type { ScenarioSimulationPerformanceSample } from './scenarioSimulationService';

let revision = -1;
let service: ReturnType<typeof createEditorSimulationService>;
// 主线程保证单个在途请求；此处只执行正式模拟与投影，不维护另一套模型。
self.onmessage = async (event: MessageEvent<SimulationWorkerRequest>) => {
  const request = event.data;
  if (revision !== request.revision) {
    service = createEditorSimulationService(request.library);
    revision = request.revision;
  }
  const samples: ScenarioSimulationPerformanceSample[] = [];
  const unsubscribe = service.subscribePerformance(sample => samples.push(sample));
  let response: SimulationWorkerResponse;
  try {
    const result = request.plan
      ? await service.planSkillChain(
          request.scenario,
          request.plan.castIds,
          request.endFrame,
          undefined,
          request.plan.mode,
        )
      : await service.simulate(request.scenario, request.endFrame);
    response = { id: request.id, ok: true, result, samples };
  } catch (error) {
    response = {
      id: request.id,
      ok: false,
      message: error instanceof Error ? error.message : String(error),
      samples,
    };
  } finally {
    unsubscribe();
  }
  self.postMessage(response);
};
