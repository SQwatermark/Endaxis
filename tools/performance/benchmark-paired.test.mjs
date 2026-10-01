import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEFAULT_POLICY,
  matchesEntryImporter,
  createSchedule,
  exactDataSha256,
  pairedInference,
  warmAssessment,
} from './benchmark-paired-common.mjs';

// 验证可复现而非固定某个实现生成的精确序列。
test('每轴每种对照平衡顺序，AA 的两个新进程指定完全相同的 bundle', () => {
  const schedule = createSchedule(2, 6, 42, 'comparison');
  assert.deepEqual(schedule, createSchedule(2, 6, 42, 'comparison'));
  assert.notDeepEqual(schedule, createSchedule(2, 6, 43, 'comparison'));
  assert.equal(schedule.length, 24);
  for (const axis of [0, 1]) {
    for (const kind of ['AA', 'AB']) {
      const groups = schedule.filter(group => group.axis === axis && group.kind === kind);
      assert.equal(groups.filter(group => group.order === 'AB').length, 3);
      assert.equal(groups.filter(group => group.order === 'BA').length, 3);
      assert.equal(new Set(groups.map(group => group.pair)).size, 6);
      for (const group of groups) {
        assert.equal(group.arms.map(arm => arm.label).join(''), group.order);
        assert.deepEqual(
          group.arms.map(arm => arm.bundle),
          kind === 'AA' ? ['A', 'A'] : [...group.order],
        );
      }
    }
  }
  assert.ok(createSchedule(2, 6, 42, 'calibration').every(group => group.kind === 'AA'));
});

test('暖态检查不能把持续变快或高离散的 CPU/墙钟误认为稳定', () => {
  const constant = Array.from({ length: 8 }, () => ({ wallMs: 100, cpuMs: 90 }));
  assert.equal(warmAssessment(constant.slice(0, 7)).eligible, false);
  assert.equal(warmAssessment(constant).passes, true);
  assert.equal(
    warmAssessment(constant.map((sample, index) => ({ ...sample, cpuMs: 100 - 3 * index }))).passes,
    false,
  );
  assert.equal(
    warmAssessment(constant.map((sample, index) => ({ ...sample, wallMs: index % 2 ? 130 : 70 })))
      .passes,
    false,
  );
  const improving = Array.from({ length: 20 }, (_, index) => ({
    wallMs: 200 * 0.98 ** index,
    cpuMs: 170 * 0.98 ** index,
  }));
  assert.equal(warmAssessment(improving).passes, false);
});

test('推断单位是进程中位数，增加进程内相同重复不缩窄区间', () => {
  const pairs = [0.97, 1.03, 0.98, 1.02, 0.96, 1.04].map((ratio, pair) => ({
    group: pair,
    pair,
    order: pair % 2 ? 'BA' : 'AB',
    A: { measuredSamples: [{ wallMs: 99 }, { wallMs: 100 }, { wallMs: 101 }] },
    B: {
      measuredSamples: [{ wallMs: 99 * ratio }, { wallMs: 100 * ratio }, { wallMs: 101 * ratio }],
    },
  }));
  const original = pairedInference(pairs, 'wallMs');
  const repeated = pairs.map(pair => ({
    ...pair,
    A: { measuredSamples: Array(20).fill(pair.A.measuredSamples).flat() },
    B: { measuredSamples: Array(20).fill(pair.B.measuredSamples).flat() },
  }));
  assert.deepEqual(pairedInference(repeated, 'wallMs'), original);
  assert.equal(original.pairCount, 6);
  assert.equal(original.precisionPass, false);
  assert.equal(original.calibrationPass, false);
});

test('配对方向固定 B/A，恒定偏差不能通过 AA 校准', () => {
  const pairs = Array.from({ length: 6 }, (_, pair) => ({
    group: pair,
    pair,
    order: pair % 2 ? 'BA' : 'AB',
    A: { measuredSamples: [{ cpuMs: 100 }] },
    B: { measuredSamples: [{ cpuMs: 99 }] },
  }));
  const result = pairedInference(pairs, 'cpuMs');
  assert.ok(Math.abs(result.ratio - 0.99) < 1e-12);
  assert.equal(result.precisionPass, true);
  assert.equal(result.calibrationPass, false);
  assert.equal(
    pairedInference(
      pairs.map(pair => ({ ...pair, B: pair.A })),
      'cpuMs',
    ).calibrationPass,
    true,
  );
  assert.equal(DEFAULT_POLICY.accuracy, 0.03);
});

test('哈希保留有序回执、特殊数值与缺省值，不声称保存对象别名', () => {
  const values = [
    null,
    undefined,
    0,
    -0,
    Infinity,
    -Infinity,
    NaN,
    { $number: 'Infinity' },
    {},
    { a: undefined },
    [],
    [undefined],
    Array(1),
    new Map([['x', 1]]),
    new Set([1]),
  ];
  assert.equal(new Set(values.map(exactDataSha256)).size, values.length);
  const receipts = [
    { frame: 0, sequence: 0 },
    { frame: 1, sequence: 1 },
  ];
  assert.equal(exactDataSha256(receipts), exactDataSha256(structuredClone(receipts)));
  assert.notEqual(exactDataSha256(receipts), exactDataSha256([...receipts].reverse()));
  assert.notEqual(
    exactDataSha256(
      new Map([
        ['a', 1],
        ['b', 2],
      ]),
    ),
    exactDataSha256(
      new Map([
        ['b', 2],
        ['a', 1],
      ]),
    ),
  );
  assert.throws(() => exactDataSha256(() => 1), /不支持/);
});

test('入口识别兼容 Windows 的 Vite 正斜杠，不放宽不同根、卷、虚拟模块或 POSIX 反斜杠', () => {
  const entry = String.raw`C:\Endaxis\tools\performance\benchmark-paired-runner.ts`;
  assert.equal(
    matchesEntryImporter('C:/Endaxis/tools/performance/benchmark-paired-runner.ts', entry, 'win32'),
    true,
  );
  for (const foreign of [
    'D:/Endaxis/tools/performance/benchmark-paired-runner.ts',
    'C:/Endaxis-copy/tools/performance/benchmark-paired-runner.ts',
    'C:/Endaxis/tools/performance/benchmark-paired-runner.ts?virtual',
    undefined,
  ])
    assert.equal(matchesEntryImporter(foreign, entry, 'win32'), false);
  const uncEntry = String.raw`\\server\share\Endaxis\runner.ts`;
  assert.equal(matchesEntryImporter('//server/share/Endaxis/runner.ts', uncEntry, 'win32'), true);
  assert.equal(matchesEntryImporter('//other/share/Endaxis/runner.ts', uncEntry, 'win32'), false);
  assert.equal(
    matchesEntryImporter('/repo/tools/runner.ts', '/repo/tools/runner.ts', 'linux'),
    true,
  );
  assert.equal(
    matchesEntryImporter('/other/tools/runner.ts', '/repo/tools/runner.ts', 'linux'),
    false,
  );
  assert.equal(
    matchesEntryImporter(String.raw`/repo/a\b/runner.ts`, '/repo/a/b/runner.ts', 'linux'),
    false,
  );
});
