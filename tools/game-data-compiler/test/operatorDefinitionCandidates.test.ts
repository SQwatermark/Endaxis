import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { renderOperatorDefinition } = vi.hoisted(() => ({ renderOperatorDefinition: vi.fn() }));
vi.mock('../scripts/planOperatorDefinition.ts', () => ({
  planOperatorDefinition: vi.fn(),
  renderOperatorDefinition,
}));

import { generateOperatorDefinitionCandidates } from '../scripts/generateOperatorDefinitionCandidates.ts';

const roots: string[] = [];

beforeEach(() => {
  renderOperatorDefinition.mockReset();
  renderOperatorDefinition.mockImplementation(async ({ slug }: { slug: string }) => ({
    plan: {
      activeSkills: [{ key: `${slug}-skill` }],
      operator: {
        talents: [{ key: 'talent' }],
        potentials: [{ key: 'potential' }],
        abilityEntityDefinitions: {},
        buffDefinitions: {},
      },
      commonBuffDefinitions: {},
    },
    file: { relativePath: `${slug}.operator.generated.ts`, content: `export default '${slug}';\n` },
    auditFile: { relativePath: 'operator.audit.json', content: `{"slug":"${slug}"}\n` },
  }));
});

afterEach(async () => {
  for (const root of roots.splice(0)) await fs.rm(root, { recursive: true, force: true });
});

async function setup() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'operator-candidates-'));
  roots.push(root);
  const manifest = path.join(root, 'operators.json');
  const outputRoot = path.join(root, 'candidate');
  const auditRoot = path.join(root, 'audit');
  await fs.writeFile(manifest, JSON.stringify({ operators: [{ slug: 'one' }, { slug: 'two' }] }));
  return { root, manifest, outputRoot, auditRoot };
}

const sourceArguments = {
  sourceRoot: 'source',
  tableRoot: 'tables',
  skillPatchTable: 'skills',
  buffDataRoot: 'buffs',
  abilityEntityCatalog: 'entities',
  projectileBlackboardCatalog: 'projectiles',
  gameplayTagCatalog: 'tags',
  timeDilationCatalog: 'time',
  globalBuffCatalog: 'global-buffs',
  skillSettingCatalog: 'settings',
} as const;

describe('整批干员候选写入', () => {
  it('全部渲染成功后写完整目录，并能严格复验文件集合', async () => {
    const paths = await setup();
    const input = { ...sourceArguments, ...paths, check: false };
    await expect(generateOperatorDefinitionCandidates(input)).resolves.toMatchObject({
      operatorCount: 2,
      skillCount: 2,
      operators: [{ slug: 'one' }, { slug: 'two' }],
    });
    await expect(
      fs.readFile(path.join(paths.outputRoot, 'two/two.operator.generated.ts'), 'utf8'),
    ).resolves.toBe("export default 'two';\n");
    await expect(
      generateOperatorDefinitionCandidates({ ...input, check: true }),
    ).resolves.toMatchObject({ operatorCount: 2 });
  });

  it('中途渲染失败时不碰上一份候选或审计目录', async () => {
    const paths = await setup();
    await fs.mkdir(paths.outputRoot);
    await fs.mkdir(paths.auditRoot);
    await fs.writeFile(path.join(paths.outputRoot, 'previous'), 'operator snapshot');
    await fs.writeFile(path.join(paths.auditRoot, 'previous'), 'audit snapshot');
    renderOperatorDefinition.mockImplementationOnce(
      renderOperatorDefinition.getMockImplementation()!,
    );
    renderOperatorDefinition.mockRejectedValueOnce(new Error('second operator blocked'));

    await expect(
      generateOperatorDefinitionCandidates({ ...sourceArguments, ...paths, check: false }),
    ).rejects.toThrow('second operator blocked');
    await expect(fs.readFile(path.join(paths.outputRoot, 'previous'), 'utf8')).resolves.toBe(
      'operator snapshot',
    );
    await expect(fs.readFile(path.join(paths.auditRoot, 'previous'), 'utf8')).resolves.toBe(
      'audit snapshot',
    );
  });

  it('拒绝重复 slug，避免两名干员覆盖同一路径', async () => {
    const paths = await setup();
    await fs.writeFile(
      paths.manifest,
      JSON.stringify({ operators: [{ slug: 'same' }, { slug: 'same' }] }),
    );
    await expect(
      generateOperatorDefinitionCandidates({ ...sourceArguments, ...paths, check: false }),
    ).rejects.toThrow('duplicate slugs');
    expect(renderOperatorDefinition).not.toHaveBeenCalled();
  });
});
