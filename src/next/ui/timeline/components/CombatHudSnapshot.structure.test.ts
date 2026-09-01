import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import enemySource from './EnemyCombatHudSnapshot.vue?raw';
import effectsSource from './TimelineEnemyEffects.vue?raw';
import trackHeaderSource from './TimelineTrackHeader.vue?raw';

describe('combat HUD snapshot integration', () => {
  it('uses one receipt-backed snapshot for the enemy HUD without projecting status into track headers', () => {
    expect(editorSource).toContain('projectCombatHudSnapshot({');
    expect(editorSource).toContain(':hud-snapshot="combatHudSnapshot.enemy"');
    expect(editorSource).not.toContain(':hud-snapshot="operatorHudSnapshotFor');
    expect(editorSource).not.toContain(':active-skill-label=');
    expect(editorSource).not.toContain(':skill-buttons=');
    expect(editorSource).not.toContain("from '../../core/projection/curveSampling'");
  });

  it('renders enemy health and poise without deriving either value in the component', () => {
    expect(enemySource).toContain('snapshot.health.current');
    expect(enemySource).toContain('props.snapshot.poise?.state');
    expect(enemySource).not.toContain('receiptEntries');
    expect(effectsSource).toContain('<EnemyCombatHudSnapshot');
    expect(effectsSource).toContain(':poise-knot-thresholds="poiseKnotThresholds"');
  });

  it('renders configured poise knots without inventing weakness-window state', () => {
    expect(enemySource).toContain('v-for="threshold in poiseKnotThresholds"');
    expect(enemySource).toContain('class="gauge__knot"');
    expect(enemySource).toContain('(1 - threshold) * 100');
    expect(enemySource).not.toContain('weakness');
  });

  it('keeps all operator time-varying state out of the avatar area', () => {
    expect(trackHeaderSource).not.toContain('runtime-summary');
    expect(trackHeaderSource).not.toContain('skill-hud-buttons');
    expect(trackHeaderSource).not.toContain('hudSnapshot');
    expect(trackHeaderSource).not.toContain('skillButtons');
    expect(editorSource).toContain('current.buffProgressCurves');
    expect(trackHeaderSource).not.toContain('CombatStatusIconStrip');
    expect(trackHeaderSource).not.toContain('OperatorPassiveUiWidget');
    expect(trackHeaderSource).not.toContain('hpBarProgress');
    expect(editorSource).not.toContain(
      ':status-indicators="statusIndicatorsForTarget(track.operatorInstanceId)"',
    );
  });
});
