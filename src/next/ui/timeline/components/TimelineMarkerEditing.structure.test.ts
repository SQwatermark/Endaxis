import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import inspectorSource from './TimelineExternalEventInspector.vue?raw';
import documentInspectorSource from './TimelineDocumentMarkerInspector.vue?raw';
import menuSource from './TimelineMarkerContextMenu.vue?raw';

describe('Next timeline marker editing structure', () => {
  it('renders and edits the legacy cycle, control-switch and simulation range markers', () => {
    expect(editorSource).toContain('scenario.battle.cycleBoundaries');
    expect(editorSource).toContain('scenario.battle.controlSwitches');
    expect(editorSource).toContain("'simulationStart'");
    expect(editorSource).toContain("'simulationEnd'");
    expect(editorSource).toContain('beginMarkerMove');
    expect(editorSource).toContain('simulation-range-dim');
  });

  it('keeps external facts explicitly restricted in the marker menu', () => {
    expect(menuSource).toContain('labels.restrictedHint');
    expect(menuSource).not.toContain('仅补充木桩模型无法自然产生的事件');
    expect(menuSource).toContain("$emit('addOperatorHit')");
    expect(menuSource).toContain("$emit('addOperatorWeakness')");
    expect(menuSource).toContain("$emit('addTeamHit')");
  });

  it('edits the proven external hit context from the marker inspector', () => {
    expect(editorSource).toContain('<TimelineExternalEventInspector');
    expect(editorSource).toContain('updateExternalEventMarker(current, marker.id, { event })');
    expect(inspectorSource).toContain('DAMAGE_TYPES');
    expect(inspectorSource).toContain('DAMAGE_TAGS');
    expect(inspectorSource).toContain('DAMAGE_FEATURES');
    expect(inspectorSource).toContain('boundaryHint');
    expect(inspectorSource).not.toContain('enemyDamage');
  });

  it('routes document-backed timeline markers through a focused inspector', () => {
    expect(editorSource).toContain('<TimelineDocumentMarkerInspector');
    expect(editorSource).toContain('setSelectedDocumentMarkerFrame');
    expect(editorSource).toContain('setSelectedControlSwitchTrack');
    expect(editorSource).toContain("commitScenario('setControlSwitchTrack'");
    expect(documentInspectorSource).toContain("kind === 'controlSwitch'");
    expect(documentInspectorSource).toContain("$emit('remove')");
    expect(documentInspectorSource).not.toContain('v-model');
  });

  it('exposes simulation line toggles and legacy box-selection mode', () => {
    expect(menuSource).toContain("$emit('toggleSimulationStart')");
    expect(menuSource).toContain("$emit('toggleSimulationEnd')");
    expect(editorSource).toContain(':box-select-enabled="boxSelectEnabled"');
    expect(editorSource).toContain('@toggle-box-select="toggleBoxSelect"');
  });

  it('localizes visible marker labels and their context-menu names', () => {
    expect(editorSource).toContain("t('nextTimeline.markerLabels.cycleBoundary')");
    expect(editorSource).toContain("t('nextTimeline.markerLabels.controlSwitch')");
    expect(editorSource).toContain("t('nextTimeline.markerLabels.simulationStart')");
    expect(editorSource).toContain("t('nextTimeline.markerLabels.simulationEnd')");
    expect(editorSource).toContain("t('nextTimeline.markerLabels.hitShort')");
    expect(editorSource).not.toContain('<b>循环分界线</b>');
    expect(editorSource).not.toContain("? '受击' : '弱点'");
    expect(editorSource).not.toContain('<b>模拟起始线</b>');
    expect(editorSource).not.toContain('<b>模拟终止线</b>');
  });

  it('cancels marker previews on pointer cancellation or Escape', () => {
    expect(editorSource).toContain("window.addEventListener('pointercancel', cancel)");
    expect(editorSource).toContain("window.addEventListener('keydown', keydown, true)");
    expect(editorSource).toContain('stopMarkerMove = cancel');
    expect(editorSource).not.toContain("window.addEventListener('pointercancel', finish)");
  });

  it('selects on pointer down but waits for the shared five-pixel threshold before moving', () => {
    expect(editorSource).toContain('initialPointerX: event.clientX');
    expect(editorSource).toContain('dragStarted: false');
    expect(editorSource).toContain('!passedTimelineDragThreshold(');
    expect(editorSource).toContain('dragStarted: true');
  });

  it('opens the marker context menu as a focused keyboard menu', () => {
    expect(menuSource).toContain('role="menu"');
    expect(menuSource).toContain('role="menuitem"');
    expect(menuSource).toContain(
      "querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()",
    );
  });
});
