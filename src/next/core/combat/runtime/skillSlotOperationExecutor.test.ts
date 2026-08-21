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
    expect(changeSkillSlot).toHaveBeenCalledWith('ultimate', 'arcana', false);
    expect(delegate.execute).not.toHaveBeenCalled();
  });

  it('forwards native cooldown-progress inheritance', () => {
    const changeSkillSlot = vi.fn();
    const executor = new SkillSlotOperationExecutor({
      changeSkillSlot,
      delegate: { execute: () => false, evaluate: () => false },
    });

    executor.execute({
      kind: 'changeSkillSlot',
      parameters: {
        skillGroupKey: 'battleSkill',
        targetSkillKey: 'battleSkillEnd',
        inheritOriginSkillCooldownProgress: true,
      },
    });

    expect(changeSkillSlot).toHaveBeenCalledWith('battleSkill', 'battleSkillEnd', true);
  });
});
