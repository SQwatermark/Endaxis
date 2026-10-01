import { createHash } from 'node:crypto';
import { build } from 'vite';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
const startedAt = new Date().toISOString();
const sha = input => createHash('sha256').update(input).digest('hex');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const [oldArg, sourceArg, outArg] = process.argv.slice(2);
if (!oldArg || !sourceArg || !outArg)
  throw Error(
    'Usage: node tools/performance/benchmark-compare-versions.mjs <pre-v3-worktree> <original-input-dir> <output-dir>',
  );
const old = resolve(oldArg),
  sourceDir = resolve(sourceArg),
  out = resolve(outArg);
if (out === old || out === root || out === sourceDir)
  throw Error('Output directory must be separate from source trees and inputs');
mkdirSync(out, { recursive: true });
const repetitions = Number(process.env.BENCH_REPETITIONS ?? 20);
const warmups = Number(process.env.BENCH_WARMUPS ?? 3);
if (
  !Number.isSafeInteger(repetitions) ||
  repetitions < 1 ||
  repetitions > 200 ||
  !Number.isSafeInteger(warmups) ||
  warmups < 0 ||
  warmups > 20
)
  throw Error('Invalid repetitions/warmups');
const fixtureDir = join(root, 'tools/performance/fixtures/public-timelines');
const manifest = JSON.parse(readFileSync(join(fixtureDir, 'manifest.json'), 'utf8'));
for (const sample of manifest.samples) {
  for (const [path, expected] of [
    [join(sourceDir, sample.sourceFilename), sample.sourceSha256],
    [join(fixtureDir, sample.projectFile), sample.projectSha256],
  ]) {
    if (sha(readFileSync(path)) !== expected) throw Error(`Fixture hash mismatch: ${path}`);
  }
}
process.env.NODE_ENV = 'production';
const buildOptions = {
  configFile: false,
  mode: 'production',
  logLevel: 'error',
  publicDir: false,
  ssr: { noExternal: true },
  build: {
    target: 'node22',
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    rollupOptions: {
      output: { entryFileNames: 'runner.mjs', chunkFileNames: '[name]-[hash].mjs' },
    },
  },
};
await build({
  ...buildOptions,
  root: old,
  resolve: {
    dedupe: ['vue', 'pinia'],
    alias: {
      '@': join(old, 'src'),
      'legacy-timeline-store': join(old, 'src/stores/timelineStore.ts'),
      'legacy-simulation-composable': join(old, 'src/stores/timeline/simulation.ts'),
    },
  },
  plugins: [
    {
      name: 'capture-original-simulation-dependencies',
      enforce: 'pre',
      transform(code, id) {
        if (id === join(old, 'src/stores/timelineStore.ts')) {
          if (!code.includes("from '@/stores/timeline/simulation'"))
            throw Error('Unsupported legacy store import');
          return code.replace(
            "from '@/stores/timeline/simulation'",
            `from '${join(root, 'tools/performance/benchmark-pre-v3-capture.mjs')}'`,
          );
        }
      },
    },
  ],
  build: {
    ...buildOptions.build,
    ssr: join(root, 'tools/performance/benchmark-pre-v3-runner.mjs'),
    outDir: join(out, 'old-bundle'),
  },
});
await build({
  ...buildOptions,
  root,
  build: {
    ...buildOptions.build,
    ssr: join(root, 'tools/performance/benchmark-baseline-runner.ts'),
    outDir: join(out, 'new-bundle'),
  },
});
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
const provenance = {
  gitHead: git(root, 'rev-parse', 'HEAD'),
  engineGitRevision: git(root, 'log', '-1', '--format=%H', '--', 'src/core', 'src/application'),
  dataGitRevision: git(
    root,
    'log',
    '-1',
    '--format=%H',
    '--',
    'src/data',
    'packages/game-data-contract',
  ),
  engineWorkingTreeDirty: git(root, 'status', '--porcelain', '--', 'src', 'packages') !== '',
  engineDiffSha256: null,
  productionBuildMs: null,
};
const sourceProvenance = {
  oldHead: git(old, 'rev-parse', 'HEAD'),
  oldDataTree: git(old, 'rev-parse', 'HEAD:src/data'),
  oldLockSha256: sha(readFileSync(join(old, 'package-lock.json'))),
  newHead: provenance.gitHead,
  newLockSha256: sha(readFileSync(join(root, 'package-lock.json'))),
};
if (
  git(old, 'status', '--porcelain', '--', 'src', 'package-lock.json') !== '' ||
  provenance.engineWorkingTreeDirty
)
  throw Error('Production trees must be clean');
