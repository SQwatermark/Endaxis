import { describe, expect, it, vi } from 'vitest';
import { createInteractionSession } from './interactionSession';

describe('workbench interaction ownership', () => {
  it.each(['track-order', 'workbench-resize', 'cast-move', 'library-placement'])(
    'does not allow %s to replace an active library drag',
    owner => {
      const session = createInteractionSession();
      const cancel = vi.fn();
      const drag = session.tryStart('library-drag', cancel)!;
      expect(session.tryStart(owner, vi.fn())).toBeNull();
      expect(drag.isCurrent()).toBe(true);
      expect(cancel).not.toHaveBeenCalled();
      drag.release();
      expect(session.tryStart(owner, vi.fn())).not.toBeNull();
    },
  );

  it('makes stale and repeated cleanup harmless even when the next owner has the same label', () => {
    const session = createInteractionSession();
    const old = session.tryStart('cast-move', vi.fn())!;
    old.release();
    const next = session.tryStart('cast-move', vi.fn())!;
    old.release();
    expect(next.isCurrent()).toBe(true);
    expect(old.isCurrent()).toBe(false);
  });

  it('cancels once and allows a cleanup callback to release its stale lease safely', () => {
    const session = createInteractionSession();
    const callback = vi.fn(() => lease.release());
    const lease = session.tryStart('library-drag', callback)!;
    expect(session.cancel()).toBe(true);
    expect(session.cancel()).toBe(false);
    expect(callback).toHaveBeenCalledOnce();
    expect(session.current).toBeNull();
  });

  it('keeps workbench instances independent', () => {
    const first = createInteractionSession();
    const second = createInteractionSession();
    first.tryStart('cast-move', vi.fn());
    expect(second.tryStart('cast-move', vi.fn())).not.toBeNull();
    first.cancel();
    expect(second.current?.owner).toBe('cast-move');
  });

  it('release commits ownership without calling cancellation or cancelling a successor', () => {
    const session = createInteractionSession();
    const cancel = vi.fn();
    const first = session.tryStart('library-placement', cancel)!;
    first.release();
    expect(cancel).not.toHaveBeenCalled();
    const successor = session.tryStart('library-drag', cancel)!;
    first.release();
    expect(successor.isCurrent()).toBe(true);
  });
});
