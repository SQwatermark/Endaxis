import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import source from './TimelineCornerToolbar.vue?raw';

describe('TimelineCornerToolbar legacy behavior parity', () => {
  it('exposes working initial gauge, cursor, box selection, snap, connection and Buff layout tools', () => {
    expect(source).toContain("emit('cycleInitialGauge')");
    expect(source).toContain("emit('toggleCursorGuide')");
    expect(source).toContain("emit('toggleBoxSelect')");
    expect(source).toContain("emit('toggleConnectionTool')");
    expect(source).toContain("emit('toggleBuffLayout')");
    expect(source).not.toContain('class="mini-tool-button" disabled');
  });

  it('supports the legacy right-click unified initial energy editor', () => {
    expect(source).toContain('@contextmenu="toggleGaugeEditor"');
    expect(source).toContain("emit('setUnifiedInitialGauge', value)");
    expect(editorSource).toContain(
      '@set-unified-initial-gauge="setUnifiedTrackInitialUltimateEnergy"',
    );
  });

  it('keeps icon-only tools keyboard-readable without changing their visual layout', () => {
    expect(source).toContain(':aria-label="labels.initialGauge"');
    expect(source).toContain(':aria-pressed="cursorGuideEnabled"');
    expect(source).toContain(':aria-pressed="boxSelectEnabled"');
    expect(source).toContain(':aria-pressed="connectionToolEnabled"');
    expect(source).toContain('@keydown.shift.enter.prevent.stop="toggleGaugeEditor"');
    expect(source).toContain(':aria-label="labels.zoom"');
    expect(source).toContain('<circle cx="12" cy="12" r="10" />');
    expect(source).toContain('<line x1="12" y1="6" x2="12" y2="18" />');
    expect(editorSource).toContain('const showCursorGuide = ref(false)');
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
    expect(source).toContain('color-mix(in srgb, var(--ea-gold) 10%, var(--ea-fill-input))');
  });
});
