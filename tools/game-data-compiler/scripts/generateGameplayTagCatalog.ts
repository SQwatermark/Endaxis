import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import {
  compileGameplayTagCatalogSource,
  parseGameplayTagConfigDumpSource,
  renderGameplayTagCatalogModule,
} from '../src/index.ts';
import { writeAtomicBytes } from './downloadAkedbSources.ts';

const EXPECTED_DUMP_SHA256 = '3758bb1f10764ce9d1bda9ef5200d77b3fe93ea59dbd0e09f196c18221019cf8';
const args = parseArguments(process.argv.slice(2));
const bytes = new Uint8Array(await fs.readFile(args.dump));
const sha256 = createHash('sha256').update(bytes).digest('hex');
if (sha256 !== EXPECTED_DUMP_SHA256 && !args.allowNewSource) {
  throw new Error(
    `unexpected GameplayTagConfig dump SHA-256 ${sha256}; ` +
      'audit the new source before passing --allow-new-source',
  );
}
const source = parseGameplayTagConfigDumpSource(bytes, args.dump);
const content = renderGameplayTagCatalogModule(compileGameplayTagCatalogSource(source), sha256);
if (args.check) {
  const existing = await fs.readFile(args.output, 'utf8');
  if (existing !== content) {
    throw new Error(`${args.output}: generated GameplayTag catalog is stale`);
  }
} else {
  await writeAtomicBytes(args.output, new TextEncoder().encode(content));
}
process.stdout.write(`GameplayTag paths: ${source.paths.length}\n`);

function parseArguments(values: readonly string[]) {
  const positional: string[] = [];
  let allowNewSource = false;
  let check = false;
  for (const value of values) {
    if (value === '--allow-new-source') allowNewSource = true;
    else if (value === '--check') check = true;
    else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 2) {
    throw new Error('expected <GameplayTagConfig dump> <output>');
  }
  return {
    dump: path.resolve(positional[0]!),
    output: path.resolve(positional[1]!),
    allowNewSource,
    check,
  };
}
