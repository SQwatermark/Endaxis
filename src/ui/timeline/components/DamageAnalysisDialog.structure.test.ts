import { describe, expect, it } from 'vitest';
import source from './DamageAnalysisDialog.vue?raw';

describe('DamageAnalysisDialog structure', () => {
  it('keeps receipt-only analysis boundaries visible without hard-coded locale text', () => {
    expect(source).toContain('labels.unattributedDamage');
    expect(source).toContain('labels.contributionUnavailable');
    expect(source).not.toContain('未归属伤害');
    expect(source).not.toContain('推测性归因');
  });

  it('formats numbers with the editor locale', () => {
    expect(source).toContain('locale: string');
    expect(source).toContain('new Intl.NumberFormat(props.locale');
    expect(source).toContain('numberFormatter.value.format');
  });

  it('restores the legacy chart, summary, and FAQ layout', () => {
    expect(source).toContain("import VChart from 'vue-echarts'");
    expect(source.match(/<VChart/g)).toHaveLength(2);
    expect(source).toContain('class="charts-row"');
    expect(source).toContain('class="summary-row"');
    expect(source).toContain('class="faq-section"');
    expect(source).toContain('<el-collapse-item');
    expect(source).toContain('width="90vw"');
    expect(source).toContain('top="3vh"');
  });

  it('keeps unsupported contribution attribution visibly unavailable', () => {
    expect(source).toContain('class="chart contribution-unavailable"');
    expect(source).toContain('{{ labels.contributionUnavailable }}');
    expect(source).not.toContain('lmdiAttributionMode');
  });
});
