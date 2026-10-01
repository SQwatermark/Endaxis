/** 同一生产构建的普通/详细回执对照；只允许四类明确的执行跟踪及其身份重排。 */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { deserialize } from 'node:v8';
import { isDeepStrictEqual } from 'node:util';
import { build } from 'vite';

const usage = `用法：node tools/performance/verify-optional-execution-receipts.mjs <new-output-dir> <project.json>...
  --repetitions 20  每个模式每轮正式测量次数，1–200
  --warmups 3       冷首跑之后的热身次数，0–20
  --rounds 2        独立进程对照轮数，1–4；偶数轮反向遍历输入及模式
  --allow-known-projectile-reset-failure
                   仅允许显式报告已知 missing projectile reset handler 0 恢复故障
每进程硬超时 600 秒，输入文件上限 32 MiB。默认任何恢复故障使验收失败。`;
const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log(usage);
  process.exit(0);
}
const outputArgument = args.shift();
if (!outputArgument || outputArgument.startsWith('--')) throw new Error(usage);
const inputs = [];
let repetitions = 20,
  warmups = 3,
  rounds = 2,
  allowKnownFailure = false;
while (args.length) {
  const value = args.shift();
  if (value === '--allow-known-projectile-reset-failure') {
    allowKnownFailure = true;
    continue;
  }
  if (['--repetitions', '--warmups', '--rounds'].includes(value)) {
    const count = Number(args.shift());
    const [minimum, maximum] =
      value === '--warmups' ? [0, 20] : value === '--rounds' ? [1, 4] : [1, 200];
    if (!Number.isSafeInteger(count) || count < minimum || count > maximum)
      throw new Error(`${value} 必须是 ${minimum}–${maximum} 的整数`);
    if (value === '--repetitions') repetitions = count;
    if (value === '--warmups') warmups = count;
    if (value === '--rounds') rounds = count;
  } else if (value.startsWith('--')) throw new Error(`未知参数 ${value}`);
  else inputs.push(resolve(value));
}
if (!inputs.length || inputs.length > 100) throw new Error(usage);
assert.equal(
  new Set(inputs.map(input => basename(input, '.project.json'))).size,
  inputs.length,
  '输入文件名必须唯一',
);
for (const input of inputs) assert.ok(statSync(input).size <= 32 * 1024 * 1024, '输入超过 32 MiB');
const root = process.cwd(),
  output = resolve(outputArgument);
mkdirSync(output); // 不覆盖已有证据
const digest = data => createHash('sha256').update(data).digest('hex');
function git(...parameters) {
  return execFileSync('git', parameters, {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  }).trim();
}
const sourceFingerprint = () =>
  digest(
    git(
      'ls-files',
      '--cached',
      '--others',
      '--exclude-standard',
      '--',
      'src',
      'packages',
      'package-lock.json',
    )
      .split('\n')
      .filter(path => path && !/\.(test|typecheck)\./.test(path))
      .sort()
      .map(path => `${path}\0${digest(readFileSync(path))}`)
      .join('\n'),
  );
