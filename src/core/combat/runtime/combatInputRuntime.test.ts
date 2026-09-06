import { describe, expect, it, vi } from 'vitest';
import { CombatClock } from './combatClock';
import { CombatInputRuntime, type ScheduledSkillInput } from './combatInputRuntime';
import { CombatReceiptCollector } from '../receipt/combatReceipt';

describe('CombatInputRuntime', () => {
  it('preserves same-frame input order and records acceptance', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const tryStartSkill = vi.fn(
      (_operatorId: string, skillId: string, castId?: string) =>
        skillId === 'first' && castId === 'cast:first',
    );
    const runtime = new CombatInputRuntime({
      clock,
      receipt,
      tryStartSkill,
      inputs: [
        { frame: 0, operatorId: 'operator', skillId: 'first', castId: 'cast:first' },
        { frame: 0, operatorId: 'operator', skillId: 'second', castId: 'cast:second' },
      ],
    });

    runtime.applyCurrentFrame();

    expect(tryStartSkill.mock.calls).toEqual([
      ['operator', 'first', 'cast:first'],
      ['operator', 'second', 'cast:second'],
    ]);
    expect(receipt.entries.map(entry => entry.data?.accepted)).toEqual([true, false]);
    expect(receipt.entries.map(entry => entry.data?.castId)).toEqual(['cast:first', 'cast:second']);
  });

  it('rejects out-of-order schedules instead of silently sorting them', () => {
    expect(
      () =>
        new CombatInputRuntime({
          clock: new CombatClock(),
          receipt: new CombatReceiptCollector(),
          tryStartSkill: () => true,
          inputs: [
            { frame: 2, operatorId: 'operator', skillId: 'later' },
            { frame: 1, operatorId: 'operator', skillId: 'earlier' },
          ],
        }),
    ).toThrow('scheduled skill inputs must be ordered by frame');
  });

  const chain = (firstFrame = 0): ScheduledSkillInput[] => [
    { frame: firstFrame, operatorId: 'operator', skillId: 'first', castId: 'a' },
    { frame: firstFrame + 1, operatorId: 'operator', skillId: 'second', castId: 'b' },
    { frame: firstFrame + 2, operatorId: 'operator', skillId: 'third', castId: 'c' },
  ];

  it.each([['a'], ['a', 'a'], ['a', 'missing']])(
    'rejects invalid continuation IDs %j',
    (...castIds) => {
      expect(
        () =>
          new CombatInputRuntime({
            clock: new CombatClock(),
            receipt: new CombatReceiptCollector(),
            inputs: chain(),
            tryStartSkill: () => true,
            continuationPlan: { castIds, canContinue: () => true },
          }),
      ).toThrow(/continuation plan/);
    },
  );

  it('rejects ambiguous cast IDs and different operators', () => {
    for (const inputs of [
      [...chain(), { ...chain()[2]!, castId: 'b' }],
      chain().map(input => (input.castId === 'b' ? { ...input, operatorId: 'other' } : input)),
    ]) {
      expect(
        () =>
          new CombatInputRuntime({
            clock: new CombatClock(),
            receipt: new CombatReceiptCollector(),
            inputs,
            tryStartSkill: () => true,
            continuationPlan: { castIds: ['a', 'b'], canContinue: () => true },
          }),
      ).toThrow(/continuation plan/);
    }
  });

  it.each([0, -5])(
    'waits for readiness after anchored frame %i and processes at most one continuation per frame',
    firstFrame => {
      const clock = new CombatClock();
      clock.initializeFrame(firstFrame);
      const receipt = new CombatReceiptCollector();
      const canContinue = vi.fn(
        (input: ScheduledSkillInput, previous: ScheduledSkillInput) =>
          input.frame - previous.frame >= 3,
      );
      const inputs = chain(firstFrame);
      const runtime = new CombatInputRuntime({
        clock,
        receipt,
        inputs,
        tryStartSkill: () => true,
        continuationPlan: { castIds: ['a', 'b', 'c'], canContinue },
      });
      runtime.applyCurrentFrame();
      runtime.applyCurrentFrame();
      expect(canContinue).not.toHaveBeenCalled();
      for (let frame = 1; frame <= 6; frame += 1) {
        clock.advanceFrame();
        runtime.applyCurrentFrame();
        runtime.applyCurrentFrame();
      }
      expect(
        receipt.entries.map(entry => [entry.data?.castId, entry.data?.scheduledActualFrame]),
      ).toEqual([
        ['a', firstFrame],
        ['b', firstFrame + 3],
        ['c', firstFrame + 6],
      ]);
      expect(inputs).toEqual(chain(firstFrame));
      expect(canContinue.mock.calls.find(([input]) => input.castId === 'c')?.[1].frame).toBe(
        firstFrame + 3,
      );
    },
  );

  it('preserves fixed input order and frames while delaying continuations', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new CombatInputRuntime({
      clock,
      receipt,
      tryStartSkill: () => true,
      inputs: [
        chain()[0]!,
        chain()[1]!,
        { frame: 1, operatorId: 'other', skillId: 'other1', castId: 'x' },
        { frame: 1, operatorId: 'other', skillId: 'other2', castId: 'y' },
        chain()[2]!,
      ],
      continuationPlan: { castIds: ['a', 'b', 'c'], canContinue: () => true },
    });
    runtime.applyCurrentFrame();
    clock.advanceFrame();
    runtime.applyCurrentFrame();
    runtime.applyCurrentFrame();
    clock.advanceFrame();
    runtime.applyCurrentFrame();
    expect(
      receipt.entries.map(entry => [entry.data?.castId, entry.data?.scheduledActualFrame]),
    ).toEqual([
      ['a', 0],
      ['x', 1],
      ['y', 1],
      ['b', 1],
      ['c', 2],
    ]);
  });

  it('stops at another authored input on the same operator', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new CombatInputRuntime({
      clock,
      receipt,
      tryStartSkill: () => true,
      inputs: [
        chain()[0]!,
        chain()[1]!,
        { frame: 1, operatorId: 'operator', skillId: 'authored', castId: 'x' },
        chain()[2]!,
      ],
      continuationPlan: { castIds: ['a', 'b', 'c'], canContinue: () => true },
    });
    runtime.applyCurrentFrame();
    for (let frame = 1; frame <= 4; frame += 1) {
      clock.advanceFrame();
      runtime.applyCurrentFrame();
    }
    expect(receipt.entries.map(entry => entry.data?.castId)).toEqual(['a', 'x']);
  });

  it.each(['a', 'b'])('stops when chain input %s fails', failedCastId => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const runtime = new CombatInputRuntime({
      clock,
      receipt,
      inputs: chain(),
      tryStartSkill: (_operator, _skill, castId) => castId !== failedCastId,
      continuationPlan: { castIds: ['a', 'b', 'c'], canContinue: () => true },
    });
    runtime.applyCurrentFrame();
    for (let frame = 1; frame <= 4; frame += 1) {
      clock.advanceFrame();
      runtime.applyCurrentFrame();
    }
    expect(receipt.entries.map(entry => entry.data?.castId)).toEqual(
      failedCastId === 'a' ? ['a'] : ['a', 'b'],
    );
    expect(receipt.entries.at(-1)?.data?.accepted).toBe(false);
  });
});
