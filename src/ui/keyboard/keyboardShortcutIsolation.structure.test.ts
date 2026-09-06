import { describe, expect, it } from 'vitest';
import routerSource from './keyboardShortcutRouter.ts?raw';
import editorSource from '../timeline/TimelineEditor.vue?raw';
import headerSource from '../timeline/components/TimelineHeaderToolbar.vue?raw';
import menuSource from '../timeline/components/TimelineActionContextMenu.vue?raw';
import mapSource from '../timeline/components/SkillStructureMindMap.vue?raw';

describe('keyboard shortcut isolation integration', () => {
  it('tracks keyboard focus and the specific teleported map menu without global key listeners', () => {
    expect(mapSource).toContain("document.addEventListener('focusin', trackActive, true)");
    expect(mapSource).toContain("document.addEventListener('pointerdown', trackActive, true)");
    expect(mapSource).toContain('contextMenuElement.value?.contains(target)');
    expect(mapSource).toContain('isTextEditingTarget(event.target)');
    expect(mapSource).not.toContain("window.addEventListener('keydown'");
    expect(mapSource).not.toContain('stopImmediatePropagation');
    const keyboard = mapSource.slice(mapSource.indexOf('function handleKeyboard('));
    expect(keyboard.indexOf("emit('historyAction'")).toBeLessThan(
      keyboard.indexOf('if (node === undefined) return false'),
    );
  });
  it('routes the timeline action menu through the shared dispatcher with an unhandled-key barrier', () => {
    expect(menuSource).toContain('useKeyboardShortcutScope({');
    expect(menuSource).toContain('active: () => props.visible');
    expect(menuSource).toContain('blockLowerScopes: true');
    expect(menuSource).not.toContain("addEventListener('keydown'");
  });
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
