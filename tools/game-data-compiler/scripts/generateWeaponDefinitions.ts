import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  attachWeaponProductIdentities,
  compileWeaponRuntimeDefinitionBatchSource,
  compileWeaponStaticDefinitionBatchSource,
  renderWeaponDefinitionFiles,
  writeWeaponDefinitionFiles,
  type CompiledWeaponStaticDefinitionBatchSource,
  type RenderedWeaponDefinitionFileSource,
} from '../src/index.ts';
import type { BuildDefinitionDiagnosticSource } from '../src/compiler/formalBuildDefinition.ts';

interface Arguments {
  readonly tables: string;
  readonly skillData: string;
  readonly buffData: string;
  readonly output: string;
  readonly auditOutput?: string;
  readonly check: boolean;
}

/** 从同一版本 TableCfg、SkillData 与 BuffData 原子生成全部正式武器定义。 */
export async function generateWeaponDefinitions(args: Arguments): Promise<{
  readonly definitionCount: number;
  readonly fileCount: number;
}> {
  const weaponTable = readJson(path.join(args.tables, 'WeaponBasicTable.json'));
  const upgradeTable = readJson(path.join(args.tables, 'WeaponUpgradeTemplateTable.json'));
  const patchTable = readJson(path.join(args.tables, 'SkillPatchTable.json'));
  const itemTable = readJson(path.join(args.tables, 'ItemTable.json'));
  const skillData = readDefinitionDirectory(args.skillData, 'skillId');
  const buffData = readDefinitionDirectory(args.buffData, 'id');
  const staticBatch = compileWeaponStaticDefinitionsIndependently(
    weaponTable,
    upgradeTable,
    skillData,
    patchTable,
  );
  const identified = attachWeaponProductIdentities(staticBatch.definitions, itemTable);
  const runtimeBatch = compileWeaponRuntimeDefinitionBatchSource(
    identified,
    staticBatch.runtimeDependencies,
    buffData,
  );
  const batch = {
    definitions: runtimeBatch.definitions,
    diagnostics: [...staticBatch.diagnostics, ...runtimeBatch.diagnostics],
  };
  assertNoBlockedDiagnostics(batch.diagnostics);
  const files = renderWeaponDefinitionFiles(batch);
  const definitions = files.filter(file => !file.relativePath.endsWith('.audit.json'));
  if (args.check) checkGeneratedFiles(args.output, definitions);
  else {
    await writeWeaponDefinitionFiles(args.output, definitions);
    await writeWeaponDefinitionFiles(
      args.auditOutput ?? path.resolve('tmp/generated-next-weapons'),
      files.filter(file => file.relativePath.endsWith('.audit.json')),
    );
  }
  return { definitionCount: batch.definitions.length, fileCount: definitions.length };
}

/**
 * 正式生成也必须逐把收集来源失败，不能因排序靠前的一把武器遮蔽其余诊断。
 * 只要任一项阻断，调用方最终不会写盘，因此这里的成功候选仍保持整批原子性。
 */
