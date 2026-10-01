/** Build-time-only diagnostics and uninstrumented fresh-process timing controls. */
import { build } from 'vite';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { graphNodeInstrumentation } from './graph-node-instrumentation.mjs';
const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2)
  throw Error(
    'Usage: node tools/performance/graph-node-diagnostics.mjs <new-output-directory> [diagnostic|control|both]',
  );
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..'),
  output = resolve(args[0]),
  mode = args[1] ?? 'both';
if (!['diagnostic', 'control', 'both'].includes(mode)) throw Error('Bad mode');
if (existsSync(output)) throw Error('Output must not exist');
mkdirSync(output, { recursive: true });
const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8' }).trim();
const sha = v => createHash('sha256').update(v).digest('hex');
const provenance = {
  gitHead: git('rev-parse', 'HEAD'),
  engineDiffSha256: sha(
    git('diff', '--binary', 'HEAD', '--', 'src', 'packages', 'package-lock.json'),
  ),
  node: process.version,
  v8: process.versions.v8,
  createdAt: new Date().toISOString(),
  tools: Object.fromEntries(
    [
      'graph-node-diagnostics.mjs',
      'graph-node-diagnostics-runner.ts',
      'graph-node-instrumentation.mjs',
      'graph-node-probe.ts',
    ].map(n => [n, sha(readFileSync(join(root, 'tools/performance', n)))]),
  ),
};
const fixtures = join(root, 'tools/performance/fixtures/public-timelines');
const files = readdirSync(fixtures).filter(f => f.endsWith('.project.json'));
process.env.NODE_ENV = 'production';
const results = [];
for (const diagnostic of mode === 'both' ? [true, false] : [mode === 'diagnostic']) {
  const outDir = join(output, diagnostic ? 'diagnostic-build' : 'control-build');
  await build({
    root,
    configFile: false,
    mode: 'production',
    logLevel: 'error',
    publicDir: false,
    plugins: diagnostic ? [graphNodeInstrumentation()] : [],
    ssr: { noExternal: true },
    build: {
      ssr: join(root, 'tools/performance/graph-node-diagnostics-runner.ts'),
      target: 'node22',
      outDir,
      emptyOutDir: false,
      minify: false,
      rollupOptions: { output: { entryFileNames: 'runner.mjs' } },
    },
  });
  for (let round = 0; round < (diagnostic ? 1 : 2); round++)
    for (const file of round ? [...files].reverse() : files) {
      const opts = {
        inputPath: join(fixtures, file),
        diagnostic,
        runs: diagnostic ? 2 : 21,
        warmups: 4,
      };
      const child = spawnSync(
        process.execPath,
        [join(outDir, 'runner.mjs'), JSON.stringify(opts)],
        {
          cwd: root,
          encoding: 'utf8',
          timeout: 600000,
          maxBuffer: 64 * 1024 * 1024,
          env: { ...process.env, NODE_ENV: 'production' },
        },
      );
      if (child.status !== 0) throw Error(child.stderr || child.stdout || String(child.error));
      const result = { file, round, ...JSON.parse(child.stdout.trim().split('\n').at(-1)) };
      results.push(result);
      writeFileSync(
        join(output, `${diagnostic ? 'diagnostic' : 'control'}-${round}-${file}`),
        JSON.stringify(result),
      );
      console.error(
        `${diagnostic ? 'diagnostic' : 'control'} ${round} ${file} ${result.summary?.medianMs ?? ''}`,
      );
      writeFileSync(join(output, 'summary.json'), JSON.stringify({ provenance, results }));
    }
}
if (
  provenance.engineDiffSha256 !==
  sha(git('diff', '--binary', 'HEAD', '--', 'src', 'packages', 'package-lock.json'))
)
  throw Error('Source changed');
