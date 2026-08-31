export type TimelineBuffLayoutMode = 'compact' | 'loose';

export interface TimelineTrackEffectLayoutInput {
  readonly mode: TimelineBuffLayoutMode;
  readonly upperLaneCount: number;
  readonly lowerLaneCount: number;
  /** 紧凑模式的本地 UI 高度覆盖；松散模式不消费它。 */
  readonly compactHeight?: number;
}

export interface TimelineTrackEffectLayout {
  readonly height: number;
  readonly actionTop: number;
}

export const TIMELINE_TRACK_BASE_HEIGHT = 160;
export const TIMELINE_ACTION_BASE_TOP = 55;
export const TIMELINE_BUFF_LANE_PITCH = 22;
export const TIMELINE_TRACK_MIN_HEIGHT = 66;

const BUFF_LAYER_MARGIN = 8;

/**
 * 旧版松散 Buff 排版的 Next 几何投影。
 *
 * Buff 过量时两种排布模式都必须扩展轨道与整张画布，不能压缩、隐藏或裁切。
 * 模式只保留用户的排布偏好与紧凑高度基线；实际所需上下留白由当前最大 lane 数决定，
 * 并取两侧较大值作对称扩展，使 50px 动作 lane 和轨道身份始终垂直居中。
 */
export function projectTimelineTrackEffectLayout(
  input: TimelineTrackEffectLayoutInput,
): TimelineTrackEffectLayout {
  const baselineHeight = Math.max(
    TIMELINE_TRACK_MIN_HEIGHT,
    Math.round(
      input.mode === 'compact'
        ? (input.compactHeight ?? TIMELINE_TRACK_BASE_HEIGHT)
        : TIMELINE_TRACK_BASE_HEIGHT,
    ),
  );
  const baselinePadding = (baselineHeight - 50) / 2;
  const upperNeed =
    input.upperLaneCount > 0
      ? Math.floor(input.upperLaneCount) * TIMELINE_BUFF_LANE_PITCH + BUFF_LAYER_MARGIN
      : 0;
  const lowerNeed =
    input.lowerLaneCount > 0
      ? Math.floor(input.lowerLaneCount) * TIMELINE_BUFF_LANE_PITCH + BUFF_LAYER_MARGIN
      : 0;
  const padding = Math.max(baselinePadding, upperNeed, lowerNeed);

  return { height: 50 + padding * 2, actionTop: padding };
}

/** 拖动相邻轨道分隔线时保持两行总高度不变；该状态只属于本地视图。 */
export function resizeTimelineTrackPair(
  heights: readonly number[],
  upperIndex: number,
  delta: number,
): readonly number[] {
  if (!Number.isInteger(upperIndex) || upperIndex < 0 || upperIndex + 1 >= heights.length) {
    return heights;
  }
  const upper = heights[upperIndex] ?? TIMELINE_TRACK_BASE_HEIGHT;
  const lower = heights[upperIndex + 1] ?? TIMELINE_TRACK_BASE_HEIGHT;
  const pairTotal = Math.max(TIMELINE_TRACK_MIN_HEIGHT * 2, upper + lower);
  const nextUpper = Math.min(
    pairTotal - TIMELINE_TRACK_MIN_HEIGHT,
    Math.max(TIMELINE_TRACK_MIN_HEIGHT, Math.round(upper + delta)),
  );
  const next = [...heights];
  next[upperIndex] = nextUpper;
  next[upperIndex + 1] = pairTotal - nextUpper;
  return next;
}
