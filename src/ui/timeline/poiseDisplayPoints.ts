export interface PoiseDisplayPoint {
  readonly frame: number;
  readonly value: number;
}

/** 每次原生失衡结算都是瞬时变化；绘图先保持旧值，再在同帧跳到新值。 */
export function poiseDisplayPoints(
  points: readonly PoiseDisplayPoint[],
  endFrame: number,
): readonly PoiseDisplayPoint[] {
  const result: PoiseDisplayPoint[] = [];
  for (const point of points) {
    const previous = result.at(-1);
    if (previous !== undefined && previous.frame < point.frame && previous.value !== point.value) {
      result.push({ frame: point.frame, value: previous.value });
    }
    result.push(point);
  }
  const last = result.at(-1);
  if (last !== undefined && last.frame < endFrame)
    result.push({ frame: endFrame, value: last.value });
  return result;
}
