import { describe, expect, it } from 'vitest';
import { createTimelineScrollSync } from './timelineScrollSync';

describe('timeline horizontal scroll synchronization', () => {
  it('does not rewind a newer scrollbar drag when the viewport echo arrives first', () => {
    const sync = createTimelineScrollSync();
    const viewport = { scrollLeft: 0 };
    const scrollbar = { scrollLeft: 0 };
    sync(viewport, scrollbar);
    scrollbar.scrollLeft = 100;
    sync(scrollbar, viewport);
    scrollbar.scrollLeft = 160;
    sync(viewport, scrollbar);
    expect(scrollbar.scrollLeft).toBe(160);
    sync(scrollbar, viewport);
    expect(viewport.scrollLeft).toBe(160);
  });

  it('also ignores scrollbar echoes while the viewport is panning', () => {
    const sync = createTimelineScrollSync();
    const viewport = { scrollLeft: 100 };
    const scrollbar = { scrollLeft: 0 };
    sync(viewport, scrollbar);
    viewport.scrollLeft = 60;
    sync(scrollbar, viewport);
    expect(viewport.scrollLeft).toBe(60);
    sync(viewport, scrollbar);
    expect(scrollbar.scrollLeft).toBe(60);
    // 缩短时间轴导致浏览器限位，仍然需要同步。
    viewport.scrollLeft = 0;
    sync(viewport, scrollbar);
    expect(scrollbar.scrollLeft).toBe(0);
  });
});