const results = [];
for (let i = 0; i < manifest.samples.length; i++) {
  const sample = manifest.samples[i];
  const order =
    i % 2 === 0 ? ['old-native', 'old-matched', 'new'] : ['new', 'old-matched', 'old-native'];
  const pair = {
    id: sample.id,
    title: sample.title,
    order,
    oldHead: git(old, 'rev-parse', 'HEAD'),
    newHead: provenance.gitHead,
  };
  for (const version of order) {
    const opts = {
      inputPath: version.startsWith('old')
        ? join(sourceDir, sample.sourceFilename)
        : join(fixtureDir, sample.projectFile),
      scenarioIndex: version.startsWith('old') ? sample.sourceScenarioIndex : 0,
      repetitions,
      warmups,
      decompose: false,
      matchHorizon: version === 'old-matched',
      provenance,
    };
    const child = spawnSync(
      process.execPath,
      [
        join(out, `${version.startsWith('old') ? 'old' : 'new'}-bundle/runner.mjs`),
        JSON.stringify(opts),
      ],
      {
        cwd: version.startsWith('old') ? old : root,
        env: { ...process.env, NODE_ENV: 'production' },
        encoding: 'utf8',
        timeout: 600000,
        maxBuffer: 32 * 1024 * 1024,
      },
    );
    if (child.status !== 0)
      throw Error(`${version} ${sample.id}: ${child.stderr}\n${child.stdout}`);
    if (child.stderr) process.stderr.write(child.stderr);
    pair[version] = JSON.parse(child.stdout);
    const expectedHash = version.startsWith('old') ? sample.sourceSha256 : sample.projectSha256;
    if (
      sha(readFileSync(opts.inputPath)) !== expectedHash ||
      (version.startsWith('old')
        ? pair[version].sourceSha256
        : pair[version].input.sourceSha256) !== expectedHash
    )
      throw Error('Input changed');
    if (version === 'new') delete pair[version].input.path;
    writeFileSync(
      join(out, `${sample.id}.${version}.json`),
      JSON.stringify(pair[version], null, 2) + '\n',
    );
    console.error(`${version} ${sample.title}: ${JSON.stringify(pair[version].summary)}`);
  }
  if (
    ![
      pair.new.scenario.fps,
      pair.new.scenario.prepFrames,
      pair.new.scenario.endFrame,
      pair['old-matched'].effectiveEndlineSeconds,
    ].every(Number.isFinite) ||
    pair.new.scenario.fps <= 0
  )
    throw Error('Non-finite or invalid horizon metadata');
  if (
    pair['old-matched'].castCount !== pair.new.scenario.castCount ||
    Math.abs(
      pair['old-matched'].effectiveEndlineSeconds -
        pair.new.scenario.prepFrames / pair.new.scenario.fps -
        pair.new.scenario.endFrame / pair.new.scenario.fps,
    ) >
      1 / pair.new.scenario.fps
  )
    throw Error('Cast count or effective horizon mismatch');
  results.push(pair);
  writeFileSync(
    join(out, 'comparison.json'),
    JSON.stringify(
      {
        kind: 'endaxis-pre-v3-vs-v3',
        version: 1,
        startedAt,
        completedAt: new Date().toISOString(),
        sourceProvenance,
        methodology: {
          repetitions,
          warmups,
          order:
            'serial fresh processes; alternate old-native/old-matched/new versus reverse per scenario',
          forcedGc: false,
        },
        results,
      },
      null,
      2,
    ) + '\n',
  );
  if (process.env.BENCH_SMOKE === '1') break;
}
