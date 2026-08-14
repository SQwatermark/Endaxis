import { describe, expect, it } from 'vitest';
import type { TimeScaleCurveKeyDefinition } from '../../game-data/operatorDefinition';
import { compileTimeScaleCurve } from './timeScaleCurve';

function key(
  time: number,
  value: number,
  overrides: Partial<TimeScaleCurveKeyDefinition> = {},
): TimeScaleCurveKeyDefinition {
  return {
    time,
    value,
    inTangent: 0,
    outTangent: 0,
    weightedMode: 0,
    inWeight: 0,
    outWeight: 0,
    ...overrides,
  };
}

describe('compileTimeScaleCurve', () => {
  it('clamps outside the key range and evaluates ordinary Hermite weights', () => {
    const curve = compileTimeScaleCurve([
      key(0, 0, { outTangent: 1 }),
      key(1, 1, { inTangent: 1 }),
    ]);
    expect(curve(-1)).toBe(0);
    expect(curve(0.5)).toBeCloseTo(0.5);
    expect(curve(2)).toBe(1);
  });

  it('uses explicit Unity in/out weights', () => {
    const curve = compileTimeScaleCurve([
      key(0, 0, { outTangent: 2, weightedMode: 2, outWeight: 0.75 }),
      key(1, 1, { inTangent: -1, weightedMode: 1, inWeight: 0.1 }),
    ]);
    expect(curve(0.5)).toBeCloseTo(0.860144, 5);
  });

  it('rejects unordered keys instead of silently changing the curve', () => {
    expect(() => compileTimeScaleCurve([key(1, 1), key(1, 0)])).toThrow('strictly increasing');
  });
});
