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

  it('keeps an infinite native replacement handle alive when its action ends', () => {
    const finish = vi.fn();
    const replaceSkillSlot = vi.fn(() => ({ finish }));
    const executor = new SkillSlotOperationExecutor({
      changeSkillSlot: vi.fn(),
      replaceSkillSlot,
      delegate: { execute: () => false, evaluate: () => false },
    });
    const step: ResolvedCombatOperationStep = {
      kind: 'changeSkillSlot',
      parameters: {
        skillGroupKey: 'comboSkill',
        targetSkillKey: 'comboSkill3',
        lifetime: 'infinite',
      },
    };

    expect(executor.execute(step)).toBe(true);
    executor.end(step);

    expect(replaceSkillSlot).toHaveBeenCalledWith({
      skillGroupKey: 'comboSkill',
      targetSkillKey: 'comboSkill3',
      inheritOriginSkillCooldownProgress: false,
    });
    expect(finish).not.toHaveBeenCalled();
  });

  it('reverts a FinishByAction replacement exactly when its action ends', () => {
    const finish = vi.fn();
    const executor = new SkillSlotOperationExecutor({
      changeSkillSlot: vi.fn(),
      replaceSkillSlot: () => ({ finish }),
      delegate: { execute: () => false, evaluate: () => false },
    });
    const step: ResolvedCombatOperationStep = {
      kind: 'changeSkillSlot',
      parameters: {
        skillGroupKey: 'battleSkill',
        targetSkillKey: 'battleSkillEnd',
        revertedSkillKey: 'battleSkill',
        inheritOriginSkillCooldownProgress: true,
        lifetime: 'finishByAction',
      },
    };

    executor.execute(step);
    executor.end(step);
    executor.end(step);

    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('activates a player-action mode for the action lifetime and restores it once', () => {
    const finish = vi.fn();
    const activatePlayerActionMode = vi.fn(() => ({ finish }));
    const executor = new SkillSlotOperationExecutor({
      changeSkillSlot: vi.fn(),
      activatePlayerActionMode,
      delegate: { execute: () => false, evaluate: () => false },
    });
    const step: ResolvedCombatOperationStep = {
      kind: 'changePlayerActionMode',
      parameters: { modeId: 'ultimateMode', lifetime: 'finishByAction' },
    };

    expect(executor.execute(step)).toBe(true);
    executor.end(step);
    executor.end(step);

    expect(activatePlayerActionMode).toHaveBeenCalledWith('ultimateMode');
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('applies a native SkillType mutation immediately without changing a slot', () => {
    const changeNativeSkillType = vi.fn();
    const changeSkillSlot = vi.fn();
    const executor = new SkillSlotOperationExecutor({
      changeSkillSlot,
      changeNativeSkillType,
      delegate: { execute: () => false, evaluate: () => false },
    });

    expect(
      executor.execute({
        kind: 'changeNativeSkillType',
        parameters: { targetSkillKey: 'ultimateEnd', nativeSkillType: 'attachSkill' },
      }),
    ).toBe(true);
    expect(changeNativeSkillType).toHaveBeenCalledWith('ultimateEnd', 'attachSkill');
    expect(changeSkillSlot).not.toHaveBeenCalled();
  });
});
