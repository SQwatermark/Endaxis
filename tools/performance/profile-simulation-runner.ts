/** Built by profile-simulation.mjs; profiler captures simulate only, never result hashing. */
import { Session } from 'node:inspector/promises';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cpus } from 'node:os';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import type { ScenarioSimulationPerformanceSample } from '../../src/application/simulation/scenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlay,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { sha256, valueSha256, summarize } from './benchmark-baseline-common';

const options: {
  inputPath: string;
  outputDirectory: string;
  mode: 'control' | 'cpu' | 'allocation';
  receiptDetail?: 'standard' | 'detailed';
  repetitions: number;
  warmups: number;
} = JSON.parse(process.argv[2]!);
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV)
  throw new Error('Production SSR required');
const source = readFileSync(options.inputPath, 'utf8');
const parsed = parseProjectDocument(source);
if (!parsed.ok) throw new Error(JSON.stringify(parsed));
const project = parsed.value;
const scenario = project.scenarios[0];
if (!scenario || scenario.inheritance) throw new Error('Expected independent first scenario');
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
const casts = scenario.tracks.flatMap(track => track?.skillCasts ?? []);
if (endFrame + scenario.battle.prepFrames > 108000 || casts.length > 10000)
  throw new Error('Input exceeds bounds');
const projectHash = valueSha256(project);
const repository = overlay(
  await createProjectGameDataRepository(project),
  getProjectDefinitionLibrary(project),
);
const service = createScenarioSimulationService(repository, false, options.receiptDetail);
const timings: ScenarioSimulationPerformanceSample[] = [];
const unsubscribe = service.subscribePerformance(sample => timings.push(sample));
const inspector = new Session();
inspector.connect();
let expectedResult: string | undefined;
let expectedReceipts: string | undefined;
const samples: { totalMs: number; simulationMs: number; projectionMs: number; cpuMs: number }[] =
  [];
async function run(capture: boolean, iteration: number) {
  service.clearCache();
  timings.length = 0;
  if (capture && options.mode === 'cpu') await inspector.post('Profiler.start');
  if (capture && options.mode === 'allocation')
    await inspector.post('HeapProfiler.startSampling', {
      samplingInterval: 32768,
      includeObjectsCollectedByMajorGC: true,
      includeObjectsCollectedByMinorGC: true,
    });
  const cpuStart = process.cpuUsage();
  const result = await service.simulate(scenario!, endFrame);
  const cpu = process.cpuUsage(cpuStart);
  // Stop before materializing/hashing results; each iteration is a separate raw trace.
  if (capture && options.mode === 'cpu') {
    const { profile } = await inspector.post('Profiler.stop');
    writeFileSync(
      join(options.outputDirectory, `${iteration}.cpuprofile`),
      JSON.stringify(profile),
    );
  }
  if (capture && options.mode === 'allocation') {
    const { profile } = await inspector.post('HeapProfiler.stopSampling');
    writeFileSync(
      join(options.outputDirectory, `${iteration}.heapprofile`),
      JSON.stringify(profile),
    );
  }
  const timing = timings[0];
  if (
    timings.length !== 1 ||
    timing?.outcome !== 'completed' ||
    timing.resumedFromFrame != null ||
    result.frame !== endFrame
  )
    throw new Error('Not an independent complete simulation');
  const resultHash = valueSha256(toSimulationWorkerResult(result));
  const receiptsHash = valueSha256(result.receiptEntries);
  expectedResult ??= resultHash;
  expectedReceipts ??= receiptsHash;
  if (
    resultHash !== expectedResult ||
    receiptsHash !== expectedReceipts ||
    valueSha256(project) !== projectHash
  )
    throw new Error('Non-deterministic result or mutated input');
  if (capture)
    samples.push({
      totalMs: timing.totalMs,
      simulationMs: timing.simulationMs,
      projectionMs: timing.projectionMs,
      cpuMs: (cpu.user + cpu.system) / 1000,
    });
}
try {
  if (options.mode === 'cpu') {
    await inspector.post('Profiler.enable');
    await inspector.post('Profiler.setSamplingInterval', { interval: 1000 });
  }
  if (options.mode === 'allocation') await inspector.post('HeapProfiler.enable');
  for (let i = 0; i < options.warmups; i++) await run(false, i);
  for (let i = 0; i < options.repetitions; i++) await run(true, i);
  console.log(
    JSON.stringify({
      mode: options.mode,
      receiptDetail: options.receiptDetail ?? 'standard',
      startedWithWarmups: options.warmups,
      repetitions: options.repetitions,
      sourceSha256: sha256(source),
      resultSha256: expectedResult,
      receiptSha256: expectedReceipts,
      scenario: { id: scenario.id, castCount: casts.length, endFrame },
      gameDataRevision: repository.revision,
      environment: { node: process.version, v8: process.versions.v8, cpu: cpus()[0]?.model },
      summary: {
        total: summarize(samples.map(s => s.totalMs)),
        cpu: summarize(samples.map(s => s.cpuMs)),
      },
      samples,
      deterministic: true,
    }),
  );
} finally {
  unsubscribe();
  service.clearCache();
  inspector.disconnect();
}
