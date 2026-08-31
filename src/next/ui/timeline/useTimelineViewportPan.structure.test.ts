import { describe, expect, it } from 'vitest';
import editorSource from './NextTimelineEditor.vue?raw';
import source from './useTimelineViewportPan.ts?raw';

describe('timeline viewport pan legacy interaction boundary', () => {
  it('starts middle-button panning from the lane handler', () => {
    expect(editorSource).toContain('if (beginViewportPan(event)) return');
    expect(source).toContain('event.button !== 1');
  });

  it('does not let nested timeline controls start viewport panning', () => {
    expect(source).toContain("'[data-timeline-action-id]'");
    expect(source).toContain("'[data-timeline-interactive]'");
    expect(source).toContain("'button'");
    expect(source).toContain("'input'");
    expect(source).toContain('\'[draggable="true"]\'');
    expect(source).toContain('isTimelineViewportPanExcludedTarget(target)');
  });

  it('allows Escape and pointer cancellation to stop a pan', () => {
    expect(source).toContain("keyEvent.key === 'Escape'");
    expect(source).toContain("window.addEventListener('pointercancel', finish)");
    expect(source).toContain("window.removeEventListener('keydown', keydown, true)");
  });

  it('renders the old four-edge dashed marquee without a content wash', () => {
    expect(editorSource).toContain('--marquee-horizontal');
    expect(editorSource).toContain('--marquee-vertical');
    expect(editorSource).toContain('background-repeat: repeat-x, repeat-x, repeat-y, repeat-y');
    expect(editorSource).not.toContain(
      'background: color-mix(in srgb, var(--ea-gold) 14%, transparent)',
    );
  });
});
