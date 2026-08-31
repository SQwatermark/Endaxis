import { describe, expect, test } from 'vitest';
import source from './TimelineCursorGuide.vue?raw';

describe('TimelineCursorGuide old-editor behavior parity', () => {
  test('keeps time, SP, stagger, per-operator gauges, and enemy HP as separate rows', () => {
    expect(source).toContain('class="guide-time-label"');
    expect(source).toContain('class="guide-sp-label"');
    expect(source).toContain('class="guide-stagger-label"');
    expect(source).toContain('class="guide-gauge-panel"');
    expect(source).toContain('class="guide-enemy-hp-label"');
  });

  test('renders operator gauges as a colored two-column current/max table', () => {
    expect(source).toContain('v-for="row in gauges"');
    expect(source).toContain("'--row-color': row.color");
    expect(source).toContain('row.current');
    expect(source).toContain('row.max');
    expect(source).toContain("{ 'is-full': row.isFull }");
  });

  test('omits unavailable simulation rows instead of inventing fallback values', () => {
    expect(source).toContain('v-if="sp !== null"');
    expect(source).toContain('v-if="poise !== null"');
    expect(source).toContain('v-if="enemyHealth !== null"');
    expect(source).toContain('v-if="gauges.length > 0"');
  });

  test('can flip the readout to the left of the guide near the viewport edge', () => {
    expect(source).toContain(':class="`is-${align}`"');
    expect(source).toContain('.timeline-cursor-guide-panel.is-left');
    expect(source).toContain('translateX(calc(-100% - 4px))');
  });
});
