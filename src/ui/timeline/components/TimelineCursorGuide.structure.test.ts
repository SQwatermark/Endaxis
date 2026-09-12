import { describe, expect, test } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineCursorGuide.vue?raw';

describe('TimelineCursorGuide old-editor behavior parity', () => {
  test('keeps time, SP, stagger, per-operator gauges, enemy HP, and effects as separate rows', () => {
    expect(source).toContain('class="guide-time-label"');
    expect(source).toContain('class="guide-sp-label"');
    expect(source).toContain('class="guide-stagger-label"');
    expect(source).toContain('class="guide-gauge-panel"');
    expect(source).toContain('class="guide-enemy-hp-label"');
    expect(source).toContain('class="guide-enemy-effects"');
    expect(source).toContain('v-for="effect in enemyEffects"');
    expect(source).toContain('{{ effect.layers }}');
    expect(source).toContain('+{{ enemyEffectOverflow }}');
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

  test('keeps the readout on the guide line like the old editor', () => {
    expect(source).not.toContain('is-left');
    expect(source).not.toContain('translateX(calc(-100% - 4px))');
  });

  test('keeps the guide above timeline overlays and its panel fixed below the visible ruler', () => {
    expect(editorSource).toMatch(/\.cursor-guide\s*\{[^}]*z-index: 3000;/s);
    expect(editorSource).toContain('translate3d(0, ${timelineScrollTop + 4}px, 0)');
    expect(editorSource).toContain('marqueeStyle === null');
  });

  test('uses the old integer SP and formatted enemy health display', () => {
    expect(editorSource).toContain('sp = String(Math.floor(Number(snapshot.sp.current) || 0))');
    expect(editorSource).toContain('.toLocaleString()} / ${Math.floor');
    expect(editorSource).toContain('Math.round(value * 1000) / 1000');
  });
});
