import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import { generateOperatorRuntimeDefinition } from '../scripts/generateOperatorRuntimeDefinition.ts';
import { operatorRuntimeFixture } from './operatorRuntimeDefinitionFixture.ts';

const tmpRoot = fileURLToPath(new URL('../../../tmp/', import.meta.url));
const owned: string[] = [];
function setup() {
  fs.mkdirSync(tmpRoot, { recursive: true });
  const root = fs.mkdtempSync(path.join(tmpRoot, 'operator-runtime-test-'));
  owned.push(root);
  const fixture = operatorRuntimeFixture();
  const args = {
    template: path.join(root, 'template.json'),
    comboSkill: path.join(root, 'combo.json'),
    slug: 'arcane',
    skillGroup: 'comboSkill',
    output: path.join(root, 'formal', 'arcane'),
    auditOutput: path.join(root, 'audit', 'arcane'),
    check: false,
  };
  fs.writeFileSync(args.template, JSON.stringify(fixture.template));
  fs.writeFileSync(args.comboSkill, JSON.stringify(fixture.comboSkill));
  return { args, root, destination: path.join(args.output, 'arcane.runtime.generated.ts') };
}
afterEach(() => {
  for (const root of owned.splice(0)) {
    if (!root.startsWith(path.join(tmpRoot, 'operator-runtime-test-')))
      throw new Error('unsafe test cleanup');
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe('角色运行定义生成命令', () => {
  it('重复生成确定一致；审计分离；check 不写盘且接受 Git 换行差异', async () => {
    const f = setup();
    await generateOperatorRuntimeDefinition(f.args);
    const expected = fs.readFileSync(f.destination, 'utf8');
    await generateOperatorRuntimeDefinition(f.args);
    expect(fs.readFileSync(f.destination, 'utf8')).toBe(expected);
    expect(fs.readdirSync(f.args.output)).toEqual(['arcane.runtime.generated.ts']);
    expect(fs.readdirSync(f.args.auditOutput)).toEqual(['arcane.runtime.audit.json']);
    fs.writeFileSync(f.destination, expected.replaceAll('\n', '\r\n'));
    const before = fs.statSync(f.destination).mtimeMs;
    await generateOperatorRuntimeDefinition({ ...f.args, check: true });
    expect(fs.statSync(f.destination).mtimeMs).toBe(before);
  });
  it('check 发现过期不会修补文件', async () => {
    const f = setup();
    await generateOperatorRuntimeDefinition(f.args);
    const changed = fs.readFileSync(f.destination, 'utf8') + '// stale\n';
    fs.writeFileSync(f.destination, changed);
    await expect(generateOperatorRuntimeDefinition({ ...f.args, check: true })).rejects.toThrow(
      'stale',
    );
    expect(fs.readFileSync(f.destination, 'utf8')).toBe(changed);
  });
  it('未支持来源失败时原正式产物保持不变', async () => {
    const f = setup();
    await generateOperatorRuntimeDefinition(f.args);
    const before = fs.readFileSync(f.destination, 'utf8');
    const fixture = operatorRuntimeFixture();
    fixture.comboSkill.smartTargetSelectStrategy = 999;
    fs.writeFileSync(f.args.comboSkill, JSON.stringify(fixture.comboSkill));
    await expect(generateOperatorRuntimeDefinition(f.args)).rejects.toThrow(
      'unknown native target selection',
    );
    expect(fs.readFileSync(f.destination, 'utf8')).toBe(before);
  });
  it('拒绝覆盖夹杂的手工文件', async () => {
    const f = setup();
    fs.mkdirSync(f.args.output, { recursive: true });
    const note = path.join(f.args.output, 'notes.txt');
    fs.writeFileSync(note, 'user notes');
    await expect(generateOperatorRuntimeDefinition(f.args)).rejects.toThrow('unrelated files');
    expect(fs.readFileSync(note, 'utf8')).toBe('user notes');
    expect(fs.existsSync(f.destination)).toBe(false);
  });
  it('拒绝正式/审计重叠与临时区之外的审计位置', async () => {
    const f = setup();
    await expect(
      generateOperatorRuntimeDefinition({ ...f.args, auditOutput: f.args.output }),
    ).rejects.toThrow('overlap');
    await expect(
      generateOperatorRuntimeDefinition({
        ...f.args,
        auditOutput: path.resolve(tmpRoot, '..', 'arcane'),
      }),
    ).rejects.toThrow('inside Endaxis/tmp');
    expect(fs.existsSync(f.destination)).toBe(false);
  });
});
