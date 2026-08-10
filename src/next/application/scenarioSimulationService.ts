/**
 * 给页面提供"跑一次模拟"的入口。
 *
 * 同样的场景内容只算一次，之后再要就直接返回上次结果；模拟进行中页面把场景改掉了，
 * 这次结果就作废。跑完会把资源曲线、敌人生命、失衡、技能警告都算好再返回，
 * 页面拿来直接用，不用自己再算一遍。
 */
import type { ResolvedCombatStep } from '../core/compiler/combatProgram';
import type { CombatOperationExecutorContext } from '../core/combat/runtime/combatRuntimeAssembly';
import type { CombatBuffCatalogDocument } from '../core/combat/buffs/combatBuffCatalog';
import type { PlayerDamageNonRandomRuntimeSnapshot } from '../core/combat/damage/playerActiveDamageInput';
import type { CriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';
import type { StandardPlayerDamageScenarioResult } from './runStandardPlayerDamageScenarioSimulation';
import type { CompileScenarioResourcesOptions } from '../core/compiler/compileScenarioResources';
import type { ScenarioBuildCatalog } from '../core/compiler/resolveScenarioBuilds';
import type { ScenarioDocument } from '../core/project/schema';
import { elementalAttachmentCatalog } from '../data/buffs/elementalAttachmentCatalog';
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

type DamageStep = Extract<ResolvedCombatStep, { kind: 'dealDamage' | 'dealFixedDamage' }>;

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

export interface ScenarioSimulationServiceOptions {
  readonly catalog: ScenarioBuildCatalog;
  readonly resources: Omit<CompileScenarioResourcesOptions, 'operators'>;
  /** 缓存键的一部分：游戏数据变了要改这个值，不然会拿到旧数据算出来的结果。 */
  readonly catalogRevision?: string;
  readonly criticalSamples?: CriticalSampleSource;
  readonly resolveNonRandomRuntimeSnapshot?: (
    context: CombatOperationExecutorContext,
    step: DamageStep,
  ) => PlayerDamageNonRandomRuntimeSnapshot;
  /** 元素附着目录；默认使用当前游戏数据版本已审核的附着目录。 */
  readonly elementalInflictionDocument?: CombatBuffCatalogDocument;
}

export interface ScenarioSimulationRun extends StandardPlayerDamageScenarioResult {
  /** 与本次模拟同一份回执投影的敌人生命曲线。 */
  readonly enemyHealthCurve: EnemyHealthCurve;
  /** 与本次模拟同一份回执投影的敌人失衡曲线。 */
  readonly poiseCurve: PoiseCurve;
  readonly availabilityDiagnostics: readonly SkillAvailabilityDiagnostic[];
  readonly executionDiagnostics: readonly SkillExecutionDiagnostic[];
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
    readonly elementalInflictionDocument: CombatBuffCatalogDocument;
  };
  readonly #catalogRevision: string;
  readonly #cache = new Map<string, MutableCacheEntry>();
  readonly #cacheLimit: number;

  constructor(options: ScenarioSimulationServiceOptions, cacheLimit: number = DEFAULT_CACHE_LIMIT) {
    if (!Number.isInteger(cacheLimit) || cacheLimit < 1) {
      throw new RangeError('simulation cache limit must be a positive integer');
    }
    this.#options = {
      ...options,
      criticalSamples: options.criticalSamples ?? createDefaultCriticalSampleSource(),
      resolveNonRandomRuntimeSnapshot:
        options.resolveNonRandomRuntimeSnapshot ?? defaultNonRandomRuntimeSnapshot,
      elementalInflictionDocument:
        options.elementalInflictionDocument ?? elementalAttachmentCatalog,
    };
    this.#catalogRevision = options.catalogRevision ?? 'catalog';
    this.#cacheLimit = cacheLimit;
  }

  /** 执行一次标准玩家伤害模拟，并在同一份回执上完成全部投影。 */
  async simulate(
    scenario: ScenarioDocument,
    endFrame: number,
    signal?: AbortSignal,
  ): Promise<ScenarioSimulationRun> {
    assertNotAborted(signal);
    const key = this.#cacheKey(scenario, endFrame);
    const cached = this.#cache.get(key);
    if (cached !== undefined) {
      this.#cache.delete(key);
      this.#cache.set(key, cached);
      return cached.run;
    }

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario,
      endFrame,
      criticalSamples: this.#options.criticalSamples!,
      resolveNonRandomRuntimeSnapshot: this.#options.resolveNonRandomRuntimeSnapshot!,
      elementalInflictionDocument: this.#options.elementalInflictionDocument,
      options: {
        catalog: this.#options.catalog,
        resources: this.#options.resources,
      },
    });

    const run = Object.freeze({
      ...result,
      enemyHealthCurve: projectEnemyHealthCurveFromReceipt(
        { health: result.enemy.health, maxHealth: result.enemy.health },
        result.receiptEntries,
      ),
      // 单节点失衡账本以敌人帧制失衡规则为初始值；多节点失衡尚无账本。
      poiseCurve: projectPoiseCurveFromReceipt(
        {
          poise: result.enemy.stagger.nodeCount === 1 ? result.enemy.stagger.maximum : 0,
          maxPoise: result.enemy.stagger.nodeCount === 1 ? result.enemy.stagger.maximum : 0,
        },
        result.receiptEntries,
      ),
      availabilityDiagnostics: freezeDiagnostics(
        projectSkillAvailabilityDiagnostics(result.receiptEntries),
      ),
      executionDiagnostics: freezeDiagnostics(
        projectSkillExecutionDiagnostics(result.receiptEntries),
      ),
    }) as ScenarioSimulationRun;

    assertNotAborted(signal);
    this.#cache.set(key, { key, run });
    while (this.#cache.size > this.#cacheLimit) {
      const oldest = this.#cache.keys().next().value as string | undefined;
      if (oldest === undefined) break;
      this.#cache.delete(oldest);
    }
    return run;
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
    return `${this.#catalogRevision}\u0000${buildScenarioRevision(scenario)}\u0000${endFrame}`;
  }
}
