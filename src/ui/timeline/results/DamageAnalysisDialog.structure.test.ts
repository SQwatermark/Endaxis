import { describe, expect, it } from 'vitest';
import source from './DamageAnalysisDialog.vue?raw';

describe('DamageAnalysisDialog structure', () => {
  it('keeps receipt-only analysis boundaries visible without hard-coded locale text', () => {
    expect(source).toContain('labels.unattributedDamage');
    expect(source).not.toContain('labels.contributionUnavailable');
    expect(source).not.toContain('未归属伤害');
    expect(source).not.toContain('推测性归因');
  });

  it('formats numbers with the editor locale', () => {
    expect(source).toContain('locale: string');
    expect(source).toContain('new Intl.NumberFormat(props.locale');
    expect(source).toContain('numberFormatter.value.format');
  });

  it('identifies expected totals and seeded sampled totals separately', () => {
    expect(source).toContain("randomMode: 'expected' | 'sampled'");
    expect(source).toContain('globalRandomSeed: number');
    expect(source).toContain('labels.expectedModeDescription');
    expect(source).toContain('labels.sampledModeDescription(String(globalRandomSeed))');
    expect(source).toContain('labels.expectedTotalDamage');
    expect(source).toContain('labels.sampledTotalDamage');
  });

  it('restores the legacy chart, summary, and FAQ layout', () => {
    expect(source).toContain("import VChart from 'vue-echarts'");
    expect(source.match(/<VChart/g)).toHaveLength(3);
    expect(source).toContain('class="charts-row"');
    expect(source).toContain('class="summary-row"');
    expect(source).toContain('class="faq-section"');
    expect(source).toContain('<el-collapse-item');
    expect(source).toContain('width="90vw"');
    expect(source).toContain('top="3vh"');
  });

  it('shows undecomposed damage as own damage in the legacy two-ring layout', () => {
    expect(source).toContain(':option="contributionChartOption"');
    expect(source).toContain("radius: ['0%', '38%']");
    expect(source).toContain("radius: ['48%', '68%']");
    expect(source).not.toContain('lmdiAttributionMode');
  });
});
