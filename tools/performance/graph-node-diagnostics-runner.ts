import { readFileSync } from 'node:fs';
import { createScenarioSimulationService } from '../../src/application/simulation/createScenarioSimulationService';
import { toSimulationWorkerResult } from '../../src/application/simulation/scenarioSimulationWorkerProtocol';
import {
  createProjectGameDataRepository as overlay,
  getProjectDefinitionLibrary,
} from '../../src/core/project/projectDefinitionLibrary';
import { parseProjectDocument } from '../../src/core/project/serialization';
import { createProjectGameDataRepository } from '../../src/data/projectGameDataRepository';
import { valueSha256, sha256, summarize } from './benchmark-baseline-common';
import { probe } from './graph-node-probe';
const options = JSON.parse(process.argv[2]!);
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV) throw Error('Production only');
const source = readFileSync(options.inputPath, 'utf8'),
  parsed = parseProjectDocument(source);
if (!parsed.ok) throw Error(JSON.stringify(parsed));
const project = parsed.value,
  scenario = project.scenarios[0]!;
if (!scenario || scenario.inheritance) throw Error('Independent first scenario required');
const endFrame = scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
if (endFrame + scenario.battle.prepFrames > 108000) throw Error('Too many frames');
const inputHash = valueSha256(project);
const repository = overlay(
  await createProjectGameDataRepository(project),
  getProjectDefinitionLibrary(project),
);
const service = createScenarioSimulationService(repository, false, 'standard');
let timing: any;
service.subscribePerformance(sample => (timing = sample));
let expected: string | undefined;
const rows: any[] = [];
for (let i = 0; i < options.runs; i++) {
  service.clearCache();
  probe.reset();
  const cpu = process.cpuUsage();
  const result = await service.simulate(scenario, endFrame);
  const usage = process.cpuUsage(cpu);
  if (
    timing.outcome !== 'completed' ||
    timing.resumedFromFrame != null ||
    result.frame !== endFrame
  )
    throw Error('Not complete fresh simulation');
  const counters = options.diagnostic ? probe.snapshot() : undefined;
  const resultHash = valueSha256(toSimulationWorkerResult(result));
  expected ??= resultHash;
  if (resultHash !== expected || valueSha256(project) !== inputHash)
    throw Error('Nondeterminism or mutation');
  rows.push({
    iteration: i,
    totalMs: timing.totalMs,
    simulationMs: timing.simulationMs,
    cpuMs: (usage.user + usage.system) / 1000,
    resultHash,
    receiptHash: valueSha256(result.receiptEntries),
    counters,
  });
}
console.log(
  JSON.stringify({
    diagnostic: options.diagnostic,
    sourceSha256: sha256(source),
    projectSha256: inputHash,
    gameDataRevision: repository.revision,
    scenario: {
      endFrame,
      prepFrames: scenario.battle.prepFrames,
      casts: scenario.tracks.flatMap(t => t?.skillCasts ?? []).length,
    },
    rows,
    summary: options.diagnostic
      ? undefined
      : summarize(rows.slice(options.warmups + 1).map(r => r.totalMs)),
  }),
);