const engineSha256 = sourceFingerprint();
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
    ssr: resolve('tools/performance/verify-optional-execution-receipts-runner.ts'),
    target: 'node22',
    outDir: join(output, 'build'),
    emptyOutDir: false,
    minify: false,
    sourcemap: true,
    rollupOptions: { output: { entryFileNames: 'runner.mjs' } },
  },
});
const provenance = {
  gitHead: git('rev-parse', 'HEAD'),
  verifierSha256: digest(readFileSync('tools/performance/verify-optional-execution-receipts.mjs')),
  runnerSha256: digest(
    readFileSync('tools/performance/verify-optional-execution-receipts-runner.ts'),
  ),
  engineSourceSha256: engineSha256,
  workingTreeStatus: git('status', '--porcelain', '--', 'src', 'packages', 'package-lock.json'),
  productionBuildMs: performance.now() - buildStarted,
};
const executionEvents = new Set([
  'CombatStepReached',
  'CombatConditionEvaluated',
  'TimelineActionStarted',
  'TimelineActionEnded',
]);
function same(actual, expected, label) {
  assert.ok(isDeepStrictEqual(actual, expected), `${label} differs`);
}
function mapped(sequence, mapping) {
  if (sequence === null) return null;
  assert.ok(mapping.has(sequence), `dangling reference to removed/missing receipt ${sequence}`);
  return mapping.get(sequence);
}
// 仅 remap CombatObjectRef 的判别联合，不能改写连携序号、技能施放序号或程序执行序列。
function remapReferences(value, mapping, seen = new WeakMap()) {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  const result =
    value instanceof Map
      ? new Map()
      : value instanceof Set
        ? new Set()
        : Array.isArray(value)
          ? []
          : {};
  seen.set(value, result);
  if (value instanceof Map) {
    for (const [key, item] of value)
      result.set(remapReferences(key, mapping, seen), remapReferences(item, mapping, seen));
  } else if (value instanceof Set) {
    for (const item of value) result.add(remapReferences(item, mapping, seen));
  } else {
    for (const [key, item] of Object.entries(value))
      result[key] = remapReferences(item, mapping, seen);
    if ((value.kind === 'receipt' || value.kind === 'modifier') && 'sequence' in value)
      result.sequence = mapped(value.sequence, mapping);
  }
  return result;
}
function receiptMapping(detailed, standard) {
  const mapping = new Map();
  let retained = 0;
  for (let index = 0; index < detailed.length; index++) {
    const entry = detailed[index];
    assert.equal(entry.sequence, index, '详细回执序号不连续');
    if (executionEvents.has(entry.event)) continue;
    assert.ok(standard[retained], `missing retained receipt ${index}`);
    assert.equal(standard[retained].sequence, retained, '普通回执序号不连续');
    assert.ok(!executionEvents.has(standard[retained].event), '普通模式仍含执行跟踪');
    mapping.set(entry.sequence, retained++);
  }
  assert.equal(retained, standard.length, '普通模式回执数量不符');
  return mapping;
}
function normalizeResult(result, mapping) {
  const copy = remapReferences(result, mapping);
  assert.equal(copy.receiptDetail, 'detailed');
  copy.receiptDetail = 'standard'; // 唯一允许改变的结果元数据
  copy.receiptEntries = copy.receiptEntries
    .filter(entry => mapping.has(entry.sequence))
    .map(entry => ({ ...entry, sequence: mapped(entry.sequence, mapping) }));
  for (const curve of [
    copy.resourceCurves.sp,
    ...copy.resourceCurves.ultimateEnergy,
    copy.enemyHealthCurve,
    copy.poiseCurve,
  ])
    for (const point of curve.points) point.sequence = mapped(point.sequence, mapping);
  for (const key of ['availabilityDiagnostics', 'executionDiagnostics', 'comboWindowDiagnostics'])
    for (const diagnostic of copy[key])
      diagnostic.receiptSequences = diagnostic.receiptSequences.map(sequence =>
        mapped(sequence, mapping),
      );
  return copy;
}
function verify(detailed, standard, label) {
  const mapping = receiptMapping(detailed.result.receiptEntries, standard.result.receiptEntries);
  same(
    normalizeResult(detailed.result, mapping),
    standard.result,
    `${label}: complete transferable result`,
  );
  same(remapReferences(detailed.state, mapping), standard.state, `${label}: complete combat state`);
  same(detailed.hudSnapshots, standard.hudSnapshots, `${label}: every-frame HUD values`);
  same(detailed.hudSha256, standard.hudSha256, `${label}: every-frame HUD`);
  same(detailed.passiveUiTimeline, standard.passiveUiTimeline, `${label}: passive UI timeline`);
  same(
    detailed.buffTimeline.map(segment => ({
      ...segment,
      ...(segment.startSequence === undefined
        ? {}
        : { startSequence: mapped(segment.startSequence, mapping) }),
    })),
    standard.buffTimeline,
    `${label}: buff timeline`,
  );
  same(detailed.checkpoints, standard.checkpoints, `${label}: checkpoint outcomes`);
  const failures = standard.checkpoints.filter(value => value.status !== 'passed');
  const expectedFailures = failures.every(
    value => value.message === 'missing projectile reset handler 0',
  );
  return {
    status: failures.length ? 'semantic-equal-with-checkpoint-failures' : 'passed',
    detailedReceipts: detailed.result.receiptEntries.length,
    standardReceipts: standard.result.receiptEntries.length,
    removed: detailed.result.receiptEntries.length - standard.result.receiptEntries.length,
    hudFrames: standard.hudFrames,
    result: 'equal after explicit mode metadata and validated receipt-identity mapping',
    state: 'equal after receipt-identity mapping; other state counters unchanged',
    hud: 'equal',
    passiveUiTimeline: 'equal',
    buffTimeline: 'equal with receipt-identity mapping',
    checkpoints: standard.checkpoints,
    acceptedKnownCheckpointFailure: failures.length > 0 && allowKnownFailure && expectedFailures,
  };
}
const reports = new Map(),
  checks = [];
