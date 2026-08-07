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
import {
  CombatBuffContainer,
  type BuffDuringEnableAction,
  type CombatBuffDefinition,
} from './combatBuffs';

type Attribute = 'attack';

function requireAddedBuff<T>(buff: T | null): T {
  if (buff === null) throw new Error('test fixture buff was unexpectedly rejected');
  return buff;
}

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
    const buff = requireAddedBuff(
      container.add(
        createDefinition({
          start: () => order.push('start'),
          enable: () => order.push('enable'),
          disable: () => order.push('disable'),
          finish: () => order.push('finish'),
        }),
        'operator',
      ),
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

  it('runs during-enable actions only while enabled and restarts them after re-enable', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const duringEnable: BuffDuringEnableAction<Attribute> = {
      createRuntimeInstance: () => duringEnable,
      tryExecute: () => {
        order.push(`during-execute:${attributes.get('attack')}`);
        return true;
      },
      tick: deltaTime => order.push(`during-tick:${deltaTime}`),
      end: () => order.push(`during-end:${attributes.get('attack')}`),
      reset: () => order.push(`during-reset:${attributes.get('attack')}`),
    };
    const buff = requireAddedBuff(
      container.add(
        createDefinition({
          enable: () => order.push('enable'),
          disable: () => order.push('disable'),
          finish: () => order.push('finish'),
          duringEnable,
        }),
        'operator',
      ),
    );

    container.tick(0.25);
    buff.disable();
    container.tick(0.5);
    buff.enable();
    container.tick(0.75);
    buff.finish();

    expect(order).toEqual([
      'enable',
      'during-execute:125',
      'during-tick:0.25',
      'disable',
      'during-end:125',
      'during-reset:125',
      'enable',
      'during-execute:125',
      'during-tick:0.75',
      'finish',
      'during-end:100',
      'during-reset:100',
    ]);
  });

  it('creates independent during-enable action state for every buff instance', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const runtimeTicks: number[][] = [];
    const blueprint: BuffDuringEnableAction<Attribute> = {
      createRuntimeInstance: () => {
        const ticks: number[] = [];
        runtimeTicks.push(ticks);
        return {
          createRuntimeInstance: () => {
            throw new Error('a runtime action must not be cloned again');
          },
          tryExecute: () => true,
          tick: deltaTime => ticks.push(deltaTime),
          end: () => undefined,
          reset: () => undefined,
        };
      },
      tryExecute: () => {
        throw new Error('the configured action blueprint must not execute');
      },
      tick: () => undefined,
      end: () => undefined,
      reset: () => undefined,
    };
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.during-enable.independent',
      stackingType: 'unlimited',
      actions: { duringEnable: blueprint },
    };
    const first = requireAddedBuff(container.add(definition, 'operator'));
    requireAddedBuff(container.add(definition, 'operator'));

    first.disable();
    container.tick(0.5);

    expect(runtimeTicks).toEqual([[], [0.5]]);
  });

  it('expires finite buffs in insertion order while infinite buffs remain', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const first = requireAddedBuff(container.add(createDefinition(), 'operator'));
    const infinite = requireAddedBuff(
      container.add(
        { ...createDefinition(), id: 'buff.infinite', durationSeconds: undefined },
        'operator',
      ),
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

  it('rejects a repeated unique buff until the existing instance finishes', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition = {
      id: 'buff.unique',
      stackingType: 'unique',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 10, value: 1 },
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
        finish: () => order.push('finish'),
      },
    } as const satisfies CombatBuffDefinition<Attribute>;

    const first = requireAddedBuff(container.add(definition, 'first-source'));
    container.tick(4);

    const rejected = container.add(definition, 'second-source', {
      blackboardValues: { duration: 20, value: 2 },
    });
    expect(rejected).toBeNull();
    expect(container.buffs).toHaveLength(1);
    expect(first.remainingDuration).toBe(6);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('value')).toBe(1);
    expect(order).toEqual(['start', 'enable']);

    first.finish('other');
    const replacement = requireAddedBuff(
      container.add(definition, 'third-source', {
        blackboardValues: { duration: 8 },
      }),
    );
    expect(replacement).not.toBe(first);
    expect(replacement.remainingDuration).toBe(8);
    expect(container.buffs).toHaveLength(2);
    expect(order).toEqual(['start', 'enable', 'finish', 'start', 'enable']);
  });

  it('refreshes the existing instance without restarting or enhancing it', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.refresh',
      stackingType: 'refresh',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 8 },
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
        beforeEnhance: () => order.push('beforeEnhance'),
        enhanceChanged: () => order.push('enhanceChanged'),
        afterEnhance: () => order.push('afterEnhance'),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { duration: 10 },
      }),
    );
    container.tick(4);
    const refreshed = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { duration: 12 },
      }),
    );

    expect(refreshed).toBe(first);
    expect(container.buffs).toHaveLength(1);
    expect(first.remainingDuration).toBe(12);
    expect(first.enhanceCount).toBe(1);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('duration')).toBe(10);
    expect(order).toEqual(['start', 'enable']);

    container.tick(3);
    container.add(definition, 'third-source', {
      blackboardValues: { duration: 8 },
    });
    expect(first.remainingDuration).toBe(9);

    container.add({ ...definition, durationSeconds: undefined }, 'infinite-source');
    expect(first.remainingDuration).toBeNull();
  });

  it('extends only the existing lifetime without replacing runtime identity or inputs', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.extend',
      stackingType: 'extend',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 8, value: 1 },
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { duration: 10, value: 1 },
      }),
    );
    container.tick(4);
    const extended = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { duration: 3, value: 2 },
      }),
    );

    expect(extended).toBe(first);
    expect(container.buffs).toHaveLength(1);
    expect(first.remainingDuration).toBe(9);
    expect(first.passedTime).toBe(4);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('duration')).toBe(10);
    expect(first.blackboard.getNumber('value')).toBe(1);
    expect(order).toEqual(['start', 'enable']);

    container.add(definition, 'large-duration-source', {
      blackboardValues: { duration: 1_000_000 },
    });
    expect(first.remainingDuration).toBe(1_000_009);
    expect(order).toEqual(['start', 'enable']);
  });

  it('makes an extended lifetime infinite when either side is infinite', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const finiteContainer = new CombatBuffContainer('operator', attributes);
    const finiteDefinition: CombatBuffDefinition<Attribute> = {
      id: 'buff.extend.finite',
      stackingType: 'extend',
      durationSeconds: 8,
    };
    const finite = requireAddedBuff(finiteContainer.add(finiteDefinition, 'source'));

    finiteContainer.add({ ...finiteDefinition, durationSeconds: undefined }, 'infinite-source');
    expect(finite.remainingDuration).toBeNull();

    const infiniteContainer = new CombatBuffContainer('operator', attributes);
    const infiniteDefinition: CombatBuffDefinition<Attribute> = {
      id: 'buff.extend.infinite',
      stackingType: 'extend',
    };
    const infinite = requireAddedBuff(infiniteContainer.add(infiniteDefinition, 'source'));

    infiniteContainer.add({ ...infiniteDefinition, durationSeconds: 8 }, 'finite-source');
    expect(infinite.remainingDuration).toBeNull();
  });

  it('rejects a negative Extend duration without mutating the existing instance', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.extend.negative',
      stackingType: 'extend',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 10 },
    };
    const existing = requireAddedBuff(container.add(definition, 'first-source'));

    expect(() =>
      container.add(definition, 'second-source', {
        blackboardValues: { duration: -3 },
      }),
    ).toThrow('buff duration must resolve to a non-negative finite number');
    expect(existing.remainingDuration).toBe(10);
    expect(container.buffs).toEqual([existing]);
  });

  it('enhances one instance without refreshing its lifetime and runs attempt hooks at the cap', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.enhance',
      stackingType: 'enhance',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 10, value: 1 },
      maxStackCount: 2,
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
        beforeEnhance: buff => order.push(`before:${buff.enhanceCount}`),
        enhanceChanged: buff => order.push(`changed:${buff.enhanceCount}`),
        afterEnhance: buff => order.push(`after:${buff.enhanceCount}`),
        finish: () => order.push('finish'),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { duration: 10, value: 1 },
      }),
    );
    container.tick(4);

    const enhanced = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { duration: 20, value: 2 },
      }),
    );
    expect(enhanced).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(6);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('value')).toBe(1);

    const capped = requireAddedBuff(container.add(definition, 'third-source'));
    expect(capped).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(container.buffs).toHaveLength(1);
    expect(order).toEqual([
      'start',
      'enable',
      'before:1',
      'changed:2',
      'after:2',
      'before:2',
      'after:2',
    ]);

    first.finish('other');
    const replacement = requireAddedBuff(container.add(definition, 'fourth-source'));
    expect(replacement).not.toBe(first);
    expect(replacement.enhanceCount).toBe(1);
    expect(container.buffs).toHaveLength(2);
    expect(order.slice(-3)).toEqual(['finish', 'start', 'enable']);
  });

  it('locks a dynamic Enhance limit from the first instance blackboard', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.enhance.dynamic-limit',
      stackingType: 'enhance',
      maxStackCount: { blackboardKey: 'limit' },
      blackboard: { limit: 4 },
      actions: {
        beforeEnhance: () => order.push('before'),
        enhanceChanged: () => order.push('changed'),
        afterEnhance: () => order.push('after'),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { limit: 2 },
      }),
    );
    container.add(definition, 'second-source', {
      blackboardValues: { limit: 4 },
    });
    container.add(definition, 'third-source', {
      blackboardValues: { limit: 4 },
    });

    expect(first.enhanceCount).toBe(2);
    expect(first.blackboard.getNumber('limit')).toBe(2);
    expect(order).toEqual(['before', 'changed', 'after', 'before', 'after']);

    first.finish('other');
    const replacement = requireAddedBuff(
      container.add(definition, 'replacement-source', {
        blackboardValues: { limit: 3 },
      }),
    );
    container.add(definition, 'replacement-source');
    container.add(definition, 'replacement-source');
    expect(replacement.enhanceCount).toBe(3);
  });

  it('overwrites the existing duration without replacing or restarting the instance', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.overwrite-duration',
      stackingType: 'overwriteDuration',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 8, value: 1 },
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { duration: 10, value: 1 },
      }),
    );
    container.tick(4);

    const shortened = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { duration: 3, value: 2 },
      }),
    );
    expect(shortened).toBe(first);
    expect(first.remainingDuration).toBe(3);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('value')).toBe(1);
    expect(order).toEqual(['start', 'enable']);

    const infinite = requireAddedBuff(
      container.add({ ...definition, durationSeconds: undefined }, 'infinite-source'),
    );
    expect(infinite).toBe(first);
    expect(first.remainingDuration).toBeNull();

    const finiteAgain = requireAddedBuff(
      container.add(definition, 'finite-source', {
        blackboardValues: { duration: 7 },
      }),
    );
    expect(finiteAgain).toBe(first);
    expect(first.remainingDuration).toBe(7);
    expect(container.buffs).toHaveLength(1);
    expect(order).toEqual(['start', 'enable']);
  });

  it('enables a new HighPriority winner before disabling the previous one', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const prioritized = (
      id: string,
      priority: number,
      addition: number,
    ): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.high-priority',
      stackingType: 'highPriority',
      priority,
      attributeModifiers: [
        {
          attribute: 'attack',
          values: attributeModifierValues('addition', addition),
          timing: 'runtime',
        },
      ],
      actions: {
        start: () => order.push(`start:${id}`),
        enable: () => order.push(`enable:${id}:${attributes.get('attack')}`),
        disable: () => order.push(`disable:${id}:${attributes.get('attack')}`),
        finish: () => order.push(`finish:${id}:${attributes.get('attack')}`),
      },
    });

    const low = requireAddedBuff(container.add(prioritized('low', 1, 25), 'operator'));
    const high = requireAddedBuff(container.add(prioritized('high', 2, 50), 'operator'));

    expect(low.isEnabled).toBe(false);
    expect(high.isEnabled).toBe(true);
    expect(attributes.get('attack')).toBe(150);
    expect(order).toEqual([
      'start:low',
      'enable:low:125',
      'start:high',
      'enable:high:175',
      'disable:low:175',
    ]);

    high.finish('other');
    expect(low.isEnabled).toBe(true);
    expect(attributes.get('attack')).toBe(125);
    expect(order.slice(-2)).toEqual(['finish:high:150', 'enable:low:175']);
  });

  it('keeps losing HighPriority instances dormant and uses duration then uid as tie-breakers', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const starts: string[] = [];
    const prioritized = (id: string, durationSeconds: number): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.high-priority.tie',
      stackingType: 'highPriority',
      priority: 1,
      durationSeconds,
      actions: { start: () => starts.push(id) },
    });

    const short = requireAddedBuff(container.add(prioritized('short', 10), 'operator'));
    const firstLong = requireAddedBuff(container.add(prioritized('first-long', 20), 'operator'));
    const secondLong = requireAddedBuff(container.add(prioritized('second-long', 20), 'operator'));

    expect(short.isEnabled).toBe(false);
    expect(firstLong.isEnabled).toBe(true);
    expect(secondLong.isEnabled).toBe(false);
    expect(secondLong.isStarted).toBe(false);
    expect(starts).toEqual(['short', 'first-long']);

    firstLong.finish('other');
    expect(secondLong.isEnabled).toBe(true);
    expect(starts).toEqual(['short', 'first-long', 'second-long']);
  });

  it('enables the leading HighPriorityWithMaxStack instances and restores a dormant candidate', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const prioritized = (
      id: string,
      priority: number,
      addition: number,
    ): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.high-priority-with-limit',
      stackingType: 'highPriorityWithMaxStack',
      maxStackCount: { blackboardKey: 'limit' },
      priority,
      attributeModifiers: [
        {
          attribute: 'attack',
          values: attributeModifierValues('addition', addition),
          timing: 'runtime',
        },
      ],
    });

    const low = requireAddedBuff(
      container.add(prioritized('low', 1, 10), 'low-source', {
        blackboardValues: { limit: 2 },
      }),
    );
    const high = requireAddedBuff(
      container.add(prioritized('high', 3, 30), 'high-source', {
        blackboardValues: { limit: 1 },
      }),
    );
    const middle = requireAddedBuff(
      container.add(prioritized('middle', 2, 20), 'middle-source', {
        blackboardValues: { limit: 4 },
      }),
    );

    expect(low.isFinished).toBe(false);
    expect(low.isEnabled).toBe(false);
    expect(high.isEnabled).toBe(true);
    expect(middle.isEnabled).toBe(true);
    expect(attributes.get('attack')).toBe(150);
    expect(container.buffs).toHaveLength(3);

    high.finish('other');
    expect(high.isFinished).toBe(true);
    expect(low.isEnabled).toBe(true);
    expect(middle.isEnabled).toBe(true);
    expect(attributes.get('attack')).toBe(130);
    expect(container.buffs.filter(buff => !buff.isFinished)).toEqual([low, middle]);
  });

  it('uses duration and instance id as stable HighPriorityWithMaxStack tie-breakers', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const prioritized = (id: string, durationSeconds: number): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.high-priority-with-limit.tie',
      stackingType: 'highPriorityWithMaxStack',
      maxStackCount: 2,
      priority: 1,
      durationSeconds,
    });

    const short = requireAddedBuff(container.add(prioritized('short', 5), 'operator'));
    const firstLong = requireAddedBuff(container.add(prioritized('first-long', 10), 'operator'));
    const secondLong = requireAddedBuff(container.add(prioritized('second-long', 10), 'operator'));
    const thirdLong = requireAddedBuff(container.add(prioritized('third-long', 10), 'operator'));

    expect(short.isEnabled).toBe(false);
    expect(firstLong.isEnabled).toBe(true);
    expect(secondLong.isEnabled).toBe(true);
    expect(thirdLong.isEnabled).toBe(false);
    expect(thirdLong.isStarted).toBe(false);

    firstLong.finish('other');
    expect(short.isEnabled).toBe(false);
    expect(secondLong.isEnabled).toBe(true);
    expect(thirdLong.isEnabled).toBe(true);
    expect(thirdLong.isStarted).toBe(true);
  });

  it('keeps HighPriorityWithMaxStack instances dormant when the configured limit is zero', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.high-priority-with-zero-limit',
      stackingType: 'highPriorityWithMaxStack',
      maxStackCount: 0,
    };

    const first = requireAddedBuff(container.add(definition, 'first-source'));
    const second = requireAddedBuff(container.add(definition, 'second-source'));

    expect(first.isFinished).toBe(false);
    expect(second.isFinished).toBe(false);
    expect(first.isEnabled).toBe(false);
    expect(second.isEnabled).toBe(false);
    expect(first.isStarted).toBe(false);
    expect(second.isStarted).toBe(false);
  });

  it('replaces the lowest-priority existing Stack instance before enabling the incoming one', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const stack = (id: string, priority: number): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.stack',
      stackingType: 'stack',
      maxStackCount: 2,
      priority,
      actions: {
        start: () => order.push(`start:${id}`),
        finish: () => order.push(`finish:${id}`),
      },
    });

    const low = requireAddedBuff(container.add(stack('buff.low', 1), 'operator'));
    const middle = requireAddedBuff(container.add(stack('buff.middle', 2), 'operator'));
    const incoming = requireAddedBuff(container.add(stack('buff.incoming', 0), 'operator'));

    expect(low.isFinished).toBe(true);
    expect(low.finishReason).toBe('other');
    expect(middle.isEnabled).toBe(true);
    expect(incoming.isEnabled).toBe(true);
    expect(container.buffs.filter(buff => !buff.isFinished)).toEqual([middle, incoming]);
    expect(order.slice(-2)).toEqual(['finish:buff.low', 'start:buff.incoming']);
  });

  it('locks a dynamic Stack limit from the first instance blackboard', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.stack.dynamic-limit',
      stackingType: 'stack',
      maxStackCount: { blackboardKey: 'limit' },
      blackboard: { limit: 2 },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { limit: 2 },
      }),
    );
    const second = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { limit: 1 },
      }),
    );
    expect(first.isFinished).toBe(false);
    expect(second.isFinished).toBe(false);

    const third = requireAddedBuff(
      container.add(definition, 'third-source', {
        blackboardValues: { limit: 4 },
      }),
    );
    expect(first.isFinished).toBe(false);
    expect(second.isFinished).toBe(true);
    expect(third.isFinished).toBe(false);
    expect(container.buffs.filter(buff => !buff.isFinished)).toEqual([first, third]);
  });

  it.each([-1, 1.5, Number.POSITIVE_INFINITY])(
    'rejects invalid dynamic max stack count %s before allocating an instance',
    invalidLimit => {
      const attributes = new CombatAttributeSet<Attribute>();
      const container = new CombatBuffContainer('operator', attributes);

      expect(() =>
        container.add(
          {
            id: 'buff.stack.invalid-limit',
            stackingType: 'stack',
            maxStackCount: { blackboardKey: 'limit' },
            blackboard: { limit: 2 },
          },
          'source',
          { blackboardValues: { limit: invalidLimit } },
        ),
      ).toThrow('buff max stack count must resolve to a non-negative safe integer');
      expect(container.buffs).toEqual([]);
    },
  );

  it('breaks equal Stack priorities by remaining duration and then instance id', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const stack = (id: string, durationSeconds: number): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.stack.duration',
      stackingType: 'stack',
      maxStackCount: 2,
      priority: 1,
      durationSeconds,
    });

    const long = requireAddedBuff(container.add(stack('buff.long', 20), 'operator'));
    const short = requireAddedBuff(container.add(stack('buff.short', 10), 'operator'));
    container.add(stack('buff.incoming', 30), 'operator');
    expect(long.isFinished).toBe(false);
    expect(short.isFinished).toBe(true);

    const lifetimeContainer = new CombatBuffContainer('operator', attributes);
    const infinite = requireAddedBuff(
      lifetimeContainer.add(
        {
          ...stack('buff.infinite', 10),
          stackingKey: 'buff.stack.lifetime',
          durationSeconds: undefined,
        },
        'operator',
      ),
    );
    const finite = requireAddedBuff(
      lifetimeContainer.add(
        { ...stack('buff.finite', 10), stackingKey: 'buff.stack.lifetime' },
        'operator',
      ),
    );
    lifetimeContainer.add(
      { ...stack('buff.next', 10), stackingKey: 'buff.stack.lifetime' },
      'operator',
    );
    expect(infinite.isFinished).toBe(false);
    expect(finite.isFinished).toBe(true);

    const tieContainer = new CombatBuffContainer('operator', attributes);
    const tied = (id: string): CombatBuffDefinition<Attribute> => ({
      ...stack(id, 10),
      stackingKey: 'buff.stack.uid',
    });
    const first = requireAddedBuff(tieContainer.add(tied('buff.first'), 'operator'));
    const second = requireAddedBuff(tieContainer.add(tied('buff.second'), 'operator'));
    tieContainer.add(tied('buff.third'), 'operator');
    expect(first.isFinished).toBe(false);
    expect(second.isFinished).toBe(true);
  });

  it('resolves Stack priority from each instance blackboard and supports negation', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const dynamic = (id: string, negate = false): CombatBuffDefinition<Attribute> => ({
      id,
      stackingKey: 'buff.stack.dynamic-priority',
      stackingType: 'stack',
      maxStackCount: 2,
      priority: { blackboardKey: 'priority', negate },
    });

    const high = requireAddedBuff(
      container.add(dynamic('buff.high'), 'operator', {
        blackboardValues: { priority: 4 },
      }),
    );
    const low = requireAddedBuff(
      container.add(dynamic('buff.low', true), 'operator', {
        blackboardValues: { priority: -2 },
      }),
    );
    container.add(dynamic('buff.incoming'), 'operator', {
      blackboardValues: { priority: 3 },
    });

    expect(high.priority).toBe(4);
    expect(low.priority).toBe(2);
    expect(high.isFinished).toBe(false);
    expect(low.isFinished).toBe(true);
    expect(() => container.add(dynamic('buff.missing'), 'operator')).toThrow(
      "priority blackboard key 'priority' is missing or not numeric",
    );
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

    const first = requireAddedBuff(container.add(definition, 'operator'));
    const second = requireAddedBuff(container.add(definition, 'operator'));
    expect(second).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(order).toEqual(['before:1', 'changed:2', 'after:2']);

    container.tick(3);
    const capped = requireAddedBuff(
      container.add({ ...definition, durationSeconds: 12 }, 'operator'),
    );
    expect(capped).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(12);
    expect(order).toEqual(['before:1', 'changed:2', 'after:2', 'before:2', 'after:2']);
  });

  it('enhances before overwriting duration and keeps the existing instance inputs', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const order: string[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.enhance-overwrite',
      stackingType: 'enhanceAndOverwriteDuration',
      durationSeconds: { blackboardKey: 'duration' },
      blackboard: { duration: 8, value: 1 },
      maxStackCount: 2,
      actions: {
        start: () => order.push('start'),
        enable: () => order.push('enable'),
        beforeEnhance: (buff, sourceId) =>
          order.push(`before:${sourceId}:${buff.enhanceCount}:${buff.remainingDuration}`),
        enhanceChanged: (buff, sourceId) =>
          order.push(`changed:${sourceId}:${buff.enhanceCount}:${buff.remainingDuration}`),
        afterEnhance: (buff, sourceId) =>
          order.push(`after:${sourceId}:${buff.enhanceCount}:${buff.remainingDuration}`),
      },
    };

    const first = requireAddedBuff(
      container.add(definition, 'first-source', {
        blackboardValues: { duration: 10, value: 1 },
      }),
    );
    container.tick(4);
    const enhanced = requireAddedBuff(
      container.add(definition, 'second-source', {
        blackboardValues: { duration: 3, value: 2 },
      }),
    );

    expect(enhanced).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(3);
    expect(first.passedTime).toBe(4);
    expect(first.sourceId).toBe('first-source');
    expect(first.blackboard.getNumber('duration')).toBe(10);
    expect(first.blackboard.getNumber('value')).toBe(1);
    expect(container.buffs).toEqual([first]);
    expect(order).toEqual([
      'start',
      'enable',
      'before:second-source:1:6',
      'changed:second-source:2:6',
      'after:second-source:2:3',
    ]);

    container.tick(1);
    const capped = requireAddedBuff(
      container.add(definition, 'third-source', {
        blackboardValues: { duration: 12 },
      }),
    );
    expect(capped).toBe(first);
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(12);
    expect(order.slice(-2)).toEqual(['before:third-source:2:2', 'after:third-source:2:12']);
    expect(order.filter(event => event === 'start')).toHaveLength(1);
    expect(order.filter(event => event === 'enable')).toHaveLength(1);
  });

  it('overwrites finite and infinite lifetimes in both directions while enhancing', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.enhance-overwrite.infinite',
      stackingType: 'enhanceAndOverwriteDuration',
      durationSeconds: 10,
      maxStackCount: 2,
    };
    const first = requireAddedBuff(container.add(definition, 'first-source'));

    container.add({ ...definition, durationSeconds: undefined }, 'infinite-source');
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBeNull();

    container.add({ ...definition, durationSeconds: 7 }, 'finite-source');
    expect(first.enhanceCount).toBe(2);
    expect(first.remainingDuration).toBe(7);
  });

  it.each([-1, Number.POSITIVE_INFINITY])(
    'rejects invalid enhance-and-overwrite duration %s without partial mutation',
    invalidDuration => {
      const attributes = new CombatAttributeSet<Attribute>();
      const container = new CombatBuffContainer('operator', attributes);
      const order: string[] = [];
      const definition: CombatBuffDefinition<Attribute> = {
        id: 'buff.enhance-overwrite.invalid',
        stackingType: 'enhanceAndOverwriteDuration',
        durationSeconds: { blackboardKey: 'duration' },
        blackboard: { duration: 10 },
        maxStackCount: 3,
        actions: {
          beforeEnhance: () => order.push('before'),
          enhanceChanged: () => order.push('changed'),
          afterEnhance: () => order.push('after'),
        },
      };
      const existing = requireAddedBuff(container.add(definition, 'first-source'));

      expect(() =>
        container.add(definition, 'invalid-source', {
          blackboardValues: { duration: invalidDuration },
        }),
      ).toThrow('buff duration must resolve to a non-negative finite number');
      expect(existing.enhanceCount).toBe(1);
      expect(existing.remainingDuration).toBe(10);
      expect(container.buffs).toEqual([existing]);
      expect(order).toEqual([]);
    },
  );

  it('uses native duration refresh and infinite-lifetime semantics', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const finite = requireAddedBuff(
      container.add(
        {
          id: 'buff.finite',
          stackingType: 'enhanceAndRefresh',
          durationSeconds: 8,
        },
        'operator',
      ),
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
    const first = requireAddedBuff(container.add(definition, 'operator'));
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
    const replacement = requireAddedBuff(container.add(definition, 'operator'));
    expect(replacement).not.toBe(first);
    expect(replacement.enhanceCount).toBe(1);
  });

  it('builds each buff blackboard from defaults and add options', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const buff = requireAddedBuff(
      container.add(
        {
          id: 'buff.status',
          stackingType: 'unlimited',
          blackboard: { count: 0, label: 'default' },
        },
        'operator',
        { blackboardValues: { count: 3 } },
      ),
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

    const buff = requireAddedBuff(
      container.add(definition, 'operator', {
        blackboardValues: { duration: 10 },
      }),
    );
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

  it('triggers immediately and catches up every elapsed interval', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    const triggerTimes: number[] = [];
    container.add(
      {
        id: 'buff.periodic',
        stackingType: 'unlimited',
        triggerIntervalSeconds: 2,
        waitFirstTriggerInterval: false,
        maxTriggerCount: 3,
        actions: { trigger: buff => triggerTimes.push(buff.passedTime) },
      },
      'operator',
    );

    expect(triggerTimes).toEqual([0]);
    container.tick(5);
    expect(triggerTimes).toEqual([0, 5, 5]);
  });

  it('waits for the first interval and treats negative trigger count as unlimited', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    let triggerCount = 0;
    container.add(
      {
        id: 'buff.periodic-wait',
        stackingType: 'unlimited',
        triggerIntervalSeconds: 2,
        waitFirstTriggerInterval: true,
        maxTriggerCount: -1,
        actions: { trigger: () => (triggerCount += 1) },
      },
      'operator',
    );

    expect(triggerCount).toBe(0);
    container.tick(5);
    expect(triggerCount).toBe(2);
    container.tick(2);
    expect(triggerCount).toBe(3);
  });

  it('pauses periodic time while disabled but keeps advancing lifetime', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    const container = new CombatBuffContainer('operator', attributes);
    let triggerCount = 0;
    const buff = requireAddedBuff(
      container.add(
        {
          id: 'buff.periodic-disabled',
          stackingType: 'unlimited',
          durationSeconds: 10,
          triggerIntervalSeconds: 2,
          waitFirstTriggerInterval: true,
          maxTriggerCount: 1,
          actions: { trigger: () => (triggerCount += 1) },
        },
        'operator',
      ),
    );

    buff.disable();
    container.tick(3);
    expect(triggerCount).toBe(0);
    expect(buff.remainingDuration).toBe(7);
    buff.enable();
    container.tick(2);
    expect(triggerCount).toBe(1);
  });

  it('modifies the original instance blackboard and registered attribute modifiers in place', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const lifecycle: string[] = [];
    const triggeredValues: number[] = [];
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.modify.original',
      stackingKey: 'buff.modify',
      stackingType: 'modify',
      durationSeconds: 10,
      triggerIntervalSeconds: 2,
      waitFirstTriggerInterval: true,
      maxTriggerCount: -1,
      blackboard: { bonus: 5, retained: 'original' },
      attributeModifiers: [
        {
          attribute: 'attack',
          values: { slot: 'addition', blackboardKey: 'bonus' },
          timing: 'runtime',
        },
      ],
      actions: {
        start: () => lifecycle.push('original-start'),
        enable: () => lifecycle.push('original-enable'),
        trigger: buff => triggeredValues.push(buff.blackboard.getNumber('bonus') ?? -1),
      },
    };
    const buff = requireAddedBuff(
      container.add(definition, 'original-source', {
        blackboardValues: { bonus: 10 },
      }),
    );
    container.tick(1);

    const modified = container.add(
      {
        ...definition,
        id: 'buff.modify.incoming',
        durationSeconds: 30,
        attributeModifiers: [
          {
            attribute: 'attack',
            values: attributeModifierValues('addition', 500),
            timing: 'runtime',
          },
        ],
        actions: {
          start: () => lifecycle.push('incoming-start'),
          enable: () => lifecycle.push('incoming-enable'),
        },
      },
      'incoming-source',
      { blackboardValues: { bonus: 25, added: 3 } },
    );

    expect(modified).toBe(buff);
    expect(buff.definition).toBe(definition);
    expect(buff.sourceId).toBe('original-source');
    expect(buff.passedTime).toBe(1);
    expect(buff.remainingDuration).toBe(9);
    expect(buff.blackboard.snapshot()).toEqual({
      bonus: 25,
      retained: 'original',
      added: 3,
    });
    expect(attributes.get('attack')).toBe(125);
    expect(attributes.modifierCount).toBe(1);
    expect(lifecycle).toEqual(['original-start', 'original-enable']);

    container.tick(1);
    expect(triggeredValues).toEqual([25]);
    buff.finish('other');
    expect(attributes.get('attack')).toBe(100);
  });

  it('rolls back the blackboard and keeps old modifiers when modify cannot resolve a value', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'buff.modify.rollback',
      stackingType: 'modify',
      blackboard: { bonus: 10, retained: 1 },
      attributeModifiers: [
        {
          attribute: 'attack',
          values: { slot: 'addition', blackboardKey: 'bonus' },
          timing: 'runtime',
        },
      ],
    };
    const buff = requireAddedBuff(container.add(definition, 'operator'));

    expect(() =>
      container.add(definition, 'operator', {
        blackboardValues: { bonus: 'invalid', added: 2 },
      }),
    ).toThrow("attribute modifier blackboard key 'bonus' is missing or not numeric");

    expect(buff.blackboard.snapshot()).toEqual({ bonus: 10, retained: 1 });
    expect(attributes.get('attack')).toBe(110);
    expect(attributes.modifierCount).toBe(1);
    expect(buff.attributeModifiers).toHaveLength(1);
  });

  it('refreshes registered attribute modifier values from the current buff blackboard', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const lifecycle: string[] = [];
    const buff = requireAddedBuff(
      container.add(
        {
          id: 'buff.attribute.refresh',
          stackingType: 'unlimited',
          blackboard: { bonus: 10 },
          attributeModifiers: [
            {
              attribute: 'attack',
              values: { slot: 'addition', blackboardKey: 'bonus' },
              timing: 'runtime',
            },
          ],
          actions: {
            start: () => lifecycle.push('start'),
            enable: () => lifecycle.push('enable'),
            disable: () => lifecycle.push('disable'),
          },
        },
        'operator',
      ),
    );

    const initialModifier = buff.attributeModifiers[0];
    buff.blackboard.assignDynamic('bonus', 35);
    expect(attributes.get('attack')).toBe(110);

    buff.refreshAttributeModifierValues();
    expect(attributes.get('attack')).toBe(135);
    expect(attributes.modifierCount).toBe(1);
    expect(buff.attributeModifiers[0]).not.toBe(initialModifier);
    expect(lifecycle).toEqual(['start', 'enable']);

    buff.disable();
    buff.blackboard.assignDynamic('bonus', 45);
    buff.refreshAttributeModifierValues();
    expect(attributes.get('attack')).toBe(100);
    buff.enable();
    expect(attributes.get('attack')).toBe(145);
    expect(lifecycle).toEqual(['start', 'enable', 'disable', 'enable']);
  });

  it('keeps the previous modifier registered when refreshing an invalid blackboard value', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const container = new CombatBuffContainer('operator', attributes);
    const buff = requireAddedBuff(
      container.add(
        {
          id: 'buff.attribute.refresh.invalid',
          stackingType: 'unlimited',
          blackboard: { bonus: 10 },
          attributeModifiers: [
            {
              attribute: 'attack',
              values: { slot: 'addition', blackboardKey: 'bonus' },
              timing: 'runtime',
            },
          ],
        },
        'operator',
      ),
    );
    const previousModifier = buff.attributeModifiers[0];
    buff.blackboard.assign({ bonus: 'invalid' });

    expect(() => buff.refreshAttributeModifierValues()).toThrow(
      "attribute modifier blackboard key 'bonus' is missing or not numeric",
    );
    expect(buff.attributeModifiers[0]).toBe(previousModifier);
    expect(attributes.modifierCount).toBe(1);
    expect(attributes.get('attack')).toBe(110);
    expect(buff.blackboard.getNumber('bonus')).toBeUndefined();
  });
});
