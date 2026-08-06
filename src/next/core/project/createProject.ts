import {
  PROJECT_FPS,
  PROJECT_KIND,
  PROJECT_SCHEMA_VERSION,
  type EndaxisProjectDocument,
  type ScenarioDocument,
} from './schema';

export interface CreateProjectOptions {
  projectId?: string;
  scenarioName?: string;
  createdWith: string;
  gameDataRevision: string;
}

export function createEmptyScenario(id: string, name: string): ScenarioDocument {
  return {
    id,
    name,
    builds: { operators: {}, weapons: {}, gears: {} },
    tracks: [null, null, null, null],
    connections: [],
    enemy: {
      source: { kind: 'custom', level: 90 },
      editable: {
        hp: 100000,
        defense: 100,
        superArmor: 0,
        finisherMultiplier: 1,
        resistances: {},
      },
      edited: [],
    },
    battle: {
      prepFrames: 150,
      durationFrames: 3600,
      resourceRules: {
        maxSp: 300,
        initialSp: 300,
        spRecoveryPerSecond: 10,
        defaultSkillSpCost: 100,
      },
      staggerRules: {
        maximum: 300,
        nodeCount: 1,
        nodeDurationFrames: 60,
        brokenDurationFrames: 300,
        finisherRecovery: 100,
      },
      cycleBoundaries: [],
      switchEvents: [],
      initialEffects: [],
    },
    globalConfig: {},
    editor: {
      trackHeightWeights: [1, 1, 1, 1],
      prepExpanded: true,
    },
  };
}

export function createEmptyProject(options: CreateProjectOptions): EndaxisProjectDocument {
  const scenarioId = options.projectId ? `${options.projectId}:scenario:1` : 'scenario:1';
  return {
    kind: PROJECT_KIND,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    createdWith: options.createdWith,
    gameDataRevision: options.gameDataRevision,
    timeUnit: 'frame',
    fps: PROJECT_FPS,
    activeScenarioId: scenarioId,
    scenarios: [createEmptyScenario(scenarioId, options.scenarioName ?? 'Scenario 1')],
  };
}
