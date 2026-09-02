import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDeepStrictEqual } from 'node:util';
import { format, resolveConfig } from 'prettier';
import {
  writeGeneratedDefinitionFiles,
  checkGeneratedDefinitionFiles,
} from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { renderCommonBuffDefinitionsSource } from '../src/domains/operator/definitionSourceRenderer.ts';
import { requireArray, requireNonEmptyString, requireRecord } from '../src/source/primitives.ts';
import { planOperatorDefinition } from './planOperatorDefinition.ts';

interface Arguments {
  readonly manifest: string;
  readonly sourceRoot: string;
  readonly tableRoot: string;
  readonly skillPatchTable: string;
  readonly buffDataRoot: string;
  readonly abilityEntityCatalog: string;
  readonly projectileBlackboardCatalog: string;
  readonly gameplayTagCatalog: string;
  readonly timeDilationCatalog: string;
  readonly globalBuffCatalog: string;
  readonly skillSettingCatalog: string;
  readonly output: string;
  readonly check: boolean;
}

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const presentationNamesPath = path.resolve(
  scriptDirectory,
  '../config/commonBuffPresentationNames.json',
);

/**
 * 从所有正式干员的原始闭包收集公共 Buff，并生成一份全局只读目录。
 * 干员只负责暴露“使用了哪些公共 ID”；重复 ID 必须得到完全一致的定义，不能靠导入顺序覆盖。
 */
export async function generateCommonBuffDefinitions(args: Arguments) {
  const manifest = requireRecord(read(args.manifest), args.manifest);
  const slugs = requireArray(manifest.operators, `${args.manifest}.operators`).map((value, index) =>
    requireNonEmptyString(
      requireRecord(value, `${args.manifest}.operators[${index}]`).slug,
      `${args.manifest}.operators[${index}].slug`,
    ),
  );
  if (new Set(slugs).size !== slugs.length)
    throw new Error('operator manifest has duplicate slugs');

  const batches: { slug: string; definitions: Readonly<Record<string, unknown>> }[] = [];
  for (const slug of slugs) {
    const plan = planOperatorDefinition({
      ...args,
      slug,
      output: path.join('tmp', 'game-data-generated', 'operator-definitions', slug),
      auditOutput: path.join('tmp', 'game-data-audit', 'operator-definitions', slug),
    });
    batches.push({ slug, definitions: plan.commonBuffDefinitions });
  }
  const definitions = mergeCommonBuffDefinitions(batches);
  const presentationNameKeys = readPresentationNameKeys(presentationNamesPath);

  const prettierConfig = (await resolveConfig(path.resolve('.prettierrc.json'))) ?? {};
  const content = await format(renderCommonBuffDefinitionsSource(definitions), {
    ...prettierConfig,
    parser: 'typescript',
  });
  const presentationNamesContent = await format(
    renderCommonBuffPresentationNamesSource(presentationNameKeys),
    { ...prettierConfig, parser: 'typescript' },
  );
  const files = [
    { relativePath: 'commonBuffDefinitions.generated.ts', content },
    {
      relativePath: 'commonBuffPresentationNames.generated.ts',
      content: presentationNamesContent,
    },
  ];
  if (args.check) checkGeneratedDefinitionFiles(args.output, files);
  else await writeGeneratedDefinitionFiles(args.output, files);
  return { operatorCount: slugs.length, buffCount: Object.keys(definitions).length };
}

export function readPresentationNameKeys(sourcePath: string): Record<string, string> {
  const source = requireRecord(read(sourcePath), sourcePath);
  const result: Record<string, string> = {};
  for (const [buffId, value] of Object.entries(source)) {
    result[requireNonEmptyString(buffId, `${sourcePath}.<key>`)] = requireNonEmptyString(
      value,
      `${sourcePath}.${buffId}`,
    );
  }
  return result;
}

export function renderCommonBuffPresentationNamesSource(
  presentationNameKeys: Readonly<Record<string, string>>,
): string {
  return (
    `/** 由 tools/game-data-compiler 公共 Buff 生成器生成；不要手工编辑。 */\n` +
    `export const commonBuffPresentationNameKeys = Object.freeze(${JSON.stringify(presentationNameKeys, null, 2)} as const);\n`
  );
}

/** 合并公共所有权闭包；相同 ID 只允许完全相同的不可变定义。 */
export function mergeCommonBuffDefinitions(
  batches: readonly {
    readonly slug: string;
    readonly definitions: Readonly<Record<string, unknown>>;
  }[],
): Record<string, unknown> {
  const definitions: Record<string, unknown> = {};
  const ownerById = new Map<string, string>();
  for (const batch of batches) {
    for (const [id, definition] of Object.entries(batch.definitions)) {
      const previous = definitions[id];
      if (previous !== undefined && !isDeepStrictEqual(previous, definition)) {
        throw new Error(
          `common Buff '${id}' differs between '${ownerById.get(id)}' and '${batch.slug}'`,
        );
      }
      definitions[id] = definition;
      ownerById.set(id, ownerById.get(id) ?? batch.slug);
    }
  }
  return definitions;
}

function read(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const values = new Map<string, string>();
  let check = false;
  const allowed = new Set([
    '--manifest',
    '--source-root',
    '--table-root',
    '--skill-patch-table',
    '--buff-data-root',
    '--ability-entity-catalog',
    '--projectile-blackboard-catalog',
    '--gameplay-tag-catalog',
    '--time-dilation-catalog',
    '--global-buff-catalog',
    '--skill-setting-catalog',
    '--output',
  ]);
  for (let index = 2; index < process.argv.length; index++) {
    const flag = process.argv[index]!;
    if (flag === '--check') {
      check = true;
      continue;
    }
    if (!allowed.has(flag)) throw new Error(`unsupported argument ${flag}`);
    const value = process.argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${flag}`);
    if (values.has(flag)) throw new Error(`duplicate argument ${flag}`);
    values.set(flag, value);
  }
  const required = (flag: string) => {
    const value = values.get(flag);
    if (!value) throw new Error(`missing ${flag}`);
    return value;
  };
  console.log(
    await generateCommonBuffDefinitions({
      manifest: required('--manifest'),
      sourceRoot: required('--source-root'),
      tableRoot: required('--table-root'),
      skillPatchTable: required('--skill-patch-table'),
      buffDataRoot: required('--buff-data-root'),
      abilityEntityCatalog: required('--ability-entity-catalog'),
      projectileBlackboardCatalog: required('--projectile-blackboard-catalog'),
      gameplayTagCatalog: required('--gameplay-tag-catalog'),
      timeDilationCatalog: required('--time-dilation-catalog'),
      globalBuffCatalog: required('--global-buff-catalog'),
      skillSettingCatalog: required('--skill-setting-catalog'),
      output: required('--output'),
      check,
    }),
  );
}
