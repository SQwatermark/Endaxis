import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  compileOperatorRuntimeDefinitionSource,
  renderOperatorRuntimeDefinitionSource,
} from '../src/domains/operator/runtimeDefinition.ts';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';

interface Arguments {
  readonly template: string;
  readonly comboSkill: string;
  readonly slug: string;
  readonly skillGroup: string;
  /** 仅当前角色拥有的生成子目录；不会替换整个干员库。 */
  readonly output: string;
  readonly auditOutput: string;
  readonly check: boolean;
}

export async function generateOperatorRuntimeDefinition(args: Arguments) {
  const template = fs.readFileSync(args.template, 'utf8');
  const comboSkill = fs.readFileSync(args.comboSkill, 'utf8');
  const result = compileOperatorRuntimeDefinitionSource(
    JSON.parse(template),
    JSON.parse(comboSkill),
    { operatorSlug: args.slug, skillGroupKey: args.skillGroup },
  );
  const file = renderOperatorRuntimeDefinitionSource(result.definition);
  const destination = path.resolve(args.output, file.relativePath);
  const relativeOutput = path.relative(path.resolve(args.auditOutput), path.resolve(args.output));
  const relativeReverse = path.relative(path.resolve(args.output), path.resolve(args.auditOutput));
  const outside = (relative: string) =>
    relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative);
  if (!outside(relativeOutput) || !outside(relativeReverse))
    throw new Error('formal and audit output directories must not overlap');
  // writer 替换整个目录，因此只允许接管单个角色的专属目录，拒绝混入手工文件。
  const requireOwnedDirectory = (directory: string, name: string, generatedHeader?: string) => {
    if (path.basename(path.resolve(directory)) !== args.slug)
      throw new Error(`output directory must belong to '${args.slug}'`);
    if (!fs.existsSync(directory)) return;
    const names = fs.readdirSync(directory);
    if (names.some(entry => entry !== name))
      throw new Error(`refusing to replace unrelated files in ${directory}`);
    if (
      generatedHeader &&
      names.length &&
      !fs.readFileSync(path.join(directory, name), 'utf8').startsWith(generatedHeader)
    )
      throw new Error(`refusing to overwrite a non-generated file in ${directory}`);
  };
  requireOwnedDirectory(
    args.output,
    file.relativePath,
    '/** 由 tools/game-data-compiler 生成的角色常驻运行定义',
  );
  const tmpRoot = fileURLToPath(new URL('../../../tmp/', import.meta.url));
  const relativeAudit = path.relative(tmpRoot, path.resolve(args.auditOutput));
  if (
    !relativeAudit ||
    relativeAudit === '..' ||
    relativeAudit.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeAudit)
  )
    throw new Error('operator runtime audit output must be inside Endaxis/tmp');
  requireOwnedDirectory(args.auditOutput, `${args.slug}.runtime.audit.json`);
  if (args.check) {
    if (
      !fs.existsSync(destination) ||
      fs.readFileSync(destination, 'utf8').replaceAll('\r\n', '\n') !== file.content
    )
      throw new Error(`operator runtime definition is stale: ${destination}`);
  } else {
    await writeGeneratedDefinitionFiles(args.auditOutput, [
      {
        relativePath: `${args.slug}.runtime.audit.json`,
        content:
          JSON.stringify(
            {
              ...result.audit,
              inputs: [args.template, args.comboSkill].map((file, index) => ({
                file: path.resolve(file),
                sha256: createHash('sha256')
                  .update(index === 0 ? template : comboSkill)
                  .digest('hex'),
              })),
            },
            null,
            2,
          ) + '\n',
      },
    ]);
    await writeGeneratedDefinitionFiles(args.output, [file]);
  }
  return { output: destination, conditions: result.definition.comboSkillConditions.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const values = new Map<string, string>();
  let check = false;
  for (let index = 2; index < process.argv.length; index++) {
    const flag = process.argv[index]!;
    if (flag === '--check') {
      check = true;
      continue;
    }
    if (
      ![
        '--template',
        '--combo-skill',
        '--slug',
        '--skill-group',
        '--output',
        '--audit-output',
      ].includes(flag)
    )
      throw new Error(`unknown argument ${flag}`);
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
    await generateOperatorRuntimeDefinition({
      template: required('--template'),
      comboSkill: required('--combo-skill'),
      slug: required('--slug'),
      skillGroup: required('--skill-group'),
      output: required('--output'),
      auditOutput: required('--audit-output'),
      check,
    }),
  );
}
