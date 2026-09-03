import { readFile, readdir } from 'node:fs/promises';
import { basename, isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';
import { GameplayTagRegistry } from '../src/source/nativeGameplayTags.ts';
import { readGameplayTagPaths } from './readGameplayTagPaths.ts';
import { requireRecord } from '../src/source/primitives.ts';
import type { CompiledEquipmentSuitRuntimeBatchSource } from '../src/domains/equipment/suitRuntimeDefinition.ts';

import {
  checkEquipmentDefinitionFiles,
  compileEquipmentSuitRuntimeBatchSource,
  compileEquipmentSuitStaticDefinitionBatchSource,
  renderEquipmentSuitDefinitionFiles,
  writeEquipmentDefinitionFiles,
} from '../src/index.ts';

export interface GearSetGenerationArguments {
  readonly tablesDirectory: string;
  readonly skillDataDirectory: string;
  readonly buffDataDirectory: string;
  readonly gameplayTagCatalog: string;
  readonly outputDirectory: string;
  readonly check: boolean;
}

/** 正式生成遍历来源表的全部身份，不再用历史发布名单截断新增内容。 */
export async function generateGearSetDefinitions(input: GearSetGenerationArguments) {
  const table = async (name: string) =>
    JSON.parse(await readFile(resolve(input.tablesDirectory, `${name}.json`), 'utf8')) as unknown;
  const skillData = await readJsonDirectory(input.skillDataDirectory);
  const buffData = await readJsonDirectory(input.buffDataDirectory);
  const gameplayTagRegistry = new GameplayTagRegistry(
    readGameplayTagPaths(input.gameplayTagCatalog),
  );
  const batch = compileAllGearSetDefinitions(
    await table('EquipSuitTable'),
    skillData,
    await table('SkillPatchTable'),
    buffData,
    gameplayTagRegistry,
  );
  const blocked = batch.diagnostics.filter(diagnostic => diagnostic.status === 'blocked');
  if (blocked.length) {
    throw new Error(
      `gear sets are not runtime-closed:\n${blocked.map(diagnostic => `${diagnostic.sourcePath}: ${diagnostic.reason}`).join('\n')}`,
    );
  }
  const prettierConfig = (await resolveConfig(resolve('.prettierrc.json'))) ?? {};
  const files = await Promise.all(
    renderEquipmentSuitDefinitionFiles(batch).map(async file => ({
      ...file,
      content: file.relativePath.endsWith('.ts')
        ? await format(file.content, { ...prettierConfig, parser: 'typescript' })
        : file.content,
    })),
  );
  if (input.check) {
    checkEquipmentDefinitionFiles(input.outputDirectory, files);
  } else {
    await writeEquipmentDefinitionFiles(input.outputDirectory, files);
  }
  return {
    outputDirectory: input.outputDirectory,
    definitionCount: batch.definitions.length,
    buffDefinitionCount: batch.definitions.reduce(
      (count, definition) => count + Object.keys(definition.buffDefinitions ?? {}).length,
      0,
    ),
    scenarioOmittedDiagnosticCount: batch.diagnostics.filter(
      diagnostic => diagnostic.status === 'scenario-omitted',
    ).length,
  };
}

/** 每个来源身份独立走同一公共静态/运行编译器；错误收齐后才允许渲染和写盘。 */
export function compileAllGearSetDefinitions(
  equipSuitTableValue: unknown,
  skillData: unknown,
  skillPatchTable: unknown,
  buffData: unknown,
  gameplayTagRegistry?: GameplayTagRegistry,
): CompiledEquipmentSuitRuntimeBatchSource {
  const table = requireRecord(equipSuitTableValue, 'EquipSuitTable');
  const definitions: CompiledEquipmentSuitRuntimeBatchSource['definitions'][number][] = [];
  const diagnostics: CompiledEquipmentSuitRuntimeBatchSource['diagnostics'][number][] = [];
  const identities = Object.keys(table).sort((a, b) => a.localeCompare(b));
  if (!identities.length)
    throw new Error('EquipSuitTable: empty source cannot generate a formal library');
  for (const identity of identities) {
    try {
      const source = compileEquipmentSuitStaticDefinitionBatchSource(
        table,
        skillData,
        skillPatchTable,
        [identity],
      );
      diagnostics.push(...source.diagnostics);
      if (source.diagnostics.some(d => d.status === 'blocked')) continue;
      if (source.definitions.length !== 1)
        throw new Error('expected exactly one static definition for this source identity');
      const runtime = compileEquipmentSuitRuntimeBatchSource(
        source.definitions,
        source.runtimeDependencies,
        buffData,
        gameplayTagRegistry,
      );
      diagnostics.push(...runtime.diagnostics);
      if (runtime.diagnostics.some(d => d.status === 'blocked')) continue;
      if (runtime.definitions.length !== 1)
        throw new Error('expected exactly one runtime-closed definition for this source identity');
      definitions.push(runtime.definitions[0]!);
    } catch (error) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `EquipSuitTable.${identity}`,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { definitions, diagnostics };
}

async function readJsonDirectory(directory: string): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const file of (await readdir(directory)).sort()) {
    if (!file.endsWith('.json') || file.endsWith('.audit.json')) continue;
    result[basename(file, '.json')] = JSON.parse(
      await readFile(resolve(directory, file), 'utf8'),
    ) as unknown;
  }
  return result;
}

function parseArguments(values: readonly string[]): GearSetGenerationArguments {
  const entries: Record<string, string> = {};
  let check = false;
  const allowed = new Set([
    '--tables',
    '--skills',
    '--buffs',
    '--gameplay-tag-catalog',
    '--output',
  ]);
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (key === '--check') {
      if (check) throw new Error('duplicate --check');
      check = true;
      continue;
    }
    const value = values[index + 1];
    if (
      key === undefined ||
      !allowed.has(key) ||
      entries[key] !== undefined ||
      value === undefined ||
      value.startsWith('--')
    ) {
      throw new Error('expected --key value arguments');
    }
    entries[key] = value;
    index += 1;
  }
  for (const required of ['--tables', '--skills', '--buffs', '--gameplay-tag-catalog']) {
    if (entries[required] === undefined) throw new Error(`missing ${required}`);
  }
  const outputDirectory = resolve(
    entries['--output'] ?? 'src/next/data/equipment/generated-gear-sets',
  );
  const result = {
    tablesDirectory: resolve(entries['--tables']!),
    skillDataDirectory: resolve(entries['--skills']!),
    buffDataDirectory: resolve(entries['--buffs']!),
    gameplayTagCatalog: resolve(entries['--gameplay-tag-catalog']!),
    outputDirectory,
    check,
  };
  for (const [name, path] of Object.entries(result).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  )) {
    if (!isAbsolute(path)) throw new Error(`${name} must resolve to an absolute path`);
  }
  return result;
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  console.log(
    JSON.stringify(await generateGearSetDefinitions(parseArguments(process.argv.slice(2)))),
  );
}
