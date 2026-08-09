/** 验证 Node 结构化导出边界不会被 JSON.stringify 的静默丢字段行为绕过。 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { assertJsonValue } from './export_legacy_equipment.mjs';

test('接受普通 JSON 数据', () => {
  assert.doesNotThrow(() => assertJsonValue({ value: [1, 'two', null] }, '$'));
});

test('拒绝函数并保留完整路径', () => {
  assert.throws(
    () => assertJsonValue({ effect: { resolve() {} } }, '$'),
    /\$\.effect\.resolve: 不支持进入结构化快照的 function/,
  );
});

test('拒绝非有限数值', () => {
  assert.throws(() => assertJsonValue({ value: Number.NaN }, '$'), /\$\.value: 数值不是有限数/);
});
