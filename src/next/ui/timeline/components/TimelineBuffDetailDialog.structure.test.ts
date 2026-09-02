import { describe, expect, it } from 'vitest';
import detailDialogSource from './TimelineBuffDetailDialog.vue?raw';
import statusSegmentSource from './TimelineStatusSegment.vue?raw';
import buffBandsSource from './TimelineBuffBands.vue?raw';

describe('Buff detail interaction structure', () => {
  it('opens one shared read-only detail dialog from the status icon', () => {
    expect(detailDialogSource).toContain('class="timeline-buff-detail-dialog"');
    expect(detailDialogSource).toContain('target.sourceName');
    expect(detailDialogSource).toContain('target.modifierSummary');
    expect(detailDialogSource).toContain('target.buffId');
    expect(statusSegmentSource).toContain('role="button"');
    expect(statusSegmentSource).toContain("emit('activate')");
    expect(buffBandsSource).toContain("emit('open-detail', item.detail)");
  });

  it('keeps the duration bar informational so clicking it cannot change timeline selection', () => {
    const durationMarkup = detailDialogSource.match(/timeline-buff-detail-dialog/)?.[0];
    expect(durationMarkup).toBeDefined();
    expect(statusSegmentSource).not.toContain(
      '@click.stop="emit(\'activate\')"\n      class="timeline-status-segment__duration"',
    );
  });
});
