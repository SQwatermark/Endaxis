/** 发射时已经确定的回调输入，以及命中后创建的技能宿主数据；不保存执行器或回调函数。 */
import type { ActionBlackboardState } from './actionBlackboardState';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { CallbackSkillHostState } from './callbackSkillHostState';

export interface ProjectileCallbackState {
  /** 发射入口登记后赋值；null 表示尚未接入固定程序目录。 */
  programId: number | null;
  /** 编译该回调动作的干员；来源实体可能是 Buff 或另一投射物，不能从运行时来源反推。 */
  readonly definitionOperatorId: string;
  readonly skillId: string;
  readonly blackboard: ActionBlackboardState;
  readonly skillCastInfo: CombatSkillCastInfo | null;
  /** null 表示尚未到达命中阶段，不能在恢复时提前创建或施放。 */
  host: CallbackSkillHostState | null;
}
