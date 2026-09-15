import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import bandsSource from './TimelineOperatorPassiveUiBands.vue?raw';
import detailSource from './TimelineOperatorPassiveUiDetailDialog.vue?raw';
import statusSegmentSource from './TimelineStatusSegment.vue?raw';

describe('operator passive UI timeline retention', () => {
  it('keeps passive UI projection and its dedicated timeline component wired', () => {
    expect(editorSource).toContain('projectOperatorPassiveUiTimelineViz(');
    expect(editorSource).toContain(
      ':segments="operatorPassiveUiSegmentsForTarget(track.operatorInstanceId)"',
    );
    expect(editorSource).toContain(
      '...operatorPassiveUiSegmentsForTarget(targetId).map(segment => segment.lane + 1)',
    );
  });

  it('renders numeric values as duration segments rather than a cursor-only snapshot', () => {
    expect(bandsSource).toContain('TimelineStatusSegment');
    expect(bandsSource).toContain('interactive');
    expect(bandsSource).toContain('@activate="emit(\'open-detail\', item, item.name)"');
    expect(bandsSource).toContain(':count="item.kind === \'numeric\' ? item.value : null"');
    expect(bandsSource).toContain('segment.value');
    expect(bandsSource).toContain('segment.endFrame');
    expect(statusSegmentSource).toContain('timeline-status-segment__count');
    expect(statusSegmentSource).toContain('right: -3px');
    expect(statusSegmentSource).toContain('bottom: -3px');
  });

  it('preserves each native HUD aspect ratio instead of clipping every appearance to a square', () => {
    expect(bandsSource).toContain('const ICON_HEIGHT = 16');
    expect(bandsSource).toContain('(skin.width / skin.height) * ICON_HEIGHT + 2');
    expect(bandsSource).toContain(':icon-width="item.iconWidth"');
    expect(bandsSource).toContain('bare-icon');
    expect(statusSegmentSource).toContain('width: var(--timeline-status-icon-width)');
    expect(statusSegmentSource).toContain('height: 18px');
  });

  it('makes the icon and duration segment one keyboard-accessible tooltip trigger', () => {
    expect(statusSegmentSource).toContain('<EaTooltip');
    expect(statusSegmentSource).toContain('class="timeline-status-segment__body"');
    expect(statusSegmentSource).toContain('@click.stop="interactive && emit(\'activate\')"');
    expect(statusSegmentSource).toContain(
      '.timeline-status-segment__body:hover .timeline-status-segment__duration',
    );
    expect(editorSource).toContain('@open-detail="openOperatorPassiveUiDetail"');
    expect(editorSource).toContain('<TimelineOperatorPassiveUiDetailDialog');
    expect(detailSource).toContain("segment.kind === 'numeric'");
    expect(detailSource).toContain("segment.kind === 'buffProgress'");
    expect(detailSource).toContain('segment.reserveArrows');
  });
});
