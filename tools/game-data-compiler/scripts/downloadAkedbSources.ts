import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_CDN = 'https://data.akedata.wiki';

export interface AkedbSourceCatalog {
  readonly defaultVersion: string;
  readonly sharedJsonIndex: string;
  readonly tableCfg: readonly string[];
  readonly jsonCollections: Readonly<Record<string, string>>;
  /** 精确全局配置清单，不要求它们出现在 AKEDB 当前集合索引中。 */
  readonly jsonFiles: readonly string[];
  readonly operatorClosureCollections: Readonly<
    Record<
      string,
      { readonly output: string; readonly definitionKind: 'projectile' | 'abilityEntity' }
    >
  >;
}

export interface DownloadArguments {
  readonly cdn: string;
  readonly version: string | null;
  readonly sourceCatalog: string;
  readonly output: string;
  readonly workers: number;
  readonly tablesOnly: boolean;
  readonly vfsFallback: string | null;
  /** 只下载清单内的一份全局 JSON；不顺带更新表或干员资产。 */
  readonly jsonFile?: string;
}

export interface SourceProvenanceEntry {
  readonly logicalPath: string;
  readonly provider: 'akedb' | 'vfs-index-browser';
  readonly source: string;
  readonly byteLength: number;
  readonly sha256: string;
}

interface AkedbVersionSource {
  readonly id: string;
  readonly tableCfgPath: string;
}

export async function loadAkedbSourceCatalog(filePath: string): Promise<AkedbSourceCatalog> {
  const value = requireRecord(await readJson(filePath), filePath);
  const defaultVersion = requireNonEmptyString(value.defaultVersion, `${filePath}.defaultVersion`);
  const sharedJsonIndex = requireSafeRelativePath(
    value.sharedJsonIndex,
    `${filePath}.sharedJsonIndex`,
  );
  const tableCfg = requireStringArray(value.tableCfg, `${filePath}.tableCfg`);
  requireUnique(tableCfg, `${filePath}.tableCfg`);
  tableCfg.forEach((name, index) => requireSafeName(name, `${filePath}.tableCfg[${index}]`));
  const rawCollections = requireRecord(value.jsonCollections, `${filePath}.jsonCollections`);
  const jsonFiles = requireStringArray(
    value.jsonFiles === undefined ? [] : value.jsonFiles,
    `${filePath}.jsonFiles`,
  ).map((name, index) => requireSafeRelativePath(name, `${filePath}.jsonFiles[${index}]`));
  requireUnique(jsonFiles, `${filePath}.jsonFiles`);
  for (const name of jsonFiles) {
    if (!/^[A-Za-z0-9_]+\/[A-Za-z0-9_.-]+\.json$/.test(name)) {
      throw new Error(`${filePath}.jsonFiles: expected collection/file.json, got ${name}`);
    }
  }
  const jsonCollections = Object.fromEntries(
    Object.entries(rawCollections).map(([name, directory]) => {
      requireSafeName(name, `${filePath}.jsonCollections.${name}`);
      const parsedDirectory = requireNonEmptyString(
        directory,
        `${filePath}.jsonCollections.${name}`,
      );
      if (path.basename(parsedDirectory) !== parsedDirectory) {
        throw new Error(`${filePath}.jsonCollections.${name}: expected a directory name`);
      }
      return [name, parsedDirectory];
    }),
  );
  const rawClosureCollections =
    value.operatorClosureCollections === undefined
      ? {}
      : requireRecord(value.operatorClosureCollections, `${filePath}.operatorClosureCollections`);
  const operatorClosureCollections = Object.fromEntries(
    Object.entries(rawClosureCollections).map(([name, rawConfiguration]) => {
      requireSafeName(name, `${filePath}.operatorClosureCollections.${name}`);
      const configuration = requireRecord(
        rawConfiguration,
        `${filePath}.operatorClosureCollections.${name}`,
      );
      const output = requireNonEmptyString(
        configuration.output,
        `${filePath}.operatorClosureCollections.${name}.output`,
      );
      if (path.basename(output) !== output) {
        throw new Error(
          `${filePath}.operatorClosureCollections.${name}.output: expected directory name`,
        );
      }
      const definitionKind = requireNonEmptyString(
        configuration.definitionKind,
        `${filePath}.operatorClosureCollections.${name}.definitionKind`,
      );
      if (definitionKind !== 'projectile' && definitionKind !== 'abilityEntity') {
        throw new Error(
          `${filePath}.operatorClosureCollections.${name}.definitionKind: unsupported kind`,
        );
      }
      return [name, { output, definitionKind: definitionKind as 'projectile' | 'abilityEntity' }];
    }),
  );
  return {
    defaultVersion,
    sharedJsonIndex,
    tableCfg,
    jsonCollections,
    jsonFiles,
    operatorClosureCollections,
  };
}

