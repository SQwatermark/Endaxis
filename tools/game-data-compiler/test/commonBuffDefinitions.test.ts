import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import {
  mergeCommonBuffDefinitions,
  readPresentationNameKeys,
  renderCommonBuffPresentationNamesSource,
  readSystemBuffRoots,
} from '../scripts/generateCommonBuffDefinitions.ts';

describe('公共 Buff 独立所有权', () => {
  it('系统爆发根独立于干员引用，清单不包含手写动作或倍率', () => {
    expect(
      readSystemBuffRoots(path.resolve('tools/game-data-compiler/config/systemBuffRoots.json')),
    ).toEqual([
      'buff_common_fire_fire_triggered',
      'buff_common_pulse_pulse_triggered',
      'buff_common_cryst_cryst_triggered',
      'buff_common_natural_natural_triggered',
    ]);
  });
  it('相同 ID 的相同定义只保留一份，冲突定义严格失败', () => {
    const first = { stackingType: 'stack', priority: 0 };
    expect(
      mergeCommonBuffDefinitions([
        { slug: 'a', definitions: { common: first } },
        { slug: 'b', definitions: { common: { ...first } } },
      ]),
    ).toEqual({ common: first });
    expect(() =>
      mergeCommonBuffDefinitions([
        { slug: 'a', definitions: { common: first } },
        { slug: 'b', definitions: { common: { ...first, priority: 1 } } },
      ]),
    ).toThrow("common Buff 'common' differs between 'a' and 'b'");
  });

  it.each([
    [['buff_common_test', 'buff_common_test'], 'duplicate system Buff roots'],
    [['buff_chr_0011_test'], 'invalid system Buff root'],
    [['buff_common_test/../../other'], 'invalid system Buff root'],
    [[{ id: 'buff_common_test', damage: 100 }], 'expected string'],
  ])('系统根拒绝重复、非公共身份和内嵌行为：%j', (roots, message) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'endaxis-system-roots-'));
    try {
      const file = path.join(directory, 'roots.json');
      fs.writeFileSync(file, JSON.stringify(roots));
      expect(() => readSystemBuffRoots(file)).toThrow(message);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });

  it('正式干员生成文件不再导出公共 Buff', () => {
    const root = path.resolve('src/data/operators/generated-definitions');
    const offenders = fs
      .readdirSync(root)
      .map(slug => path.join(root, slug, `${slug}.operator.generated.ts`))
      .filter(file => fs.existsSync(file))
      .filter(file => fs.readFileSync(file, 'utf8').includes('commonBuffDefinitions'));
    expect(offenders).toEqual([]);
  });

  it('产品稳定入口不反向依赖任何干员定义', () => {
    const source = fs.readFileSync(path.resolve('src/data/buffs/commonDefinitions.ts'), 'utf8');
    expect(source).toContain("from './generated/commonBuffDefinitions.generated'");
    expect(source).not.toContain('operators/');
    expect(source).not.toContain('generated-definitions/');
  });

  it('公共 Buff 名称配置与生成映射保持一致', () => {
    const configPath = path.resolve(
      'tools/game-data-compiler/config/commonBuffPresentationNames.json',
    );
    const names = readPresentationNameKeys(configPath);
    const generatedSource = fs.readFileSync(
      path.resolve('src/data/buffs/generated/commonBuffPresentationNames.generated.ts'),
      'utf8',
    );
    expect(renderCommonBuffPresentationNamesSource(names).replace(/\r\n/g, '\n')).toContain(
      JSON.stringify(names, null, 2),
    );
    for (const [buffId, nameKey] of Object.entries(names)) {
      expect(generatedSource).toContain(`${buffId}: '${nameKey}'`);
    }
  });

  it('展示名称不会注入公共战斗定义', () => {
    const generatedDefinitions = fs.readFileSync(
      path.resolve('src/data/buffs/generated/commonBuffDefinitions.generated.ts'),
      'utf8',
    );
    const names = readPresentationNameKeys(
      path.resolve('tools/game-data-compiler/config/commonBuffPresentationNames.json'),
    );
    for (const nameKey of Object.values(names)) {
      expect(generatedDefinitions).not.toContain(`nameKey: '${nameKey}'`);
    }
  });
});
