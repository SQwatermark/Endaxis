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
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import { GameplayTagRegistry } from '../src/source/nativeGameplayTags.ts';
import { readGameplayTagPaths } from './generateOperatorActiveSkillRuntime.ts';
import type { OperatorBuffDefinitions } from '../../../packages/game-data-contract/src/buffs.ts';
import type { DefinitionOptimizationMode } from '../src/compiler/definitionOptimization.ts';
import { optimizeCommonBuffDefinitions } from '../src/compiler/equipmentDefinitionOptimization.ts';

interface Arguments {
  readonly manifest: string;
  readonly sourceRoot: string;
  readonly tableRoot: string;
  readonly skillPatchTable: string;
  readonly buffDataRoot: string;
  readonly abilityEntityCatalog: string;
  readonly projectileBlackboardCatalog?: string;
  readonly gameplayTagCatalog: string;
  readonly timeDilationCatalog: string;
  readonly globalBuffCatalog: string;
  readonly skillSettingCatalog: string;
  readonly output: string;
  readonly check: boolean;
  /** 默认应用已验证的优化；report 仅报告候选，off 用于生成对照。 */
  readonly optimization?: DefinitionOptimizationMode;
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

  const batches: { slug: string; definitions: OperatorBuffDefinitions }[] = [];
  for (const slug of slugs) {
    const plan = planOperatorDefinition({
      ...args,
      slug,
      output: path.join('tmp', 'game-data-generated', 'operator-definitions', slug),
      auditOutput: path.join('tmp', 'game-data-audit', 'operator-definitions', slug),
    });
    batches.push({ slug, definitions: plan.commonBuffDefinitions });
  }
  // 系统附着产生的 Buff 不一定被干员技能直接引用，仍须进入同一公共定义所有权。
  // 清单仅声明根身份；动作、倍率、标签和生命周期全部走公共原始 Buff 编译器。
  const systemRoots = readSystemBuffRoots(
    path.resolve(scriptDirectory, '../config/systemBuffRoots.json'),
  );
  const systemClosure = compileStandardStumpBuffClosure(
    systemRoots,
    (id: string) => read(path.join(args.buffDataRoot, `${id}.json`)),
    read(args.globalBuffCatalog),
    read(args.skillSettingCatalog),
    undefined,
    undefined,
    new Map(systemRoots.map(id => [id, 'enemy' as const])),
    new Set(),
    new GameplayTagRegistry(readGameplayTagPaths(args.gameplayTagCatalog)),
    new Map(systemRoots.map(id => [id, 'caster' as const])),
  );
  const blocked = systemClosure.diagnostics.filter(item => item.status === 'blocked');
  if (blocked.length) throw new Error(`system Buff roots are blocked: ${JSON.stringify(blocked)}`);
  batches.push({ slug: '<system>', definitions: systemClosure.definitions });
  const optimized = optimizeCommonBuffDefinitions(
    mergeCommonBuffDefinitions(batches),
    args.optimization ?? 'apply',
  );
  const definitions = optimized.definitions;
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
  return {
    operatorCount: slugs.length,
    buffCount: Object.keys(definitions).length,
    optimization: optimized.report,
  };
}

/** 当前清单只承载玩家向唯一敌人施加的系统 Buff；新增其他宿主时必须扩展明确的场景声明。 */
export function readSystemBuffRoots(sourcePath: string): string[] {
  const roots = requireArray(read(sourcePath), sourcePath).map((value, index) => {
    const id = requireNonEmptyString(value, `${sourcePath}[${index}]`);
    if (!/^buff_common_[a-z0-9_]+$/.test(id)) throw new Error(`invalid system Buff root '${id}'`);
    return id;
  });
  if (new Set(roots).size !== roots.length) throw new Error('duplicate system Buff roots');
  return roots;
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
export function mergeCommonBuffDefinitions<T>(
  batches: readonly {
    readonly slug: string;
    readonly definitions: Readonly<Record<string, T>>;
  }[],
): Record<string, T> {
  const definitions: Record<string, T> = {};
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
      ...(values.has('--projectile-blackboard-catalog')
        ? { projectileBlackboardCatalog: required('--projectile-blackboard-catalog') }
        : {}),
      gameplayTagCatalog: required('--gameplay-tag-catalog'),
      timeDilationCatalog: required('--time-dilation-catalog'),
      globalBuffCatalog: required('--global-buff-catalog'),
      skillSettingCatalog: required('--skill-setting-catalog'),
      output: required('--output'),
      check,
    }),
  );
}
