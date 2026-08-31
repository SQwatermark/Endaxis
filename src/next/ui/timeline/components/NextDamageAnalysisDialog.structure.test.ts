import { describe, expect, it } from 'vitest';
import source from './NextDamageAnalysisDialog.vue?raw';

describe('NextDamageAnalysisDialog structure', () => {
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
});
