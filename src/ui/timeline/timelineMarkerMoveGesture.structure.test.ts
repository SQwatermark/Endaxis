import { describe, expect, it } from 'vitest';
import source from './TimelineEditor.vue?raw';

describe('timeline marker move gesture wiring', () => {
  const markerGesture = source.slice(
    source.indexOf('function beginMarkerMove('),
    source.indexOf('function updateCursorGuide('),
  );

  it('samples the release coordinate and commits only after pointerup', () => {
    expect(markerGesture).toContain(
      'update(finishEvent.pointerId, finishEvent.clientX, finishEvent.clientY)',
    );
    expect(markerGesture).toContain("commitScenario('moveTimelineMarker'");
    expect(markerGesture.indexOf("commitScenario('moveTimelineMarker'")).toBeGreaterThan(
      markerGesture.indexOf('const finish ='),
    );
  });

  it('cancels on pointer interruption or Escape without invoking the finish path', () => {
    expect(markerGesture).toContain("window.addEventListener('pointercancel', cancel)");
    expect(markerGesture).toContain("window.addEventListener('keydown', keydown, true)");
    expect(markerGesture).toContain("if (keyEvent.key !== 'Escape') return;");
    expect(markerGesture).not.toContain("window.addEventListener('pointercancel', finish)");
  });

  it('reprojects from the live scrolled surface edge during horizontal edge scrolling', () => {
    expect(source).toContain('resolveTimelineMarkerPointerFrame({');
    expect(markerGesture).toContain('scheduleMarkerMoveAutoScroll(update)');
    expect(markerGesture).toContain('viewport.scrollLeft += delta.x');
    expect(markerGesture).toContain(
      'update(gesture.pointerId, gesture.latestPointerX, gesture.latestPointerY, true)',
    );
  });

  it('keeps track-local markers selected when the completed click reaches the lane', () => {
    const trackSwitchMarker = source.slice(
      source.indexOf('class="timeline-marker track-switch-marker"'),
      source.indexOf('class="timeline-marker operator-event-marker"'),
    );
    const operatorEventMarker = source.slice(
      source.indexOf('class="timeline-marker operator-event-marker"'),
      source.indexOf(
        '<TimelineActionBlock',
        source.indexOf('class="timeline-marker operator-event-marker"'),
      ),
    );

    expect(trackSwitchMarker).toContain('@click.stop');
    expect(operatorEventMarker).toContain('@click.stop');
  });
});
