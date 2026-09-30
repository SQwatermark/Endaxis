/** 执行本次已经提交的技能输入并记录结果，不保存或查询之后的技能安排。 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatSkillInput, ScheduledSkillInput } from '../state/environmentState';
import { COMBAT_FRAMES_PER_SECOND } from '../time/combatClock';

/**
 * 既有施放入口的布尔值只表示执行成功，包含 SwitchToBuffCast，不保证有 SkillStarted。
 * 原生路由、门禁及未知项由独立诊断回执表达，不参与这个返回值。
 */
export type TryStartCombatSkill = (
  operatorId: string,
  skillId: string,
  castId?: string,
  action?: CombatSkillInput['action'],
  simulationInputs?: CombatSkillInput['simulationInputs'],
) => boolean;

/** 本次输入的执行结果；不是原生合法性结论，也不表示整个技能生命周期已经结束。 */
export type CombatInputExecutionOutcome = 'executed' | 'rejected';

/** 排程器可提交的事实只限于当前输入和组阻断，不接触活动战斗对象。 */
export interface CombatInputExecution {
  submit(input: ScheduledSkillInput, actualFrame: number): CombatInputExecutionOutcome;
  groupBlocked(input: {
    readonly frame: number;
    readonly operatorId: string;
    readonly anchorCastId: string;
    readonly castId: string;
    readonly previousCastId: string;
    readonly reason: 'inputRejected' | 'interruptedByFixedInput';
    readonly interruptingCastId?: string;
  }): void;
}

export function createCombatInputExecution(
  tryStartSkill: TryStartCombatSkill,
  receipt: CombatReceiptSink,
): CombatInputExecution {
  return {
    submit: (input, frame) => processCombatSkillInput(input, frame, tryStartSkill, receipt),
    groupBlocked: ({ frame, operatorId, ...data }) =>
      receipt.record({
        frame,
        time: frame / COMBAT_FRAMES_PER_SECOND,
        event: 'SkillInputGroupBlocked',
        sourceId: operatorId,
        data,
      }),
  };
}

export function processCombatSkillInput(
  input: ScheduledSkillInput,
  actualFrame: number,
  tryStartSkill: TryStartCombatSkill,
  receipt: CombatReceiptSink,
): CombatInputExecutionOutcome {
  const executed =
    input.simulationInputs !== undefined
      ? tryStartSkill(
          input.operatorId,
          input.skillId,
          input.castId,
          input.action,
          input.simulationInputs,
        )
      : input.action === undefined
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
      // 保留既有回执字段及布尔载荷；accepted 仅对应执行结果，不代表原生输入合法。
      accepted: executed,
      scheduledActualFrame: input.frame,
    },
  });
  return executed ? 'executed' : 'rejected';
}
