import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createPinia, setActivePinia } from 'pinia';
import { nextTick, ref } from 'vue';
import { useTimelineStore } from 'legacy-timeline-store';
import { capturedDeps, createFreshSimulation } from './benchmark-pre-v3-capture.mjs';

const options = JSON.parse(process.argv[2]);
if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV)
  throw Error('Production SSR bundle required');
const startedAt = new Date().toISOString();
const storage = new Map();
globalThis.localStorage = {
  getItem: k => storage.get(k) ?? null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: k => storage.delete(k),
};
globalThis.FileReader = class {
  readAsText(blob) {
    blob.text().then(text => {
      this.result = text;
      this.onload?.();
    });
  }
};
const sha = value => createHash('sha256').update(value).digest('hex');
const serialize = value =>
  JSON.stringify(value, (_k, v) =>
    v instanceof Map
      ? { $map: [...v] }
      : v instanceof Set
        ? { $set: [...v] }
        : typeof v === 'number' && !Number.isFinite(v)
          ? { $number: String(v) }
          : v,
  );
const hash = value => sha(serialize(value));
const source = readFileSync(options.inputPath, 'utf8');
const parsed = JSON.parse(source);
const sourceHash = sha(source);
const scenarioId = parsed.scenarioList[options.scenarioIndex].id;
setActivePinia(createPinia());
const store = useTimelineStore();
await store.fetchGameData();
if (!(await store.importProject(new Blob([source])))) throw Error('Legacy import failed');
store.switchScenario(scenarioId);
await nextTick();
await new Promise(r => setTimeout(r, 200));
await nextTick();
if (store.activeScenarioId !== scenarioId) throw Error('Wrong scenario');
if (
  capturedDeps.inheritedInitialEffects.value.length ||
  capturedDeps.inheritedInitialEnemyState.value
)
  throw Error('Inherited scenario unsupported');
const inputSnapshot = () =>
  hash({
    scenario: capturedDeps.scenarioList.value.find(s => s.id === scenarioId),
    tracks: capturedDeps.tracks.value,
  });
const inputHash = inputSnapshot();
const nativeEndlineSeconds = store.simulationEndline;
const effectiveEndlineSeconds = options.matchHorizon
  ? (nativeEndlineSeconds ?? store.prepDuration + store.battleDuration)
  : nativeEndlineSeconds;
const runDeps = { ...capturedDeps, simulationEndline: ref(effectiveEndlineSeconds) };
let expectedHash;
const eventCounts = {};
function run(iteration) {
  const cpuStart = process.cpuUsage();
  const start = performance.now();
  const fresh = createFreshSimulation(runDeps);
  const compiled = fresh.compiledScenario.value;
  const compiledAt = performance.now();
  const simulation = fresh.simulation.value;
  const simulatedAt = performance.now();
  const projection = {};
  for (const key of [
    'simLog',
    'operatorLog',
    'enemyLog',
    'spSeries',
    'staggerSeries',
    'trackBuffLayouts',
    'enemyEffectLayout',
    'enemyAfflictionViz',
    'operatorEffectLayouts',
    'comboWindowLayouts',
    'comboCooldownIntervals',
    'requisiteWarnings',
    'gaugeSeriesByTrackId',
  ])
    projection[key] = fresh[key].value;
  const end = performance.now();
  const cpu = process.cpuUsage(cpuStart);
  const resultHash = hash(projection);
  expectedHash ??= resultHash;
  if (resultHash !== expectedHash) throw Error('Nondeterministic legacy output');
  if (inputSnapshot() !== inputHash) throw Error('Legacy simulation changed hydrated input');
  if (iteration === 'first')
    for (const log of projection.simLog) eventCounts[log.type] = (eventCounts[log.type] ?? 0) + 1;
  const hits = projection.simLog.filter(e => e.type === 'DAMAGE_HIT');
  return {
    iteration,
    totalMs: end - start,
    compileMs: compiledAt - start,
    simulationMs: simulatedAt - compiledAt,
    projectionMs: end - simulatedAt,
    cpuMs: (cpu.user + cpu.system) / 1000,
    resultSha256: resultHash,
    logCount: projection.simLog.length,
    damageHitCount: hits.length,
    expectedDamage: hits.reduce((sum, e) => sum + (e.payload?.hitData?._expectedDamage ?? 0), 0),
    lastStateTimeSeconds: simulation.state.getCurrentTime(),
    requisiteWarnings: projection.requisiteWarnings,
    endlineTime: compiled.endlineTime,
    projectionKeys: Object.keys(projection),
    simulationKeys: Object.keys(simulation),
  };
}
const first = run('first');
const warmups = Array.from({ length: options.warmups }, (_, i) => run(`warmup${i}`));
const samples = Array.from({ length: options.repetitions }, (_, i) => run(i));
function summary(key) {
  const a = samples.map(s => s[key]).sort((a, b) => a - b);
  return {
    medianMs: (a[Math.floor((a.length - 1) / 2)] + a[Math.floor(a.length / 2)]) / 2,
    p95Ms: a[Math.ceil(a.length * 0.95) - 1],
    minMs: a[0],
    maxMs: a.at(-1),
  };
}
console.log(
  JSON.stringify({
    kind: 'endaxis-pre-v3-comparison',
    startedAt,
    completedAt: new Date().toISOString(),
    sourceSha256: sourceHash,
    scenarioIndex: options.scenarioIndex,
    scenarioName: store.scenarioList.find(s => s.id === scenarioId).name,
    castCount: store.tracks.flatMap(t => t.actions ?? []).length,
    prepSeconds: store.prepDuration,
    battleSeconds: store.battleDuration,
    nativeEndlineSeconds,
    effectiveEndlineSeconds,
    matchHorizon: options.matchHorizon,
    inputSha256: inputHash,
    first,
    warmups,
    samples,
    eventCounts,
    summary: Object.fromEntries(
      ['totalMs', 'compileMs', 'simulationMs', 'projectionMs', 'cpuMs'].map(k => [k, summary(k)]),
    ),
    node: process.version,
    deterministic: true,
  }),
);
store.$dispose();
