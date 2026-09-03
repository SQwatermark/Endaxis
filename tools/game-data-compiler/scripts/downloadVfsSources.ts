import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_VFS_BASE = 'http://127.0.0.1:8765/api/endaxis-data';

export interface VfsSourceCatalog {
  readonly tableCfg: readonly string[];
  readonly jsonCollections: Readonly<Record<string, string>>;
  readonly jsonFiles: readonly string[];
}

export interface DownloadVfsArguments {
  readonly vfsBase: string;
  readonly sourceCatalog: string;
  readonly output: string;
  readonly workers: number;
  readonly tablesOnly: boolean;
  readonly jsonFile?: string;
}

export interface VfsSourceProvenanceEntry {
  readonly logicalPath: string;
  readonly source: string;
  readonly byteLength: number;
  readonly sha256: string;
}

export async function loadVfsSourceCatalog(filePath: string): Promise<VfsSourceCatalog> {
  const value = requireRecord(await readJson(filePath), filePath);
  const tableCfg = requireStringArray(value.tableCfg, `${filePath}.tableCfg`);
  requireUnique(tableCfg, `${filePath}.tableCfg`);
  tableCfg.forEach((name, index) => requireSafeName(name, `${filePath}.tableCfg[${index}]`));

  const jsonCollections = Object.fromEntries(
    Object.entries(requireRecord(value.jsonCollections, `${filePath}.jsonCollections`)).map(
      ([name, rawDirectory]) => {
        requireSafeName(name, `${filePath}.jsonCollections.${name}`);
        const directory = requireNonEmptyString(
          rawDirectory,
          `${filePath}.jsonCollections.${name}`,
        );
        if (path.basename(directory) !== directory) {
          throw new Error(`${filePath}.jsonCollections.${name}: expected a directory name`);
        }
        return [name, directory];
      },
    ),
  );
  const jsonFiles = requireStringArray(value.jsonFiles ?? [], `${filePath}.jsonFiles`).map(
    (name, index) => requireSafeCollectionFile(name, `${filePath}.jsonFiles[${index}]`),
  );
  requireUnique(jsonFiles, `${filePath}.jsonFiles`);
  return { tableCfg, jsonCollections, jsonFiles };
}

export async function downloadVfsSources(args: DownloadVfsArguments): Promise<void> {
  if (!Number.isInteger(args.workers) || args.workers <= 0) {
    throw new Error('--workers: expected a positive integer');
  }
  const catalog = await loadVfsSourceCatalog(args.sourceCatalog);
  const base = args.vfsBase.replace(/\/+$/, '');
  const provenance: VfsSourceProvenanceEntry[] = [];

  if (args.jsonFile !== undefined) {
    if (args.tablesOnly) throw new Error('--json-file cannot be combined with --tables-only');
    if (!catalog.jsonFiles.includes(args.jsonFile)) {
      throw new Error(`JSON resource is not declared in Endaxis source catalog: ${args.jsonFile}`);
    }
    const entry = await downloadJson(base, args.jsonFile, path.join(args.output, args.jsonFile));
    await writeAtomicJson(`${path.join(args.output, args.jsonFile)}.provenance.json`, entry);
    return;
  }

  const tableDirectory = path.join(args.output, 'TableCfg-current');
  await fs.mkdir(tableDirectory, { recursive: true });
  await pruneJsonFiles(tableDirectory, new Set(catalog.tableCfg.map(name => `${name}.json`)));
  await runConcurrent(catalog.tableCfg, args.workers, async name => {
    provenance.push(
      await downloadJson(
        base,
        `TableCfg-current/${name}.json`,
        path.join(tableDirectory, `${name}.json`),
      ),
    );
  });

  const counts: string[] = [];
  if (!args.tablesOnly) {
    for (const logicalPath of catalog.jsonFiles) {
      provenance.push(await downloadJson(base, logicalPath, path.join(args.output, logicalPath)));
    }
    for (const [collection, directory] of Object.entries(catalog.jsonCollections)) {
      const entries = parseCollectionManifest(
        await fetchJson(base, `${collection}/manifest.json`),
        collection,
      );
      const outputDirectory = path.join(args.output, directory);
      await fs.mkdir(outputDirectory, { recursive: true });
      await pruneJsonFiles(outputDirectory, new Set(entries));
      let completed = 0;
      await runConcurrent(entries, args.workers, async fileName => {
        provenance.push(
          await downloadJson(
            base,
            `${collection}/${fileName}`,
            path.join(outputDirectory, fileName),
          ),
        );
        completed += 1;
        if (completed % 100 === 0 || completed === entries.length) {
          process.stdout.write(`${collection}: ${completed}/${entries.length}\n`);
        }
      });
      counts.push(`${collection}=${entries.length}`);
    }
  }

  const sorted = provenance.sort((left, right) =>
    left.logicalPath.localeCompare(right.logicalPath),
  );
  const snapshotSha256 = createHash('sha256')
    .update(sorted.map(entry => `${entry.logicalPath}\0${entry.sha256}\n`).join(''))
    .digest('hex');
  await writeAtomicJson(path.join(args.output, 'vfs-source-provenance.json'), {
    schemaVersion: 1,
    source: base,
    snapshotSha256,
    entries: sorted,
  });
  process.stdout.write(
    `downloaded local VFS snapshot ${snapshotSha256.slice(0, 12)}: ` +
      `${catalog.tableCfg.length} tables${counts.length ? `, ${counts.join(', ')}` : ''}\n`,
  );
}

