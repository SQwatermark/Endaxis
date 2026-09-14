/**
 * 动作执行层的可变数据。
 *
 * 本文件只定义黑板、动作作用域、动作进度和动作产生的句柄账本。动作程序、执行器和回调
 * 不属于切面数据，恢复时由运行时重新绑定。放在同一文件内可以直接看清一个动作宿主保存
 * 的完整数据，而不必在十个只有少量字段的文件之间跳转。
 */
import type { ActionBlackboardValue } from '../../../../packages/game-data-contract/src/primitives.ts';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { ActionSequenceState } from '../actions/actionSequenceState';
import type { GlobalBuffInstanceState } from './instanceState';
import type { SkillCastInheritanceRegistration } from './environmentState';

/** 黑板数据节点。entity 指向同一实体共享的黑板节点。 */
export interface ActionBlackboardState {
  readonly values: Map<string, ActionBlackboardValue>;
  readonly entity?: ActionBlackboardState;
}

export function createActionBlackboardState(
  values?: Readonly<Record<string, ActionBlackboardValue>>,
  entity?: ActionBlackboardState,
): ActionBlackboardState {
  return { values: new Map(Object.entries(values ?? {})), entity };
}

/** 黑板作用域动作当前创建的子序列；尚未执行或已经重置时 body 为 null。 */
export interface ActionBlackboardScopeState {
  body: {
    readonly blackboard: ActionBlackboardState;
    readonly sequence: ActionSequenceState;
  } | null;
}

/** 一个技能或 Buff 动作宿主的作用域数据。 */
export interface ActionScopeState {
  readonly executedOnce: Set<string>;
  readonly blackboards: Map<ActionBlackboardState, Map<string, ActionBlackboardState>>;
}

export function createActionScopeState(): ActionScopeState {
  return { executedOnce: new Set(), blackboards: new Map() };
}

/** 分支动作当前选中的程序下标；null 表示尚未选择。 */
export interface BranchActionState {
  activeBranch: number | null;
}

export function createBranchActionState(): BranchActionState {
  return { activeBranch: null };
}

/** 重复动作的计时和触发次数。 */
export interface RepeatedActionState {
  skipInitialTick: boolean;
  timerSeconds: number;
  scanCount: number;
  targetTriggerCount: number;
  lastTargetTriggerSeconds: number;
}

export function createRepeatedActionState(): RepeatedActionState {
  return {
    skipInitialTick: false,
    timerSeconds: 0,
    scanCount: 0,
    targetTriggerCount: 0,
    lastTargetTriggerSeconds: 0,
  };
}

/** 目标循环当前运行的子序列和目标。 */
export interface TargetLoopState {
  readonly activeBodies: number[];
  readonly bodies: Map<
    number,
    { readonly target: RuntimeTargetRef; readonly sequence: ActionSequenceState }
  >;
  nextBodyId: number;
}

export function createTargetLoopState(): TargetLoopState {
  return { activeBodies: [], bodies: new Map(), nextBodyId: 1 };
}

/** 时间轴跳转动作的执行进度。 */
export interface TimelineJumpState {
  jumped: boolean;
  skipInitialTick: boolean;
}

export function createTimelineJumpState(): TimelineJumpState {
  return { jumped: false, skipInitialTick: false };
}

/** 动作结束时要停止的膨胀实例，以及要恢复的实体忽略设置。 */
export interface TimeDilationActionState {
  readonly instanceIds: Map<number, readonly number[]>;
  readonly ignoredEntityIds: Map<number, readonly string[]>;
}

export function createTimeDilationActionState(): TimeDilationActionState {
  return { instanceIds: new Map(), ignoredEntityIds: new Map() };
}

/** 动作持续期内创建的全局 Buff。 */
export interface GlobalBuffActionState {
  readonly active: Map<number, readonly GlobalBuffInstanceState[]>;
}

export function createGlobalBuffActionState(): GlobalBuffActionState {
  return { active: new Map() };
}

export interface AbilityEntityActionState {
  readonly actionDurationEntities: Map<number, readonly RuntimeTargetRef[]>;
}

export interface SkillResourceActionState {
  readonly ultimateRecoveryRestrictionHandles: Map<number, number>;
}

export interface TimedMarkerActionReference {
  readonly ownerId: string;
  readonly sourceTargetId: string;
}

export interface TimedMarkerActionState {
  readonly markers: Map<number, readonly TimedMarkerActionReference[]>;
}

export interface ComboWindowActionState {
  readonly ringQteRegistrations: Map<number, Map<ActionBlackboardState, number>>;
}

export interface HealthFloorActionReference {
  readonly entityId: string;
  readonly handle: number;
}

export interface ActionBlackboardActionState {
  readonly healthFloors: Map<number, HealthFloorActionReference>;
}

export interface SkillCastInheritanceActionState {
  readonly registrations: Map<number, SkillCastInheritanceRegistration>;
}

/** 一个动作宿主在步骤开始与结束之间持有的全部句柄和实例账本。 */
export interface CombatOperationHostState {
  readonly abilityEntities: AbilityEntityActionState;
  readonly resources: SkillResourceActionState;
  readonly timedMarkers: TimedMarkerActionState;
  readonly comboWindows: ComboWindowActionState;
  readonly actionBlackboard: ActionBlackboardActionState;
  readonly skillCastInheritance: SkillCastInheritanceActionState;
  readonly timeDilation: TimeDilationActionState;
  readonly globalBuffs: GlobalBuffActionState;
}

export function createCombatOperationHostState(): CombatOperationHostState {
  return {
    abilityEntities: { actionDurationEntities: new Map() },
    resources: { ultimateRecoveryRestrictionHandles: new Map() },
    timedMarkers: { markers: new Map() },
    comboWindows: { ringQteRegistrations: new Map() },
    actionBlackboard: { healthFloors: new Map() },
    skillCastInheritance: { registrations: new Map() },
    timeDilation: createTimeDilationActionState(),
    globalBuffs: createGlobalBuffActionState(),
  };
}
