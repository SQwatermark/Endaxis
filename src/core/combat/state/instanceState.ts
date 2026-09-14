/**
 * 战斗中动态创建的实例数据。
 *
 * 这里集中保存 Buff 动作宿主、全局 Buff、能力实体、投射物和 SkillAffix 的身份与寿命。
 * 所有跨实例关系都使用稳定编号、目标引用或共享数据节点；回调和运行对象由恢复阶段重新绑定。
 */
import type {
  AbilityEntityTargetRef,
  RuntimeTargetRef,
} from '../../game-data/logicalAbilityEntity';
import type { ActionSequenceState } from '../actions/actionSequenceState';
import type { BuffContainerState } from '../buffs/buffContainerState';
import type { BuffReference } from '../buffs/buffReference';
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';
import type { AbilityResponseEventName } from '../events/combatAbilityEvent';
import type {
  SharedSpGainModifier,
  SharedSpRecoveryModifier,
} from '../resources/sharedSpGainModifiers';
import type { TimelineRuntimeState } from '../timeline/timelineActionProcessor';
import type { LogicalAbilityEntityFinishReason } from '../runtime/logicalAbilityEntityRuntime';
import type { CombatSkillCastInfo } from '../runtime/skillCastInfo';
import type {
  ActionBlackboardState,
  ActionScopeState,
  CombatOperationHostState,
} from './actionState';
import type {
  AbilityEntityChildSkillState,
  CallbackSkillHostState,
  DamageCalculationSnapshotState,
  PassiveAbilityEventState,
  RuntimeTargetContextState,
} from './abilityState';
import type { TimedMarkerState } from './environmentState';

export type SkillAffixObjectReference =
  | {
      readonly kind: 'entity';
      readonly target: AbilityEntityTargetRef;
      readonly resetRegistrationId: number;
    }
  | {
      readonly kind: 'buff';
      readonly reference: BuffReference;
      readonly recycleRegistrationId: number;
    };

/** SkillAffix 等待技能及衍生对象结束的引用计数数据。 */
export interface SkillAffixState {
  readonly instanceId: number;
  readonly objectReferences: Map<number, SkillAffixObjectReference>;
  readonly eventSubscriptions: Map<AbilityResponseEventName, AbilityEventSubscriptionReference[]>;
  postSkillRequestRegistrationId: number | null;
  nextObjectReferenceId: number;
  readonly skillCastId: number;
  references: number;
  pendingRequest: boolean;
  disposed: boolean;
}

export function createSkillAffixState(instanceId: number, skillCastId: number): SkillAffixState {
  return {
    instanceId,
    objectReferences: new Map(),
    eventSubscriptions: new Map(),
    postSkillRequestRegistrationId: null,
    nextObjectReferenceId: 1,
    skillCastId,
    references: 1,
    pendingRequest: false,
    disposed: false,
  };
}

export interface BuffScheduledActionState {
  passedFrames: number;
  timeline: TimelineRuntimeState | null;
}

export interface BuffEventResponseState {
  readonly sequence: ActionSequenceState;
  readonly subscriptions: AbilityEventSubscriptionReference[];
}

/** 一个 Buff 生命周期的动作进度和共享执行数据。 */
export interface BuffActionHostState {
  readonly operations: CombatOperationHostState;
  readonly affixes: SkillAffixState[];
  nextAffixId: number;
  readonly eventResponses: BuffEventResponseState[];
  readonly scopes: ActionScopeState;
  readonly targets: RuntimeTargetContextState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  enable: ActionSequenceState | null;
  trigger: ActionSequenceState | null;
  scheduled: BuffScheduledActionState | null;
  skillSlotsReplaced: boolean;
}

/** 全局 Buff 单个实例的来源、寿命和子实例关系。 */
export interface GlobalBuffInstanceState {
  readonly id: string;
  readonly instanceId: number;
  readonly definitionProgramId: number | null;
  readonly sourceId: string;
  readonly sourceActionOwnerId: string | undefined;
  readonly sourceActionId: string | undefined;
  readonly blackboard: ActionBlackboardState;
  readonly children: BuffReference[];
  readonly sharedSpGainModifiers: readonly SharedSpGainModifier[];
  readonly sharedSpRecoveryModifiers: readonly SharedSpRecoveryModifier[];
  remainingDuration: number | null;
  finished: boolean;
}

export interface GlobalBuffState {
  nextInstanceId: number;
  readonly groups: Map<string, GlobalBuffInstanceState[]>;
}

export function createGlobalBuffState(): GlobalBuffState {
  return { nextInstanceId: 1, groups: new Map() };
}

/** 能力实体的身份、寿命、标记、子技能与黑板数据。 */
export interface LogicalAbilityEntityState {
  buffContainerCreated: boolean;
  buffs: BuffContainerState | null;
  readonly childSkills: AbilityEntityChildSkillState[];
  readonly passiveAbilities: Map<string, PassiveAbilityEventState>;
  readonly childBuffs: BuffReference[];
  readonly resetCallbackIds: number[];
  nextResetCallbackId: number;
  readonly timedMarkers: TimedMarkerState;
  readonly skillCastInfo?: CombatSkillCastInfo | null;
  readonly instanceId: number;
  readonly abilityEntityId: string;
  readonly definition: import('../runtime/logicalAbilityEntityRuntime').LogicalAbilityEntityDefinition;
  readonly ownerId: string;
  readonly source: RuntimeTargetRef;
  readonly sourceSkillCastId?: number;
  target?: RuntimeTargetRef;
  readonly dieWhenSourceDies: boolean;
  readonly blackboard: ActionBlackboardState;
  remainingDurationSeconds: number | null;
  elapsedDurationSeconds: number;
  isAlive: boolean;
  pendingRelease: boolean;
  pendingReleaseElapsedSeconds: number;
  pendingReleaseReason?: LogicalAbilityEntityFinishReason;
}

export interface LogicalAbilityEntityDirectoryState {
  readonly instances: Map<number, LogicalAbilityEntityState>;
  readonly deadSources: RuntimeTargetRef[];
}

/** 发射时确定的投射物回调输入，以及命中后创建的技能宿主数据。 */
export interface ProjectileCallbackState {
  programId: number | null;
  readonly definitionOperatorId: string;
  readonly skillId: string;
  readonly blackboard: ActionBlackboardState;
  readonly skillCastInfo: CombatSkillCastInfo | null;
  host: CallbackSkillHostState | null;
}

export interface ProjectileLifetimeState {
  readonly callback: ProjectileCallbackState | null;
  readonly instanceId: number;
  readonly source?: RuntimeTargetRef;
  phase: 'active' | 'finished' | 'marked' | 'reset';
  remainingSeconds: number;
  remainingReachTicks: number | null;
  readonly recycleDelaySeconds: number;
  readonly resetListeners: Map<number, number>;
}

/** 当前全部投射物及本帧已经准入的实例。 */
export interface ProjectileLifecycleState {
  readonly instances: Map<number, ProjectileLifetimeState>;
  admittedAbilities: number[] | null;
  nextResetRegistrationId: number;
}

export function createProjectileLifecycleState(): ProjectileLifecycleState {
  return { instances: new Map(), admittedAbilities: null, nextResetRegistrationId: 0 };
}
