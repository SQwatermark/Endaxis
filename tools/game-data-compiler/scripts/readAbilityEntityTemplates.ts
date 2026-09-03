import fs from 'node:fs';
import path from 'node:path';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import { selectNativeAbilityEntityTemplateFields } from '../src/source/abilityEntity.ts';
import { requireRecord } from '../src/source/primitives.ts';

/**
 * 当前来源直接读取 AbilityEntityData；旧证据文件仅在调用方显式指定时读取。
 * 不从正式目录补缺，不写聚合中间产物，两种容器最终进入同一个严格模板解析器。
 */
export function readAbilityEntityTemplates(input: string) {
  const stat = fs.lstatSync(input);
  if (stat.isSymbolicLink()) throw new Error(`ability entity source is a link: ${input}`);
  if (stat.isDirectory()) {
    const records: Record<string, unknown> = {};
    for (const entry of fs.readdirSync(input, { withFileTypes: true })) {
      if (!entry.isFile() || !/^[A-Za-z0-9_-]+\.json$/.test(entry.name))
        throw new Error(`unexpected ability entity source entry: ${entry.name}`);
      records[entry.name.slice(0, -5)] = JSON.parse(
        fs.readFileSync(path.join(input, entry.name), 'utf8'),
      );
    }
    return compileAbilityEntityTemplateCatalogSource(records, input);
  }
  const evidence = requireRecord(JSON.parse(fs.readFileSync(input, 'utf8')), input);
  const lifeTypes = requireRecord(evidence.lifeTypeNativeValues, `${input}.lifeTypeNativeValues`);
  if (
    evidence.format !== 'EndaxisLogicalAbilityEntityTemplateEvidence' ||
    evidence.spatialModel !== 'zero-distance-all-instances-single-enemy' ||
    lifeTypes.limited !== 0 ||
    lifeTypes.infinite !== 1
  )
    throw new Error(`${input}: unsupported ability entity evidence container`);
  const templates = requireRecord(evidence.templates, `${input}.templates`);
  return compileAbilityEntityTemplateCatalogSource(
    Object.fromEntries(
      Object.entries(templates).map(([id, raw]) => [
        id,
        selectNativeAbilityEntityTemplateFields(raw),
      ]),
    ),
    input,
  );
}
