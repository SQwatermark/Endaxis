import type { ResolvedCombatStepForKind } from '../core/compiler/combatProgram';
import { planRecursiveSkillChain, type RecursiveSkillChain } from './recursiveSkillChain';
/**
 * 给页面提供"跑一次模拟"的入口。
 *
 * 同样的场景内容只算一次，之后再要就直接返回上次结果；模拟进行中页面把场景改掉了，
 * 这次结果就作废。跑完会把资源曲线、敌人生命、失衡、技能警告都算好再返回，
 * 页面拿来直接用，不用自己再算一遍。
 */
import type { CombatDamageExecutorContext } from '../core/combat/runtime/combatRuntimeAssembly';
import type { CombatBuffDefinitionsDocument } from '../core/combat/buffs/combatBuffDefinitions';
import type { SkillSettingsDocument } from '../core/combat/infliction/skillSettings';
import type { CompoundStatusFactoriesDocument } from '../core/combat/infliction/compoundStatusFactories';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../core/combat/damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import type { ProbabilitySampleSource } from '../core/combat/random/probabilitySampleSource';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';
import type { StandardPlayerDamageScenarioResult } from './runStandardPlayerDamageScenarioSimulation';
import type { CompileScenarioResourcesOptions } from '../core/compiler/compileScenarioResources';
import type { CompileScenarioRuntimeAssemblyOptions } from '../core/compiler/compileScenarioRuntimeAssembly';
import type { ScenarioDocument } from '../core/project/schema';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { compoundStatusFactories } from '../data/buffs/compoundStatusFactories';
import {
  projectEnemyHealthCurveFromReceipt,
  type EnemyHealthCurve,
} from '../core/projection/enemyHealthCurves';
import { projectPoiseCurveFromReceipt, type PoiseCurve } from '../core/projection/poiseCurves';
import {
  projectSkillAvailabilityDiagnostics,
  type SkillAvailabilityDiagnostic,
} from '../core/projection/skillAvailabilityDiagnostics';
import {
  projectSkillExecutionDiagnostics,
  type SkillExecutionDiagnostic,
} from '../core/projection/skillExecutionDiagnostics';
import {
  projectComboWindowDiagnostics,
  type ComboWindowDiagnostic,
} from '../core/projection/comboWindowDiagnostics';
import { MechanicAdapterRegistry } from '../core/mechanics/mechanicCompiler';
import { contingencyContractMechanicAdapter } from '../data/mechanics/contingencyContractAdapter';

type DamageStep = ResolvedCombatStepForKind<'dealDamage' | 'dealFixedDamage'>;

/** 命中时需要的几个运行时数值的默认值；这些是中性基线，不假装是游戏原版规则。 */
export function defaultNonRandomRuntimeSnapshot(): PlayerDamageNonRandomRuntimeSnapshot {
  return {
    runtimeExtensionMultiplier: 1,
    appliesIgniteDamageMultiplier: false,
    appliesPhysicalInflictionDamageMultiplier: false,
  };
}

/** 编辑器默认的确定性暴击策略：始终取样本 1，即本次模拟不产生暴击。 */
export function createDefaultCriticalSampleSource(): CriticalSampleSource {
  return { nextCriticalSample: () => 1 };
}

/** 编辑器默认采用不触发随机分支的确定性样本 1；概率为 100% 时仍必然成立。 */
export function createDefaultProbabilitySampleSource(): ProbabilitySampleSource {
  return { nextProbabilitySample: () => 1 };
}

