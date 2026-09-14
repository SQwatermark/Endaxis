/**
 * 战斗环境、全局账本和输入游标的数据。
 *
 * 本文件保存所有参与者共享的时钟与资源、敌我生命、时间膨胀、随机源和已经消费到的位置。
 * 它不负责校验初始配置，也不执行资源、生命或时间推进；这些操作留在 runtime 目录。
 */
import type { ElementalReaction } from '../../game-data/operatorDefinition';
import type { ActionBlackboardValue } from '../../../../packages/game-data-contract/src/primitives.ts';
import type { ElementalReactionState } from '../infliction/elementalReactionState';
import type { SimulationRandomState } from '../random/simulationRandomState';
import type {
  SharedSpGainModifierState,
  SharedSpRecoveryModifierState,
} from '../resources/sharedSpGainModifiers';
import type { GameplayTag } from '../tags/gameplayTags';
import type {
  NormalSkillUltimateEnergySettings,
  OperatorResourceSnapshot,
} from '../runtime/combatResources';
import type { ScheduledSkillInput } from '../runtime/combatInputRuntime';
import type { ScheduledExternalCombatEventInput } from '../runtime/externalCombatEventRuntime';

/** 当前已经推进到的整数帧。 */
export interface CombatClockState {
  frame: number;
}

/** 下一次分配的能力实体编号。 */
export interface AbilityEntityInstanceIdState {
  next: number;
}

/** 下一次实际施放使用的编号。 */
export interface SkillCastIdState {
  nextId: number;
}

export interface SkillCastInheritanceRegistration {
  readonly operatorId: string;
  readonly id: number;
  readonly skillCastInfo: import('../runtime/skillCastInfo').CombatSkillCastInfo;
}

/** 全场普通攻击施法身份继承槽及编号进度。 */
export interface SkillCastInheritanceState {
  readonly registrations: Map<string, SkillCastInheritanceRegistration>;
  nextId: number;
}

export interface BuffProgressPoint {
  readonly frame: number;
  readonly ratio: number | null;
}

export interface BuffProgressCurveState {
  readonly targetId: string;
  readonly buffId: string;
  readonly instanceId: number;
  readonly showInBattleSkillButton: boolean;
  readonly showInUltimateButton: boolean;
  readonly showInHpBar: boolean;
  readonly weakBattleSkillStyle: boolean;
  durationSeconds: number | null;
  readonly points: BuffProgressPoint[];
}

/** Buff 进度曲线历史及仍需采样的实例索引。 */
export interface BuffProgressRecorderState {
  readonly curves: Map<string, BuffProgressCurveState>;
  readonly runtimeCurveKeys: Map<string, Set<string>>;
}

/** 连携条件求值后可保存到候选窗口的数据。 */
export interface ComboCastParameters {
  readonly inputTarget: import('../../game-data/logicalAbilityEntity').RuntimeTargetRef;
  readonly triggerTarget: import('../../game-data/logicalAbilityEntity').RuntimeTargetRef | null;
  readonly assignPairs: Readonly<Record<string, ActionBlackboardValue>> | null;
}

export interface PendingComboWindow {
  readonly sequence: number;
  readonly operatorId: string;
  readonly nextSkillKey: string;
  readonly openedFrame: number;
  readonly blackboard: Readonly<Record<string, number>>;
  readonly nativeCondition?: ComboCastParameters & {
    readonly skillGroupKey: string;
  };
  remainingFrames: number;
}

export interface PendingComboRecord {
  readonly operatorId: string;
  readonly activationSequence: number;
  readonly openedFrame: number;
  readonly candidates: PendingComboWindow[];
}

export interface ComboRingQteRegistration {
  readonly sequence: number;
  readonly operatorId: string;
  readonly startRemainingFrames: number;
  readonly earlyDurationFrames: number;
  readonly activeDurationFrames: number;
}

/** 全场连携候选、暂停状态和 QTE 结果。 */
export interface ComboWindowState {
  readonly records: Map<string, PendingComboRecord>;
  readonly pausedOperators: Set<string>;
  readonly ringQtes: Map<number, ComboRingQteRegistration>;
  readonly successfulRingQteSkillCastIds: Set<number>;
  globallyPaused: boolean;
  nextSequence: number;
  nextRingQteSequence: number;
}

