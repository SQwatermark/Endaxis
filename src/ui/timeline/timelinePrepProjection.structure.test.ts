import { describe, expect, it } from 'vitest';
import editor from './TimelineEditor.vue?raw';
import buffs from './results/TimelineBuffBands.vue?raw';
import combo from './results/TimelineComboWindowBands.vue?raw';
import connections from './interaction/TimelineConnectionLayer.vue?raw';
import enemy from './results/TimelineEnemyEffects.vue?raw';
import passive from './results/TimelineOperatorPassiveUiBands.vue?raw';
import resources from './results/TimelineResourceCurves.vue?raw';
import dilation from './results/TimelineTimeDilationBands.vue?raw';
import gauge from './results/TimelineTrackGauge.vue?raw';

describe('collapsed prep projection integration', () => {
  it('passes the persisted projection mode to every horizontal timeline layer', () => {
    expect(editor.match(/:prep-expanded="scenario\.editor\.prepExpanded"/g)).toHaveLength(11);
    for (const source of [buffs, combo, connections, enemy, passive, resources, dilation, gauge]) {
      expect(source).toContain('prepExpanded: boolean');
      expect(source).toContain('frameToTimelinePx(');
    }
  });

  it('uses inverse projection for pointer edits and preserves a dedicated old-style entry', () => {
    expect(editor).toContain('timelinePxToFrame(');
    expect(editor).toContain('class="prep-collapsed-entry"');
    expect(editor).toContain('class="prep-expanded-collapse"');
    expect(editor).toContain('setPrepExpanded(true)');
    expect(editor).toContain('setPrepExpanded(false)');
    expect(editor).not.toContain('displayedTimelinePrepFrames * pxPerFrame');
  });
});
