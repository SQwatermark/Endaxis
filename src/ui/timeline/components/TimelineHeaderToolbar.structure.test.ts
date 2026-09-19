import { describe, expect, it } from 'vitest';
import { TIMELINE_VIEW_LAYER_IDS } from '../results/timelineViewLayers';
import source from './TimelineHeaderToolbar.vue?raw';
import resetDialogSource from './TimelineResetDialog.vue?raw';

describe('TimelineHeaderToolbar structure', () => {
  it('allows long reset descriptions to wrap inside the option card', () => {
    expect(resetDialogSource).toMatch(/\.timeline-reset-option\s*\{[\s\S]*?white-space:\s*normal;/);
    expect(resetDialogSource).toMatch(
      /\.timeline-reset-option__icon svg\s*\{[\s\S]*?width:\s*18px;[\s\S]*?height:\s*18px;/,
    );
  });

  it('keeps the legacy scenario-management interaction instead of disabled placeholders', () => {
    expect(source).toContain('@click="beginRename"');
    expect(source).toContain('@click="$emit(\'duplicate\')"');
    expect(source).toContain('@click="$emit(\'delete\')"');
    expect(source).toContain('@click="$emit(\'add\')"');
    expect(source).toContain('@click="$emit(\'select\', scenario.id)"');
    expect(source).toContain('@dblclick="beginRename"');
    expect(source).toContain('@keydown.enter.prevent="finishRename"');
    expect(source).toContain('@keydown.esc.prevent="cancelRename"');
  });

  it('在方案名左侧使用旧版删除图标，仅剩一个方案时隐藏', () => {
    const deleteButton = source.indexOf('@click="$emit(\'delete\')"');
    const scenarioTitle = source.indexOf('class="ts-title-wrapper"');
    expect(deleteButton).toBeGreaterThan(-1);
    expect(deleteButton).toBeLessThan(scenarioTitle);
    expect(source).toContain('v-if="scenarios.length > 1"');
    expect(source).toContain('<EaDeleteIcon />');
    expect(source).not.toContain(':disabled="scenarios.length <= 1"');
  });

  it('renders every scenario as a numbered scrollable tab', () => {
    expect(source).toContain('v-for="(scenario, index) in scenarios"');
    expect(source).toContain("String(index + 1).padStart(2, '0')");
    expect(source).toContain('.ts-tabs-group');
    expect(source).toContain('overflow-x: auto');
    expect(source).toContain('ref="scenarioTabs"');
    expect(source).toContain(':style="scenarioTabsMaskStyle"');
    expect(source).toContain('@scroll="updateScenarioTabsScrollMask"');
    expect(source).toContain('min-width: 40px');
    expect(source).toContain('height: 24px');
  });

  it('opens a real more menu with project and shortcut actions', () => {
    expect(source).toContain('v-model:visible="moreMenuOpen"');
    expect(source).toContain(':aria-expanded="moreMenuOpen"');
    expect(source).toContain('popper-class="header-more-popper"');
    expect(source).toContain('@click="$emit(\'shortcuts\')"');
    expect(source).toContain('@click="runProjectAction(\'open\')"');
    expect(source).toContain('@click="runProjectAction(\'receive\')"');
    expect(source).toContain('@click="runProjectAction(\'reset\')"');
    expect(source).toContain("t('timeline.header.moreTooltip')");
    expect(source).toContain("t('timeline.header.loadTooltip')");
    expect(source).toContain("t('timeline.header.receiveTooltip')");
    expect(source).toContain("t('timeline.header.resetTooltip')");
    expect(source).toContain("t('timeline.header.languageTooltip')");
    expect(source).toContain("t('timeline.header.shortcutsTooltip')");
    expect(source).toContain('class="header-more-tool-row__icon"');
    expect(source).toContain('width="18"');
    expect(source).toContain('class="header-more-tool-row__check"');
    expect(source).toContain('width="13"');
  });

  it('将项目放在编辑工具后、偏好和外观前，不再显示普攻序列开关', () => {
    const editTools = source.indexOf("t('timeline.header.sectionEditTools')");
    const project = source.indexOf("t('timeline.header.sectionProject')");
    const preferences = source.indexOf('{{ labels.preferences }}');
    const appearance = source.indexOf('header-more-pref-row--appearance');
    expect(editTools).toBeGreaterThan(-1);
    expect(project).toBeGreaterThan(editTools);
    expect(preferences).toBeGreaterThan(project);
    expect(appearance).toBeGreaterThan(preferences);
    expect(source).not.toContain('autoGroupBasicAttackSequences');
  });

  it('keeps the legacy analysis, export, display, and more commands permanently visible', () => {
    expect(source).not.toContain('class="history-actions"');
    expect(source).not.toContain('@click="$emit(\'open\')"\n      >');
    expect(source).not.toContain('command-button--reset');
    expect(source).toContain('class="tech-scenario-bar"');
    expect(source).toContain('class="ts-header-group"');
    expect(source).toContain('class="header-controls"');
    expect(source).toContain('<EaButton');
    expect(source).not.toContain('ea-btn');
    expect(source).toContain('width: 260px');
  });

  it('puts display before more, with a pinned guide card and scrollable display options', () => {
    const display = source.indexOf('v-model:visible="displayMenuOpen"');
    const more = source.indexOf('v-model:visible="moreMenuOpen"');
    expect(display).toBeGreaterThan(0);
    expect(display).toBeLessThan(more);
    expect(source.indexOf('class="timeline-display-guide"')).toBeLessThan(
      source.indexOf('class="timeline-display-scroll"'),
    );
    expect(source).toContain('if (open) moreMenuOpen.value = false');
    expect(source).toContain('if (open) displayMenuOpen.value = false');
    expect(source).toContain('data-keyboard-shortcut-scope="overlay"');
    expect(source).toContain(':aria-pressed="viewLayers[layerId]"');
    expect(source).toContain(':aria-pressed="operator.visible"');
  });

  it('clears timeline object selection only from toolbar blank space', () => {
    expect(source).toContain('@click.self="$emit(\'clearSelection\')"');
    expect(source).toContain('clearSelection: []');
  });

  it('restores the legacy view-layer checklist for layers Next actually renders', () => {
    expect(source).toContain('v-for="layerId in viewLayerIds"');
    expect(source).toContain('viewLayers[layerId]');
    expect(source).toContain("$emit('toggleViewLayer', layerId)");
    expect(TIMELINE_VIEW_LAYER_IDS).toContain('upperEffects');
    expect(TIMELINE_VIEW_LAYER_IDS).toContain('comboWindows');
  });

  it('restores per-operator effect visibility beside the layer checklist', () => {
    expect(source).toContain('v-for="operator in operatorEffects"');
    expect(source).toContain('operator.visible');
    expect(source).toContain("$emit('toggleOperatorEffects', operator.trackIndex)");
    expect(source).toContain('labels.viewOperatorsEmpty');
  });

  it('keeps the old language and light/dark appearance controls in the same menu', () => {
    expect(source).toContain("$emit('setLocale', localeId)");
    expect(source).toContain("$emit('setAppearance', 'light')");
    expect(source).toContain("$emit('setAppearance', 'dark')");
  });

  it('keeps the project title free of export-status decorations', () => {
    expect(source).not.toContain('projectDirty');
    expect(source).not.toContain('dirty-indicator');
  });
});
