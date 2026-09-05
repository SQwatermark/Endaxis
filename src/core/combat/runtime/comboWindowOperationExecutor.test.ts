import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { ComboWindowOperationExecutor } from './comboWindowOperationExecutor';
import { ComboWindowRuntime } from './comboWindowRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

describe('ComboWindowOperationExecutor', () => {
  it('查询本角色候选，不检查队首、槽位、释放资格或暂停状态，消费/过期后变 false', () => {
    const delegate = { execute: vi.fn(() => true), evaluate: vi.fn(() => false) };
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const resolveSlot = vi.fn(() => 'differentSkill');
    const executor = new ComboWindowOperationExecutor('owner', windows, delegate, resolveSlot);
    const condition = { kind: 'casterComboPending' } as const;
    expect(executor.evaluate(condition)).toBe(false);
    windows.open('other', 'combo');
    expect(executor.evaluate(condition)).toBe(false);
    windows.open('owner', 'combo');
    expect(windows.first?.operatorId).toBe('other');
    expect(executor.evaluate(condition)).toBe(true);
    windows.setGloballyPaused(true);
    windows.advanceFrame();
    expect(executor.evaluate(condition)).toBe(true);
    windows.setGloballyPaused(false);
    windows.tryConsume('other', 'combo');
    windows.tryConsume('owner', 'combo');
    expect(executor.evaluate(condition)).toBe(false);
    const candidate = windows.open('owner', 'combo');
    candidate.remainingFrames = 0;
    expect(executor.evaluate(condition)).toBe(true);
    windows.advanceFrame();
    expect(executor.evaluate(condition)).toBe(false);
    expect(delegate.evaluate).not.toHaveBeenCalled();
    expect(resolveSlot).not.toHaveBeenCalled();
  });
  it('opens the scene queue without forwarding the step', () => {
    const delegate: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => true),
    };
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const executor = new ComboWindowOperationExecutor('rossi', windows, delegate);
    const step: Extract<ResolvedCombatStep, { kind: 'openComboWindow' }> = {
      kind: 'openComboWindow',
      parameters: { nextSkillKey: 'comboSkillStage2' },
    };

    expect(executor.execute(step)).toBe(true);
    expect(windows.first).toMatchObject({
      operatorId: 'rossi',
      nextSkillKey: 'comboSkillStage2',
    });
    expect(delegate.execute).not.toHaveBeenCalled();
  });

  it('resolves TriggerComboSkillAction against the current combo slot at execution time', () => {
    const delegate: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => true),
    };
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const resolveCurrentSkillKey = vi.fn(() => 'enhancedComboSkill');
    const executor = new ComboWindowOperationExecutor(
      'catcher',
      windows,
      delegate,
      resolveCurrentSkillKey,
    );
    const step: Extract<ResolvedCombatStep, { kind: 'openComboWindow' }> = {
      kind: 'openComboWindow',
      parameters: { nextSkillKeyFromSlot: 'comboSkill' },
    };

    expect(executor.execute(step)).toBe(true);
    expect(resolveCurrentSkillKey).toHaveBeenCalledWith('comboSkill');
    expect(windows.first).toMatchObject({
      operatorId: 'catcher',
      nextSkillKey: 'enhancedComboSkill',
    });
  });
});
