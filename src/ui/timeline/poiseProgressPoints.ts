import type { PoiseCurve } from '../../core/projection/poiseCurves';
import type { ResourceCurvePoint } from '../../core/projection/resourceCurves';

/** 运行时存剩余抗性，旧版监控器显示已积累失衡。仅转换展示值，保留事实点身份。 */
export function poiseProgressPoints(curve: PoiseCurve): readonly ResourceCurvePoint[] {
  return curve.points.map(point => ({
    ...point,
    value: Math.max(0, Math.min(curve.maxValue, curve.maxValue - point.value)),
  }));
}
