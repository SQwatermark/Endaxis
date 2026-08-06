import { describe, expect, it } from 'vitest';
import { CombatAttributeSet, attributeModifierValues } from '../attributes/combatAttributes';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
import {
  PlayerDamageContext,
  type PlayerDamageAttributeSnapshots,
} from '../damage/playerDamageContext';
import { CombatBuffContainer, type CombatBuffDefinition } from './combatBuffs';

type Attribute = 'attack';

const scaleAttributes = Object.fromEntries(
  DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
) as unknown as DamageScaleAttributeSnapshot;

function createDamageContext(
  attributes: CombatAttributeSet<Attribute>,
  buffs: CombatBuffContainer<Attribute>,
) {
  const snapshots = (): PlayerDamageAttributeSnapshots => ({
    attacker: {
      ...scaleAttributes,
      attack: attributes.get('attack'),
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
      resistances: {
        physical: { percent: 0, damageTakenMultiplier: 1 },
        heat: { percent: 0, damageTakenMultiplier: 1 },
        electric: { percent: 0, damageTakenMultiplier: 1 },
        cryo: { percent: 0, damageTakenMultiplier: 1 },
        nature: { percent: 0, damageTakenMultiplier: 1 },
        ether: { percent: 0, damageTakenMultiplier: 1 },
      },
    },
  });
  return new PlayerDamageContext({
    sourceId: 'operator',
    targetId: 'enemy',
    damageType: 'physical',
    targetHealthType: 'normal',
    ports: {
      captureAttributeSnapshots: snapshots,
      applyModifiers: (timing, side, context) => buffs.applyDamageModifiers(timing, side, context),
      clearInstantAttributeModifiers: () => attributes.clearInstantModifiers(),
    },
  });
}

function createDefinition(
  actions?: CombatBuffDefinition<Attribute>['actions'],
): CombatBuffDefinition<Attribute> {
  return {
    id: 'buff.attack',
    stackingType: 'unlimited',
    durationSeconds: 1,
    attributeModifiers: [
      {
        attribute: 'attack',
        values: attributeModifierValues('addition', 25),
        timing: 'runtime',
      },
    ],
    damageModifiers: [
      {
        enabledSide: 'attacker',
        processors: [
          {
            kind: 'multiplyValue',
            timing: 'beforeCalculation',
            targetHealthTypes: ['normal'],
            scale: 2,
          },
        ],
      },
    ],
    actions,
  };
}

describe('CombatBuffContainer', () => {
  it('registers independent modifiers and follows enable-disable-finish lifecycle', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const buff = container.add(
      createDefinition({
        start: () => order.push('start'),
        enable: () => order.push('enable'),
        disable: () => order.push('disable'),
        finish: () => order.push('finish'),
      }),
      'operator',
    );

    expect(attributes.get('attack')).toBe(125);
    const firstHit = createDamageContext(attributes, container);
    firstHit.applyModifiers('beforeCalculation');
    firstHit.setCalculationResult(firstHit.attackerAttributes.attack);
    expect(firstHit.value).toBe(250);

    buff.disable();
    expect(attributes.get('attack')).toBe(100);
    const disabledHit = createDamageContext(attributes, container);
    disabledHit.applyModifiers('beforeCalculation');
    disabledHit.setCalculationResult(disabledHit.attackerAttributes.attack);
    expect(disabledHit.value).toBe(100);

    buff.enable();
    expect(buff.finish('dispelled')).toBe(true);
    expect(buff.finish()).toBe(false);
    expect(attributes.get('attack')).toBe(100);
    expect(order).toEqual(['start', 'enable', 'disable', 'enable', 'finish']);
  });

  it('expires finite buffs in insertion order while infinite buffs remain', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const first = container.add(createDefinition(), 'operator');
    const infinite = container.add(
      { ...createDefinition(), id: 'buff.infinite', durationSeconds: undefined },
      'operator',
    );

    expect(container.getCountById('buff.attack')).toBe(1);
    container.tick(1);
    expect(first.finishReason).toBe('lifetime');
    expect(infinite.isFinished).toBe(false);
    expect(container.getCountById('buff.attack')).toBe(0);
  });

  it('rolls back damage modifiers when attribute registration fails', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    expect(() => container.add(createDefinition(), 'operator')).toThrow('explicit native bounds');
    expect(container.buffs).toHaveLength(1);
    expect(container.buffs[0]!.isEnabled).toBe(false);

    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const context = createDamageContext(attributes, container);
    context.applyModifiers('beforeCalculation');
    context.setCalculationResult(100);
    expect(context.value).toBe(100);
  });

  it('rejects stacking strategies until their recovered groups are implemented', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    expect(() =>
      container.add({ id: 'buff.refresh', stackingType: 'refresh' }, 'operator'),
    ).toThrow("stacking type 'refresh' is not implemented");
  });
});
