import { describe, expect, it } from 'vitest';
import source from './TimelineWorkbenchShell.vue?raw';

describe('TimelineWorkbenchShell legacy behavior parity', () => {
  it('persists panel geometry, collapsed state and selected tools', () => {
    expect(source).toContain('WORKBENCH_LAYOUT_STORAGE_KEY');
    expect(source).toContain('window.localStorage.getItem');
    expect(source).toContain('window.localStorage.setItem');
    expect(source).toContain('leftCollapsed: leftCollapsed.value');
    expect(source).toContain('bottomTool: bottomTool.value');
    expect(source).toContain('rightTool: rightTool.value');
    expect(source).toContain('onMounted(restoreLayout)');
  });

  it('restores each resize boundary to its legacy default on double click', () => {
    expect(source).toContain('@dblclick="resetPanelSize(\'left\')"');
    expect(source).toContain('@dblclick="resetPanelSize(\'right\')"');
    expect(source).toContain('@dblclick="resetPanelSize(\'bottom\')"');
    expect(source).toContain('DEFAULT_LEFT_WIDTH = 200');
    expect(source).toContain('DEFAULT_RIGHT_WIDTH = 260');
    expect(source).toContain('DEFAULT_BOTTOM_HEIGHT = 240');
  });

  it('preserves the legacy central timeline minimums inside the clipped root', () => {
    expect(source).toContain('TIMELINE_MAIN_MIN_HEIGHT = 600');
    expect(source).toContain('minmax(540px, 1fr)');
    expect(source).toContain('minmax(${TIMELINE_MAIN_MIN_HEIGHT}px, 1fr)');
    expect(source).toMatch(/\.workbench-layout\s*\{[^}]*height: 100vh;[^}]*overflow: hidden;/s);
  });

  it('contains elevated timeline content below dialogs teleported to the document body', () => {
    expect(source).toMatch(/\.workbench-layout\s*\{[^}]*isolation: isolate;/s);
  });

  it('keeps the resize cursor and selection lock after the pointer leaves the divider', () => {
    expect(source).toContain(
      "'is-resizing-horizontal': resizing === 'left' || resizing === 'right'",
    );
    expect(source).toContain("'is-resizing-vertical': resizing === 'bottom'");
    expect(source).toContain('.workbench-layout.is-resizing-horizontal *');
    expect(source).toContain('.workbench-layout.is-resizing-vertical *');
    expect(source).toContain('user-select: none');
  });

  it('does not hard-code the enemy activity icon language', () => {
    expect(source).toContain('id="next-enemy-panel-mask"');
    expect(source).not.toContain('<span>敌</span>');
  });

  it('keeps the unassembled contract tool visible but explicitly unavailable', () => {
    expect(source).toContain('contractUnavailable');
    expect(source).toContain('aria-disabled="true"');
    expect(source).toContain("if (tool === 'contract') return");
    expect(source).not.toContain("value.bottomTool === 'contract'");
  });

  it('uses the legacy activity icons and pressed-state semantics', () => {
    expect(source).toContain('src="/icons/btn_character.webp"');
    expect(source).toContain('src="/icons/setting_tab_setting.webp"');
    expect(source).toContain('src="/contingency_contract/deco_contract_028.webp"');
    expect(source).toContain('src="/icons/btn_week_raid.webp"');
    expect(source).toContain('src="/icons/btn_manual.webp"');
    expect(source).toContain('id="next-enemy-panel-mask"');
    expect(source).toContain(':aria-pressed="!leftCollapsed"');
    expect(source).toContain(':aria-pressed="!rightCollapsed && rightTool === \'battleLog\'"');
  });

  it('collapses an active tool and expands a newly selected tool', () => {
    expect(source).toContain('if (!bottomCollapsed.value && bottomTool.value === tool)');
    expect(source).toContain('if (!rightCollapsed.value && rightTool.value === tool)');
    expect(source).toContain('bottomCollapsed.value = false');
    expect(source).toContain('rightCollapsed.value = false');
  });

  it('keeps the left lower tool aligned to the shared bottom-panel grid', () => {
    expect(source).toContain(
      'gridTemplateRows: `minmax(0, 1fr) ${bottomCollapsed.value ? 0 : 1}px ${bottomCollapsed.value ? 0 : bottomHeight.value}px`',
    );
    expect(source).toContain('class="left-bottom-separator"');
    expect(source).toContain('.left-bottom-separator');
    expect(source).toContain('background: var(--ea-border-soft)');
  });

  it('keeps every workbench panel body shrinkable and clipping its own content', () => {
    expect(source).toMatch(
      /\.workbench-panel\s*\{[^}]*min-width: 0;[^}]*min-height: 0;[^}]*overflow: hidden;/s,
    );
    expect(source).toMatch(
      /\.timeline-center\s*\{[^}]*min-width: 0;[^}]*min-height: 0;[^}]*overflow: hidden;/s,
    );
    expect(source).toMatch(
      /\.bottom-panel\s*\{[^}]*min-width: 0;[^}]*min-height: 0;[^}]*overflow: hidden;/s,
    );
  });

  it('keeps the old image sizes and light-theme silhouette treatment', () => {
    expect(source).toContain('width: 28px');
    expect(source).toContain('.activity-button--library img');
    expect(source).toContain('filter: brightness(0) opacity(0.72)');
  });

  it('owns consistent reset and collapse chrome for every resizable panel', () => {
    expect(source.match(/class="panel-chrome /g)).toHaveLength(3);
    expect(source).toContain('@click="resetPanelSize(\'left\')"');
    expect(source).toContain('@click="resetPanelSize(\'right\')"');
    expect(source).toContain('@click="resetPanelSize(\'bottom\')"');
    expect(source).toContain('@click="toggleLeft"');
    expect(source).toContain('@click="rightCollapsed = true"');
    expect(source).toContain('@click="bottomCollapsed = true"');
    expect(source).toContain('opacity: 0.18');
    expect(source).toContain('.workbench-panel:hover > .panel-chrome');
    expect(source).toContain('.panel-chrome:focus-within');
  });
});
