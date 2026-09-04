import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { typeCheckCandidateOverlay } from '../src/compiler/candidateTypeCheck.ts';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) fs.rmSync(root, { recursive: true, force: true });
});

function setup(candidateSource: string) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'endaxis-candidate-type-'));
  roots.push(root);
  fs.mkdirSync(path.join(root, 'src/next/data/generated'), { recursive: true });
  fs.mkdirSync(path.join(root, 'tmp/candidate/src/next/data/generated'), { recursive: true });
  fs.writeFileSync(
    path.join(root, 'tsconfig.next.json'),
    JSON.stringify({
      compilerOptions: { strict: true, noEmit: true },
      include: ['src/next/**/*.ts'],
    }),
  );
  fs.writeFileSync(
    path.join(root, 'src/next/data/contract.ts'),
    'export interface Row { value: number }',
  );
  fs.writeFileSync(
    path.join(root, 'src/next/data/generated/formal.ts'),
    "import type { Row } from '../contract'; export const row: Row = { value: 1 };",
  );
  fs.writeFileSync(
    path.join(root, 'src/next/data/generated/stale.ts'),
    "import type { Row } from '../contract'; export const stale: Row = { value: 2 };",
  );
  fs.writeFileSync(
    path.join(root, 'tmp/candidate/src/next/data/generated/candidate.ts'),
    candidateSource,
  );
  return root;
}

describe('隔离候选 TypeScript 覆盖层', () => {
  it('按未来正式路径检查新增文件，并把候选目录视为完整替换', () => {
    const root = setup(
      "import type { Row } from '../contract'; export const candidate: Row = { value: 3 };",
    );
    const result = typeCheckCandidateOverlay({
      projectRoot: root,
      candidateRoot: path.join(root, 'tmp/candidate'),
      configFile: 'tsconfig.next.json',
      replacementPaths: ['src/next/data/generated'],
    });
    expect(result.overlayFileCount).toBe(1);
    expect(result.replacedDirectories).toEqual(['src/next/data/generated']);
    expect(fs.existsSync(path.join(root, 'src/next/data/generated/formal.ts'))).toBe(true);
  });

  it('拒绝只在候选落位后才出现的类型错误', () => {
    const root = setup(
      "import type { Row } from '../contract'; export const candidate: Row = { value: 'bad' };",
    );
    expect(() =>
      typeCheckCandidateOverlay({
        projectRoot: root,
        candidateRoot: path.join(root, 'tmp/candidate'),
        configFile: 'tsconfig.next.json',
        replacementPaths: ['src/next/data/generated'],
      }),
    ).toThrow("Type 'string' is not assignable to type 'number'");
  });

  it('候选新增子目录时仍能解析候选入口的静态导入', () => {
    const root = setup("export { nested } from './new-domain/nested';");
    const nestedDirectory = path.join(root, 'tmp/candidate/src/next/data/generated/new-domain');
    fs.mkdirSync(nestedDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(nestedDirectory, 'nested.ts'),
      "import type { Row } from '../../contract'; export const nested: Row = { value: 4 };",
    );
    expect(
      typeCheckCandidateOverlay({
        projectRoot: root,
        candidateRoot: path.join(root, 'tmp/candidate'),
        configFile: 'tsconfig.next.json',
        replacementPaths: ['src/next/data/generated'],
      }).overlayFileCount,
    ).toBe(2);
  });
});
