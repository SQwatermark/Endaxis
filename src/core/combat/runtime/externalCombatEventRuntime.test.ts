import { describe, expect, it } from 'vitest';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { createNativeEventFixture } from '../events/nativeEventTestFixture';
import { ExternalCombatEventRuntime } from './externalCombatEventRuntime';

describe('ExternalCombatEventRuntime', () => {
  it('绑定保存游标后只处理尚未发生的外部事实', () => {
    const events = [0, 2].map(frame => ({
      frame,
      targetOperatorIds: ['operator'],
      event: { kind: 'enemyWeaknessSet' as const },
    }));
    const originalClock = new CombatClock();
    const originalReceipt = new CombatReceiptCollector();
    const originalCalls: number[] = [];
    const original = new ExternalCombatEventRuntime({
      clock: originalClock,
      receipt: originalReceipt,
      events,
      emitEnemyWeaknessSet: () => originalCalls.push(originalClock.frame),
    });
    original.applyCurrentFrame();
    originalClock.advanceFrame();
    original.applyCurrentFrame();
    const saved = structuredClone({
      clock: originalClock.runtimeState,
      events: original.runtimeState,
    });
    const savedHistory = originalReceipt.history.snapshot();

    originalClock.advanceFrame();
    original.applyCurrentFrame();
    const restoredClock = new CombatClock(saved.clock);
    const restoredReceipt = new CombatReceiptCollector(savedHistory);
    const restoredCalls: number[] = [];
    const restored = new ExternalCombatEventRuntime({
      clock: restoredClock,
      receipt: restoredReceipt,
      events,
      restoredState: saved.events,
      emitEnemyWeaknessSet: () => restoredCalls.push(restoredClock.frame),
    });
    expect(restored.runtimeState).toBe(saved.events);
    restored.applyCurrentFrame();
    restoredClock.advanceFrame();
    restored.applyCurrentFrame();

    expect(restoredCalls).toEqual([2]);
    expect(restored.runtimeState).toEqual(original.runtimeState);
    expect(restoredReceipt.entries).toEqual(originalReceipt.entries);
  });

  it('允许替换未来事实，但拒绝把不同的已消费前缀绑定到保存游标', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const consumed = {
      frame: 0,
      targetOperatorIds: ['operator'],
      event: { kind: 'enemyWeaknessSet' as const },
    };
    const original = new ExternalCombatEventRuntime({
      clock,
      receipt,
      events: [consumed, { ...consumed, frame: 4 }],
    });
    original.applyCurrentFrame();
    const saved = structuredClone(original.runtimeState);

    expect(
      () =>
        new ExternalCombatEventRuntime({
          clock,
          receipt,
          events: [consumed],
          restoredState: structuredClone(saved),
        }),
    ).not.toThrow();
    expect(
      () =>
        new ExternalCombatEventRuntime({
          clock,
          receipt,
          events: [{ ...consumed, targetOperatorIds: ['other'] }],
          restoredState: structuredClone(saved),
        }),
    ).toThrow('external event prefix does not match program');
  });

  it('dispatches explicit operator hit facts without creating a damage result', () => {
    const clock = new CombatClock();
    const { semanticEvents: events, dispatcher } = createNativeEventFixture();
    const receipt = new CombatReceiptCollector();
    const received: string[] = [];
    const abilityEvents: unknown[] = [];
    for (const operatorId of ['operator:a', 'operator:b']) {
      events.register({
        ownerOperatorId: operatorId,
        trigger: { kind: 'operatorHit' },
        phase: 'skill',
        handle: context => {
          if ('payload' in context.event && context.event.event === 'takeDamage') {
            received.push(`${operatorId}:${context.event.payload.tags.join(',')}`);
          }
        },
      });
    }
    const runtime = new ExternalCombatEventRuntime({
      clock,
      emitOperatorHitAbilityEvent: (operatorId, payload) => {
        abilityEvents.push({ operatorId, payload });
        dispatcher.dispatch({ event: 'takeDamage', payload }, []);
      },
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
          external: true,
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

it('外部受击缺少原始发布入口时明确失败，不静默丢弃', () => {
  const runtime = new ExternalCombatEventRuntime({
    clock: new CombatClock(),
    receipt: new CombatReceiptCollector(),
    events: [
      {
        frame: 0,
        targetOperatorIds: ['operator'],
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
    ],
  });
  expect(() => runtime.applyCurrentFrame()).toThrow('requires an ability event publisher');
});
