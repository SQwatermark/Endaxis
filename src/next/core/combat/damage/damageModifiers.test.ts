import { describe, expect, it, vi } from 'vitest';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from './damageScaleAttributes';
import { DamageModifier } from './damageModifiers';
import { PlayerDamageContext, type PlayerDamageAttributeSnapshots } from './playerDamageContext';

const scaleAttributes = Object.fromEntries(
  DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
) as unknown as DamageScaleAttributeSnapshot;

function createContext(damageType: 'physical' | 'lifeDrain' = 'physical') {
  const snapshots: PlayerDamageAttributeSnapshots = {
    attacker: {
      ...scaleAttributes,
      attack: 100,
      criticalRate: 0,
      criticalDamageIncrease: 0,
      weaknessDamageMultiplier: 1,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...scaleAttributes,
      defense: 0,
      shelterDamageMultiplier: 0,
      breakingAttackDamageTakenMultiplier: 1,
      resistances: {
        physical: { percent: 0, damageTakenMultiplier: 1 },
        heat: { percent: 0, damageTakenMultiplier: 1 },
        electric: { percent: 0, damageTakenMultiplier: 1 },
        cryo: { percent: 0, damageTakenMultiplier: 1 },
        nature: { percent: 0, damageTakenMultiplier: 1 },
        ether: { percent: 0, damageTakenMultiplier: 1 },
      },
    },
  };
  return new PlayerDamageContext({
    sourceId: 'operator',
    targetId: 'enemy',
    damageType,
    targetHealthType: 'normal',
    ports: {
      captureAttributeSnapshots: () => snapshots,
      applyModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
    },
  });
}

describe('DamageModifier', () => {
  it('checks side, owner and condition before running processors in declaration order', () => {
    const condition = {
      kind: 'entityTagMatch',
      target: 'enemy',
      tagQueryType: 'hasAny',
      tagIds: [1925762097],
    } as const;
    const evaluateCondition = vi.fn(() => true);
    const context = createContext();
    const modifier = new DamageModifier('operator', {
      enabledSide: 'attacker',
      condition,
      processors: [
        {
          kind: 'multiplyValue',
          timing: 'beforeCalculation',
          targetHealthTypes: ['normal'],
          scale: 1.5,
        },
        { kind: 'damageScale', side: 'attacker', zone: 'product', addition: 0.2 },
      ],
    });

    modifier.apply('beforeCalculation', 'defender', context, evaluateCondition);
    modifier.apply('beforeCalculation', 'attacker', context, evaluateCondition);
    context.setCalculationResult(100);
    modifier.apply('afterCalculation', 'attacker', context, evaluateCondition);

    expect(evaluateCondition).toHaveBeenCalledTimes(2);
    expect(evaluateCondition).toHaveBeenLastCalledWith(condition);
    expect(context.value).toBe(150);
    expect(context.damageScales.getFinalValue()).toBeCloseTo(1.2);
  });

  it('rejects a modifier owned by the wrong entity and all processors for life drain', () => {
    const normal = createContext();
    const wrongOwner = new DamageModifier('other', {
      enabledSide: 'attacker',
      processors: [
        {
          kind: 'multiplyValue',
          timing: 'beforeCalculation',
          targetHealthTypes: ['normal'],
          scale: 2,
        },
      ],
    });
    wrongOwner.apply('beforeCalculation', 'attacker', normal);
    normal.setCalculationResult(100);
    expect(normal.value).toBe(100);

    const lifeDrain = createContext('lifeDrain');
    const modifier = new DamageModifier('operator', {
      enabledSide: 'attacker',
      processors: [
        {
          kind: 'multiplyValue',
          timing: 'beforeCalculation',
          targetHealthTypes: ['normal'],
          scale: 2,
        },
      ],
    });
    modifier.apply('beforeCalculation', 'attacker', lifeDrain);
    lifeDrain.setCalculationResult(100);
    expect(lifeDrain.value).toBe(100);
  });
});