export function compileWeaponStaticDefinitionsIndependently(
  weaponTable: unknown,
  upgradeTable: unknown,
  skillData: unknown,
  patchTable: unknown,
): CompiledWeaponStaticDefinitionBatchSource {
  const weaponIds = Object.keys(requireRecord(weaponTable, 'WeaponBasicTable')).sort(
    (left, right) => left.localeCompare(right),
  );
  const definitions: CompiledWeaponStaticDefinitionBatchSource['definitions'][number][] = [];
  const runtimeDependencies: CompiledWeaponStaticDefinitionBatchSource['runtimeDependencies'][number][] =
    [];
  const diagnostics: BuildDefinitionDiagnosticSource[] = [];
  for (const weaponId of weaponIds) {
    try {
      const result = compileWeaponStaticDefinitionBatchSource(
        weaponTable,
        upgradeTable,
        skillData,
        patchTable,
        [weaponId],
      );
      definitions.push(...result.definitions);
      runtimeDependencies.push(...result.runtimeDependencies);
      diagnostics.push(...result.diagnostics);
    } catch (error) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `WeaponBasicTable.${weaponId}`,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return { definitions, runtimeDependencies, diagnostics };
}

function assertNoBlockedDiagnostics(diagnostics: readonly BuildDefinitionDiagnosticSource[]): void {
  const blocked = diagnostics.filter(item => item.status === 'blocked');
  if (blocked.length === 0) return;
  throw new Error(
    `weapon generation blocked by ${blocked.length} diagnostic(s):\n${blocked
      .map(item => `- ${item.sourcePath}: ${item.reason}`)
      .join('\n')}`,
  );
}

export function parseArguments(values: readonly string[]): Arguments {
  const paths = new Map<string, string>();
  let check = false;
  for (let index = 0; index < values.length;) {
    const name = values[index]!;
    if (name === '--check') {
      check = true;
      index += 1;
      continue;
    }
    const value = values[index + 1];
    if (!name.startsWith('--') || value === undefined) {
      throw new Error('expected --name <path> arguments and optional --check');
    }
    paths.set(name, value);
    index += 2;
  }
  return {
    tables: requiredPath(paths, '--tables'),
    skillData: requiredPath(paths, '--skill-data'),
    buffData: requiredPath(paths, '--buff-data'),
    output: path.resolve(paths.get('--output') ?? 'src/next/data/equipment/generated-weapons'),
    auditOutput: path.resolve(paths.get('--audit-output') ?? 'tmp/generated-next-weapons'),
    check,
  };
}

function readDefinitionDirectory(
  directory: string,
  identityField: 'skillId' | 'id',
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const name of fs
    .readdirSync(directory)
    .filter(name => name.endsWith('.json'))
    .sort()) {
    if (!/^[A-Za-z0-9._-]+\.json$/.test(name)) {
      throw new Error(`${directory}: unsafe definition filename ${JSON.stringify(name)}`);
    }
    const value = readJson(path.join(directory, name));
    const row = requireRecord(value, name);
    const identity = row[identityField];
    if (typeof identity !== 'string' || identity.length === 0) {
      throw new Error(`${name}.${identityField}: expected non-empty string`);
    }
    if (identity in result) {
      throw new Error(`${name}.${identityField}: duplicate identity ${JSON.stringify(identity)}`);
    }
    result[identity] = value;
  }
  return result;
}

function checkGeneratedFiles(
  outputDirectory: string,
  files: readonly RenderedWeaponDefinitionFileSource[],
): void {
  const expected = new Map(
    files.map(file => [file.relativePath.replaceAll('\\', '/'), file.content]),
  );
  const actualPaths = listFiles(outputDirectory).map(file =>
    path.relative(outputDirectory, file).replaceAll('\\', '/'),
  );
  const expectedPaths = [...expected.keys()].sort();
  if (JSON.stringify(actualPaths) !== JSON.stringify(expectedPaths)) {
    throw new Error('generated weapon file set is stale');
  }
  for (const relativePath of expectedPaths) {
    const actual = fs.readFileSync(path.join(outputDirectory, relativePath), 'utf8');
    if (actual !== expected.get(relativePath)) {
      throw new Error(`generated weapon file is stale: ${relativePath}`);
    }
  }
}

function listFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const child = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(child) : [child];
    })
    .sort((left, right) => left.localeCompare(right));
}

function requiredPath(values: ReadonlyMap<string, string>, name: string): string {
  const value = values.get(name);
  if (!value) throw new Error(`missing ${name}`);
  return path.resolve(value);
}

function readJson(filePath: string): unknown {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function requireRecord(value: unknown, sourcePath: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${sourcePath}: expected object`);
  }
  return value as Record<string, unknown>;
}

async function run(): Promise<void> {
  const result = await generateWeaponDefinitions(parseArguments(process.argv.slice(2)));
  process.stdout.write(
    `weapon definitions: ${result.definitionCount}; generated files: ${result.fileCount}\n`,
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
