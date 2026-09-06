import type { ScenarioDocument } from '../../core/project/schema';

export type CompactSkillSelection =
  | { readonly ok: true; readonly castIds: readonly string[] }
  | { readonly ok: false; readonly reason: 'count' | 'mixed' };

/** 只整理作者选择的身份和顺序，不以显示宽度推算接续时间。 */
export function resolveCompactSkillSelection(
  scenario: ScenarioDocument,
  selectedIds: ReadonlySet<string>,
): CompactSkillSelection {
  const selected = scenario.tracks.flatMap((track, trackIndex) =>
    (track?.skillCasts ?? [])
      .filter(cast => selectedIds.has(cast.id))
      .map(cast => ({ cast, trackIndex })),
  );
  if (selected.length < 2) return { ok: false, reason: 'count' };
  if (
    selected.length !== selectedIds.size ||
    new Set(selected.map(item => item.trackIndex)).size !== 1
  )
    return { ok: false, reason: 'mixed' };
  selected.sort((a, b) => a.cast.placement.startFrame - b.cast.placement.startFrame);
  return { ok: true, castIds: selected.map(item => item.cast.id) };
}

/** 模拟无法给出完整边界时按当前块宽完成编辑，不把模拟失败变成编辑禁令。 */
export function compactSkillSelectionByWidths(
  scenario: ScenarioDocument,
  castIds: readonly string[],
  widths: ReadonlyMap<string, number>,
): ScenarioDocument {
  const casts = new Map(
    scenario.tracks.flatMap(track =>
      (track?.skillCasts ?? []).map(cast => [cast.id, cast] as const),
    ),
  );
  const first = casts.get(castIds[0] ?? '');
  if (first === undefined) return scenario;
  let frame = first.placement.startFrame;
  const starts = new Map<string, number>();
  for (const id of castIds) {
    starts.set(id, frame);
    frame += widths.get(id) ?? 0;
  }
  const result = structuredClone(scenario);
  for (const track of result.tracks)
    for (const cast of track?.skillCasts ?? []) {
      const startFrame = starts.get(cast.id);
      if (startFrame !== undefined) cast.placement.startFrame = startFrame;
    }
  return result;
}
