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
});