export function selectAkedbVersion(manifestValue: unknown, versionId: string): AkedbVersionSource {
  const manifest = requireRecord(manifestValue, 'AKEDB manifest');
  const versions = requireArray(manifest.versions, 'AKEDB manifest.versions');
  const matches = versions.filter(value => {
    const record = requireRecord(value, 'AKEDB manifest.versions[]');
    return record.id === versionId;
  });
  if (matches.length !== 1) {
    throw new Error(`AKEDB manifest expected exactly one version ${JSON.stringify(versionId)}`);
  }
  const version = requireRecord(matches[0], `AKEDB manifest.versions.${versionId}`);
  return {
    id: versionId,
    tableCfgPath: requireNonEmptyString(
      version.tableCfgPath,
      `AKEDB manifest.versions.${versionId}.tableCfgPath`,
    ),
  };
}

export async function downloadAkedbSources(args: DownloadArguments): Promise<void> {
  if (!Number.isInteger(args.workers) || args.workers <= 0) {
    throw new Error('--workers: expected a positive integer');
  }
  const catalog = await loadAkedbSourceCatalog(args.sourceCatalog);
  const cdn = args.cdn.replace(/\/+$/, '');
  const provenance: SourceProvenanceEntry[] = [];
  const versionId = args.version ?? catalog.defaultVersion;
  if (args.jsonFile !== undefined) {
    if (args.tablesOnly) throw new Error('--json-file cannot be combined with --tables-only');
    if (!catalog.jsonFiles.includes(args.jsonFile))
      throw new Error(`JSON resource is not declared in Endaxis source catalog: ${args.jsonFile}`);
    const resource = await downloadExactJson(args.jsonFile);
    // 单文件补取不能覆盖整批下载的来源账本。
    await writeAtomicBytes(
      path.join(args.output, `${args.jsonFile}.provenance.json`),
      new TextEncoder().encode(`${JSON.stringify(resource.provenance, null, 2)}\n`),
    );
    return;
  }
  let version: AkedbVersionSource | null = null;
  try {
    const manifestResource = await loadJsonResource(`${cdn}/manifest.json`, null, 'manifest.json');
    provenance.push(manifestResource.provenance);
    const manifest = requireRecord(manifestResource.value, 'AKEDB manifest');
    process.stdout.write(
      `AKEDB public JSON snapshot: latest=${String(manifest.latest)}, sharedRevision=${String(manifest.sharedRevision)}\n`,
    );
    version = selectAkedbVersion(manifest, versionId);
  } catch (error) {
    if (args.vfsFallback === null) throw error;
    process.stdout.write(
      `AKEDB manifest has no usable ${versionId}; TableCfg will use vfs-index-browser: ${formatError(error)}\n`,
    );
  }

  const tableDirectory = path.join(args.output, `TableCfg-${versionId.replace('@', '-')}`);
  const tableBase =
    version === null
      ? null
      : new URL(`${version.tableCfgPath.replace(/^\/+|\/+$/g, '')}/`, `${cdn}/`);
  await fs.mkdir(tableDirectory, { recursive: true });
  await runConcurrent(catalog.tableCfg, args.workers, async name => {
    const logicalPath = `TableCfg-${versionId.replace('@', '-')}/${name}.json`;
    const resource = await loadJsonResource(
      tableBase === null ? null : new URL(`${name}.json`, tableBase).href,
      args.vfsFallback,
      logicalPath,
    );
    await writeAtomicBytes(path.join(tableDirectory, `${name}.json`), resource.content);
    provenance.push(resource.provenance);
    process.stdout.write(`TableCfg: ${name}\n`);
  });

  if (args.tablesOnly) {
    await writeProvenance(args.output, versionId, provenance);
    process.stdout.write(`downloaded ${versionId}: ${catalog.tableCfg.length} tables\n`);
    return;
  }

  const counts: string[] = [];
  for (const logicalPath of catalog.jsonFiles) {
    provenance.push((await downloadExactJson(logicalPath)).provenance);
  }
  let sharedJsonFiles: readonly string[] = [];
  try {
    const indexResource = await loadJsonResource(
      new URL(catalog.sharedJsonIndex, `${cdn}/`).href,
      null,
      catalog.sharedJsonIndex,
    );
    provenance.push(indexResource.provenance);
    sharedJsonFiles = parseAkedbSharedJsonIndex(indexResource.value, catalog.sharedJsonIndex);
  } catch (error) {
    if (args.vfsFallback === null) throw error;
    process.stdout.write(
      `AKEDB shared JSON index is unavailable; collections will use vfs-index-browser: ${formatError(error)}\n`,
    );
  }
  for (const [name, directory] of Object.entries(catalog.jsonCollections)) {
    const count = await downloadJsonCollection(
      cdn,
      name,
      sharedJsonFiles,
      path.join(args.output, directory),
      args.workers,
      args.vfsFallback,
      provenance,
    );
    counts.push(`${name}=${count}`);
  }
  process.stdout.write(
    `downloaded ${versionId}: ${catalog.tableCfg.length} tables, ${counts.join(', ')}\n`,
  );
  await writeProvenance(args.output, versionId, provenance);

  async function downloadExactJson(logicalPath: string) {
    const resource = await loadJsonResource(
      new URL(`public/Json/${logicalPath}`, `${cdn}/`).href,
      args.vfsFallback,
      logicalPath,
    );
    await writeAtomicBytes(path.join(args.output, logicalPath), resource.content);
    process.stdout.write(`JSON: ${logicalPath}\n`);
    return resource;
  }
}

