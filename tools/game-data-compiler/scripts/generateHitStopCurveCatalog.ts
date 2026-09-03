import fs from 'node:fs/promises';
import path from 'node:path';
import {
  parseHitStopCurveCatalogDumpSource,
  renderHitStopCurveCatalogModule,
} from '../src/source/hitStopCurveCatalog.ts';
import { writeAtomicBytes } from './downloadGameDataSources.ts';

const args = parseArguments(process.argv.slice(2));
const response = await fetch(args.sourceUrl);
if (!response.ok) throw new Error(`${args.sourceUrl}: HTTP ${response.status}`);
const preview = (await response.json()) as {
  asset?: { Name?: unknown; Container?: unknown };
  text?: unknown;
};
if (
  preview.asset?.Name !== 'hitstopconfig' ||
  preview.asset.Container !==
    'assets/beyond/dynamicassets/gamedata/gameplayconfig/hitstopconfig.asset'
)
  throw new Error(`${args.sourceUrl}: response is not the canonical HitStopConfig asset`);
if (typeof preview.text !== 'string')
  throw new Error(`${args.sourceUrl}: missing TypeTree dump text`);
const source = parseHitStopCurveCatalogDumpSource(preview.text, args.sourceUrl);
const content = renderHitStopCurveCatalogModule(source);
if (args.check) {
  if ((await fs.readFile(args.output, 'utf8')).replaceAll('\r\n', '\n') !== content)
    throw new Error(`${args.output}: generated HitStop curve catalog is stale`);
} else {
  await writeAtomicBytes(args.output, new TextEncoder().encode(content));
}
process.stdout.write(
  `HitStop curves: ${Object.keys(source.curves).length}; SHA-256: ${source.sha256}\n`,
);

function parseArguments(values: readonly string[]) {
  let check = false;
  const positional: string[] = [];
  for (const value of values) {
    if (value === '--check') check = true;
    else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 2) throw new Error('expected <VFS preview URL> <output>');
  return { sourceUrl: positional[0]!, output: path.resolve(positional[1]!), check };
}
