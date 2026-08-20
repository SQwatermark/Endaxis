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

function createContext(
  damageType: 'physical' | 'lifeDrain' = 'physical',
  addInstantAttributeModifier: PlayerDamageContext['addInstantAttributeModifier'] = () => undefined,
) {
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
      addInstantAttributeModifier,
      clearInstantAttributeModifiers: () => undefined,
    },
  });
}

describe('DamageModifier', () => {
  it('resolves a Buff value into a one-hit instant attribute modifier', () => {
    const addInstantAttributeModifier = vi.fn();
    const context = createContext('physical', addInstantAttributeModifier);
    const modifier = new DamageModifier(
      'operator',
      {
        enabledSide: 'attacker',
        condition: {
          kind: 'eventDamageTagsMatch',
          match: 'hasAll',
          tags: ['ultimateSkill'],
        },
        processors: [
          {
            kind: 'instantAttribute',
            targetSide: 'attacker',
            attribute: 'criticalDamageIncrease',
            values: {
              slot: 'baseAddition',
              value: { blackboardKey: 'critical_damage_up_to_bleed' },
            },
            attributeTiming: 'runtime',
          },
        ],
      },
      value =>
        typeof value === 'number'
          ? value
          : value.blackboardKey === 'critical_damage_up_to_bleed'
            ? 0.2
            : 0,
    );

    modifier.apply('beforeCalculation', 'attacker', context, () => true);

    expect(addInstantAttributeModifier).toHaveBeenCalledWith('attacker', {
      attribute: 'criticalDamageIncrease',
      values: expect.objectContaining({ baseAddition: 0.2 }),
      timing: 'runtime',
    });
  });

  it('evaluates composite event conditions and Buff-instance blackboard comparisons', () => {
    const context = createContext();
    const evaluateCondition = vi.fn(() => true);
    const modifier = new DamageModifier(
      'operator',
      {
        enabledSide: 'attacker',
        condition: {
          kind: 'all',
          conditions: [
            { kind: 'casterControlled' },
            {
              kind: 'eventDamageTagsMatch',
              match: 'hasAny',
              tags: ['normalAttackLastCombo'],
            },
            {
              kind: 'buffBlackboardCompare',
              left: { blackboardKey: 'potential_1' },
              operator: 'equal',
              right: 1,
            },
          ],
        },
        processors: [{ kind: 'damageScale', side: 'attacker', zone: 'normal', addition: 0.25 }],
      },
      value => (typeof value === 'number' ? value : value.blackboardKey === 'potential_1' ? 1 : 0),
    );

    modifier.apply('afterCalculation', 'attacker', context, evaluateCondition);

    expect(evaluateCondition).toHaveBeenCalledTimes(2);
    expect(context.damageScales.getFinalValue()).toBeCloseTo(1.25);
  });

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
    expect(evaluateCondition).toHaveBeenLastCalledWith(condition, expect.any(Function));
    expect(context.value).toBe(150);
    expect(context.damageScales.getFinalValue()).toBeCloseTo(1.2);
  });

  it('passes target-health conditions and the owning Buff number resolver to the environment', () => {
    const context = createContext();
    const condition = {
      kind: 'targetHealthCompare',
      target: 'enemy',
      valueType: 'ratio',
      operator: 'less',
      value: { blackboardKey: 'hp_remain' },
    } as const;
    const evaluateCondition = vi.fn(
      (_condition, resolveNumber) => resolveNumber(condition.value) === 0.5,
    );
    const modifier = new DamageModifier(
      'operator',
      {
        enabledSide: 'attacker',
        condition,
        processors: [{ kind: 'damageScale', side: 'attacker', zone: 'normal', addition: 0.2 }],
      },
      value => (typeof value === 'number' ? value : 0.5),
    );

    modifier.apply('afterCalculation', 'attacker', context, evaluateCondition);

    expect(evaluateCondition).toHaveBeenCalledWith(condition, expect.any(Function));
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
