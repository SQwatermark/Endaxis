/**
 * 从逻辑时间采样回执生成项目时间与实际战斗时间的双向映射。
 * 投影只解释运行时事实，不重新计算时间膨胀曲线或实例优先级。
 */
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';

export interface TimelineTimePoint {
  readonly actualFrame: number;
  readonly logicalFrame: number;
}

export interface TimelineTimeMapping {
  readonly points: readonly TimelineTimePoint[];
  readonly logicalFrameAt: (actualFrame: number) => number;
  readonly actualFrameAt: (logicalFrame: number) => number;
}

export function projectTimelineTimeMapping(
  entries: readonly CombatReceiptEntry[],
  endFrame: number,
): TimelineTimeMapping {
  if (!Number.isInteger(endFrame) || endFrame < 0) {
    throw new RangeError('endFrame must be a non-negative integer');
  }
  const points: TimelineTimePoint[] = [{ actualFrame: 0, logicalFrame: 0 }];
  for (const entry of entries) {
    if (entry.event !== 'TimelineTimeSampled') continue;
    const logicalFrame = entry.data?.logicalFrame;
    if (typeof logicalFrame !== 'number' || !Number.isFinite(logicalFrame)) {
      throw new Error(`receipt ${entry.sequence} 'TimelineTimeSampled' has no finite logicalFrame`);
    }
    const previous = points.at(-1)!;
    if (entry.frame <= previous.actualFrame || logicalFrame < previous.logicalFrame) {
      throw new Error(`receipt ${entry.sequence} has a non-monotonic timeline time sample`);
    }
    points.push({ actualFrame: entry.frame, logicalFrame });
  }
  const last = points.at(-1)!;
  if (last.actualFrame < endFrame) {
    points.push({
      actualFrame: endFrame,
      logicalFrame: last.logicalFrame + endFrame - last.actualFrame,
    });
  }
  const frozenPoints = Object.freeze(points.map(point => Object.freeze({ ...point })));
  return Object.freeze({
    points: frozenPoints,
    logicalFrameAt: (actualFrame: number) => interpolateByActualFrame(frozenPoints, actualFrame),
    actualFrameAt: (logicalFrame: number) => interpolateByLogicalFrame(frozenPoints, logicalFrame),
  });
}

function interpolateByActualFrame(
  points: readonly TimelineTimePoint[],
  actualFrame: number,
): number {
  requireFiniteNonNegative(actualFrame, 'actual frame');
  const [left, right] = surroundingPoints(points, actualFrame, point => point.actualFrame);
  return interpolate(
    left.actualFrame,
    left.logicalFrame,
    right.actualFrame,
    right.logicalFrame,
    actualFrame,
  );
}

function interpolateByLogicalFrame(
  points: readonly TimelineTimePoint[],
  logicalFrame: number,
): number {
  requireFiniteNonNegative(logicalFrame, 'logical frame');
  const [left, right] = surroundingPoints(points, logicalFrame, point => point.logicalFrame);
  if (right.logicalFrame === left.logicalFrame) return left.actualFrame;
  return interpolate(
    left.logicalFrame,
    left.actualFrame,
    right.logicalFrame,
    right.actualFrame,
    logicalFrame,
  );
}

function surroundingPoints(
  points: readonly TimelineTimePoint[],
  value: number,
  select: (point: TimelineTimePoint) => number,
): readonly [TimelineTimePoint, TimelineTimePoint] {
  for (let index = 1; index < points.length; index += 1) {
    const right = points[index]!;
    if (select(right) >= value) return [points[index - 1]!, right];
  }
  const last = points.at(-1)!;
  return [last, last];
}

function interpolate(
  leftX: number,
  leftY: number,
  rightX: number,
  rightY: number,
  value: number,
): number {
  if (rightX === leftX) return leftY;
  return leftY + ((value - leftX) / (rightX - leftX)) * (rightY - leftY);
}

function requireFiniteNonNegative(value: number, label: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative finite number`);
  }
}
