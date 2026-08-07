/**
 * 将已解析资源和已编译技能组装成一次可执行的战斗运行时。
 * 本层只负责依赖接线与原生阶段顺序，不解析项目文档，也不为尚未闭环的战斗操作提供默认行为。
 */
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatReceiptCollector, type CombatReceiptSink } from '../receipt/combatReceipt';
import { AbilitySystemRuntime, type PostSkillCastRequest } from './abilitySystemRuntime';
import {
  BuffBlackboardOperationExecutor,
  type BuffBlackboardQueryTarget,
} from './buffBlackboardOperationExecutor';
import { CombatClock } from './combatClock';
import { CombatInputRuntime, type ScheduledSkillInput } from './combatInputRuntime';
import { CombatResourceRuntime } from './combatResourceRuntime';
import { CombatResources, type CombatResourceSnapshot } from './combatResources';
import { CombatSimulation, type FrameRuntime } from './combatSimulation';
import { SkillResourceOperationExecutor } from './skillResourceOperationExecutor';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';

/** 一个干员按原生技能目录顺序进入运行时的完整程序。 */
export interface CombatOperatorProgram {
  readonly operatorId: string;
  readonly skills: readonly CompiledSkillProgram[];
  readonly buffRuntime?: FrameRuntime;
  readonly actionRuntime?: FrameRuntime;
}

/** 非资源操作执行器工厂能够读取的稳定运行时依赖。 */
export interface CombatOperationExecutorContext {
  readonly program: CompiledSkillProgram;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
}

export interface CombatRuntimeAssemblyOptions {
  readonly resources: CombatResourceSnapshot;
  /** 当前单敌人模型中的目标 Buff 查询端口。 */
  readonly enemyBuffs: BuffBlackboardQueryTarget;
  /** 顺序应来自已解析队伍/实体启动结果，装配器不会自行排序。 */
  readonly operators: readonly CombatOperatorProgram[];
  readonly inputs?: readonly ScheduledSkillInput[];
  /**
   * 返回处理伤害、Buff、附着和条件等职责的后续执行器。
   * 共享技力与战技扣费转能由装配器统一包在该执行器外层。
   */
  readonly createOperationExecutor: (
    context: CombatOperationExecutorContext,
  ) => CombatOperationExecutor;
  readonly receipt?: CombatReceiptCollector;
}

/** 一次战斗的时钟、账本、实体能力系统与回执的唯一装配根。 */
export class CombatRuntimeAssembly {
  readonly clock = new CombatClock();
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptCollector;
  readonly simulation = new CombatSimulation(this.clock);
  readonly #abilitySystems = new Map<string, AbilitySystemRuntime>();
  readonly #enemyBuffs: BuffBlackboardQueryTarget;

  constructor(options: CombatRuntimeAssemblyOptions) {
    this.resources = new CombatResources(options.resources);
    this.receipt = options.receipt ?? new CombatReceiptCollector();
    this.#enemyBuffs = options.enemyBuffs;

    for (const operator of options.operators) {
      if (this.#abilitySystems.has(operator.operatorId)) {
        throw new Error(`duplicate combat operator '${operator.operatorId}'`);
      }
      const skills = operator.skills.map(program =>
        this.#createSkillRuntime(operator.operatorId, program, options.createOperationExecutor),
      );
      this.#abilitySystems.set(
        operator.operatorId,
        new AbilitySystemRuntime({
          buffRuntime: operator.buffRuntime,
          skills,
          actionRuntime: operator.actionRuntime,
        }),
      );
    }

    this.simulation.add(new CombatResourceRuntime(this.resources));
    const inputRuntime = new CombatInputRuntime({
      clock: this.clock,
      inputs: options.inputs ?? [],
      receipt: this.receipt,
      tryStartSkill: (operatorId, skillId) => this.tryStartSkill(operatorId, skillId),
    });
    this.simulation.add(inputRuntime);
    for (const operator of options.operators) {
      this.simulation.add(this.#requireAbilitySystem(operator.operatorId));
    }
    inputRuntime.applyCurrentFrame();
  }

  tryStartSkill(operatorId: string, skillId: string): boolean {
    return this.#requireAbilitySystem(operatorId).tryStartSkill(skillId);
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
    operatorId: string,
    program: CompiledSkillProgram,
    createDelegate: CombatRuntimeAssemblyOptions['createOperationExecutor'],
  ): SkillRuntime {
    if (program.operatorId !== operatorId) {
      throw new Error(
        `skill '${program.skillId}' belongs to '${program.operatorId}', expected '${operatorId}'`,
      );
    }

    const baseDelegate = createDelegate({
      program,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
    });
    const delegate = new BuffBlackboardOperationExecutor({
      target: this.#enemyBuffs,
      delegate: baseDelegate,
    });
    let runtime: SkillRuntime;
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: operatorId,
      skillId: program.skillId,
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      getNonReturnedSpCost: () => runtime.nonReturnedSpCost,
      delegate,
    });
    runtime = new SkillRuntime(program, {
      clock: this.clock,
      resources: this.resources,
      receipt: this.receipt,
      operations,
    });
    return runtime;
  }

  #requireAbilitySystem(operatorId: string): AbilitySystemRuntime {
    const abilitySystem = this.#abilitySystems.get(operatorId);
    if (abilitySystem === undefined) {
      throw new Error(`combat operator '${operatorId}' is not configured`);
    }
    return abilitySystem;
  }
}
