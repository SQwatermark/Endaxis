import { describe, expect, it } from 'vitest';
import { spDisplayPoints } from './resourceCurveDisplay';

describe('SP display points', () => {
  it('places preparation deductions and refunds at their exact frames without changing raw markers', () => {
    const input = [
      { frame: -60, value: 300 },
      { frame: -30, value: 200 },
      { frame: -30, value: 230 },
    ];
    expect(spDisplayPoints(input, -150, 600)).toEqual([
      { frame: -150, value: 300 },
      input[0],
      { frame: -30, value: 300 },
      input[1],
      input[2],
      { frame: 600, value: 230 },
    ]);
    expect(input).toHaveLength(3);
  });
  it('holds during recovery pauses, then slopes only across recorded recovery frames', () => {
    const input = [
      { frame: 30, value: 200 },
      { frame: 61, value: 201, source: 'autoRecovery' as const },
      { frame: 62, value: 202, source: 'autoRecovery' as const },
    ];
    expect(spDisplayPoints(input, 30, 90)).toEqual([
      input[0],
      { frame: 60, value: 200 },
      input[1],
      input[2],
      { frame: 90, value: 202 },
    ]);
  });
});
