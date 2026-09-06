import type { BuffTimelineSegment } from '../../core/projection/buffTimelineViz';
import type { EnemyEffectMarker } from '../../core/projection/enemyEffectViz';

/** 展示分区，不推导战斗状态。附着身份来自 role，其余消费原生 HUD 元数据。
 * 旧版 ResourceMonitor 顺序：物理头顶状态、附着、异常、普通状态。
 * 未识别的状态保留在普通区，不能按图标或名称猜测。
 */
export function layoutEnemyStatusRows<T extends BuffTimelineSegment>(
  buffs: readonly T[],
  markers: readonly EnemyEffectMarker[],
  attachmentIds: ReadonlySet<string>,
) {
  const lanes = new Map<T, number>();
  const groups: T[][] = [[], [], [], []];
  for (const buff of buffs) {
    const group = attachmentIds.has(buff.buffId)
      ? 1
      : buff.showInHeadBarAttached === true
        ? 0
        : buff.iconStyleInSquad === 'SpellAbnormal'
          ? 2
          : 3;
    groups[group]!.push(buff);
  }
  let offset = 0;
  let attachmentRow = 1;
  let anomalyRow = 2;
  for (let group = 0; group < groups.length; group++) {
    if (group === 1) attachmentRow = offset;
    if (group === 2) anomalyRow = offset;
    const ends: number[] = [];
    for (const buff of groups[group]!.sort((a, b) => a.startFrame - b.startFrame)) {
      // 单一附着槽的切段固定在同一行；叠层/刷新不能被其他 Buff 挤走。
      let lane = group === 1 ? 0 : ends.findIndex(end => end <= buff.startFrame);
      if (lane < 0) lane = ends.length;
      ends[lane] = buff.durationEndFrame ?? buff.endFrame;
      lanes.set(buff, offset + lane);
    }
    // 空物理、附着、异常区也保留一行，与旧版分区顺序一致。
    offset += Math.max(group < 3 ? 1 : 0, ends.length);
  }
  // 旧版同一分区同一时刻的瞬时图标横向错开，不另挤出垂直行。
  const slots = new Map<string, number>();
  const markerPositions = markers.map(marker => {
    const row = marker.kind === 'reactionConsumed' ? anomalyRow : attachmentRow;
    const key = `${row}:${marker.frame}`;
    const slot = slots.get(key) ?? 0;
    slots.set(key, slot + 1);
    return { row, slot };
  });
  return { lanes, markerPositions, rowCount: offset };
}
