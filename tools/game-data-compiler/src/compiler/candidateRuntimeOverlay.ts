import fs from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

export interface CandidateRuntimeOverlayArguments {
  readonly projectRoot: string;
  readonly candidateRoot: string;
  /** 相对项目根目录；文件按单文件覆盖，目录按完整目录替换。 */
  readonly replacementPaths: readonly string[];
}

interface CandidateReplacement {
  readonly formalPath: string;
  readonly candidatePath: string;
  readonly directory: boolean;
}

/**
 * 为 Vite SSR 建立只读候选视图：正式路径优先读取候选；候选文件的相对 import
 * 若落到候选树中不存在的手写代码，则回到正式工作树。整个过程不复制也不发布文件。
 */
export function createCandidateRuntimeOverlayPlugin(
  args: CandidateRuntimeOverlayArguments,
): Plugin {
  const projectRoot = fs.realpathSync(args.projectRoot);
  const candidateRoot = fs.realpathSync(args.candidateRoot);
  const replacements = collectReplacements(projectRoot, candidateRoot, args.replacementPaths);
  if (replacements.length === 0)
    throw new Error('candidate runtime overlay has no generated files');

  return {
    name: 'endaxis-candidate-runtime-overlay',
    enforce: 'pre',
    resolveId(source, importer) {
      const requested = resolveImportPath(source, importer, projectRoot);
      if (requested === null) return null;

      const candidate = mapFormalToCandidate(requested, replacements);
      if (candidate !== null) return candidate;

      if (isWithin(candidateRoot, requested) && !fs.existsSync(requested)) {
        const fallback = path.join(projectRoot, path.relative(candidateRoot, requested));
        const resolvedFallback = isWithin(projectRoot, fallback)
          ? resolveExistingModule(fallback)
          : null;
        if (resolvedFallback !== null) return resolvedFallback;
      }
      return null;
    },
  };
}

function collectReplacements(
  projectRoot: string,
  candidateRoot: string,
  replacementPaths: readonly string[],
): CandidateReplacement[] {
  return replacementPaths.flatMap(relativePath => {
    const candidatePath = path.resolve(candidateRoot, relativePath);
    const formalPath = path.resolve(projectRoot, relativePath);
    if (!isWithin(candidateRoot, candidatePath) || !isWithin(projectRoot, formalPath)) {
      throw new Error(`candidate runtime replacement escapes its root: ${relativePath}`);
    }
    if (!fs.existsSync(candidatePath)) return [];
    const stat = fs.statSync(candidatePath);
    if (!stat.isDirectory() && !stat.isFile()) {
      throw new Error(
        `candidate runtime replacement is neither file nor directory: ${candidatePath}`,
      );
    }
    return [{ formalPath, candidatePath, directory: stat.isDirectory() }];
  });
}

function resolveImportPath(source: string, importer: string | undefined, projectRoot: string) {
  if (source.startsWith('\0') || /^[a-z][a-z+.-]*:/iu.test(source)) return null;
  const cleanSource = source.split('?')[0]!.split('#')[0]!;
  if (cleanSource.startsWith('/@fs/')) return path.resolve(cleanSource.slice('/@fs/'.length));
  if (cleanSource.startsWith('/src/') || cleanSource.startsWith('/packages/')) {
    return path.resolve(projectRoot, `.${cleanSource}`);
  }
  if (path.isAbsolute(cleanSource)) return path.resolve(cleanSource);
  if (!cleanSource.startsWith('.') || importer === undefined) return null;
  const cleanImporter = importer.split('?')[0]!.split('#')[0]!;
  return path.resolve(path.dirname(cleanImporter), cleanSource);
}

function mapFormalToCandidate(
  requested: string,
  replacements: readonly CandidateReplacement[],
): string | null {
  for (const replacement of replacements) {
    if (replacement.directory) {
      if (!isWithin(replacement.formalPath, requested)) continue;
      const candidate = path.join(
        replacement.candidatePath,
        path.relative(replacement.formalPath, requested),
      );
      // 目录替换具有完整替换语义；候选中没有的旧正式文件不能漏入运行视图。
      return resolveExistingModule(candidate);
    }
    if (normalize(requested) === normalize(replacement.formalPath)) {
      return replacement.candidatePath;
    }
  }
  return null;
}

function resolveExistingModule(value: string): string | null {
  for (const candidate of [
    value,
    `${value}.ts`,
    `${value}.tsx`,
    `${value}.mts`,
    `${value}.json`,
    path.join(value, 'index.ts'),
  ]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function isWithin(root: string, value: string): boolean {
  const relative = path.relative(root, path.resolve(value));
  return (
    relative === '' ||
    (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative))
  );
}

function normalize(value: string): string {
  const resolved = path.resolve(value);
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved;
}
