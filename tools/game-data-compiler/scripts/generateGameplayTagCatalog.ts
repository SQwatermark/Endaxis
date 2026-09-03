import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  compileGameplayTagCatalogSource,
  parseGameplayTagConfigDumpSource,
  renderGameplayTagCatalogModule,
} from '../src/index.ts';
import { writeAtomicBytes } from './downloadVfsSources.ts';
import { readGameplayTagConfigSetExport } from './readGameplayTagConfigSetExport.ts';
import { parseGameplayTagConfigSetDumpSource } from '../src/source/gameplayTagConfigDump.ts';

const EXPECTED_DUMP_SHA256 = '3758bb1f10764ce9d1bda9ef5200d77b3fe93ea59dbd0e09f196c18221019cf8';
const EXPECTED_SET_SHA256 = '5d6901da5e6139aafbc88f8c71de4de50563fbbb0db69c3de7f258ba92d4789a';
const args = parseArguments(process.argv.slice(2));
const directorySource = args.sourceDirectory
  ? await readGameplayTagDumpDirectory(args.dump)
  : undefined;
const bytes = directorySource === undefined ? new Uint8Array(await fs.readFile(args.dump)) : null;
const sha256 = directorySource?.sha256 ?? createHash('sha256').update(bytes!).digest('hex');
if (
  sha256 !== (args.sourceSet ? EXPECTED_SET_SHA256 : EXPECTED_DUMP_SHA256) &&
  !args.allowNewSource
) {
  throw new Error(
    `unexpected GameplayTagConfig dump SHA-256 ${sha256}; ` +
      'audit the new source before passing --allow-new-source',
  );
}
const completeSet = args.sourceSet
  ? readGameplayTagConfigSetExport(args.dump, args.sourceRoot)
  : undefined;
const catalog =
  directorySource?.catalog ??
  completeSet?.catalog ??
  compileGameplayTagCatalogSource(parseGameplayTagConfigDumpSource(bytes!, args.dump));
const content = renderGameplayTagCatalogModule(catalog, sha256);
if (args.check) {
  const existing = await fs.readFile(args.output, 'utf8');
  if (existing !== content) {
    throw new Error(`${args.output}: generated GameplayTag catalog is stale`);
  }
} else {
  await writeAtomicBytes(args.output, new TextEncoder().encode(content));
}
process.stdout.write(`GameplayTag paths: ${catalog.paths.length}\n`);
if (completeSet ?? directorySource)
  process.stdout.write(
    `configs: ${(completeSet ?? directorySource)!.configCount}; invalid empty entries: ${(completeSet ?? directorySource)!.emptyPathCount}; duplicate paths: ${(completeSet ?? directorySource)!.duplicatePathCount}\n`,
  );

async function readGameplayTagDumpDirectory(directory: string) {
  const names = (await fs.readdir(directory)).filter(name => name.endsWith('.txt')).sort();
  const setName = names.find(name => name.toLowerCase() === 'gameplaytagconfigset.txt');
  if (setName === undefined) throw new Error(`${directory}: GameplayTagConfigSet dump is missing`);
  const setBytes = new Uint8Array(await fs.readFile(path.resolve(directory, setName)));
  const references = parseGameplayTagConfigSetDumpSource(
    setBytes,
    path.resolve(directory, setName),
  );
  const configNames = names.filter(name => name !== setName);
  if (configNames.length !== references.length)
    throw new Error(
      `${directory}: expected ${references.length} GameplayTagConfig dumps, found ${configNames.length}`,
    );
  const paths = new Set<string>();
  let emptyPathCount = 0;
  let duplicatePathCount = 0;
  const hash = createHash('sha256');
  hash.update(setName).update(setBytes);
  for (const name of configNames) {
    const file = path.resolve(directory, name);
    const configBytes = new Uint8Array(await fs.readFile(file));
    hash.update(name).update(configBytes);
    const source = parseGameplayTagConfigDumpSource(configBytes, file);
    for (const tag of source.paths) {
      if (tag === '') {
        emptyPathCount++;
        continue;
      }
      if (paths.has(tag)) duplicatePathCount++;
      paths.add(tag);
    }
  }
  return {
    catalog: compileGameplayTagCatalogSource({ paths: [...paths] }),
    sha256: hash.digest('hex'),
    configCount: configNames.length,
    emptyPathCount,
    duplicatePathCount,
  };
}

function parseArguments(values: readonly string[]) {
  const positional: string[] = [];
  let allowNewSource = false;
  let check = false;
  let sourceSet = false;
  let sourceDirectory = false;
  let sourceRoot: string | undefined;
  for (let index = 0; index < values.length; index++) {
    const value = values[index]!;
    if (value === '--allow-new-source') allowNewSource = true;
    else if (value === '--check') check = true;
    else if (value === '--source-set') sourceSet = true;
    else if (value === '--source-directory') sourceDirectory = true;
    else if (value === '--source-root') {
      sourceRoot = values[++index];
      if (!sourceRoot || sourceRoot.startsWith('--'))
        throw new Error('--source-root requires a directory');
    } else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 2) {
    throw new Error(
      'expected <GameplayTagConfig dump, dump directory, or source-set.json> <output> [--source-set|--source-directory] [--check]',
    );
  }
  if (sourceRoot !== undefined && !sourceSet)
    throw new Error('--source-root requires --source-set');
  if (sourceSet && sourceDirectory)
    throw new Error('--source-set and --source-directory are mutually exclusive');
  return {
    dump: path.resolve(positional[0]!),
    output: path.resolve(positional[1]!),
    allowNewSource,
    check,
    sourceSet,
    sourceDirectory,
    sourceRoot,
  };
}
