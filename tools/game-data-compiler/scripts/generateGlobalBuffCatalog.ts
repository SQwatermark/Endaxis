import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseGlobalBuffDumpSource } from '../src/source/globalBuffDumpSource.ts';
import { writeAtomicBytes } from './downloadGameDataSources.ts';

export async function generateGlobalBuffCatalog(args: {
  readonly vfsBase: string;
  readonly revision: string;
  readonly identities: string;
  readonly output: string;
  readonly check: boolean;
}) {
  const idsValue: unknown = JSON.parse(await fs.readFile(args.identities, 'utf8'));
  if (!Array.isArray(idsValue) || idsValue.some(id => typeof id !== 'string' || id.length === 0))
    throw new Error(`${args.identities}: expected non-empty GlobalBuff ID array`);
  const ids = [...new Set(idsValue as string[])].sort();
  if (ids.length !== idsValue.length)
    throw new Error(`${args.identities}: duplicate GlobalBuff ID`);
  const templates: Record<string, unknown> = {};
  const assets: { id: string; path: string; sourceUrl: string; sourceSha256: string }[] = [];
  for (const id of ids) {
    const expectedPath = `assets/beyond/dynamicassets/gameplay/globalbuff/${id}.asset`;
    const sourceUrl = await resolveNamedManifestAssetPreview(
      args.vfsBase,
      `${id}.asset`,
      expectedPath,
    );
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error(`${sourceUrl}: HTTP ${response.status}`);
    const preview = (await response.json()) as {
      asset?: { Name?: unknown; Container?: unknown };
      text?: unknown;
    };
    if (preview.asset?.Name !== id || preview.asset.Container !== expectedPath)
      throw new Error(`${sourceUrl}: response is not canonical GlobalBuff ${id}`);
    if (typeof preview.text !== 'string')
      throw new Error(`${sourceUrl}: missing TypeTree dump text`);
    const source = parseGlobalBuffDumpSource(preview.text, sourceUrl);
    if (source.template.id !== id) throw new Error(`${sourceUrl}: GlobalBuff identity mismatch`);
    templates[id] = source.template;
    assets.push({ id, path: expectedPath, sourceUrl, sourceSha256: source.sha256 });
  }
  const content = `${JSON.stringify(
    { version: args.revision, evidence: { source: 'vfs-index-browser', assets }, templates },
    null,
    2,
  )}\n`;
  if (args.check) {
    if ((await fs.readFile(args.output, 'utf8')).replaceAll('\r\n', '\n') !== content)
      throw new Error(`${args.output}: generated GlobalBuff catalog is stale`);
  } else {
    await writeAtomicBytes(args.output, new TextEncoder().encode(content));
  }
  return { templateCount: ids.length, assets };
}

async function resolveNamedManifestAssetPreview(
  vfsBase: string,
  name: string,
  expectedPath: string,
) {
  const endpoint = new URL('/api/manifest-assets/by-name', vfsBase);
  endpoint.searchParams.set('name', name);
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`${endpoint}: HTTP ${response.status}`);
  const document = (await response.json()) as {
    candidates?: readonly { path?: unknown; previewUrl?: unknown }[];
  };
  const matches = (document.candidates ?? []).filter(item => item.path === expectedPath);
  if (matches.length !== 1 || typeof matches[0]!.previewUrl !== 'string')
    throw new Error(`${endpoint}: expected exactly one ${expectedPath}`);
  return new URL(matches[0]!.previewUrl, vfsBase).href;
}

function parseArguments(values: readonly string[]) {
  let check = false;
  const positional: string[] = [];
  for (const value of values) {
    if (value === '--check') check = true;
    else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 4)
    throw new Error('expected <VFS base URL> <revision> <identity JSON> <output>');
  return {
    vfsBase: positional[0]!,
    revision: positional[1]!,
    identities: path.resolve(positional[2]!),
    output: path.resolve(positional[3]!),
    check,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await generateGlobalBuffCatalog(parseArguments(process.argv.slice(2)));
  process.stdout.write(`GlobalBuff templates: ${result.templateCount}\n`);
}
