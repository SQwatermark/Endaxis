import { describe, expect, it } from 'vitest';
import {
  createDefaultNextTimelineViewLayers,
  normalizeNextTimelineViewLayers,
  toggleNextTimelineViewLayer,
} from './timelineViewLayers';

describe('timeline view layers', () => {
  it('defaults every implemented layer to visible and preserves forward-compatible settings', () => {
    expect(Object.values(createDefaultNextTimelineViewLayers()).every(Boolean)).toBe(true);
    expect(normalizeNextTimelineViewLayers({ hitMarkers: false, unknown: false })).toMatchObject({
      hitMarkers: false,
      upperEffects: true,
      lowerBuffs: true,
      comboWindows: true,
      effectLinks: true,
    });
  });

  it('toggles immutably', () => {
    const original = createDefaultNextTimelineViewLayers();
    const updated = toggleNextTimelineViewLayer(original, 'gauge');
    expect(updated.gauge).toBe(false);
    expect(original.gauge).toBe(true);
  });
});
