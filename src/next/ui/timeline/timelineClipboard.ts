/**
 * 负责复制、粘贴时间轴动作及其内部身份图。
 * 剪贴板属于编辑器临时状态；粘贴会为动作、调度、命中、展示条和内部连线重新分配 ID。
 */
import type {
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

function remapEndpoint(
  endpoint: ConnectionEndpoint,
  castIds: ReadonlyMap<string, string>,
): ConnectionEndpoint | null {
  const skillCastId = castIds.get(endpoint.skillCastId);
  if (skillCastId === undefined) return null;
  return { ...endpoint, skillCastId };
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
  for (const entry of clipboard.casts) {
    castIds.set(entry.cast.id, ids.allocate('skillCast'));
  }

  const tracks = [...scenario.tracks] as ScenarioDocument['tracks'];
  const createdIds: string[] = [];
  for (const entry of clipboard.casts) {
    const track = tracks[entry.trackIndex];
    if (track === null) throw new Error(`track ${entry.trackIndex} is empty`);
    const skillCastId = castIds.get(entry.cast.id)!;
    const cast: SkillCastDocument = {
      ...cloneValue(entry.cast),
      id: skillCastId,
      placement: {
        startFrame: startFrame + entry.cast.placement.startFrame - clipboard.originFrame,
      },
    };
    tracks[entry.trackIndex] = { ...track, skillCasts: [...track.skillCasts, cast] };
    createdIds.push(skillCastId);
  }

  const connections = [...scenario.connections];
  for (const connection of clipboard.connections) {
    const from = remapEndpoint(connection.from, castIds);
    const to = remapEndpoint(connection.to, castIds);
    if (from === null || to === null) continue;
    connections.push({ ...connection, id: ids.allocate('connection'), from, to });
  }
  return { scenario: { ...scenario, tracks, connections }, skillCastIds: createdIds };
}
