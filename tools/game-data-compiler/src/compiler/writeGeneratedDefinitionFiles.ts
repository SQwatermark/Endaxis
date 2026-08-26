import { randomUUID } from 'node:crypto';
import { access, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';

export interface RenderedDefinitionFileSource {
  readonly relativePath: string;
  readonly content: string;
}

/** 使用同级暂存目录生成完整新数据区，完成后一次性替换目标目录。 */
export async function writeGeneratedDefinitionFiles(
  outputDirectory: string,
  files: readonly RenderedDefinitionFileSource[],
): Promise<void> {
  const target = resolve(outputDirectory);
  const parent = dirname(target);
  const identity = basename(target);
  if (identity.length === 0 || target === parent) {
    throw new Error(`unsafe generated definition output directory ${JSON.stringify(target)}`);
  }
  const suffix = `${process.pid}-${randomUUID()}`;
  const staging = resolve(parent, `.${identity}.staging-${suffix}`);
  const backup = resolve(parent, `.${identity}.backup-${suffix}`);
  requireDirectChild(parent, staging, 'staging directory');
  requireDirectChild(parent, backup, 'backup directory');
  await mkdir(parent, { recursive: true });
  await mkdir(staging, { recursive: false });
  let movedExistingTarget = false;
  let installedNewTarget = false;
  try {
    const seen = new Set<string>();
    for (const file of [...files].sort((left, right) =>
      left.relativePath.localeCompare(right.relativePath),
    )) {
      const destination = resolveGeneratedPath(staging, file.relativePath);
      const normalized = relative(staging, destination).split(sep).join('/');
      if (seen.has(normalized)) {
        throw new Error(`duplicate rendered definition path ${JSON.stringify(file.relativePath)}`);
      }
      seen.add(normalized);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, file.content, { encoding: 'utf8', flag: 'wx' });
    }
    if (await pathExists(target)) {
      await renameWithRetry(target, backup);
      movedExistingTarget = true;
    }
    await renameWithRetry(staging, target);
    installedNewTarget = true;
    if (movedExistingTarget) await rm(backup, { recursive: true, force: false });
  } catch (error) {
    if (movedExistingTarget && !installedNewTarget && !(await pathExists(target))) {
      await renameWithRetry(backup, target);
      movedExistingTarget = false;
    }
    throw error;
  } finally {
    if (await pathExists(staging)) await rm(staging, { recursive: true, force: false });
    if (installedNewTarget && movedExistingTarget && (await pathExists(backup))) {
      await rm(backup, { recursive: true, force: false });
    }
  }
}

function resolveGeneratedPath(root: string, relativePath: string): string {
  if (relativePath.length === 0 || isAbsolute(relativePath)) {
    throw new Error(`unsafe rendered definition path ${JSON.stringify(relativePath)}`);
  }
  const destination = resolve(root, relativePath);
  const fromRoot = relative(root, destination);
  if (fromRoot === '' || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) {
    throw new Error(`unsafe rendered definition path ${JSON.stringify(relativePath)}`);
  }
  return destination;
}

function requireDirectChild(parent: string, child: string, kind: string): void {
  const fromParent = relative(parent, child);
  if (fromParent.length === 0 || fromParent.includes(sep)) {
    throw new Error(`unsafe ${kind} ${JSON.stringify(child)}`);
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

/** Windows 的实时索引器可能短暂持有新目录句柄；仅对可恢复的占用错误重试原子 rename。 */
async function renameWithRetry(source: string, destination: string): Promise<void> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      await rename(source, destination);
      return;
    } catch (error) {
      const code =
        typeof error === 'object' && error !== null && 'code' in error
          ? String(error.code)
          : undefined;
      if ((code !== 'EPERM' && code !== 'EBUSY') || attempt >= 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt));
    }
  }
}
