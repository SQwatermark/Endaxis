import { createEmptyScenario } from '../../core/project/createProject';
import type {
  EndaxisProjectDocument,
  ScenarioDocument,
  SkillCastDocument,
  TrackDocument,
} from '../../core/project/schema';

export const MAX_PROJECT_SCENARIOS = 14;

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

function duplicateTrack(
  track: TrackDocument,
  allocate: (kind: string) => string,
  castIds: Map<string, string>,
): TrackDocument {
  const skillCasts: SkillCastDocument[] = track.skillCasts.map(cast => {
    const id = allocate('skillCast');
    castIds.set(cast.id, id);
    return {
      ...structuredClone(cast),
      id,
      presentation:
        cast.presentation === undefined
          ? undefined
          : {
              ...structuredClone(cast.presentation),
              customBars: cast.presentation.customBars?.map(bar => ({
                ...bar,
                id: allocate('customBar'),
              })),
            },
    };
  });
  return { ...structuredClone(track), id: allocate('track'), skillCasts };
}

/**
 * 复制方案时必须重建所有文档身份。技能定义内部的 key 是规则身份，不属于文档实例，不能改写。
 */
export function duplicateActiveScenario(
  project: EndaxisProjectDocument,
  copySuffix: string,
): EndaxisProjectDocument {
  if (project.scenarios.length >= MAX_PROJECT_SCENARIOS) return project;
  const source = project.scenarios.find(scenario => scenario.id === project.activeScenarioId);
  if (source === undefined) return project;
  const id = allocateScenarioId(project);
  const counters = new Map<string, number>();
  const allocate = (kind: string) => {
    const next = (counters.get(kind) ?? 0) + 1;
    counters.set(kind, next);
    return `${kind}:${id}:${next}`;
  };
  const castIds = new Map<string, string>();
  const tracks = source.tracks.map(track =>
    track === null ? null : duplicateTrack(track, allocate, castIds),
  ) as ScenarioDocument['tracks'];
  const duplicate: ScenarioDocument = {
    ...structuredClone(source),
    id,
    name: `${source.name} (${copySuffix})`,
    tracks,
    connections: source.connections.map(connection => ({
      ...structuredClone(connection),
      id: allocate('connection'),
      from: { ...connection.from, skillCastId: castIds.get(connection.from.skillCastId)! },
      to: { ...connection.to, skillCastId: castIds.get(connection.to.skillCastId)! },
    })),
    battle: {
      ...structuredClone(source.battle),
      cycleBoundaries: source.battle.cycleBoundaries.map(boundary => ({
        ...boundary,
        id: allocate('cycleBoundary'),
      })),
      controlSwitches: source.battle.controlSwitches.map(controlSwitch => ({
        ...controlSwitch,
        id: allocate('controlSwitch'),
      })),
      externalEventMarkers: source.battle.externalEventMarkers?.map(marker => ({
        ...structuredClone(marker),
        id: allocate('externalEvent'),
      })),
    },
    mechanics: {
      selections: source.mechanics.selections.map(selection => ({
        ...structuredClone(selection),
        id: allocate('mechanic'),
      })),
    },
    globalConfig: {
      modifiers: source.globalConfig.modifiers.map(modifier => ({
        ...modifier,
        id: allocate('globalModifier'),
      })),
    },
  };
  return {
    ...project,
    activeScenarioId: id,
    scenarios: [...project.scenarios, duplicate],
  };
}

export function scenariosDependingOn(
  project: EndaxisProjectDocument,
  scenarioId: string,
): readonly ScenarioDocument[] {
  return project.scenarios.filter(
    scenario => scenario.inheritance?.sourceScenarioId === scenarioId,
  );
}

export function deleteActiveScenario(project: EndaxisProjectDocument): EndaxisProjectDocument {
  if (project.scenarios.length <= 1) return project;
  const index = project.scenarios.findIndex(scenario => scenario.id === project.activeScenarioId);
  if (index < 0 || scenariosDependingOn(project, project.activeScenarioId).length > 0)
    return project;
  const scenarios = project.scenarios.filter(scenario => scenario.id !== project.activeScenarioId);
  const next = scenarios[Math.max(0, index - 1)] ?? scenarios[0]!;
  return { ...project, activeScenarioId: next.id, scenarios };
}
