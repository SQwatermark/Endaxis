/** 此入口由 benchmark-baseline.ts 生产构建后启动，不通过 Vite 开发服务器或 Vitest。 */
import { readFileSync } from 'node:fs';
import { availableParallelism, cpus, platform, release, totalmem } from 'node:os';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import type {
  ScenarioSimulationPerformanceSample,
  ScenarioSimulationRun,
} from '../../src/application/simulation/scenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlayProjectDefinitions,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { sha256, summarize, valueSha256, type BaselineOptions } from './benchmark-baseline-common';

const options: BaselineOptions = JSON.parse(process.argv[2]!);
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV)
  throw new Error('基线必须使用生产 SSR 构建');
const startedAt = new Date().toISOString();
const source = readFileSync(options.inputPath, 'utf8');
const parsed = parseProjectDocument(source);
if (!parsed.ok) throw new Error(JSON.stringify(parsed));
const project = parsed.value;
const selectedScenario = project.scenarios[options.scenarioIndex];
if (selectedScenario === undefined) throw new Error(`项目不存在方案 ${options.scenarioIndex}`);
const scenario = selectedScenario;
if (scenario.inheritance !== undefined)
  throw new Error('继承方案必须经过前缀切面；本工具拒绝把它作为无切面完整重算基线');
const scenarioHash = valueSha256(scenario);
const projectHash = valueSha256(project);
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
const casts = scenario.tracks.flatMap(track => track?.skillCasts ?? []);
if (endFrame + scenario.battle.prepFrames > 108000 || casts.length > 10000)
  throw new Error('方案超过上限：准备段加结束帧 108000、技能块 10000');
const loadStarted = performance.now();
const baseRepository = await createProjectGameDataRepository(project);
const repository = overlayProjectDefinitions(baseRepository, getProjectDefinitionLibrary(project));
const repositoryLoadMs = performance.now() - loadStarted;
const service = createScenarioSimulationService(repository, false);
const timings: ScenarioSimulationPerformanceSample[] = [];
const unsubscribe = service.subscribePerformance(sample => timings.push(sample));
let expectedResultHash: string | undefined;
let expectedReceiptHash: string | undefined;
const receiptEventCounts: Record<string, number> = {};

function cgroupLimit(filename: string): string | null {
  try {
    return readFileSync(`/sys/fs/cgroup/${filename}`, 'utf8').trim();
  } catch {
    return null;
  }
}

function diagnosticsSummary(run: ScenarioSimulationRun) {
  const counts = (diagnostics: readonly { readonly reasons: readonly string[] }[]) => {
    const reasons: Record<string, number> = {};
    for (const diagnostic of diagnostics)
      for (const reason of diagnostic.reasons) reasons[reason] = (reasons[reason] ?? 0) + 1;
    return { count: diagnostics.length, reasons };
  };
  return {
    availability: counts(run.availabilityDiagnostics),
    execution: counts(run.executionDiagnostics),
    comboWindow: counts(run.comboWindowDiagnostics),
  };
}

async function measure(phase: string, iteration: number) {
  // 禁止跨次结果、增量与继承前缀复用；定义级编译缓存保持产品正常寿命。
  service.clearCache();
  timings.length = 0;
  const cpuStarted = process.cpuUsage();
  const run = await service.simulate(scenario, endFrame);
  const cpu = process.cpuUsage(cpuStarted);
  const timing = timings[0];
  if (
    timings.length !== 1 ||
    timing?.outcome !== 'completed' ||
    timing.resumedFromFrame != null ||
    run.frame !== endFrame
  )
    throw new Error(`${phase} ${iteration} 没有完成一次独立的全量模拟`);
  const transferable = toSimulationWorkerResult(run);
  const cloneStarted = performance.now();
  structuredClone(transferable);
  const cloneMs = performance.now() - cloneStarted;
  // 摘要与输入不变性检查不计入服务计时，也不计入克隆耗时。
  const resultSha256 = valueSha256(transferable);
  const receiptSha256 = valueSha256(run.receiptEntries);
  expectedResultHash ??= resultSha256;
  expectedReceiptHash ??= receiptSha256;
  if (resultSha256 !== expectedResultHash || receiptSha256 !== expectedReceiptHash)
    throw new Error(`${phase} ${iteration} 结果或回执不确定`);
  if (valueSha256(project) !== projectHash || valueSha256(scenario) !== scenarioHash)
    throw new Error(`${phase} ${iteration} 修改了项目输入`);
  if (phase === 'cold')
    for (const entry of run.receiptEntries)
      receiptEventCounts[entry.event] = (receiptEventCounts[entry.event] ?? 0) + 1;
  const damageReceipts = run.receiptEntries.filter(entry => entry.event === 'DamageApplied');
  return {
    iteration,
    ...timing,
    cpuMs: (cpu.user + cpu.system) / 1000,
    cpuUserMs: cpu.user / 1000,
    cpuSystemMs: cpu.system / 1000,
    cloneMs,
    resultSha256,
    receiptSha256,
    diagnostics: diagnosticsSummary(run),
    damageHitCount: damageReceipts.length,
    expectedDamage: damageReceipts.reduce(
      (sum, entry) =>
        sum + (typeof entry.data?.expectedDamage === 'number' ? entry.data.expectedDamage : 0),
      0,
    ),
  };
}

type Sample = Awaited<ReturnType<typeof measure>>;
function summarizeSamples(samples: readonly Sample[]) {
  return {
    total: summarize(samples.map(sample => sample.totalMs)),
    simulation: summarize(samples.map(sample => sample.simulationMs)),
    projection: summarize(samples.map(sample => sample.projectionMs)),
    clone: summarize(samples.map(sample => sample.cloneMs)),
    cpu: summarize(samples.map(sample => sample.cpuMs)),
  };
}

