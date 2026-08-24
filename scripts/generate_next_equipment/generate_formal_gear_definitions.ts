import { readFile } from 'node:fs/promises';
import { isAbsolute, resolve } from 'node:path';

import {
  compileEquipmentDefinitionBatchSource,
  parseEquipmentItemSources,
  renderEquipmentDefinitionFiles,
  writeEquipmentDefinitionFiles,
} from '../../tools/game-data-compiler/src/index.ts';

interface Arguments {
  readonly tablesDirectory: string;
  readonly outputDirectory: string;
}

const argumentsValue = parseArguments(process.argv.slice(2));
const equipTable = await readJson(resolve(argumentsValue.tablesDirectory, 'EquipTable.json'));
const itemTable = await readJson(resolve(argumentsValue.tablesDirectory, 'ItemTable.json'));
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
const files = renderEquipmentDefinitionFiles(batch);
await writeEquipmentDefinitionFiles(argumentsValue.outputDirectory, files);

const omitted = batch.diagnostics.filter(diagnostic => diagnostic.status === 'scenario-omitted');
console.log(
  JSON.stringify({
    outputDirectory: argumentsValue.outputDirectory,
    definitionCount: batch.definitions.length,
    fileCount: files.length,
    scenarioOmittedDiagnosticCount: omitted.length,
  }),
);

function parseArguments(values: readonly string[]): Arguments {
  let tablesDirectory: string | undefined;
  let outputDirectory = resolve('src/next/data/equipment/generated');
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    const value = values[index + 1];
    if (
      (key !== '--tables' && key !== '--output') ||
      value === undefined ||
      value.startsWith('--')
    ) {
      throw new Error(
        'usage: node generate_formal_gear_definitions.ts --tables <directory> [--output <directory>]',
      );
    }
    if (key === '--tables') tablesDirectory = resolve(value);
    else outputDirectory = resolve(value);
    index += 1;
  }
  if (tablesDirectory === undefined || !isAbsolute(tablesDirectory)) {
    throw new Error('--tables must resolve to an absolute directory');
  }
  return { tablesDirectory, outputDirectory };
}

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, 'utf8')) as unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
