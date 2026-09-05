import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  collectContingencyContractGlobalBuffIds,
  parseContingencyContractCatalogSource,
} from '../src/domains/mechanics/contingencyContractSource.ts';
import { writeAtomicBytes } from './downloadGameDataSources.ts';

export async function generateContingencyContractCatalog(args: {
  readonly tableRoot: string;
  readonly revision: string;
  readonly output: string;
  readonly check: boolean;
}) {
  const [tags, contracts, zhTexts, enTexts] = await Promise.all([
    readJsonWithInt64Strings(path.join(args.tableRoot, 'CcTagTable.json')),
    readJson(path.join(args.tableRoot, 'ContingencyContractTable.json')),
    readJson(path.join(args.tableRoot, 'I18nTextTable_CN.json')),
    readJson(path.join(args.tableRoot, 'I18nTextTable_EN.json')),
  ]);
  const catalog = parseContingencyContractCatalogSource(tags, contracts);
  const localizedText = (value: unknown, id: string, path: string) => {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error(`${path}: expected text table`);
    }
    const text = (value as Record<string, unknown>)[id];
    if (typeof text !== 'string' || text.length === 0) throw new Error(`${path}: missing ${id}`);
    return text;
  };
  const globalBuffIds = collectContingencyContractGlobalBuffIds(catalog);
  const enemyBuffIds = [
    ...new Set(
      catalog.tags.flatMap(tag =>
        tag.terms.flatMap(term => (term.kind === 'enemyBuff' ? [term.buffId] : [])),
      ),
    ),
  ].sort();
  const output = {
    version: args.revision,
    evidence: {
      sources: [
        'TableCfg-current/CcTagTable.json',
        'TableCfg-current/ContingencyContractTable.json',
      ],
      termTypeEnum:
        'Beyond.GEnums.ContingencyContractTermType: EnemyBuff=1, SelfGlobalBuff=2, ReduceChallengeTime=3',
    },
    contracts: catalog.contracts,
    tags: catalog.tags.map(tag => ({
      ...tag,
      localization: {
        zh: {
          name: localizedText(zhTexts, tag.nameTextId, 'I18nTextTable_CN'),
          description: localizedText(zhTexts, tag.descriptionTextId, 'I18nTextTable_CN'),
        },
        en: {
          name: localizedText(enTexts, tag.nameTextId, 'I18nTextTable_EN'),
          description: localizedText(enTexts, tag.descriptionTextId, 'I18nTextTable_EN'),
        },
      },
    })),
  };
  const content = `${JSON.stringify(output, null, 2)}\n`;
  if (args.check) {
    if ((await fs.readFile(args.output, 'utf8')).replaceAll('\r\n', '\n') !== content) {
      throw new Error(`${args.output}: generated Contingency Contract catalog is stale`);
    }
  } else {
    await writeAtomicBytes(args.output, new TextEncoder().encode(content));
  }
  return {
    contractCount: catalog.contracts.length,
    tagCount: catalog.tags.length,
    enemyBuffIds,
    globalBuffIds,
  };
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(file, 'utf8'));
}

async function readJsonWithInt64Strings(file: string): Promise<unknown> {
  const source = await fs.readFile(file, 'utf8');
  return JSON.parse(source.replace(/("id"\s*:\s*)(-?\d{16,})(?=\s*[,}])/g, '$1"$2"'));
}

function parseArguments(values: readonly string[]) {
  let check = false;
  const positional: string[] = [];
  for (const value of values) {
    if (value === '--check') check = true;
    else if (value.startsWith('--')) throw new Error(`unsupported argument ${value}`);
    else positional.push(value);
  }
  if (positional.length !== 3) throw new Error('expected <table root> <revision> <output>');
  return {
    tableRoot: path.resolve(positional[0]!),
    revision: positional[1]!,
    output: path.resolve(positional[2]!),
    check,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await generateContingencyContractCatalog(parseArguments(process.argv.slice(2)));
  process.stdout.write(
    `Contingency Contract: ${result.contractCount} contract(s), ${result.tagCount} tags, ` +
      `${result.enemyBuffIds.length} enemy Buff(s), ${result.globalBuffIds.length} GlobalBuff(s)\n`,
  );
}
