import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import rulerSource from './TimelineRuler.vue?raw';

describe('Next timeline ruler editing structure', () => {
  it('edits prep and battle duration through explicit ruler commands', () => {
    expect(editorSource).toContain('@set-prep-frames="setTimelinePrepFrames"');
    expect(editorSource).toContain('@set-duration-frames="setTimelineDurationFrames"');
    expect(editorSource).toContain("commitScenario('setBattlePrepFrames'");
    expect(editorSource).toContain("commitScenario('setBattleDurationFrames'");
    expect(rulerSource).toContain("beginResize('prep', $event)");
    expect(rulerSource).toContain("beginResize('duration', $event)");
    expect(rulerSource).toContain("emit('setPrepFrames'");
    expect(rulerSource).toContain("emit('setDurationFrames'");
    expect(editorSource).toContain('@pointerdown="beginTimelinePrepResize"');
    expect(editorSource).toContain('class="timeline-battle-start-boundary"');
  });

  it('keeps prep as a visual inset and exposes the legacy frame/second units', () => {
    expect(rulerSource).toContain('activePrepFrames');
    expect(rulerSource).toContain('activeDurationFrames');
    expect(rulerSource).toContain('<span>f</span>');
    expect(rulerSource).toContain('<span>s</span>');
    expect(rulerSource).not.toContain('placement.startFrame');
  });

  it('projects the legacy operation key layer from Next timeline data', () => {
    expect(editorSource).toContain(':operations="rulerOperations"');
    expect(editorSource).toContain("cast.skillType === 'battleSkill'");
    expect(editorSource).toContain("cast.skillType === 'comboSkill'");
    expect(editorSource).toContain("cast.skillType === 'ultimate'");
    expect(editorSource).toContain("kind: 'switch'");
    expect(rulerSource).toContain('projectTimelineOperationMarkers');
    expect(rulerSource).toContain('key-cap--switch');
    expect(rulerSource).toContain("operation.width === null ? 'auto'");
    expect(rulerSource).toContain('prefers-reduced-motion');
    expect(editorSource).toContain('projectPerfectComboCastIds');
    expect(editorSource).toContain('perfectComboCastIds.value.has(cast.id)');
  });

  it('virtualizes localized real-time ticks at the current viewport and zoom', () => {
    expect(editorSource).toContain('ResizeObserver(updateTimelineViewportMetrics)');
    expect(editorSource).toContain(':visible-left-px=');
    expect(rulerSource).toContain('projectTimelineRulerTicks');
    expect(rulerSource).toContain("t('timelineGrid.ruler.realTimeTitle')");
    expect(rulerSource).not.toContain('<span class="row-label">TIME</span>');
    expect(editorSource).toContain("'--timeline-grid-step': `${PROJECT_FPS * pxPerFrame.value}px`");
    expect(editorSource).toContain("'--timeline-grid-origin'");
  });
});