let failedCheckpoints = false;
for (let round = 0; round < rounds; round++) {
  const orderedInputs = round % 2 ? [...inputs].reverse() : inputs;
  for (let index = 0; index < orderedInputs.length; index++) {
    const input = orderedInputs[index],
      id = basename(input, '.project.json');
    const pair = {};
    // 同一轴第二轮颠倒模式顺序；相邻轴也交替，避免模式始终先跑。
    const originalIndex = inputs.indexOf(input);
    const modes = (round + originalIndex) % 2 ? ['standard', 'detailed'] : ['detailed', 'standard'];
    for (const receiptDetail of modes) {
      const stem = `${id}.round${round + 1}.${receiptDetail}`;
      const childOptions = {
        input,
        output: join(output, `${stem}.bin`),
        receiptDetail,
        repetitions,
        warmups,
        verify: round === 0,
      };
      const result = spawnSync(
        process.execPath,
        [join(output, 'build', 'runner.mjs'), JSON.stringify(childOptions)],
        {
          cwd: root,
          env: { ...process.env, NODE_ENV: 'production' },
          encoding: 'utf8',
          timeout: 600000,
          killSignal: 'SIGKILL',
          maxBuffer: 8 * 1024 * 1024,
        },
      );
      assert.equal(
        result.status,
        0,
        result.stderr || result.error?.message || `child ${stem} failed`,
      );
      const report = JSON.parse(result.stdout);
      assert.equal(report.sourceSha256, digest(readFileSync(input)), '测量期间输入文件改变');
      assert.equal(sourceFingerprint(), engineSha256, '测量期间引擎源码改变，必须重跑');
      const previous = reports.get(id)?.find(value => value.mode === receiptDetail);
      if (previous) {
        assert.equal(
          report.coldFirst.resultHash,
          previous.coldFirst.resultHash,
          '跨进程结果不确定',
        );
        assert.equal(
          report.coldFirst.receiptHash,
          previous.coldFirst.receiptHash,
          '跨进程回执不确定',
        );
      }
      const entry = { id, round: round + 1, ...report };
      if (!reports.has(id)) reports.set(id, []);
      reports.get(id).push(entry);
      writeFileSync(join(output, `${stem}.json`), JSON.stringify(entry, null, 2) + '\n');
      pair[receiptDetail] = deserialize(readFileSync(childOptions.output)).verification;
      console.log(
        JSON.stringify({
          id,
          round: round + 1,
          mode: receiptDetail,
          medianMs: report.summary.total.medianMs,
          receiptCount: report.coldFirst.receiptCount,
        }),
      );
    }
    if (round === 0) {
      const check = { id, ...verify(pair.detailed, pair.standard, id) };
      checks.push(check);
      if (check.status !== 'passed' && !check.acceptedKnownCheckpointFailure)
        failedCheckpoints = true;
      console.log(JSON.stringify(check));
    }
    writeFileSync(
      join(output, 'summary.json'),
      JSON.stringify(
        {
          kind: 'optional-execution-receipts',
          version: 1,
          provenance,
          methodology: {
            productionSsr: true,
            processes: 'fresh process per input, mode and round; serial execution',
            reuseCheckpoint: false,
            clearCacheBeforeEachRun: true,
            immutableDefinitionCaches: 'normal production lifetime',
            repetitions,
            warmups,
            rounds,
            coldFirst: 'first simulation after module and repository loading, excluding build/load',
            clone: 'structuredClone of official Worker-transferable result; not Worker round-trip',
            semanticValidation: 'first round, outside timed regions; every retained field compared',
            p95: 'nearest-rank ceil(0.95*n), 1-based',
            forcedGc: false,
          },
          checks,
          runs: [...reports.values()].flat(),
        },
        null,
        2,
      ) + '\n',
    );
  }
}
assert.ok(
  !failedCheckpoints,
  '切面验证未通过，详见 summary.json；已知故障必须显式允许并仍保留报告',
);
