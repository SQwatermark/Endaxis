/**
 * 将已解析资源和已编译技能组装成一次可执行的战斗运行时。
 * 这里只负责依赖接线与原生阶段顺序，不解析存档，也不为还没做通的战斗操作提供默认行为。
 */
import type {
  CompiledComboSkillRegistration,
  CompiledOperatorInitializationProgram,
  CompiledOperatorPassiveProgram,
  CompiledOperatorUpgradeEventProgram,
  CompiledSkillSlotGroup,
  CompiledSkillProgram,
  ResolvedAbilityEntityDefinition,
  ResolvedSkillBuffDefinition,
} from '../../compiler/combatProgram';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import type {
  BuffApplicationTarget,
  CombatStepParameters,
  CombatTarget,
  DamageElement,
  SkillType,
} from '../../game-data/operatorDefinition';
import type { EnemyRank } from '../../game-data/enemyRank';
import { CombatReceiptCollector, type CombatReceiptSink } from '../receipt/combatReceipt';
import { gameplayTagId } from '../tags/gameplayTags';
import { AbilitySystemRuntime, type PostSkillCastRequest } from './abilitySystemRuntime';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';
import { ActionBlackboard } from './actionBlackboard';
import {
  BuffOperationExecutor,
  type BuffApplicationHandle,
  type BuffLifecycleOperationSource,
  type BuffOperationTarget,
} from './buffOperationExecutor';
import { CombatClock, COMBAT_FRAME_INTERVAL, COMBAT_FRAMES_PER_SECOND } from './combatClock';
import { CombatInputRuntime, type ScheduledSkillInput } from './combatInputRuntime';
import { CombatResourceRuntime } from './combatResourceRuntime';
import { CombatResources, type CombatResourceSnapshot } from './combatResources';
import { CombatSimulation, type FrameRuntime } from './combatSimulation';
import { SkillResourceOperationExecutor } from './skillResourceOperationExecutor';
import {
  SkillRuntime,
  type CombatAbilitySkillEvent,
  type CombatOperationExecutor,
} from './skillRuntime';
import { SkillCastIdAllocator } from './skillCastInfo';
import { OperatorControlConditionExecutor } from './operatorControlConditionExecutor';
import { StatusOperationExecutor } from './statusOperationExecutor';
import { CombatStatusContainer } from '../status/combatStatuses';
import { CombatStatusRuntime } from './combatStatusRuntime';
import type { CombatVitals } from './combatVitals';
import type { PlayerDamageDefenderSnapshot } from '../damage/playerActiveDamageInput';
import { CombatVitalsConditionExecutor } from './combatVitalsConditionExecutor';
import { EnemyRankConditionExecutor } from './enemyRankConditionExecutor';
import { EnemySuperArmorConditionExecutor } from './enemySuperArmorConditionExecutor';
import { CameraTargetAngleConditionExecutor } from './cameraTargetAngleConditionExecutor';
import { TimedMarkerContainer } from './timedMarkers';
import { TimedMarkerOperationExecutor } from './timedMarkerOperationExecutor';
import { ComboWindowRuntime } from './comboWindowRuntime';
import { ComboWindowOperationExecutor } from './comboWindowOperationExecutor';
import { CombatSemanticEventRuntime, type CombatSemanticEvent } from './combatSemanticEventRuntime';
import {
  EquipmentEventRuntime,
  type RegisterEquipmentAbilityEventAction,
  type EquipmentEventExecutionContext,
} from './equipmentEventRuntime';
import { ComboSkillRegistrationRuntime } from './comboSkillRegistrationRuntime';
import { OperatorUpgradeEventRuntime } from './operatorUpgradeEventRuntime';
import {
  TimeDilationRuntime,
  type AbilityTickDeltas,
  type TimeDilationEndReason,
  type TimeDilationInstanceKind,
  type TimeDilationInstanceSnapshot,
  type TimeDilationRuntimeConfig,
} from './timeDilationRuntime';
import { TimeDilationOperationExecutor } from './timeDilationOperationExecutor';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { ActionSequence } from '../actions/actionSequence';
import { SkillCooldown } from './skillCooldown';
import { SkillSlotOperationExecutor } from './skillSlotOperationExecutor';
import { SkillCooldownOperationExecutor } from './skillCooldownOperationExecutor';
import { CombatSemanticOutputOperationExecutor } from './combatSemanticOutputOperationExecutor';
import { logicalAbilityEntityRuntimeId } from '../../game-data/logicalAbilityEntity';
import { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import { AbilityEntityOperationExecutor } from './abilityEntityOperationExecutor';
import { TargetContextOperationExecutor } from './targetContextOperationExecutor';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import {
  ExternalCombatEventRuntime,
  type ScheduledExternalCombatEventInput,
} from './externalCombatEventRuntime';
import type { ProbabilitySampleSource } from '../random/probabilitySampleSource';

/** 同一干员在一场战斗中唯一的 Buff 状态与实体黑板所有者。 */
export type OperatorBuffRuntime = FrameRuntime &
  BuffOperationTarget & {
    readonly entityBlackboard?: ActionBlackboard;
    advanceWithDeltas?(deltas: AbilityTickDeltas): void;
  };

/** 一个干员按原生技能定义顺序进入运行时的完整程序。 */
export interface CombatOperatorProgram {
  readonly operatorId: string;
  /** CharacterTable.charTypeId 的一一映射；仅角色类型筛选实际出现时要求提供。 */
  readonly characterTypeId?: DamageElement;
  readonly skills: readonly CompiledSkillProgram[];
  /** 与技能等级解耦的干员附属 Buff 蓝图；不含任何单次模拟实例状态。 */
  readonly buffDefinitions?: Readonly<Record<string, ResolvedSkillBuffDefinition>>;
  /** Buff 生命周期直接引用的、同样与技能等级解耦的能力实体闭包。 */
  readonly abilityEntityDefinitions?: Readonly<Record<string, ResolvedAbilityEntityDefinition>>;
  /** 稳定技能组的基础形态与不可直接放置的运行时替换形态。 */
  readonly skillSlotGroups?: readonly CompiledSkillSlotGroup[];
  /** 构筑启用的养成初始化行为；在 Buff 生命周期装配后执行一次。 */
  readonly initializationPrograms?: readonly CompiledOperatorInitializationProgram[];
  /** 构筑启用的常驻被动；按声明顺序在战斗装配完成后启用一次。 */
  readonly passivePrograms?: readonly CompiledOperatorPassiveProgram[];
  /** 构筑启用的养成事件监听器；按养成声明顺序注册到数据动作阶段。 */
  readonly upgradeEventPrograms?: readonly CompiledOperatorUpgradeEventProgram[];
  /** 角色进入战斗时注册的首段连携入口；与时间轴上放置了多少技能块无关。 */
  readonly comboSkillRegistrations?: readonly CompiledComboSkillRegistration[];
  /** 已按当前构筑等级和装备者主副属性解析的静态装备贡献。 */
  readonly equipmentContributions?: readonly CompiledEquipmentContribution[];
  /** 场景编译入口提供的静态面板；底层运行时单元测试可按需省略。 */
  readonly panel?: ResolvedOperatorPanel;
  /** 已由场景编译器从静态构筑条件求值；运行时只负责在技能创建前安装。 */
  readonly initialEntityBlackboard?: Readonly<Record<string, number>>;
  /** 同一实例既参与原生帧阶段，也承载该干员可被技能查询的 Buff。 */
  readonly buffRuntime?: OperatorBuffRuntime;
  /** 通用语义状态与 Buff 分属两个显式所有者；容器只在本次模拟中使用。 */
  readonly statusContainer?: CombatStatusContainer;
  readonly actionRuntime?: FrameRuntime;
}

/** 敌方 Buff 既是技能查询目标，也是必须随战斗时钟推进的实体运行时。 */
export interface EnemyBuffRuntime extends FrameRuntime, BuffOperationTarget {
  advanceWithDeltas?(deltas: AbilityTickDeltas): void;
}

/** 动态能力实体独占的 Buff 所有者；生命周期使用该实体的四路时间增量。 */
export interface AbilityEntityBuffRuntime extends BuffOperationTarget {
  advanceWithDeltas(deltas: AbilityTickDeltas): void;
  finishAll(reason?: BuffFinishReason): number;
}

/** 项目敌人进入运行时的静态输入；所有字段均来自项目实例而非定义回查。 */
export interface CombatEnemyProgram {
  readonly source:
    | { readonly kind: 'prefab'; readonly enemyId: string; readonly level: number }
    | { readonly kind: 'custom'; readonly level: number };
  readonly rank: EnemyRank;
  readonly health: number;
  readonly superArmor: number;
  readonly defenderAttributes: PlayerDamageDefenderSnapshot;
  /** 节点阈值已进入运行时程序；节点 Buff 的执行仍待接入统一事件系统。 */
  readonly stagger: {
    readonly maximum: number;
    readonly knotThresholds: readonly number[];
    readonly knotBreakDurationFrames: number;
    readonly brokenDurationFrames: number;
    readonly finisherSpRecovery: number;
  };
}

/** 非资源操作执行器工厂能够读取的稳定运行时依赖。 */
export interface CombatOperationExecutorContext {
  readonly program: CompiledSkillProgram;
  readonly enemy: CombatEnemyProgram;
  readonly equipmentContributions: readonly CompiledEquipmentContribution[];
  readonly panel?: ResolvedOperatorPanel;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  /** 全场唯一的语义事件中心；执行器只报告已完成的战斗事实。 */
  readonly semanticEvents: CombatSemanticEventRuntime;
}

/** 装配根在任何开局程序执行前交给外部战斗环境的一次性运行时上下文。 */
export interface CombatBattleRuntimeContext {
  readonly enemy: CombatEnemyProgram;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
}

/** 外部环境完成绑定后才可创建、需要由装配根逐帧推进的运行时。 */
export interface BoundCombatBattleRuntimes {
  readonly enemyVitalsRuntime?: (FrameRuntime & { advance?(deltaSeconds: number): void }) | null;
}

/** 配装事件中未被通用执行器消费的操作，由环境按明确来源决定是否支持。 */
export interface EquipmentEventOperationExecutorContext extends EquipmentEventExecutionContext {
  readonly enemy: CombatEnemyProgram;
  readonly panel?: ResolvedOperatorPanel;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  readonly semanticEvents: CombatSemanticEventRuntime;
}

/** HP 伤害共用末端，但配装来源不能冒充主动技能程序。 */
export type CombatDamageExecutorContext =
  CombatOperationExecutorContext | EquipmentEventOperationExecutorContext;

export interface CombatRuntimeAssemblyOptions {
  readonly resources: CombatResourceSnapshot;
  /** RandomUtil.Dice 使用的独立样本源；只有实际执行概率条件时才要求存在。 */
  readonly probabilitySamples?: ProbabilitySampleSource;
  /** StoreAttributeValue 的动态来源属性读取端口；只有技能实际使用时才要求提供。 */
  readonly readSourceAttributeValue?: (
    sourceId: string,
    request: CombatStepParameters['storeSourceAttributeValue'],
  ) => number;
  /** 由场景敌人实例编译得到，操作执行器不得另行读取定义默认值。 */
  readonly enemy: CombatEnemyProgram;
  /** 必须先于养成初始化和常驻被动执行，使帧 0 行为拥有同一时钟、回执和资源账本。 */
  readonly bindBattleRuntime?: (
    context: CombatBattleRuntimeContext,
  ) => BoundCombatBattleRuntimes | void;
  /** 当前单敌人模型中的目标 Buff 查询端口。 */
  readonly enemyBuffRuntime: EnemyBuffRuntime;
  /** 缺省表示场景不启用时间膨胀；存在相关技能步骤时必须配置。 */
  readonly timeDilation?: {
    readonly config: TimeDilationRuntimeConfig;
    readonly timeManagerDeltaMode: number;
  };
  /**
   * 敌人生命与失衡账本的逐帧推进器；由环境创建并交给装配根，装配层不猜测推进顺序。
   * `null` 表示环境没有绑定敌人（例如空场景），装配根会跳过注册。
   */
  readonly enemyVitalsRuntime?:
    (FrameRuntime & { advance?(deltaSeconds: number): void }) | null; /**
   * 为没有显式 `buffRuntime` 绑定的干员创建本场战斗唯一的 Buff runtime。
   * 伤害环境与技能操作必须共享该实例，不能各自维护同一干员的 Buff 状态。
   */
  readonly createOperatorBuffRuntime?: (
    operatorId: string,
    panel?: ResolvedOperatorPanel,
  ) => OperatorBuffRuntime;
  /** 按每次回能时的 Buff 属性状态解析 UltimateSpGainScalar。 */
  readonly resolveUltimateEnergyGainMultiplier?: (operatorId: string) => number;
  /** 仅在能力实体首次成为 Buff 目标时创建，返回值必须由该实例独占。 */
  readonly createAbilityEntityBuffRuntime?: (
    entityId: string,
    entityBlackboard: ActionBlackboard,
    target: RuntimeTargetRef,
  ) => AbilityEntityBuffRuntime;
  readonly enemyStatusContainer?: CombatStatusContainer;
  /** 顺序应来自已解析队伍/实体启动结果，装配器不会自行排序。 */
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs?: readonly ScheduledSkillInput[];
  /** 时间轴显式输入的受击事实；不执行敌方伤害或生命扣减。 */
  readonly externalEvents?: readonly ScheduledExternalCombatEventInput[];
  /**
   * 按模拟帧查询干员是否为当前主控。仅在技能实际包含主控条件时才会调用；
   * 项目编译层必须依据控制切换时间线提供实现，装配层不会猜测初始主控。
   */
  readonly isOperatorControlled?: (operatorId: string, frame: number) => boolean;
  /**
   * 返回本次模拟中的生命账本。只有技能包含生命条件时才会调用；
   * `operatorId` 用于解析 caster，enemy 则指向当前单敌人。
   */
  readonly resolveVitals?: (
    target: Extract<
      import('../../game-data/operatorDefinition').CombatCondition,
      { kind: 'healthCompare' }
    >['target'],
    operatorId: string,
    buffSourceId?: string,
  ) => CombatVitals;
  /** 按稳定干员 ID 返回生命账本，供队伍生命比例选择器使用。 */
  readonly resolveOperatorVitals?: (operatorId: string) => CombatVitals;
  /**
   * 返回处理伤害、Buff、附着和条件等职责的后续执行器。
   * 共享技力与战技扣费转能由装配器统一包在该执行器外层。
   */
  readonly createOperationExecutor: (
    context: CombatOperationExecutorContext,
  ) => CombatOperationExecutor;
  /** 已闭环的 AbilitySystem 同步事件。 */
  readonly emitAbilityEvent?: (
    entityId: string,
    event:
      | 'beforeCastSkill'
      | 'afterSkillApplyCost'
      | 'skillEnd'
      | 'ownerHpZero'
      | 'beforeOutputPhysicalInfliction'
      | 'afterOutputPhysicalInfliction',
    payload:
      | {
          readonly sourceId: string;
          readonly targetId: string;
          readonly skillType: SkillType;
          readonly skillId: string;
          readonly skillCastId: number;
          readonly attachBuffToCurrentSkill?: CombatAbilitySkillEvent['attachBuffToCurrentSkill'];
        }
      | {
          readonly sourceId: string;
          readonly targetId: string;
        },
  ) => void;
  /** 所有开局附着 Buff 注册完成后，为每名干员发布一次本场入战事实。 */
  readonly emitOperatorEnterFight?: (operatorId: string) => void;
  /** 外部受击标记只向 Ability 监听器陈述事实，不执行敌方行为或生命变化。 */
  readonly emitExternalOperatorHit?: (
    operatorId: string,
    payload: {
      readonly sourceId: 'enemy';
      readonly targetId: string;
      readonly damageType?: import('../../game-data/operatorDefinition').DamageType;
      readonly tags: readonly import('../../game-data/operatorDefinition').DamageTag[];
      readonly features: readonly import('../../game-data/operatorDefinition').DamageFeature[];
    },
  ) => void;
  /** 显式补入敌方弱点窗口回投给攻击者的事件，不创建敌方弱点状态。 */
  readonly emitExternalOperatorWeaknessTriggeredOutput?: (operatorId: string) => void;
  /** 仅在存在配装事件处理器时需要；不得通过伪造技能程序复用技能末端执行器。 */
  readonly createEquipmentEventOperationExecutor?: (
    context: EquipmentEventOperationExecutorContext,
  ) => CombatOperationExecutor;
  /** 配装原生 AbilitySystem 事件的注册端口；仅有语义事件的旧定义不需要。 */
  readonly registerEquipmentAbilityEventAction?: RegisterEquipmentAbilityEventAction;
  /** 原生立即连携入口；普通窗口连携不依赖此端口。 */
  readonly castComboSkillImmediately?: (operatorId: string, skillKey: string) => void;
  readonly receipt?: CombatReceiptCollector;
}

const unsupportedReactiveTerminal: CombatOperationExecutor = {
  execute(step): boolean {
    throw new Error(`reactive event handler does not support '${step.kind}'`);
  },
  evaluate(condition): boolean {
    throw new Error(`reactive event handler cannot evaluate '${condition.kind}'`);
  },
};

/** 一次战斗的时钟、账本、实体能力系统与回执的唯一装配根。 */
export class CombatRuntimeAssembly {
  readonly #options: CombatRuntimeAssemblyOptions;
  readonly clock = new CombatClock();
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptCollector;
  /** 全场唯一的连携窗口队列；诊断和投影应读取它，不得自行重算窗口顺序。 */
  readonly comboWindows: ComboWindowRuntime;
  /** 配装、连携和养成监听器共用的语义事件中心。 */
  readonly semanticEvents = new CombatSemanticEventRuntime();
  readonly timeDilation: TimeDilationRuntime | null;
  /** 按实际战斗帧驱动各个运行时；每个对象自行消费对应的局部 delta。 */
  readonly simulation = new CombatSimulation(this.clock);
  /** 全场唯一的零空间能力实体实例目录。 */
  readonly abilityEntities: LogicalAbilityEntityRuntime;
  /** 实际运行时干员；Buff 生命周期按宿主切换执行身份时复用其构筑与面板。 */
  readonly #operators = new Map<string, CombatOperatorProgram>();
  readonly #abilitySystems = new Map<string, AbilitySystemRuntime>();
  readonly #skillPrograms = new Map<string, CompiledSkillProgram>();
  readonly #enemyBuffRuntime: EnemyBuffRuntime;
  readonly #operatorBuffs = new Map<string, BuffOperationTarget>();
  readonly #abilityEntityBuffs = new Map<number, AbilityEntityBuffRuntime>();
  readonly #operatorOrder: string[] = [];
  readonly #enemyStatuses?: CombatStatusRuntime;
  readonly #operatorStatuses = new Map<string, CombatStatusRuntime>();
  readonly #enemyTimedMarkers = new TimedMarkerContainer('enemy', this.clock);
  readonly #operatorTimedMarkers = new Map<string, TimedMarkerContainer>();
  readonly #skillCastIds = new SkillCastIdAllocator();
  /** 同一干员同一技能的所有放置块共用一份冷却事实。 */
  readonly #skillCooldowns = new Map<
    string,
    {
      readonly cooldown: SkillCooldown;
      readonly periodFrames?: number;
      readonly commitFrame?: number;
    }
  >();
  readonly #equipmentEventRuntimes = new Map<string, EquipmentEventRuntime>();
  readonly #operatorUpgradeEventRuntimes: OperatorUpgradeEventRuntime[] = [];
  readonly #comboSkillRegistrationRuntimes: ComboSkillRegistrationRuntime[] = [];
  /** 保留常驻监听步骤的所有者，便于后续补充场景卸载时的对称注销。 */
  readonly #passiveSequences: ActionSequence[] = [];
  /** 不依赖施法实例的 Buff 生命周期按动作身份回到原解释链。 */
  readonly #reactiveOperationBindings = new Map<string, CombatOperationExecutor>();
  readonly #castOperationBindings = new Map<
    string,
    readonly {
      readonly operator: CombatOperatorProgram;
      readonly program: CompiledSkillProgram;
      readonly statusRuntime?: CombatStatusRuntime;
    }[]
  >();

  constructor(options: CombatRuntimeAssemblyOptions) {
    this.#options = options;
    this.resources = new CombatResources(options.resources, {
      ultimateEnergyGainMultiplier: options.resolveUltimateEnergyGainMultiplier,
    });
    this.receipt = options.receipt ?? new CombatReceiptCollector();
    const boundBattleRuntimes =
      options.bindBattleRuntime?.({
        enemy: options.enemy,
        clock: this.clock,
        resources: this.resources,
        receipt: this.receipt,
      }) ?? {};
    this.timeDilation =
      options.timeDilation === undefined
        ? null
        : new TimeDilationRuntime(options.timeDilation.config, {
            started: (kind, instance, entityId) =>
              this.#recordTimeDilation('TimeDilationStarted', kind, instance, entityId),
            rejected: (kind, instance, entityId) =>
              this.#recordTimeDilation('TimeDilationRejected', kind, instance, entityId),
            ended: (kind, instance, reason, entityId) =>
              this.#recordTimeDilation('TimeDilationEnded', kind, instance, entityId, reason),
          });
    this.abilityEntities = new LogicalAbilityEntityRuntime({
      resolveDeltaSeconds: entity =>
        COMBAT_FRAME_INTERVAL *
        (this.timeDilation?.getEntityScale(logicalAbilityEntityRuntimeId(entity.instanceId)) ?? 1),
      hooks: {
        spawned: entity =>
          this.receipt.record({
            frame: this.clock.frame,
            time: this.clock.time,
            event: 'AbilityEntitySpawned',
            sourceId: entity.ownerId,
            targetId: logicalAbilityEntityRuntimeId(entity.instanceId),
            data: {
              abilityEntityId: entity.abilityEntityId,
              childSkillId: entity.childSkillId ?? null,
              remainingDurationSeconds: entity.remainingDurationSeconds,
            },
          }),
        childSkillRequested: (entity, childSkillId) =>
          this.receipt.record({
            frame: this.clock.frame,
            time: this.clock.time,
            event: 'AbilityEntityChildSkillRequested',
            sourceId: entity.ownerId,
            targetId: logicalAbilityEntityRuntimeId(entity.instanceId),
            data: { abilityEntityId: entity.abilityEntityId, childSkillId },
          }),
        finished: (entity, reason) => {
          if (reason === 'durationExpired' || reason === 'explicit') {
            const entityId = logicalAbilityEntityRuntimeId(entity.instanceId);
            this.#options.emitAbilityEvent?.(entityId, 'ownerHpZero', {
              sourceId: entityId,
              targetId: entityId,
            });
          }
          const buffRuntime = this.#abilityEntityBuffs.get(entity.instanceId);
          if (buffRuntime !== undefined) {
            buffRuntime.finishAll('other');
            this.#abilityEntityBuffs.delete(entity.instanceId);
          }
          this.receipt.record({
            frame: this.clock.frame,
            time: this.clock.time,
            event: 'AbilityEntityFinished',
            sourceId: entity.ownerId,
            targetId: logicalAbilityEntityRuntimeId(entity.instanceId),
            data: { abilityEntityId: entity.abilityEntityId, reason },
          });
        },
      },
    });
    this.comboWindows = new ComboWindowRuntime(
      this.clock,
      this.receipt,
      options.operators.map(operator => operator.operatorId),
    );
    if (options.enemyBuffRuntime.ownerId !== 'enemy') {
      throw new Error(`enemy Buff runtime owner must be 'enemy'`);
    }
    this.#enemyBuffRuntime = options.enemyBuffRuntime;
    this.#enemyStatuses =
      options.enemyStatusContainer === undefined
        ? undefined
        : new CombatStatusRuntime(options.enemyStatusContainer, this.clock, this.receipt);

    for (const operator of options.operators) {
      if (this.#abilitySystems.has(operator.operatorId)) {
        throw new Error(`duplicate combat operator '${operator.operatorId}'`);
      }
      const buffRuntime =
        operator.buffRuntime ??
        options.createOperatorBuffRuntime?.(operator.operatorId, operator.panel);
      const runtimeOperator =
        buffRuntime === operator.buffRuntime ? operator : { ...operator, buffRuntime };
      this.#operators.set(operator.operatorId, runtimeOperator);
      const entityBlackboard = buffRuntime?.entityBlackboard ?? new ActionBlackboard();
      entityBlackboard.assign(operator.initialEntityBlackboard);
      this.#operatorOrder.push(operator.operatorId);
      if (buffRuntime !== undefined) {
        this.#operatorBuffs.set(operator.operatorId, buffRuntime);
      }
      this.#operatorTimedMarkers.set(
        operator.operatorId,
        new TimedMarkerContainer(operator.operatorId, this.clock),
      );
      const statusRuntime =
        operator.statusContainer === undefined
          ? undefined
          : new CombatStatusRuntime(operator.statusContainer, this.clock, this.receipt);
      if (
        operator.statusContainer !== undefined &&
        operator.statusContainer.ownerId !== operator.operatorId
      ) {
        throw new Error(
          `status owner '${operator.statusContainer.ownerId}' does not match operator '${operator.operatorId}'`,
        );
      }
      if (statusRuntime !== undefined) {
        this.#operatorStatuses.set(operator.operatorId, statusRuntime);
      }
      for (const program of runtimeOperator.skills) {
        const programKey = `${operator.operatorId}\u0000${program.skillId}\u0000${program.castId ?? ''}`;
        if (this.#skillPrograms.has(programKey)) {
          throw new Error(`duplicate combat skill program '${programKey}'`);
        }
        this.#skillPrograms.set(programKey, program);
        if (program.castId === undefined) continue;
        const bindings = this.#castOperationBindings.get(program.castId) ?? [];
        if (bindings.some(binding => binding.program.skillId === program.skillId)) {
          throw new Error(
            `duplicate combat skill cast variant '${program.castId}/${program.skillId}'`,
          );
        }
        this.#castOperationBindings.set(program.castId, [
          ...bindings,
          {
            operator: runtimeOperator,
            program,
            ...(statusRuntime === undefined ? {} : { statusRuntime }),
          },
        ]);
      }
      const skills = runtimeOperator.skills.map(program =>
        this.#createSkillRuntime(
          runtimeOperator,
          program,
          options.enemy,
          entityBlackboard,
          statusRuntime,
          options.createOperationExecutor,
          options.isOperatorControlled,
          options.resolveVitals,
          options.resolveOperatorVitals,
        ),
      );
      this.#abilitySystems.set(
        operator.operatorId,
        new AbilitySystemRuntime({
          buffRuntime,
          skills,
          skillSlotGroups: runtimeOperator.skillSlotGroups,
          actionRuntime: operator.actionRuntime,
          beforePostSkillCastStart: request =>
            this.#prepareSkillStart(operator.operatorId, request.skillId, request.castId),
          resolveActualFrame: () => this.clock.frame,
          onSkillOperableBoundaryReached: fact =>
            this.receipt.record({
              frame: fact.actualEndFrame,
              time: fact.actualEndFrame / COMBAT_FRAMES_PER_SECOND,
              event: 'SkillOperableBoundaryReached',
              sourceId: operator.operatorId,
              data: {
                castId: fact.castId,
                durationFrames: fact.durationFrames,
              },
            }),
          ...(this.timeDilation === null
            ? {}
            : {
                resolveTickDeltas: () =>
                  this.timeDilation!.getAbilityTickDeltas(
                    operator.operatorId,
                    COMBAT_FRAME_INTERVAL,
                    options.timeDilation!.timeManagerDeltaMode,
                  ),
              }),
        }),
      );
    }

    for (const operator of options.operators) {
      const contributions = operator.equipmentContributions ?? [];
      const hasEvents = contributions.some(contribution => contribution.eventHandlers.length > 0);
      if (
        !hasEvents &&
        !contributions.some(contribution => contribution.initializationSequence !== undefined)
      )
        continue;
      if (hasEvents && options.createEquipmentEventOperationExecutor === undefined) {
        throw new Error(
          `operator '${operator.operatorId}' has equipment event handlers but no equipment event executor`,
        );
      }
      this.#equipmentEventRuntimes.set(
        operator.operatorId,
        new EquipmentEventRuntime(
          this.semanticEvents,
          operator.operatorId,
          contributions,
          context => this.#createEquipmentEventOperationChain(operator, context, options),
          options.registerEquipmentAbilityEventAction,
        ),
      );
    }

    for (const operator of options.operators) {
      const programs = operator.upgradeEventPrograms ?? [];
      if (programs.length === 0) continue;
      this.#operatorUpgradeEventRuntimes.push(
        new OperatorUpgradeEventRuntime(
          this.semanticEvents,
          operator.operatorId,
          programs,
          context =>
            this.#createReactiveOperationChain(
              operator,
              `upgrade-event:${context.programKey}`,
              this.#createReactiveTerminal(
                operator,
                `upgrade-event:${context.programKey}`,
                options,
              ),
              options,
            ),
        ),
      );
    }

    for (const operator of options.operators) {
      const registrations = operator.comboSkillRegistrations ?? [];
      if (registrations.length === 0) continue;
      this.#comboSkillRegistrationRuntimes.push(
        new ComboSkillRegistrationRuntime({
          operatorId: operator.operatorId,
          registrations,
          semanticEvents: this.semanticEvents,
          comboWindows: this.comboWindows,
          createOperations: () =>
            this.#createReactiveOperationChain(
              operator,
              `combo-registration:${operator.operatorId}`,
              unsupportedReactiveTerminal,
              options,
            ),
          ...(options.castComboSkillImmediately === undefined
            ? {}
            : { castImmediately: options.castComboSkillImmediately }),
        }),
      );
    }

    const configureBuffLifecycle = (target: BuffOperationTarget): void => {
      target.configureLifecycleOperations?.(source =>
        this.#createBuffLifecycleOperationChain(source, options),
      );
      target.configureBuffAppliedObserver?.(event =>
        this.semanticEvents.emit({ kind: 'buffApplied', ...event }),
      );
      target.configureBuffConsumedObserver?.(event =>
        this.semanticEvents.emit({ kind: 'buffConsumed', ...event }),
      );
      target.configureSemanticEventAction?.((event, priority, handle) =>
        this.semanticEvents.register({
          ownerOperatorId: target.ownerId,
          trigger:
            event === 'afterKillEntity'
              ? { kind: 'enemyDefeated', scope: 'operator' }
              : event === 'outputKnockDown'
                ? { kind: 'knockDownOutput' }
                : event === 'afterOutputPhysicalInfliction'
                  ? {
                      kind: 'physicalInflictionApplied',
                      types: ['airborne', 'knockDown', 'fracture', 'crush'],
                      scope: 'operator',
                    }
                  : event === 'skillSpGained'
                    ? { kind: 'spGained', source: 'skill', gainKind: 'gain' }
                    : { kind: 'buffConsumed' },
          phase: 'dataAction',
          priority,
          handle: context => {
            if (
              (event === 'afterKillEntity' && context.event.kind !== 'enemyDefeated') ||
              (event === 'outputKnockDown' && context.event.kind !== 'knockDownOutput') ||
              (event === 'afterOutputPhysicalInfliction' &&
                context.event.kind !== 'physicalInflictionApplied') ||
              (event === 'skillSpGained' && context.event.kind !== 'spGained') ||
              (event === 'buffConsumed' && context.event.kind !== 'buffConsumed')
            ) {
              throw new Error(`${event} Buff listener received an invalid event`);
            }
            handle(
              context.event as Extract<
                CombatSemanticEvent,
                {
                  readonly kind:
                    | 'enemyDefeated'
                    | 'knockDownOutput'
                    | 'physicalInflictionApplied'
                    | 'spGained'
                    | 'buffConsumed';
                }
              >,
            );
          },
        }),
      );
    };
    configureBuffLifecycle(this.#enemyBuffRuntime);
    for (const target of this.#operatorBuffs.values()) configureBuffLifecycle(target);

    // 养成直接附着 Buff 与原生被动都必须晚于实体和 Buff 生命周期装配。
    for (const operator of options.operators) {
      for (const initialization of operator.initializationPrograms ?? []) {
        const operations = this.#createReactiveOperationChain(
          operator,
          `upgrade-initialization:${initialization.key}`,
          this.#createReactiveTerminal(
            operator,
            `upgrade-initialization:${initialization.key}`,
            options,
          ),
          options,
        );
        const runtime = new CombatActionSequenceRuntime(
          operations,
          {
            blackboard: new ActionBlackboard(initialization.initialBlackboard),
            actionOwnerId: operator.operatorId,
            ...(initialization.equipmentContributionIndex === undefined
              ? {}
              : {
                  actionSourceId: operator.operatorId,
                  addAbilityChildBuff: (child: BuffApplicationHandle) => {
                    const ability = this.#equipmentEventRuntimes.get(operator.operatorId);
                    if (ability === undefined)
                      throw new Error(
                        `operator '${operator.operatorId}' has no equipment Ability runtime`,
                      );
                    ability.addChildBuff(initialization.equipmentContributionIndex!, child);
                  },
                }),
          },
          {},
          this.semanticEvents,
          operator.operatorId,
        );
        const sequence = runtime.createSequence(initialization.sequence);
        sequence.executeInstant({});
        this.#passiveSequences.push(sequence);
        this.receipt.record({
          frame: this.clock.frame,
          time: this.clock.time,
          event: 'OperatorUpgradeInitialized',
          sourceId: operator.operatorId,
          data: { key: initialization.key },
        });
      }
      for (const passive of operator.passivePrograms ?? []) {
        const blackboard = new ActionBlackboard(passive.initialBlackboard);
        const operations = this.#createReactiveOperationChain(
          operator,
          `passive:${passive.key}`,
          this.#createReactiveTerminal(operator, `passive:${passive.key}`, options),
          options,
        );
        const runtime = new CombatActionSequenceRuntime(
          operations,
          { blackboard },
          {},
          this.semanticEvents,
          operator.operatorId,
        );
        const sequence = runtime.createSequence(passive.enableSequence);
        if (!sequence.tryExecute({})) {
          throw new Error(`passive skill '${passive.key}' enable sequence returned false`);
        }
        this.#passiveSequences.push(sequence);
        this.receipt.record({
          frame: this.clock.frame,
          time: this.clock.time,
          event: 'PassiveSkillEnabled',
          sourceId: operator.operatorId,
          data: { passiveKey: passive.key },
        });
      }
    }

    // 原生 OnEnterFight 晚于开局常驻 Buff 的创建与事件注册；本模型一场模拟只入战一次。
    for (const operator of options.operators) {
      options.emitOperatorEnterFight?.(operator.operatorId);
    }

    if (this.timeDilation !== null) this.simulation.add(this.timeDilation);
    this.simulation.add(new CombatResourceRuntime(this.resources, this.clock, this.receipt));
    // 能力实体到期先于本帧输入和技能动作；新生成实例从下一帧开始扣减时长。
    this.simulation.add(this.abilityEntities);
    this.simulation.add({
      advanceFrame: () => {
        for (const [instanceId, runtime] of this.#abilityEntityBuffs) {
          const target = { kind: 'abilityEntity' as const, instanceId };
          if (!this.abilityEntities.isActive(target)) continue;
          const entityId = logicalAbilityEntityRuntimeId(instanceId);
          runtime.advanceWithDeltas(
            this.timeDilation === null
              ? {
                  defaultDeltaSeconds: COMBAT_FRAME_INTERVAL,
                  globalScaledDeltaSeconds: COMBAT_FRAME_INTERVAL,
                  selfScaledDeltaSeconds: COMBAT_FRAME_INTERVAL,
                  skillCooldownDeltaSeconds: COMBAT_FRAME_INTERVAL,
                }
              : this.timeDilation.getAbilityTickDeltas(
                  entityId,
                  COMBAT_FRAME_INTERVAL,
                  options.timeDilation!.timeManagerDeltaMode,
                ),
          );
        }
      },
    });
    // 敌方 Buff 与干员 AbilitySystem 中的 Buff 一样，在本帧技能动作前推进生命周期。
    this.simulation.add({
      advanceFrame: () => {
        if (this.timeDilation === null || this.#enemyBuffRuntime.advanceWithDeltas === undefined) {
          this.#enemyBuffRuntime.advanceFrame();
          return;
        }
        this.#enemyBuffRuntime.advanceWithDeltas(
          this.timeDilation.getAbilityTickDeltas(
            'enemy',
            COMBAT_FRAME_INTERVAL,
            options.timeDilation!.timeManagerDeltaMode,
          ),
        );
      },
    });
    // 失衡恢复计时与状态到期一样，在本帧输入和技能动作前推进。
    const enemyVitalsRuntime = boundBattleRuntimes.enemyVitalsRuntime ?? options.enemyVitalsRuntime;
    if (enemyVitalsRuntime !== undefined && enemyVitalsRuntime !== null) {
      this.simulation.add({
        advanceFrame: () => {
          if (this.timeDilation === null || enemyVitalsRuntime.advance === undefined) {
            enemyVitalsRuntime.advanceFrame();
            return;
          }
          enemyVitalsRuntime.advance(COMBAT_FRAME_INTERVAL * this.timeDilation.currentGlobalScale);
        },
      });
    }
    // 状态到期先于本帧输入和技能动作结算；同一所有者内按状态插入顺序处理。
    if (this.#enemyStatuses !== undefined) this.simulation.add(this.#enemyStatuses);
    for (const operator of options.operators) {
      const statusRuntime = this.#operatorStatuses.get(operator.operatorId);
      if (statusRuntime !== undefined) this.simulation.add(statusRuntime);
    }
    // 先扣减未暂停候选的剩余时间，再处理本帧输入；归零的候选不能被本帧输入消费。
    this.simulation.add(this.comboWindows);
    const inputRuntime = new CombatInputRuntime({
      clock: this.clock,
      inputs: options.inputs ?? [],
      receipt: this.receipt,
      tryStartSkill: (operatorId, skillId, castId) =>
        this.tryStartSkill(operatorId, skillId, castId),
    });
    this.simulation.add(inputRuntime);
    for (const operator of options.operators) {
      this.simulation.add(this.#requireAbilitySystem(operator.operatorId));
    }
    const externalEvents = new ExternalCombatEventRuntime({
      clock: this.clock,
      events: options.externalEvents ?? [],
      semanticEvents: this.semanticEvents,
      emitOperatorHitAbilityEvent: options.emitExternalOperatorHit,
      emitOperatorWeaknessTriggeredOutput: options.emitExternalOperatorWeaknessTriggeredOutput,
      receipt: this.receipt,
    });
    // 外部事实晚于同帧技能动作：第 0 帧启用的临时监听器也能接收第 0 帧标记。
    this.simulation.add(externalEvents);
    inputRuntime.applyCurrentFrame();
    externalEvents.applyCurrentFrame();
  }

  tryStartSkill(operatorId: string, skillId: string, castId?: string): boolean {
    const ability = this.#requireAbilitySystem(operatorId);
    if (!ability.canStartSkill(skillId, castId)) return false;
    this.#prepareSkillStart(operatorId, skillId, castId);
    return ability.tryStartSkill(skillId, castId);
  }

  #prepareSkillStart(operatorId: string, skillId: string, castId?: string): void {
    const ability = this.#requireAbilitySystem(operatorId);
    const skillCastId = this.#skillCastIds.allocate();
    ability.prepareSkillCastId(skillId, castId, skillCastId);
    const program = this.#skillPrograms.get(`${operatorId}\u0000${skillId}\u0000${castId ?? ''}`);
    if (program?.skillType === 'comboSkill') {
      const result = this.comboWindows.consume(operatorId, skillId);
      if (result.consumed) {
        ability.prepareSkillStartBlackboard(skillId, castId, result.window.blackboard);
      } else {
        const invalidCastBlackboard = this.#operators
          .get(operatorId)
          ?.comboSkillRegistrations?.find(
            registration => registration.skillKey === skillId,
          )?.invalidCastBlackboard;
        if (invalidCastBlackboard !== undefined && Object.keys(invalidCastBlackboard).length > 0) {
          ability.prepareSkillStartBlackboard(skillId, castId, invalidCastBlackboard);
        }
        this.receipt.record({
          frame: this.clock.frame,
          time: this.clock.time,
          event: 'ComboWindowUnavailableAtStart',
          sourceId: operatorId,
          data: {
            skillId,
            ...(castId === undefined ? {} : { castId }),
            reason: result.reason,
            expectedOperatorId: result.expected?.operatorId ?? null,
            expectedSkillId: result.expected?.nextSkillKey ?? null,
          },
        });
      }
    }
    if (program !== undefined) {
      this.#options.emitAbilityEvent?.(operatorId, 'beforeCastSkill', {
        sourceId: operatorId,
        targetId: operatorId,
        skillType: program.skillType,
        skillId: program.sourceSkillId ?? program.skillId,
        skillCastId,
        attachBuffToCurrentSkill: (buff: BuffApplicationHandle) =>
          ability.attachBuffToSkillCast(skillId, castId, skillCastId, buff),
      });
    }
  }

  requestPostSkillCast(operatorId: string, request: PostSkillCastRequest): void {
    this.#requireAbilitySystem(operatorId).requestPostSkillCast(request);
  }

  advanceFrame(): void {
    this.simulation.advanceFrame();
  }

  advanceFrames(count: number): void {
    this.simulation.advanceFrames(count);
  }

  #createSkillRuntime(
    operator: CombatOperatorProgram,
    program: CompiledSkillProgram,
    enemy: CombatEnemyProgram,
    entityBlackboard: ActionBlackboard,
    statusRuntime: CombatStatusRuntime | undefined,
    createDelegate: CombatRuntimeAssemblyOptions['createOperationExecutor'],
    isOperatorControlled: CombatRuntimeAssemblyOptions['isOperatorControlled'],
    resolveVitals: CombatRuntimeAssemblyOptions['resolveVitals'],
    resolveOperatorVitals: CombatRuntimeAssemblyOptions['resolveOperatorVitals'],
  ): SkillRuntime {
    const operatorId = operator.operatorId;
    if (program.operatorId !== operatorId) {
      throw new Error(
        `skill '${program.skillId}' belongs to '${program.operatorId}', expected '${operatorId}'`,
      );
    }

    let runtime: SkillRuntime;
    const operations = this.#createOperationChain({
      operator,
      program,
      enemy,
      statusRuntime,
      createDelegate,
      isOperatorControlled,
      resolveVitals,
      resolveOperatorVitals,
      getNonReturnedSpCost: () => runtime.nonReturnedSpCost,
    });
    const cooldownBinding = this.#resolveSkillCooldown(operator, program);
    runtime = new SkillRuntime(program, {
      clock: this.clock,
      resources: this.resources,
      resolveCosts: costs =>
        costs.map(cost =>
          cost.resource === 'sp'
            ? {
                ...cost,
                value: Math.max(
                  0,
                  Math.fround(
                    cost.value +
                      (operator.buffRuntime?.getAttributeValue?.('AtbCostAddition') ?? 0),
                  ),
                ),
              }
            : cost,
        ),
      receipt: this.receipt,
      operations,
      allocateSkillCastId: () => this.#skillCastIds.allocate(),
      semanticEvents: this.semanticEvents,
      entityBlackboard,
      emitSkillEnd: payload => this.#options.emitAbilityEvent?.(operatorId, 'skillEnd', payload),
      emitAfterSkillApplyCost: payload =>
        this.#options.emitAbilityEvent?.(operatorId, 'afterSkillApplyCost', payload),
      ...cooldownBinding,
    });
    return runtime;
  }

  #resolveSkillCooldown(
    operator: CombatOperatorProgram,
    program: CompiledSkillProgram,
  ): { readonly cooldown?: SkillCooldown; readonly advancesCooldown?: boolean } {
    const operatorId = operator.operatorId;
    const cooldownMultiplier = (operator.panel?.combatModifiers ?? []).reduce(
      (result, modifier) =>
        modifier.kind === 'skillCooldownMultiplier' &&
        (Array.isArray(modifier.skillTypes)
          ? modifier.skillTypes.includes(program.skillType)
          : modifier.skillTypes === program.skillType)
          ? result * modifier.value
          : result,
      1,
    );
    if (!Number.isFinite(cooldownMultiplier) || cooldownMultiplier <= 0) {
      throw new RangeError(
        `skill '${program.skillId}' of '${operatorId}' has invalid cooldown multiplier ${cooldownMultiplier}`,
      );
    }
    const periodFrames =
      program.cooldownFrames === undefined
        ? undefined
        : program.cooldownFrames * cooldownMultiplier;
    const key = `${operatorId}\u0000${program.skillId}`;
    const existing = this.#skillCooldowns.get(key);
    if (existing !== undefined) {
      if (
        existing.periodFrames !== periodFrames ||
        (periodFrames !== undefined && existing.commitFrame !== program.costFrame)
      ) {
        throw new Error(
          `skill '${program.skillId}' of '${operatorId}' has inconsistent cooldown configuration`,
        );
      }
      return { cooldown: existing.cooldown, advancesCooldown: false };
    }
    const cooldown = new SkillCooldown(
      periodFrames,
      periodFrames === undefined ? undefined : program.costFrame,
    );
    this.#skillCooldowns.set(key, {
      cooldown,
      ...(periodFrames === undefined
        ? {}
        : {
            periodFrames,
            ...(program.costFrame === undefined ? {} : { commitFrame: program.costFrame }),
          }),
    });
    return { cooldown, advancesCooldown: true };
  }

  #changeSkillSlot(
    operatorId: string,
    skillGroupKey: string,
    targetSkillKey: string,
    inheritOriginSkillCooldownProgress: boolean,
  ): void {
    const abilitySystem = this.#requireAbilitySystem(operatorId);
    const previousSkillKey = abilitySystem.changeSkillSlot(skillGroupKey, targetSkillKey);
    let inheritedCooldownProgress: number | undefined;
    try {
      if (inheritOriginSkillCooldownProgress && previousSkillKey !== targetSkillKey) {
        const source = this.#skillCooldowns.get(`${operatorId}\u0000${previousSkillKey}`);
        const target = this.#skillCooldowns.get(`${operatorId}\u0000${targetSkillKey}`);
        if ((source === undefined) !== (target === undefined)) {
          throw new Error(
            `ability skill slot '${skillGroupKey}' cannot inherit cooldown from ` +
              `'${previousSkillKey}' to '${targetSkillKey}' before both skills are assembled`,
          );
        }
        if (source !== undefined && target !== undefined) {
          inheritedCooldownProgress = source.cooldown.snapshot.progress;
          target.cooldown.setProgress(inheritedCooldownProgress);
        }
      }
    } catch (error) {
      abilitySystem.changeSkillSlot(skillGroupKey, previousSkillKey);
      throw error;
    }
    this.receipt.record({
      frame: this.clock.frame,
      time: this.clock.time,
      event: 'SkillSlotChanged',
      sourceId: operatorId,
      data: {
        skillGroupKey,
        targetSkillKey,
        previousSkillKey,
        inheritOriginSkillCooldownProgress,
        ...(inheritedCooldownProgress === undefined ? {} : { inheritedCooldownProgress }),
      },
    });
  }

  #reduceSkillCooldownsByBaseDurationRatio(
    operatorId: string,
    skill: import('../../game-data/operatorDefinition').CombatStepParameters['adjustSkillCooldown']['skill'],
    ratio: number,
  ): number {
    const matchedKeys = new Set<string>();
    let changed = 0;
    for (const program of this.#skillPrograms.values()) {
      if (
        program.operatorId !== operatorId ||
        (skill.kind === 'type'
          ? program.skillType !== skill.skillType
          : program.skillId !== skill.skillId && program.sourceSkillId !== skill.skillId)
      ) {
        continue;
      }
      const key = `${operatorId}\u0000${program.skillId}`;
      if (matchedKeys.has(key)) continue;
      matchedKeys.add(key);
      if (this.#skillCooldowns.get(key)?.cooldown.reduceByBaseDurationRatio(ratio)) {
        changed += 1;
      }
    }
    return changed;
  }

  #reduceSkillCooldownsByAbsoluteFrames(
    operatorId: string,
    skill: import('../../game-data/operatorDefinition').CombatStepParameters['adjustSkillCooldown']['skill'],
    frames: number,
  ): number {
    const matchedKeys = new Set<string>();
    let changed = 0;
    for (const program of this.#skillPrograms.values()) {
      if (
        program.operatorId !== operatorId ||
        (skill.kind === 'type'
          ? program.skillType !== skill.skillType
          : program.skillId !== skill.skillId && program.sourceSkillId !== skill.skillId)
      ) {
        continue;
      }
      const key = `${operatorId}\u0000${program.skillId}`;
      if (matchedKeys.has(key)) continue;
      matchedKeys.add(key);
      if (this.#skillCooldowns.get(key)?.cooldown.reduceByFrames(frames)) changed += 1;
    }
    return changed;
  }

  #setSkillCooldowns(
    operatorId: string,
    skill: import('../../game-data/operatorDefinition').CombatStepParameters['adjustSkillCooldown']['skill'],
    value: number,
    basis: 'baseDurationRatio' | 'absoluteFrames',
  ): number {
    const matchedKeys = new Set<string>();
    let changed = 0;
    for (const program of this.#skillPrograms.values()) {
      if (
        program.operatorId !== operatorId ||
        (skill.kind === 'type'
          ? program.skillType !== skill.skillType
          : program.skillId !== skill.skillId && program.sourceSkillId !== skill.skillId)
      ) {
        continue;
      }
      const key = `${operatorId}\u0000${program.skillId}`;
      if (matchedKeys.has(key)) continue;
      matchedKeys.add(key);
      const cooldown = this.#skillCooldowns.get(key)?.cooldown;
      const didChange =
        basis === 'baseDurationRatio'
          ? cooldown?.setByBaseDurationRatio(value)
          : cooldown?.setRemainingFrames(value);
      if (didChange) changed += 1;
    }
    return changed;
  }

  #createBuffLifecycleOperationChain(
    source: BuffLifecycleOperationSource,
    options: CombatRuntimeAssemblyOptions,
  ): CombatOperationExecutor {
    const cast = source.skillCastInfo;
    const castId = cast?.originCastId ?? source.sourceActionId;
    const candidates = this.#castOperationBindings.get(castId) ?? [];
    const binding =
      cast === null
        ? candidates.length === 1
          ? candidates[0]
          : undefined
        : candidates.find(candidate => candidate.program.skillId === cast.originSkillId);
    if (binding === undefined && cast?.originCastId === undefined) {
      const operations = this.#reactiveOperationBindings.get(
        `${source.sourceId}\u0000${source.sourceActionId}`,
      );
      if (operations !== undefined) return operations;
    }
    if (binding === undefined) {
      throw new Error(`Buff lifecycle references unknown source action '${castId}'`);
    }
    if (cast !== null && binding.program.skillId !== cast.originSkillId) {
      throw new Error(
        `Buff lifecycle source '${source.sourceId}' does not match action '${castId}'`,
      );
    }
    // 干员宿主上的 Buff 生命周期相对实际宿主执行；敌方与能力实体仍沿用
    // 当前创建来源干员。施法快照只负责定位原程序，不强迫后代 Buff 继续归因原施法者。
    const ownerOperator = this.#operators.get(source.ownerId);
    const sourceOperator = this.#operators.get(source.sourceId);
    const operationOperator = ownerOperator ?? sourceOperator ?? binding.operator;
    const operationProgram =
      operationOperator.operatorId === binding.program.operatorId
        ? binding.program
        : { ...binding.program, operatorId: operationOperator.operatorId };
    return this.#createOperationChain({
      operator: operationOperator,
      definitionOperator: binding.operator,
      program: operationProgram,
      enemy: options.enemy,
      statusRuntime:
        operationOperator === binding.operator
          ? binding.statusRuntime
          : this.#operatorStatuses.get(operationOperator.operatorId),
      createDelegate: options.createOperationExecutor,
      isOperatorControlled: options.isOperatorControlled,
      resolveVitals: options.resolveVitals,
      resolveOperatorVitals: options.resolveOperatorVitals,
      getNonReturnedSpCost: () => cast?.nonReturnedSpCost ?? 0,
    });
  }

  #createOperationChain(options: {
    readonly operator: CombatOperatorProgram;
    /** 跨实体 Buff 生命周期仍从创建该定义的原始 AbilitySystem 解析后代资源。 */
    readonly definitionOperator?: CombatOperatorProgram;
    readonly program: CompiledSkillProgram;
    readonly enemy: CombatEnemyProgram;
    readonly statusRuntime?: CombatStatusRuntime;
    readonly createDelegate: CombatRuntimeAssemblyOptions['createOperationExecutor'];
    readonly isOperatorControlled: CombatRuntimeAssemblyOptions['isOperatorControlled'];
    readonly resolveVitals: CombatRuntimeAssemblyOptions['resolveVitals'];
    readonly resolveOperatorVitals: CombatRuntimeAssemblyOptions['resolveOperatorVitals'];
    readonly getNonReturnedSpCost: () => number;
  }): CombatOperationExecutor {
    const {
      operator,
      program,
      enemy,
      statusRuntime,
      createDelegate,
      isOperatorControlled,
      resolveVitals,
      resolveOperatorVitals,
      getNonReturnedSpCost,
    } = options;
    const definitionOperator = options.definitionOperator ?? operator;
    const operatorId = operator.operatorId;
    const terminalDelegate = createDelegate({
      program,
      enemy,
      equipmentContributions: operator.equipmentContributions ?? [],
      ...(operator.panel === undefined ? {} : { panel: operator.panel }),
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      semanticEvents: this.semanticEvents,
    });
    const semanticOutputDelegate = new CombatSemanticOutputOperationExecutor({
      sourceOperatorId: operatorId,
      resolveTargetId: target => (target === 'enemy' ? 'enemy' : operatorId),
      semanticEvents: this.semanticEvents,
      clock: this.clock,
      receipt: this.receipt,
      delegate: terminalDelegate,
    });
    const cooldownDelegate = new SkillCooldownOperationExecutor({
      reduceByBaseDurationRatio: (skill, ratio) =>
        this.#reduceSkillCooldownsByBaseDurationRatio(operatorId, skill, ratio),
      reduceByAbsoluteFrames: (skill, frames) =>
        this.#reduceSkillCooldownsByAbsoluteFrames(operatorId, skill, frames),
      setByBaseDurationRatio: (skill, ratio) =>
        this.#setSkillCooldowns(operatorId, skill, ratio, 'baseDurationRatio'),
      setByAbsoluteFrames: (skill, frames) =>
        this.#setSkillCooldowns(operatorId, skill, frames, 'absoluteFrames'),
      delegate: semanticOutputDelegate,
    });
    const baseDelegate = new SkillSlotOperationExecutor({
      changeSkillSlot: (skillGroupKey, targetSkillKey, inheritCooldownProgress) =>
        this.#changeSkillSlot(operatorId, skillGroupKey, targetSkillKey, inheritCooldownProgress),
      delegate: cooldownDelegate,
    });
    let rootOperations: CombatOperationExecutor | undefined;
    const targetContextOperations = new TargetContextOperationExecutor(operatorId, baseDelegate);
    const abilityEntityOperations = new AbilityEntityOperationExecutor(
      operatorId,
      this.abilityEntities,
      targetContextOperations,
      {
        resolveOperations: () => {
          if (rootOperations === undefined) {
            throw new Error('combat operation chain is not fully initialized');
          }
          return rootOperations;
        },
        semanticEvents: this.semanticEvents,
      },
      abilityEntityId =>
        program.abilityEntityDefinitions?.[abilityEntityId] ??
        definitionOperator.abilityEntityDefinitions?.[abilityEntityId],
    );
    const timeDilationOperations = this.#wrapTimeDilationOperations(
      abilityEntityOperations,
      operatorId,
      program.skillId,
      isOperatorControlled,
    );
    const buffOperations = new BuffOperationExecutor({
      sourceId: operatorId,
      sourceActionId: program.castId ?? program.skillId,
      resolveTarget: target => this.#resolveBuffTarget(target, operatorId),
      resolveApplicationTargets: target =>
        this.#resolveBuffApplicationTargets(
          target,
          operatorId,
          isOperatorControlled,
          resolveOperatorVitals,
        ),
      resolveCurrentAbilityEntityTarget: target =>
        this.#resolveAbilityEntityBuffTarget(target, this.#options),
      resolveEventTarget: targetId => this.#resolveBuffTargetById(targetId),
      resolveBuffDefinition: buffId => definitionOperator.buffDefinitions?.[buffId],
      onBuffConsumed: event => this.semanticEvents.emit({ kind: 'buffConsumed', ...event }),
      onPhysicalInflictionApplied: event =>
        this.semanticEvents.emit({ kind: 'physicalInflictionApplied', ...event }),
      onBeforeOutputPhysicalInfliction: payload =>
        this.#options.emitAbilityEvent?.(operatorId, 'beforeOutputPhysicalInfliction', payload),
      delegate: timeDilationOperations,
    });
    const statusOperations = new StatusOperationExecutor({
      sourceId: operatorId,
      sourceActionId: program.skillId,
      clock: this.clock,
      receipt: this.receipt,
      resolveTarget: target => {
        const targetRuntime = target === 'enemy' ? this.#enemyStatuses : statusRuntime;
        if (targetRuntime === undefined) {
          throw new Error(
            `combat ${target} '${target === 'enemy' ? 'enemy' : operatorId}' has no status runtime`,
          );
        }
        return targetRuntime;
      },
      delegate: buffOperations,
    });
    const timedMarkerOperations = new TimedMarkerOperationExecutor({
      resolveTarget: target =>
        target === 'enemy'
          ? this.#enemyTimedMarkers
          : this.#requireTimedMarkerContainer(operatorId),
      resolveAbilityEntityTarget: target => this.abilityEntities.timedMarkers(target),
      resolveEventTarget: targetId => this.#requireTimedMarkerContainer(targetId),
      globalClock: this.clock,
      delegate: statusOperations,
    });
    const angleConditions = new CameraTargetAngleConditionExecutor(
      program.simulationInputs?.cameraToTargetSignedAngleDegrees,
      timedMarkerOperations,
    );
    const superArmorConditions = new EnemySuperArmorConditionExecutor(
      enemy.superArmor,
      angleConditions,
    );
    const rankConditions = new EnemyRankConditionExecutor(enemy.rank, superArmorConditions);
    const vitalsConditions = new CombatVitalsConditionExecutor({
      resolveTarget: (target, buffSourceId) => {
        if (resolveVitals === undefined) {
          throw new Error(`skill '${program.skillId}' requires a combat vitals resolver`);
        }
        return resolveVitals(target, operatorId, buffSourceId);
      },
      delegate: rankConditions,
    });
    const controlConditions = new OperatorControlConditionExecutor({
      isCasterControlled: () => {
        if (isOperatorControlled === undefined) {
          throw new Error(`skill '${program.skillId}' requires the current controlled operator`);
        }
        return isOperatorControlled(operatorId, this.clock.frame);
      },
      delegate: vitalsConditions,
    });
    const comboWindowOperations = new ComboWindowOperationExecutor(
      operatorId,
      this.comboWindows,
      controlConditions,
    );
    const eventConditions = new EventContextConditionExecutor(
      comboWindowOperations,
      isOperatorControlled === undefined
        ? undefined
        : sourceId => isOperatorControlled(sourceId, this.clock.frame),
      sourceId => this.#resolveAbilitySystemSourceId(sourceId),
      (targetId, ownedTagIds, requiredTagIds, match) =>
        this.#resolveBuffTargetById(targetId).matchesTagIds!(
          ownedTagIds.map(gameplayTagId),
          requiredTagIds.map(gameplayTagId),
          match,
        ),
    );
    const delegate = new ActionBlackboardOperationExecutor(
      eventConditions,
      this.#options.probabilitySamples,
      this.#options.readSourceAttributeValue === undefined
        ? undefined
        : {
            sourceId: operator.operatorId,
            read: this.#options.readSourceAttributeValue,
          },
      ownerId => this.#abilitySystems.get(ownerId)?.currentSkillTimelineFrame,
      operator.panel?.attributes,
    );
    rootOperations = new SkillResourceOperationExecutor({
      sourceOperatorId: operatorId,
      sourceActionId: program.skillId,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      getNonReturnedSpCost,
      finisherSpRecovery: enemy.stagger.finisherSpRecovery,
      onSpGained: event => this.semanticEvents.emit({ kind: 'spGained', ...event }),
      delegate,
    });
    return rootOperations;
  }

  #createEquipmentEventOperationChain(
    operator: CombatOperatorProgram,
    source: EquipmentEventExecutionContext,
    options: CombatRuntimeAssemblyOptions,
  ): CombatOperationExecutor {
    const createTerminal = options.createEquipmentEventOperationExecutor;
    if (createTerminal === undefined) {
      throw new Error('equipment event executor is not configured');
    }
    const sourceActionId = `equipment:${source.source.kind}:${source.source.slug}:${source.handlerKey}`;
    const terminal = createTerminal({
      ...source,
      enemy: options.enemy,
      ...(operator.panel === undefined ? {} : { panel: operator.panel }),
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      semanticEvents: this.semanticEvents,
    });
    return this.#createReactiveOperationChain(operator, sourceActionId, terminal, options);
  }

  /** 常驻事件监听器共用的条件与动作解释链；来源模块只提供末端能力和归因身份。 */
  #createReactiveOperationChain(
    operator: CombatOperatorProgram,
    sourceActionId: string,
    terminal: CombatOperationExecutor,
    options: CombatRuntimeAssemblyOptions,
  ): CombatOperationExecutor {
    const operatorId = operator.operatorId;
    const semanticOutputOperations = new CombatSemanticOutputOperationExecutor({
      sourceOperatorId: operatorId,
      resolveTargetId: target => (target === 'enemy' ? 'enemy' : operatorId),
      semanticEvents: this.semanticEvents,
      clock: this.clock,
      receipt: this.receipt,
      delegate: terminal,
    });
    const cooldownOperations = new SkillCooldownOperationExecutor({
      reduceByBaseDurationRatio: (skill, ratio) =>
        this.#reduceSkillCooldownsByBaseDurationRatio(operatorId, skill, ratio),
      reduceByAbsoluteFrames: (skill, frames) =>
        this.#reduceSkillCooldownsByAbsoluteFrames(operatorId, skill, frames),
      setByBaseDurationRatio: (skill, ratio) =>
        this.#setSkillCooldowns(operatorId, skill, ratio, 'baseDurationRatio'),
      setByAbsoluteFrames: (skill, frames) =>
        this.#setSkillCooldowns(operatorId, skill, frames, 'absoluteFrames'),
      delegate: semanticOutputOperations,
    });
    const slotOperations = new SkillSlotOperationExecutor({
      changeSkillSlot: (skillGroupKey, targetSkillKey, inheritCooldownProgress) =>
        this.#changeSkillSlot(operatorId, skillGroupKey, targetSkillKey, inheritCooldownProgress),
      delegate: cooldownOperations,
    });
    let reactiveOperations: CombatOperationExecutor | undefined;
    const targetContextOperations = new TargetContextOperationExecutor(operatorId, slotOperations);
    const abilityEntityOperations = new AbilityEntityOperationExecutor(
      operatorId,
      this.abilityEntities,
      targetContextOperations,
      {
        resolveOperations: () => {
          if (reactiveOperations === undefined) {
            throw new Error('reactive combat operation chain is not fully initialized');
          }
          return reactiveOperations;
        },
        semanticEvents: this.semanticEvents,
      },
      abilityEntityId => operator.abilityEntityDefinitions?.[abilityEntityId],
    );
    const timeDilationOperations = this.#wrapTimeDilationOperations(
      abilityEntityOperations,
      operatorId,
      sourceActionId,
      options.isOperatorControlled,
    );
    const buffOperations = new BuffOperationExecutor({
      sourceId: operatorId,
      sourceActionId,
      resolveTarget: target => this.#resolveBuffTarget(target, operatorId),
      resolveApplicationTargets: target =>
        this.#resolveBuffApplicationTargets(
          target,
          operatorId,
          options.isOperatorControlled,
          options.resolveOperatorVitals,
        ),
      resolveCurrentAbilityEntityTarget: target =>
        this.#resolveAbilityEntityBuffTarget(target, options),
      resolveEventTarget: targetId => this.#resolveBuffTargetById(targetId),
      resolveBuffDefinition: buffId => operator.buffDefinitions?.[buffId],
      onBuffConsumed: event => this.semanticEvents.emit({ kind: 'buffConsumed', ...event }),
      onPhysicalInflictionApplied: event =>
        this.semanticEvents.emit({ kind: 'physicalInflictionApplied', ...event }),
      onBeforeOutputPhysicalInfliction: payload =>
        options.emitAbilityEvent?.(operatorId, 'beforeOutputPhysicalInfliction', payload),
      delegate: timeDilationOperations,
    });
    const statusRuntime = this.#operatorStatuses.get(operatorId);
    const statusOperations = new StatusOperationExecutor({
      sourceId: operatorId,
      sourceActionId,
      clock: this.clock,
      receipt: this.receipt,
      resolveTarget: target => {
        const runtime = target === 'enemy' ? this.#enemyStatuses : statusRuntime;
        if (runtime === undefined) {
          throw new Error(`reactive event target '${target}' has no status runtime`);
        }
        return runtime;
      },
      delegate: buffOperations,
    });
    const markerOperations = new TimedMarkerOperationExecutor({
      resolveTarget: target =>
        target === 'enemy'
          ? this.#enemyTimedMarkers
          : this.#requireTimedMarkerContainer(operatorId),
      resolveAbilityEntityTarget: target => this.abilityEntities.timedMarkers(target),
      resolveEventTarget: targetId => this.#requireTimedMarkerContainer(targetId),
      globalClock: this.clock,
      delegate: statusOperations,
    });
    const angleConditions = new CameraTargetAngleConditionExecutor(undefined, markerOperations);
    const superArmorConditions = new EnemySuperArmorConditionExecutor(
      options.enemy.superArmor,
      angleConditions,
    );
    const rankConditions = new EnemyRankConditionExecutor(options.enemy.rank, superArmorConditions);
    const vitalsConditions = new CombatVitalsConditionExecutor({
      resolveTarget: (target, buffSourceId) => {
        if (options.resolveVitals === undefined) {
          throw new Error(`reactive event '${sourceActionId}' requires a vitals resolver`);
        }
        return options.resolveVitals(target, operatorId, buffSourceId);
      },
      delegate: rankConditions,
    });
    const controlConditions = new OperatorControlConditionExecutor({
      isCasterControlled: () => {
        if (options.isOperatorControlled === undefined) {
          throw new Error(`reactive event '${sourceActionId}' requires control state`);
        }
        return options.isOperatorControlled(operatorId, this.clock.frame);
      },
      delegate: vitalsConditions,
    });
    const eventConditions = new EventContextConditionExecutor(
      controlConditions,
      options.isOperatorControlled === undefined
        ? undefined
        : sourceId => options.isOperatorControlled!(sourceId, this.clock.frame),
      sourceId => this.#resolveAbilitySystemSourceId(sourceId),
      (targetId, ownedTagIds, requiredTagIds, match) =>
        this.#resolveBuffTargetById(targetId).matchesTagIds!(
          ownedTagIds.map(gameplayTagId),
          requiredTagIds.map(gameplayTagId),
          match,
        ),
    );
    const blackboardOperations = new ActionBlackboardOperationExecutor(
      eventConditions,
      options.probabilitySamples,
      options.readSourceAttributeValue === undefined
        ? undefined
        : {
            sourceId: operatorId,
            read: options.readSourceAttributeValue,
          },
      undefined,
      operator.panel?.attributes,
    );
    reactiveOperations = new SkillResourceOperationExecutor({
      sourceOperatorId: operatorId,
      sourceActionId,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      getNonReturnedSpCost: () => 0,
      finisherSpRecovery: options.enemy.stagger.finisherSpRecovery,
      onSpGained: event => this.semanticEvents.emit({ kind: 'spGained', ...event }),
      delegate: blackboardOperations,
    });
    const bindingKey = `${operatorId}\u0000${sourceActionId}`;
    if (!this.#reactiveOperationBindings.has(bindingKey)) {
      this.#reactiveOperationBindings.set(bindingKey, reactiveOperations);
    }
    return reactiveOperations;
  }

  #createReactiveTerminal(
    operator: CombatOperatorProgram,
    sourceActionId: string,
    options: CombatRuntimeAssemblyOptions,
  ): CombatOperationExecutor {
    const template = operator.skills[0];
    if (template === undefined) return unsupportedReactiveTerminal;
    return options.createOperationExecutor({
      program: {
        ...template,
        castId: sourceActionId,
        skillGroupKey: '',
        skillId: sourceActionId,
        sourceSkillId: sourceActionId,
        initialBlackboard: {},
        timelineBlockFrames: 0,
        cooldownFrames: undefined,
        costFrame: undefined,
        costs: [],
        timelineActions: [],
        abilityEntityDefinitions: operator.abilityEntityDefinitions,
      },
      enemy: options.enemy,
      equipmentContributions: operator.equipmentContributions ?? [],
      ...(operator.panel === undefined ? {} : { panel: operator.panel }),
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      semanticEvents: this.semanticEvents,
    });
  }

  #requireAbilitySystem(operatorId: string): AbilitySystemRuntime {
    const abilitySystem = this.#abilitySystems.get(operatorId);
    if (abilitySystem === undefined) {
      throw new Error(`combat operator '${operatorId}' is not configured`);
    }
    return abilitySystem;
  }

  #wrapTimeDilationOperations(
    delegate: CombatOperationExecutor,
    operatorId: string,
    sourceActionId: string,
    isOperatorControlled: CombatRuntimeAssemblyOptions['isOperatorControlled'],
  ): CombatOperationExecutor {
    if (this.timeDilation === null) return delegate;
    return new TimeDilationOperationExecutor({
      runtime: this.timeDilation,
      resolveTargetIds: target => {
        if (target === 'caster') return [operatorId];
        if (target === 'enemy') return ['enemy'];
        if (isOperatorControlled === undefined) {
          throw new Error(
            `time dilation '${sourceActionId}' requires the current controlled operator`,
          );
        }
        return this.#operatorOrder.filter(candidate =>
          isOperatorControlled(candidate, this.clock.frame),
        );
      },
      resolveAbilityEntityTargetIds: query => {
        if (query.kind !== 'ownerSpawned') {
          throw new Error(`unsupported ability-entity target query '${String(query.kind)}'`);
        }
        return this.abilityEntities
          .findOwnerSpawned({
            ownerId: operatorId,
            ...(query.abilityEntityIds === undefined
              ? {}
              : { abilityEntityIds: query.abilityEntityIds }),
          })
          .map(target => {
            if (target.kind !== 'abilityEntity') {
              throw new Error('owner-spawned AbilityEntity query returned a non-entity target');
            }
            return logicalAbilityEntityRuntimeId(target.instanceId);
          });
      },
      resolveContextAbilityEntityId: instanceId => {
        const target = { kind: 'abilityEntity' as const, instanceId };
        return this.abilityEntities.isActive(target)
          ? logicalAbilityEntityRuntimeId(instanceId)
          : null;
      },
      sourceId: operatorId,
      sourceActionId,
      delegate,
    });
  }

  #recordTimeDilation(
    event: 'TimeDilationStarted' | 'TimeDilationRejected' | 'TimeDilationEnded',
    kind: TimeDilationInstanceKind,
    instance: TimeDilationInstanceSnapshot,
    entityId?: string,
    reason?: TimeDilationEndReason,
  ): void {
    this.receipt.record({
      frame: this.clock.frame,
      time: this.clock.time,
      event,
      ...(instance.source?.sourceId === undefined ? {} : { sourceId: instance.source.sourceId }),
      ...(entityId === undefined ? {} : { targetId: entityId }),
      data: {
        instanceId: instance.id,
        kind,
        durationSeconds: instance.durationSeconds,
        slot: instance.slot,
        priority: instance.priority,
        currentScale: instance.currentScale,
        ...(instance.source?.sourceActionId === undefined
          ? {}
          : { sourceActionId: instance.source.sourceActionId }),
        ...(instance.source?.sourceCastId === undefined
          ? {}
          : { sourceCastId: instance.source.sourceCastId }),
        ...(reason === undefined ? {} : { reason }),
      },
    });
  }

  #requireTimedMarkerContainer(operatorId: string): TimedMarkerContainer {
    const container = this.#operatorTimedMarkers.get(operatorId);
    if (container === undefined) {
      throw new Error(`combat operator '${operatorId}' has no timed marker container`);
    }
    return container;
  }

  #resolveBuffTarget(target: CombatTarget, operatorId: string): BuffOperationTarget {
    if (target === 'enemy') return this.#enemyBuffRuntime;
    const casterBuffs = this.#operatorBuffs.get(operatorId);
    if (casterBuffs === undefined) {
      throw new Error(`combat operator '${operatorId}' has no Buff operation target`);
    }
    return casterBuffs;
  }

  #resolveBuffTargetById(targetId: string): BuffOperationTarget {
    if (targetId === 'enemy') return this.#enemyBuffRuntime;
    const abilityEntityMatch = /^ability-entity:(\d+)$/.exec(targetId);
    if (abilityEntityMatch !== null) {
      return this.#resolveAbilityEntityBuffTarget(
        { kind: 'abilityEntity', instanceId: Number(abilityEntityMatch[1]) },
        this.#options,
      );
    }
    const target = this.#operatorBuffs.get(targetId);
    if (target === undefined) {
      throw new Error(`combat entity '${targetId}' has no Buff operation target`);
    }
    return target;
  }

  #resolveAbilitySystemSourceId(entityId: string): string {
    const match = /^ability-entity:(\d+)$/.exec(entityId);
    if (match === null) return entityId;
    const source = this.abilityEntities.snapshot({
      kind: 'abilityEntity',
      instanceId: Number(match[1]),
    }).source;
    if (source.kind === 'operator') return source.operatorId;
    if (source.kind === 'enemy') return 'enemy';
    return logicalAbilityEntityRuntimeId(source.instanceId);
  }

  #resolveAbilityEntityBuffTarget(
    target: RuntimeTargetRef,
    options: CombatRuntimeAssemblyOptions,
  ): AbilityEntityBuffRuntime {
    if (target.kind !== 'abilityEntity' || !this.abilityEntities.isActive(target)) {
      throw new Error('current Buff target is not an active AbilityEntity');
    }
    let runtime = this.#abilityEntityBuffs.get(target.instanceId);
    if (runtime !== undefined) return runtime;
    const create = options.createAbilityEntityBuffRuntime;
    if (create === undefined) {
      throw new Error('AbilityEntity Buff runtime is not configured');
    }
    runtime = create(
      logicalAbilityEntityRuntimeId(target.instanceId),
      this.abilityEntities.entityBlackboard(target),
      target,
    );
    if (runtime.ownerId !== logicalAbilityEntityRuntimeId(target.instanceId)) {
      throw new Error(
        `AbilityEntity Buff owner '${runtime.ownerId}' does not match instance '${target.instanceId}'`,
      );
    }
    runtime.configureLifecycleOperations?.(source =>
      this.#createBuffLifecycleOperationChain(source, options),
    );
    runtime.configureBuffAppliedObserver?.(event =>
      this.semanticEvents.emit({ kind: 'buffApplied', ...event }),
    );
    runtime.configureBuffConsumedObserver?.(event =>
      this.semanticEvents.emit({ kind: 'buffConsumed', ...event }),
    );
    runtime.configureSemanticEventAction?.((event, priority, handle) =>
      this.semanticEvents.register({
        ownerOperatorId: runtime!.ownerId,
        trigger:
          event === 'afterKillEntity'
            ? { kind: 'enemyDefeated', scope: 'operator' }
            : event === 'outputKnockDown'
              ? { kind: 'knockDownOutput' }
              : event === 'afterOutputPhysicalInfliction'
                ? {
                    kind: 'physicalInflictionApplied',
                    types: ['airborne', 'knockDown', 'fracture', 'crush'],
                    scope: 'operator',
                  }
                : event === 'skillSpGained'
                  ? { kind: 'spGained', source: 'skill', gainKind: 'gain' }
                  : { kind: 'buffConsumed' },
        phase: 'dataAction',
        priority,
        handle: context => {
          if (
            (event === 'afterKillEntity' && context.event.kind !== 'enemyDefeated') ||
            (event === 'outputKnockDown' && context.event.kind !== 'knockDownOutput') ||
            (event === 'afterOutputPhysicalInfliction' &&
              context.event.kind !== 'physicalInflictionApplied') ||
            (event === 'skillSpGained' && context.event.kind !== 'spGained') ||
            (event === 'buffConsumed' && context.event.kind !== 'buffConsumed')
          ) {
            throw new Error(`${event} Buff listener received an invalid event`);
          }
          handle(
            context.event as Extract<
              CombatSemanticEvent,
              {
                readonly kind:
                  | 'enemyDefeated'
                  | 'knockDownOutput'
                  | 'physicalInflictionApplied'
                  | 'spGained'
                  | 'buffConsumed';
              }
            >,
          );
        },
      }),
    );
    this.#abilityEntityBuffs.set(target.instanceId, runtime);
    return runtime;
  }

  #requirePartyBuffTargets(excludedOperatorId?: string): readonly BuffOperationTarget[] {
    // 当前不结算队员死亡，已装配干员即存活队伍；逆序保持原生 CharacterTeamFinder 的遍历顺序。
    return [...this.#operatorOrder]
      .reverse()
      .filter(operatorId => operatorId !== excludedOperatorId)
      .map(operatorId => {
        const target = this.#operatorBuffs.get(operatorId);
        if (target === undefined) {
          throw new Error(`combat operator '${operatorId}' has no Buff operation target`);
        }
        return target;
      });
  }

  #resolveBuffApplicationTargets(
    target: Exclude<BuffApplicationTarget, 'currentAbilityEntity'>,
    casterId: string,
    isOperatorControlled: CombatRuntimeAssemblyOptions['isOperatorControlled'],
    resolveOperatorVitals: CombatRuntimeAssemblyOptions['resolveOperatorVitals'],
  ): readonly BuffOperationTarget[] {
    if (
      target === 'eventTarget' ||
      target === 'eventSource' ||
      target === 'buffOwner' ||
      target === 'buffSource'
    ) {
      throw new Error(`${target} must be resolved from the active operation context`);
    }
    if (target === 'party' || target === 'partyExceptCaster') {
      return this.#requirePartyBuffTargets(target === 'partyExceptCaster' ? casterId : undefined);
    }
    if (target === 'partyExceptCasterAndSameCharacterType') {
      const casterType = this.#operators.get(casterId)?.characterTypeId;
      if (casterType === undefined) {
        throw new Error(`combat operator '${casterId}' has no character type identity`);
      }
      const targets = [...this.#operatorOrder]
        .reverse()
        .filter(
          operatorId =>
            operatorId !== casterId &&
            this.#operators.get(operatorId)?.characterTypeId !== casterType,
        );
      return targets.map(operatorId => {
        const resolved = this.#operatorBuffs.get(operatorId);
        if (resolved === undefined) {
          throw new Error(`combat operator '${operatorId}' has no Buff operation target`);
        }
        return resolved;
      });
    }
    if (
      target !== 'controlledOperator' &&
      target !== 'casterAndControlledOperator' &&
      target !== 'casterAndLowestHealthRatioOperatorExceptCaster'
    ) {
      return [this.#resolveBuffTarget(target, casterId)];
    }
    let selectedId: string;
    if (target === 'controlledOperator' || target === 'casterAndControlledOperator') {
      if (isOperatorControlled === undefined) {
        throw new Error(`Buff target '${target}' requires the scenario control timeline`);
      }
      const controlled = this.#operatorOrder.filter(operatorId =>
        isOperatorControlled(operatorId, this.clock.frame),
      );
      if (controlled.length !== 1) {
        throw new Error(`Buff target '${target}' requires exactly one controlled operator`);
      }
      selectedId = controlled[0]!;
    } else {
      const candidates = [...this.#operatorOrder].reverse().filter(id => id !== casterId);
      // Native MergeTargetAction merges the selected teammate group with Owner.
      // An empty teammate group still leaves the caster; there is no health read.
      if (candidates.length === 0) {
        return [this.#resolveBuffTarget('caster', casterId)];
      }
      if (resolveOperatorVitals === undefined) {
        throw new Error(`Buff target '${target}' requires operator health ledgers`);
      }
      selectedId = candidates[0]!;
      for (const candidateId of candidates.slice(1)) {
        const candidate = resolveOperatorVitals(candidateId);
        const selected = resolveOperatorVitals(selectedId);
        if (candidate.health / candidate.maxHealth < selected.health / selected.maxHealth) {
          selectedId = candidateId;
        }
      }
    }
    const selectedIds =
      target === 'controlledOperator' ? [selectedId] : [...new Set([casterId, selectedId])];
    return selectedIds.map(operatorId => {
      const runtime = this.#operatorBuffs.get(operatorId);
      if (runtime === undefined) {
        throw new Error(`combat operator '${operatorId}' has no Buff operation target`);
      }
      return runtime;
    });
  }
}
