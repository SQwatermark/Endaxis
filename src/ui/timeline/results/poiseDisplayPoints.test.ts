import { expect, it } from 'vitest';
import { poiseDisplayPoints } from './resourceCurveDisplay';

it('holds buildup between hits, preserves same-frame changes and extends recovery through the axis end', () => {
  const input = [
    { frame: -30, value: 0 },
    { frame: 30, value: 100 },
    { frame: 30, value: 300 },
    { frame: 90, value: 0 },
  ];
  expect(poiseDisplayPoints(input, 300)).toEqual([
    input[0],
    { frame: 30, value: 0 },
    input[1],
    input[2],
    { frame: 90, value: 300 },
    input[3],
    { frame: 300, value: 0 },
  ]);
  expect(input).toHaveLength(4);
});