async function downloadJsonCollection(
  cdn: string,
  name: string,
  sharedJsonFiles: readonly string[],
  output: string,
  workers: number,
  vfsFallback: string | null,
  provenance: SourceProvenanceEntry[],
): Promise<number> {
  const jobs = sharedJsonFiles
    .filter(file => path.posix.dirname(file) === name)
    .map(file => ({
      filename: path.posix.basename(file),
      url: new URL(`public/Json/${file}`, `${cdn}/`).href as string | null,
    }));
  // AKEDB 已提供集合清单时，只对其中明确资源逐文件 fallback。直接合并本机整个集合会把
  // 与当前 Endaxis 根无关的敌人/关卡新资源带入；额外定义由领域闭包下载器按精确 ID 获取。
  if (vfsFallback !== null && jobs.length === 0) {
    try {
      const fallbackManifest = requireArray(
        (await loadFallbackJsonResource(vfsFallback, `${name}/manifest.json`)).value,
        `${name} vfs-index-browser manifest`,
      );
      const known = new Set(jobs.map(job => job.filename));
      for (const job of collectionManifestJobs(fallbackManifest, name, fallbackBase(vfsFallback))) {
        if (!known.has(job.filename)) {
          jobs.push({ filename: job.filename, url: null });
          known.add(job.filename);
        }
      }
    } catch (error) {
      if (!isUnavailableFallbackError(error)) throw error;
    }
  }
  requireUnique(
    jobs.map(job => job.filename),
    `${name} manifest filenames`,
  );
  await fs.mkdir(output, { recursive: true });
  const existing = (await fs.readdir(output)).filter(filename => filename.endsWith('.json'));
  const expected = new Set(jobs.map(job => job.filename));
  const unexpected = existing.filter(filename => !expected.has(filename));
  if (unexpected.length > 0) {
    throw new Error(
      `${output}: files outside the current ${name} manifest ${JSON.stringify(unexpected.sort())}`,
    );
  }
  let completed = 0;
  await runConcurrent(jobs, workers, async job => {
    const logicalPath = `${name}/${job.filename}`;
    const resource = await loadJsonResource(job.url, vfsFallback, logicalPath);
    await writeAtomicBytes(path.join(output, job.filename), resource.content);
    provenance.push(resource.provenance);
    completed += 1;
    if (completed % 100 === 0 || completed === jobs.length) {
      process.stdout.write(`${name}: ${completed}/${jobs.length}\n`);
    }
  });
  return completed;
}

