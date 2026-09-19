import { describe, expect, it } from 'vitest';
import editorSource from '../TimelineEditor.vue?raw';
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

  it('renders editable Dodge markers and keeps incomplete native evidence local to the marker', () => {
    expect(menuSource).toContain("$emit('addDodge', 'dodge')");
    expect(menuSource).toContain("$emit('addDodge', 'perfectDodge')");
    expect(editorSource).toContain('scenario.battle.dodgeMarkers');
    expect(editorSource).toContain('projectDodgeMarkerDiagnostics(publishedReceiptEntries.value)');
    expect(editorSource).toContain('dodge-marker__warning');
    expect(documentInspectorSource).toContain("kind === 'dodge'");
    expect(documentInspectorSource).toContain("emit('setDodgeMode'");
    expect(documentInspectorSource).toContain("emit('setSuccessDelayFrames'");
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
    expect(editorSource).toContain("t('timeline.markerLabels.cycleBoundary')");
    expect(editorSource).toContain("t('timeline.markerLabels.controlSwitch')");
    expect(editorSource).toContain("'timeline.markerLabels.simulationStart'");
    expect(editorSource).toContain("'timeline.markerLabels.simulationEnd'");
    expect(editorSource).toContain("t('timeline.markerLabels.hitShort')");
    expect(editorSource).not.toContain('<b>循环分界线</b>');
    expect(editorSource).not.toContain("? '受击' : '弱点'");
    expect(editorSource).not.toContain('<b>模拟起始线</b>');
    expect(editorSource).not.toContain('<b>模拟终止线</b>');
  });

  it('cancels marker previews on pointer cancellation or Escape', () => {
    expect(editorSource).toContain("window.addEventListener('pointercancel', cancel)");
    expect(editorSource).toContain("interactionSession.tryStart('marker-move'");
    expect(editorSource).toContain('stopMarkerMove = cancel');
    expect(editorSource).not.toContain("window.addEventListener('pointercancel', finish)");
  });

  it('selects on pointer down but waits for the shared five-pixel threshold before moving', () => {
    expect(editorSource).toContain('initialPointerX: event.clientX');
    expect(editorSource).toContain('dragStarted: false');
    expect(editorSource).toContain('!passedTimelineDragThreshold(');
    expect(editorSource).toContain('dragStarted: true');
  });

  it('exposes menu semantics without stealing focus when it opens', () => {
    expect(menuSource).toContain('role="menu"');
    expect(menuSource).toContain('role="menuitem"');
    expect(menuSource).not.toContain("querySelector<HTMLButtonElement>('button:not(:disabled)')");
  });

  it('restores the legacy global menu and cycle/start/end line presentation', () => {
    expect(menuSource).toContain("t('contextMenu.globalOps')");
    expect(menuSource).toContain('class="menu-item"');
    expect(menuSource).toContain('background: #007fd4');
    expect(menuSource).toContain('animation: marker-menu-fade-in 0.1s ease-out');
    expect(editorSource).toMatch(
      /\.cycle-boundary-marker \{[\s\S]*background: #d3adff;[\s\S]*box-shadow: 0 0 6px #d3adff;/,
    );
    expect(editorSource).toMatch(
      /\.simulation-range-marker \{[\s\S]*background: #22cc44;[\s\S]*box-shadow: 0 0 6px #22cc44;/,
    );
    expect(editorSource).toMatch(
      /\.simulation-range-marker--end \{[\s\S]*background: #cc2222;[\s\S]*box-shadow: 0 0 6px #cc2222;/,
    );
    expect(editorSource).toContain('.simulation-range-marker.selected');
    expect(editorSource).toContain('.cycle-boundary-marker.selected');
    expect(editorSource).toMatch(/:not\(\s*\.track-switch-marker\s*\)/);
    expect(editorSource).toContain('.track-switch-marker.selected .track-switch-marker__avatar');
    expect(editorSource).toContain('border-color: #fff');
  });
});
