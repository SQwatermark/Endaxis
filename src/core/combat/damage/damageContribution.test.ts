import { describe, expect, it } from 'vitest';
import { decomposeDamageContribution, scaleDamageContribution } from './damageContribution';

describe('damage contribution', () => {
  it('uses logarithmic mean decomposition and closes exactly to actual damage', () => {
    const result = decomposeDamageContribution(150, 100, [
      {
        providerOperatorId: 'support-a',
        sourceKind: 'buff',
        sourceId: 'buff-a',
        logEffect: Math.log(1.2),
      },
      {
        providerOperatorId: 'support-b',
        sourceKind: 'buff',
        sourceId: 'buff-b',
        logEffect: Math.log(1.25),
      },
    ]);

    expect(result.external).toHaveLength(2);
    expect(result.self + result.external.reduce((sum, entry) => sum + entry.value, 0)).toBe(150);
    expect(result.self).toBeCloseTo(100, 10);
  });

  it('keeps negative external effects and rescales after shield absorption', () => {
    const contribution = decomposeDamageContribution(80, 100, [
      {
        providerOperatorId: 'enemy',
        sourceKind: 'buff',
        sourceId: 'damage-down',
        logEffect: Math.log(0.8),
      },
    ]);
    const scaled = scaleDamageContribution(contribution, 40);

    expect(scaled.external[0]!.value).toBeLessThan(0);
    expect(scaled.self + scaled.external[0]!.value).toBe(40);
  });

  it('leaves invalid zero-baseline cases with the attacker', () => {
    const result = decomposeDamageContribution(20, 0, [
      {
        providerOperatorId: 'support',
        sourceKind: 'buff',
        sourceId: 'buff',
        logEffect: Math.log(2),
      },
    ]);

    expect(result.self).toBe(20);
    expect(result.external).toEqual([]);
    expect(result.diagnostics).not.toHaveLength(0);
  });
});
