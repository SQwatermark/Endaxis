/**
 * 干员能力、技能和常驻事件来源的可变数据。
 *
 * 本文件按“事件宿主 → 技能选择 → 单次技能执行 → 常驻来源”组织。它只保存恢复所需的数据；
 * 编译后的技能程序、事件处理函数和运行时端口仍由对应运行时模块持有。
 */
import {
  type SkillCastEventData,
  type AbilityEventSubscriptionReference,
  type BuffReference,
  type CombatSkillCastInfo,
  type PostSkillCastRequest,
  type SkillCastStartPreparation,
  type ActionBlackboardState,
} from './foundationState';
import { type ActionBlackboardValue } from '../../../../packages/game-data-contract/src/primitives';
import { type NativeSkillType, type PlayerSkillInput } from '../../game-data/operatorDefinition';
import {
  type ActionSequenceState,
  type TimelineRuntimeState,
  createCombatOperationHostState,
  type ActionScopeState,
  type CombatOperationHostState,
} from './actionState';
import { type PeriodicTimerState } from './environmentState';

export interface DamageCalculationSnapshot {
  readonly attack: number;
  readonly attackScale: number;
  readonly baseValue: number;
}

export type DamageCalculationSnapshotState = Map<number, DamageCalculationSnapshot>;

/** 当前释放已经建立的命名目标组。 */
export interface RuntimeTargetContextState {
  readonly groups: Map<string, import('../../game-data/logicalAbilityEntity').RuntimeTargetGroup>;
}

export function createRuntimeTargetContextState(): RuntimeTargetContextState {
  return { groups: new Map() };
}

export interface SkillOperableBoundaryFact {
  readonly castId: string;
  readonly durationFrames: number;
  readonly reachedAtFrame: number;
}

export interface PendingSkillOperableBoundary {
  readonly castId: string;
  readonly durationFrames: number;
  readonly actualStartFrame: number;
  accumulatedFrames: number;
}

/** 待到达的技能显示边界和已经登记过的施放身份。 */
export interface SkillOperableBoundaryState {
  readonly pendingByCastId: Map<string, PendingSkillOperableBoundary>;
  readonly registeredCastIds: Set<string>;
}

export function createSkillOperableBoundaryState(): SkillOperableBoundaryState {
  return { pendingByCastId: new Map(), registeredCastIds: new Set() };
}

/** 被动、装备和养成 Ability 共用的事件订阅与子 Buff 账本。 */
export interface AbilityEventHostState {
  enabled: boolean;
  disposed: boolean;
  readonly registrations: AbilityEventSubscriptionReference[][];
  readonly childBuffs: BuffReference[];
}

export function createAbilityEventHostState(): AbilityEventHostState {
  return { enabled: false, disposed: false, registrations: [], childBuffs: [] };
}

/** 等待真正施放时发布的事件数据，以及 Buff 附着所用的原始技能寻址方式。 */
export interface BeforeSkillCastPreparation {
  readonly skillId: string;
  readonly castId: string | undefined;
  readonly resolveSkillSlot: boolean;
  readonly payload: SkillCastEventData;
}

export interface AbilitySkillSlotState {
  readonly baseSkillKey: string;
  readonly input: PlayerSkillInput;
  readonly defaultForInput: boolean;
  readonly stableInputSkillKeys: ReadonlySet<string>;
  readonly allowedSkillKeys: ReadonlySet<string>;
  currentSkillKey: string;
}

/** 单个干员的技能选择、形态切换和延迟施放数据。 */
export interface AbilitySystemState {
  readonly skillSlotReplacements: Map<
    string,
    {
      readonly registrationId: number;
      readonly revertedSkillKey: string;
      readonly inheritOriginSkillCooldownProgress: boolean;
    }
  >;
  nextSkillSlotReplacementId: number;
  readonly playerActionModeActivations: Map<
    number,
    {
      readonly layer: string;
      readonly modeId: string;
      readonly previousModeId: string | null;
    }
  >;
  nextPlayerActionModeActivationId: number;
  readonly beforeCastStarts: Map<string, BeforeSkillCastPreparation>;
  readonly operableBoundaries: SkillOperableBoundaryState;
  readonly nativeSkillTypeBySkillId: Map<string, NativeSkillType>;
  readonly skillSlotGroups: Map<string, AbilitySkillSlotState>;
  readonly activePlayerActionModeByLayer: Map<string, string>;
  readonly registeredOperableBoundaryCastIds: Set<string>;
  readonly buffBasicAttackMappings: Map<number, string>;
  nextBasicAttackMappingId: number;
  currentSkillKey: string | null;
  processingSkillKey: string | null;
  postSkillCastRequest: PostSkillCastRequest | null;
}

export function createAbilitySystemState(): AbilitySystemState {
  return {
    skillSlotReplacements: new Map(),
    nextSkillSlotReplacementId: 0,
    playerActionModeActivations: new Map(),
    nextPlayerActionModeActivationId: 0,
    beforeCastStarts: new Map(),
    operableBoundaries: createSkillOperableBoundaryState(),
    nativeSkillTypeBySkillId: new Map(),
    skillSlotGroups: new Map(),
    activePlayerActionModeByLayer: new Map(),
    registeredOperableBoundaryCastIds: new Set(),
    buffBasicAttackMappings: new Map(),
    nextBasicAttackMappingId: 0,
    currentSkillKey: null,
    processingSkillKey: null,
    postSkillCastRequest: null,
  };
}

