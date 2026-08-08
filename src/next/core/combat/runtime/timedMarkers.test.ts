import { describe, expect, it } from 'vitest';
import { CombatClock } from './combatClock';
import { TimedMarkerContainer } from './timedMarkers';

describe('TimedMarkerContainer', () => {
  it('keeps duplicate ids independent and filters expired entries by the shared clock', () => {
    const clock = new CombatClock();
    const markers = new TimedMarkerContainer('operator', clock);
    const first = markers.add('voice', 1 / 30);
    markers.add('voice', 2 / 30);

    expect(markers.has('voice')).toBe(true);
    first.remove();
    expect(markers.has('voice')).toBe(true);
    clock.advanceFrame();
    clock.advanceFrame();
    expect(markers.has('voice')).toBe(true);
    clock.advanceFrame();
    expect(markers.has('voice')).toBe(false);
  });
});
