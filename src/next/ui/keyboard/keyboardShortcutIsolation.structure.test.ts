import { describe, expect, it } from 'vitest';
import routerSource from './keyboardShortcutRouter.ts?raw';
import editorSource from '../timeline/NextTimelineEditor.vue?raw';
import headerSource from '../timeline/components/TimelineHeaderToolbar.vue?raw';

describe('keyboard shortcut isolation integration', () => {
  it('isolates native editors and teleported interactive overlays at the router boundary', () => {
    expect(routerSource).toContain('isTextEditingTarget(target)');
    expect(routerSource).toContain('.el-overlay, .el-popper');
    expect(routerSource).toContain('[role="dialog"]');
    expect(routerSource).toContain('[role="menu"]');
    expect(routerSource).toContain('[data-keyboard-shortcut-scope="overlay"]');
  });

  it('uses the shared isolation predicate before timeline commands', () => {
    expect(editorSource).toContain('isKeyboardShortcutIsolationTarget');
    expect(editorSource).toContain(
      'if (isKeyboardShortcutIsolationTarget(event.target)) return false;',
    );
    expect(editorSource).not.toContain('if (isTextEditingTarget(event.target))');
  });

  it('keeps an open teleported popover isolated while focus remains on its trigger', () => {
    expect(headerSource).toContain(
      ':data-keyboard-shortcut-scope="moreMenuOpen ? \'overlay\' : undefined"',
    );
    expect(headerSource).toContain(':aria-expanded="moreMenuOpen"');
  });
});
