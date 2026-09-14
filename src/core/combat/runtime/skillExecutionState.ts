/**
 * 一次技能宿主的施放进度、输入准备和扣费事实。这里不保存回调、时间轴对象或 Buff 句柄。
 * 完整切面还需同时包含动作实例、附着 Buff、冷却、黑板及外部输入；不能单独恢复此记录。
 */
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { BuffReference } from '../buffs/buffReference';
import type { SkillCastStartPreparation } from './skillCastStartPreparation';
import {
  createRuntimeTargetContextState,
  type RuntimeTargetContextState,
} from './runtimeTargetContext';

export type RuntimeSkillState = 'ready' | 'casting' | 'ended';

export interface SkillExecutionState {
  readonly targetContext: RuntimeTargetContextState;
  preparedCastStart: SkillCastStartPreparation | undefined;
  /** 当前施放附着的 Buff，按首次附着顺序去重；键由目标与实例编号共同组成。 */
  readonly attachedBuffs: Map<string, BuffReference>;
  /** 施放生命周期；不能用时间轴是否完成代替。 */
  state: RuntimeSkillState;
  /** 技能局部帧，可随时间膨胀以小数推进。 */
  passedFrames: number;
  /** 实际开始时的战斗帧，用于防止同一帧额外推进。 */
  castStartFrame: number | undefined;
  /** 成功付费与已经尝试分别记录，失败也不能每帧重试。 */
  appliedCost: boolean;
  attemptedCost: boolean;
  nonReturnedSpCost: number;
  /** 当前施放编号与下一次开始要消费的预分配编号。 */
  skillCastId: number;
  preparedSkillCastId: number;
  /** 原生子技能继承的来源；准备值在开始后转入 inherited。 */
  preparedSkillCastInfo: CombatSkillCastInfo | undefined;
  inheritedSkillCastInfo: CombatSkillCastInfo | undefined;
  preparedSkipApplyCost: boolean;
  preparedForceTimelinePayment: boolean;
  forceTimelinePayment: boolean;
  /** 开始时是否处于准备期，不能在稍后扣费时重新按全局帧判断。 */
  preparationCast: boolean;
  timelineFinishRequested: boolean;
  reachedOperableBoundaryFrame: number | undefined;
  /** 只属于已提交到该宿主的下一次施放输入；整场入口不得提前塞入未提交技能块。 */
  preparedStartBlackboard: Readonly<Record<string, number>>;
}

export function createSkillExecutionState(): SkillExecutionState {
  return {
    targetContext: createRuntimeTargetContextState(),
    preparedCastStart: undefined,
    attachedBuffs: new Map(),
    state: 'ready',
    passedFrames: 0,
    castStartFrame: undefined,
    appliedCost: false,
    attemptedCost: false,
    nonReturnedSpCost: 0,
    skillCastId: 0,
    preparedSkillCastId: 0,
    preparedSkillCastInfo: undefined,
    inheritedSkillCastInfo: undefined,
    preparedSkipApplyCost: false,
    preparedForceTimelinePayment: false,
    forceTimelinePayment: false,
    preparationCast: false,
    timelineFinishRequested: false,
    reachedOperableBoundaryFrame: undefined,
    preparedStartBlackboard: {},
  };
}
