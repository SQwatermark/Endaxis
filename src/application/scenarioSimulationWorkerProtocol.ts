import type {
  ScenarioSimulationService,
  ScenarioSimulationRun,
  ScenarioSimulationPerformanceSample,
} from './scenarioSimulationService';
import type { ScenarioDocument, ProjectDefinitionLibraryDocument } from '../core/project/schema';

export type SimulationPlan = Awaited<ReturnType<ScenarioSimulationService['planSkillChain']>>;
export interface SimulationWorkerRequest {
  readonly id: number;
  readonly revision: number;
  readonly library?: ProjectDefinitionLibraryDocument;
  readonly scenario: ScenarioDocument;
  readonly endFrame: number;
  readonly plan?: {
    readonly castIds: readonly string[];
    readonly mode: 'continuation' | 'compact';
  };
}
export type SimulationWorkerResponse = {
  readonly id: number;
  readonly samples: readonly ScenarioSimulationPerformanceSample[];
} & (
  | { readonly ok: true; readonly result: ScenarioSimulationRun | SimulationPlan }
  | { readonly ok: false; readonly message: string }
);
