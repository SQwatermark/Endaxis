/**
 * 通过 Vite SSR 真实加载旧装备 TypeScript 模块，并导出 JSON 安全的结构化快照。
 * 本文件不解析 TypeScript 文本；任何无法无损进入 JSON 的值都会立即报错。
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createServer } from 'vite';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPOSITORY_ROOT = path.resolve(SCRIPT_DIR, '..', '..');

const SOURCE_DIRECTORIES = [
  { kind: 'weapon', directory: 'src/data/weapons' },
  { kind: 'gearPiece', directory: 'src/data/gearpieces' },
  { kind: 'gearSet', directory: 'src/data/gearsets' },
];

async function listTypeScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listTypeScriptFiles(absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(absolutePath);
    }
  }
  return files;
}

export function assertJsonValue(value, valuePath, ancestors = new Set()) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`${valuePath}: 数值不是有限数`);
    return;
  }
  if (typeof value !== 'object') {
    throw new TypeError(`${valuePath}: 不支持进入结构化快照的 ${typeof value}`);
  }
  if (ancestors.has(value)) throw new TypeError(`${valuePath}: 检测到循环引用`);
  ancestors.add(value);
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertJsonValue(entry, `${valuePath}[${index}]`, ancestors));
  } else {
    if (Object.getPrototypeOf(value) !== Object.prototype) {
      throw new TypeError(`${valuePath}: 只允许普通对象，实际为 ${value.constructor?.name}`);
    }
    for (const [key, entry] of Object.entries(value)) {
      assertJsonValue(entry, `${valuePath}.${key}`, ancestors);
    }
  }
  ancestors.delete(value);
}

function toModuleId(absolutePath) {
  return `/${path.relative(REPOSITORY_ROOT, absolutePath).replaceAll(path.sep, '/')}`;
}

function slugFromPath(absolutePath) {
  return path.basename(absolutePath, '.ts');
}

export async function exportLegacyEquipment() {
  const server = await createServer({
    root: REPOSITORY_ROOT,
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
  });
  try {
    const records = [];
    const identities = new Set();
    for (const source of SOURCE_DIRECTORIES) {
      const directory = path.join(REPOSITORY_ROOT, source.directory);
      for (const absolutePath of await listTypeScriptFiles(directory)) {
        const sourcePath = path.relative(REPOSITORY_ROOT, absolutePath).replaceAll(path.sep, '/');
        const module = await server.ssrLoadModule(toModuleId(absolutePath));
        if (!Object.hasOwn(module, 'default')) {
          throw new TypeError(`${sourcePath}: 缺少 default export`);
        }
        const definition = module.default;
        assertJsonValue(definition, sourcePath);
        const slug = slugFromPath(absolutePath);
        const identity = `${source.kind}:${slug}`;
        if (identities.has(identity))
          throw new TypeError(`${sourcePath}: 重复目录身份 ${identity}`);
        identities.add(identity);
        records.push({ kind: source.kind, slug, sourcePath, definition });
      }
    }
    return { schemaVersion: 1, records };
  } finally {
    await server.close();
  }
}

async function main() {
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex < 0 || outputIndex + 1 >= process.argv.length) {
    throw new Error('用法：node export_legacy_equipment.mjs --output <snapshot.json>');
  }
  const outputPath = path.resolve(process.cwd(), process.argv[outputIndex + 1]);
  const snapshot = await exportLegacyEquipment();
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
  process.stdout.write(`已导出 ${snapshot.records.length} 个旧装备定义到 ${outputPath}\n`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    process.stderr.write(`${error.stack ?? error.message}\n`);
    process.exitCode = 1;
  });
}