async function downloadJson(
  base: string,
  logicalPath: string,
  output: string,
): Promise<VfsSourceProvenanceEntry> {
  const { content, source } = await fetchJsonBytes(base, logicalPath);
  JSON.parse(new TextDecoder('utf-8').decode(content));
  await writeAtomicBytes(output, content);
  return {
    logicalPath,
    source,
    byteLength: content.byteLength,
    sha256: createHash('sha256').update(content).digest('hex'),
  };
}

async function fetchJson(base: string, logicalPath: string): Promise<unknown> {
  const { content } = await fetchJsonBytes(base, logicalPath);
  return JSON.parse(new TextDecoder('utf-8').decode(content));
}

async function fetchJsonBytes(
  base: string,
  logicalPath: string,
): Promise<{ content: Uint8Array; source: string }> {
  const source = new URL(logicalPath, `${base.replace(/\/+$/, '')}/`).href;
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(source, {
        headers: { 'User-Agent': 'Endaxis-Next/1' },
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`);
      if (response.headers.get('x-endaxis-source') !== 'vfs-index-browser') {
        throw new Error(`${source}: response is not an authenticated vfs-index-browser export`);
      }
      return { content: new Uint8Array(await response.arrayBuffer()), source };
    } catch (error) {
      lastError = error;
      if (attempt + 1 < 3) {
        await new Promise(resolve => setTimeout(resolve, 250 * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

function parseCollectionManifest(value: unknown, collection: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${collection} manifest: expected array`);
  const files = value.map((rawEntry, index) => {
    const entry = requireRecord(rawEntry, `${collection} manifest[${index}]`);
    const contentFile = requireNonEmptyString(
      entry.contentFile,
      `${collection} manifest[${index}].contentFile`,
    );
    const fileName = path.posix.basename(new URL(contentFile, 'http://local/').pathname);
    if (!/^[A-Za-z0-9_.-]+\.json$/.test(fileName)) {
      throw new Error(`${collection} manifest[${index}]: unsafe JSON filename`);
    }
    return fileName;
  });
  requireUnique(files, `${collection} manifest`);
  return files.sort((left, right) => left.localeCompare(right));
}

async function pruneJsonFiles(directory: string, expected: ReadonlySet<string>): Promise<void> {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.json') && !expected.has(entry.name)) {
      await fs.unlink(path.join(directory, entry.name));
    }
  }
}

export async function writeAtomicBytes(output: string, content: Uint8Array): Promise<void> {
  await fs.mkdir(path.dirname(output), { recursive: true });
  const temporary = `${output}.part`;
  await fs.writeFile(temporary, content);
  await fs.rename(temporary, output);
}

async function writeAtomicJson(output: string, value: unknown): Promise<void> {
  await writeAtomicBytes(output, new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`));
}

export async function runConcurrent<T>(
  values: readonly T[],
  workers: number,
  run: (value: T) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  await Promise.all(
    Array.from({ length: Math.min(workers, values.length) }, async () => {
      while (nextIndex < values.length) {
        const value = values[nextIndex++]!;
        await run(value);
      }
    }),
  );
}

export function parseArguments(values: readonly string[]): DownloadVfsArguments {
  const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
  const result = new Map<string, string>();
  let tablesOnly = false;
  for (let index = 0; index < values.length; index += 1) {
    const name = values[index]!;
    if (name === '--tables-only') {
      tablesOnly = true;
      continue;
    }
    const value = values[index + 1];
    if (!name.startsWith('--') || value === undefined) throw new Error(`missing value for ${name}`);
    result.set(name, value);
    index += 1;
  }
  return {
    vfsBase: result.get('--vfs-base') ?? DEFAULT_VFS_BASE,
    sourceCatalog: path.resolve(
      result.get('--source-catalog') ??
        path.join(projectRoot, 'tools/game-data-compiler/vfs-sources.json'),
    ),
    output: path.resolve(result.get('--output') ?? path.join(projectRoot, 'tmp/game-data-sources')),
    workers: Number(result.get('--workers') ?? 6),
    tablesOnly,
    ...(result.has('--json-file') ? { jsonFile: result.get('--json-file')! } : {}),
  };
}

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, 'utf8'));
}

function requireRecord(value: unknown, sourcePath: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${sourcePath}: expected object`);
  }
  return value as Record<string, unknown>;
}

function requireNonEmptyString(value: unknown, sourcePath: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${sourcePath}: expected non-empty string`);
  }
  return value;
}

function requireStringArray(value: unknown, sourcePath: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${sourcePath}: expected array`);
  return value.map((item, index) => requireNonEmptyString(item, `${sourcePath}[${index}]`));
}

function requireUnique(values: readonly string[], sourcePath: string): void {
  if (new Set(values).size !== values.length) throw new Error(`${sourcePath}: duplicate value`);
}

function requireSafeName(value: string, sourcePath: string): void {
  if (!/^[A-Za-z0-9_]+$/.test(value)) throw new Error(`${sourcePath}: expected a safe name`);
}

function requireSafeCollectionFile(value: string, sourcePath: string): string {
  const parsed = requireNonEmptyString(value, sourcePath).replace(/\\/g, '/');
  if (!/^[A-Za-z0-9_]+\/[A-Za-z0-9_.-]+\.json$/.test(parsed)) {
    throw new Error(`${sourcePath}: expected collection/file.json`);
  }
  return parsed;
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (entryPath === import.meta.url) {
  await downloadVfsSources(parseArguments(process.argv.slice(2)));
}
