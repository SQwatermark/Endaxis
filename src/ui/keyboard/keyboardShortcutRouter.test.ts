import { describe, expect, it, vi } from 'vitest';
import { KeyboardShortcutRouter } from './keyboardShortcutRouter';

function keyEvent(key: string): KeyboardEvent {
  const event = {
    key,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    stopPropagation() {},
  };
  return event as KeyboardEvent;
}

describe('KeyboardShortcutRouter', () => {
  it('routes a shortcut to the highest-priority active scope only', () => {
    const router = new KeyboardShortcutRouter();
    const editor = vi.fn(() => true);
    const dialog = vi.fn(() => true);
    router.register({ id: 'editor', priority: 10, active: () => true, handle: editor });
    router.register({ id: 'dialog', priority: 100, active: () => true, handle: dialog });

    expect(router.route(keyEvent('c'))).toBe(true);
    expect(dialog).toHaveBeenCalledOnce();
    expect(editor).not.toHaveBeenCalled();
  });

  it('skips inactive scopes and allows unhandled keys to continue', () => {
    const router = new KeyboardShortcutRouter();
    const editor = vi.fn(() => false);
    router.register({ id: 'dialog', priority: 100, active: () => false, handle: vi.fn() });
    router.register({ id: 'editor', priority: 10, active: () => true, handle: editor });

    expect(router.route(keyEvent('x'))).toBe(false);
    expect(editor).toHaveBeenCalledOnce();
  });

  it('lets a focused panel block lower scopes without swallowing native input behavior', () => {
    const router = new KeyboardShortcutRouter();
    const editor = vi.fn(() => true);
    router.register({ id: 'editor', priority: 10, active: () => true, handle: editor });
    router.register({
      id: 'dialog',
      priority: 100,
      active: () => true,
      handle: () => false,
      blockLowerScopes: true,
    });

    const event = keyEvent('c');
    expect(router.route(event)).toBe(false);
    expect(event.defaultPrevented).toBe(false);
    expect(editor).not.toHaveBeenCalled();
  });
});
