import { describe, expect, it } from 'vitest';
import type { OperatorPanelContributionReceipt } from '../../core/compiler/resolveOperatorPanel';
import {
  projectAttackPercentContributionSources,
  resolveOperatorPanelContributionSourceLabel,
} from './operatorPanelContributionPresentation';

const context = {
  operator: null,
  locale: 'zh-CN',
  translate: (key: string, params?: Record<string, unknown>) =>
    params?.node === undefined ? key : `${key}:${String(params.node)}`,
};

function entry(
  source: OperatorPanelContributionReceipt['source'],
): OperatorPanelContributionReceipt {
  return { source, stat: 'attack', operation: 'percent', value: 0.1 };
}

describe('operator panel contribution presentation', () => {
  it('uses stable translated labels for base, trust, and global sources', () => {
    expect(
      resolveOperatorPanelContributionSourceLabel(
        entry({ kind: 'operatorBase', operatorSlug: 'test' }),
        context,
      ),
    ).toBe('statDetail.baseSource');
    expect(
      resolveOperatorPanelContributionSourceLabel(
        entry({ kind: 'trust', operatorSlug: 'test', node: 4 }),
        context,
      ),
    ).toBe('timeline.panel.trustNode:4');
    expect(
      resolveOperatorPanelContributionSourceLabel(
        entry({ kind: 'globalConfig', modifierId: 'global:attack' }),
        context,
      ),
    ).toBe('timeline.globalModifiers.title');
  });

  it('keeps an unresolved upgrade identity visible rather than inventing a name', () => {
    expect(
      resolveOperatorPanelContributionSourceLabel(
        entry({ kind: 'operatorUpgrade', upgradeKey: 'unknown-upgrade' }),
        context,
      ),
    ).toBe('unknown-upgrade');
  });

  it('selects only attack-percent facts for the damage-detail attack tree', () => {
    const attackPercent = entry({ kind: 'globalConfig', modifierId: 'attack-percent' });
    const panel = {
      receipt: [
        attackPercent,
        { ...attackPercent, operation: 'flat' as const },
        { ...attackPercent, stat: 'health' as const },
      ],
    };
    expect(projectAttackPercentContributionSources(panel)).toEqual([attackPercent]);
    expect(projectAttackPercentContributionSources(null)).toEqual([]);
  });
});
