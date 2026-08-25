import { readFile, readdir } from 'node:fs/promises';
import { basename, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { format, resolveConfig } from 'prettier';

import {
  compileEquipmentSuitRuntimeBatchSource,
  compileEquipmentSuitStaticDefinitionBatchSource,
  renderEquipmentSuitDefinitionFiles,
  writeEquipmentDefinitionFiles,
} from '../../tools/game-data-compiler/src/index.ts';

interface Arguments {
  readonly tablesDirectory: string;
  readonly skillDataDirectory: string;
  readonly buffDataDirectory: string;
  readonly outputDirectory: string;
}

const input = parseArguments(process.argv.slice(2));
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const identities = requireIdentityList(
  JSON.parse(await readFile(resolve(scriptDirectory, 'formal_suit_identities.json'), 'utf8')),
);
const table = async (name: string) =>
  JSON.parse(await readFile(resolve(input.tablesDirectory, `${name}.json`), 'utf8')) as unknown;
const skillData = await readJsonDirectory(input.skillDataDirectory);
const buffData = await readJsonDirectory(input.buffDataDirectory);
const staticBatch = compileEquipmentSuitStaticDefinitionBatchSource(
  await table('EquipSuitTable'),
  skillData,
  await table('SkillPatchTable'),
);
const definitionsById = new Map(
  staticBatch.definitions.map(definition => [definition.slug, definition]),
);
const definitions = [];
const diagnostics = [...staticBatch.diagnostics];
for (const identity of identities) {
  const definition = definitionsById.get(identity);
  if (definition === undefined) {
    throw new Error(
      `formal suit identity ${JSON.stringify(identity)} is missing from EquipSuitTable`,
    );
  }
  const runtime = compileEquipmentSuitRuntimeBatchSource(
    [definition],
    staticBatch.runtimeDependencies.filter(dependency => dependency.suitId === identity),
    buffData,
  );
  if (runtime.definitions.length !== 1) {
    const reasons = runtime.diagnostics
      .filter(diagnostic => diagnostic.status === 'blocked')
      .map(diagnostic => `${diagnostic.sourcePath}: ${diagnostic.reason}`)
      .join('; ');
    throw new Error(`formal suit ${JSON.stringify(identity)} is not runtime-closed: ${reasons}`);
  }
  definitions.push(runtime.definitions[0]!);
  diagnostics.push(...runtime.diagnostics);
}
const prettierConfig = (await resolveConfig(resolve('.prettierrc.json'))) ?? {};
const files = await Promise.all(
  renderEquipmentSuitDefinitionFiles({ definitions, diagnostics }).map(async file => ({
    ...file,
    content: file.relativePath.endsWith('.ts')
      ? await format(file.content, { ...prettierConfig, parser: 'typescript' })
      : file.content,
  })),
);
await writeEquipmentDefinitionFiles(input.outputDirectory, files);
console.log(
  JSON.stringify({
    outputDirectory: input.outputDirectory,
    definitionCount: definitions.length,
    buffDefinitionCount: definitions.reduce(
      (count, definition) => count + Object.keys(definition.buffDefinitions ?? {}).length,
      0,
    ),
    scenarioOmittedDiagnosticCount: diagnostics.filter(
      diagnostic => diagnostic.status === 'scenario-omitted',
    ).length,
  }),
);

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

function requireIdentityList(value: unknown): readonly string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some(identity => typeof identity !== 'string' || identity.length === 0)
  ) {
    throw new Error('formal_suit_identities.json: expected a non-empty string array');
  }
  const identities = [...value].sort((left, right) => left.localeCompare(right));
  if (new Set(identities).size !== identities.length) {
    throw new Error('formal_suit_identities.json: duplicate identity');
  }
  return identities;
}

function parseArguments(values: readonly string[]): Arguments {
  const entries: Record<string, string> = {};
  for (let index = 0; index < values.length; index += 2) {
    const key = values[index];
    const value = values[index + 1];
    if (key === undefined || !key.startsWith('--') || value === undefined) {
      throw new Error('expected --key value arguments');
    }
    entries[key] = value;
  }
  for (const required of ['--tables', '--skills', '--buffs']) {
    if (entries[required] === undefined) throw new Error(`missing ${required}`);
  }
  const outputDirectory = resolve(
    entries['--output'] ?? 'src/next/data/equipment/generated-gear-sets',
  );
  const result = {
    tablesDirectory: resolve(entries['--tables']!),
    skillDataDirectory: resolve(entries['--skills']!),
    buffDataDirectory: resolve(entries['--buffs']!),
    outputDirectory,
  };
  for (const [name, path] of Object.entries(result)) {
    if (!isAbsolute(path)) throw new Error(`${name} must resolve to an absolute path`);
  }
  return result;
}
