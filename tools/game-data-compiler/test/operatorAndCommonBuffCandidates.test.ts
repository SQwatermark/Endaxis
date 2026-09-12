/**
 * 检查干员与公共 Buff 共用一次逐人规划后，仍独立复验全部文件。
 * 只替换干员规划与原始系统 Buff 编译；公共定义去重、优化、渲染和文件检查均执行真实代码。
 */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  OperatorBuffDefinitions,
  SkillBuffDefinition,
} from '../../../packages/game-data-contract/src/buffs.ts';
import { optimizeCommonBuffDefinitions } from '../src/compiler/equipmentDefinitionOptimization.ts';

const { renderOperatorDefinition, planOperatorDefinition, compileStandardStumpBuffClosure } =
  vi.hoisted(() => ({
    renderOperatorDefinition: vi.fn(),
    planOperatorDefinition: vi.fn(),
    compileStandardStumpBuffClosure: vi.fn(),
  }));
vi.mock('../scripts/planOperatorDefinition.ts', () => ({
  renderOperatorDefinition,
  planOperatorDefinition,
}));
vi.mock('../src/compiler/standardStumpBuffClosure.ts', () => ({
  compileStandardStumpBuffClosure,
}));

import { generateOperatorDefinitionCandidates } from '../scripts/generateOperatorDefinitionCandidates.ts';
import {
  createCommonBuffCollector,
  readSystemBuffRoots,
} from '../scripts/generateCommonBuffDefinitions.ts';