export function parseAkedbSharedJsonIndex(value: unknown, sourcePath: string): string[] {
  const root = requireRecord(value, sourcePath);
  if (root.schemaVersion !== 2) throw new Error(`${sourcePath}.schemaVersion: expected 2`);
  requireNonEmptyString(root.revision, `${sourcePath}.revision`);
  const datasets = requireRecord(root.datasets, `${sourcePath}.datasets`);
  const jsonDataset = requireRecord(datasets.json, `${sourcePath}.datasets.json`);
  const files = requireRecord(jsonDataset.files, `${sourcePath}.datasets.json.files`);
  return Object.entries(files)
    .map(([file, rawRecord]) => {
      const filePath = requireSafeRelativePath(file, `${sourcePath}.datasets.json.files key`);
      if (!filePath.endsWith('.json')) {
        throw new Error(`${sourcePath}.datasets.json.files.${file}: expected JSON path`);
      }
      const record = requireRecord(rawRecord, `${sourcePath}.datasets.json.files.${file}`);
      const size = requireInteger(record.size, `${sourcePath}.datasets.json.files.${file}.size`);
      if (size < 0)
        throw new Error(`${sourcePath}.datasets.json.files.${file}.size: expected >= 0`);
      const md5 = requireNonEmptyString(
        record.md5,
        `${sourcePath}.datasets.json.files.${file}.md5`,
      );
      if (!/^[0-9a-f]{32}$/.test(md5)) {
        throw new Error(`${sourcePath}.datasets.json.files.${file}.md5: expected lowercase MD5`);
      }
      return filePath;
    })
    .sort((left, right) => left.localeCompare(right));
}

export async function loadJsonResource(
  primaryUrl: string | null,
  fallbackResource: string | null,
  logicalPath: string,
): Promise<{ value: unknown; content: Uint8Array; provenance: SourceProvenanceEntry }> {
  let primaryError: unknown;
  if (primaryUrl !== null) {
    try {
      const content = await fetchBytes(primaryUrl);
      const value = JSON.parse(new TextDecoder('utf-8').decode(content));
      return {
        value,
        content,
        provenance: createSourceProvenance(logicalPath, 'akedb', primaryUrl, content),
      };
    } catch (error) {
      primaryError = error;
    }
  }
  if (fallbackResource !== null) {
    try {
      const { content, value, source } = await loadFallbackJsonResource(
        fallbackResource,
        logicalPath,
      );
      return {
        value,
        content,
        provenance: createSourceProvenance(logicalPath, 'vfs-index-browser', source, content),
      };
    } catch (error) {
      if (!isUnavailableFallbackError(error)) throw error;
    }
  }
  throw primaryError ?? new Error(`${logicalPath}: unavailable from every source provider`);
}

function createSourceProvenance(
  logicalPath: string,
  provider: SourceProvenanceEntry['provider'],
  source: string,
  content: Uint8Array,
): SourceProvenanceEntry {
  return {
    logicalPath,
    provider,
    source,
    byteLength: content.byteLength,
    sha256: createHash('sha256').update(content).digest('hex'),
  };
}

export async function writeAtomicBytes(output: string, content: Uint8Array): Promise<void> {
  await fs.mkdir(path.dirname(output), { recursive: true });
  const temporary = `${output}.part`;
  await fs.writeFile(temporary, content);
  await fs.rename(temporary, output);
}

async function writeProvenance(
  output: string,
  version: string,
  entries: readonly SourceProvenanceEntry[],
): Promise<void> {
  const content = new TextEncoder().encode(
    `${JSON.stringify(
      {
        version,
        entries: [...entries].sort((left, right) =>
          left.logicalPath.localeCompare(right.logicalPath),
        ),
      },
      null,
      2,
    )}\n`,
  );
  await writeAtomicBytes(path.join(output, 'akedb-source-provenance.json'), content);
}

async function fetchBytes(url: string, attempts = 3): Promise<Uint8Array> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Endaxis-Next/1' },
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) throw new HttpStatusError(url, response.status);
      return new Uint8Array(await response.arrayBuffer());
    } catch (error) {
      lastError = error;
      if (error instanceof HttpStatusError && error.status >= 400 && error.status < 500) {
        break;
      }
      if (attempt + 1 < attempts)
        await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000));
    }
  }
  throw lastError;
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
        const value = values[nextIndex]!;
        nextIndex += 1;
        await run(value);
      }
    }),
  );
}

