import { readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { format, resolveConfig } from 'prettier';

import {
  checkEquipmentDefinitionFiles,
  compileEquipmentDefinitionBatchSource,
  parseEquipmentItemSources,
  renderEquipmentDefinitionFiles,
  writeEquipmentDefinitionFiles,
} from '../src/index.ts';

export interface GearGenerationArguments {
  readonly tablesDirectory: string;
  readonly outputDirectory: string;
  readonly check: boolean;
}

/** 单件装备的 CLI 与隔离重建共用同一个生成入口；不读取任何现存生成定义。 */
export async function generateGearDefinitions(argumentsValue: GearGenerationArguments) {
  const { batch, files } = await planGearDefinitions(argumentsValue.tablesDirectory);
  if (argumentsValue.check) {
    checkEquipmentDefinitionFiles(argumentsValue.outputDirectory, files);
  } else {
    await writeEquipmentDefinitionFiles(argumentsValue.outputDirectory, files);
  }

  const omitted = batch.diagnostics.filter(diagnostic => diagnostic.status === 'scenario-omitted');
  return {
    outputDirectory: argumentsValue.outputDirectory,
    definitionCount: batch.definitions.length,
    fileCount: files.length,
    scenarioOmittedDiagnosticCount: omitted.length,
    definitionIds: batch.definitions.map(definition => definition.slug),
    diagnostics: batch.diagnostics,
  };
}

/** 只读规划供生成、确定性检查与应用层候选验证共用；不会导入现有装备定义。 */
export async function planGearDefinitions(tablesDirectory: string) {
  const equipTable = await readJson(resolve(tablesDirectory, 'EquipTable.json'));
  const itemTable = await readJson(resolve(tablesDirectory, 'ItemTable.json'));
  if (!isRecord(equipTable)) throw new Error('EquipTable.json: expected an object');

  const equipmentIds = Object.keys(equipTable).sort((left, right) => left.localeCompare(right));
  const equipment = parseEquipmentItemSources(
    equipTable,
    itemTable,
    equipmentIds,
    'EquipTable',
    'ItemTable',
  );
  const batch = compileEquipmentDefinitionBatchSource(equipment);
  const prettierConfig = (await resolveConfig(resolve('.prettierrc.json'))) ?? {};
  const files = await Promise.all(
    renderEquipmentDefinitionFiles(batch).map(async file => ({
      ...file,
      content: file.relativePath.endsWith('.ts')
        ? await format(file.content, { ...prettierConfig, parser: 'typescript' })
        : file.content,
    })),
  );
  return { batch, files };
}

function parseArguments(values: readonly string[]): GearGenerationArguments {
  let tablesDirectory: string | undefined;
  let outputDirectory = resolve('src/next/data/equipment/generated');
  let check = false;
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (key === '--check') {
      check = true;
      continue;
    }
    const value = values[index + 1];
    if (
      (key !== '--tables' && key !== '--output') ||
      value === undefined ||
      value.startsWith('--')
    ) {
      throw new Error(
        'usage: node generateGearDefinitions.ts --tables <directory> [--output <directory>] [--check]',
      );
    }
    if (key === '--tables') tablesDirectory = resolve(value);
    else outputDirectory = resolve(value);
    index += 1;
  }
  if (tablesDirectory === undefined || !isAbsolute(tablesDirectory)) {
    throw new Error('--tables must resolve to an absolute directory');
  }
  return { tablesDirectory, outputDirectory, check };
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const {
    definitionIds: _ids,
    diagnostics: _diagnostics,
    ...summary
  } = await generateGearDefinitions(parseArguments(process.argv.slice(2)));
  console.log(JSON.stringify(summary));
}
