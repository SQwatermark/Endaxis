import { describe, expect, it } from 'vitest';
import editorSource from './TimelineEditor.vue?raw';
import source from './useTimelineMarqueeGesture.ts?raw';

describe('timeline marquee gesture integration', () => {
  it('keeps toolbar replacement and modifier toggle selection as distinct entry points', () => {
    expect(editorSource).toContain('beginMarqueeGesture(event, false)');
    expect(editorSource).toContain('beginMarqueeGesture(event, true)');
    expect(source).toContain('ctrlKey: toggleSelection');
    expect(source).toContain('applyTimelineMarqueeSelection');
  });

  it('cancels a pending marquee on pointer cancellation or Escape', () => {
    expect(source).toContain("interactionSession.tryStart('marquee', stop)");
    expect(source).toContain("window.addEventListener('pointercancel', onCancel)");
    expect(source).not.toContain("addEventListener('keydown'");
    expect(source).toContain('lease.release()');
  });
});
