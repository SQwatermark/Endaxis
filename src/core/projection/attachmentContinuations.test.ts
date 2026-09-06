import { describe, expect, it } from 'vitest';
import { projectAttachmentContinuations } from './attachmentContinuations';
import type { BuffTimelineSegment } from './buffTimelineViz';

const segment = (
  startFrame: number,
  endFrame: number,
  extra: Partial<BuffTimelineSegment> = {},
): BuffTimelineSegment => ({
  targetId: 'enemy',
  buffId: 'attachment',
  instanceId: 1,
  startFrame,
  endFrame,
  layers: 1,
  placement: 'upper',
  ...extra,
});
describe('attachment continuations', () => {
  it('connects stack changes and capped refreshes using the same instance', () => {
    const a = segment(0, 10, { layers: 3 });
    const b = segment(10, 20, { layers: 4 });
    const c = segment(20, 50, { layers: 4 });
    expect([...projectAttachmentContinuations([c, a, b], new Set(['attachment']))]).toEqual([a, b]);
  });
  it.each([{ instanceId: 2 }, { buffId: 'reaction' }, { targetId: 'other' }, { startFrame: 11 }])(
    'does not connect an unrelated coincident state: %j',
    extra => {
      expect(
        projectAttachmentContinuations(
          [segment(0, 10), segment(10, 30, extra)],
          new Set(['attachment', 'reaction']),
        ).size,
      ).toBe(0);
    },
  );
  it('does not convert ordinary buff refreshes or isolated expiry to attachment links', () => {
    expect(projectAttachmentContinuations([segment(0, 10), segment(10, 20)], new Set()).size).toBe(
      0,
    );
    expect(projectAttachmentContinuations([segment(0, 10)], new Set(['attachment'])).size).toBe(0);
  });
});
