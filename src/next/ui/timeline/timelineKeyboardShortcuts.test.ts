import { describe, expect, it, vi } from 'vitest';
import { handleTimelineEditorShortcut } from './timelineKeyboardShortcuts';

function keyboardEvent(key: string, modifiers: Partial<KeyboardEvent> = {}): KeyboardEvent {
  return {
    key,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    ...modifiers,
  } as KeyboardEvent;
}

function commands() {
  const command = () => vi.fn(() => true);
  return {
    undo: command(),
    redo: command(),
    copy: command(),
    paste: command(),
    delete: command(),
    nudgeLeft: command(),
    nudgeRight: command(),
    toggleSnapPrecision: command(),
  };
}

describe('handleTimelineEditorShortcut', () => {
  it.each([
    ['Ctrl+Z', keyboardEvent('z', { ctrlKey: true }), 'undo'],
    ['Cmd+Shift+Z', keyboardEvent('z', { metaKey: true, shiftKey: true }), 'redo'],
    ['Ctrl+Y', keyboardEvent('y', { ctrlKey: true }), 'redo'],
    ['Delete', keyboardEvent('Delete'), 'delete'],
    ['Backspace', keyboardEvent('Backspace'), 'delete'],
    ['ArrowLeft', keyboardEvent('ArrowLeft'), 'nudgeLeft'],
    ['D', keyboardEvent('d'), 'nudgeRight'],
    ['Alt+S', keyboardEvent('s', { altKey: true }), 'toggleSnapPrecision'],
  ])('maps %s to the expected editor command', (_name, event, commandName) => {
    const handlers = commands();

    expect(handleTimelineEditorShortcut(event, handlers)).toBe(true);
    expect(handlers[commandName as keyof typeof handlers]).toHaveBeenCalledOnce();
  });

  it('does not claim unsupported modifier combinations', () => {
    const handlers = commands();

    expect(handleTimelineEditorShortcut(keyboardEvent('a', { altKey: true }), handlers)).toBe(
      false,
    );
    expect(
      handleTimelineEditorShortcut(keyboardEvent('Delete', { shiftKey: true }), handlers),
    ).toBe(false);
    expect(
      handleTimelineEditorShortcut(keyboardEvent('c', { ctrlKey: true, shiftKey: true }), handlers),
    ).toBe(false);
    expect(Object.values(handlers).every(handler => handler.mock.calls.length === 0)).toBe(true);
  });

  it('returns false when a valid shortcut has no applicable editor command', () => {
    const handlers = commands();
    handlers.undo.mockReturnValue(false);

    expect(handleTimelineEditorShortcut(keyboardEvent('z', { ctrlKey: true }), handlers)).toBe(
      false,
    );
  });
});
