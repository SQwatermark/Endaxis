import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import source from './TimelineComboWindowBands.vue?raw';

describe('Next timeline combo window bands', () => {
  it('keeps the legacy start-line-end-duration layout', () => {
    expect(source).toContain('combo-window-bar-layer');
    expect(source).toContain('cw-start-mark');
    expect(source).toContain('cw-line');
    expect(source).toContain('cw-end-mark');
    expect(source).toContain('cw-duration-text');
    expect(source).toContain('transform: translateY(7px)');
    expect(source).toContain("const COMBO_WINDOW_COLOR = '#fdd900'");
    expect(source).toContain('const ACTION_HEIGHT = 50');
    expect(source).toContain('actionTop + ACTION_HEIGHT');
    expect(source).toContain(':title="label"');
  });

  it('uses projected receipt geometry and does not infer windows from skill blocks', () => {
    expect(source).toContain('segment.startFrame');
    expect(source).toContain('segment.endFrame');
    expect(source).not.toContain('skillCast');
    expect(editorSource).toContain('timelineViewLayers.comboWindows');
    expect(editorSource).toContain('comboWindowSegmentsFor(track.operatorInstanceId)');
    expect(editorSource).toContain(':action-top=');
  });
});
