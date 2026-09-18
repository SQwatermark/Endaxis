import { createEmptyScenario } from '../../core/project/createProject';
import type { EndaxisProjectDocument, ScenarioDocument } from '../../core/project/schema';

export const MAX_PROJECT_SCENARIOS = 14;

export type TimelineResetMode = 'currentKeepLoadout' | 'current' | 'all';

/** Reset timeline data as one undoable project command; project templates remain in the library. */
export function resetProjectScenarios(
  project: EndaxisProjectDocument,
  mode: TimelineResetMode,
): EndaxisProjectDocument {
  const current = project.scenarios.find(scenario => scenario.id === project.activeScenarioId);
  if (current === undefined) return project;
  const reset = createEmptyScenario(current.id, current.name);
  if (mode === 'currentKeepLoadout') {
    reset.tracks = current.tracks.map(track =>
      track === null
        ? null
        : {
            ...track,
            initialState: { ultimateEnergy: 0 },
            skillCasts: [],
          },
    ) as ScenarioDocument['tracks'];
  }
  return {
    ...project,
    scenarios:
      mode === 'all'
        ? [reset]
        : project.scenarios.map(scenario => (scenario.id === current.id ? reset : scenario)),
  };
}

function scenarioIdPrefix(project: EndaxisProjectDocument): string {
  const match = /^(.*):scenario:[^:]+$/.exec(project.activeScenarioId);
  return match?.[1] ?? 'project';
}

export function allocateScenarioId(project: EndaxisProjectDocument): string {
  const used = new Set(project.scenarios.map(scenario => scenario.id));
  const prefix = `${scenarioIdPrefix(project)}:scenario:`;
  for (let index = 1; ; index += 1) {
    const candidate = `${prefix}${index}`;
    if (!used.has(candidate)) return candidate;
  }
}

function replaceActiveScenario(
  project: EndaxisProjectDocument,
  update: (scenario: ScenarioDocument) => ScenarioDocument,
): EndaxisProjectDocument {
  const index = project.scenarios.findIndex(scenario => scenario.id === project.activeScenarioId);
  if (index < 0) return project;
  const current = project.scenarios[index]!;
  const next = update(current);
  if (next === current) return project;
  const scenarios = [...project.scenarios];
  scenarios[index] = next;
  return { ...project, scenarios };
}

export function renameActiveScenario(
  project: EndaxisProjectDocument,
  requestedName: string,
): EndaxisProjectDocument {
  const name = requestedName.trim();
  if (name.length === 0) return project;
  return replaceActiveScenario(project, scenario =>
    scenario.name === name ? scenario : { ...scenario, name },
  );
}

export function switchProjectScenario(
  project: EndaxisProjectDocument,
  scenarioId: string,
): EndaxisProjectDocument {
  if (scenarioId === project.activeScenarioId) return project;
  if (!project.scenarios.some(scenario => scenario.id === scenarioId)) return project;
  return { ...project, activeScenarioId: scenarioId };
}

export function addProjectScenario(
  project: EndaxisProjectDocument,
  name: string,
): EndaxisProjectDocument {
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) return project;
  const id = allocateScenarioId(project);
  const scenario = createEmptyScenario(
    id,
    name.trim() || `Scenario ${project.scenarios.length + 1}`,
  );
  return {
    ...project,
    activeScenarioId: id,
    scenarios: [...project.scenarios, scenario],
  };
}

/**
 * 复制整个方案只分配新的方案 ID。内部 ID 和引用在各自方案内使用，直接保留；
 * 深拷贝保证修改副本不会影响原方案，项目定义库的引用也保持不变。
 */
export function duplicateActiveScenario(
  project: EndaxisProjectDocument,
  copySuffix: string,
): EndaxisProjectDocument {
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) return project;
  const source = project.scenarios.find(scenario => scenario.id === project.activeScenarioId);
  if (source === undefined) return project;
  const id = allocateScenarioId(project);
  const duplicate: ScenarioDocument = {
    ...structuredClone(source),
    id,
    name: `${source.name} (${copySuffix})`,
  };
  return {
    ...project,
    activeScenarioId: id,
    scenarios: [...project.scenarios, duplicate],
  };
}

export function deleteActiveScenario(project: EndaxisProjectDocument): EndaxisProjectDocument {
  if (project.scenarios.length <= 1) return project;
  const index = project.scenarios.findIndex(scenario => scenario.id === project.activeScenarioId);
  if (index < 0) return project;
  const scenarios = project.scenarios.filter(scenario => scenario.id !== project.activeScenarioId);
  const next = scenarios[Math.max(0, index - 1)] ?? scenarios[0]!;
  return { ...project, activeScenarioId: next.id, scenarios };
}
