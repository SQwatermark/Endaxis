import { describe, expect, it } from 'vitest';
import editorSource from './NextTimelineEditor.vue?raw';
import bandsSource from './components/TimelineOperatorPassiveUiBands.vue?raw';
import statusSegmentSource from './components/TimelineStatusSegment.vue?raw';

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
    expect(bandsSource).toContain(':count="item.kind === \'numeric\' ? item.value : null"');
    expect(bandsSource).toContain('segment.value');
    expect(bandsSource).toContain('segment.endFrame');
    expect(statusSegmentSource).toContain('timeline-status-segment__count');
    expect(statusSegmentSource).toContain('right: -3px');
    expect(statusSegmentSource).toContain('bottom: -3px');
  });

  it('contains native content inside the same 18px frame used by Buff segments', () => {
    expect(bandsSource).toContain(':height="16"');
    expect(bandsSource).toContain(':max-width="16"');
    expect(statusSegmentSource).toContain('width: 18px');
    expect(statusSegmentSource).toContain('height: 18px');
  });
});
