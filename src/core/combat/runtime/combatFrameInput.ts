import type { CombatSkillInput, ScheduledSkillInput } from './combatInputRuntime';
import type { CombatInputExecution } from './combatInputExecution';
import type { ExternalCombatEventInput } from './externalCombatEventRuntime';

export interface CombatSkillInputPhase extends CombatInputExecution {
  canContinue(previous: ScheduledSkillInput): boolean;
}

/** 一次提交的玩家输入；用于下一帧或尚未提交的起始帧，不能写入已经完成的帧。 */
export interface CombatFrameInput {
  /** 不提供表示保持当前身份，null 表示没有主控干员。 */
  readonly controlledOperatorId?: string | null;
  readonly skills?: readonly CombatSkillInput[] | ((phase: CombatSkillInputPhase) => void);
  readonly externalEvents?: readonly ExternalCombatEventInput[];
}
