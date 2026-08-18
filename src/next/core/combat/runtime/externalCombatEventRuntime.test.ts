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
});
