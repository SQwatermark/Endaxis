/** 由专用生产 SSR 验收命令启动；所有语义检查在性能测量区间之外执行。 */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { cpus, availableParallelism, platform, release } from 'node:os';
import { serialize } from 'node:v8';
import { createHash } from 'node:crypto';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import type { ScenarioSimulationPerformanceSample } from '../../src/application/simulation/scenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlay,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { projectCombatHudSnapshot } from '../../src/core/projection/combatHudSnapshot';
import { projectOperatorPassiveUiTimelineViz } from '../../src/core/projection/operatorPassiveUiTimelineViz';
import { projectBuffTimelineViz } from '../../src/core/projection/buffTimelineViz';
import { resolveControlTimeline } from '../../src/core/project/resolveControlTimeline';
import { sha256, valueSha256, summarize } from './benchmark-baseline-common';

interface Options {
  input: string;
  output: string;
  receiptDetail: 'standard' | 'detailed';
  warmups: number;
  repetitions: number;
  verify: boolean;
}
const options: Options = JSON.parse(process.argv[2]!);
const startedAt = new Date().toISOString();
function cgroupLimit(name: string): string | null {
  try {
    return readFileSync(`/sys/fs/cgroup/${name}`, 'utf8').trim();
  } catch {
    return null;
  }
}
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV)
  throw new Error('必须使用生产 SSR 构建');
const source = readFileSync(options.input, 'utf8');
const parsed = parseProjectDocument(source);
if (!parsed.ok) throw new Error(JSON.stringify(parsed));
const project = parsed.value;
const scenario = project.scenarios[0];
if (!scenario || scenario.inheritance) throw new Error('需要首个独立方案');
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
if (
  endFrame + scenario.battle.prepFrames > 108000 ||
  scenario.tracks.flatMap(track => track?.skillCasts ?? []).length > 10000
)
  throw new Error('超过输入上限：108000 帧或 10000 技能块');
const inputHash = valueSha256(project);
const repository = overlay(
  await createProjectGameDataRepository(project),
  getProjectDefinitionLibrary(project),
);
const service = createScenarioSimulationService(repository, false, options.receiptDetail);
const timings: ScenarioSimulationPerformanceSample[] = [];
const unsubscribe = service.subscribePerformance(sample => timings.push(sample));
let expectedResultHash: string | undefined;
let expectedReceiptHash: string | undefined;
async function measure() {
  service.clearCache();
  timings.length = 0;
  const cpuStart = process.cpuUsage();
  const run = await service.simulate(scenario!, endFrame);
  const cpu = process.cpuUsage(cpuStart);
  const timing = timings[0];
  assert.equal(timings.length, 1);
  assert.equal(timing?.outcome, 'completed');
  assert.equal(timing.resumedFromFrame ?? null, null);
  assert.equal(run.frame, endFrame);
  const result = toSimulationWorkerResult(run);
  const cloneStart = performance.now();
  structuredClone(result);
  const cloneMs = performance.now() - cloneStart;
  const resultHash = valueSha256(result);
  const receiptHash = valueSha256(run.receiptEntries);
  expectedResultHash ??= resultHash;
  expectedReceiptHash ??= receiptHash;
  assert.equal(resultHash, expectedResultHash, '完整结果不确定');
  assert.equal(receiptHash, expectedReceiptHash, '回执不确定');
  assert.equal(valueSha256(project), inputHash, '模拟改变输入');
  return {
    run,
    sample: {
      ...timing,
      cloneMs,
      cpuUserMs: cpu.user / 1000,
      cpuSystemMs: cpu.system / 1000,
      cpuMs: (cpu.user + cpu.system) / 1000,
      resultHash,
      receiptHash,
    },
  };
}
const { run, sample: coldFirst } = await measure();
const warmupSamples = [];
for (let index = 0; index < options.warmups; index++) warmupSamples.push((await measure()).sample);
const measuredSamples = [];
for (let index = 0; index < options.repetitions; index++)
  measuredSamples.push((await measure()).sample);
unsubscribe();
service.clearCache();
const eventCounts: Record<string, number> = {};
for (const entry of run.receiptEntries)
  eventCounts[entry.event] = (eventCounts[entry.event] ?? 0) + 1;
