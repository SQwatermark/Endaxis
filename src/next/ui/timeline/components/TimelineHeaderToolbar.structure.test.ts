import { describe, expect, it } from 'vitest';
import { NEXT_TIMELINE_VIEW_LAYER_IDS } from '../timelineViewLayers';
import source from './TimelineHeaderToolbar.vue?raw';

describe('TimelineHeaderToolbar structure', () => {
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

  it('renders every scenario as a numbered scrollable tab', () => {
    expect(source).toContain('v-for="(scenario, index) in scenarios"');
    expect(source).toContain("String(index + 1).padStart(2, '0')");
    expect(source).toContain('.scenario-tabs');
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
    expect(source).toContain('popper-class="next-header-more"');
    expect(source).toContain('@click="$emit(\'shortcuts\')"');
    expect(source).toContain('@click="$emit(\'open\')"');
    expect(source).toContain('@click="$emit(\'reset\')"');
  });

  it('keeps only the legacy analysis, export, and more commands permanently visible', () => {
    expect(source).not.toContain('class="history-actions"');
    expect(source).not.toContain('@click="$emit(\'open\')"\n      >');
    expect(source).not.toContain('command-button--reset');
    expect(source).toContain('class="scenario-heading-group"');
    expect(source).toContain('width: 260px');
  });

  it('clears timeline object selection only from toolbar blank space', () => {
    expect(source).toContain('@click.self="$emit(\'clearSelection\')"');
    expect(source).toContain('clearSelection: []');
  });

  it('restores the legacy view-layer checklist for layers Next actually renders', () => {
    expect(source).toContain('v-for="layerId in viewLayerIds"');
    expect(source).toContain('viewLayers[layerId]');
    expect(source).toContain("$emit('toggleViewLayer', layerId)");
    expect(NEXT_TIMELINE_VIEW_LAYER_IDS).toContain('upperEffects');
    expect(NEXT_TIMELINE_VIEW_LAYER_IDS).toContain('comboWindows');
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

  it('localizes the unsaved-project indicator', () => {
    expect(source).toContain(':title="labels.projectDirty"');
    expect(source).not.toContain('title="项目有未导出修改"');
  });
});
