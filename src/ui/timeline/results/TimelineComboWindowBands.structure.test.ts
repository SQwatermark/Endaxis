import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import source from './TimelineComboWindowBands.vue?raw';
import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import Bands from './TimelineComboWindowBands.vue';

describe('Next timeline combo window bands', () => {
  it('renders perfect slices with the solid-line class and their own title', async () => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(Bands, {
            segments: [
              {
                sequence: 0,
                operatorId: 'a',
                nextSkillKey: 'combo',
                startFrame: 0,
                endFrame: 15,
                outcome: 'consumed',
              },
              {
                sequence: 0,
                operatorId: 'a',
                nextSkillKey: 'combo',
                startFrame: 15,
                endFrame: 30,
                outcome: 'consumed',
                perfectTiming: true,
              },
            ],
            prepFrames: 0,
            pxPerFrame: 2,
            actionTop: 0,
            prepExpanded: true,
            label: '连携窗口',
            perfectLabel: '精准衔接',
          }),
      }),
    );
    expect(html).toContain('perfect-timing-bar');
    expect(html).toContain('title="精准衔接"');
    expect(html).toContain('title="连携窗口"');
    expect(html).toContain('left:30px;width:30px');
  });
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