export interface ScenarioSimulationServiceOptions {
  readonly index: CompileScenarioRuntimeAssemblyOptions['index'];
  readonly resources: Omit<CompileScenarioResourcesOptions, 'operators'>;
  /** 缓存键的一部分：游戏数据变了要改这个值，不然会拿到旧数据算出来的结果。 */
  readonly repositoryRevision?: string;
  readonly criticalSamples?: CriticalSampleSource;
  readonly probabilitySamples?: ProbabilitySampleSource;
  readonly resolveNonRandomRuntimeSnapshot?: (
    context: CombatDamageExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  /** 元素附着定义集；默认使用当前游戏数据版本已审核的附着定义。 */
  readonly elementalInflictionDocument?: CombatBuffDefinitionsDocument;
  /** 法术爆发倍率（SkillSetting）；缺失时爆发触发会明确报错。 */
  readonly spellInflictionSettings?: SkillSettingsDocument;
  readonly compoundStatusFactories?: CompoundStatusFactoriesDocument;
  /** 仅用于性能计时；测试可注入单调时钟，产品环境默认使用 performance.now()。 */
  readonly performanceNow?: () => number;
  readonly mechanicAdapters?: MechanicAdapterRegistry;
}

export type ScenarioSimulationPerformanceOutcome = 'completed' | 'aborted' | 'failed';

/** 一次 simulate 调用的墙钟耗时；各阶段互斥，可直接堆叠展示。 */
export interface ScenarioSimulationPerformanceSample {
  readonly totalMs: number;
  readonly cacheLookupMs: number;
  readonly simulationMs: number;
  readonly projectionMs: number;
  readonly cacheHit: boolean;
  readonly outcome: ScenarioSimulationPerformanceOutcome;
  readonly endFrame: number;
  readonly receiptCount: number | null;
}

export type ScenarioSimulationPerformanceSubscriber = (
  sample: ScenarioSimulationPerformanceSample,
) => void;

export interface ScenarioSimulationRun extends StandardPlayerDamageScenarioResult {
  /** 与本次模拟同一份回执投影的敌人生命曲线。 */
  readonly enemyHealthCurve: EnemyHealthCurve;
  /** 与本次模拟同一份回执投影的敌人失衡曲线。 */
  readonly poiseCurve: PoiseCurve;
  readonly availabilityDiagnostics: readonly SkillAvailabilityDiagnostic[];
  readonly executionDiagnostics: readonly SkillExecutionDiagnostic[];
  readonly comboWindowDiagnostics: readonly ComboWindowDiagnostic[];
}

interface MutableCacheEntry {
  readonly key: string;
  readonly run: ScenarioSimulationRun;
}

const DEFAULT_CACHE_LIMIT = 16;

function createAbortError(reason?: unknown): Error {
  if (reason !== undefined) return reason as Error;
  const error = new Error('The operation was aborted');
  error.name = 'AbortError';
  return error;
}

function assertNotAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) throw createAbortError(signal.reason);
}

function freezeDiagnostics<T extends { readonly receiptSequences: readonly number[] }>(
  diagnostics: readonly T[],
): readonly T[] {
  return Object.freeze(
    diagnostics.map(diagnostic =>
      Object.freeze({
        ...diagnostic,
        receiptSequences: Object.freeze(diagnostic.receiptSequences),
      }),
    ),
  );
}

function buildScenarioRevision(scenario: ScenarioDocument): string {
  // 场景文档由 schema 保证只含 JSON 值；序列化结果即稳定身份。
  return JSON.stringify(scenario);
}

/**
 * 一个服务实例绑定一套固定的游戏数据和规则。
 * 同样内容算过的场景直接返回上次结果；想换数据或规则就新建一个实例。
 */
