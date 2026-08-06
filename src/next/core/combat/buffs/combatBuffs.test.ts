import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  CombatAttributeSet,
  attributeModifierValues,
} from '../attributes/combatAttributes';
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
      addInstantAttributeModifier: (side, request) => {
        if (side !== 'attacker' || request.attribute !== 'attack') {
          throw new Error('unexpected instant-attribute target');
        }
        attributes.addModifier(
          new CombatAttributeModifier(
            request.attribute,
            request.values,
            ATTRIBUTE_MODIFIER_SOURCES.instant,
            request.timing,
          ),
        );
      },
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

  it('captures instant attribute modifiers for one stage and clears them afterward', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    container.add(
      {
        id: 'buff.instant-attack',
        stackingType: 'unlimited',
        damageModifiers: [
          {
            enabledSide: 'attacker',
            processors: [
              {
                kind: 'instantAttribute',
                targetSide: 'attacker',
                attribute: 'attack',
                values: attributeModifierValues('addition', 50),
                attributeTiming: 'runtime',
              },
            ],
          },
        ],
      },
      'operator',
    );

    const context = createDamageContext(attributes, container);
    context.applyModifiers('beforeCalculation');
    expect(context.attackerAttributes.attack).toBe(150);
    expect(attributes.get('attack')).toBe(100);

    const nextHit = createDamageContext(attributes, container);
    expect(nextHit.attackerAttributes.attack).toBe(100);
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

  it('enhances one instance, refreshes its lifetime, and still runs callbacks at the cap', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.attachment',
      stackingType: 'enhanceAndRefresh',
      durationSeconds: 8,
      maxStackCount: 2,
      actions: {
        beforeEnhance: buff => order.push(`before:${buff.enhanceCount}`),
        enhanceChanged: buff => order.push(`changed:${buff.enhanceCount}`),
        afterEnhance: buff => order.push(`after:${buff.enhanceCount}`),
      },
    };

    const first = container.add(definition, 'operator');
    const second = container.add(definition, 'operator');
    expect(second).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(order).toEqual(['before:1', 'changed:2', 'after:2']);

    container.tick(3);
    const capped = container.add({ ...definition, durationSeconds: 12 }, 'operator');
    expect(capped).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(12);
    expect(order).toEqual(['before:1', 'changed:2', 'after:2', 'before:2', 'after:2']);
  });

  it('uses native duration refresh and infinite-lifetime semantics', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const finite = container.add(
      {
        id: 'buff.finite',
        stackingType: 'enhanceAndRefresh',
        durationSeconds: 8,
      },
      'operator',
    );

    container.add(
      {
        id: 'buff.finite',
        stackingType: 'enhanceAndRefresh',
        durationSeconds: 8.000005,
      },
      'operator',
    );
    expect(finite.remainingDuration).toBe(8);

    container.add(
      {
        id: 'buff.finite',
        stackingType: 'enhanceAndRefresh',
      },
      'operator',
    );
    expect(finite.remainingDuration).toBeNull();
  });

  it('keeps a stacking key type stable and starts a new instance after finish', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.first-id',
      stackingKey: 'shared-key',
      stackingType: 'enhanceAndRefresh',
      maxStackCount: 3,
    };
    const first = container.add(definition, 'operator');
    container.add(definition, 'operator');
    expect(first.enhanceCount).toBe(2);

    expect(() =>
      container.add(
        {
          id: 'buff.second-id',
          stackingKey: 'shared-key',
          stackingType: 'unlimited',
        },
        'operator',
      ),
    ).toThrow("stacking key 'shared-key' changed type");

    first.finish('other');
    const replacement = container.add(definition, 'operator');
    expect(replacement).not.toBe(first);
    expect(replacement.enhanceCount).toBe(1);
  });

  it('builds each buff blackboard from defaults and add options', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const buff = container.add(
      {
        id: 'buff.status',
        stackingType: 'unlimited',
        blackboard: { count: 0, label: 'default' },
      },
      'operator',
      { blackboardValues: { count: 3 } },
    );

    expect(buff.blackboard.getNumber('count')).toBe(3);
    expect(buff.blackboard.getString('label')).toBe('default');
  });

  it('resolves dynamic duration after add options and refreshes from the incoming values', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.dynamic-duration',
      stackingType: 'enhanceAndRefresh',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 8 },
    };

    const buff = container.add(definition, 'operator', {
      blackboardValues: { duration: 10 },
    });
    expect(buff.remainingDuration).toBe(10);
    container.tick(4);
    container.add(definition, 'operator', {
      blackboardValues: { duration: 12 },
    });

    expect(buff.remainingDuration).toBe(12);
    expect(buff.blackboard.getNumber('duration')).toBe(10);
  });

  it('rejects missing or invalid dynamic duration values', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    expect(() =>
      container.add(
        {
          id: 'buff.missing-duration',
          stackingType: 'unlimited',
          durationSeconds: { blackboardKey: 'duration' },
        },
        'operator',
      ),
    ).toThrow("duration blackboard key 'duration' is missing or not numeric");
  });
});
