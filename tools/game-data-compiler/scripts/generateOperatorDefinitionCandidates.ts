import fs from 'node:fs';
import path from 'node:path';
import {
  checkGeneratedDefinitionFiles,
  writeGeneratedDefinitionFiles,
  type RenderedDefinitionFileSource,
} from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { requireArray, requireNonEmptyString, requireRecord } from '../src/source/primitives.ts';
import { planOperatorDefinition, renderOperatorDefinition } from './planOperatorDefinition.ts';
import {
  createCommonBuffCollector,
  renderCollectedCommonBuffDefinitions,
} from './generateCommonBuffDefinitions.ts';

type PlanArguments = Parameters<typeof planOperatorDefinition>[0];

export interface OperatorDefinitionCandidateArguments extends Omit<
  PlanArguments,
  'slug' | 'output' | 'auditOutput'
> {
  readonly outputRoot: string;
  readonly auditRoot: string;
  /** 同轮生成公共 Buff 时提供独立输出目录，避免再规划全部干员。 */
  readonly commonBuffOutput?: string;
  readonly check: boolean;
}

/**
 * 从同一 manifest 和同一组来源渲染全部干员，可顺带生成公共 Buff。
 * 全部规划、冲突检查与渲染成功后才逐目录写入；各目录独立替换，写入失败须阻止发布。
 */
export async function generateOperatorDefinitionCandidates(
  args: OperatorDefinitionCandidateArguments,
) {
  if (
    path.resolve(args.outputRoot) ===
    path.resolve(import.meta.dirname, '../../../src/data/operators')
  )
    throw new Error(
      'operator candidates require an isolated directory; publish generated files individually',
    );
  const outputDirectories = [args.outputRoot, args.auditRoot];
  if (args.commonBuffOutput !== undefined) outputDirectories.push(args.commonBuffOutput);
  for (const [index, directory] of outputDirectories.entries()) {
    for (const other of outputDirectories.slice(index + 1)) {
      if (containsDirectory(directory, other) || containsDirectory(other, directory))
        throw new Error('operator, audit and common Buff output directories must not overlap');
    }
  }
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
  const commonBuffs = args.commonBuffOutput === undefined ? undefined : createCommonBuffCollector();
  for (const slug of slugs) {
    const rendered = await renderOperatorDefinition({
      ...args,
      slug,
      // 单技能规划仍用这两个路径生成稳定相对文件名；候选写入由本函数在整批成功后完成。
      output: args.outputRoot,
      auditOutput: `${args.auditRoot}/${slug}`,
    });
    commonBuffs?.add(slug, rendered.plan.commonBuffDefinitions);
    files.push({
      relativePath: rendered.file.relativePath,
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

  // 不保留整批计划对象。收集器只留下去重后的公共定义，每次生成或检查都重新创建。
  const renderedCommonBuffs = commonBuffs
    ? await renderCollectedCommonBuffDefinitions(args, commonBuffs)
    : undefined;
  if (args.check) {
    checkGeneratedDefinitionFiles(args.outputRoot, files);
    checkGeneratedDefinitionFiles(args.auditRoot, auditFiles);
    if (renderedCommonBuffs && args.commonBuffOutput !== undefined)
      checkGeneratedDefinitionFiles(args.commonBuffOutput, renderedCommonBuffs.files);
  } else {
    await writeGeneratedDefinitionFiles(args.auditRoot, auditFiles);
    await writeGeneratedDefinitionFiles(args.outputRoot, files);
    if (renderedCommonBuffs && args.commonBuffOutput !== undefined)
      await writeGeneratedDefinitionFiles(args.commonBuffOutput, renderedCommonBuffs.files);
  }
  return {
    operatorCount: summaries.length,
    skillCount: summaries.reduce((sum, item) => sum + item.skillCount, 0),
    operators: summaries,
    ...(renderedCommonBuffs
      ? {
          commonBuffs: {
            buffCount: renderedCommonBuffs.buffCount,
            optimization: renderedCommonBuffs.optimization,
          },
        }
      : {}),
  };
}

function containsDirectory(parent: string, child: string): boolean {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return (
    relative === '' ||
    (relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
}
