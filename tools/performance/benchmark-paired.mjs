/** 独立进程的配对暖态测量；默认只校准，不试运行优化候选。 */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { isBuiltin } from 'node:module';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_POLICY, createSchedule, pairedInference } from './benchmark-paired-common.mjs';

const harnessRoot = realpathSync(resolve(dirname(fileURLToPath(import.meta.url)), '../..'));
const entry = join(harnessRoot, 'tools/performance/benchmark-paired-runner.ts');
const helperFiles = [
  entry,
  join(harnessRoot, 'tools/performance/benchmark-paired-common.mjs'),
  join(harnessRoot, 'tools/performance/benchmark-baseline-common.ts'),
];
const hash = value => createHash('sha256').update(value).digest('hex');
const json = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2));
function inside(path, directory) {
  const name = relative(directory, path);
  return name === '' || (!name.startsWith('..') && !isAbsolute(name));
}
function git(root, ...args) {
  return execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: 30000,
  }).trim();
}
function provenance(root) {
  const files = [
    ...new Set(
      git(
        root,
        'ls-files',
        '--cached',
        '--others',
        '--exclude-standard',
        '--',
        'src',
        'packages',
        'package.json',
        'package-lock.json',
      ).split('\n'),
    ),
  ]
    .filter(path => path && !/\.(test|typecheck)\./.test(path))
    .sort();
  const manifest = files.map(path => ({ path, sha256: hash(readFileSync(join(root, path))) }));
  return {
    root,
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
    diffSha256: hash(
      git(
        root,
        'diff',
        '--binary',
        'HEAD',
        '--',
        'src',
        'packages',
        'package.json',
        'package-lock.json',
      ),
    ),
    untracked: git(root, 'ls-files', '--others', '--exclude-standard', '--', 'src', 'packages'),
    sourceSha256: hash(JSON.stringify(manifest)),
    manifest,
  };
}
function bundleManifest(directory) {
  function files(path) {
    return readdirSync(path, { withFileTypes: true }).flatMap(item =>
      item.isDirectory() ? files(join(path, item.name)) : [join(path, item.name)],
    );
  }
  return files(directory)
    .filter(path => path.endsWith('.mjs'))
    .sort()
    .map(path => ({ path: relative(directory, path), sha256: hash(readFileSync(path)) }));
}

/** 构建也由有硬超时的子进程完成；任何跨源码树导入立即失败。 */
async function buildOne({ root, output, otherRoot }) {
  const { build } = await import('vite');
  const dependencyRoots = [
    ...new Set([root, harnessRoot].map(path => realpathSync(join(path, 'node_modules')))),
  ];
  const allowedHelpers = new Set(helperFiles.map(path => realpathSync(path)));
  const modules = [];
  process.env.NODE_ENV = 'production';
  await build({
    root,
    configFile: false,
    mode: 'production',
    logLevel: 'error',
    publicDir: false,
    ssr: { noExternal: true },
    plugins: [
      {
        name: 'paired-production-source-boundary',
        enforce: 'pre',
        async resolveId(source, importer) {
          if (importer === entry && source.startsWith('../../src/'))
            return this.resolve(resolve(root, source.slice(6)), undefined, { skipSelf: true });
        },
        generateBundle() {
          for (const id of this.getModuleIds()) {
            if (isBuiltin(id)) continue;
            const info = this.getModuleInfo(id);
            if (info?.isExternal) throw new Error(`未打包的非 Node 依赖: ${id}`);
            if (id.startsWith('\0')) continue;
            const path = id.split('?')[0];
            if (!isAbsolute(path)) throw new Error(`无法核验模块来源: ${id}`);
            const actual = realpathSync(path);
            const selectedProduction =
              inside(actual, join(root, 'src')) || inside(actual, join(root, 'packages'));
            const foreignProduction = [harnessRoot, otherRoot].some(
              candidate =>
                candidate !== root &&
                (inside(actual, join(candidate, 'src')) ||
                  inside(actual, join(candidate, 'packages'))),
            );
            if (
              foreignProduction ||
              (!selectedProduction &&
                !allowedHelpers.has(actual) &&
                !dependencyRoots.some(directory => inside(actual, directory)))
            )
              throw new Error(`混合源码边界: ${actual}; 当前源码根 ${root}`);
            modules.push({
              path: actual,
              sha256: hash(readFileSync(actual)),
              production: selectedProduction,
            });
          }
        },
      },
    ],
    build: {
      ssr: entry,
      target: 'node22',
      outDir: output,
      emptyOutDir: false,
      minify: false,
      sourcemap: true,
      rollupOptions: {
        output: { entryFileNames: 'runner.mjs', chunkFileNames: '[name]-[hash].mjs' },
      },
    },
  });
  json(join(output, 'source-boundary.json'), { root, modules, executable: bundleManifest(output) });
}

