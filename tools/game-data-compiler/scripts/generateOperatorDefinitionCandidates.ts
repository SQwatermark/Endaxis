import fs from 'node:fs';
import {
  checkGeneratedDefinitionFiles,
  writeGeneratedDefinitionFiles,
  type RenderedDefinitionFileSource,
} from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { requireArray, requireNonEmptyString, requireRecord } from '../src/source/primitives.ts';
import { planOperatorDefinition, renderOperatorDefinition } from './planOperatorDefinition.ts';

type PlanArguments = Parameters<typeof planOperatorDefinition>[0];

export interface OperatorDefinitionCandidateArguments extends Omit<
  PlanArguments,
  'slug' | 'output' | 'auditOutput'
> {
  readonly outputRoot: string;
  readonly auditRoot: string;
  readonly check: boolean;
}

/**
 * 从同一 manifest 和同一组来源渲染全部干员。全部渲染成功后才原子替换整批候选与审计目录，
 * 因此任一干员失败都不会留下可被误认作完整快照的部分结果。
 */
export async function generateOperatorDefinitionCandidates(
  args: OperatorDefinitionCandidateArguments,
) {
  const manifest = requireRecord(JSON.parse(fs.readFileSync(args.manifest, 'utf8')), args.manifest);
  const rows = requireArray(manifest.operators, `${args.manifest}.operators`);
  const slugs = rows.map((value, index) =>
    requireNonEmptyString(
      requireRecord(value, `${args.manifest}.operators[${index}]`).slug,
      `${args.manifest}.operators[${index}].slug`,
    ),
  );
  if (new Set(slugs).size !== slugs.length)
    throw new Error('operator manifest contains duplicate slugs');

  const files: RenderedDefinitionFileSource[] = [];
  const auditFiles: RenderedDefinitionFileSource[] = [];
  const summaries = [];
  for (const slug of slugs) {
    const rendered = await renderOperatorDefinition({
      ...args,
      slug,
      // 单技能规划仍用这两个路径生成稳定相对文件名；候选写入由本函数在整批成功后完成。
      output: `${args.outputRoot}/${slug}`,
      auditOutput: `${args.auditRoot}/${slug}`,
    });
    files.push({
      relativePath: `${slug}/${rendered.file.relativePath}`,
      content: rendered.file.content,
    });
    auditFiles.push({
      relativePath: `${slug}/${rendered.auditFile.relativePath}`,
      content: rendered.auditFile.content,
    });
    summaries.push({
      slug,
      skillCount: rendered.plan.activeSkills.length,
      talentCount: rendered.plan.operator.talents.length,
      potentialCount: rendered.plan.operator.potentials.length,
      entityCount: Object.keys(rendered.plan.operator.abilityEntityDefinitions!).length,
      privateBuffCount: Object.keys(rendered.plan.operator.buffDefinitions!).length,
      commonBuffCount: Object.keys(rendered.plan.commonBuffDefinitions).length,
    });
  }

  if (args.check) {
    checkGeneratedDefinitionFiles(args.outputRoot, files);
    checkGeneratedDefinitionFiles(args.auditRoot, auditFiles);
  } else {
    await writeGeneratedDefinitionFiles(args.auditRoot, auditFiles);
    await writeGeneratedDefinitionFiles(args.outputRoot, files);
  }
  return {
    operatorCount: summaries.length,
    skillCount: summaries.reduce((sum, item) => sum + item.skillCount, 0),
    operators: summaries,
  };
}