export function createComboWindowState(): ComboWindowState {
  return {
    records: new Map(),
    pausedOperators: new Set(),
    ringQtes: new Map(),
    successfulRingQteSkillCastIds: new Set(),
    globallyPaused: false,
    nextSequence: 0,
    nextRingQteSequence: 0,
  };
}

/** 全场冷却到期时间及最近一次清理时间。 */
export interface GlobalCooldownState {
  readonly entries: Map<string, Map<string, number>>;
  lastTick: number;
}

export type TimedMarkerClockDomain = 'default' | 'global' | 'globalScaled';

export interface TimedMarkerSnapshot {
  readonly instanceId: number;
  readonly ownerId: string;
  readonly markerId: string;
  readonly sourceTargetId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
}

export interface TimedMarkerEntry extends TimedMarkerSnapshot {
  readonly id: string;
  readonly clockDomain: TimedMarkerClockDomain;
  finished: boolean;
}

/** 单个实体拥有的定时标记。 */
export interface TimedMarkerState {
  readonly entries: TimedMarkerEntry[];
  nextInstanceId: number;
}

export function createTimedMarkerState(): TimedMarkerState {
  return { entries: [], nextInstanceId: 1 };
}

/** 原生终结技演出是否正在隐藏普通界面。 */
export interface UltimatePresentationState {
  inUltimateCasting: boolean;
}

/** 原生单周期计时器的数据。 */
export interface PeriodicTimerState {
  period: number;
  remaining: number;
  passed: number;
}

export function createPeriodicTimerState(): PeriodicTimerState {
  return { period: -1, remaining: -1, passed: 0 };
}

export interface OperatorResources extends Omit<
  OperatorResourceSnapshot,
  'ultimateEnergy' | 'allowedUltimateEnergyRecoveryTags'
> {
  ultimateEnergy: number;
  allowedUltimateEnergyRecoveryTags: ReadonlySet<GameplayTag> | null;
}

/** 技力、终结技能量与回能限制的数据图。 */
export interface CombatResourceState {
  sp: number;
  readonly maxSp: number;
  returnedSp: number;
  readonly spRecoveryPerSecond: number;
  readonly spRecoveryPauseDuration: number;
  spRecoveryPauseRemaining: number;
  readonly ultimateEnergySystemUnlocked: boolean;
  readonly squad: readonly OperatorResources[];
  readonly operators: Map<string, OperatorResources>;
  readonly baseUltimateRecoveryRestrictions: Map<string, ReadonlySet<GameplayTag> | null>;
  readonly ultimateRecoveryRestrictionHandles: Map<
    number,
    { readonly operatorId: string; readonly allowed: ReadonlySet<GameplayTag> }
  >;
  nextUltimateRecoveryRestrictionHandle: number;
  readonly normalSkillUltimateEnergy: NormalSkillUltimateEnergySettings;
  readonly sharedSpGainModifiers: SharedSpGainModifierState;
  readonly sharedSpRecoveryModifiers: SharedSpRecoveryModifierState;
}

/** 实体生命、失衡、恢复计时器和生命下限句柄。 */
export interface CombatVitalsState {
  health: number;
  poise: number;
  poiseImmune: boolean;
  stopPoiseRecovery: boolean;
  hasPoiseBrokenTag: boolean;
  readonly maxHealth: number;
  readonly maxPoise: number;
  readonly poiseRecoveryTime: number;
  readonly poiseRecoveryTimeMultiplier: number;
  readonly poiseBrokenEndTime: number;
  readonly poiseRecoveryTimer: PeriodicTimerState;
  readonly poiseBrokenEndTimer: PeriodicTimerState;
  readonly healthFloors: Map<number, number>;
  nextHealthFloorId: number;
}

export interface OrdinaryKnockDownState {
  active: boolean;
  readonly timer: PeriodicTimerState;
}

export function createOrdinaryKnockDownState(): OrdinaryKnockDownState {
  return { active: false, timer: createPeriodicTimerState() };
}

