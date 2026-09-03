import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { ComboWindowOperationExecutor } from './comboWindowOperationExecutor';
import { ComboWindowRuntime } from './comboWindowRuntime';
import type { CombatOperationExecutor } from './skillRuntime';

describe('ComboWindowOperationExecutor', () => {
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

  it('checks native pending candidate existence without forwarding or applying cast gates', () => {
    const delegate: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => false),
    };
    const windows = new ComboWindowRuntime(new CombatClock(), new CombatReceiptCollector());
    const executor = new ComboWindowOperationExecutor('typhoeus', windows, delegate);
    const condition = { kind: 'pendingComboSkillPresent' } as const;

    expect(executor.evaluate(condition)).toBe(false);
    windows.open('typhoeus', 'comboSkill');
    expect(executor.evaluate(condition)).toBe(true);
    expect(delegate.evaluate).not.toHaveBeenCalled();
  });
});
