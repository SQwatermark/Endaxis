import type { PublishedScenarioSimulation } from './useScenarioSimulation';
import type { TimelineBattleLogSnapshot } from './timelineBattleLogProjection';
import {
  projectTimelineEditor,
  type TimelineOperatorIndex,
  type TimelineSkillCastViewModel,
  type TimelineTrackViewModel,
} from './timelineEditorViewModel';

export interface PublishedOperatorName {
  readonly slug: string | null;
  readonly assetSlug: string | null;
  readonly displayName: string | undefined;
}

/** 捕获不随编辑漂移的事实；显示时允许使用当前语言，无需重跑模拟或刷新日志。 */
export function capturePublishedBattleLog(
  published: PublishedScenarioSimulation,
  index: TimelineOperatorIndex,
  labels: {
    skill: (cast: TimelineSkillCastViewModel, track: TimelineTrackViewModel) => string;
    operator: (name: PublishedOperatorName) => string;
  },
): TimelineBattleLogSnapshot {
  const view = projectTimelineEditor(published.scenario, index);
  const tracks = view.tracks.map(track => {
    const definition = track.operatorSlug === null ? null : index.getOperator(track.operatorSlug);
    return {
      track,
      name: {
        slug: track.operatorSlug,
        assetSlug: definition?.assetSlug ?? track.operatorSlug,
        displayName: definition?.displayName,
      },
    };
  });
  return {
    entries: published.run.receiptEntries,
    resolveCastOwners: () =>
      tracks.flatMap(({ track, name }) =>
        track.skillCasts.map(cast => ({
          castId: cast.id,
          sourceId: track.operatorInstanceId,
          label: labels.skill(cast, track),
          operatorLabel: labels.operator(name),
        })),
      ),
  };
}
