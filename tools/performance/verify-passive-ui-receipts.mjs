/** 比较两份生产源码；仅允许删去重复被动 UI 记录及对应序号重排。原始结果只落本机。 */
import { build } from 'vite';
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { deserialize } from 'node:v8';
import { resolve, join, basename } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import assert from 'node:assert/strict';

const [baselineArgument, outputArgument, ...inputArguments] = process.argv.slice(2);
if (!baselineArgument || !outputArgument || inputArguments.length === 0)
  throw new Error(
    'Usage: node tools/performance/verify-passive-ui-receipts.mjs <baseline-repo> <new-output-dir> <project.json>...',
  );
const candidate = process.cwd(),
  baseline = resolve(baselineArgument),
  output = resolve(outputArgument);
mkdirSync(output); // 不覆盖已有证据
const entry = resolve('tools/performance/verify-passive-ui-receipts-runner.ts');
for (const [name, root] of [
  ['baseline', baseline],
  ['candidate', candidate],
]) {
  await build({
    root,
    configFile: false,
    mode: 'production',
    logLevel: 'error',
    publicDir: false,
    ssr: { noExternal: true },
    plugins: [
      {
        name: 'bind-verification-source',
        enforce: 'pre',
        async resolveId(source, importer) {
          if (importer === entry && source.startsWith('../../src/'))
            return this.resolve(resolve(root, source.slice(6)), undefined, { skipSelf: true });
        },
        generateBundle() {
          for (const id of this.getModuleIds())
            if (
              (id.startsWith(join(candidate, 'src') + '/') ||
                id.startsWith(join(baseline, 'src') + '/')) &&
              !id.startsWith(join(root, 'src') + '/')
            )
              throw new Error(`verification bundle mixed source trees: ${id}`);
        },
      },
    ],
    build: {
      ssr: entry,
      target: 'node22',
      outDir: join(output, name),
      emptyOutDir: false,
      rollupOptions: { output: { entryFileNames: 'runner.mjs' } },
    },
  });
}
function same(actual, expected, label) {
  assert.ok(isDeepStrictEqual(actual, expected), `${label} differs`);
}
// 独立地从旧回执验证删减资格，不调用候选收集器或它的筛选算法。
function receiptMapping(before, after) {
  const mapping = new Map(),
    last = new Map();
  let next = 0,
    removed = 0;
  for (const original of before) {
    const previous = last.get(original.targetId);
    const { sequence: _sequence, frame: _frame, time: _time, ...payload } = original;
    const eligible =
      original.event === 'CharacterPassiveUiValueChanged' &&
      typeof original.targetId === 'string' &&
      typeof original.sourceId === 'string' &&
      typeof original.data?.value === 'number' &&
      Number.isFinite(original.data.value) &&
      Object.keys(original.data).length === 1 &&
      Object.keys(payload).every(key => ['event', 'sourceId', 'targetId', 'data'].includes(key));
    if (original.event === 'CharacterPassiveUiValueChanged')
      last.set(original.targetId, { payload, eligible });
    if (eligible && previous?.eligible && isDeepStrictEqual(previous.payload, payload)) {
      removed++;
      continue;
    }
    const actual = after[next];
    assert.ok(actual, `missing retained receipt ${original.sequence}`);
    assert.equal(actual.sequence, next);
    mapping.set(original.sequence, next++);
  }
  assert.equal(next, after.length, 'unexpected candidate receipt count');
  return { mapping, removed };
}
function remapReference(value, mapping) {
  if (value instanceof Map)
    return new Map([...value].map(([key, item]) => [key, remapReference(item, mapping)]));
  if (value instanceof Set) return new Set([...value].map(item => remapReference(item, mapping)));
  if (Array.isArray(value)) return value.map(item => remapReference(item, mapping));
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, remapReference(item, mapping)]),
  );
  if ((value.kind === 'receipt' || value.kind === 'modifier') && 'sequence' in value)
    result.sequence = mapped(value.sequence, mapping);
  return result;
}
function mapped(sequence, mapping) {
  if (sequence === null) return null;
  assert.ok(mapping.has(sequence), `dangling reference to removed/missing receipt ${sequence}`);
  return mapping.get(sequence);
}
function normalizeResult(result, mapping) {
  const copy = remapReference(result, mapping);
  copy.receiptEntries = copy.receiptEntries
    .filter(entry => mapping.has(entry.sequence))
    .map(entry => ({ ...entry, sequence: mapped(entry.sequence, mapping) }));
  const curves = [
    copy.resourceCurves.sp,
    ...copy.resourceCurves.ultimateEnergy,
    copy.enemyHealthCurve,
    copy.poiseCurve,
  ];
  for (const curve of curves)
    for (const point of curve.points) point.sequence = mapped(point.sequence, mapping);
  for (const key of ['availabilityDiagnostics', 'executionDiagnostics', 'comboWindowDiagnostics'])
    for (const diagnostic of copy[key])
      diagnostic.receiptSequences = diagnostic.receiptSequences.map(sequence =>
        mapped(sequence, mapping),
      );
  return copy;
}
const summary = [];
for (const inputArgument of inputArguments) {
  const input = resolve(inputArgument),
    id = basename(input, '.project.json');
  for (const name of ['baseline', 'candidate']) {
    const result = spawnSync(
      process.execPath,
      [join(output, name, 'runner.mjs'), input, join(output, `${id}.${name}.bin`)],
      {
        cwd: name === 'baseline' ? baseline : candidate,
        encoding: 'utf8',
        timeout: 600000,
        maxBuffer: 4 * 1024 * 1024,
      },
    );
    assert.equal(result.status, 0, result.stderr || result.error?.message);
  }
  const before = deserialize(readFileSync(join(output, `${id}.baseline.bin`)));
  const after = deserialize(readFileSync(join(output, `${id}.candidate.bin`)));
  const { mapping, removed } = receiptMapping(
    before.result.receiptEntries,
    after.result.receiptEntries,
  );
  same(
    normalizeResult(before.result, mapping),
    after.result,
    `${id}: full transferable result with receipt identity mapping`,
  );
  same(before.state, after.state, `${id}: complete combat state`);
  same(before.hudSha256, after.hudSha256, `${id}: every-frame HUD`);
  same(before.passiveUiTimeline, after.passiveUiTimeline, `${id}: passive UI timeline`);
  same(
    before.buffTimeline.map(segment => ({
      ...segment,
      ...(segment.startSequence === undefined
        ? {}
        : { startSequence: mapped(segment.startSequence, mapping) }),
    })),
    after.buffTimeline,
    `${id}: buff timeline identities`,
  );
  const record = {
    id,
    before: before.result.receiptEntries.length,
    after: after.result.receiptEntries.length,
    removed,
    collectorRestoreMs: {
      baseline: before.collectorRestoreMs,
      candidate: after.collectorRestoreMs,
    },
    hudFrames: after.hudFrames,
    fullResult: 'equivalent with checked receipt mapping',
    state: 'exact',
    hud: 'exact',
    passiveUiTimeline: 'exact',
    buffTimeline: 'equivalent with checked receipt mapping',
  };
  summary.push(record);
  console.log(JSON.stringify(record));
  writeFileSync(join(output, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
}
