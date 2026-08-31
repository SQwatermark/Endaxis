import { describe, expect, test } from 'vitest';
import { resolveTimelineWheelIntent } from './timelineWheel';

describe('resolveTimelineWheelIntent', () => {
  test('gives Ctrl zoom priority and preserves wheel direction', () => {
    expect(
      resolveTimelineWheelIntent({ ctrlKey: true, shiftKey: true, deltaX: 0, deltaY: -120 }),
    ).toEqual({ kind: 'zoom', direction: 1 });
    expect(
      resolveTimelineWheelIntent({ ctrlKey: true, shiftKey: false, deltaX: 0, deltaY: 120 }),
    ).toEqual({ kind: 'zoom', direction: -1 });
  });

  test('maps Shift wheel to horizontal pan without changing document state', () => {
    expect(
      resolveTimelineWheelIntent({ ctrlKey: false, shiftKey: true, deltaX: 0, deltaY: 80 }),
    ).toEqual({ kind: 'horizontalPan', deltaPx: 80 });
    expect(
      resolveTimelineWheelIntent({ ctrlKey: false, shiftKey: true, deltaX: 32, deltaY: 0 }),
    ).toEqual({ kind: 'horizontalPan', deltaPx: 32 });
  });

  test('leaves an ordinary wheel event to native vertical scrolling', () => {
    expect(
      resolveTimelineWheelIntent({ ctrlKey: false, shiftKey: false, deltaX: 0, deltaY: 80 }),
    ).toEqual({ kind: 'nativeVerticalScroll' });
  });
});