export function parseArguments(values: readonly string[]): DownloadArguments {
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
  const workers = Number(result.get('--workers') ?? 12);
  return {
    cdn: result.get('--cdn') ?? DEFAULT_CDN,
    version: result.get('--version') ?? null,
    sourceCatalog: path.resolve(
      result.get('--source-catalog') ??
        path.join(projectRoot, 'tools/game-data-compiler/akedb-sources.json'),
    ),
    output: path.resolve(result.get('--output') ?? path.join(projectRoot, 'tmp/game-data-sources')),
    workers,
    tablesOnly,
    vfsFallback: normalizeFallbackArgument(result.get('--vfs-fallback')),
    ...(result.has('--json-file') ? { jsonFile: result.get('--json-file')! } : {}),
  };
}

function fallbackPath(root: string | null, logicalPath: string): string | null {
  if (root === null) return null;
  if (isHttpUrl(root)) return new URL(logicalPath, `${root.replace(/\/+$/, '')}/`).href;
  const resolved = path.resolve(root, ...logicalPath.split('/'));
  const relative = path.relative(root, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${logicalPath}: unsafe fallback path`);
  }
  return resolved;
}

function normalizeFallbackArgument(value: string | undefined): string | null {
  if (value === undefined) return null;
  return isHttpUrl(value) ? value.replace(/\/+$/, '') : path.resolve(value);
}

function fallbackBase(value: string): string {
  return isHttpUrl(value)
    ? `${value.replace(/\/+$/, '')}/`
    : pathToFileURL(`${value}${path.sep}`).href;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

async function loadFallbackJsonResource(
  fallbackRoot: string,
  logicalPath: string,
): Promise<{ value: unknown; content: Uint8Array; source: string }> {
  const source = fallbackPath(fallbackRoot, logicalPath);
  if (source === null) throw new Error(`${logicalPath}: fallback provider is unavailable`);
  const content = isHttpUrl(source)
    ? await fetchBytes(source)
    : new Uint8Array(await fs.readFile(source));
  return {
    value: JSON.parse(new TextDecoder('utf-8').decode(content)),
    content,
    source,
  };
}

function collectionManifestJobs(
  manifest: readonly unknown[],
  name: string,
  baseUrl: string,
): Array<{ filename: string; url: string | null }> {
  return manifest.map((value, index) => {
    const entry = requireRecord(value, `${name} manifest[${index}]`);
    const contentFile = requireNonEmptyString(
      entry.contentFile,
      `${name} manifest[${index}].contentFile`,
    );
    const filename = path.posix.basename(new URL(contentFile, baseUrl).pathname);
    if (!/^[A-Za-z0-9_.-]+\.json$/.test(filename)) {
      throw new Error(`${name} manifest[${index}]: expected a safe JSON content file`);
    }
    return {
      filename,
      url: new URL(contentFile.replace(/^\/+/, ''), baseUrl).href,
    };
  });
}

class HttpStatusError extends Error {
  public readonly status: number;

  public constructor(url: string, status: number) {
    super(`${url}: HTTP ${status}`);
    this.status = status;
  }
}

function isUnavailableFallbackError(error: unknown): boolean {
  return isMissingFileError(error) || (error instanceof HttpStatusError && error.status === 404);
}

function isMissingFileError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ENOENT'
  );
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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

function requireArray(value: unknown, sourcePath: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${sourcePath}: expected array`);
  return value;
}

function requireNonEmptyString(value: unknown, sourcePath: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${sourcePath}: expected non-empty string`);
  }
  return value;
}

function requireInteger(value: unknown, sourcePath: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${sourcePath}: expected integer`);
  }
  return value;
}

function requireStringArray(value: unknown, sourcePath: string): string[] {
  return requireArray(value, sourcePath).map((item, index) =>
    requireNonEmptyString(item, `${sourcePath}[${index}]`),
  );
}

function requireUnique(values: readonly string[], sourcePath: string): void {
  if (new Set(values).size !== values.length) throw new Error(`${sourcePath}: duplicate value`);
}

function requireSafeName(value: string, sourcePath: string): void {
  if (!/^[A-Za-z0-9_]+$/.test(value)) throw new Error(`${sourcePath}: expected a safe name`);
}

function requireSafeRelativePath(value: unknown, sourcePath: string): string {
  const parsed = requireNonEmptyString(value, sourcePath).replace(/\\/g, '/');
  const parts = parsed.split('/');
  if (parts.some(part => !part || part === '.' || part === '..' || /[\r\n]/.test(part))) {
    throw new Error(`${sourcePath}: expected a safe relative path`);
  }
  return parts.join('/');
}

const entryPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (entryPath === import.meta.url) {
  await downloadAkedbSources(parseArguments(process.argv.slice(2)));
}
