/** Build once, count separately, then run each timed case in its own production Node process. */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { build } from 'vite';

const usage =
  'node tools/performance/benchmark-graph-node-scaling.mjs <new-output-dir> [--counts-only] [--repetitions 20] [--warmups 5] [--rounds 2]';
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(usage);
  process.exit(0);
}
const outputArgument = args.shift();
if (!outputArgument || outputArgument.startsWith('--')) throw new Error(usage);
let repetitions = 20,
  warmups = 5,
  rounds = 2,
  countsOnly = false;
while (args.length) {
  const flag = args.shift();
  if (flag === '--counts-only') {
    countsOnly = true;
    continue;
  }
  if (!['--repetitions', '--warmups', '--rounds'].includes(flag)) throw new Error(usage);
  const value = Number(args.shift());
  const max = flag === '--rounds' ? 4 : flag === '--warmups' ? 20 : 100;
  assert.ok(
    Number.isInteger(value) && value >= (flag === '--warmups' ? 0 : 1) && value <= max,
    usage,
  );
  if (flag === '--repetitions') repetitions = value;
  if (flag === '--warmups') warmups = value;
  if (flag === '--rounds') rounds = value;
}
const root = process.cwd();
const output = resolve(outputArgument);
mkdirSync(output);
const digest = value => createHash('sha256').update(value).digest('hex');
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
const sourceFingerprint = () =>
  digest(
    git('ls-files', '--', 'src', 'packages', 'package-lock.json')
      .split('\n')
      .filter(path => path && !/\.(test|typecheck)\./.test(path))
      .sort()
      .map(path => `${path}\0${digest(readFileSync(path))}`)
      .join('\n'),
  );
const sourceSha256 = sourceFingerprint();
process.env.NODE_ENV = 'production';
await build({
  root,
  configFile: false,
  mode: 'production',
  logLevel: 'error',
  publicDir: false,
  ssr: { noExternal: true },
  build: {
    ssr: resolve('tools/performance/benchmark-graph-node-scaling-runner.ts'),
    target: 'node22',
    outDir: join(output, 'build'),
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    rollupOptions: { output: { entryFileNames: 'runner.mjs' } },
  },
});
const cases = [];
function add(
  id,
  family,
  sourceNodes,
  reachableNodes,
  ticks,
  instances = 1,
  compileAll = false,
  lifecycle = 'started',
) {
  cases.push({ id, family, sourceNodes, reachableNodes, compileAll, instances, ticks, lifecycle });
}
for (const n of [10, 100, 1000, 5000]) {
  add(`source-${n}`, 'unreachable-source', n, 10, 1000);
  add(`compiled-${n}`, 'compiled-unreachable-control', n, 10, 1000, 1, true);
  add(`reachable-${n}`, 'reachable-chain', n, n, 100);
}
for (const ticks of [0, 10, 100, 1000, 5000])
  add(`ticks-${ticks}`, 'repeated-ticks', 100, 100, ticks);
for (const instances of [1, 10, 100, 1000])
  add(`instances-${instances}`, 'instances', 10, 10, 100, instances);
for (const lifecycle of ['never-started', 'reset-pending', 'ended'])
  add(`lifecycle-${lifecycle}`, 'lifecycle-control', 5000, 5000, 100, 1, false, lifecycle);
for (const instances of [1, 1000]) add(`empty-${instances}`, 'empty-control', 0, 0, 100, instances);
function run(options, filename) {
  const child = spawnSync(
    process.execPath,
    [join(output, 'build', 'runner.mjs'), JSON.stringify(options)],
    {
      cwd: root,
      env: { ...process.env, NODE_ENV: 'production' },
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 32 * 1024 * 1024,
    },
  );
  if (child.error || child.status !== 0)
    throw new Error(
      `runner failed: ${child.error ?? child.status}\n${child.stderr}\n${child.stdout}`,
    );
  const result = JSON.parse(child.stdout);
  writeFileSync(join(output, filename), JSON.stringify(result, null, 2) + '\n');
  assert.equal(sourceFingerprint(), sourceSha256, 'Source changed during experiment');
  return result;
}
const diagnostics = run({ mode: 'counts', cases, repetitions: 1, warmups: 0 }, 'counts.json');
const timedRounds = [];
if (!countsOnly)
  for (let round = 0; round < rounds; round++) {
    const ordered = round % 2 ? [...cases].reverse() : cases;
    const results = [];
    for (const spec of ordered) {
      process.stderr.write(`round ${round + 1}/${rounds}: ${spec.id}\n`);
      const result = run(
        { mode: 'timing', cases: [spec], repetitions, warmups },
        `round-${round + 1}-${spec.id}.json`,
      );
      results.push(result.cases[0]);
    }
    timedRounds.push({ round: round + 1, order: ordered.map(spec => spec.id), results });
  }
const summary = {
  label: 'Synthetic graph traversal and dispatch experiment; not full-service speedup',
  methodology: {
    productionSsr: true,
    countAndTimingProcessesSeparate: true,
    caseProcessesSeparate: true,
    timedHost:
      'Deterministic no-op CombatStep leaves; real ActionGraphExecution and compiler; no production-host work or counters in timed processes',
    timings:
      'New compilation and new execution instances per sample; definition generation, assertions, build, module load, IPC and output excluded. Preparation includes validation/data resolution; compileEntry/compileAll measured separately. Timing of ended control includes end in startAndOptionalEndMs.',
    counts:
      'Separate diagnostic only: counted node Map and counted host callbacks. Tick mapGet counts correspond to next-edge traversal on the flat synthetic chain. No nested graph inference.',
    gc: 'No explicit GC. Samples include natural GC interference; p95 from 20 samples is not a tail-latency guarantee.',
    warmups,
    repetitions,
    rounds: countsOnly ? 0 : rounds,
  },
  provenance: {
    gitHead: git('rev-parse', 'HEAD'),
    productionSourceSha256: sourceSha256,
    productionWorkingTreeStatus: git(
      'status',
      '--porcelain',
      '--',
      'src',
      'packages',
      'package-lock.json',
    ),
    launcherSha256: digest(readFileSync('tools/performance/benchmark-graph-node-scaling.mjs')),
    runnerSha256: digest(readFileSync('tools/performance/benchmark-graph-node-scaling-runner.ts')),
  },
  environment: diagnostics.environment,
  diagnostics: diagnostics.cases,
  timedRounds,
};
writeFileSync(join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
console.log(
  JSON.stringify({ output, cases: cases.length, timingRounds: timedRounds.length, verified: true }),
);
