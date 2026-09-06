import { describe, expect, it } from 'vitest';
import {
  monitorSectionBodyMinimums,
  MONITOR_SECTION_TOPBAR_HEIGHT,
} from './monitorSectionMinimums';

describe('monitor section content minimums', () => {
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
