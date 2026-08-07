import { describe, expect, it } from 'vitest';
import { SharedSpGainModifier, SharedSpGainModifierSet } from './sharedSpGainModifiers';

describe('SharedSpGainModifierSet', () => {
  it('combines the base gain segment and power-attack segment in native order', () => {
    const modifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 1.2 });
    modifiers.add(new SharedSpGainModifier('gainEfficiency', 'addition', 0.3, true));
    modifiers.add(new SharedSpGainModifier('gainEfficiency', 'multiplier', 0.5, true));
    modifiers.add(new SharedSpGainModifier('powerAttackEfficiency', 'addition', 0.2, false));
    modifiers.add(new SharedSpGainModifier('powerAttackEfficiency', 'multiplier', 0.25, false));

    expect(modifiers.resolve('powerAttack', 'gain')).toEqual({
      gainEfficiency: 2.25,
      sourceEfficiency: 1.5,
      totalEfficiency: 3.375,
    });
  });

  it('filters only the base gain segment for returned SP', () => {
    const modifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 1 });
    modifiers.add(new SharedSpGainModifier('gainEfficiency', 'addition', 0.5, false));
    modifiers.add(new SharedSpGainModifier('gainEfficiency', 'addition', 0.25, true));
    modifiers.add(new SharedSpGainModifier('powerAttackEfficiency', 'addition', 0.5, false));

    expect(modifiers.resolve('powerAttack', 'return')).toEqual({
      gainEfficiency: 1.25,
      sourceEfficiency: 1.5,
      totalEfficiency: 1.875,
    });
  });

  it('clamps each multiplier segment to a non-negative factor', () => {
    const modifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 1 });
    modifiers.add(new SharedSpGainModifier('gainEfficiency', 'multiplier', -2, true));
    modifiers.add(new SharedSpGainModifier('powerAttackEfficiency', 'multiplier', -3, true));

    expect(modifiers.resolve('powerAttack', 'gain')).toEqual({
      gainEfficiency: 0,
      sourceEfficiency: 0,
      totalEfficiency: 0,
    });
  });

  it('registers and removes modifiers by identity', () => {
    const modifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 1 });
    const first = new SharedSpGainModifier('gainEfficiency', 'addition', 0.5, true);
    const second = new SharedSpGainModifier('gainEfficiency', 'addition', 0.5, true);
    modifiers.add(first);
    modifiers.add(first);
    modifiers.add(second);

    expect(modifiers.modifierCount).toBe(2);
    expect(modifiers.remove(first)).toBe(true);
    expect(modifiers.resolve('skill', 'gain').totalEfficiency).toBe(1.5);
    expect(modifiers.remove(first)).toBe(false);
  });

  it('keeps personal ultimate energy outside the shared SP model', () => {
    const modifiers = new SharedSpGainModifierSet({ baseGainEfficiency: 0.8 });

    expect(Object.keys(modifiers.settings)).toEqual(['baseGainEfficiency']);
    expect(modifiers.resolve('default', 'gain').totalEfficiency).toBe(0.8);
  });
});
