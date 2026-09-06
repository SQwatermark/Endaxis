import { describe, expect, it, vi } from 'vitest';
import { createAsyncModalBoundary } from './asyncModalBoundary';
import { createInteractionSession } from './interactionSession';
import { KeyboardShortcutRouter } from '../keyboard/keyboardShortcutRouter';
import editor from '../timeline/TimelineEditor.vue?raw';
import hook from './useAsyncModalBoundary.ts?raw';
import map from '../timeline/components/SkillStructureMindMap.vue?raw';

function deferred() {
  let resolve!: (value: string) => void;
  const promise = new Promise<string>(done => {
    resolve = done;
  });
  return { promise, resolve };
}

describe('service modal input lifetime', () => {
  it('blocks input before opening and releases after confirmation', async () => {
    const session = createInteractionSession();
    const boundary = createAsyncModalBoundary(session);
    const cancelled = vi.fn(() => expect(boundary.active).toBe(true));
    session.tryStart('cast-move', cancelled);
    const result = boundary.run(() => {
      expect(cancelled).toHaveBeenCalledOnce();
      expect(session.tryStart('library-drag', vi.fn())).toBeNull();
      return 'confirm';
    });
    expect(boundary.active).toBe(true);
    await expect(result).resolves.toBe('confirm');
    expect(boundary.active).toBe(false);
    expect(session.tryStart('cast-move', vi.fn())).not.toBeNull();
  });

  it('one settled modal cannot release another pending modal', async () => {
    const session = createInteractionSession();
    const boundary = createAsyncModalBoundary(session);
    const first = deferred();
    const second = deferred();
    const one = boundary.run(() => first.promise);
    const two = boundary.run(() => second.promise);
    first.resolve('one');
    await one;
    expect(boundary.active).toBe(true);
    expect(session.tryStart('cast-move', vi.fn())).toBeNull();
    second.resolve('two');
    await two;
    expect(boundary.active).toBe(false);
  });

  it.each(['throw', 'reject'])('releases after modal %s', async mode => {
    const session = createInteractionSession();
    const boundary = createAsyncModalBoundary(session);
    await expect(
      boundary.run(() => {
        if (mode === 'throw') throw new Error('cancel');
        return Promise.reject(new Error('cancel'));
      }),
    ).rejects.toThrow('cancel');
    expect(boundary.active).toBe(false);
    expect(session.tryStart('cast-move', vi.fn())).not.toBeNull();
  });

  it('disposal releases barriers and prevents a late confirmation being applied', async () => {
    const session = createInteractionSession();
    const boundary = createAsyncModalBoundary(session);
    const pending = deferred();
    const result = boundary.run(() => pending.promise);
    boundary.dispose();
    expect(boundary.active).toBe(false);
    const successor = session.tryStart('cast-move', vi.fn())!;
    pending.resolve('confirm');
    await expect(result).rejects.toThrow('disposed');
    expect(successor.isCurrent()).toBe(true);
    const open = vi.fn();
    await expect(boundary.run(open)).rejects.toThrow('disposed');
    expect(open).not.toHaveBeenCalled();
  });

  it('does not leave a barrier behind when cancelling the old gesture throws', async () => {
    const session = createInteractionSession();
    const boundary = createAsyncModalBoundary(session);
    session.tryStart('broken', () => {
      throw new Error('broken cleanup');
    });
    const open = vi.fn();
    await expect(boundary.run(open)).rejects.toThrow('broken cleanup');
    expect(open).not.toHaveBeenCalled();
    expect(boundary.active).toBe(false);
    expect(session.tryStart('cast-move', vi.fn())).not.toBeNull();
  });

  it('blocks background shortcuts but leaves modal-native key handling intact', async () => {
    const boundary = createAsyncModalBoundary(createInteractionSession());
    const router = new KeyboardShortcutRouter();
    const background = vi.fn(() => true);
    router.register({ id: 'map-menu', priority: 300, active: () => true, handle: background });
    router.register({
      id: 'service-modal',
      priority: 2000,
      active: () => boundary.active,
      blockLowerScopes: true,
      handle: () => false,
    });
    const pending = deferred();
    const result = boundary.run(() => pending.promise);
    const event = {
      key: 'Escape',
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
    } as unknown as KeyboardEvent;
    expect(router.route(event)).toBe(false);
    expect(background).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
    pending.resolve('cancel');
    await result;
    router.route(event);
    expect(background).toHaveBeenCalledOnce();
  });

  it('covers both imperative confirmations and excludes inactive map menus', () => {
    expect(editor.match(/serviceModalBoundary\.run\(/g)).toHaveLength(2);
    expect(hook).toContain('onScopeDispose(() => boundary.dispose())');
    expect(map).toContain('active: () => active.value && contextMenu.value !== undefined');
  });
});
