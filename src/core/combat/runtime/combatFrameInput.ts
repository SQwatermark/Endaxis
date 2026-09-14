import type { CombatSkillInput, ScheduledSkillInput } from './combatInputRuntime';
import type { CombatInputExecution } from './combatInputExecution';
import type { ExternalCombatEventInput } from './externalCombatEventRuntime';
import type { CombatSkillCastProgram } from './combatRuntimeAssembly';

export interface CombatSkillInputPhase extends CombatInputExecution {
  /** 提交输入；自定义程序只能随对应输入一起登记，不能单独写入当前分支。 */
  submit(
    input: ScheduledSkillInput,
    actualFrame: number,
    skillProgram?: CombatSkillCastProgram,
  ): boolean;
  canContinue(previous: ScheduledSkillInput): boolean;
}

/** 一次提交的玩家输入；用于下一帧或尚未提交的起始帧，不能写入已经完成的帧。 */
export interface CombatFrameInput {
  /** 不提供表示保持当前身份，null 表示没有主控干员。 */
  readonly controlledOperatorId?: string | null;
  readonly skills?: readonly CombatSkillInput[] | ((phase: CombatSkillInputPhase) => void);
  readonly externalEvents?: readonly ExternalCombatEventInput[];
}
