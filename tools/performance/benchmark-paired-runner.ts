/** 每次只加载一个生产构建；独立进程冷首跑、有限热身和短测量块。 */
import assert from 'node:assert/strict';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { availableParallelism, cpus, platform, release } from 'node:os';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import type { ScenarioSimulationPerformanceSample } from '../../src/application/simulation/scenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlay,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { sha256, summarize } from './benchmark-baseline-common';
import { DEFAULT_POLICY, exactDataSha256, warmAssessment } from './benchmark-paired-common.mjs';

interface Options {
  input: string;
  output: string;
  expectedInputSha256: string;
  label: {
    group: number;
    axis: number;
    pair: number;
    kind: string;
    order: string;
    arm: string;
    bundle: string;
  };
  policy: typeof DEFAULT_POLICY;
}
const options: Options = JSON.parse(process.argv[2]!);
assert.equal(process.env.NODE_ENV, 'production');
assert.equal(import.meta.env.DEV, false, '必须使用生产 SSR 构建');
assert.ok(statSync(options.input).size <= 32 * 1024 * 1024, '输入超过 32 MiB');
const startedAt = new Date().toISOString();
const source = readFileSync(options.input, 'utf8');
assert.equal(sha256(source), options.expectedInputSha256, '启动时输入已变化');
const parsed = parseProjectDocument(source);
if (!parsed.ok) throw new Error(JSON.stringify(parsed));
const project = parsed.value;
const scenario = project.scenarios[0];
if (!scenario || scenario.inheritance) throw new Error('需要首个独立方案');
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
assert.ok(Number.isSafeInteger(endFrame) && endFrame >= 0);
assert.ok(endFrame + scenario.battle.prepFrames <= 108000, '超过 108000 帧');
assert.ok(
  scenario.tracks.reduce((sum, track) => sum + (track?.skillCasts.length ?? 0), 0) <= 10000,
  '超过 10000 技能块',
);
const inputHash = exactDataSha256(project);
const repository = overlay(
  await createProjectGameDataRepository(project),
  getProjectDefinitionLibrary(project),
);
const service = createScenarioSimulationService(repository, false, 'standard');
const timings: ScenarioSimulationPerformanceSample[] = [];
const unsubscribe = service.subscribePerformance(sample => timings.push(sample));
let expectedResultHash: string | undefined;
let expectedReceiptHash: string | undefined;
let receiptCount = 0;
async function measure() {
  service.clearCache();
  timings.length = 0;
  const cpuStart = process.cpuUsage();
  const wallStart = performance.now();
  const run = await service.simulate(scenario!, endFrame);
  const wallMs = performance.now() - wallStart;
  const cpu = process.cpuUsage(cpuStart);
  assert.equal(timings.length, 1);
  const timing = timings[0]!;
  assert.equal(timing.outcome, 'completed');
  assert.equal(timing.resumedFromFrame ?? null, null, '命中恢复点');
  assert.equal(run.frame, endFrame);
  assert.equal(run.receiptDetail, 'standard');
  const resultHash = exactDataSha256(toSimulationWorkerResult(run));
  const receiptHash = exactDataSha256(run.receiptEntries);
  expectedResultHash ??= resultHash;
  expectedReceiptHash ??= receiptHash;
  assert.equal(resultHash, expectedResultHash, '完整结果不确定');
  assert.equal(receiptHash, expectedReceiptHash, '有序回执不确定');
  assert.equal(exactDataSha256(project), inputHash, '模拟改变输入');
  receiptCount = run.receiptEntries.length;
  return {
    ...timing,
    wallMs,
    cpuUserMs: cpu.user / 1000,
    cpuSystemMs: cpu.system / 1000,
    cpuMs: (cpu.user + cpu.system) / 1000,
    resultHash,
    receiptHash,
    inputHash,
  };
}
type Sample = Awaited<ReturnType<typeof measure>>;
function cgroupLimit(name: string) {
  try {
    return readFileSync(`/sys/fs/cgroup/${name}`, 'utf8').trim();
  } catch {
    return null;
  }
}
const report = {
  kind: 'endaxis-paired-process',
  version: 1,
  label: options.label,
  startedAt,
  completedAt: null as string | null,
  status: 'running',
  policy: options.policy,
  identity: {
    sourceSha256: sha256(source),
    inputHash,
    scenarioSha256: exactDataSha256(scenario),
    gameDataRevision: repository.revision,
    endFrame,
    receiptDetail: 'standard',
    resultHash: '',
    receiptHash: '',
  },
  environment: {
    pid: process.pid,
    node: process.version,
    v8: process.versions.v8,
    os: platform(),
    osRelease: release(),
    architecture: process.arch,
    cpuModel: cpus()[0]?.model,
    logicalCpuCount: cpus().length,
    availableParallelism: availableParallelism(),
    execArgv: process.execArgv,
    nodeOptions: process.env.NODE_OPTIONS ?? null,
    cgroupV2: { cpuMax: cgroupLimit('cpu.max'), memoryMax: cgroupLimit('memory.max') },
  },
  coldFirst: null as Sample | null,
  warmupSamples: [] as Sample[],
  warmAssessments: [] as ReturnType<typeof warmAssessment>[],
  warmConverged: false,
  measuredSamples: [] as Sample[],
  summary: {} as Record<string, ReturnType<typeof summarize>>,
  receiptCount: 0,
  failure: null as string | null,
};
function save() {
  writeFileSync(options.output, JSON.stringify(report, null, 2));
}
try {
  report.coldFirst = await measure();
  save();
  let consecutive = 0;
  for (let index = 0; index < options.policy.maxWarmups; index++) {
    report.warmupSamples.push(await measure());
    const assessment = warmAssessment(report.warmupSamples, options.policy);
    report.warmAssessments.push(assessment);
    consecutive = assessment.passes ? consecutive + 1 : 0;
    report.warmConverged = consecutive >= options.policy.warmConsecutive;
    save();
    if (report.warmConverged) break;
  }
  // 即使未收敛也完成预声明短块，保留诊断区间；该进程不能用于通过校准。
  for (let index = 0; index < options.policy.repetitions; index++) {
    report.measuredSamples.push(await measure());
    save();
  }
  for (const metric of ['wallMs', 'cpuMs', 'totalMs', 'simulationMs', 'projectionMs'] as const)
    report.summary[metric] = summarize(report.measuredSamples.map(sample => sample[metric]));
  report.status = report.warmConverged ? 'completed' : 'warmup-exhausted';
  report.identity.resultHash = expectedResultHash!;
  report.identity.receiptHash = expectedReceiptHash!;
  report.receiptCount = receiptCount;
  assert.equal(
    sha256(readFileSync(options.input)),
    options.expectedInputSha256,
    '结束时输入已变化',
  );
} catch (error) {
  report.status = 'failed';
  report.failure = error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.exitCode = 1;
} finally {
  unsubscribe();
  service.clearCache();
  report.completedAt = new Date().toISOString();
  save();
}
console.log(JSON.stringify({ status: report.status, output: options.output }));
