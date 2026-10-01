/** Bounded production SSR profiler. No production source is modified. */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SourceMap } from 'node:module';
import { createHash } from 'node:crypto';
import { build } from 'vite';

const usage =
  'node tools/performance/profile-simulation.mjs <project.json> <new-output-directory> [repetitions=12] [warmups=5] [receipt-detail=standard]\nFirst independent scenario only; repetitions 1–50, warmups 1–20. Two fresh processes per mode, 600s hard timeout each. Raw traces and SSR source maps stay in the output directory.';
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(usage);
  process.exit(0);
}
if (args.length < 2 || args.length > 5) throw new Error(usage);
const [input, output, repetitionsText = '12', warmupsText = '5', receiptDetail = 'standard'] = args;
if (!['standard', 'detailed'].includes(receiptDetail)) throw new Error(usage);
function integer(text, max) {
  const n = Number(text);
  if (!Number.isSafeInteger(n) || n < 1 || n > max) throw new Error(usage);
  return n;
}
const repetitions = integer(repetitionsText, 50),
  warmups = integer(warmupsText, 20);
const inputPath = resolve(input),
  outputDirectory = resolve(output);
if (existsSync(outputDirectory))
  throw new Error('Output directory must not exist (never overwrite earlier evidence)');
if (statSync(inputPath).size > 32 * 1024 * 1024) throw new Error('Input exceeds 32 MiB');
const original = readFileSync(inputPath);
const envelope = JSON.parse(original);
if (
  !Array.isArray(envelope.scenarios) ||
  envelope.scenarios.length < 1 ||
  envelope.scenarios.length > 100
)
  throw new Error('Expected project with 1–100 scenarios');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const hash = data => createHash('sha256').update(data).digest('hex');