const roots: string[] = [];
const systemRoots = readSystemBuffRoots(
  path.resolve('tools/game-data-compiler/config/systemBuffRoots.json'),
);
const guardedBuff: SkillBuffDefinition = {
  stackingType: 'unlimited',
  lifecycleSequences: {
    enable: {
      steps: [
        {
          kind: 'conditional',
          parameters: { condition: { kind: 'constant', value: true } },
          whenTrue: {
            steps: [
              {
                kind: 'modifyActionValue',
                parameters: {
                  key: 'live',
                  operation: 'assign',
                  value: { kind: 'constant', value: 2 },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

function rendered(slug: string, definitions: OperatorBuffDefinitions = {}) {
  return {
    plan: {
      activeSkills: [{ key: `${slug}-skill` }],
      operator: {
        talents: [],
        potentials: [],
        abilityEntityDefinitions: {},
        buffDefinitions: {},
      },
      commonBuffDefinitions: definitions,
    },
    file: { relativePath: `${slug}.ts`, content: `export default '${slug}';\n` },
    auditFile: { relativePath: 'operator.audit.json', content: `{"slug":"${slug}"}\n` },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  renderOperatorDefinition.mockImplementation(async ({ slug }: { slug: string }) =>
    rendered(slug, { buff_common_fixture: structuredClone(guardedBuff) }),
  );
  compileStandardStumpBuffClosure.mockImplementation((ids: readonly string[]) => ({
    definitions: Object.fromEntries(ids.map(id => [id, { stackingType: 'unlimited' }])),
    diagnostics: [],
  }));
});

afterEach(async () => {
  for (const root of roots.splice(0)) await fs.rm(root, { recursive: true, force: true });
});

async function setup(slugs: readonly string[] = ['one', 'two']) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'operator-common-candidates-'));
  roots.push(root);
  const manifest = path.join(root, 'operators.json');
  const globalBuffCatalog = path.join(root, 'global.json');
  const skillSettingCatalog = path.join(root, 'settings.json');
  const gameplayTagCatalog = path.join(root, 'tags.ts');
  await fs.writeFile(manifest, JSON.stringify({ operators: slugs.map(slug => ({ slug })) }));
  await fs.writeFile(globalBuffCatalog, '{}');
  await fs.writeFile(skillSettingCatalog, '{}');
  await fs.writeFile(
    gameplayTagCatalog,
    "export const GAMEPLAY_TAG_PATHS = Object.freeze([\n  'fixture',\n] as const);\n",
  );
  return {
    manifest,
    sourceRoot: root,
    tableRoot: root,
    skillPatchTable: 'unused-skill-patch',
    buffDataRoot: root,
    abilityEntityCatalog: 'unused-entities',
    projectileBlackboardCatalog: 'unused-projectiles',
    gameplayTagCatalog,
    timeDilationCatalog: 'unused-time',
    globalBuffCatalog,
    skillSettingCatalog,
    outputRoot: path.join(root, 'operators'),
    auditRoot: path.join(root, 'audit'),
    commonBuffOutput: path.join(root, 'common'),
    check: false,
  };
}

describe('干员与公共 Buff 共用规划', () => {
  it.each(['off', 'report', 'apply'] as const)(
    '%s 模式的生成和复验各规划每人一次，公共定义与报告使用同一模式',
    async optimization => {
      const input = { ...(await setup()), optimization };
      const first = await generateOperatorDefinitionCandidates(input);
      const second = await generateOperatorDefinitionCandidates({ ...input, check: true });
      expect(first).toEqual(second);
      expect(first.commonBuffs).toMatchObject({
        buffCount: systemRoots.length + 1,
        optimization: { mode: optimization },
      });
      expect(renderOperatorDefinition.mock.calls.map(([args]) => args.slug)).toEqual([
        'one',
        'two',
        'one',
        'two',
      ]);
      for (const [args] of renderOperatorDefinition.mock.calls)
        expect(args.optimization).toBe(optimization);
      expect(planOperatorDefinition).not.toHaveBeenCalled();
      expect(compileStandardStumpBuffClosure).toHaveBeenCalledTimes(2);
      const changes = first.commonBuffs!.optimization.programs.flatMap(item => item.changes);
      expect(changes.length > 0).toBe(optimization !== 'off');
      const content = await fs.readFile(
        path.join(input.commonBuffOutput, 'commonBuffDefinitions.generated.ts'),
        'utf8',
      );
      expect(content.includes('branch(')).toBe(optimization !== 'apply');
      expect(await fs.readdir(input.commonBuffOutput)).toEqual([
        'commonBuffDefinitions.generated.ts',
        'commonBuffPresentationNames.generated.ts',
      ]);
    },
  );

  it('优化后相同的原始定义仍严格冲突，不能先裁剪再合并', async () => {
    const input = await setup();
    const first: SkillBuffDefinition = {
      stackingType: 'unlimited',
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'constant', value: false } },
              whenTrue: guardedBuff.lifecycleSequences!.enable!,
            },
          ],
        },
      },
    };
    const second: SkillBuffDefinition = {
      ...first,
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'conditional',
              parameters: { condition: { kind: 'constant', value: false } },
              whenTrue: { steps: [] },
            },
          ],
        },
      },
    };
    expect(optimizeCommonBuffDefinitions({ common: first }, 'apply').definitions).toEqual(
      optimizeCommonBuffDefinitions({ common: second }, 'apply').definitions,
    );
    renderOperatorDefinition.mockImplementation(async ({ slug }: { slug: string }) =>
      rendered(slug, { common: slug === 'one' ? first : second }),
    );
    await expect(generateOperatorDefinitionCandidates(input)).rejects.toThrow(
      "common Buff 'common' differs between 'one' and 'two'",
    );
    expect(compileStandardStumpBuffClosure).not.toHaveBeenCalled();
    for (const directory of [input.outputRoot, input.auditRoot, input.commonBuffOutput])
      await expect(fs.stat(directory)).rejects.toMatchObject({ code: 'ENOENT' });
  });

  it('没有干员时仍生成全部系统根并可重新复验', async () => {
    const input = await setup([]);
    const first = await generateOperatorDefinitionCandidates(input);
    expect(first).toMatchObject({
      operatorCount: 0,
      commonBuffs: { buffCount: systemRoots.length },
    });
    await expect(generateOperatorDefinitionCandidates({ ...input, check: true })).resolves.toEqual(
      first,
    );
    expect(renderOperatorDefinition).not.toHaveBeenCalled();
    expect(compileStandardStumpBuffClosure).toHaveBeenCalledTimes(2);
    const content = await fs.readFile(
      path.join(input.commonBuffOutput, 'commonBuffDefinitions.generated.ts'),
      'utf8',
    );
    for (const id of systemRoots) expect(content).toContain(id);
  });

  it('系统根和干员同 ID 定义冲突时明确指出两方来源', async () => {
    const input = await setup(['one']);
    const id = systemRoots[0]!;
    renderOperatorDefinition.mockResolvedValue(rendered('one', { [id]: guardedBuff }));
    await expect(generateOperatorDefinitionCandidates(input)).rejects.toThrow(
      `common Buff '${id}' differs between 'one' and '<system>'`,
    );
  });

  it('系统闭包阻断时三个已有目录均保持原样', async () => {
    const input = await setup();
    const directories = [input.outputRoot, input.auditRoot, input.commonBuffOutput];
    for (const directory of directories) {
      await fs.mkdir(directory);
      await fs.writeFile(path.join(directory, 'previous'), directory);
    }
    compileStandardStumpBuffClosure.mockReturnValue({
      definitions: {},
      diagnostics: [{ status: 'blocked', sourcePath: 'system.fixture', reason: 'missing action' }],
    });
    await expect(generateOperatorDefinitionCandidates(input)).rejects.toThrow(
      'system Buff roots are blocked',
    );
    for (const directory of directories) {
      expect(await fs.readdir(directory)).toEqual(['previous']);
      expect(await fs.readFile(path.join(directory, 'previous'), 'utf8')).toBe(directory);
    }
  });

  it.each(['operator', 'system'] as const)(
    '第二轮重新读取 %s 公共定义，变化不能被首轮缓存掩盖',
    async source => {
      const input = await setup();
      await generateOperatorDefinitionCandidates(input);
      const output = path.join(input.commonBuffOutput, 'commonBuffDefinitions.generated.ts');
      const before = await fs.readFile(output, 'utf8');
      if (source === 'operator') {
        renderOperatorDefinition.mockImplementation(async ({ slug }: { slug: string }) =>
          rendered(slug, {
            buff_common_fixture: { stackingType: 'unlimited', blackboard: { changed: 7 } },
          }),
        );
      } else {
        compileStandardStumpBuffClosure.mockImplementation((ids: readonly string[]) => ({
          definitions: Object.fromEntries(
            ids.map(id => [id, { stackingType: 'unlimited', blackboard: { changed: 7 } }]),
          ),
          diagnostics: [],
        }));
      }
      await expect(generateOperatorDefinitionCandidates({ ...input, check: true })).rejects.toThrow(
        'stale',
      );
      expect(renderOperatorDefinition).toHaveBeenCalledTimes(4);
      expect(compileStandardStumpBuffClosure).toHaveBeenCalledTimes(2);
      expect(await fs.readFile(output, 'utf8')).toBe(before);
    },
  );

  it.each([
    'commonBuffDefinitions.generated.ts',
    'commonBuffPresentationNames.generated.ts',
    'extra.ts',
  ])('复验发现 %s 内容或文件集合变化且不写回', async file => {
    const input = await setup();
    await generateOperatorDefinitionCandidates(input);
    const output = path.join(input.commonBuffOutput, file);
    await fs.writeFile(output, 'changed after generation\n');
    await expect(generateOperatorDefinitionCandidates({ ...input, check: true })).rejects.toThrow(
      'stale',
    );
    expect(await fs.readFile(output, 'utf8')).toBe('changed after generation\n');
  });
});

describe('公共 Buff 增量收集', () => {
  it('保留首次来源，严格区分缺字段、undefined 和负零', () => {
    const collector = createCommonBuffCollector<{ value?: number }>();
    collector.add('first', { same: { value: 0 }, missing: {} });
    collector.add('second', { same: { value: 0 } });
    expect(Object.keys(collector.definitions)).toEqual(['same', 'missing']);
    expect(() => collector.add('third', { same: { value: -0 } })).toThrow(
      "between 'first' and 'third'",
    );
    expect(() => collector.add('fourth', { missing: { value: undefined } })).toThrow(
      "between 'first' and 'fourth'",
    );
  });
});
