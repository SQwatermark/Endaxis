export interface VersionedArtifact<T> {
  readonly revision: string;
  readonly data: T;
}

export interface PipelineExecutionContext {
  readonly signal?: AbortSignal;
}

/** A deterministic stage that receives only the preceding stage artifact. */
export interface PipelineStage<Input, Output> {
  readonly id: string;
  readonly revision: string;
  execute(
    input: VersionedArtifact<Input>,
    context: PipelineExecutionContext,
  ): Promise<VersionedArtifact<Output>>;
}

export interface SimulationPipelineStages<
  ProjectInput,
  ResolvedScenario,
  CombatProgram,
  CombatRun,
> {
  readonly resolveScenario: PipelineStage<ProjectInput, ResolvedScenario>;
  readonly compileCombatProgram: PipelineStage<ResolvedScenario, CombatProgram>;
  readonly runCombat: PipelineStage<CombatProgram, CombatRun>;
}

export interface SimulationPipelineResult<ResolvedScenario, CombatProgram, CombatRun> {
  readonly resolvedScenario: VersionedArtifact<ResolvedScenario>;
  readonly combatProgram: VersionedArtifact<CombatProgram>;
  readonly combatRun: VersionedArtifact<CombatRun>;
}

export interface PipelineCacheOptions {
  /** Total completed stage results retained across simulation and projection stages. */
  readonly maxEntries: number;
}

function throwIfAborted(signal: AbortSignal | undefined): void {
  if (!signal?.aborted) return;
  if (signal.reason !== undefined) throw signal.reason;
  const error = new Error('The operation was aborted');
  error.name = 'AbortError';
  throw error;
}

class StageResultCache {
  readonly #entries = new Map<string, VersionedArtifact<unknown>>();
  readonly #maxEntries: number;

  constructor(options: PipelineCacheOptions) {
    if (!Number.isInteger(options.maxEntries) || options.maxEntries <= 0) {
      throw new RangeError('pipeline cache maxEntries must be a positive integer');
    }
    this.#maxEntries = options.maxEntries;
  }

  get<T>(key: string): VersionedArtifact<T> | undefined {
    const result = this.#entries.get(key);
    if (result === undefined) return undefined;
    this.#entries.delete(key);
    this.#entries.set(key, result);
    return result as VersionedArtifact<T>;
  }

  set<T>(key: string, result: VersionedArtifact<T>): void {
    this.#entries.delete(key);
    this.#entries.set(key, result);
    while (this.#entries.size > this.#maxEntries) {
      const oldestKey = this.#entries.keys().next().value as string | undefined;
      if (oldestKey === undefined) break;
      this.#entries.delete(oldestKey);
    }
  }

  clear(): void {
    this.#entries.clear();
  }
}

/**
 * Runs the pure combat pipeline without depending on Vue, Pinia, or browser
 * state. A worker adapter can call the same asynchronous boundary later.
 */
export class SimulationPipeline<ProjectInput, ResolvedScenario, CombatProgram, CombatRun> {
  readonly #stages: SimulationPipelineStages<
    ProjectInput,
    ResolvedScenario,
    CombatProgram,
    CombatRun
  >;
  readonly #cache: StageResultCache;

  constructor(
    stages: SimulationPipelineStages<ProjectInput, ResolvedScenario, CombatProgram, CombatRun>,
    cacheOptions: PipelineCacheOptions = { maxEntries: 64 },
  ) {
    this.#stages = stages;
    this.#cache = new StageResultCache(cacheOptions);
  }

  async run(
    input: VersionedArtifact<ProjectInput>,
    context: PipelineExecutionContext = {},
  ): Promise<SimulationPipelineResult<ResolvedScenario, CombatProgram, CombatRun>> {
    const resolvedScenario = await this.#runStage(this.#stages.resolveScenario, input, context);
    const combatProgram = await this.#runStage(
      this.#stages.compileCombatProgram,
      resolvedScenario,
      context,
    );
    const combatRun = await this.#runStage(this.#stages.runCombat, combatProgram, context);
    return { resolvedScenario, combatProgram, combatRun };
  }

  /** Projections are lazy and cached independently from the combat run. */
  project<Projection>(
    combatRun: VersionedArtifact<CombatRun>,
    stage: PipelineStage<CombatRun, Projection>,
    context: PipelineExecutionContext = {},
  ): Promise<VersionedArtifact<Projection>> {
    return this.#runStage(stage, combatRun, context);
  }

  clearCache(): void {
    this.#cache.clear();
  }

  async #runStage<Input, Output>(
    stage: PipelineStage<Input, Output>,
    input: VersionedArtifact<Input>,
    context: PipelineExecutionContext,
  ): Promise<VersionedArtifact<Output>> {
    throwIfAborted(context.signal);
    const cacheKey = `${stage.id}\u0000${stage.revision}\u0000${input.revision}`;
    const cached = this.#cache.get<Output>(cacheKey);
    if (cached !== undefined) return cached;

    const output = await stage.execute(input, context);
    throwIfAborted(context.signal);
    this.#cache.set(cacheKey, output);
    return output;
  }
}
