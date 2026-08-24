import { randomUUID } from 'node:crypto';
import { access, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import type { RenderedEquipmentDefinitionFileSource } from './renderFormalDefinitions.ts';

/**
 * 将完整生成批次原子替换到目标目录。写盘始终先在同级暂存目录完成，避免失败时留下
 * 新旧定义混杂的半成品；relativePath 只接受目标目录内的规范相对路径。
 */
export async function writeEquipmentDefinitionFiles(
  outputDirectory: string,
  files: readonly RenderedEquipmentDefinitionFileSource[],
): Promise<void> {
  const target = resolve(outputDirectory);
  const parent = dirname(target);
  const identity = basename(target);
  if (identity.length === 0 || target === parent) {
    throw new Error(`unsafe equipment definition output directory ${JSON.stringify(target)}`);
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
        throw new Error(`duplicate rendered equipment path ${JSON.stringify(file.relativePath)}`);
      }
      seen.add(normalized);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, file.content, { encoding: 'utf8', flag: 'wx' });
    }

    if (await pathExists(target)) {
      await rename(target, backup);
      movedExistingTarget = true;
    }
    await rename(staging, target);
    installedNewTarget = true;
    if (movedExistingTarget) await rm(backup, { recursive: true, force: false });
  } catch (error) {
    if (movedExistingTarget && !installedNewTarget && !(await pathExists(target))) {
      await rename(backup, target);
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
    throw new Error(`unsafe rendered equipment path ${JSON.stringify(relativePath)}`);
  }
  const destination = resolve(root, relativePath);
  const fromRoot = relative(root, destination);
  if (fromRoot === '' || fromRoot === '..' || fromRoot.startsWith(`..${sep}`)) {
    throw new Error(`unsafe rendered equipment path ${JSON.stringify(relativePath)}`);
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
