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
    expect(
      result.self +
        result.unallocated +
        result.external.reduce((sum, entry) => sum + entry.value, 0),
    ).toBe(150);
    expect(result.self).toBeCloseTo(100, 10);
    expect(result.unallocated).toBeCloseTo(0, 10);
  });

  it('keeps unexplained damage separate instead of inflating known sources', () => {
    const result = decomposeDamageContribution(180, 100, [
      {
        providerOperatorId: 'support',
        sourceKind: 'buff',
        sourceId: 'known-buff',
        logEffect: Math.log(1.2),
      },
    ]);
    const expectedKnownContribution = ((180 - 100) / Math.log(180 / 100)) * Math.log(1.2);

    expect(result.self).toBe(100);
    expect(result.external[0]!.value).toBeCloseTo(expectedKnownContribution, 10);
    expect(result.unallocated).toBeCloseTo(80 - expectedKnownContribution, 10);
    expect(result.self + result.unallocated + result.external[0]!.value).toBe(180);
    expect(result.diagnostics).toContain(
      'recorded source multipliers do not fully explain the self-damage difference',
    );
  });

  it('preserves cancelling known effects while leaving other differences unattributed', () => {
    const result = decomposeDamageContribution(120, 100, [
      {
        providerOperatorId: 'support-a',
        sourceKind: 'buff',
        sourceId: 'damage-up',
        logEffect: Math.log(1.25),
      },
      {
        providerOperatorId: 'support-b',
        sourceKind: 'buff',
        sourceId: 'damage-down',
        logEffect: Math.log(0.8),
      },
    ]);

    expect(result.external[0]!.value).toBeGreaterThan(0);
    expect(result.external[1]!.value).toBeLessThan(0);
    expect(result.external[0]!.value + result.external[1]!.value).toBeCloseTo(0, 10);
    expect(result.unallocated).toBeCloseTo(20, 10);
    expect(
      result.self +
        result.unallocated +
        result.external.reduce((sum, entry) => sum + entry.value, 0),
    ).toBe(120);
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
    expect(scaled.self + scaled.unallocated + scaled.external[0]!.value).toBe(40);
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
