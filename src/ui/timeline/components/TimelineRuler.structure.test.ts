import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
import rulerSource from './TimelineRuler.vue?raw';

describe('timeline ruler editing structure', () => {
  it('retains operation keycaps but removes the standalone white cursor line', () => {
    expect(rulerSource).toContain('v-for="operation in operationMarkers"');
    expect(rulerSource).not.toContain('<span class="cursor"');
    expect(editorSource).not.toContain("{{ t('timeline.reSimulate') }}");
  });
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

  it('commits ruler resizing only on pointer release and cancels interrupted previews', () => {
    const resize = rulerSource.slice(
      rulerSource.indexOf("function beginResize(kind: 'prep' | 'duration'"),
      rulerSource.indexOf('function openPrepEditor()'),
    );
    expect(resize).toContain("window.addEventListener('pointerup', finish)");
    expect(resize).toContain("window.addEventListener('pointercancel', cancel)");
    expect(resize).toContain("interactionSession.tryStart('ruler-resize'");
    expect(resize).not.toContain("addEventListener('keydown'");
    expect(resize).toContain('stopResize = cancel;');
    expect(resize).not.toContain("window.addEventListener('pointercancel', finish)");

    const mainPrepResize = editorSource.slice(
      editorSource.indexOf('function beginTimelinePrepResize('),
      editorSource.indexOf('function setTimelineDurationFrames('),
    );
    expect(mainPrepResize).toContain("interactionSession.tryStart('timeline-prep-resize'");
  });

  it('lets Escape close frame and duration inputs without applying their drafts', () => {
    expect(rulerSource).toContain('@keydown.esc.prevent="closePrepEditor"');
    expect(rulerSource).toContain('@keydown.esc.prevent="closeDurationEditor"');
  });

  it('keeps prep as a visual inset and exposes the legacy frame/second units', () => {
    expect(rulerSource).toContain('activePrepFrames');
    expect(rulerSource).toContain('activeDurationFrames');
    expect(rulerSource).toContain('<span>f</span>');
    expect(rulerSource).toContain('<span>s</span>');
    expect(rulerSource).not.toContain('placement.startFrame');
  });

  it('folds prep through the persisted editor field without changing frame identities', () => {
    expect(editorSource).toContain('scenario.editor.prepExpanded');
    expect(editorSource).toContain("commitScenario('setTimelinePrepExpanded'");
    expect(editorSource).toContain('class="prep-collapsed-entry"');
    expect(editorSource).toContain('class="prep-expanded-collapse"');
    expect(editorSource).toContain('setPrepExpanded(false)');
    expect(rulerSource).toContain('props.prepExpanded');
    expect(rulerSource).toContain("if (kind === 'prep' && !props.prepExpanded) return");
  });

  it('keeps prep toggle controls above track resize hit areas', () => {
    const layer = (selector: string) => {
      const block = editorSource.slice(editorSource.indexOf(selector)).split('}')[0]!;
      return Number(block.match(/z-index:\s*(\d+)/)?.[1]);
    };
    expect(layer('.prep-expanded-collapse {')).toBeGreaterThan(layer('.track-row-resizer {'));
    expect(editorSource).toMatch(/\.prep-collapsed-entry,\s*\.prep-expanded-collapse/);
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

  it('keeps the old transparent boundary controls and cyan battle endpoint', () => {
    expect(rulerSource).toMatch(
      /\.axis-boundary button \{[\s\S]*left: -12px;[\s\S]*width: 18px;[\s\S]*border: 0;[\s\S]*background: transparent;/,
    );
    expect(rulerSource).toContain('.axis-boundary button:hover');
    expect(rulerSource).toMatch(
      /\.axis-boundary--end::before \{[\s\S]*background: rgb\(0 229 255 \/ 55%\)/,
    );
    expect(rulerSource).toMatch(
      /\.axis-boundary b \{[\s\S]*top: 28px;[\s\S]*color: rgb\(0 229 255 \/ 92%\)/,
    );
  });

  it('uses the old collapsed 60px ruler row throughout the timeline overlays', () => {
    expect(rulerSource).toContain('height: 60px');
    expect(editorSource).toContain('const TIMELINE_RULER_HEIGHT = 60');
    expect(editorSource).toContain('margin-top: -60px');
    expect(editorSource).not.toContain('const TIMELINE_RULER_HEIGHT = 76');
  });
});
