/** 验证逐项输入在分支恢复后继续执行，回执编号和载荷属于当前分支。 */
import { expect, it } from 'vitest';
import { appendCombatReceipt, type CombatReceiptState } from '../receipt/combatReceipt';
import { processCombatSkillInput } from './combatInputExecution';
import type { ScheduledSkillInput } from './combatInputRuntime';
import { StateStepper } from './stateStepper';

it('同一切面可以提交不同的后续输入，不保留另一分支的输入或回执', () => {
  const initial: CombatReceiptState = { entries: [] };
  const session = new StateStepper(initial, (step, input: ScheduledSkillInput) =>
    processCombatSkillInput(input, 30, (_operator, skill) => skill !== 'rejected', {
      record: entry => appendCombatReceipt(step.state, entry),
    }),
  );
  expect(session.step({ frame: 30, operatorId: 'operator', skillId: 'first' })).toBe(true);
  const saved = session.save();
  expect(session.step({ frame: 30, operatorId: 'operator', skillId: 'rejected' })).toBe(false);
  session.restore(saved);
  expect(session.step({ frame: 30, operatorId: 'operator', skillId: 'other' })).toBe(true);
  const entries = session.read().entries;
  expect(entries.map(entry => entry.sequence)).toEqual([0, 1]);
  expect(entries.map(entry => entry.data!.skillId)).toEqual(['first', 'other']);
  expect(entries[1]!.time).toBe(1);
  expect(initial.entries).toEqual([]);
});

it('修改提交时的载荷不会改写已经记录的事实', () => {
  const state: CombatReceiptState = { entries: [] };
  const data = { value: 1 };
  appendCombatReceipt(state, { frame: 0, time: 0, event: 'test', data });
  data.value = 2;
  expect(state.entries[0]!.data).toEqual({ value: 1 });
});
