import { describe, expect, it } from 'vitest';
import editorSource from '../NextTimelineEditor.vue?raw';
import enemySource from './EnemyCombatHudSnapshot.vue?raw';
import effectsSource from './TimelineEnemyEffects.vue?raw';
import trackHeaderSource from './TimelineTrackHeader.vue?raw';

describe('combat HUD snapshot integration', () => {
  it('uses one receipt-backed snapshot for the cursor guide and fixed status bars', () => {
    expect(editorSource).toContain('projectCombatHudSnapshot({');
    expect(editorSource).toContain(':hud-snapshot="combatHudSnapshot.enemy"');
    expect(editorSource).toContain(
      ':hud-snapshot="operatorHudSnapshotFor(track.operatorInstanceId)"',
    );
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

  it('keeps compact operator runtime facts in the existing track header', () => {
    expect(trackHeaderSource).toContain('hudSnapshot.ultimateEnergy.current');
    expect(trackHeaderSource).toContain('hudSnapshot.comboWindows.length');
    expect(trackHeaderSource).toContain('hudSnapshot.cooldowns.length');
    expect(trackHeaderSource).toContain('activeSkillLabel');
    expect(trackHeaderSource).toContain('v-for="button in skillButtons"');
    expect(editorSource).toContain('definition.playerActionRoutes?.[action]');
    expect(editorSource).toContain('snapshot.skillSlots.find');
    expect(editorSource).toContain('snapshot.battleSkillProgress');
    expect(editorSource).toContain('current.buffProgressCurves');
    expect(editorSource).toContain('combatHudSnapshot?.mainCharacterHpProgress');
    expect(trackHeaderSource).toContain('button.progressRatio');
    expect(trackHeaderSource).toContain('hpBarProgress.ratio');
  });
});