const usage = `用法：node tools/performance/benchmark-paired.mjs <baseline-root> <new-output-dir> <project.json>...
  --mode calibration|comparison   默认 calibration；只测同一 bundle 的 A/A，要求两树生产源码相同
  --seed 20261001                 测量顺序种子，UInt32；不改变项目随机设置
  --pairs 6                      每轴、每种对照的进程对数，6–30 的偶数
  --repetitions 5                 每进程测量 3–5 次，作为一个短块
  --min-warmups 8 --max-warmups 20 冷首跑之后的有界热身，至少 8、最多 20
  --timeout-seconds 600           每构建/测量进程硬超时，10–1200
  --budget-seconds 3600           整批硬预算，30–14400；不足时中止，保留已有样本
最多 8 个输入、240 个测量进程；首个独立方案，普通回执，关闭切面复用并逐轮清服务缓存。
校准预声明目标：每轴 wall/CPU 的近似 95% 配对进程区间 ±3%，无热身收敛失败。
A/A 未通过只报告 sensitivity-unresolved，不自动增加预算。comparison 显式运行 AB 与嵌入 AA；完成不代表接受优化。`;

async function main() {
  const args = process.argv.slice(2);
  if (args[0] === '--internal-build') {
    await buildOne(JSON.parse(args[1]));
    return;
  }
  if (args.includes('--help')) {
    console.log(usage);
    return;
  }
  if (args.length < 3) throw new Error(usage);
  // 不继承可能改变 GC、JIT、线程或采样的 Node 参数。
  if (process.execArgv.length || process.env.NODE_OPTIONS?.trim())
    throw new Error('请直接用 node 运行，清除 NODE_OPTIONS；不得注入 GC/JIT/采样/线程参数');
  const baseline = realpathSync(resolve(args.shift()));
  const output = resolve(args.shift());
  const candidate = harnessRoot;
  if (existsSync(output)) throw new Error('输出目录必须不存在，不能覆盖证据');
  const inputs = [];
  const policy = { ...DEFAULT_POLICY };
  let mode = 'calibration',
    seed = 20261001,
    timeoutSeconds = 600,
    budgetSeconds = 3600;
  const integer = (text, name, minimum, maximum) => {
    const value = Number(text);
    if (!Number.isSafeInteger(value) || value < minimum || value > maximum)
      throw new Error(`${name} 必须为 ${minimum}–${maximum} 的整数`);
    return value;
  };
  while (args.length) {
    const arg = args.shift();
    if (arg === '--mode') {
      mode = args.shift();
      if (!['calibration', 'comparison'].includes(mode)) throw new Error(usage);
    } else if (arg === '--seed') seed = integer(args.shift(), arg, 0, 0xffffffff);
    else if (arg === '--pairs') policy.pairs = integer(args.shift(), arg, 6, 30);
    else if (arg === '--repetitions') policy.repetitions = integer(args.shift(), arg, 3, 5);
    else if (arg === '--min-warmups') policy.minWarmups = integer(args.shift(), arg, 8, 20);
    else if (arg === '--max-warmups') policy.maxWarmups = integer(args.shift(), arg, 8, 20);
    else if (arg === '--timeout-seconds') timeoutSeconds = integer(args.shift(), arg, 10, 1200);
    else if (arg === '--budget-seconds') budgetSeconds = integer(args.shift(), arg, 30, 14400);
    else if (arg.startsWith('--')) throw new Error(`未知参数 ${arg}`);
    else inputs.push(realpathSync(resolve(arg)));
  }
  assert.ok(policy.pairs % 2 === 0, '配对数必须为偶数');
  assert.ok(
    policy.minWarmups + policy.warmConsecutive - 1 <= policy.maxWarmups,
    '暖态上限不足以完成连续判定',
  );
  assert.ok(inputs.length >= 1 && inputs.length <= 8, '需要 1–8 个输入');
  assert.equal(new Set(inputs).size, inputs.length, '输入不能重复');
  const schedule = createSchedule(inputs.length, policy.pairs, seed, mode);
  assert.ok(schedule.length * 2 <= 240, '整批超过 240 个测量进程');
  const inputManifest = inputs.map((path, axis) => {
    assert.ok(statSync(path).size <= 32 * 1024 * 1024, '输入超过 32 MiB');
    const source = readFileSync(path);
    const parsed = JSON.parse(source);
    assert.ok(
      Array.isArray(parsed.scenarios) &&
        parsed.scenarios.length >= 1 &&
        parsed.scenarios.length <= 100,
      '需要 1–100 个方案的项目',
    );
    return { axis, path, name: basename(path), sha256: hash(source) };
  });
  const started = Date.now();
  const deadline = started + budgetSeconds * 1000;
  const sources = { A: provenance(baseline), B: provenance(candidate) };
  if (mode === 'calibration')
    assert.equal(
      sources.A.sourceSha256,
      sources.B.sourceSha256,
      '校准不能含候选差异；先恢复相同生产源码',
    );
  assert.equal(
    hash(readFileSync(join(baseline, 'package-lock.json'))),
    hash(readFileSync(join(candidate, 'package-lock.json'))),
    '两树依赖锁文件不同',
  );
  const harnessManifest = [...helperFiles, fileURLToPath(import.meta.url)].map(path => ({
    path,
    sha256: hash(readFileSync(path)),
  }));
  mkdirSync(output);
  const report = {
    kind: 'endaxis-paired-benchmark',
    version: 1,
    status: 'running',
    mode,
    seed,
    policy,
    startedAt: new Date(started).toISOString(),
    completedAt: null,
    timeoutSeconds,
    budgetSeconds,
    sources,
    harnessManifest,
    inputs: inputManifest,
    schedule,
    builds: {},
    processes: [],
    pairs: [],
    analysis: [],
    failure: null,
    methodology: {
      inferenceUnit:
        'Paired independent-process medians; inner runs are correlated and are not additional inference units.',
      timing:
        'Wall and process user+system CPU both bracket await service.simulate. Service total/simulation/projection are separately retained. Cold first run excludes startup/repository/module loading. Cache clearing, hashing, source checks, output writes and building are outside service timing, but can affect subsequent GC/system state. No forced GC, profiler or runtime flags.',
      controls:
        'AA labels use the exact same runner path and all executable chunk bytes; separate OS processes. In comparison, adjacent AB and AA pair groups are interleaved in seeded order. Half AB and half BA per axis/kind.',
      convergence:
        'Two adjacent four-run windows: both wall/CPU median ratio within [1/1.03,1.03] and each window relative MAD <=0.05, two consecutive passing evaluations after minWarmups. This is a bounded stability heuristic, not proof of JIT convergence. Exhaustion retains the fixed measured block as ineligible; all planned groups continue without retries.',
      gate: 'Predeclared accuracy 3%; approximate paired-log Student-t 95% interval per axis for wall AND CPU, containing1 and contained within [1/1.03,1.03] for AA, with all processes converged. Failure means sensitivity unresolved. No automatic extra pairs, restarts or budget expansion. comparison-completed means measurement finished, never optimization accepted; AB intervals require review.',
      limits:
        'Intervals with six pair groups are approximate, conditional on a warmup stopping rule and independence/normality assumptions; not a browser latency claim, allocation count, multiplicity-adjusted guarantee or proof of checkpoint equivalence.',
    },
  };
  const save = () => json(join(output, 'summary.json'), report);
  save();
  function unchanged() {
    for (const [label, source] of Object.entries(sources))
      assert.deepEqual(provenance(source.root), source, `${label} 源码在测量期间变化`);
    for (const item of inputManifest)
      assert.equal(hash(readFileSync(item.path)), item.sha256, '输入文件变化');
    for (const item of harnessManifest)
      assert.equal(hash(readFileSync(item.path)), item.sha256, '测量工具变化');
    for (const build of Object.values(report.builds)) {
      assert.deepEqual(bundleManifest(build.directory), build.executable, '可执行 bundle 变化');
      for (const module of build.modules)
        assert.equal(
          hash(readFileSync(module.path)),
          module.sha256,
          `已加载模块变化 ${module.path}`,
        );
    }
  }
  function child(args, cwd, prefix) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('整批预算耗尽');
    const result = spawnSync(process.execPath, args, {
      cwd,
      encoding: 'utf8',
      timeout: Math.min(timeoutSeconds * 1000, remaining),
      killSignal: 'SIGKILL',
      maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, NODE_ENV: 'production', NODE_OPTIONS: '' },
    });
    writeFileSync(`${prefix}.stdout.log`, result.stdout ?? '');
    writeFileSync(`${prefix}.stderr.log`, result.stderr ?? '');
    json(`${prefix}.exit.json`, {
      status: result.status,
      signal: result.signal,
      error: result.error?.message ?? null,
    });
    if (result.error || result.status !== 0)
      throw new Error(
        `${prefix}: 子进程失败 ${result.error?.message ?? result.stderr ?? result.status}`,
      );
  }
  try {
    for (const label of mode === 'calibration' ? ['A'] : ['A', 'B']) {
      const root = sources[label].root;
      const directory = join(output, `build-${label}`);
      const buildStarted = Date.now();
      child(
        [
          fileURLToPath(import.meta.url),
          '--internal-build',
          JSON.stringify({
            root,
            output: directory,
            otherRoot: label === 'A' ? candidate : baseline,
          }),
        ],
        harnessRoot,
        join(output, `build-${label}`),
      );
      report.builds[label] = {
        directory,
        buildMs: Date.now() - buildStarted,
        ...JSON.parse(readFileSync(join(directory, 'source-boundary.json'), 'utf8')),
      };
      unchanged();
      save();
    }
    const expected = new Map();
    for (const group of schedule) {
      const pair = {
        group: group.group,
        axis: group.axis,
        pair: group.pair,
        kind: group.kind,
        order: group.order,
      };
      for (const arm of group.arms) {
        unchanged();
        const prefix = join(
          output,
          `group-${String(group.group).padStart(3, '0')}-axis-${group.axis}-${group.kind}-${arm.label}`,
        );
        const label = { ...group, arms: undefined, arm: arm.label, bundle: arm.bundle };
        const options = {
          input: inputs[group.axis],
          output: `${prefix}.json`,
          expectedInputSha256: inputManifest[group.axis].sha256,
          label,
          policy,
        };
        const build = report.builds[arm.bundle];
        const runner = join(build.directory, 'runner.mjs');
        child([runner, JSON.stringify(options)], sources[arm.bundle].root, prefix);
        const data = JSON.parse(readFileSync(options.output, 'utf8'));
        report.processes.push({
          ...label,
          runner,
          executable: build.executable,
          resultFile: options.output,
          data,
        });
        save();
        unchanged();
        assert.deepEqual(data.label, JSON.parse(JSON.stringify(label)), '进程标签不符');
        assert.ok(
          ['completed', 'warmup-exhausted'].includes(data.status),
          `进程未完成: ${data.status}`,
        );
        assert.equal(data.measuredSamples.length, policy.repetitions);
        const previous = expected.get(group.axis);
        if (previous)
          assert.deepEqual(data.identity, previous, '跨进程/版本的输入、完整结果或有序回执不同');
        else expected.set(group.axis, data.identity);
        pair[arm.label] = data;
        console.error(
          `${group.kind} axis=${group.axis} pair=${group.pair} order=${group.order} arm=${arm.label} warmups=${data.warmupSamples.length} wall=${data.summary.wallMs.medianMs.toFixed(2)}ms cpu=${data.summary.cpuMs.medianMs.toFixed(2)}ms`,
        );
      }
      report.pairs.push(pair);
      save();
    }
    for (let axis = 0; axis < inputs.length; axis++) {
      for (const kind of mode === 'calibration' ? ['AA'] : ['AA', 'AB']) {
        const pairs = report.pairs.filter(pair => pair.axis === axis && pair.kind === kind);
        assert.equal(pairs.length, policy.pairs);
        report.analysis.push({
          axis,
          kind,
          eligible: pairs.every(pair => pair.A.warmConverged && pair.B.warmConverged),
          wall: pairedInference(pairs, 'wallMs'),
          cpu: pairedInference(pairs, 'cpuMs'),
        });
      }
    }
    report.convergenceFailures = report.processes
      .filter(process => !process.data.warmConverged)
      .map(process => ({
        group: process.group,
        axis: process.axis,
        arm: process.arm,
        kind: process.kind,
        resultFile: process.resultFile,
      }));
    const controlsPass =
      report.convergenceFailures.length === 0 &&
      report.analysis
        .filter(row => row.kind === 'AA')
        .every(row => row.wall.calibrationPass && row.cpu.calibrationPass);
    report.status = controlsPass
      ? mode === 'calibration'
        ? 'calibrated'
        : 'comparison-completed'
      : 'sensitivity-unresolved';
    if (!controlsPass) process.exitCode = 2;
    unchanged();
  } catch (error) {
    report.status = 'invalid';
    report.failure = error instanceof Error ? (error.stack ?? error.message) : String(error);
    process.exitCode = 1;
  } finally {
    report.completedAt = new Date().toISOString();
    save();
  }
  console.log(JSON.stringify({ status: report.status, summary: join(output, 'summary.json') }));
}
await main();
