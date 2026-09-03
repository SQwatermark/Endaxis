import { selectNativeAbilityEntityTemplateFields } from '../src/source/abilityEntity.ts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import { GameplayTagRegistry } from '../src/source/nativeGameplayTags.ts';
import { readGameplayTagPaths } from './readGameplayTagPaths.ts';
import { writeAtomicBytes } from './downloadVfsSources.ts';

/** 来源目录留给转换器；运行时仅加载可读标签与具名寿命，不再导入原生模板。 */
export async function generateAbilityEntityTemplateCatalog(
  input: string,
  catalog: string,
  output: string,
  check = false,
) {
  const evidence = readAbilityEntitySources(input);
  const registry = new GameplayTagRegistry(readGameplayTagPaths(catalog));
  const templates = compileAbilityEntityTemplateCatalogSource(
    Object.fromEntries(
      Object.entries(evidence.templates).map(([id, value]) => [
        id,
        selectNativeAbilityEntityTemplateFields(value),
      ]),
    ),
  ).templates.map(template => {
    if (template.lifeTypeNativeValue !== 0 && template.lifeTypeNativeValue !== 1)
      throw new Error(`${template.gameId}: 未知寿命类型`);
    return {
      id: template.gameId,
      bornTags: template.bornTagIds.map(id => registry.resolve(id, template.gameId)),
      lifetime:
        template.lifeTypeNativeValue === 0
          ? { kind: 'limited', durationSeconds: template.durationSeconds }
          : { kind: 'infinite' },
      maxStackingCount: template.maxStackingCount,
    };
  });
  const content =
    JSON.stringify({ templates, unresolvedReferences: evidence.unresolvedReferences }, null, 2) +
    '\n';
  if (check) {
    if (fs.readFileSync(output, 'utf8').replaceAll('\r\n', '\n') !== content)
      throw new Error('能力实体路径目录已过期');
  } else await writeAtomicBytes(output, new TextEncoder().encode(content));
}

function readAbilityEntitySources(input: string): {
  readonly templates: Record<string, Record<string, unknown>>;
  readonly unresolvedReferences: Record<string, unknown>;
} {
  if (!fs.statSync(input).isDirectory()) {
    const evidence = JSON.parse(fs.readFileSync(input, 'utf8'));
    if (
      evidence.format !== 'EndaxisLogicalAbilityEntityTemplateEvidence' ||
      evidence.spatialModel !== 'zero-distance-all-instances-single-enemy'
    )
      throw new Error('不支持的能力实体来源目录');
    if (evidence.lifeTypeNativeValues.limited !== 0 || evidence.lifeTypeNativeValues.infinite !== 1)
      throw new Error('能力实体寿命枚举与已核实来源不一致');
    return evidence;
  }
  const templates: Record<string, Record<string, unknown>> = {};
  for (const name of fs
    .readdirSync(input)
    .filter(name => name.endsWith('.json'))
    .sort()) {
    const file = path.resolve(input, name);
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw))
      throw new Error(`${file}: expected AbilityEntityData object`);
    if (typeof raw.gameId !== 'string' || raw.gameId.length === 0)
      throw new Error(`${file}.gameId: expected non-empty string`);
    if (templates[raw.gameId] !== undefined)
      throw new Error(`${input}: duplicate AbilityEntityData ${JSON.stringify(raw.gameId)}`);
    templates[raw.gameId] = raw;
  }
  return { templates, unresolvedReferences: {} };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2),
    check = args.at(-1) === '--check';
  if (check) args.pop();
  if (args.length !== 3)
    throw new Error('expected <source JSON> <tag-path-catalog TS> <output JSON> [--check]');
  await generateAbilityEntityTemplateCatalog(args[0]!, args[1]!, args[2]!, check);
}