const damage = run.receiptEntries.filter(entry => entry.event === 'DamageApplied');
let verification;
if (options.verify) {
  const session = service.createCombatSession(scenario, endFrame);
  session.advanceToFrame(endFrame);
  assert.equal(valueSha256(session.collectResult().receiptEntries), expectedReceiptHash);
  const operatorPassiveUis = scenario.tracks.flatMap(track => {
    if (!track?.operator) return [];
    const definition = repository.getOperator(track.operator.operatorSlug)?.passiveUi;
    return definition ? [{ operatorId: track.id, definition }] : [];
  });
  const operatorSkillSlots = scenario.tracks.flatMap(track => {
    if (!track?.operator) return [];
    return [
      {
        operatorId: track.id,
        slots: (repository.getOperator(track.operator.operatorSlug)?.skillSlots ?? []).map(
          slot => ({
            skillSlotKey: slot.key,
            currentSkillKey: slot.baseSkillKey,
          }),
        ),
      },
    ];
  });
  const controlTimeline = resolveControlTimeline(
    scenario.tracks,
    scenario.battle.controlSwitches,
    -scenario.battle.prepFrames,
  );
  const hud = createHash('sha256');
  const hudSnapshots = [];
  for (let frame = -scenario.battle.prepFrames; frame <= endFrame; frame++) {
    const snapshot = projectCombatHudSnapshot({
      ...run,
      frame,
      endFrame,
      operatorPassiveUis,
      operatorSkillSlots,
      controlTimeline,
    });
    hudSnapshots.push(snapshot);
    // V8 序列化对相等对象可能采用不同的数字编码；哈希使用明确保留特殊值的 JSON。
    hud.update(
      JSON.stringify(snapshot, (_key, value: unknown) => {
        if (value === undefined) return { $undefined: true };
        if (typeof value === 'number' && (!Number.isFinite(value) || Object.is(value, -0)))
          return { $number: Object.is(value, -0) ? '-0' : String(value) };
        return value;
      }),
    );
  }
  const checkpoints: { frame: number; status: string; message?: string }[] = [];
  const boundaries = new Set<number>([Math.floor(endFrame / 2)]);
  for (const event of ['AbilityEntitySpawned', 'TimeDilationStarted', 'BuffDamageApplied']) {
    const entry = run.receiptEntries.find(value => value.event === event && value.frame > 0);
    if (entry && entry.frame < endFrame) {
      boundaries.add(entry.frame - 1);
      boundaries.add(entry.frame);
    }
  }
  for (const frame of [...boundaries].sort((a, b) => a - b)) {
    const parent = service.createCombatSession(scenario, endFrame);
    parent.advanceToFrame(frame);
    const saved = parent.runtime.save();
    try {
      const branch = parent.fork(saved);
      assert.deepStrictEqual(branch.runtime.readState(), parent.runtime.readState());
      assert.deepStrictEqual(
        branch.runtime.readHistory().toArray(),
        parent.runtime.readHistory().toArray(),
      );
      parent.advanceToFrame(endFrame);
      branch.advanceToFrame(endFrame);
      assert.deepStrictEqual(branch.runtime.readState(), parent.runtime.readState());
      assert.deepStrictEqual(branch.runtime.readHistory().toArray(), run.receiptEntries);
      assert.deepStrictEqual(branch.collectResult(), session.collectResult());
      checkpoints.push({ frame, status: 'passed' });
    } catch (error) {
      // 只记录恢复探针的故障；主程序汇报 incomplete 并失败，除非显式允许已知故障。
      checkpoints.push({
        frame,
        status: 'failed',
        message: error instanceof Error ? error.message : String(error),
      });
    } finally {
      parent.runtime.discardCheckpoint(saved);
    }
  }
  verification = {
    result: toSimulationWorkerResult(run),
    state: session.runtime.readState(),
    hudSha256: hud.digest('hex'),
    hudSnapshots,
    hudFrames: endFrame + scenario.battle.prepFrames + 1,
    passiveUiTimeline: projectOperatorPassiveUiTimelineViz(
      run.receiptEntries,
      endFrame,
      operatorPassiveUis,
    ),
    buffTimeline: projectBuffTimelineViz(run.receiptEntries, endFrame),
    checkpoints,
  };
}
assert.equal(valueSha256(project), inputHash, '验收改变输入');
writeFileSync(options.output, serialize({ verification }));
console.log(
  JSON.stringify({
    mode: options.receiptDetail,
    startedAt,
    completedAt: new Date().toISOString(),
    sourceSha256: sha256(source),
    scenarioSha256: valueSha256(scenario),
    gameDataRevision: repository.revision,
    endFrame,
    random: {
      mode: scenario.battle.random?.mode ?? 'expected',
      globalSeed: scenario.battle.random?.globalSeed ?? 0,
    },
    environment: {
      node: process.version,
      v8: process.versions.v8,
      os: platform(),
      osRelease: release(),
      architecture: process.arch,
      cpuModel: cpus()[0]?.model,
      availableParallelism: availableParallelism(),
      logicalCpuCount: cpus().length,
      nodeEnv: process.env.NODE_ENV,
      nodeOptions: process.env.NODE_OPTIONS ?? null,
      cgroupV2: { cpuMax: cgroupLimit('cpu.max'), memoryMax: cgroupLimit('memory.max') },
    },
    coldFirst,
    warmupSamples,
    measuredSamples,
    summary: {
      total: summarize(measuredSamples.map(value => value.totalMs)),
      simulation: summarize(measuredSamples.map(value => value.simulationMs)),
      projection: summarize(measuredSamples.map(value => value.projectionMs)),
      clone: summarize(measuredSamples.map(value => value.cloneMs)),
      cpu: summarize(measuredSamples.map(value => value.cpuMs)),
    },
    eventCounts,
    resultJsonBytes: Buffer.byteLength(JSON.stringify(toSimulationWorkerResult(run))),
    damage: {
      hits: damage.length,
      expectedDamage: damage.reduce(
        (sum, entry) =>
          sum + (typeof entry.data?.expectedDamage === 'number' ? entry.data.expectedDamage : 0),
        0,
      ),
    },
    diagnostics: {
      availability: run.availabilityDiagnostics.length,
      execution: run.executionDiagnostics.length,
      comboWindow: run.comboWindowDiagnostics.length,
    },
  }),
);
