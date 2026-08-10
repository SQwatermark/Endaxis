/**
 * 负责复制、粘贴时间轴动作及其内部身份图。
 * 剪贴板属于编辑器临时状态；粘贴会为动作、调度、命中、展示条和内部连线重新分配 ID。
 */
import type {
  ActionSequenceDocument,
  CombatStepDocument,
  ConnectionDocument,
  ConnectionEndpoint,
  ScenarioDocument,
  SkillCastDocument,
  TrackIndex,
} from '../../core/project/schema';
import type { TimelineDocumentIdAllocator } from './placeSkillGroup';

interface ClipboardCast {
  readonly trackIndex: TrackIndex;
  readonly cast: SkillCastDocument;
}

export interface TimelineActionClipboard {
  readonly originFrame: number;
  readonly casts: readonly ClipboardCast[];
  readonly connections: readonly ConnectionDocument[];
}

export interface PasteTimelineActionsResult {
  readonly scenario: ScenarioDocument;
  readonly skillCastIds: readonly string[];
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map(cloneValue) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)]),
    ) as T;
  }
  return value;
}

export function copyTimelineActions(
  scenario: ScenarioDocument,
  selectedIds: ReadonlySet<string>,
): TimelineActionClipboard | null {
  const casts = scenario.tracks.flatMap((track, trackIndex) =>
    track === null
      ? []
      : track.skillCasts
          .filter(cast => selectedIds.has(cast.id))
          .map(cast => ({ trackIndex: trackIndex as TrackIndex, cast: cloneValue(cast) })),
  );
  if (casts.length === 0) return null;

  const copiedIds = new Set(casts.map(entry => entry.cast.id));
  return {
    originFrame: Math.min(...casts.map(entry => entry.cast.placement.startFrame)),
    casts,
    connections: scenario.connections
      .filter(
        connection =>
          copiedIds.has(connection.from.skillCastId) && copiedIds.has(connection.to.skillCastId),
      )
      .map(cloneValue),
  };
}

function cloneSequence(
  sequence: ActionSequenceDocument,
  sourceCastId: string,
  ids: TimelineDocumentIdAllocator,
  hitIds: Map<string, string>,
): ActionSequenceDocument {
  return {
    steps: sequence.steps.map(step => cloneStep(step, sourceCastId, ids, hitIds)),
  };
}

function cloneStep(
  step: CombatStepDocument,
  sourceCastId: string,
  ids: TimelineDocumentIdAllocator,
  hitIds: Map<string, string>,
): CombatStepDocument {
  if (step.kind === 'conditional') {
    return {
      ...cloneValue(step),
      whenTrue: cloneSequence(step.whenTrue, sourceCastId, ids, hitIds),
      ...(step.whenFalse === undefined
        ? {}
        : { whenFalse: cloneSequence(step.whenFalse, sourceCastId, ids, hitIds) }),
    };
  }
  if (step.kind === 'once') {
    return {
      ...cloneValue(step),
      body: cloneSequence(step.body, sourceCastId, ids, hitIds),
    };
  }
  if (step.kind === 'dealDamage' || step.kind === 'dealFixedDamage') {
    const hitId = ids.allocate('hit');
    hitIds.set(`${sourceCastId}\0${step.hitId}`, hitId);
    return { ...cloneValue(step), hitId };
  }
  return cloneValue(step);
}

function remapEndpoint(
  endpoint: ConnectionEndpoint,
  castIds: ReadonlyMap<string, string>,
  hitIds: ReadonlyMap<string, string>,
): ConnectionEndpoint | null {
  const skillCastId = castIds.get(endpoint.skillCastId);
  if (skillCastId === undefined) return null;
  if (endpoint.kind === 'skillCast') return { ...endpoint, skillCastId };
  const hitId = hitIds.get(`${endpoint.skillCastId}\0${endpoint.hitId}`);
  return hitId === undefined ? null : { ...endpoint, skillCastId, hitId };
}

export function pasteTimelineActions(
  scenario: ScenarioDocument,
  clipboard: TimelineActionClipboard,
  startFrame: number,
  ids: TimelineDocumentIdAllocator,
): PasteTimelineActionsResult {
  if (!Number.isInteger(startFrame) || startFrame < 0) {
    throw new RangeError('startFrame must be a non-negative integer');
  }
  if (clipboard.casts.length === 0) return { scenario, skillCastIds: [] };

  const castIds = new Map<string, string>();
  const hitIds = new Map<string, string>();
  for (const entry of clipboard.casts) {
    castIds.set(entry.cast.id, ids.allocate('skillCast'));
  }

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  const createdIds: string[] = [];
  for (const entry of clipboard.casts) {
    const track = tracks[entry.trackIndex];
    if (track === null) throw new Error(`track ${entry.trackIndex} is empty`);
    const skillCastId = castIds.get(entry.cast.id)!;
    const scheduledSequences = entry.cast.editable.scheduledSequences.map(sequence => ({
      ...cloneValue(sequence),
      id: ids.allocate('scheduledSequence'),
      sequence: cloneSequence(sequence.sequence, entry.cast.id, ids, hitIds),
    }));
    const customBars = entry.cast.editable.customBars.map(bar => ({
      ...cloneValue(bar),
      id: ids.allocate('customBar'),
    }));
    const cast: SkillCastDocument = {
      ...cloneValue(entry.cast),
      id: skillCastId,
      placement: {
        startFrame: startFrame + entry.cast.placement.startFrame - clipboard.originFrame,
      },
      editable: { ...cloneValue(entry.cast.editable), scheduledSequences, customBars },
    };
    tracks[entry.trackIndex] = { ...track, skillCasts: [...track.skillCasts, cast] };
    createdIds.push(skillCastId);
  }

  const connections = [...scenario.connections];
  for (const connection of clipboard.connections) {
    const from = remapEndpoint(connection.from, castIds, hitIds);
    const to = remapEndpoint(connection.to, castIds, hitIds);
    if (from === null || to === null) continue;
    connections.push({ ...connection, id: ids.allocate('connection'), from, to });
  }
  return { scenario: { ...scenario, tracks, connections }, skillCastIds: createdIds };
}
