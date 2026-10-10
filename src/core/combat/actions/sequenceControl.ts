/** 动作序列的作用域和跳转控制；状态仍由动作宿主持有。 */
import type { ResolvedCombatStepForKind } from '../../compiler/combatProgram';
import type { ActionScopeState, TimelineJumpState } from '../state/actionState';
import type { ActionBlackboardState } from '../state/foundationState';

export function resetActionScopes(state: ActionScopeState): void {
  state.blackboards.clear();
}

/** 同步计数循环在入口只读取一次次数，内部短路不取消后续轮次。 */
export function executeCountedAction(count: number, execute: () => void): boolean {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError('repeatByActionValue count must be a non-negative integer');
  }
  for (let index = 0; index < count; index += 1) execute();
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

/** 推进跳转动作。先记录已跳转，再调用同步请求，避免重入造成重复跳转。 */

/** 条件检查包含其同步通知；取请求时验证宿主，不能在已跳转后才发现缺少宿主。 */
export interface TimelineJumpExecutionHost {
  evaluate(): boolean;
  resolveRequest(): () => void;
}

export function executeTimelineJump(
  state: TimelineJumpState,
  host: TimelineJumpExecutionHost,
): void {
  state.skipInitialTick = true;
  tryJump(state, host);
}

export function tickTimelineJump(state: TimelineJumpState, host: TimelineJumpExecutionHost): void {
  if (state.skipInitialTick) {
    state.skipInitialTick = false;
    return;
  }
  tryJump(state, host);
}

export function resetTimelineJump(state: TimelineJumpState): void {
  state.jumped = false;
  state.skipInitialTick = false;
}

function tryJump(state: TimelineJumpState, host: TimelineJumpExecutionHost): void {
  if (state.jumped || !host.evaluate()) return;
  const request = host.resolveRequest();
  state.jumped = true;
  request();
}