try {
  const coldFirst = await measure('cold', 0);
  const warmupSamples: Sample[] = [];
  for (let index = 0; index < options.warmups; index++)
    warmupSamples.push(await measure('warmup', index));
  const measuredSamples: Sample[] = [];
  for (let index = 0; index < options.repetitions; index++)
    measuredSamples.push(await measure('measured', index));

  let decomposition;
  if (options.decompose) {
    const samples = [];
    for (let index = 0; index < options.repetitions; index++) {
      service.clearCache();
      let start = performance.now();
      const schedule = service.compileInputSchedule(scenario);
      const inputScheduleOnlyMs = performance.now() - start;
      start = performance.now();
      const session = service.createCombatSession(scenario, endFrame);
      const sessionCreationIncludingCompilationMs = performance.now() - start;
      start = performance.now();
      session.advanceToFrame(endFrame);
      const advanceMs = performance.now() - start;
      start = performance.now();
      const result = session.collectResult();
      const collectResultMs = performance.now() - start;
      if (valueSha256(result.receiptEntries) !== expectedReceiptHash)
        throw new Error(`会话分解 ${index} 的回执与正式服务不同`);
      samples.push({
        inputScheduleOnlyMs,
        sessionCreationIncludingCompilationMs,
        advanceMs,
        collectResultMs,
        inputCount: schedule.inputs.length,
        continuousGroupCount: schedule.groups.length,
      });
    }
    decomposition = {
      note: 'Separate warmed public-API diagnostic; not additive to official service stages. compileInputSchedule is a standalone probe; createCombatSession performs its own compilation. collectResult includes state copying and core result/resource projections, not the service projection stage.',
      summary: {
        inputScheduleOnly: summarize(samples.map(sample => sample.inputScheduleOnlyMs)),
        sessionCreationIncludingCompilation: summarize(
          samples.map(sample => sample.sessionCreationIncludingCompilationMs),
        ),
        advance: summarize(samples.map(sample => sample.advanceMs)),
        collectResult: summarize(samples.map(sample => sample.collectResultMs)),
      },
      samples,
    };
  }
  if (valueSha256(project) !== projectHash) throw new Error('阶段诊断修改了项目输入');
  console.log(
    JSON.stringify({
      kind: 'endaxis-uncached-baseline',
      version: 1,
      startedAt,
      completedAt: new Date().toISOString(),
      input: {
        path: options.inputPath,
        sourceSha256: sha256(source),
        scenarioSha256: scenarioHash,
      },
      environment: {
        node: process.version,
        v8: process.versions.v8,
        os: platform(),
        osRelease: release(),
        architecture: process.arch,
        cpuModel: cpus()[0]?.model ?? null,
        logicalCpuCount: cpus().length,
        availableParallelism: availableParallelism(),
        totalMemoryBytes: totalmem(),
        nodeEnv: process.env.NODE_ENV,
        nodeOptions: process.env.NODE_OPTIONS ?? null,
        cgroupV2: { cpuMax: cgroupLimit('cpu.max'), memoryMax: cgroupLimit('memory.max') },
        pid: process.pid,
      },
      provenance: { ...options.provenance, gameDataRevision: repository.revision },
      scenario: {
        index: options.scenarioIndex,
        id: scenario.id,
        name: scenario.name,
        castCount: casts.length,
        disabledCastCount: casts.filter(cast => cast.presentation?.disabled === true).length,
        operators: scenario.tracks.flatMap(track =>
          track?.operator === null || track === null
            ? []
            : [{ trackId: track.id, slug: track.operator.operatorSlug }],
        ),
        prepFrames: scenario.battle.prepFrames,
        durationFrames: scenario.battle.durationFrames,
        endFrame,
        fps: project.fps,
        random: {
          mode: scenario.battle.random?.mode ?? 'expected',
          globalSeed: scenario.battle.random?.globalSeed ?? 0,
          inputWasModified: false,
        },
      },
      methodology: {
        execution:
          'Production Vite SSR bundle; fresh Node process per scenario; no dev server, test runner, Worker transport or UI',
        coldDefinition:
          'First simulation after modules, repository and service are loaded; includes first-use compilation/JIT, excludes module loading/build',
        cachePolicy:
          'reuseCheckpoint=false; clearCache before each run; inherited scenarios rejected; immutable definition compilation caches retain production lifetime',
        simulationMs:
          'Official service stage: compilation, runtime setup, combat advance, core result/resource collection',
        projectionMs:
          'Official service stage: enemy health, poise and diagnostics projection/publication',
        cloneMs:
          'Separate structuredClone of official Worker-transferable result, excluding process-local receiptHistory view; not Worker transfer or round-trip time',
        cpuMs:
          'process.cpuUsage user+system around simulate only, including process background-thread CPU; may exceed wall time. Hashing and cloning are excluded.',
        hashing:
          'SHA-256 of JSON; non-finite numbers use {$number:String(value)}. Result hash covers Worker-transferable data; receipts separately hashed in order. Input checked unchanged after every run.',
        p95Method: 'nearest-rank ceil(0.95*n), 1-based',
        warmups: options.warmups,
        repetitions: options.repetitions,
        forcedGc: false,
      },
      excludedSetup: { repositoryLoadMs },
      receiptEventCounts,
      coldFirst,
      warmupSamples,
      summary: summarizeSamples(measuredSamples),
      measuredSamples,
      decomposition,
      deterministic: true,
    }),
  );
} finally {
  unsubscribe();
  service.clearCache();
}
