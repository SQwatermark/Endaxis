import { describe, expect, it } from 'vitest';
import {
  monitorSectionBodyMinimums,
  MONITOR_SECTION_TOPBAR_HEIGHT,
  resizeMonitorSectionBodies,
} from './monitorSectionMinimums';

describe('monitor section content minimums', () => {
  it('starts from constrained visible heights without moving the third section', () => {
    const bodies = { affliction: 202, poise: 40, sp: 100 };
    const minimums = monitorSectionBodyMinimums(216);
    expect(resizeMonitorSectionBodies(bodies, 'affliction', 'poise', 0, minimums)).toEqual(bodies);
    expect(resizeMonitorSectionBodies(bodies, 'affliction', 'poise', 10, minimums)).toEqual({
      affliction: 212,
      poise: 30,
      sp: 100,
    });
    expect(bodies).toEqual({ affliction: 202, poise: 40, sp: 100 });
  });

  it('clamps both drag directions to current content minimums', () => {
    const bodies = { affliction: 202, poise: 40, sp: 100 };
    const minimums = monitorSectionBodyMinimums(216);
    expect(resizeMonitorSectionBodies(bodies, 'affliction', 'poise', -1000, minimums)).toEqual(
      bodies,
    );
    expect(resizeMonitorSectionBodies(bodies, 'affliction', 'poise', 1000, minimums)).toEqual({
      affliction: 216,
      poise: 26,
      sp: 100,
    });
  });

  it('resizes across a collapsed middle section without assigning it a height', () => {
    expect(
      resizeMonitorSectionBodies(
        { affliction: 100, sp: 100 },
        'affliction',
        'sp',
        20,
        monitorSectionBodyMinimums(),
      ),
    ).toEqual({ affliction: 120, sp: 80 });
  });

  it('preserves pair total when the viewport cannot fit both minimums', () => {
    const result = resizeMonitorSectionBodies(
      { poise: 10, sp: 20 },
      'poise',
      'sp',
      200,
      monitorSectionBodyMinimums(),
    );
    expect(result.poise! + result.sp!).toBeCloseTo(30);
    expect(result.poise).toBeCloseTo(10);
    expect(result.sp).toBeCloseTo(20);
  });
  it('preserves legacy body minimums without a status height report', () => {
    expect(monitorSectionBodyMinimums()).toEqual({ affliction: 46, poise: 26, sp: 52 });
  });

  it.each([84, 106, 216, 436])('reserves all reported status rows at %ipx', height => {
    const minimums = monitorSectionBodyMinimums(height);
    expect(minimums.affliction + MONITOR_SECTION_TOPBAR_HEIGHT).toBe(height);
    expect(minimums.poise).toBe(26);
    expect(minimums.sp).toBe(52);
  });

  it('does not shrink below the legacy status minimum', () => {
    expect(monitorSectionBodyMinimums(0).affliction).toBe(46);
  });
});
