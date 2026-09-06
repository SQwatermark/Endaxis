import { effectScope, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useKeyboardShortcutScope } from '../keyboard/keyboardShortcutRouter';
import { createInteractionSession } from './interactionSession';
import { usePopoverInteractionBoundary } from './usePopoverInteractionBoundary';

describe('interactive popover ownership', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('blocks background keyboard, clipboard and gestures until Escape closes it', () => {
    const target = new EventTarget();
    vi.stubGlobal('window', target);
    const scope = effectScope();
    const open = ref(false);
    const session = createInteractionSession();
    const background = vi.fn(() => true);
    const cancel = vi.fn();
    scope.run(() => {
      useKeyboardShortcutScope({
        id: 'timeline',
        priority: 10,
        active: () => true,
        handle: background,
        handleClipboard: background,
      });
      usePopoverInteractionBoundary(
        session,
        () => open.value,
        () => {
          open.value = false;
        },
      );
    });
    try {
      session.tryStart('drag', cancel);
      open.value = true;
      expect(cancel).toHaveBeenCalledOnce();
      expect(session.tryStart('another-drag', cancel)).toBeNull();
      const key = (value: string) =>
        Object.assign(new Event('keydown', { cancelable: true }), { key: value });
      target.dispatchEvent(key('Delete'));
      const copy = new Event('copy', { cancelable: true });
      target.dispatchEvent(copy);
      expect(background).not.toHaveBeenCalled();
      expect(copy.defaultPrevented).toBe(false);
      target.dispatchEvent(key('Escape'));
      expect(open.value).toBe(false);
      expect(background).not.toHaveBeenCalled();
      expect(session.tryStart('next-drag', cancel)).not.toBeNull();
      target.dispatchEvent(key('Delete'));
      expect(background).toHaveBeenCalledOnce();
    } finally {
      scope.stop();
    }
  });

  it('releases an open boundary on unmount', () => {
    vi.stubGlobal('window', new EventTarget());
    const scope = effectScope();
    const session = createInteractionSession();
    scope.run(() => usePopoverInteractionBoundary(session, () => true, vi.fn()));
    expect(session.tryStart('drag', vi.fn())).toBeNull();
    scope.stop();
    expect(session.tryStart('drag', vi.fn())).not.toBeNull();
  });
});
