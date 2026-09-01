import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { mergeCommonBuffDefinitions } from '../scripts/generateCommonBuffDefinitions.ts';

describe('公共 Buff 独立所有权', () => {
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

  it('正式干员生成文件不再导出公共 Buff', () => {
    const root = path.resolve('src/next/data/operators/generated-definitions');
    const offenders = fs
      .readdirSync(root)
      .map(slug => path.join(root, slug, `${slug}.operator.generated.ts`))
      .filter(file => fs.existsSync(file))
      .filter(file => fs.readFileSync(file, 'utf8').includes('commonBuffDefinitions'));
    expect(offenders).toEqual([]);
  });

  it('产品稳定入口不反向依赖任何干员定义', () => {
    const source = fs.readFileSync(
      path.resolve('src/next/data/buffs/commonDefinitions.ts'),
      'utf8',
    );
    expect(source).toContain("from './generated/commonBuffDefinitions.generated'");
    expect(source).not.toContain('operators/');
    expect(source).not.toContain('generated-definitions/');
  });
});
