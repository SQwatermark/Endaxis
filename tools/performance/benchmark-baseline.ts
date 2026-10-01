/** 生产构建只执行一次；每个方案使用独立进程，避免上一方案的 JIT 与定义缓存预热。 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { boundedInteger, sha256, type BaselineOptions } from './benchmark-baseline-common.ts';

const usage = `用法：node --experimental-strip-types tools/performance/benchmark-baseline.ts <project.json> [scenario-index|all]
  --repetitions 20       测量次数，范围 1–200
  --warmups 3            冷首跑之后的热身次数，范围 0–20
  --timeout-seconds 600  每个方案子进程的硬超时，范围 5–3600
  --decompose           另跑公开会话 API 的阶段诊断，不与正式服务计时相加
输入上限 32 MiB、100 个方案；单方案最多 108000 帧（含准备段）、10000 个技能块。
标准输出每个方案一行 JSON；首次耗时不含模块、定义加载及生产构建。`;

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(usage);
  process.exit(0);
}
const input = args.shift();
if (input === undefined || input.startsWith('--')) throw new Error(usage);
const selector = args[0] !== undefined && !args[0].startsWith('--') ? args.shift()! : '0';
let repetitions = 20;
let warmups = 3;
let timeoutSeconds = 600;
let decompose = false;
while (args.length > 0) {
  const flag = args.shift();
  if (flag === '--decompose') {
    decompose = true;
    continue;
  }
  if (!['--repetitions', '--warmups', '--timeout-seconds'].includes(flag!))
    throw new Error(`未知参数 ${flag}\n${usage}`);
  const value = args.shift();
  if (value === undefined) throw new Error(`${flag} 缺少数值`);
  if (flag === '--repetitions') repetitions = boundedInteger(value, flag, 1, 200);
  if (flag === '--warmups') warmups = boundedInteger(value, flag, 0, 20);
  if (flag === '--timeout-seconds') timeoutSeconds = boundedInteger(value, flag, 5, 3600);
}

const inputPath = resolve(input);
const maxInputBytes = 32 * 1024 * 1024;
if (statSync(inputPath).size > maxInputBytes) throw new Error('输入文件超过 32 MiB');
const source = readFileSync(inputPath, 'utf8');
const envelope: unknown = JSON.parse(source);
if (
  envelope === null ||
  typeof envelope !== 'object' ||
  !('scenarios' in envelope) ||
  !Array.isArray(envelope.scenarios) ||
  envelope.scenarios.length < 1 ||
  envelope.scenarios.length > 100
)
  throw new Error('输入必须是包含 1–100 个方案的正式项目 JSON；旧存档请先转换');
const indices =
  selector === 'all'
    ? envelope.scenarios.map((_, index) => index)
    : [boundedInteger(selector, 'scenario-index', 0, envelope.scenarios.length - 1)];
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

function git(...parameters: string[]): string | null {
  try {
    return execFileSync('git', parameters, {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024,
    }).trim();
  } catch {
    return null;
  }
}

const diff = git('diff', '--binary', 'HEAD', '--', 'src', 'packages', 'package-lock.json');
const untracked = git('ls-files', '--others', '--exclude-standard', '--', 'src', 'packages');
const outputDirectory = mkdtempSync(join(tmpdir(), 'endaxis-baseline-'));
try {
  process.env.NODE_ENV = 'production';
  const buildStarted = performance.now();
  await build({
    root,
    configFile: false,
    mode: 'production',
    logLevel: 'error',
    publicDir: false,
    ssr: { noExternal: true },
    build: {
      ssr: resolve(root, 'tools/performance/benchmark-baseline-runner.ts'),
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
  const provenance: BaselineOptions['provenance'] = {
    gitHead: git('rev-parse', 'HEAD'),
    engineGitRevision: git('log', '-1', '--format=%H', '--', 'src/core', 'src/application'),
    dataGitRevision: git(
      'log',
      '-1',
      '--format=%H',
      '--',
      'src/data',
      'packages/game-data-contract',
    ),
    engineWorkingTreeDirty: diff === null ? null : diff !== '' || untracked !== '',
    engineDiffSha256: diff === null ? null : sha256(diff),
    productionBuildMs: performance.now() - buildStarted,
  };
  for (const scenarioIndex of indices) {
    const options: BaselineOptions = {
      inputPath,
      scenarioIndex,
      repetitions,
      warmups,
      decompose,
      provenance,
    };
    const child = spawnSync(
      process.execPath,
      [join(outputDirectory, 'runner.mjs'), JSON.stringify(options)],
      {
        cwd: root,
        env: { ...process.env, NODE_ENV: 'production' },
        encoding: 'utf8',
        timeout: timeoutSeconds * 1000,
        killSignal: 'SIGKILL',
        maxBuffer: 8 * 1024 * 1024,
      },
    );
    if (child.stderr) process.stderr.write(child.stderr);
    if (child.error !== undefined || child.status !== 0)
      throw new Error(
        `方案 ${scenarioIndex} 失败（上限 ${timeoutSeconds}s）：${child.error?.message ?? child.signal ?? child.status}`,
      );
    // 只允许完整 JSON 报告进入 stdout，避免把构建日志误读为测量值。
    const report: unknown = JSON.parse(child.stdout);
    if (sha256(readFileSync(inputPath)) !== sha256(source)) throw new Error('测量期间输入文件改变');
    console.log(JSON.stringify(report));
  }
} finally {
  rmSync(outputDirectory, { recursive: true, force: true });
}
