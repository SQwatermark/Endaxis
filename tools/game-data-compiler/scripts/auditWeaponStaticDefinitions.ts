import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { compileWeaponStaticDefinitionBatchSource } from '../src/index.ts';

interface Arguments {
  readonly tables: string;
  readonly skillData: string;
}

interface WeaponAuditFailure {
  readonly weaponId: string;
  readonly reasons: readonly string[];
}

/**
 * 对 WeaponBasicTable 中每把武器独立执行静态正式定义编译。
 *
 * 独立审计很重要：某一把武器出现陌生 SkillData 语义时，不能阻止报告其余武器的真实边界。
 * 本命令只读来源并输出诊断，不生成可提交的中间产物。
 */
export function auditWeaponStaticDefinitions(args: Arguments): {
  readonly total: number;
  readonly complete: number;
  readonly runtimeDependencyCount: number;
  readonly scenarioOmissions: readonly WeaponAuditFailure[];
  readonly failures: readonly WeaponAuditFailure[];
} {
  const weaponTable = readJson(path.join(args.tables, 'WeaponBasicTable.json'));
  const upgradeTable = readJson(path.join(args.tables, 'WeaponUpgradeTemplateTable.json'));
  const skillPatchTable = readJson(path.join(args.tables, 'SkillPatchTable.json'));
  const skillData = readSkillDataDirectory(args.skillData);
  const weaponIds = Object.keys(requireRecord(weaponTable, 'WeaponBasicTable')).sort(
    (left, right) => left.localeCompare(right),
  );
  const failures: WeaponAuditFailure[] = [];
  const scenarioOmissions: WeaponAuditFailure[] = [];
  let complete = 0;
  let runtimeDependencyCount = 0;

  for (const weaponId of weaponIds) {
    try {
      const result = compileWeaponStaticDefinitionBatchSource(
        weaponTable,
        upgradeTable,
        skillData,
        skillPatchTable,
        [weaponId],
      );
      runtimeDependencyCount += result.runtimeDependencies.length;
      const blockedReasons = result.diagnostics
        .filter(diagnostic => diagnostic.status === 'blocked')
        .map(diagnostic => `${diagnostic.status}: ${diagnostic.sourcePath}: ${diagnostic.reason}`);
      const omittedReasons = result.diagnostics
        .filter(diagnostic => diagnostic.status === 'scenario-omitted')
        .map(diagnostic => `${diagnostic.status}: ${diagnostic.sourcePath}: ${diagnostic.reason}`);
      if (omittedReasons.length > 0) {
        scenarioOmissions.push({ weaponId, reasons: omittedReasons });
      }
      if (result.definitions.length === 1 && blockedReasons.length === 0) complete += 1;
      else {
        if (result.definitions.length !== 1) {
          blockedReasons.unshift(
            `blocked: expected one static definition, found ${result.definitions.length}`,
          );
        }
        failures.push({ weaponId, reasons: blockedReasons });
      }
    } catch (error) {
      failures.push({ weaponId, reasons: [formatError(error)] });
    }
  }

  return { total: weaponIds.length, complete, runtimeDependencyCount, scenarioOmissions, failures };
}

export function parseArguments(values: readonly string[]): Arguments {
  const result = new Map<string, string>();
  for (let index = 0; index < values.length; index += 2) {
    const name = values[index];
    const value = values[index + 1];
    if (!name?.startsWith('--') || value === undefined) {
      throw new Error('expected paired --name <path> arguments');
    }
    result.set(name, value);
  }
  return {
    tables: requiredPath(result, '--tables'),
    skillData: requiredPath(result, '--skill-data'),
  };
}

function readSkillDataDirectory(directory: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const name of fs
    .readdirSync(directory)
    .filter(name => name.endsWith('.json'))
    .sort()) {
    if (!/^[A-Za-z0-9._-]+\.json$/.test(name)) {
      throw new Error(`${directory}: unsafe SkillData filename ${JSON.stringify(name)}`);
    }
    const value = readJson(path.join(directory, name));
    const row = requireRecord(value, name);
    if (typeof row.skillId !== 'string' || row.skillId.length === 0) {
      throw new Error(`${name}.skillId: expected non-empty string`);
    }
    if (row.skillId in result) {
      throw new Error(
        `${name}.skillId: duplicate SkillData identity ${JSON.stringify(row.skillId)}`,
      );
    }
    result[row.skillId] = value;
  }
  return result;
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

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function run(): void {
  const report = auditWeaponStaticDefinitions(parseArguments(process.argv.slice(2)));
  process.stdout.write(
    `weapon static definitions: ${report.complete}/${report.total}; runtime dependencies: ${report.runtimeDependencyCount}; scenario omissions: ${report.scenarioOmissions.length}\n`,
  );
  for (const omission of report.scenarioOmissions) {
    process.stdout.write(`~ ${omission.weaponId}\n`);
    for (const reason of omission.reasons) process.stdout.write(`  - ${reason}\n`);
  }
  for (const failure of report.failures) {
    process.stdout.write(`- ${failure.weaponId}\n`);
    for (const reason of failure.reasons) process.stdout.write(`  - ${reason}\n`);
  }
  if (report.failures.length > 0) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  run();
}
