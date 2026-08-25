import fs from 'node:fs/promises';
import path from 'node:path';

import { planOperatorUnityTemplateReferences } from '../src/index.ts';
import {
  DEFAULT_CDN,
  loadAkedbSourceCatalog,
  loadJsonResource,
  parseAkedbSharedJsonIndex,
  runConcurrent,
  type SourceProvenanceEntry,
  writeAtomicBytes,
} from './downloadAkedbSources.ts';
import { readOperatorSourceFiles } from './operatorSourceFiles.ts';

interface Arguments {
  readonly cdn: string;
  readonly sourceCatalog: string;
  readonly output: string;
  readonly manifest: string;
  readonly skillData: string;
  readonly buffData: string;
  readonly tables: string;
  readonly workers: number;
  readonly vfsFallback: string | null;
}

interface DownloadFailure {
  readonly logicalPath: string;
  readonly message: string;
}

const args = parseArguments(process.argv.slice(2));
const catalog = await loadAkedbSourceCatalog(args.sourceCatalog);
const cdn = args.cdn.replace(/\/+$/, '');
const sharedIndexResource = await loadJsonResource(
  new URL(catalog.sharedJsonIndex, `${cdn}/`).href,
  null,
  catalog.sharedJsonIndex,
);
const sharedFiles = new Set(
  parseAkedbSharedJsonIndex(sharedIndexResource.value, catalog.sharedJsonIndex),
);
const provenance: SourceProvenanceEntry[] = [sharedIndexResource.provenance];
const failures: DownloadFailure[] = [];

let plan = buildPlan();
for (let round = 0; round < 8; round += 1) {
  const unresolved = uniqueDefinitions(plan.unresolvedDefinitions);
  if (unresolved.length === 0) break;
  let acquired = 0;
  await runConcurrent(unresolved, args.workers, async definition => {
    const collection = definition.kind === 'skill' ? 'SkillData' : 'BuffData';
    const directory = catalog.jsonCollections[collection];
    if (!directory) throw new Error(`source catalog does not declare ${collection}`);
    const filename = `${definition.id}.json`;
    const outputPath = path.join(args.output, directory, filename);
    if (await isFile(outputPath)) return;
    const logicalPath = `${collection}/${filename}`;
    try {
      const resource = await loadJsonResource(
        sharedFiles.has(logicalPath)
          ? new URL(`public/Json/${logicalPath}`, `${cdn}/`).href
          : null,
        args.vfsFallback,
        logicalPath,
      );
      await writeAtomicBytes(outputPath, resource.content);
      provenance.push(resource.provenance);
      acquired += 1;
    } catch (error) {
      recordFailure(failures, logicalPath, error);
    }
  });
  if (acquired === 0) break;
  plan = buildPlan();
}

const collectionByKind = new Map(
  Object.entries(catalog.operatorClosureCollections).map(([collection, configuration]) => [
    configuration.definitionKind,
    { collection, output: configuration.output },
  ]),
);
for (const [kind, entries] of [
  ['projectile', plan.projectiles] as const,
  ['abilityEntity', plan.abilityEntities] as const,
]) {
  const configuration = collectionByKind.get(kind);
  if (!configuration) throw new Error(`source catalog does not declare ${kind} closure output`);
  let completed = 0;
  await runConcurrent(entries, args.workers, async entry => {
    const filename = `${entry.id}.json`;
    const logicalPath = `${configuration.collection}/${filename}`;
    try {
      const resource = await loadJsonResource(
        sharedFiles.has(logicalPath)
          ? new URL(`public/Json/${logicalPath}`, `${cdn}/`).href
          : null,
        args.vfsFallback,
        logicalPath,
      );
      await writeAtomicBytes(path.join(args.output, configuration.output, filename), resource.content);
      provenance.push(resource.provenance);
      completed += 1;
      if (completed % 25 === 0 || completed === entries.length) {
        process.stdout.write(`${configuration.collection}: ${completed}/${entries.length}\n`);
      }
    } catch (error) {
      recordFailure(failures, logicalPath, error);
    }
  });
}

const report = {
  format: 'EndaxisOperatorSourceClosureDownload',
  complete: plan.complete && failures.length === 0,
  plan,
  failures: failures.sort((left, right) => left.logicalPath.localeCompare(right.logicalPath)),
  provenance: provenance.sort((left, right) => left.logicalPath.localeCompare(right.logicalPath)),
};
await writeAtomicBytes(
  path.join(args.output, 'operator-source-closure-download.json'),
  new TextEncoder().encode(`${JSON.stringify(report, null, 2)}\n`),
);
process.stdout.write(
  `Operator closure: projectiles=${plan.projectiles.length}, abilityEntities=${plan.abilityEntities.length}, ` +
    `unresolvedDefinitions=${plan.unresolvedDefinitions.length}, failures=${failures.length}\n`,
);
if (!report.complete) process.exitCode = 1;

function buildPlan() {
  return planOperatorUnityTemplateReferences(
    readOperatorSourceFiles({
      manifest: args.manifest,
      skillData: args.skillData,
      buffData: args.buffData,
      tables: args.tables,
    }),
  );
}

function uniqueDefinitions(
  values: readonly { readonly kind: 'skill' | 'buff'; readonly id: string }[],
): Array<{ kind: 'skill' | 'buff'; id: string }> {
  const seen = new Set<string>();
  return values.filter(value => {
    const key = `${value.kind}\0${value.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function recordFailure(failures: DownloadFailure[], logicalPath: string, error: unknown): void {
  if (failures.some(failure => failure.logicalPath === logicalPath)) return;
  failures.push({
    logicalPath,
    message: error instanceof Error ? error.message : String(error),
  });
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function parseArguments(values: readonly string[]): Arguments {
  const result = new Map<string, string>();
  for (let index = 0; index < values.length; index += 2) {
    const name = values[index];
    const value = values[index + 1];
    if (!name?.startsWith('--') || value === undefined) throw new Error(`missing value for ${name}`);
    result.set(name, value);
  }
  const projectRoot = path.resolve(import.meta.dirname, '../../..');
  const output = path.resolve(result.get('--output') ?? path.join(projectRoot, 'tmp/game-data-sources'));
  const tableDirectory = path.join(output, 'TableCfg-1.4.4-9433094-12');
  const workers = Number(result.get('--workers') ?? 12);
  if (!Number.isInteger(workers) || workers <= 0) throw new Error('--workers: expected positive integer');
  return {
    cdn: result.get('--cdn') ?? DEFAULT_CDN,
    sourceCatalog: path.resolve(
      result.get('--source-catalog') ?? path.join(projectRoot, 'tools/game-data-compiler/akedb-sources.json'),
    ),
    output,
    manifest: path.resolve(
      result.get('--manifest') ?? path.join(projectRoot, 'scripts/generate_next_operators/operators.json'),
    ),
    skillData: path.resolve(result.get('--skill-data') ?? path.join(output, 'skill-data-cdn')),
    buffData: path.resolve(result.get('--buff-data') ?? path.join(output, 'BuffData')),
    tables: path.resolve(result.get('--tables') ?? tableDirectory),
    workers,
    vfsFallback: result.has('--vfs-fallback')
      ? normalizeFallback(result.get('--vfs-fallback')!)
      : null,
  };
}

function normalizeFallback(value: string): string {
  return /^https?:\/\//i.test(value) ? value.replace(/\/+$/, '') : path.resolve(value);
}
