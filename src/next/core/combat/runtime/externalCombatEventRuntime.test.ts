import { describe, expect, it } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import { ExternalCombatEventRuntime } from './externalCombatEventRuntime';

describe('ExternalCombatEventRuntime', () => {
  it('dispatches explicit operator hit facts without creating a damage result', () => {
    const clock = new CombatClock();
    const events = new CombatSemanticEventRuntime();
    const receipt = new CombatReceiptCollector();
    const received: string[] = [];
    const abilityEvents: unknown[] = [];
    for (const operatorId of ['operator:a', 'operator:b']) {
      events.register({
        ownerOperatorId: operatorId,
        trigger: { kind: 'operatorHit' },
        phase: 'skill',
        handle: context => {
          if (context.event.kind === 'operatorHit') {
            received.push(`${operatorId}:${context.event.tags.join(',')}`);
          }
        },
      });
    }
    const runtime = new ExternalCombatEventRuntime({
      clock,
      semanticEvents: events,
      emitOperatorHitAbilityEvent: (operatorId, payload) =>
        abilityEvents.push({ operatorId, payload }),
      receipt,
      events: [
        {
          frame: 0,
          targetOperatorIds: ['operator:b'],
          event: { kind: 'operatorHit', tags: ['normalSkill'], features: ['airborne'] },
        },
      ],
    });

    runtime.applyCurrentFrame();

    expect(received).toEqual(['operator:b:normalSkill']);
    expect(abilityEvents).toEqual([
      {
        operatorId: 'operator:b',
        payload: {
          sourceId: 'enemy',
          targetId: 'operator:b',
          tags: ['normalSkill'],
          features: ['airborne'],
        },
      },
    ]);
    expect(receipt.entries).toEqual([
      expect.objectContaining({
        event: 'ExternalOperatorHitProcessed',
        sourceId: 'enemy',
        targetId: 'operator:b',
      }),
    ]);
    expect(receipt.entries.some(entry => entry.event === 'DamageApplied')).toBe(false);
  });

  it('requires ordered logical-frame inputs', () => {
    expect(
      () =>
        new ExternalCombatEventRuntime({
          clock: new CombatClock(),
          semanticEvents: new CombatSemanticEventRuntime(),
          receipt: new CombatReceiptCollector(),
          events: [
            {
              frame: 2,
              targetOperatorIds: ['operator:a'],
              event: { kind: 'operatorHit', tags: [], features: [] },
            },
            {
              frame: 1,
              targetOperatorIds: ['operator:a'],
              event: { kind: 'operatorHit', tags: [], features: [] },
            },
          ],
        }),
    ).toThrow('scheduled external event inputs must be ordered by frame');
  });

  it('dispatches weakness-trigger output only to the selected attacker ability system', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const received: string[] = [];
    const runtime = new ExternalCombatEventRuntime({
      clock,
      semanticEvents: new CombatSemanticEventRuntime(),
      receipt,
      emitOperatorWeaknessTriggeredOutput: operatorId => received.push(operatorId),
      events: [
        {
          frame: 0,
          targetOperatorIds: ['operator:chen'],
          event: { kind: 'operatorWeaknessTriggeredOutput' },
        },
      ],
    });

    runtime.applyCurrentFrame();

    expect(received).toEqual(['operator:chen']);
    expect(receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'ExternalOperatorWeaknessTriggeredOutputProcessed',
        sourceId: 'operator:chen',
        targetId: 'enemy',
      }),
    );
  });

  it('dispatches enemy weakness-set once as a global untargeted fact', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const received: string[] = [];
    const runtime = new ExternalCombatEventRuntime({
      clock,
      semanticEvents: new CombatSemanticEventRuntime(),
      receipt,
      emitEnemyWeaknessSet: () => received.push('enemy'),
      events: [
        {
          frame: 0,
          targetOperatorIds: ['operator:a', 'operator:b'],
          event: { kind: 'enemyWeaknessSet' },
        },
      ],
    });

    runtime.applyCurrentFrame();

    expect(received).toEqual(['enemy']);
    expect(receipt.entries).toContainEqual(
      expect.objectContaining({
        event: 'ExternalEnemyWeaknessSetProcessed',
        sourceId: 'enemy',
        targetId: 'enemy',
      }),
    );
  });
});
