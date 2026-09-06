export interface SpDisplayPoint {
  readonly frame: number;
  readonly value: number;
  readonly source?: 'autoRecovery';
}

/** 只补绘图锚点，不重算技力。自动恢复回执描述该帧区间，其余变化在记录帧瞬时发生。 */
export function spDisplayPoints(
  points: readonly SpDisplayPoint[],
  startFrame: number,
  endFrame: number,
): readonly SpDisplayPoint[] {
  const first = points[0];
  if (first === undefined) return [];
  const result: SpDisplayPoint[] = [];
  if (startFrame < first.frame) result.push({ frame: startFrame, value: first.value });
  for (const point of points) {
    const previous = result.at(-1);
    if (previous !== undefined && previous.value !== point.value) {
      const beforeFrame = point.source === 'autoRecovery' ? point.frame - 1 : point.frame;
      if (previous.frame < beforeFrame) result.push({ frame: beforeFrame, value: previous.value });
    }
    result.push(point);
  }
  const last = result.at(-1)!;
  if (last.frame < endFrame) result.push({ frame: endFrame, value: last.value });
  return result;
}
