import { frameToTimelinePx } from './timelineGeometry';

export type TimelineOperationMarkerKind = 'skill' | 'combo' | 'ultimate' | 'switch';

export interface TimelineOperationMarkerInput {
  readonly id: string;
  readonly kind: TimelineOperationMarkerKind;
  readonly trackIndex: number;
  readonly frame: number;
  readonly durationFrames?: number;
  readonly perfect?: boolean;
}

export interface TimelineOperationMarkerLayout {
  readonly id: string;
  readonly kind: TimelineOperationMarkerKind;
  readonly label: string;
  readonly left: number;
  /** 旧版 Hold 按键帽由文字自然撑开，不把技能持续时间画成提示条。 */
  readonly width: number | null;
  readonly top: number;
  readonly height: number;
  readonly fontSize: number;
  readonly hold: boolean;
  readonly perfect: boolean;
}

interface MutableMarker extends Omit<TimelineOperationMarkerLayout, 'top' | 'height' | 'fontSize'> {
  right: number;
  rowIndex: number;
  top: number;
  height: number;
  fontSize: number;
}

function markerLabel(kind: TimelineOperationMarkerKind, trackIndex: number): string {
  const key = trackIndex + 1;
  if (kind === 'skill') return String(key);
  if (kind === 'combo') return 'E';
  if (kind === 'ultimate') return `${key} (Hold)`;
  return `F${key}`;
}

/** 复刻旧版按键帽的重叠分层；输入只使用 Next 的现实帧投影，不读写场景。 */
export function projectTimelineOperationMarkers(
  inputs: readonly TimelineOperationMarkerInput[],
  prepFrames: number,
  pxPerFrame: number,
): readonly TimelineOperationMarkerLayout[] {
  const markers: MutableMarker[] = inputs
    .map(input => {
      const left = frameToTimelinePx(input.frame, prepFrames, pxPerFrame);
      const hold = input.kind === 'ultimate';
      const width = hold ? null : input.kind === 'switch' ? 28 : 20;
      // 旧版只用技能持续区间做按键提示的分层避让；按键帽本身仍是自适应文字宽度。
      const collisionWidth = hold
        ? Math.max(42, (input.durationFrames ?? 0) * pxPerFrame)
        : input.kind === 'switch'
          ? 28
          : 24;
      return {
        id: input.id,
        kind: input.kind,
        label: markerLabel(input.kind, input.trackIndex),
        left,
        width,
        right: left + collisionWidth,
        rowIndex: 0,
        top: 0,
        height: 14,
        fontSize: 9,
        hold,
        perfect: input.kind === 'combo' && input.perfect === true,
      };
    })
    .sort((left, right) => left.left - right.left || left.id.localeCompare(right.id));

  const result: MutableMarker[] = [];
  let cluster: MutableMarker[] = [];
  let clusterRight = -1;
  const flush = () => {
    if (cluster.length === 0) return;
    const rowRights: number[] = [];
    for (const marker of cluster) {
      const reusableRow = rowRights.findIndex(right => right + 1 <= marker.left);
      marker.rowIndex = reusableRow < 0 ? rowRights.length : reusableRow;
      rowRights[marker.rowIndex] = marker.right;
    }
    const depth = rowRights.length;
    const height = depth <= 2 ? 14 : depth === 3 ? 12 : 10;
    const step = depth <= 2 ? 16 : depth === 3 ? 13 : 10;
    const fontSize = depth <= 3 ? 9 : 8;
    for (const marker of cluster) {
      marker.top = marker.rowIndex * step;
      marker.height = height;
      marker.fontSize = fontSize;
      result.push(marker);
    }
    cluster = [];
  };

  for (const marker of markers) {
    if (cluster.length === 0 || marker.left < clusterRight) {
      cluster.push(marker);
      clusterRight = Math.max(clusterRight, marker.right);
    } else {
      flush();
      cluster = [marker];
      clusterRight = marker.right;
    }
  }
  flush();
  return result.map(({ right: _right, rowIndex: _rowIndex, ...marker }) => marker);
}
