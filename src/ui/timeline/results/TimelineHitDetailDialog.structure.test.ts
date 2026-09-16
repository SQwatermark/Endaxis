import { describe, expect, it } from 'vitest';
import source from './TimelineHitDetailDialog.vue?raw';
import editorSource from '../TimelineEditor.vue?raw';

describe('TimelineHitDetailDialog structure', () => {
  it('hides impossible critical results only with explicit permission and gates forced results per receipt', () => {
    expect(source).toContain('canCritical: data.canCritical !== false');
    expect(source).toContain('<tr v-if="detail.canCritical" class="dim">');
    expect(source).toContain('resultForceCritical && detail.canForceCritical');
    expect(source).not.toContain('forceCritical && detail.canForceCritical');
    expect(source).toContain(':model-value="forceCritical"');
    expect(source).not.toContain('canCritical: criticalRate > 0');
  });
  it('uses the published simulation mode for the headline and keeps expectation as sampled reference', () => {
    expect(source).toContain(
      "headline: props.randomMode === 'expected' ? expectedDamage : actualValue",
    );
    expect(source).toContain("randomMode === 'expected'");
    expect(source).toContain('labels.actualDamage');
    expect(source).toContain("randomMode === 'sampled'");
    expect(source).toContain('detail.expectedDamage');
    expect(source).toContain('labels.criticalResult');
    expect(source).toContain('props.labels.criticalRate');
    expect(source).toContain('props.labels.cannotCritical');
  });
  it('resolves burst source names through the project template, not its icon asset identity', () => {
    const start = editorSource.indexOf('function enemyDamageSourceDescription(');
    const end = editorSource.indexOf('function enemyDamageOperatorPanel(', start);
    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);
    const body = editorSource.slice(start, end);
    expect(body).toContain('track?.operator?.operatorSlug');
    expect(body).toContain('publishedOperatorName(operatorSlug)');
    expect(body).not.toContain('operatorAssetSlug');
    expect(body).not.toContain('getOperatorGameName(');
  });
  it('isolates per-receipt source panels and clears expansion when the receipt group changes', () => {
    expect(source).toContain('props.sourceDescription?.(entry)');
    expect(source).toContain('props.operatorPanelForEntry(entry)');
    expect(source).toContain('() => props.entries');
    expect(source).toContain('openAttackDetails.value = new Set()');
    expect(source).toContain("'is-multiple': damageDetails.length > 1");
  });
  it('follows the legacy context-result-base-multiplier hierarchy using receipt facts', () => {
    expect(source).toContain('<EaDialog');
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
    expect(source).toContain('projectAttackDetail');
    expect(source).toContain('<ArrowRight />');
    expect(source).toContain('labels.basicTotal');
    expect(source).toContain('labels.baseAttack');
    expect(source).toContain('labels.operatorAttack');
    expect(source).toContain('labels.weaponAttack');
    expect(source).toContain('labels.attackBonus');
    expect(source).toContain('detail.attackDetail.attackPercentSources');
    expect(source).toContain('contributionSourceLabel(source, detail.key)');
    expect(source).toContain('class="label-cell indent-4"');
    expect(source).toContain('labels.attributeBonus');
    expect(source).toContain('data.skillMultiplierPercent');
    expect(source).toContain('data.baseDamage');
    expect(source).toContain('data.damageScaleMultiplier');
    expect(source).toContain('data.criticalExpectationMultiplier');
    expect(source).toContain('data.directDamageMultiplier');
    expect(source).toContain('data.defenseMultiplier');
    expect(source).toContain('data.enemyResistancePercent');
    expect(source).toContain('data.resistancePercentMultiplier');
    expect(source).not.toContain('1 + Math.min(Math.max(criticalRate');
    expect(source).not.toContain('data.calculationMultiplier');
  });

  it('shows the frozen per-hit contribution sources without recalculating them in the dialog', () => {
    expect(source).toContain('data?.contribution');
    expect(source).toContain('detail.contributionRows');
    expect(source).toContain('labels.selfContribution');
    expect(source).toContain('props.contributionProviderLabel(providerOperatorId)');
    expect(source).toContain('props.contributionSourceName(sourceId)');
    expect(editorSource).toContain(':contribution-provider-label="contributionProviderName"');
    expect(editorSource).toContain(':contribution-source-name="contributionSourceName"');
  });

  it('uses the legacy dialog shell and force-critical footer interaction', () => {
    expect(source).toContain('canForceCritical && allowForceCritical !== false');
    expect(source).toContain(':model-value="visible"');
    expect(source).toContain('width="420px"');
    expect(source).toContain('@update:model-value="onClose"');
    expect(source).toContain(':model-value="forceCritical"');
    expect(source).toContain("emit('toggleForceCritical'");
    expect(source).toContain('labels.forceCrit');
    expect(source).not.toContain('class="hit-detail-overlay"');
    expect(source).not.toContain('class="headline-damage"');
  });
});
