import { describe, expect, it } from 'vitest';
import editor from '../TimelineEditor.vue?raw';

describe('combo control editor wiring', () => {
  it('lets the icon receive clicks above the preparation boundary without raising the full guide', () => {
    const guide = editor.slice(
      editor.indexOf('.team-event-marker.combo-cooldown-guide {'),
      editor.indexOf('.controlled-combo-cooldown-bar {'),
    );
    const icon = editor.slice(
      editor.indexOf('.combo-cooldown-marker {'),
      editor.indexOf('.combo-cooldown-guide.selected .combo-cooldown-marker'),
    );
    expect(guide).toContain('z-index: auto');
    expect(icon).toContain('z-index: 12');
  });
  it('captures selection before clearing it and toggles only an unmoved second click', () => {
    const gesture = editor.slice(
      editor.indexOf('function beginMarkerMove('),
      editor.indexOf('function scheduleMarkerMoveAutoScroll('),
    );
    expect(gesture.indexOf('const wasComboControlSelected')).toBeGreaterThan(0);
    expect(gesture.indexOf('const wasComboControlSelected')).toBeLessThan(
      gesture.indexOf(
        'clearTimelineSelection();',
        gesture.indexOf('const wasComboControlSelected'),
      ),
    );
    expect(gesture).toContain(
      'if (!gesture.dragStarted && wasComboControlSelected) clearTimelineSelection();',
    );
  });

  it('routes marker nudges through history before attempting skill selection', () => {
    const nudge = editor.slice(
      editor.indexOf('function nudgeSelectedActions('),
      editor.indexOf('function toggleSnapPrecision('),
    );
    expect(nudge).toContain('selectedExternalEventMarker.value ?? selectedDocumentMarker.value');
    expect(nudge).toContain("commitScenario('moveExternalEventMarker'");
    expect(nudge).toContain('setSelectedDocumentMarkerFrame(frame)');
    expect(nudge.indexOf('return true;')).toBeLessThan(nudge.indexOf('const selection ='));
  });

  it('formats controlled cooldown durations with the shared seconds-and-frames formatter', () => {
    expect(editor).toContain(
      'formatTimeWithFrames((band.endFrame - band.startFrame) / PROJECT_FPS)',
    );
  });
});
