import { describe, expect, it } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { ActionBlackboard } from './actionBlackboard';
import { CombatClock } from './combatClock';
import { CombatVitals } from './combatVitals';
import { HealOperationExecutor } from './healOperationExecutor';

const terminal = {
  execute: () => false,
  evaluate: () => false,
};

function vitals(health: number) {
  return new CombatVitals({
    health,
    maxHealth: 1000,
    maxPoise: 0,
    poise: 0,
    poiseRecoveryTime: 0,
    poiseRecoveryTimeMultiplier: 0,
    poiseBrokenEndTime: 0,
    poiseImmune: false,
  });
}

describe('HealOperationExecutor', () => {
  it('resolves attribute formula and records actual plus overhealing', () => {
    const target = vitals(900);
    const receipt = new CombatReceiptCollector();
    const executor = new HealOperationExecutor({
      sourceOperatorId: 'operator:healer',
      clock: new CombatClock(),
      receipt,
      resolveSourceAttribute: attribute => (attribute === 'will' ? 100 : 0),
      resolveTarget: () => ({ operatorId: 'operator:target', vitals: target }),
      delegate: terminal,
    });

    expect(
      executor.execute(
        {
          kind: 'heal',
          parameters: {
            target: 'controlledOperator',
            attribute: 'will',
            multiplier: { kind: 'blackboard', key: 'scale' },
            addition: 10,
            tagIds: [-1],
          },
        },
        { blackboard: new ActionBlackboard({ scale: 1.5 }) },
      ),
    ).toBe(true);
    expect(target.health).toBe(1000);
    expect(receipt.entries[0]).toMatchObject({
      event: 'HealingApplied',
      sourceId: 'operator:healer',
      targetId: 'operator:target',
      data: {
        requestedHealing: 160,
        actualHealing: 100,
        overhealing: 60,
      },
    });
  });

  it('records a full-health heal instead of suppressing it', () => {
    const target = vitals(1000);
    const receipt = new CombatReceiptCollector();
    const executor = new HealOperationExecutor({
      sourceOperatorId: 'operator:healer',
      clock: new CombatClock(),
      receipt,
      resolveSourceAttribute: () => 100,
      resolveTarget: () => ({ operatorId: 'operator:target', vitals: target }),
      delegate: terminal,
    });

    executor.execute({
      kind: 'heal',
      parameters: {
        target: 'caster',
        attribute: 'will',
        multiplier: 1,
        addition: 0,
        tagIds: [],
      },
    });

    expect(receipt.entries[0]?.data).toMatchObject({
      requestedHealing: 100,
      actualHealing: 0,
      overhealing: 100,
    });
  });

  it('uses the source maximum health for native MaxHp healing formulas', () => {
    const target = vitals(700);
    const receipt = new CombatReceiptCollector();
    const executor = new HealOperationExecutor({
      sourceOperatorId: 'operator:healer',
      clock: new CombatClock(),
      receipt,
      resolveSourceAttribute: attribute => (attribute === 'maxHealth' ? 1800 : 0),
      resolveTarget: () => ({ operatorId: 'operator:target', vitals: target }),
      delegate: terminal,
    });

    executor.execute(
      {
        kind: 'heal',
        parameters: {
          target: 'caster',
          attribute: 'maxHealth',
          multiplier: { kind: 'blackboard', key: 'heal' },
          addition: 0,
          tagIds: [],
        },
      },
      { blackboard: new ActionBlackboard({ heal: 0.12 }) },
    );

    expect(receipt.entries[0]?.data).toMatchObject({
      attribute: 'maxHealth',
      attributeValue: 1800,
      requestedHealing: 216,
      actualHealing: 216,
    });
  });

  it('passes the current Buff source identity to a buffSource heal target', () => {
    const target = vitals(800);
    const reached: Array<[string, string | undefined]> = [];
    const executor = new HealOperationExecutor({
      sourceOperatorId: 'operator:runtime',
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      resolveSourceAttribute: () => 100,
      resolveTarget: (role, buffSourceId) => {
        reached.push([role, buffSourceId]);
        return { operatorId: buffSourceId ?? '<missing>', vitals: target };
      },
      delegate: terminal,
    });

    executor.execute(
      {
        kind: 'heal',
        parameters: {
          target: 'buffSource',
          attribute: 'will',
          multiplier: 1,
          addition: 0,
          alwaysNext: false,
          tagIds: [],
        },
      },
      {
        blackboard: new ActionBlackboard(),
        buffSourceId: 'operator:original-source',
      },
    );

    expect(reached).toEqual([['buffSource', 'operator:original-source']]);
    expect(target.health).toBe(900);
  });

  it('applies a definite blackboard amount without reading an attribute', () => {
    const target = vitals(700);
    const receipt = new CombatReceiptCollector();
    const executor = new HealOperationExecutor({
      sourceOperatorId: 'operator:healer',
      clock: new CombatClock(),
      receipt,
      resolveSourceAttribute: () => {
        throw new Error('definite healing must not read an attribute');
      },
      resolveTarget: () => ({ operatorId: 'operator:target', vitals: target }),
      delegate: terminal,
    });

    executor.execute(
      {
        kind: 'heal',
        parameters: {
          target: 'controlledOperator',
          amount: { kind: 'blackboard', key: 'final_heal_value' },
          tagIds: [-1517158118],
        },
      },
      { blackboard: new ActionBlackboard({ final_heal_value: 240 }) },
    );

    expect(target.health).toBe(940);
    expect(receipt.entries[0]?.data).toMatchObject({
      attribute: 'definite',
      requestedHealing: 240,
      actualHealing: 240,
    });
  });
});