/** 一项共享冷却的当前计时和本次施放预占事实。 */
export interface SkillCooldownState {
  readonly timer: PeriodicTimerState | undefined;
  reservedByCurrentCast: boolean;
}

/** 投影与合法性诊断读取的冷却事实。 */
export interface SkillCooldownSnapshot {
  readonly configured: boolean;
  readonly ready: boolean;
  readonly remainingFrames: number;
  readonly progress: number;
}

/** 冷却固定配置；动态倍率在实际预占时读取。 */
export interface SkillCooldownProgram {
  readonly periodFrames: number;
  readonly commitFrame?: number;
}

export type RuntimeSkillState = 'ready' | 'casting' | 'ended';

/** 一次技能宿主的施放进度、输入准备和扣费事实。 */
export interface SkillExecutionState {
  readonly targetContext: RuntimeTargetContextState;
  preparedCastStart: SkillCastStartPreparation | undefined;
  readonly attachedBuffs: Map<string, BuffReference>;
  state: RuntimeSkillState;
  passedFrames: number;
  castStartFrame: number | undefined;
  appliedCost: boolean;
  attemptedCost: boolean;
  nonReturnedSpCost: number;
  skillCastId: number;
  preparedSkillCastId: number;
  preparedSkillCastInfo: CombatSkillCastInfo | undefined;
  inheritedSkillCastInfo: CombatSkillCastInfo | undefined;
  preparedSkipApplyCost: boolean;
  preparedForceTimelinePayment: boolean;
  forceTimelinePayment: boolean;
  preparationCast: boolean;
  timelineFinishRequested: boolean;
  reachedOperableBoundaryFrame: number | undefined;
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

/** 一个技能宿主已经接入的完整数据。 */
export interface SkillRuntimeState {
  readonly castId: string | null;
  readonly execution: SkillExecutionState;
  readonly blackboard: ActionBlackboardState;
  readonly initialBlackboard: Readonly<Record<string, ActionBlackboardValue>>;
  readonly cooldown: SkillCooldownState;
  readonly scopes: ActionScopeState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  readonly operations: CombatOperationHostState;
  timeline: TimelineRuntimeState | null;
}

/** 投射物回调技能的数据；两个字段一起复制以保留内部共享关系。 */
export interface CallbackSkillHostState {
  readonly skill: SkillRuntimeState;
  readonly ability: AbilitySystemState;
}

/** 能力实体的一次子技能执行数据。 */
export interface AbilityEntityChildSkillState {
  readonly programId: number;
  readonly skillId: string;
  passedFrames: number;
  started: boolean;
  finished: boolean;
  readonly blackboard: ActionBlackboardState;
  readonly targets: RuntimeTargetContextState;
  readonly scopes: ActionScopeState;
  readonly timeline: TimelineRuntimeState;
  readonly damageSnapshots: DamageCalculationSnapshotState;
  readonly operations: CombatOperationHostState;
}

/** 一条常驻连携条件的数据。 */
export interface ComboSkillConditionState {
  readonly blackboard: ActionBlackboardState;
  readonly operations: CombatOperationHostState;
}

export interface EquipmentEventHandlerState {
  readonly key: string;
  readonly sequence: ActionSequenceState;
}

export interface EquipmentContributionEventState {
  readonly blackboard: ActionBlackboardState;
  readonly host: AbilityEventHostState;
  readonly responses: EquipmentEventHandlerState[];
}

/** 一名干员全部装备贡献的事件状态。 */
export interface EquipmentEventState {
  readonly contributions: Map<number, EquipmentContributionEventState>;
}

export function createEquipmentEventState(): EquipmentEventState {
  return { contributions: new Map() };
}

export function createEquipmentContributionEventState(
  blackboard: ActionBlackboardState,
): EquipmentContributionEventState {
  return { blackboard, host: createAbilityEventHostState(), responses: [] };
}

/** 一条干员养成或装备初始化程序的数据。 */
export interface OperatorInitializationState {
  readonly key: string;
  readonly equipmentContributionIndex?: number;
  readonly blackboard: ActionBlackboardState;
  readonly operations: CombatOperationHostState;
  readonly enableSequence: ActionSequenceState | null;
  readonly initializationSequence: ActionSequenceState;
  initializationExecuted: boolean;
}

export interface OperatorUpgradeEventProgramState {
  readonly key: string;
  readonly subscriptions: readonly AbilityEventSubscriptionReference[];
}

/** 干员养成事件监听的稳定订阅身份。 */
export interface OperatorUpgradeEventState {
  readonly programs: OperatorUpgradeEventProgramState[];
}

export function createOperatorUpgradeEventState(): OperatorUpgradeEventState {
  return { programs: [] };
}

/** 一个原生被动 Ability 的事件响应进度。 */
export interface PassiveAbilityEventState {
  readonly host: AbilityEventHostState;
  readonly blackboard: ActionBlackboardState;
  readonly operations: CombatOperationHostState;
  enableSequence: ActionSequenceState | null;
  readonly responses: ActionSequenceState[];
}

export function createPassiveAbilityEventState(
  blackboard: ActionBlackboardState,
  operations: CombatOperationHostState = createCombatOperationHostState(),
): PassiveAbilityEventState {
  return {
    host: createAbilityEventHostState(),
    blackboard,
    operations,
    enableSequence: null,
    responses: [],
  };
}
