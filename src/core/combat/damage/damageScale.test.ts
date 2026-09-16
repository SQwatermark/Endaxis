import { describe, expect, it } from 'vitest';
import { DamageScaleAccumulator } from './damageScale';

describe('DamageScaleAccumulator', () => {
  it('multiplies repeated product additions and adds repeated normal additions', () => {
    const scales = new DamageScaleAccumulator();

    scales.modify('attacker', 'product', 0.2);
    scales.modify('attacker', 'product', 0.5);
    scales.modify('attacker', 'normal', 0.2);
    scales.modify('attacker', 'normal', 0.5);

    expect(scales.getZoneValue('product')).toBeCloseTo(1.8);
    expect(scales.getZoneValue('normal')).toBeCloseTo(1.7);
    expect(scales.getFinalValue()).toBeCloseTo(3.06);
  });

  it('combines attacker and defender sides according to the recovered zone definition', () => {
    const scales = new DamageScaleAccumulator();

    scales.modify('attacker', 'normal', 0.2);
    scales.modify('defender', 'normal', 0.3);

    expect(scales.getZoneValue('normal')).toBeCloseTo(1.56);
  });

  it('clamps negative and NaN zone results to zero', () => {
    const negative = new DamageScaleAccumulator();
    negative.modify('attacker', 'normal', -2);
    expect(negative.getZoneValue('normal')).toBe(0);

    const invalid = new DamageScaleAccumulator();
    invalid.modify('attacker', 'normal', Number.NaN);
    expect(invalid.getZoneValue('normal')).toBe(0);
  });

  it('separates another operator damage-scale source from the attacker baseline', () => {
    const scales = new DamageScaleAccumulator();
    scales.modify('attacker', 'normal', 0.2, {
      providerOperatorId: 'attacker',
      sourceKind: 'buff',
      sourceId: 'self-buff',
    });
    scales.modify('attacker', 'normal', 0.3, {
      providerOperatorId: 'support',
      sourceKind: 'buff',
      sourceId: 'support-buff',
    });

    expect(scales.getFinalValue()).toBeCloseTo(1.5);
    expect(scales.getSelfValue('attacker')).toBeCloseTo(1.2);
    expect(scales.getContributionLogEffects('attacker')).toEqual([
      expect.objectContaining({
        providerOperatorId: 'support',
        sourceId: 'support-buff',
        logEffect: expect.closeTo(Math.log(1.5 / 1.2), 10),
      }),
    ]);
  });
});
