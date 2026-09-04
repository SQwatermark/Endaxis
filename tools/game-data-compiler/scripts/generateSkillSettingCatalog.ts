import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  parseSkillSettingDumpSource,
  renderSkillSettingDocument,
} from '../src/source/skillSettingDumpSource.ts';
import { writeAtomicBytes } from './downloadGameDataSources.ts';

export async function generateSkillSettingCatalog(args: {
  readonly sourceUrl: string;
  readonly revision: string;
  readonly output: string;
  readonly check: boolean;
}) {
  const response = await fetch(args.sourceUrl);
  if (!response.ok) throw new Error(`${args.sourceUrl}: HTTP ${response.status}`);
  const preview = (await response.json()) as {
    asset?: { Name?: unknown; Container?: unknown };
    text?: unknown;
  };
  if (
    preview.asset?.Name !== 'skillsetting' ||
    preview.asset.Container !==
      'assets/beyond/dynamicassets/gamedata/gameplayconfig/skillsetting.asset'
  )
    throw new Error(`${args.sourceUrl}: response is not the canonical SkillSetting asset`);
  if (typeof preview.text !== 'string')
    throw new Error(`${args.sourceUrl}: missing TypeTree dump text`);
  const source = parseSkillSettingDumpSource(preview.text, args.sourceUrl);
  const content = renderSkillSettingDocument(source, args.revision);
  if (args.check) {
    if ((await fs.readFile(args.output, 'utf8')).replaceAll('\r\n', '\n') !== content)
      throw new Error(`${args.output}: generated SkillSetting catalog is stale`);
  } else {
    await writeAtomicBytes(args.output, new TextEncoder().encode(content));
  }
  return {
    dataCount: source.data.length,
    formulaCount: source.enhanceFormulas.length,
    sourceSha256: source.sha256,
  };
}

function parseArguments(values: readonly string[]) {
  let check = false;
  const positional: string[] = [];
  for (const value of values) {
    if (value === '--check') check = true;
    else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 3) throw new Error('expected <VFS preview URL> <revision> <output>');
  return {
    sourceUrl: positional[0]!,
    revision: positional[1]!,
    output: path.resolve(positional[2]!),
    check,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await generateSkillSettingCatalog(parseArguments(process.argv.slice(2)));
  process.stdout.write(
    `SkillSetting rows: ${result.dataCount}; formulas: ${result.formulaCount}; SHA-256: ${result.sourceSha256}\n`,
  );
}
