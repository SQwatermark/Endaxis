import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { abilityEntityFixture } from './sourceFixtures.ts';
import { readAbilityEntityTemplates } from '../scripts/readAbilityEntityTemplates.ts';

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach(root => fs.rmSync(root, { recursive: true, force: true })));
const setup = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'endaxis-entity-source-'));
  roots.push(root);
  const directory = path.join(root, 'AbilityEntityData');
  fs.mkdirSync(directory);
  const template = { ...abilityEntityFixture(), gameId: 'entity_test' };
  const file = path.join(directory, 'entity_test.json');
  fs.writeFileSync(file, JSON.stringify(template));
  return { root, directory, template, file };
};

describe('能力实体直接来源读取', () => {
  it('原始目录与显式旧容器进入同一公共解析，不需要旧生成文件补缺', () => {
    const { root, directory, template } = setup();
    const file = path.join(root, 'old-evidence.json');
    fs.writeFileSync(
      file,
      JSON.stringify({
        format: 'EndaxisLogicalAbilityEntityTemplateEvidence',
        spatialModel: 'zero-distance-all-instances-single-enemy',
        lifeTypeNativeValues: { limited: 0, infinite: 1 },
        templates: { entity_test: { ...template, audit: 'container metadata only' } },
      }),
    );
    expect(readAbilityEntityTemplates(directory)).toEqual(readAbilityEntityTemplates(file));
    fs.unlinkSync(file);
    expect(readAbilityEntityTemplates(directory).templates).toHaveLength(1);
  });
  it('原始目录保留严格字段/文件身份校验，不剥离未知字段伪装成旧容器', () => {
    const { directory, template, file } = setup();
    fs.writeFileSync(file, JSON.stringify({ ...template, surprise: 1 }));
    expect(() => readAbilityEntityTemplates(directory)).toThrow('surprise');
    fs.writeFileSync(file, JSON.stringify({ ...template, gameId: 'different' }));
    expect(() => readAbilityEntityTemplates(directory)).toThrow('expected "entity_test"');
  });
  it('目录外文件、子目录与缺失目录不触发隐式回退', () => {
    const { directory } = setup();
    fs.mkdirSync(path.join(directory, 'nested'));
    expect(() => readAbilityEntityTemplates(directory)).toThrow(
      'unexpected ability entity source entry',
    );
    expect(() => readAbilityEntityTemplates(directory + '-missing')).toThrow();
  });
});