export interface TimeDilationSource {
  readonly sourceId: string;
  readonly sourceActionId: string;
  readonly sourceCastId?: string;
}

export interface TimeDilationInstanceSnapshot {
  readonly id: number;
  readonly durationSeconds: number;
  readonly elapsedSeconds: number;
  readonly slot: string;
  readonly priority: number;
  readonly currentScale: number;
  readonly source?: TimeDilationSource;
}

export interface MutableTimeDilationInstance extends TimeDilationInstanceSnapshot {
  elapsedSeconds: number;
  currentScale: number;
  active: boolean;
}

export interface GlobalTimeDilationInstance extends MutableTimeDilationInstance {
  readonly curveId?: number;
  readonly constantScale?: number;
  readonly influenceSkillCooldownSeconds?: number;
  readonly ignoredOperatorIds: ReadonlySet<string>;
}

export interface EntityTimeDilationInstance extends MutableTimeDilationInstance {
  readonly entityId: string;
  readonly curveId: number;
  readonly lifetimeUsesGlobalScale: boolean;
}

/** 全局和实体时间膨胀实例及累计时间。 */
export interface TimeDilationState {
  readonly globalInstances: GlobalTimeDilationInstance[];
  readonly entityInstances: EntityTimeDilationInstance[];
  readonly ignoreGlobalTimeScaleEntityIds: Set<string>;
  nextInstanceId: number;
  globalScaledTime: number;
}

export function createTimeDilationState(): TimeDilationState {
  return {
    globalInstances: [],
    entityInstances: [],
    ignoreGlobalTimeScaleEntityIds: new Set(),
    nextInstanceId: 0,
    globalScaledTime: 0,
  };
}

/** onPostSkillTryCastRequest 的稳定监听登记顺序。 */
export interface PostSkillRequestListenerState {
  nextRegistrationId: number;
  readonly registrationsByOwner: Map<string, number[]>;
}

export function createPostSkillRequestListenerState(): PostSkillRequestListenerState {
  return { nextRegistrationId: 0, registrationsByOwner: new Map() };
}

/** 标准敌我战斗环境使用的可变数据。 */
export interface StandardCombatEnvironmentState {
  readonly random: SimulationRandomState | null;
  readonly enemyVitals: CombatVitalsState;
  readonly operatorVitals: Map<string, CombatVitalsState>;
  readonly reactions: Map<ElementalReaction, ElementalReactionState>;
  readonly knockDown: OrdinaryKnockDownState | null;
  readonly buffProgress: BuffProgressRecorderState;
  readonly poiseBreakBuffs: Set<number>;
  readonly postSkillRequestListeners: PostSkillRequestListenerState;
}

/** 一组连续技能输入当前消费到的位置。 */
export interface SkillInputGroupRuntimeState {
  readonly anchorCastId: string;
  nextIndex: number;
  previous: ScheduledSkillInput | null;
  stopped: boolean;
}

/** 固定技能输入、自动顺延输入和连续组的消费游标。 */
export interface CombatInputRuntimeState {
  nextInputIndex: number;
  previousFixedInput: ScheduledSkillInput | null;
  readonly continuation: {
    nextIndex: number;
    previous: ScheduledSkillInput | null;
    stopped: boolean;
  };
  readonly groups: SkillInputGroupRuntimeState[];
}

/** 外部战斗事件当前消费到的位置。 */
export interface ExternalCombatEventRuntimeState {
  nextEventIndex: number;
  previousEvent: ScheduledExternalCombatEventInput | null;
}

/** 所有干员和动态实例共享的战斗数据。 */
export interface CombatSharedState {
  readonly clock: CombatClockState;
  readonly resources: CombatResourceState;
  readonly timeDilation: TimeDilationState | null;
  readonly comboWindows: ComboWindowState;
  readonly ultimatePresentation: UltimatePresentationState;
  readonly globalCooldowns: GlobalCooldownState;
  readonly basicAttackInheritance: SkillCastInheritanceState;
  readonly identities: {
    readonly abilityEntities: AbilityEntityInstanceIdState;
    readonly skillCasts: SkillCastIdState;
  };
}
