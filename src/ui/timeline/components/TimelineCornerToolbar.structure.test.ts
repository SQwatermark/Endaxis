import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineCornerToolbar.vue?raw';
import header from './TimelineHeaderToolbar.vue?raw';

describe('TimelineCornerToolbar legacy behavior parity', () => {
  it('keeps only gauge and snap above zoom and moves tools into header menus', () => {
    expect(source).toContain("emit('cycleInitialGauge')");
    expect(header).toContain("emit('toggleCursorGuide')");
    expect(header).toContain("emit('toggleBoxSelect')");
    expect(header).toContain("emit('toggleConnectionTool')");
    expect(source).not.toContain('@click="emit(\'toggleBuffLayout\')"');
    expect(source).toContain('grid-column: span 2');
    expect(source).not.toContain('class="mini-tool-button" disabled');
  });

  it('supports the legacy right-click unified initial energy editor', () => {
    expect(source).toContain('@contextmenu="toggleGaugeEditor"');
    expect(source).toContain("emit('setUnifiedInitialGauge', value)");
    expect(editorSource).toContain(
      '@set-unified-initial-gauge="setUnifiedTrackInitialUltimateEnergy"',
    );
  });

  it('keeps the compact tools keyboard-readable without changing their visual layout', () => {
    expect(source).toContain(':aria-label="labels.initialGauge"');
    expect(header).toContain(':aria-pressed="cursorGuideEnabled"');
    expect(header).toContain(':aria-pressed="boxSelectEnabled"');
    expect(header).toContain(':aria-pressed="connectionToolEnabled"');
    expect(source).toContain('@keydown.shift.enter.prevent.stop="toggleGaugeEditor"');
    expect(source).toContain(':aria-label="labels.zoom"');
    expect(editorSource).toContain('const showCursorGuide = ref(false)');
  });

  it('shows the legacy short gauge state or a shared custom value', () => {
    expect(source).toContain('{{ initialGaugeDisplayValue }}');
    expect(editorSource).toContain('const initialUltimateEnergyDisplayValue = computed(() =>');
    expect(editorSource).toContain('values.every(value => value === values[0])');
    expect(editorSource).toContain(
      ':initial-gauge-display-value="initialUltimateEnergyDisplayValue"',
    );
  });

  it('grows the outer row, lane, and scrollable canvas for excess Buff lanes', () => {
    expect(editorSource).toContain('projectTimelineTrackEffectLayout');
    expect(editorSource).toContain('mode: buffLayoutMode.value');
    expect(
      editorSource.match(
        /trackEffectLayout\(track\.trackIndex, track\.operatorInstanceId\)\.height/g,
      ),
    ).toHaveLength(2);
    expect(editorSource).toContain(
      'trackEffectLayout(track.trackIndex, track.operatorInstanceId).actionTop',
    );
    expect(editorSource).toMatch(/\.timeline-scroll\s*\{[^}]*overflow-y: auto;/s);
    expect(editorSource).toContain('BUFF_LAYOUT_STORAGE_KEY');
  });

  it('uses the old three-column 20px controls and ten-percent active fill', () => {
    expect(source).toContain('grid-template-columns: repeat(3, minmax(0, 1fr))');
    expect(source).toContain('height: 20px');
    expect(source).toContain('gap: 4px');
    expect(source).toContain('color-mix(in srgb, var(--ea-gold) 10%, transparent)');
  });
});
