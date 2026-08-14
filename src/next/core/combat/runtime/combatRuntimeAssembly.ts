/**
 * 将已解析资源和已编译技能组装成一次可执行的战斗运行时。
 * 这里只负责依赖接线与原生阶段顺序，不解析存档，也不为还没做通的战斗操作提供默认行为。
 */
import type {
  CompiledComboSkillRegistration,
  CompiledSkillProgram,
} from '../../compiler/combatProgram';
import type { CompiledEquipmentContribution } from '../../compiler/compileEquipment';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import type { CombatTarget } from '../../game-data/operatorDefinition';
import { CombatReceiptCollector, type CombatReceiptSink } from '../receipt/combatReceipt';
import { AbilitySystemRuntime, type PostSkillCastRequest } from './abilitySystemRuntime';
import { ActionBlackboardOperationExecutor } from './actionBlackboardOperationExecutor';
import { EventContextConditionExecutor } from './eventContextConditionExecutor';
import { ActionBlackboard } from './actionBlackboard';
import {
  BuffOperationExecutor,
  type BuffLifecycleOperationSource,
  type BuffOperationTarget,
} from './buffOperationExecutor';
import { CombatClock } from './combatClock';
import { CombatInputRuntime, type ScheduledSkillInput } from './combatInputRuntime';
import { CombatResourceRuntime } from './combatResourceRuntime';
import { CombatResources, type CombatResourceSnapshot } from './combatResources';
import { CombatSimulation, type FrameRuntime } from './combatSimulation';
import { SkillResourceOperationExecutor } from './skillResourceOperationExecutor';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';
import { SkillCastIdAllocator } from './skillCastInfo';
import { OperatorControlConditionExecutor } from './operatorControlConditionExecutor';
import { StatusOperationExecutor } from './statusOperationExecutor';
import { CombatStatusContainer } from '../status/combatStatuses';
import { CombatStatusRuntime } from './combatStatusRuntime';
import type { CombatVitals } from './combatVitals';
import type { PlayerDamageDefenderSnapshot } from '../damage/playerActiveDamageInput';
import { CombatVitalsConditionExecutor } from './combatVitalsConditionExecutor';
import { TimedMarkerContainer } from './timedMarkers';
import { TimedMarkerOperationExecutor } from './timedMarkerOperationExecutor';
import { ComboWindowRuntime } from './comboWindowRuntime';
import { ComboWindowOperationExecutor } from './comboWindowOperationExecutor';
import { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import {
  EquipmentEventRuntime,
  type EquipmentEventExecutionContext,
} from './equipmentEventRuntime';
import { ComboSkillRegistrationRuntime } from './comboSkillRegistrationRuntime';

/** 同一干员在一场战斗中唯一的 Buff 状态与实体黑板所有者。 */
export type OperatorBuffRuntime = FrameRuntime &
  BuffOperationTarget & { readonly entityBlackboard?: ActionBlackboard };

/** 一个干员按原生技能定义顺序进入运行时的完整程序。 */
export interface CombatOperatorProgram {
  readonly operatorId: string;
  readonly skills: readonly CompiledSkillProgram[];
  /** 角色进入战斗时注册的首段连携入口；与时间轴上放置了多少技能块无关。 */
  readonly comboSkillRegistrations?: readonly CompiledComboSkillRegistration[];
  /** 已按当前构筑等级和装备者主副属性解析的静态装备贡献。 */
  readonly equipmentContributions?: readonly CompiledEquipmentContribution[];
  /** 场景编译入口提供的静态面板；底层运行时单元测试可按需省略。 */
  readonly panel?: ResolvedOperatorPanel;
  /** 同一实例既参与原生帧阶段，也承载该干员可被技能查询的 Buff。 */
  readonly buffRuntime?: OperatorBuffRuntime;
  /** 通用语义状态与 Buff 分属两个显式所有者；容器只在本次模拟中使用。 */
  readonly statusContainer?: CombatStatusContainer;
  readonly actionRuntime?: FrameRuntime;
}

/** 敌方 Buff 既是技能查询目标，也是必须随战斗时钟推进的实体运行时。 */
export interface EnemyBuffRuntime extends FrameRuntime, BuffOperationTarget {}

/** 项目敌人进入运行时的静态输入；所有字段均来自项目实例而非定义回查。 */
export interface CombatEnemyProgram {
  readonly source:
    | { readonly kind: 'prefab'; readonly enemyId: string; readonly level: number }
    | { readonly kind: 'custom'; readonly level: number };
  readonly health: number;
  readonly superArmor: number;
  readonly defenderAttributes: PlayerDamageDefenderSnapshot;
  /** 多节点失衡尚未接入 `CombatVitals`，因此保留项目帧制原值供后续运行时消费。 */
  readonly stagger: {
    readonly maximum: number;
    readonly nodeCount: number;
    readonly nodeDurationFrames: number;
    readonly brokenDurationFrames: number;
    readonly finisherRecovery: number;
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

/** 配装事件中未被通用执行器消费的操作，由环境按明确来源决定是否支持。 */
export interface EquipmentEventOperationExecutorContext extends EquipmentEventExecutionContext {
  readonly enemy: CombatEnemyProgram;
  readonly panel?: ResolvedOperatorPanel;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  readonly semanticEvents: CombatSemanticEventRuntime;
}

export interface CombatRuntimeAssemblyOptions {
  readonly resources: CombatResourceSnapshot;
  /** 由场景敌人实例编译得到，操作执行器不得另行读取定义默认值。 */
  readonly enemy: CombatEnemyProgram;
  /** 当前单敌人模型中的目标 Buff 查询端口。 */
  readonly enemyBuffRuntime: EnemyBuffRuntime;
  /**
   * 敌人生命与失衡账本的逐帧推进器；由环境创建并交给装配根，装配层不猜测推进顺序。
   * `null` 表示环境没有绑定敌人（例如空场景），装配根会跳过注册。
   */
  readonly enemyVitalsRuntime?: FrameRuntime | null; /**
   * 为没有显式 `buffRuntime` 绑定的干员创建本场战斗唯一的 Buff runtime。
   * 伤害环境与技能操作必须共享该实例，不能各自维护同一干员的 Buff 状态。
   */
  readonly createOperatorBuffRuntime?: (operatorId: string) => OperatorBuffRuntime;
  readonly enemyStatusContainer?: CombatStatusContainer;
  /** 顺序应来自已解析队伍/实体启动结果，装配器不会自行排序。 */
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs?: readonly ScheduledSkillInput[];
  /**
   * 按模拟帧查询干员是否为当前主控。仅在技能实际包含主控条件时才会调用；
   * 项目编译层必须依据控制切换时间线提供实现，装配层不会猜测初始主控。
   */
  readonly isOperatorControlled?: (operatorId: string, frame: number) => boolean;
  /**
   * 返回本次模拟中的生命账本。只有技能包含生命条件时才会调用；
   * `operatorId` 用于解析 caster，enemy 则指向当前单敌人。
   */
  readonly resolveVitals?: (target: CombatTarget, operatorId: string) => CombatVitals;
  /**
   * 返回处理伤害、Buff、附着和条件等职责的后续执行器。
   * 共享技力与战技扣费转能由装配器统一包在该执行器外层。
   */
  readonly createOperationExecutor: (
    context: CombatOperationExecutorContext,
  ) => CombatOperationExecutor;
  /** 仅在存在配装事件处理器时需要；不得通过伪造技能程序复用技能末端执行器。 */
  readonly createEquipmentEventOperationExecutor?: (
    context: EquipmentEventOperationExecutorContext,
  ) => CombatOperationExecutor;
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
  readonly clock = new CombatClock();
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptCollector;
  /** 全场唯一的连携窗口队列；诊断和投影应读取它，不得自行重算窗口顺序。 */
  readonly comboWindows: ComboWindowRuntime;
  /** 配装、连携和养成监听器共用的语义事件中心。 */
  readonly semanticEvents = new CombatSemanticEventRuntime();
  readonly simulation = new CombatSimulation(this.clock);
  readonly #abilitySystems = new Map<string, AbilitySystemRuntime>();
  readonly #skillPrograms = new Map<string, CompiledSkillProgram>();
  readonly #enemyBuffRuntime: EnemyBuffRuntime;
  readonly #operatorBuffs = new Map<string, BuffOperationTarget>();
  readonly #operatorOrder: string[] = [];
  readonly #enemyStatuses?: CombatStatusRuntime;
  readonly #operatorStatuses = new Map<string, CombatStatusRuntime>();
  readonly #enemyTimedMarkers = new TimedMarkerContainer('enemy', this.clock);
  readonly #operatorTimedMarkers = new Map<string, TimedMarkerContainer>();
  readonly #skillCastIds = new SkillCastIdAllocator();
  readonly #equipmentEventRuntimes: EquipmentEventRuntime[] = [];
  readonly #comboSkillRegistrationRuntimes: ComboSkillRegistrationRuntime[] = [];
  readonly #castOperationBindings = new Map<
    string,
    {
      readonly operator: CombatOperatorProgram;
      readonly program: CompiledSkillProgram;
      readonly statusRuntime?: CombatStatusRuntime;
    }
  >();

  constructor(options: CombatRuntimeAssemblyOptions) {
    this.resources = new CombatResources(options.resources);
    this.receipt = options.receipt ?? new CombatReceiptCollector();
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
        operator.buffRuntime ?? options.createOperatorBuffRuntime?.(operator.operatorId);
      const runtimeOperator =
        buffRuntime === operator.buffRuntime ? operator : { ...operator, buffRuntime };
      const entityBlackboard = buffRuntime?.entityBlackboard ?? new ActionBlackboard();
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
        if (this.#castOperationBindings.has(program.castId)) {
          throw new Error(`duplicate combat skill cast '${program.castId}'`);
        }
        this.#castOperationBindings.set(program.castId, {
          operator: runtimeOperator,
          program,
          ...(statusRuntime === undefined ? {} : { statusRuntime }),
        });
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
        ),
      );
      this.#abilitySystems.set(
        operator.operatorId,
        new AbilitySystemRuntime({
          buffRuntime,
          skills,
          actionRuntime: operator.actionRuntime,
        }),
      );
    }

    for (const operator of options.operators) {
      const contributions = operator.equipmentContributions ?? [];
      if (!contributions.some(contribution => contribution.eventHandlers.length > 0)) continue;
      if (options.createEquipmentEventOperationExecutor === undefined) {
        throw new Error(
          `operator '${operator.operatorId}' has equipment event handlers but no equipment event executor`,
        );
      }
      this.#equipmentEventRuntimes.push(
        new EquipmentEventRuntime(
          this.semanticEvents,
          operator.operatorId,
          contributions,
          context => this.#createEquipmentEventOperationChain(operator, context, options),
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
    };
    configureBuffLifecycle(this.#enemyBuffRuntime);
    for (const target of this.#operatorBuffs.values()) configureBuffLifecycle(target);

    this.simulation.add(new CombatResourceRuntime(this.resources, this.clock, this.receipt));
    // 敌方 Buff 与干员 AbilitySystem 中的 Buff 一样，在本帧技能动作前推进生命周期。
    this.simulation.add(this.#enemyBuffRuntime);
    // 失衡恢复计时与状态到期一样，在本帧输入和技能动作前推进。
    if (options.enemyVitalsRuntime !== undefined && options.enemyVitalsRuntime !== null) {
      this.simulation.add(options.enemyVitalsRuntime);
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
    inputRuntime.applyCurrentFrame();
  }

  tryStartSkill(operatorId: string, skillId: string, castId?: string): boolean {
    const ability = this.#requireAbilitySystem(operatorId);
    if (!ability.canStartSkill(skillId, castId)) return false;
    const program = this.#skillPrograms.get(`${operatorId}\u0000${skillId}\u0000${castId ?? ''}`);
    if (program?.skillType === 'comboSkill') {
      const result = this.comboWindows.consume(operatorId, skillId);
      if (result.consumed) {
        ability.prepareSkillStartBlackboard(skillId, castId, result.window.blackboard);
      } else {
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
    return ability.tryStartSkill(skillId, castId);
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
      getNonReturnedSpCost: () => runtime.nonReturnedSpCost,
    });
    runtime = new SkillRuntime(program, {
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      operations,
      allocateSkillCastId: () => this.#skillCastIds.allocate(),
      semanticEvents: this.semanticEvents,
      entityBlackboard,
    });
    return runtime;
  }

  #createBuffLifecycleOperationChain(
    source: BuffLifecycleOperationSource,
    options: CombatRuntimeAssemblyOptions,
  ): CombatOperationExecutor {
    const cast = source.skillCastInfo;
    if (cast?.originCastId === undefined) {
      throw new Error(
        `Buff lifecycle from '${source.sourceId}' requires inherited timeline skill-cast info`,
      );
    }
    const binding = this.#castOperationBindings.get(cast.originCastId);
    if (binding === undefined) {
      throw new Error(`Buff lifecycle references unknown skill cast '${cast.originCastId}'`);
    }
    if (
      binding.operator.operatorId !== source.sourceId ||
      binding.program.skillId !== cast.originSkillId
    ) {
      throw new Error(
        `Buff lifecycle source '${source.sourceId}' does not match skill cast '${cast.originCastId}'`,
      );
    }
    return this.#createOperationChain({
      operator: binding.operator,
      program: binding.program,
      enemy: options.enemy,
      statusRuntime: binding.statusRuntime,
      createDelegate: options.createOperationExecutor,
      isOperatorControlled: options.isOperatorControlled,
      resolveVitals: options.resolveVitals,
      getNonReturnedSpCost: () => cast.nonReturnedSpCost,
    });
  }

  #createOperationChain(options: {
    readonly operator: CombatOperatorProgram;
    readonly program: CompiledSkillProgram;
    readonly enemy: CombatEnemyProgram;
    readonly statusRuntime?: CombatStatusRuntime;
    readonly createDelegate: CombatRuntimeAssemblyOptions['createOperationExecutor'];
    readonly isOperatorControlled: CombatRuntimeAssemblyOptions['isOperatorControlled'];
    readonly resolveVitals: CombatRuntimeAssemblyOptions['resolveVitals'];
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
      getNonReturnedSpCost,
    } = options;
    const operatorId = operator.operatorId;
    const baseDelegate = createDelegate({
      program,
      enemy,
      equipmentContributions: operator.equipmentContributions ?? [],
      ...(operator.panel === undefined ? {} : { panel: operator.panel }),
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      semanticEvents: this.semanticEvents,
    });
    const buffOperations = new BuffOperationExecutor({
      sourceId: operatorId,
      resolveTarget: target => this.#resolveBuffTarget(target, operatorId),
      resolveApplicationTargets: target =>
        target === 'party'
          ? this.#requirePartyBuffTargets()
          : [this.#resolveBuffTarget(target, operatorId)],
      delegate: baseDelegate,
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
      delegate: statusOperations,
    });
    const vitalsConditions = new CombatVitalsConditionExecutor({
      resolveTarget: target => {
        if (resolveVitals === undefined) {
          throw new Error(`skill '${program.skillId}' requires a combat vitals resolver`);
        }
        return resolveVitals(target, operatorId);
      },
      delegate: timedMarkerOperations,
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
    const eventConditions = new EventContextConditionExecutor(comboWindowOperations);
    const delegate = new ActionBlackboardOperationExecutor(eventConditions);
    return new SkillResourceOperationExecutor({
      sourceOperatorId: operatorId,
      sourceActionId: program.skillId,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      getNonReturnedSpCost,
      delegate,
    });
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
    const buffOperations = new BuffOperationExecutor({
      sourceId: operatorId,
      resolveTarget: target => this.#resolveBuffTarget(target, operatorId),
      resolveApplicationTargets: target =>
        target === 'party'
          ? this.#requirePartyBuffTargets()
          : [this.#resolveBuffTarget(target, operatorId)],
      delegate: terminal,
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
      delegate: statusOperations,
    });
    const vitalsConditions = new CombatVitalsConditionExecutor({
      resolveTarget: target => {
        if (options.resolveVitals === undefined) {
          throw new Error(`reactive event '${sourceActionId}' requires a vitals resolver`);
        }
        return options.resolveVitals(target, operatorId);
      },
      delegate: markerOperations,
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
    const eventConditions = new EventContextConditionExecutor(controlConditions);
    const blackboardOperations = new ActionBlackboardOperationExecutor(eventConditions);
    return new SkillResourceOperationExecutor({
      sourceOperatorId: operatorId,
      sourceActionId,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      getNonReturnedSpCost: () => 0,
      delegate: blackboardOperations,
    });
  }

  #requireAbilitySystem(operatorId: string): AbilitySystemRuntime {
    const abilitySystem = this.#abilitySystems.get(operatorId);
    if (abilitySystem === undefined) {
      throw new Error(`combat operator '${operatorId}' is not configured`);
    }
    return abilitySystem;
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

  #requirePartyBuffTargets(): readonly BuffOperationTarget[] {
    // 当前不结算队员死亡，已装配干员即存活队伍；逆序保持原生 CharacterTeamFinder 的遍历顺序。
    return [...this.#operatorOrder].reverse().map(operatorId => {
      const target = this.#operatorBuffs.get(operatorId);
      if (target === undefined) {
        throw new Error(`combat operator '${operatorId}' has no Buff operation target`);
      }
      return target;
    });
  }
}