const provenance = {
  gitHead: git('rev-parse', 'HEAD'),
  engineGitRevision: git('log', '-1', '--format=%H', '--', 'src/core', 'src/application'),
  dataGitRevision: git('log', '-1', '--format=%H', '--', 'src/data', 'packages/game-data-contract'),
  engineDiffSha256: hash(
    git('diff', '--binary', 'HEAD', '--', 'src', 'packages', 'package-lock.json'),
  ),
  engineUntracked: git('ls-files', '--others', '--exclude-standard', '--', 'src', 'packages'),
};
mkdirSync(outputDirectory, { recursive: true });
process.env.NODE_ENV = 'production';
await build({
  root,
  configFile: false,
  mode: 'production',
  logLevel: 'error',
  publicDir: false,
  ssr: { noExternal: true },
  build: {
    ssr: resolve(root, 'tools/performance/profile-simulation-runner.ts'),
    target: 'node22',
    outDir: outputDirectory,
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: { entryFileNames: 'runner.mjs', chunkFileNames: '[name]-[hash].mjs' },
    },
  },
});
const maps = new Map();
function location(frame) {
  let path;
  try {
    path = frame.url.startsWith('file:') ? fileURLToPath(frame.url) : frame.url;
  } catch {
    path = frame.url;
  }
  if (path && existsSync(path + '.map')) {
    if (!maps.has(path))
      maps.set(path, new SourceMap(JSON.parse(readFileSync(path + '.map', 'utf8'))));
    const mapped = maps.get(path).findEntry(frame.lineNumber, frame.columnNumber);
    if (mapped.originalSource)
      return `${mapped.originalSource.replace(/^.*?\/src\//, 'src/')} ${mapped.originalLine + 1}:${mapped.originalColumn + 1} ${frame.functionName || '(anonymous)'}`;
  }
  return `${frame.functionName || '(anonymous)'} ${path || ''}:${frame.lineNumber + 1}`;
}
function aggregate(directory, mode) {
  const rows = new Map();
  let total = 0,
    totalWeight = 0;
  const add = (key, self, inclusive, weight) => {
    let r = rows.get(key);
    if (!r) {
      r = { location: key, self: 0, inclusive: 0, selfWeight: 0 };
      rows.set(key, r);
    }
    r.self += self;
    r.inclusive += inclusive;
    r.selfWeight += weight;
  };
  for (let i = 0; i < repetitions; i++) {
    const profile = JSON.parse(
      readFileSync(
        join(directory, `${i}.${mode === 'cpu' ? 'cpuprofile' : 'heapprofile'}`),
        'utf8',
      ),
    );
    if (mode === 'cpu') {
      const nodes = new Map(profile.nodes.map(n => [n.id, n]));
      const parents = new Map();
      for (const node of profile.nodes)
        for (const child of node.children || []) parents.set(child, node.id);
      for (let j = 0; j < (profile.samples || []).length; j++) {
        const id = profile.samples[j],
          weight = profile.timeDeltas?.[j] || 0;
        total++;
        totalWeight += weight;
        add(location(nodes.get(id).callFrame), 1, 0, weight);
        const seen = new Set();
        let current = id;
        while (current !== undefined) {
          const key = location(nodes.get(current).callFrame);
          if (!seen.has(key)) {
            add(key, 0, 1, 0);
            seen.add(key);
          }
          current = parents.get(current);
        }
      }
    } else {
      function visit(node, ancestors) {
        const key = location(node.callFrame),
          lineage = new Set([...ancestors, key]);
        total += node.selfSize;
        add(key, node.selfSize, 0, 0);
        for (const ancestor of lineage) add(ancestor, 0, node.selfSize, 0);
        for (const child of node.children || []) visit(child, lineage);
      }
      visit(profile.head, new Set());
    }
  }
  const all = [...rows.values()].map(r => ({
    ...r,
    selfPercent: (100 * r.self) / total,
    inclusivePercent: (100 * r.inclusive) / total,
  }));
  return {
    units:
      mode === 'cpu'
        ? 'CPU sample counts, not time. selfWeight/totalWeight are raw microseconds and include inspector boundary stalls; never interpret them as simulation time'
        : 'V8 statistically estimated allocated bytes, including collected objects; not retained memory or exact counts',
    total,
    totalWeight,
    self: all.sort((a, b) => b.self - a.self).slice(0, 40),
    inclusive: [...all].sort((a, b) => b.inclusive - a.inclusive).slice(0, 50),
  };
}
const runs = [];
// Reverse order in repeat 2 to expose order-dependent drift. All runs are isolated fresh processes.
for (let repeat = 1; repeat <= 2; repeat++)
  for (const mode of repeat === 1
    ? ['control', 'cpu', 'allocation']
    : ['allocation', 'cpu', 'control']) {
    const directory = join(outputDirectory, `${mode}-${repeat}`);
    mkdirSync(directory);
    const child = spawnSync(
      process.execPath,
      [
        join(outputDirectory, 'runner.mjs'),
        JSON.stringify({
          inputPath,
          outputDirectory: directory,
          mode,
          repetitions,
          warmups,
          receiptDetail,
        }),
      ],
      {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, NODE_ENV: 'production' },
        timeout: 600000,
        killSignal: 'SIGKILL',
        maxBuffer: 8 * 1024 * 1024,
      },
    );
    if (child.stderr) process.stderr.write(child.stderr);
    if (child.error || child.status !== 0)
      throw new Error(`${mode}: ${child.error?.message || child.stderr || child.status}`);
    const report = JSON.parse(child.stdout);
    if (hash(readFileSync(inputPath)) !== hash(original)) throw new Error('Input changed');
    if (
      runs.length &&
      (report.resultSha256 !== runs[0].resultSha256 ||
        report.receiptSha256 !== runs[0].receiptSha256)
    )
      throw new Error('Modes produced different results');
    if (mode !== 'control') report.profile = aggregate(directory, mode);
    report.repeat = repeat;
    runs.push(report);
    writeFileSync(join(directory, 'summary.json'), JSON.stringify(report, null, 2));
    console.error(`${mode}-${repeat}: median ${report.summary.total.medianMs.toFixed(1)} ms`);
  }
writeFileSync(
  join(outputDirectory, 'report.json'),
  JSON.stringify(
    {
      kind: 'endaxis-simulation-profile',
      version: 1,
      completedAt: new Date().toISOString(),
      provenance,
      repetitions,
      warmups,
      receiptDetail,
      methodology:
        'Production SSR; fresh process per mode/repeat; profiling starts after warmups and brackets simulate (includes unavoidable inspector start/stop boundary samples); no hashing, cloning, output writes, startup, clearCache or warmups inside capture. Cache/checkpoint disabled; immutable definition caches retain normal lifetime. CPU 1000us sampling; allocation 32768-byte sampling including objects collected during capture. No forced GC. Inclusive rows overlap and must not be added; each sample contributes once per unique frame key in a lineage. Control has same inspector connection and result verification but no sampling. Source map positions are function-entry mappings, not exact statement samples.',
      runs,
    },
    null,
    2,
  ),
);
console.log(join(outputDirectory, 'report.json'));
