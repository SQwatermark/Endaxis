import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { SkillSlotOperationExecutor } from './skillSlotOperationExecutor';

describe('SkillSlotOperationExecutor', () => {
  it('changes future slot resolution without delegating the operation', () => {
    const changeSkillSlot = vi.fn();
    const delegate = {
      execute: vi.fn(() => false),
      evaluate: vi.fn(() => false),
    };
    const executor = new SkillSlotOperationExecutor({ changeSkillSlot, delegate });
    const step: ResolvedCombatOperationStep = {
      kind: 'changeSkillSlot',
      parameters: { skillGroupKey: 'ultimate', targetSkillKey: 'arcana' },
    };

    expect(executor.execute(step)).toBe(true);
    expect(changeSkillSlot).toHaveBeenCalledWith('ultimate', 'arcana');
    expect(delegate.execute).not.toHaveBeenCalled();
  });
});
