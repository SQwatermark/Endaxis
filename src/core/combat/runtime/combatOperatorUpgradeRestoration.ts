/**
 * 恢复一名干员的潜能事件来源宿主。
 *
 * 潜能事件在稳定帧没有长期局部序列，只保存固定程序顺序和语义事件订阅身份。恢复时使用当前
 * 分支的操作执行器按原编号重绑处理函数，不发布事件，也不申请新的订阅编号。
 */
import type { CompiledOperatorUpgradeEventProgram } from '../../compiler/combatProgram';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import {
  OperatorUpgradeEventRuntime,
  type CreateOperatorUpgradeEventExecutor,
} from './operatorUpgradeEventRuntime';
import type { OperatorUpgradeEventState } from './operatorUpgradeEventState';

export interface RestoreCombatOperatorUpgradeEventsOptions {
  readonly operatorId: string;
  readonly programs: readonly CompiledOperatorUpgradeEventProgram[];
  readonly state: OperatorUpgradeEventState;
  readonly semanticEvents: CombatSemanticEventRuntime;
  readonly createExecutor: CreateOperatorUpgradeEventExecutor;
}

export function bindRestoredCombatOperatorUpgradeEvents(
  options: RestoreCombatOperatorUpgradeEventsOptions,
): OperatorUpgradeEventRuntime {
  return new OperatorUpgradeEventRuntime(
    options.semanticEvents,
    options.operatorId,
    options.programs,
    options.createExecutor,
    options.state,
  );
}