export class ScenarioSimulationService {
  readonly #options: ScenarioSimulationServiceOptions & {
    readonly elementalInflictionDocument: CombatBuffDefinitionsDocument;
  };
  readonly #repositoryRevision: string;
  readonly #cache = new Map<string, MutableCacheEntry>();
  readonly #cacheLimit: number;
  readonly #performanceNow: () => number;
  readonly #performanceSubscribers = new Set<ScenarioSimulationPerformanceSubscriber>();

  constructor(options: ScenarioSimulationServiceOptions, cacheLimit: number = DEFAULT_CACHE_LIMIT) {
    if (!Number.isInteger(cacheLimit) || cacheLimit < 1) {
      throw new RangeError('simulation cache limit must be a positive integer');
    }
    this.#options = {
      ...options,
      criticalSamples: options.criticalSamples ?? createDefaultCriticalSampleSource(),
      probabilitySamples: options.probabilitySamples ?? createDefaultProbabilitySampleSource(),
      resolveNonRandomRuntimeSnapshot:
        options.resolveNonRandomRuntimeSnapshot ?? defaultNonRandomRuntimeSnapshot,
      elementalInflictionDocument: options.elementalInflictionDocument ?? elementalAttachments,
      compoundStatusFactories: options.compoundStatusFactories ?? compoundStatusFactories,
      mechanicAdapters:
        options.mechanicAdapters ??
        new MechanicAdapterRegistry([contingencyContractMechanicAdapter]),
    };
    this.#repositoryRevision = options.repositoryRevision ?? 'definitions';
    this.#cacheLimit = cacheLimit;
    this.#performanceNow = options.performanceNow ?? (() => globalThis.performance.now());
  }

  /** 订阅每次模拟调用的耗时样本；返回值用于解除订阅。 */
  subscribePerformance(subscriber: ScenarioSimulationPerformanceSubscriber): () => void {
    this.#performanceSubscribers.add(subscriber);
    return () => this.#performanceSubscribers.delete(subscriber);
  }

  /**
   * 为新链放置或已选技能紧凑排列产生显式帧建议。临时规划不缓存，不改原场景。
   * compact 可返回已计算前缀供编辑器补齐剩余布局；正式复跑仍采用作者帧语义。
   * 调用 UI 必须自行检查场景版本，再作为一次撤销事务提交返回的新场景。
   */
  async planSkillChain(
    scenario: ScenarioDocument,
    castIds: readonly string[],
    endFrame: number,
    signal?: AbortSignal,
    mode: 'continuation' | 'compact' = 'continuation',
    extension?: RecursiveSkillChain,
  ): Promise<
    | {
        readonly status: 'incomplete';
        readonly unresolvedCastIds: readonly string[];
        readonly scenario?: ScenarioDocument;
        readonly skillCastIds?: readonly string[];
        /** 紧凑排列已确认的前缀；其余技能仍由编辑器按块宽完成，不代表模拟合法。 */
        readonly plannedStartFrames?: ReadonlyMap<string, number>;
      }
    | {
        readonly status: 'planned';
        readonly scenario: ScenarioDocument;
        readonly run: ScenarioSimulationRun;
        readonly skillCastIds?: readonly string[];
      }
  > {
    assertNotAborted(signal);
    // 一次性整理不能拆掉用户保存的接续关系；连续组由正式模拟直接排程。
    const selected = new Set(castIds);
    for (const track of scenario.tracks) {
      for (const cast of track?.skillCasts ?? []) {
        if (
          cast.placement.afterCastId !== undefined &&
          (selected.has(cast.id) || selected.has(cast.placement.afterCastId))
        )
          throw new Error('dissolve continuous skill groups before planning fixed positions');
      }
    }
    if (extension !== undefined) {
      if (mode !== 'continuation' || castIds.length !== 1)
        throw new Error('recursive placement requires one seed');
      const planned = planRecursiveSkillChain({
        scenario,
        seedCastId: castIds[0]!,
        extension,
        endFrame,
        run: (candidate, frame) => this.#runSimulation(candidate, frame),
        checkCancelled: () => assertNotAborted(signal),
      });
      assertNotAborted(signal);
      if (!planned.complete)
        return {
          status: 'incomplete',
          scenario: planned.scenario,
          skillCastIds: planned.skillCastIds,
          unresolvedCastIds: [],
        };
      const run = await this.simulate(planned.scenario, endFrame, signal);
      return {
        status: 'planned',
        scenario: planned.scenario,
        skillCastIds: planned.skillCastIds,
        run,
      };
    }
    const candidate = structuredClone(scenario);
    const result = this.#runSimulation(candidate, endFrame, castIds, mode);
    assertNotAborted(signal);
    const frames = new Map<string, number>();
    for (const entry of result.receiptEntries) {
      if (
        entry.event === 'SkillInputProcessed' &&
        entry.data !== undefined &&
        (entry.data?.accepted === true || mode === 'compact') &&
        typeof entry.data.castId === 'string' &&
        castIds.includes(entry.data.castId)
      )
        frames.set(entry.data.castId, entry.frame);
    }
    const unresolvedCastIds = castIds.filter(id => !frames.has(id));
    if (unresolvedCastIds.length > 0)
      return {
        status: 'incomplete',
        unresolvedCastIds,
        ...(mode === 'compact' ? { plannedStartFrames: frames } : {}),
      };
    for (const track of candidate.tracks) {
      for (const cast of track?.skillCasts ?? []) {
        const frame = frames.get(cast.id);
        if (frame !== undefined) cast.placement = { startFrame: frame };
      }
    }
    const run = await this.simulate(candidate, endFrame, signal);
    if (mode === 'compact') return { status: 'planned', scenario: candidate, run };
    // 临时规划与最终显式帧必须产生相同接续判定，不吞掉其他独立诊断。
    const blockingReasons = new Set([
      'skillInputMismatch',
      'skillInputUnknown',
      'skillInterruptUnavailable',
      'skillInterruptUnknown',
    ]);
    const invalid = run.availabilityDiagnostics.filter(
      d =>
        d.receiptSequences.some(sequence => {
          const entry = run.receiptEntries.find(e => e.sequence === sequence);
          return typeof entry?.data?.castId === 'string' && castIds.includes(entry.data.castId);
        }) && d.reasons.some(reason => blockingReasons.has(reason)),
    );
    if (invalid.length > 0) return { status: 'incomplete', unresolvedCastIds: [...castIds] };
    return { status: 'planned', scenario: candidate, run };
  }

  #runSimulation(
    scenario: ScenarioDocument,
    endFrame: number,
    continuationPlanCastIds?: readonly string[],
    continuationPlanMode: 'continuation' | 'compact' = 'continuation',
  ): StandardPlayerDamageScenarioResult {
    return runStandardPlayerDamageScenarioSimulation({
      scenario,
      endFrame,
      ...(continuationPlanCastIds === undefined
        ? {}
        : { continuationPlanCastIds, continuationPlanMode }),
      criticalSamples: this.#options.criticalSamples!,
      probabilitySamples: this.#options.probabilitySamples!,
      resolveNonRandomRuntimeSnapshot: this.#options.resolveNonRandomRuntimeSnapshot!,
      elementalInflictionDocument: this.#options.elementalInflictionDocument,
      ...(this.#options.spellInflictionSettings === undefined
        ? {}
        : { spellInflictionSettings: this.#options.spellInflictionSettings }),
      compoundStatusFactories: this.#options.compoundStatusFactories,
      options: {
        index: this.#options.index,
        resources: this.#options.resources,
        mechanicAdapters: this.#options.mechanicAdapters,
      },
    });
  }

  /** 执行一次标准玩家伤害模拟，并在同一份回执上完成全部投影。 */
  async simulate(
    scenario: ScenarioDocument,
    endFrame: number,
    signal?: AbortSignal,
  ): Promise<ScenarioSimulationRun> {
    const startedAt = this.#performanceNow();
    let lookupEndedAt: number | null = null;
    let simulationStartedAt: number | null = null;
    let simulationEndedAt: number | null = null;
    let projectionStartedAt: number | null = null;
    let cacheHit = false;
    let receiptCount: number | null = null;
    try {
      assertNotAborted(signal);
      const key = this.#cacheKey(scenario, endFrame);
      const cached = this.#cache.get(key);
      lookupEndedAt = this.#performanceNow();
      if (cached !== undefined) {
        cacheHit = true;
        receiptCount = cached.run.receiptEntries.length;
        this.#cache.delete(key);
        this.#cache.set(key, cached);
        const endedAt = this.#performanceNow();
        this.#publishPerformance({
          totalMs: endedAt - startedAt,
          cacheLookupMs: endedAt - startedAt,
          simulationMs: 0,
          projectionMs: 0,
          cacheHit,
          outcome: 'completed',
          endFrame,
          receiptCount,
        });
        return cached.run;
      }

      simulationStartedAt = lookupEndedAt;
      const result = this.#runSimulation(scenario, endFrame);
      simulationEndedAt = this.#performanceNow();
      projectionStartedAt = simulationEndedAt;
      receiptCount = result.receiptEntries.length;

      const run = Object.freeze({
        ...result,
        enemyHealthCurve: projectEnemyHealthCurveFromReceipt(
          {
            health: result.enemyVitals.initialHealth,
            maxHealth: result.enemyVitals.maxHealth,
          },
          result.receiptEntries,
          -scenario.battle.prepFrames,
        ),
        // 失衡曲线初始值同样来自本次模拟唯一的敌人账本，而不是重新从静态敌人推导。
        poiseCurve: projectPoiseCurveFromReceipt(
          {
            poise: result.enemyVitals.initialPoise,
            maxPoise: result.enemyVitals.maxPoise,
          },
          result.receiptEntries,
          -scenario.battle.prepFrames,
        ),
        availabilityDiagnostics: freezeDiagnostics(
          projectSkillAvailabilityDiagnostics(result.receiptEntries),
        ),
        executionDiagnostics: freezeDiagnostics(
          projectSkillExecutionDiagnostics(result.receiptEntries),
        ),
        comboWindowDiagnostics: freezeDiagnostics(
          projectComboWindowDiagnostics(result.receiptEntries),
        ),
      }) as ScenarioSimulationRun;

      assertNotAborted(signal);
      this.#cache.set(key, { key, run });
      while (this.#cache.size > this.#cacheLimit) {
        const oldest = this.#cache.keys().next().value as string | undefined;
        if (oldest === undefined) break;
        this.#cache.delete(oldest);
      }
      const endedAt = this.#performanceNow();
      this.#publishPerformance({
        totalMs: endedAt - startedAt,
        cacheLookupMs: lookupEndedAt - startedAt,
        simulationMs: simulationEndedAt - simulationStartedAt,
        projectionMs: endedAt - projectionStartedAt,
        cacheHit,
        outcome: 'completed',
        endFrame,
        receiptCount,
      });
      return run;
    } catch (error) {
      const endedAt = this.#performanceNow();
      const lookupEnd = lookupEndedAt ?? endedAt;
      const simulationEnd = simulationEndedAt ?? (simulationStartedAt === null ? null : endedAt);
      const projectionEnd = projectionStartedAt === null ? null : endedAt;
      this.#publishPerformance({
        totalMs: endedAt - startedAt,
        cacheLookupMs: lookupEnd - startedAt,
        simulationMs:
          simulationStartedAt === null || simulationEnd === null
            ? 0
            : simulationEnd - simulationStartedAt,
        projectionMs:
          projectionStartedAt === null || projectionEnd === null
            ? 0
            : projectionEnd - projectionStartedAt,
        cacheHit,
        outcome: signal?.aborted === true ? 'aborted' : 'failed',
        endFrame,
        receiptCount,
      });
      throw error;
    }
  }

  /** 按场景内容与目标帧查找已冻结运行结果，供需要同步读取的投影复用。 */
  findCached(scenario: ScenarioDocument, endFrame: number): ScenarioSimulationRun | null {
    const cached = this.#cache.get(this.#cacheKey(scenario, endFrame));
    return cached?.run ?? null;
  }

  clearCache(): void {
    this.#cache.clear();
  }

  #cacheKey(scenario: ScenarioDocument, endFrame: number): string {
    return `${this.#repositoryRevision}\u0000${buildScenarioRevision(scenario)}\u0000${endFrame}`;
  }

  #publishPerformance(sample: ScenarioSimulationPerformanceSample): void {
    const frozen = Object.freeze({
      ...sample,
      totalMs: Math.max(0, sample.totalMs),
      cacheLookupMs: Math.max(0, sample.cacheLookupMs),
      simulationMs: Math.max(0, sample.simulationMs),
      projectionMs: Math.max(0, sample.projectionMs),
    });
    for (const subscriber of this.#performanceSubscribers) subscriber(frozen);
  }
}
