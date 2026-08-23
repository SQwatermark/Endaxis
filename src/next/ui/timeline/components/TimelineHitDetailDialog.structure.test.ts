import { describe, expect, it } from 'vitest';
import source from './TimelineHitDetailDialog.vue?raw';

describe('TimelineHitDetailDialog structure', () => {
  it('follows the legacy context-result-base-multiplier hierarchy using receipt facts', () => {
    expect(source).toContain('<el-dialog');
    expect(source).toContain('class="hit-damage-detail-dialog"');
    expect(source).toContain('labels.dialogTitle');
    expect(source).toContain('labels.context');
    expect(source).toContain('labels.result');
    expect(source).toContain('labels.base');
    expect(source).toContain('labels.multipliers');
    expect(source).toContain('class="expected-damage"');
    expect(source).toContain("entry.event !== 'DamageApplied'");
    expect(source).toContain('labels.expectedDamage');
    expect(source).toContain('labels.criticalDamage');
    expect(source).toContain('labels.nonCriticalDamage');
    expect(source).toContain('data.attack');
    expect(source).toContain('data.skillMultiplierPercent');
    expect(source).toContain('data.baseDamage');
    expect(source).toContain('data.damageScaleMultiplier');
    expect(source).toContain('data.calculationMultiplier');
    expect(source).toContain('data.defenseMultiplier');
    expect(source).toContain('data.enemyResistancePercent');
  });

  it('uses the legacy dialog shell and force-critical footer interaction', () => {
    expect(source).toContain(':model-value="visible"');
    expect(source).toContain('width="420px"');
    expect(source).toContain('@update:model-value="onClose"');
    expect(source).toContain(':checked="forceCritical"');
    expect(source).toContain("emit('toggleForceCritical'");
    expect(source).toContain('labels.forceCrit');
    expect(source).not.toContain('class="hit-detail-overlay"');
    expect(source).not.toContain('class="headline-damage"');
  });
});
