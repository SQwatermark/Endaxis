import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { parseOperatorActiveSkillEntries } from '../src/domains/operator/activeSkills.ts';
import { requireArray, requireNonEmptyString, requireRecord } from '../src/source/primitives.ts';
import { planOperatorActiveSkillRuntime } from './generateOperatorActiveSkillRuntime.ts';

interface Arguments {
  readonly manifest: string;
  readonly sourceRoot: string;
  readonly skillPatchTable: string;
  readonly buffDataRoot: string;
  readonly abilityEntityCatalog: string;
  readonly projectileBlackboardCatalog: string;
  readonly gameplayTagCatalog: string;
  readonly timeDilationCatalog: string;
  readonly legacyGeneratedRoot: string;
  readonly formalActiveSkillRoot: string;
  readonly auditOutput: string;
}

interface SkillAuditEntry {
  readonly key: string;
  readonly skillType: string;
  readonly sourceFile: string;
  readonly status: 'compiled' | 'blocked';
  readonly skillId?: string;
  readonly sequenceCount?: number;
  readonly blocker?: string;
}

/**
 * 全量主动技能迁移矩阵。只规划、不写正式定义；单项失败不会阻断其余技能。
 * 报告用于选择下一名完整干员，不能把可解析技能数冒充完整干员数。
 */
export async function auditOperatorActiveSkillMigration(args: Arguments) {
  const manifest = requireRecord(readJson(args.manifest), args.manifest);
  const operators = requireArray(manifest.operators, `${args.manifest}.operators`);
  const entries = operators.map((rawOperator, operatorIndex) => {
    const operatorPath = `${args.manifest}.operators[${operatorIndex}]`;
    const operator = requireRecord(rawOperator, operatorPath);
    const slug = requireNonEmptyString(operator.slug, `${operatorPath}.slug`);
    const characterId = requireNonEmptyString(operator.charId, `${operatorPath}.charId`);
    const skills = parseOperatorActiveSkillEntries(operator.skills, `${operatorPath}.skills`);
    const skillEntries: SkillAuditEntry[] = skills.map(skill => {
      try {
        const plan = planOperatorActiveSkillRuntime({
          sourceRoot: args.sourceRoot,
          sourceFile: skill.sourceFile,
          skillPatchTable: args.skillPatchTable,
          buffDataRoot: args.buffDataRoot,
          supplementalBuffIds: [],
          abilityEntityCatalog: args.abilityEntityCatalog,
          projectileBlackboardCatalog: args.projectileBlackboardCatalog,
          gameplayTagCatalog: args.gameplayTagCatalog,
          timeDilationCatalog: args.timeDilationCatalog,
          slug,
          key: skill.key,
          skillType: skill.skillType,
          output: path.resolve(args.formalActiveSkillRoot, slug),
          auditOutput: path.resolve(args.auditOutput, 'planned', slug),
        });
        return {
          key: skill.key,
          skillType: skill.skillType,
          sourceFile: skill.sourceFile,
          status: 'compiled',
          skillId: plan.skillId,
          sequenceCount: plan.sequences,
        };
      } catch (error) {
        return {
          key: skill.key,
          skillType: skill.skillType,
          sourceFile: skill.sourceFile,
          status: 'blocked',
          blocker: error instanceof Error ? error.message : String(error),
        };
      }
    });
    const compiledSkillCount = skillEntries.filter(skill => skill.status === 'compiled').length;
    const formalDirectory = path.resolve(args.formalActiveSkillRoot, slug);
    const formalSkillCount = fs.existsSync(formalDirectory)
      ? fs.readdirSync(formalDirectory).filter(name => name.endsWith('.runtime.generated.ts'))
          .length
      : 0;
    return {
      slug,
      characterId,
      status: compiledSkillCount === skillEntries.length ? 'active-skills-compiled' : 'blocked',
      legacyGeneratedDefinitionPresent: fs.existsSync(
        path.resolve(args.legacyGeneratedRoot, `${slug}.operator.generated.ts`),
      ),
      declaredSkillCount: skillEntries.length,
      compiledSkillCount,
      formalSkillCount,
      // 这里只计新版完整产物是否存在；注册、对象校验和实际模拟由整名回归门禁证明。
      completeDefinitionPresent: fs.existsSync(
        path.resolve(
          'src/next/data/operators/generated-definitions',
          slug,
          `${slug}.operator.generated.ts`,
        ),
      ),
      skills: skillEntries,
    };
  });
  const report = {
    scope: 'operator-active-skill-migration-parity',
    generatedAt: new Date().toISOString(),
    operatorCount: entries.length,
    activeSkillCompleteOperatorCount: entries.filter(
      entry => entry.status === 'active-skills-compiled',
    ).length,
    declaredSkillCount: entries.reduce((sum, entry) => sum + entry.declaredSkillCount, 0),
    compiledSkillCount: entries.reduce((sum, entry) => sum + entry.compiledSkillCount, 0),
    formalSkillCount: entries.reduce((sum, entry) => sum + entry.formalSkillCount, 0),
    completeDefinitionCount: entries.filter(entry => entry.completeDefinitionPresent).length,
    entries,
  };
  await writeGeneratedDefinitionFiles(args.auditOutput, [
    {
      relativePath: 'operator-active-skill-migration.json',
      content: `${JSON.stringify(report, null, 2)}\n`,
    },
  ]);
  return {
    output: path.resolve(args.auditOutput, 'operator-active-skill-migration.json'),
    operatorCount: report.operatorCount,
    activeSkillCompleteOperatorCount: report.activeSkillCompleteOperatorCount,
    declaredSkillCount: report.declaredSkillCount,
    compiledSkillCount: report.compiledSkillCount,
    formalSkillCount: report.formalSkillCount,
    completeDefinitionCount: report.completeDefinitionCount,
  };
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const values = new Map<string, string>();
  const allowed = new Set([
    '--manifest',
    '--source-root',
    '--skill-patch-table',
    '--buff-data-root',
    '--ability-entity-catalog',
    '--projectile-blackboard-catalog',
    '--gameplay-tag-catalog',
    '--time-dilation-catalog',
    '--legacy-generated-root',
    '--formal-active-skill-root',
    '--audit-output',
  ]);
  for (let index = 2; index < process.argv.length; index++) {
    const flag = process.argv[index]!;
    if (!allowed.has(flag)) throw new Error(`unsupported argument ${flag}`);
    if (values.has(flag)) throw new Error(`duplicate argument ${flag}`);
    const value = process.argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${flag}`);
    values.set(flag, value);
  }
  const required = (flag: string) => {
    const value = values.get(flag);
    if (!value) throw new Error(`missing ${flag}`);
    return value;
  };
  console.log(
    await auditOperatorActiveSkillMigration({
      manifest: required('--manifest'),
      sourceRoot: required('--source-root'),
      skillPatchTable: required('--skill-patch-table'),
      buffDataRoot: required('--buff-data-root'),
      abilityEntityCatalog: required('--ability-entity-catalog'),
      projectileBlackboardCatalog: required('--projectile-blackboard-catalog'),
      gameplayTagCatalog: required('--gameplay-tag-catalog'),
      timeDilationCatalog: required('--time-dilation-catalog'),
      legacyGeneratedRoot: required('--legacy-generated-root'),
      formalActiveSkillRoot: required('--formal-active-skill-root'),
      auditOutput: required('--audit-output'),
    }),
  );
}
