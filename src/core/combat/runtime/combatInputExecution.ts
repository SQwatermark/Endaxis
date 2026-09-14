/** 执行本次已经提交的技能输入并记录结果，不保存或查询之后的技能安排。 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { COMBAT_FRAMES_PER_SECOND } from './combatClock';
import type { CombatInputRuntimeOptions, ScheduledSkillInput } from './combatInputRuntime';

export function processCombatSkillInput(
  input: ScheduledSkillInput,
  actualFrame: number,
  tryStartSkill: CombatInputRuntimeOptions['tryStartSkill'],
  receipt: CombatReceiptSink,
): boolean {
  const accepted =
    input.action === undefined
      ? tryStartSkill(input.operatorId, input.skillId, input.castId)
      : tryStartSkill(input.operatorId, input.skillId, input.castId, input.action);
  receipt.record({
    frame: actualFrame,
    time: actualFrame / COMBAT_FRAMES_PER_SECOND,
    event: 'SkillInputProcessed',
    sourceId: input.operatorId,
    data: {
      skillId: input.skillId,
      ...(input.castId === undefined ? {} : { castId: input.castId }),
      accepted,
      scheduledActualFrame: input.frame,
    },
  });
  return accepted;
}
