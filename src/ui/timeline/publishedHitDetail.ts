import type { PublishedScenarioSimulation } from './useScenarioSimulation';
import { projectTimelineHitDetailEntries } from './timelineHitEffects';

/** 技能身份跨换轨保持稳定；查看旧结果不能使用当前轨道下标查找旧面板。 */
export function projectPublishedHitDetail(
  published: PublishedScenarioSimulation | null,
  target: { castId: string; hitId: string } | null,
) {
  if (published === null || target === null) return null;
  for (const track of published.scenario.tracks) {
    const cast = track?.skillCasts.find(candidate => candidate.id === target.castId);
    if (track === null || cast === undefined) continue;
    return {
      track,
      cast,
      entries: projectTimelineHitDetailEntries(published.run.receiptEntries, cast.id, target.hitId),
      operatorPanel:
        published.run.operatorPanels.find(panel => panel.operatorId === track.id) ?? null,
    };
  }
  return null;
}
