/** 动作宿主的 once 和黑板作用域规则。回调仅在本次执行期间使用，不存入状态。 */
import type { ResolvedCombatStepForKind } from '../../compiler/combatProgram';
import type { ActionBlackboardState, ActionScopeState } from '../state/actionState';

export function resetActionScopes(state: ActionScopeState): void {
  state.executedOnce.clear();
  state.blackboards.clear();
}

/** 保留原有顺序：动作体完整返回后才记为已执行；false 结果也算执行过，抛错则不标记。 */
export function executeActionOnce(
  state: ActionScopeState,
  key: string,
  execute: () => void,
): boolean {
  if (state.executedOnce.has(key)) return true;
  execute();
  state.executedOnce.add(key);
  return true;
}

export function getActionScopeBlackboard(
  state: ActionScopeState,
  parent: ActionBlackboardState,
  parameters: ResolvedCombatStepForKind<'withActionBlackboardScope'>['parameters'],
  create: () => ActionBlackboardState,
): ActionBlackboardState {
  if (parameters.shareParentBlackboard === true) return parent;
  if (parameters.lifetime === 'execution') return create();
  let scopes = state.blackboards.get(parent);
  const existing = scopes?.get(parameters.scopeKey);
  if (existing !== undefined) return existing;
  const created = create();
  if (scopes === undefined) {
    scopes = new Map();
    state.blackboards.set(parent, scopes);
  }
  scopes.set(parameters.scopeKey, created);
  return created;
}
