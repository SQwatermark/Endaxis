import { describe, expect, it } from 'vitest';
import source from './TimelineWorkbenchShell.vue?raw';

describe('TimelineWorkbenchShell legacy behavior parity', () => {
  it('starts bottom resizing at the displayed height after viewport clamping', () => {
    expect(source).toContain('const initialBottom = effectiveBottomHeight.value;');
    expect(source).not.toContain('const initialBottom = bottomHeight.value;');
  });
  it('receives monitor folding count and preserves a 9px bottom resize target', () => {
    expect(source).toContain('props.collapsedMonitorSectionCount ?? 0');
    expect(source).toMatch(/\.bottom-resizer::after\s*\{[^}]*height: 9px/);
  });
  it('notifies monitor sections when reopening the bottom panel from the activity bar', () => {
    expect(source).toContain('if (bottomCollapsed.value) bottomExpandAllToken.value += 1');
    expect(source).toContain(':expand-all-token="bottomExpandAllToken"');
  });
  it('persists panel geometry, collapsed state and selected tools', () => {
    expect(source).toContain('WORKBENCH_LAYOUT_STORAGE_KEY');
    expect(source).toContain('window.localStorage.getItem');
    expect(source).toContain('window.localStorage.setItem');
    expect(source).toContain('leftCollapsed: leftCollapsed.value');
    expect(source).toContain('bottomTool: bottomTool.value');
    expect(source).toContain('rightTool: rightTool.value');
    expect(source).toContain('restoreLayout();');
    expect(source).toContain('onMounted(() =>');
  });

  it('restores each resize boundary to its legacy default on double click', () => {
    expect(source).toContain('@dblclick="resetPanelSize(\'left\')"');
    expect(source).toContain('@dblclick="resetPanelSize(\'right\')"');
    expect(source).toContain('@dblclick="resetPanelSize(\'bottom\')"');
    expect(source).toContain('DEFAULT_LEFT_WIDTH = 200');
    expect(source).toContain('DEFAULT_RIGHT_WIDTH = 260');
    expect(source).toContain('DEFAULT_BOTTOM_HEIGHT = WORKBENCH_BOTTOM_DEFAULT_HEIGHT');
  });

  it('preserves the legacy central timeline minimums inside the clipped root', () => {
    expect(source).toContain('WORKBENCH_TIMELINE_MIN_HEIGHT');
    expect(source).toContain('minmax(540px, 1fr)');
    expect(source).toContain('minmax(${WORKBENCH_TIMELINE_MIN_HEIGHT}px, 1fr)');
    expect(source).toMatch(/\.workbench-layout\s*\{[^}]*height: 100vh;[^}]*overflow: hidden;/s);
  });

  it('shrinks the effective bottom panel before clipping it in a short viewport', () => {
    expect(source).toContain('workbenchHeight = ref(0)');
    expect(source).toContain('resolveWorkbenchBottomHeight(');
    expect(source).toContain('resolveWorkbenchBottomHeightBounds(');
    expect(source).toContain('const effectiveBottomHeight = computed');
    expect(source).toContain('bottomHeight.value = Math.max(0, value.bottomHeight)');
    expect(source).toContain('${effectiveBottomHeight.value}px');
    expect(source).toContain('new ResizeObserver(updateWorkbenchHeight)');
    expect(source).toContain('workbenchResizeObserver?.disconnect()');
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
    expect(source).toContain('icon="/icons/icon_wiki_group_monster_hongshan.webp"');
    expect(source).not.toContain('<span>敌</span>');
  });

  it('opens and restores the assembled contract tool', () => {
    expect(source).toContain("value.bottomTool === 'contract'");
    expect(source).toContain("bottomTool === 'contract'");
    expect(source).not.toContain('aria-disabled="true"');
    expect(source).not.toContain("if (tool === 'contract') return");
  });

  it('uses the legacy activity icons and pressed-state semantics', () => {
    expect(source).toContain('icon="/icons/btn_character.webp"');
    expect(source).toContain('icon="/icons/setting_tab_setting.webp"');
    expect(source).toContain('icon="/contingency_contract/deco_contract_028.webp"');
    expect(source).toContain('icon="/icons/btn_week_raid.webp"');
    expect(source).toContain('icon="/icons/btn_manual.webp"');
    expect(source).toContain('icon="/icons/icon_wiki_group_monster_hongshan.webp"');
    expect(source).toContain(':active="!leftCollapsed"');
    expect(source).toContain(':active="!rightCollapsed && rightTool === \'battleLog\'"');
    expect(source).toContain(':active="!rightCollapsed && rightTool === \'performance\'"');
  });

  it('keeps simulation performance in an independent right-side tool', () => {
    expect(source).toContain("'inspector' | 'performance' | 'battleLog'");
    expect(source).toContain('@click="selectRight(\'performance\')"');
    expect(source).toContain('props.labels.performance');
  });

  it('collapses an active tool and expands a newly selected tool', () => {
    expect(source).toContain('if (!bottomCollapsed.value && bottomTool.value === tool)');
    expect(source).toContain('if (!rightCollapsed.value && rightTool.value === tool)');
    expect(source).toContain('bottomCollapsed.value = false');
    expect(source).toContain('rightCollapsed.value = false');
  });

  it('keeps the left lower tool aligned to the shared bottom-panel grid', () => {
    expect(source).toContain(
      'gridTemplateRows: `minmax(0, 1fr) ${bottomCollapsed.value ? 0 : WORKBENCH_BOTTOM_RESIZER_HEIGHT}px ${effectiveBottomHeight.value}px`',
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

  it('uses the shared activity rail with optical sizing and matching panel sides', () => {
    expect(source.match(/<EaActivityRailButton\b/g)).toHaveLength(7);
    expect(source.match(/side="left"/g)).toHaveLength(4);
    expect(source.match(/side="right"/g)).toHaveLength(3);
    expect(source).toContain(':icon-size="28"');
    expect(source).toContain('icon="/icons/icon_wiki_group_monster_hongshan.webp"');
    expect(source).toContain('<template #icon>');
  });

  it('owns consistent reset and collapse chrome for every resizable panel', () => {
    expect(source.match(/class="panel-chrome /g)).toHaveLength(3);
    expect(source).toContain('@click="resetPanelSize(\'left\')"');
    expect(source).toContain('@click="resetPanelSize(\'right\')"');
    expect(source).toContain('@click="resetPanelSize(\'bottom\')"');
    expect(source).toContain('@click="toggleLeft"');
    expect(source).toContain('@click="rightCollapsed = true"');
    expect(source).toContain('v-if="bottomTool !== \'enemy\'"');
    expect(source).toContain('class="bottom-panel-collapse"');
    expect(source).toContain('@click="collapseBottom"');
    expect(source).toContain('opacity: 0.56');
    expect(source).toContain('.workbench-panel:hover > .panel-chrome');
    expect(source).toContain('.panel-chrome:focus-within');
  });

  it('uses the legacy centered control to collapse the complete resource monitor', () => {
    expect(source).toContain('left: calc(180px + (100% - 180px) / 2)');
    expect(source).toMatch(
      /\.bottom-panel-collapse\s*\{[^}]*position: absolute;[^}]*z-index: 45;/s,
    );
  });
});
